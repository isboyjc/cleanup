"use client"

import { useState, useCallback, useEffect } from "react"
import { loadModel, processImage as processLamaImage, isModelLoaded } from "@/lib/lama-processor"

export function useLamaModel() {
  // 初始化时检查模型是否已加载
  const [isModelLoading, setIsModelLoading] = useState(() => !isModelLoaded())
  const [loadingProgress, setLoadingProgress] = useState(() => isModelLoaded() ? 1 : 0)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(() => isModelLoaded())

  // 预加载模型
  const preloadModel = useCallback(async () => {
    if (isModelLoaded()) {
      setIsReady(true)
      setIsModelLoading(false)
      setLoadingProgress(1)
      return
    }

    setIsModelLoading(true)
    setError(null)

    try {
      await loadModel((progress) => {
        setLoadingProgress(progress)
      })
      setIsReady(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : "模型加载失败"
      setError(message)
      console.error("模型加载失败:", err)
    } finally {
      setIsModelLoading(false)
    }
  }, [])

  // 组件挂载时预加载模型
  useEffect(() => {
    preloadModel()
  }, [preloadModel])

  // 处理图片
  const processImage = useCallback(async (
    image: HTMLImageElement,
    mask: ImageData
  ): Promise<ImageData | null> => {
    // 如果模型未加载，先加载
    if (!isModelLoaded()) {
      setIsModelLoading(true)
      try {
        await loadModel((progress) => {
          setLoadingProgress(progress)
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : "模型加载失败"
        setError(message)
        setIsModelLoading(false)
        return null
      }
      setIsModelLoading(false)
    }

    try {
      const result = await processLamaImage(image, mask)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : "图片处理失败"
      setError(message)
      console.error("图片处理失败:", err)
      return null
    }
  }, [])

  return {
    isModelLoading,
    loadingProgress,
    error,
    isReady,
    preloadModel,
    processImage,
  }
}

