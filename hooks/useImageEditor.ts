"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { EditorState, Point } from "@/types"

const MAX_HISTORY = 30 // 最大历史记录数

const INITIAL_STATE: EditorState = {
  image: null,
  originalImage: null,
  processedImageData: null,
  zoom: 1,
  pan: { x: 0, y: 0 },
  brushSize: 30,
  isDrawing: false,
  isProcessing: false,
  showComparison: false,
  comparisonPosition: 50,
  imageHistory: [],
  historyIndex: -1,
}

export function useImageEditor(imageFile: File | null) {
  const [state, setState] = useState<EditorState>(INITIAL_STATE)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  
  // 保存适合视口的基准缩放值
  const fitZoomRef = useRef<number>(1)

  // 加载图片
  useEffect(() => {
    if (!imageFile) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setState((prev) => ({
          ...prev,
          image: img,
          originalImage: img, // 保存原始图片用于对比
          imageHistory: [img], // 初始化历史记录，原图是第一个
          historyIndex: 0,
        }))
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(imageFile)

    // cleanup：当组件卸载或 imageFile 变化时重置状态
    return () => {
      setState(INITIAL_STATE)
    }
  }, [imageFile])

  // 保存图像到历史记录（每次生成后调用）
  const saveImageToHistory = useCallback((newImage: HTMLImageElement) => {
    setState((prev) => {
      // 如果当前不在历史记录的末尾，截断后面的记录
      const newHistory = prev.imageHistory.slice(0, prev.historyIndex + 1)
      
      // 添加新的图像
      newHistory.push(newImage)
      
      // 限制历史记录数量（但始终保留原图）
      while (newHistory.length > MAX_HISTORY && newHistory.length > 1) {
        newHistory.splice(1, 1) // 删除第二个元素，保留原图
      }

      return {
        ...prev,
        image: newImage,
        processedImageData: null, // 清除处理结果，因为已经应用到图像上了
        imageHistory: newHistory,
        historyIndex: newHistory.length - 1,
      }
    })
  }, [])

  // 撤回 - 回到上一次的图像状态
  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.historyIndex <= 0) return prev

      const newIndex = prev.historyIndex - 1
      const prevImage = prev.imageHistory[newIndex]

      // 清除蒙版
      const maskCanvas = maskCanvasRef.current
      if (maskCanvas) {
        const ctx = maskCanvas.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height)
        }
      }

      return {
        ...prev,
        image: prevImage,
        processedImageData: null, // 清除处理结果
        historyIndex: newIndex,
      }
    })
  }, [])

  // 取消撤回 - 前进到下一次的图像状态
  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.historyIndex >= prev.imageHistory.length - 1) return prev

      const newIndex = prev.historyIndex + 1
      const nextImage = prev.imageHistory[newIndex]

      // 清除蒙版
      const maskCanvas = maskCanvasRef.current
      if (maskCanvas) {
        const ctx = maskCanvas.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height)
        }
      }

      return {
        ...prev,
        image: nextImage,
        processedImageData: null, // 清除处理结果
        historyIndex: newIndex,
      }
    })
  }, [])

  // 检查是否可以撤回（historyIndex > 0 表示不是原图）
  const canUndo = state.historyIndex > 0

  // 检查是否可以取消撤回
  const canRedo = state.historyIndex < state.imageHistory.length - 1

  // 设置缩放
  const setZoom = useCallback((zoom: number) => {
    const fitZoom = fitZoomRef.current
    // 最小缩放为 fitZoom 的 25%，最大缩放为 fitZoom 的 400%
    const minZoom = fitZoom * 0.25
    const maxZoom = fitZoom * 4
    setState((prev) => ({
      ...prev,
      zoom: Math.max(minZoom, Math.min(maxZoom, zoom)),
    }))
  }, [])

  // 计算适合视口的缩放值（100%视口下图片不超出可视区域）
  const calculateFitZoom = useCallback((
    imageWidth: number,
    imageHeight: number,
    containerWidth: number,
    containerHeight: number,
    padding: number = 48 // 留出一些边距
  ): number => {
    const availableWidth = containerWidth - padding * 2
    const availableHeight = containerHeight - padding * 2
    
    const scaleX = availableWidth / imageWidth
    const scaleY = availableHeight / imageHeight
    
    // 取较小的缩放比例，确保图片完全适应容器
    // 但不超过 1（即不放大小图）
    return Math.min(scaleX, scaleY, 1)
  }, [])

  // 初始化适合视口的缩放（在图片加载后调用）
  const initializeFitZoom = useCallback(() => {
    const container = containerRef.current
    const image = state.image
    
    if (!container || !image) return
    
    const containerRect = container.getBoundingClientRect()
    const fitZoom = calculateFitZoom(
      image.width,
      image.height,
      containerRect.width,
      containerRect.height
    )
    
    fitZoomRef.current = fitZoom
    
    // 设置初始缩放和平移
    setState((prev) => ({
      ...prev,
      zoom: fitZoom,
      pan: { x: 0, y: 0 },
    }))
  }, [state.image, calculateFitZoom])

  // 重置到适合视口的缩放
  const resetToFitZoom = useCallback(() => {
    setState((prev) => ({
      ...prev,
      zoom: fitZoomRef.current,
      pan: { x: 0, y: 0 },
    }))
  }, [])

  // 获取当前的 fitZoom 值
  const getFitZoom = useCallback(() => fitZoomRef.current, [])

  // 设置平移
  const setPan = useCallback((pan: { x: number; y: number }) => {
    setState((prev) => ({
      ...prev,
      pan,
    }))
  }, [])

  // 设置笔刷大小
  const setBrushSize = useCallback((size: number) => {
    setState((prev) => ({
      ...prev,
      brushSize: Math.max(5, Math.min(100, size)),
    }))
  }, [])

  // 开始绘制
  const startDrawing = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isDrawing: true,
    }))
  }, [])

  // 停止绘制
  const stopDrawing = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isDrawing: false,
    }))
  }, [])

  // 设置处理状态
  const setIsProcessing = useCallback((isProcessing: boolean) => {
    setState((prev) => ({
      ...prev,
      isProcessing,
    }))
  }, [])

  // 设置处理后的图片数据
  const setProcessedImageData = useCallback((data: ImageData | null) => {
    setState((prev) => ({
      ...prev,
      processedImageData: data,
    }))
  }, [])

  // 将处理后的 ImageData 更新为当前工作图像（用于连续编辑）
  const applyProcessedImage = useCallback((imageData: ImageData, onComplete?: () => void) => {
    // 创建临时画布将 ImageData 转换为图片
    const tempCanvas = document.createElement("canvas")
    tempCanvas.width = imageData.width
    tempCanvas.height = imageData.height
    const tempCtx = tempCanvas.getContext("2d")
    if (!tempCtx) return

    tempCtx.putImageData(imageData, 0, 0)
    
    // 从画布获取数据 URL 并创建新的 Image
    const dataUrl = tempCanvas.toDataURL("image/png")
    const img = new Image()
    img.onload = () => {
      // 保存新图像到历史记录
      saveImageToHistory(img)
      
      // 清除蒙版画布
      const maskCanvas = maskCanvasRef.current
      if (maskCanvas) {
        const ctx = maskCanvas.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height)
        }
      }
      onComplete?.()
    }
    img.src = dataUrl
  }, [saveImageToHistory])

  // 切换对比模式
  const toggleComparison = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showComparison: !prev.showComparison,
    }))
  }, [])

  // 设置对比位置
  const setComparisonPosition = useCallback((position: number) => {
    setState((prev) => ({
      ...prev,
      comparisonPosition: Math.max(0, Math.min(100, position)),
    }))
  }, [])

  // 重置编辑器 - 回到原图状态
  const reset = useCallback(() => {
    setState((prev) => {
      const originalImage = prev.originalImage
      return {
        ...INITIAL_STATE,
        image: originalImage,
        originalImage: originalImage,
        imageHistory: originalImage ? [originalImage] : [],
        historyIndex: originalImage ? 0 : -1,
      }
    })
    // 清除蒙版画布
    const maskCanvas = maskCanvasRef.current
    if (maskCanvas) {
      const ctx = maskCanvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height)
      }
    }
  }, [])

  // 在蒙版上绘制
  const drawOnMask = useCallback((point: Point) => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas) return

    const ctx = maskCanvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.arc(point.x, point.y, state.brushSize / 2, 0, Math.PI * 2)
    ctx.fill()
  }, [state.brushSize])

  // 连续绘制（绘制线段）
  const drawLine = useCallback((from: Point, to: Point) => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas) return

    const ctx = maskCanvas.getContext("2d")
    if (!ctx) return

    ctx.strokeStyle = "white"
    ctx.lineWidth = state.brushSize
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
  }, [state.brushSize])

  // 清除蒙版
  const clearMask = useCallback(() => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas) return

    const ctx = maskCanvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height)
  }, [])

  // 获取蒙版数据
  const getMaskData = useCallback((): ImageData | null => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas) return null

    const ctx = maskCanvas.getContext("2d")
    if (!ctx) return null

    return ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)
  }, [])

  return {
    state,
    canvasRef,
    maskCanvasRef,
    containerRef,
    setZoom,
    setPan,
    setBrushSize,
    startDrawing,
    stopDrawing,
    setIsProcessing,
    setProcessedImageData,
    applyProcessedImage,
    toggleComparison,
    setComparisonPosition,
    reset,
    drawOnMask,
    drawLine,
    clearMask,
    getMaskData,
    undo,
    redo,
    canUndo,
    canRedo,
    initializeFitZoom,
    resetToFitZoom,
    getFitZoom,
  }
}
