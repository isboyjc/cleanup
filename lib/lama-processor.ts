"use client"

import * as ort from "onnxruntime-web"

// 配置 ONNX Runtime（仅在客户端执行）
if (typeof window !== "undefined") {
  ort.env.wasm.numThreads = navigator.hardwareConcurrency || 4
  ort.env.wasm.simd = true
  // 减少日志输出
  ort.env.logLevel = "error"
}

// 模型 CDN 地址（R2 已配置 CORS）
const MODEL_URL = "https://cdn.isboyjc.com/models/lama/lama_fp32.onnx"
const CACHE_NAME = "lama-model-cache-v1"
const MAX_SIZE = 512 // LaMa 模型推荐的最大尺寸

let session: ort.InferenceSession | null = null
let isLoading = false
let loadingCallbacks: ((progress: number) => void)[] = []

// 从缓存获取模型或下载
async function getModelFromCacheOrDownload(
  onProgress?: (progress: number) => void
): Promise<ArrayBuffer> {
  // 使用 CDN URL 作为缓存键
  const cacheKey = MODEL_URL
  
  // 检查浏览器是否支持 Cache API
  if ("caches" in window) {
    try {
      const cache = await caches.open(CACHE_NAME)
      const cachedResponse = await cache.match(cacheKey)

      if (cachedResponse) {
        console.log("从浏览器缓存加载模型...")
        onProgress?.(0.3)
        const buffer = await cachedResponse.arrayBuffer()
        onProgress?.(0.8)
        return buffer
      }
    } catch (e) {
      console.warn("缓存读取失败，将从 CDN 下载:", e)
    }
  }

  // 通过代理从 CDN 下载模型
  console.log("从 CDN 下载模型...")
  onProgress?.(0.1)

  const response = await fetch(MODEL_URL)
  if (!response.ok) {
    throw new Error(`模型下载失败: ${response.status} ${response.statusText}`)
  }

  // 获取文件大小用于进度计算
  const contentLength = response.headers.get("content-length")
  const total = contentLength ? parseInt(contentLength, 10) : 0

  // 读取响应流并计算进度
  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error("无法读取响应流")
  }

  const chunks: Uint8Array[] = []
  let received = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    chunks.push(value)
    received += value.length

    if (total > 0) {
      // 下载进度占 10% - 70%
      const downloadProgress = 0.1 + (received / total) * 0.6
      onProgress?.(downloadProgress)
    }
  }

  // 合并所有块
  const buffer = new Uint8Array(received)
  let position = 0
  for (const chunk of chunks) {
    buffer.set(chunk, position)
    position += chunk.length
  }

  onProgress?.(0.75)

  // 缓存模型到浏览器（使用 CDN URL 作为缓存键）
  if ("caches" in window) {
    try {
      const cache = await caches.open(CACHE_NAME)
      const responseToCache = new Response(buffer.buffer, {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Length": String(received),
        },
      })
      await cache.put(cacheKey, responseToCache)
      console.log("模型已缓存到浏览器")
    } catch (e) {
      console.warn("缓存写入失败:", e)
    }
  }

  onProgress?.(0.8)
  return buffer.buffer
}

// 加载模型
export async function loadModel(
  onProgress?: (progress: number) => void
): Promise<ort.InferenceSession> {
  if (session) {
    return session
  }

  if (isLoading) {
    // 如果正在加载，添加回调
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (session) {
          clearInterval(checkInterval)
          resolve(session)
        }
      }, 100)

      if (onProgress) {
        loadingCallbacks.push(onProgress)
      }

      // 超时处理
      setTimeout(() => {
        clearInterval(checkInterval)
        reject(new Error("模型加载超时"))
      }, 300000) // 5分钟超时（大文件下载）
    })
  }

  isLoading = true

  try {
    // 通知进度
    const notifyProgress = (progress: number) => {
      onProgress?.(progress)
      loadingCallbacks.forEach((cb) => cb(progress))
    }

    notifyProgress(0.05)

    // 从缓存或 CDN 获取模型
    const modelBuffer = await getModelFromCacheOrDownload(notifyProgress)

    notifyProgress(0.85)

    // 创建推理会话
    session = await ort.InferenceSession.create(modelBuffer, {
      executionProviders: ["webgl", "wasm"],
      graphOptimizationLevel: "all",
    })

    // 打印模型信息用于调试
    console.log("模型输入名称:", session.inputNames)
    console.log("模型输出名称:", session.outputNames)

    notifyProgress(1)
    loadingCallbacks = []

    return session
  } catch (error) {
    console.error("加载 LaMa 模型失败:", error)
    throw error
  } finally {
    isLoading = false
  }
}

// 预处理信息接口
interface PreprocessInfo {
  imageTensor: ort.Tensor
  maskTensor: ort.Tensor
  scale: number
  originalSize: { width: number; height: number }
  scaledSize: { width: number; height: number }
}

