/// <reference lib="webworker" />

import * as ort from "onnxruntime-web"

// Worker 内部配置
ort.env.wasm.numThreads = 1 // Worker 中使用单线程避免嵌套问题
ort.env.wasm.simd = true
ort.env.logLevel = "error"
// 设置 WASM 文件路径（从 CDN 加载）
ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.23.2/dist/"

const MODEL_URL = "https://cdn.isboyjc.com/models/lama/lama_fp32.onnx"
const CACHE_NAME = "lama-model-cache-v1"
const MAX_SIZE = 512

let session: ort.InferenceSession | null = null

// 消息类型定义
type WorkerMessage = 
  | { type: "loadModel" }
  | { type: "process"; imageData: ImageData; maskData: ImageData }

type WorkerResponse =
  | { type: "modelLoaded" }
  | { type: "modelProgress"; progress: number }
  | { type: "modelError"; error: string }
  | { type: "processResult"; imageData: ImageData }
  | { type: "processError"; error: string }

// 发送消息给主线程
function postResponse(response: WorkerResponse) {
  self.postMessage(response)
}

// 从缓存或网络加载模型
async function getModelBuffer(onProgress: (progress: number) => void): Promise<ArrayBuffer> {
  // 检查缓存
  if ("caches" in self) {
    try {
      const cache = await caches.open(CACHE_NAME)
      const cachedResponse = await cache.match(MODEL_URL)
      if (cachedResponse) {
        console.log("[Worker] 从缓存加载模型")
        onProgress(0.3)
        const buffer = await cachedResponse.arrayBuffer()
        onProgress(0.8)
        return buffer
      }
    } catch (e) {
      console.warn("[Worker] 缓存读取失败:", e)
    }
  }

  // 从网络下载
  console.log("[Worker] 从网络下载模型")
  onProgress(0.1)

  const response = await fetch(MODEL_URL)
  if (!response.ok) {
    throw new Error(`模型下载失败: ${response.status}`)
  }

  const contentLength = response.headers.get("content-length")
  const total = contentLength ? parseInt(contentLength, 10) : 0
  const reader = response.body?.getReader()
  if (!reader) throw new Error("无法读取响应流")

  const chunks: Uint8Array[] = []
  let received = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    received += value.length
    if (total > 0) {
      onProgress(0.1 + (received / total) * 0.6)
    }
  }

  const buffer = new Uint8Array(received)
  let position = 0
  for (const chunk of chunks) {
    buffer.set(chunk, position)
    position += chunk.length
  }

  onProgress(0.75)

  // 缓存模型
  if ("caches" in self) {
    try {
      const cache = await caches.open(CACHE_NAME)
      await cache.put(MODEL_URL, new Response(buffer.buffer))
      console.log("[Worker] 模型已缓存")
    } catch (e) {
      console.warn("[Worker] 缓存写入失败:", e)
    }
  }

  onProgress(0.8)
  return buffer.buffer
}

// 加载模型
async function loadModel() {
  if (session) {
    postResponse({ type: "modelLoaded" })
    return
  }

  try {
    const modelBuffer = await getModelBuffer((progress) => {
      postResponse({ type: "modelProgress", progress })
    })

    postResponse({ type: "modelProgress", progress: 0.85 })

    session = await ort.InferenceSession.create(modelBuffer, {
      executionProviders: ["wasm"], // Worker 中只使用 WASM
      graphOptimizationLevel: "all",
    })

    console.log("[Worker] 模型加载完成")
    postResponse({ type: "modelProgress", progress: 1 })
    postResponse({ type: "modelLoaded" })
  } catch (error) {
    const message = error instanceof Error ? error.message : "模型加载失败"
    postResponse({ type: "modelError", error: message })
  }
}

// 预处理图像
function preprocessImage(imageData: ImageData, maskData: ImageData) {
  const originalSize = { width: imageData.width, height: imageData.height }
  const scale = Math.min(MAX_SIZE / imageData.width, MAX_SIZE / imageData.height, 1)
  const scaledWidth = Math.round(imageData.width * scale)
  const scaledHeight = Math.round(imageData.height * scale)
  const scaledSize = { width: scaledWidth, height: scaledHeight }

  // 创建 OffscreenCanvas 进行图像处理
  const canvas = new OffscreenCanvas(MAX_SIZE, MAX_SIZE)
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#000000"
  ctx.fillRect(0, 0, MAX_SIZE, MAX_SIZE)

  // 绘制缩放后的图像
  const tempCanvas = new OffscreenCanvas(imageData.width, imageData.height)
  const tempCtx = tempCanvas.getContext("2d")!
  tempCtx.putImageData(imageData, 0, 0)
  ctx.drawImage(tempCanvas, 0, 0, scaledWidth, scaledHeight)
  const scaledImageData = ctx.getImageData(0, 0, MAX_SIZE, MAX_SIZE)

  // 处理蒙版
  const maskCanvas = new OffscreenCanvas(MAX_SIZE, MAX_SIZE)
  const maskCtx = maskCanvas.getContext("2d")!
  maskCtx.fillStyle = "#000000"
  maskCtx.fillRect(0, 0, MAX_SIZE, MAX_SIZE)

  const tempMaskCanvas = new OffscreenCanvas(maskData.width, maskData.height)
  const tempMaskCtx = tempMaskCanvas.getContext("2d")!
  tempMaskCtx.putImageData(maskData, 0, 0)
  maskCtx.drawImage(tempMaskCanvas, 0, 0, scaledWidth, scaledHeight)
  const scaledMask = maskCtx.getImageData(0, 0, MAX_SIZE, MAX_SIZE)

  // 转换为张量
  const imageArray = new Float32Array(3 * MAX_SIZE * MAX_SIZE)
  const maskArray = new Float32Array(1 * MAX_SIZE * MAX_SIZE)

  for (let i = 0; i < MAX_SIZE * MAX_SIZE; i++) {
    const pixelIdx = i * 4
    imageArray[i] = scaledImageData.data[pixelIdx] / 255
    imageArray[MAX_SIZE * MAX_SIZE + i] = scaledImageData.data[pixelIdx + 1] / 255
    imageArray[2 * MAX_SIZE * MAX_SIZE + i] = scaledImageData.data[pixelIdx + 2] / 255
    maskArray[i] = scaledMask.data[pixelIdx] > 128 ? 1 : 0
  }

  return {
    imageTensor: new ort.Tensor("float32", imageArray, [1, 3, MAX_SIZE, MAX_SIZE]),
    maskTensor: new ort.Tensor("float32", maskArray, [1, 1, MAX_SIZE, MAX_SIZE]),
    scale,
    originalSize,
    scaledSize,
  }
}

