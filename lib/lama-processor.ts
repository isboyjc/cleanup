"use client"

// Worker 实例
let worker: Worker | null = null
let isWorkerLoading = false
let isModelLoadedInWorker = false

// 回调队列
type ProgressCallback = (progress: number) => void

let loadingCallbacks: ProgressCallback[] = []
let loadResolvers: Array<{ resolve: () => void; reject: (error: Error) => void }> = []
let processResolver: { resolve: (result: ImageData) => void; reject: (error: Error) => void } | null = null

// 初始化 Worker
function initWorker(): Worker {
  if (worker) return worker

  // 动态创建 Worker（使用内联方式避免路径问题）
  worker = new Worker(new URL("./lama-worker.ts", import.meta.url), { type: "module" })

  worker.onmessage = (event) => {
    const { type } = event.data

    switch (type) {
      case "modelProgress":
        const progress = event.data.progress as number
        loadingCallbacks.forEach((cb) => cb(progress))
        break

      case "modelLoaded":
        isModelLoadedInWorker = true
        isWorkerLoading = false
        loadingCallbacks = []
        loadResolvers.forEach(({ resolve }) => resolve())
        loadResolvers = []
        break

      case "modelError":
        isWorkerLoading = false
        const loadError = new Error(event.data.error)
        loadResolvers.forEach(({ reject }) => reject(loadError))
        loadResolvers = []
        break

      case "processResult":
        if (processResolver) {
          processResolver.resolve(event.data.imageData)
          processResolver = null
        }
        break

      case "processError":
        if (processResolver) {
          processResolver.reject(new Error(event.data.error))
          processResolver = null
        }
        break
    }
  }

  worker.onerror = (error) => {
    console.error("[Lama] Worker 错误:", error)
    if (processResolver) {
      processResolver.reject(new Error("Worker 执行错误"))
      processResolver = null
    }
  }

  return worker
}

// 加载模型
export async function loadModel(
  onProgress?: (progress: number) => void
): Promise<void> {
  // 如果模型已加载
  if (isModelLoadedInWorker) {
    onProgress?.(1)
    return
  }

  // 如果正在加载，等待
  if (isWorkerLoading) {
    return new Promise((resolve, reject) => {
      if (onProgress) loadingCallbacks.push(onProgress)
      loadResolvers.push({ resolve, reject })
    })
  }

  isWorkerLoading = true
  if (onProgress) loadingCallbacks.push(onProgress)

  const w = initWorker()

  return new Promise((resolve, reject) => {
    loadResolvers.push({ resolve, reject })
    w.postMessage({ type: "loadModel" })
  })
}

// 处理图片
export async function processImage(
  image: HTMLImageElement,
  mask: ImageData,
  onProgress?: (progress: number) => void
): Promise<ImageData> {
  // 确保模型已加载
  if (!isModelLoadedInWorker) {
    await loadModel(onProgress)
  }

  const w = initWorker()

  // 将 HTMLImageElement 转换为 ImageData
  const canvas = document.createElement("canvas")
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext("2d")!
  ctx.drawImage(image, 0, 0)
  const imageData = ctx.getImageData(0, 0, image.width, image.height)

  return new Promise((resolve, reject) => {
    processResolver = { resolve, reject }
    w.postMessage({
      type: "process",
      imageData,
      maskData: mask,
    })
  })
}

// 检查模型是否已加载
export function isModelLoaded(): boolean {
  return isModelLoadedInWorker
}

// 检查模型缓存是否存在
export async function isModelCached(): Promise<boolean> {
  const MODEL_URL = "https://cdn.isboyjc.com/models/lama/lama_fp32.onnx"
  const CACHE_NAME = "lama-model-cache-v1"
  
  if (typeof window === "undefined" || !("caches" in window)) {
    return false
  }
  
  try {
    const cache = await caches.open(CACHE_NAME)
    const cachedResponse = await cache.match(MODEL_URL)
    return cachedResponse !== undefined
  } catch (e) {
    console.warn("检查缓存失败:", e)
    return false
  }
}