// 预处理图片 - LaMa 模型需要固定 512x512 输入
function preprocessImage(
  image: HTMLImageElement,
  mask: ImageData
): PreprocessInfo {
  const originalSize = { width: image.width, height: image.height }
  
  // 计算缩放比例，使图片适应 512x512，保持宽高比
  const scale = Math.min(MAX_SIZE / image.width, MAX_SIZE / image.height, 1)
  const scaledWidth = Math.round(image.width * scale)
  const scaledHeight = Math.round(image.height * scale)
  const scaledSize = { width: scaledWidth, height: scaledHeight }

  // 创建 512x512 画布，用黑色填充
  const canvas = document.createElement("canvas")
  canvas.width = MAX_SIZE
  canvas.height = MAX_SIZE
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#000000"
  ctx.fillRect(0, 0, MAX_SIZE, MAX_SIZE)

  // 将缩放后的图片绘制到左上角
  ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight)
  const imageData = ctx.getImageData(0, 0, MAX_SIZE, MAX_SIZE)

  // 处理蒙版 - 同样填充到 512x512
  const maskCanvas = document.createElement("canvas")
  maskCanvas.width = MAX_SIZE
  maskCanvas.height = MAX_SIZE
  const maskCtx = maskCanvas.getContext("2d")!
  // 用黑色填充（表示不需要修复的区域）
  maskCtx.fillStyle = "#000000"
  maskCtx.fillRect(0, 0, MAX_SIZE, MAX_SIZE)
  
  // 先将原始蒙版绘制到临时画布
  const tempMaskCanvas = document.createElement("canvas")
  tempMaskCanvas.width = mask.width
  tempMaskCanvas.height = mask.height
  const tempMaskCtx = tempMaskCanvas.getContext("2d")!
  tempMaskCtx.putImageData(mask, 0, 0)
  
  // 缩放蒙版并绘制到左上角
  maskCtx.drawImage(tempMaskCanvas, 0, 0, scaledWidth, scaledHeight)
  const scaledMask = maskCtx.getImageData(0, 0, MAX_SIZE, MAX_SIZE)

  // 转换为模型输入格式 [1, 3, 512, 512]
  const imageArray = new Float32Array(3 * MAX_SIZE * MAX_SIZE)
  const maskArray = new Float32Array(1 * MAX_SIZE * MAX_SIZE)

  for (let y = 0; y < MAX_SIZE; y++) {
    for (let x = 0; x < MAX_SIZE; x++) {
      const idx = y * MAX_SIZE + x
      const pixelIdx = idx * 4

      // 图片: 归一化到 [0, 1]
      imageArray[idx] = imageData.data[pixelIdx] / 255 // R
      imageArray[MAX_SIZE * MAX_SIZE + idx] = imageData.data[pixelIdx + 1] / 255 // G
      imageArray[2 * MAX_SIZE * MAX_SIZE + idx] = imageData.data[pixelIdx + 2] / 255 // B

      // 蒙版: 将白色区域转换为 1，其他为 0
      maskArray[idx] = scaledMask.data[pixelIdx] > 128 ? 1 : 0
    }
  }

  const imageTensor = new ort.Tensor("float32", imageArray, [1, 3, MAX_SIZE, MAX_SIZE])
  const maskTensor = new ort.Tensor("float32", maskArray, [1, 1, MAX_SIZE, MAX_SIZE])

  return { imageTensor, maskTensor, scale, originalSize, scaledSize }
}

// 后处理输出 - 从 512x512 输出中裁剪并放大回原始尺寸
function postprocessOutput(
  output: ort.Tensor,
  preprocessInfo: PreprocessInfo
): ImageData {
  const outputData = output.data as Float32Array
  const [, , height, width] = output.dims
  const { scaledSize } = preprocessInfo

  // 自动检测输出值范围（0-1 或 0-255）
  let maxVal = 0
  const sampleSize = Math.min(1000, outputData.length / 3)
  for (let i = 0; i < sampleSize; i++) {
    maxVal = Math.max(maxVal, Math.abs(outputData[i]))
  }
  const isNormalized = maxVal <= 2.0  // 如果最大值 <= 2，假设是 [0, 1] 范围
  console.log("输出值范围检测:", { maxVal, isNormalized })

  // 创建 512x512 画布存放输出
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")!
  const imageData = ctx.createImageData(width, height)

  // 转换输出为图片数据
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      const pixelIdx = idx * 4

      // 从 [1, 3, H, W] 格式转换
      let r = outputData[idx]
      let g = outputData[height * width + idx]
      let b = outputData[2 * height * width + idx]
      
      // 如果是归一化的，转换到 0-255
      if (isNormalized) {
        r *= 255
        g *= 255
        b *= 255
      }
      
      imageData.data[pixelIdx] = Math.max(0, Math.min(255, Math.round(r)))
      imageData.data[pixelIdx + 1] = Math.max(0, Math.min(255, Math.round(g)))
      imageData.data[pixelIdx + 2] = Math.max(0, Math.min(255, Math.round(b)))
      imageData.data[pixelIdx + 3] = 255
    }
  }

  ctx.putImageData(imageData, 0, 0)

  // 裁剪出有效区域（scaledSize）
  const croppedCanvas = document.createElement("canvas")
  croppedCanvas.width = scaledSize.width
  croppedCanvas.height = scaledSize.height
  const croppedCtx = croppedCanvas.getContext("2d")!
  croppedCtx.drawImage(canvas, 0, 0, scaledSize.width, scaledSize.height, 0, 0, scaledSize.width, scaledSize.height)

  return croppedCtx.getImageData(0, 0, scaledSize.width, scaledSize.height)
}