// 后处理输出
function postprocessOutput(
  output: ort.Tensor,
  scaledSize: { width: number; height: number }
): ImageData {
  const outputData = output.data as Float32Array
  const [, , height, width] = output.dims

  // 检测值范围
  let maxVal = 0
  for (let i = 0; i < Math.min(1000, outputData.length / 3); i++) {
    maxVal = Math.max(maxVal, Math.abs(outputData[i]))
  }
  const isNormalized = maxVal <= 2.0

  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext("2d")!
  const imageData = ctx.createImageData(width, height)

  for (let i = 0; i < width * height; i++) {
    const pixelIdx = i * 4
    let r = outputData[i]
    let g = outputData[height * width + i]
    let b = outputData[2 * height * width + i]

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

  ctx.putImageData(imageData, 0, 0)

  // 裁剪有效区域
  const croppedCanvas = new OffscreenCanvas(scaledSize.width, scaledSize.height)
  const croppedCtx = croppedCanvas.getContext("2d")!
  croppedCtx.drawImage(canvas, 0, 0, scaledSize.width, scaledSize.height, 0, 0, scaledSize.width, scaledSize.height)

  return croppedCtx.getImageData(0, 0, scaledSize.width, scaledSize.height)
}

// 融合最终图像
function composeFinalImage(
  originalImageData: ImageData,
  originalMask: ImageData,
  processedImageData: ImageData,
  originalSize: { width: number; height: number },
  scaledSize: { width: number; height: number }
): ImageData {
  const finalCanvas = new OffscreenCanvas(originalSize.width, originalSize.height)
  const finalCtx = finalCanvas.getContext("2d")!

  // 绘制原图
  const originalCanvas = new OffscreenCanvas(originalSize.width, originalSize.height)
  const originalCtx = originalCanvas.getContext("2d")!
  originalCtx.putImageData(originalImageData, 0, 0)
  finalCtx.drawImage(originalCanvas, 0, 0)

  // 放大处理后的图像
  const processedCanvas = new OffscreenCanvas(scaledSize.width, scaledSize.height)
  const processedCtx = processedCanvas.getContext("2d")!
  processedCtx.putImageData(processedImageData, 0, 0)

  const scaledCanvas = new OffscreenCanvas(originalSize.width, originalSize.height)
  const scaledCtx = scaledCanvas.getContext("2d")!
  scaledCtx.drawImage(processedCanvas, 0, 0, scaledSize.width, scaledSize.height, 0, 0, originalSize.width, originalSize.height)
  const scaledProcessedData = scaledCtx.getImageData(0, 0, originalSize.width, originalSize.height)

  const finalImageData = finalCtx.getImageData(0, 0, originalSize.width, originalSize.height)

  // 融合
  const totalPixels = originalSize.width * originalSize.height
  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4
    if (originalMask.data[idx] > 128) {
      finalImageData.data[idx] = scaledProcessedData.data[idx]
      finalImageData.data[idx + 1] = scaledProcessedData.data[idx + 1]
      finalImageData.data[idx + 2] = scaledProcessedData.data[idx + 2]
      finalImageData.data[idx + 3] = 255
    }
  }

  return finalImageData
}

// 处理图像
async function processImage(imageData: ImageData, maskData: ImageData) {
  if (!session) {
    postResponse({ type: "processError", error: "模型未加载" })
    return
  }

  try {
    const { imageTensor, maskTensor, originalSize, scaledSize } = preprocessImage(imageData, maskData)

    const results = await session.run({
      image: imageTensor,
      mask: maskTensor,
    })

    const output = results[session.outputNames[0]]
    const processedImageData = postprocessOutput(output, scaledSize)
    const finalImageData = composeFinalImage(imageData, maskData, processedImageData, originalSize, scaledSize)

    postResponse({ type: "processResult", imageData: finalImageData })
  } catch (error) {
    const message = error instanceof Error ? error.message : "处理失败"
    postResponse({ type: "processError", error: message })
  }
}

// 监听消息
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type } = event.data

  switch (type) {
    case "loadModel":
      await loadModel()
      break
    case "process":
      await processImage(event.data.imageData, event.data.maskData)
      break
  }
}

export {}