// 处理图片
export async function processImage(
  image: HTMLImageElement,
  mask: ImageData,
  onProgress?: (progress: number) => void
): Promise<ImageData> {
  // 确保模型已加载
  const modelSession = await loadModel(onProgress)

  // 预处理
  const preprocessInfo = preprocessImage(image, mask)
  const { imageTensor, maskTensor, originalSize, scaledSize } = preprocessInfo

  // 推理
  const feeds: Record<string, ort.Tensor> = {
    image: imageTensor,
    mask: maskTensor,
  }

  const results = await modelSession.run(feeds)
  
  // 获取输出（输出名称可能因模型而异）
  const outputName = modelSession.outputNames[0]
  const output = results[outputName]

  // 调试：打印输出信息
  const outputData = output.data as Float32Array
  let min = Infinity, max = -Infinity
  for (let i = 0; i < Math.min(outputData.length, 10000); i++) {
    if (outputData[i] < min) min = outputData[i]
    if (outputData[i] > max) max = outputData[i]
  }
  console.log("输出数据范围:", { min, max, dims: output.dims })

  // 后处理：获取模型输出的图像
  const processedImageData = postprocessOutput(output, preprocessInfo)

  // 关键：将处理结果与原图融合，只在蒙版区域替换
  return composeFinalImage(image, mask, processedImageData, originalSize, scaledSize)
}

// 融合最终图像：只在蒙版区域使用处理后的像素，其他区域保持原图
function composeFinalImage(
  originalImage: HTMLImageElement,
  originalMask: ImageData,
  processedImageData: ImageData,
  originalSize: { width: number; height: number },
  scaledSize: { width: number; height: number }
): ImageData {
  // 创建最终画布（原始尺寸）
  const finalCanvas = document.createElement("canvas")
  finalCanvas.width = originalSize.width
  finalCanvas.height = originalSize.height
  const finalCtx = finalCanvas.getContext("2d")!

  // 首先绘制原始图像作为基底
  finalCtx.drawImage(originalImage, 0, 0)

  // 创建处理后图像的画布，并放大到原始尺寸
  const processedCanvas = document.createElement("canvas")
  processedCanvas.width = scaledSize.width
  processedCanvas.height = scaledSize.height
  const processedCtx = processedCanvas.getContext("2d")!
  processedCtx.putImageData(processedImageData, 0, 0)

  // 放大处理后的图像到原始尺寸
  const scaledProcessedCanvas = document.createElement("canvas")
  scaledProcessedCanvas.width = originalSize.width
  scaledProcessedCanvas.height = originalSize.height
  const scaledProcessedCtx = scaledProcessedCanvas.getContext("2d")!
  scaledProcessedCtx.drawImage(
    processedCanvas,
    0, 0, scaledSize.width, scaledSize.height,
    0, 0, originalSize.width, originalSize.height
  )
  const scaledProcessedData = scaledProcessedCtx.getImageData(0, 0, originalSize.width, originalSize.height)

  // 获取最终图像数据
  const finalImageData = finalCtx.getImageData(0, 0, originalSize.width, originalSize.height)

  // 遍历蒙版，只在蒙版区域（白色区域）使用处理后的像素
  for (let y = 0; y < originalSize.height; y++) {
    for (let x = 0; x < originalSize.width; x++) {
      const idx = (y * originalSize.width + x) * 4
      const maskIdx = (y * originalMask.width + x) * 4
      
      // 检查蒙版是否为白色（需要修复的区域）
      // 蒙版的红色通道 > 128 表示需要修复
      if (originalMask.data[maskIdx] > 128) {
        // 使用处理后的像素
        finalImageData.data[idx] = scaledProcessedData.data[idx]
        finalImageData.data[idx + 1] = scaledProcessedData.data[idx + 1]
        finalImageData.data[idx + 2] = scaledProcessedData.data[idx + 2]
        finalImageData.data[idx + 3] = 255
      }
      // 否则保持原图像素（已经在 finalImageData 中了）
    }
  }

  return finalImageData
}

// 检查模型是否已加载
export function isModelLoaded(): boolean {
  return session !== null
}

// 卸载模型
export function unloadModel(): void {
  session = null
}

// 清除模型缓存
export async function clearModelCache(): Promise<void> {
  if ("caches" in window) {
    try {
      await caches.delete(CACHE_NAME)
      console.log("模型缓存已清除")
    } catch (e) {
      console.warn("清除缓存失败:", e)
    }
  }
}
