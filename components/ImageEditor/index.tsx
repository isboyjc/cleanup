"use client"

import { useEffect, useCallback, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { Dialog, DialogContentFullscreen, DialogTitle } from "@/components/ui/dialog"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { useImageEditor } from "@/hooks/useImageEditor"
import { Canvas } from "./Canvas"
import { Toolbar } from "./Toolbar"
import { ToolPanel, type ToolType } from "./ToolPanel"
import { CompareSlider } from "./CompareSlider"
import { useLamaModel } from "@/hooks/useLamaModel"
import { ModelLoadingScreen } from "./ModelLoadingScreen"
import { getGeminiDetectionEnabled } from "@/hooks/useGeminiDetection"
import { detectGeminiWatermark, removeGeminiWatermark } from "@/lib/gemini-watermark"
import type { Point } from "@/types"

interface ImageEditorProps {
  image: File
  isOpen: boolean
  onClose: () => void
}

export function ImageEditor({ image, isOpen, onClose }: ImageEditorProps) {
  const {
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
  } = useImageEditor(image)

  const { processImage, isModelLoading, loadingProgress } = useLamaModel()
  const lastPointRef = useRef<Point | null>(null)
  const lastPanPointRef = useRef<Point | null>(null)
  const handleProcessRef = useRef<() => void>(() => {})
  const [currentTool, setCurrentTool] = useState<ToolType>("eraser")
  const [isPanning, setIsPanning] = useState(false)
  const [isMouseInCanvas, setIsMouseInCanvas] = useState(false)
  const [isMouseOnImage, setIsMouseOnImage] = useState(false)
  
  // Gemini 水印检测状态
  const [geminiToastState, setGeminiToastState] = useState<"detecting" | "processing" | "success" | "not-found" | "hidden">("hidden")
  const geminiCheckedRef = useRef(false)
  
  // 跟踪 fitZoom 是否已初始化（用于防止大图闪现）
  const [isFitZoomReady, setIsFitZoomReady] = useState(false)

  // Gemini 水印自动检测和处理
  useEffect(() => {
    // 确保只在图片首次加载时检测一次
    if (!state.image || geminiCheckedRef.current || !isOpen) return
    
    // 检查是否启用了 Gemini 检测
    if (!getGeminiDetectionEnabled()) {
      geminiCheckedRef.current = true
      return
    }

    const processGeminiWatermark = async () => {
      geminiCheckedRef.current = true
      setGeminiToastState("detecting")

      try {
        // 从图片创建 ImageData
        const canvas = document.createElement("canvas")
        canvas.width = state.image!.width
        canvas.height = state.image!.height
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          setGeminiToastState("hidden")
          return
        }

        ctx.drawImage(state.image!, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        // 检测 Gemini 水印
        const detectionResult = await detectGeminiWatermark(imageData)

        if (!detectionResult.exists) {
          // 未检测到水印，隐藏提示
          setGeminiToastState("hidden")
          return
        }

        // 检测到水印，开始处理
        setGeminiToastState("processing")

        // 去除水印
        const removeResult = await removeGeminiWatermark(imageData, detectionResult)

        if (removeResult.success && removeResult.imageData) {
          // 显示成功提示（一直保持显示）
          setGeminiToastState("success")
          // 将处理结果应用为新的图像（作为一个可回退的步骤）
          applyProcessedImage(removeResult.imageData)
        } else {
          // 处理失败，隐藏提示
          setGeminiToastState("hidden")
        }
      } catch (error) {
        console.error("Gemini 水印处理失败:", error)
        setGeminiToastState("hidden")
      }
    }

    // 稍微延迟执行，确保图片已完全加载
    const timer = setTimeout(processGeminiWatermark, 500)
    return () => clearTimeout(timer)
  }, [state.image, isOpen, applyProcessedImage])

  // 重置 geminiCheckedRef 当编辑器关闭时
  useEffect(() => {
    if (!isOpen) {
      geminiCheckedRef.current = false
      setGeminiToastState("hidden")
    }
  }, [isOpen])

  // 图片加载后初始化适合视口的缩放
  const fitZoomInitializedRef = useRef(false)
  useEffect(() => {
    // 只有在模型加载完成后、图片已加载、编辑器打开时才初始化
    // 因为 isModelLoading 时容器还没有渲染
    if (state.image && isOpen && !isModelLoading && !fitZoomInitializedRef.current) {
      // 使用 setTimeout 确保 DOM 已完全渲染和布局
      const timer = setTimeout(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect()
          // 确保容器有有效尺寸
          if (rect.width > 0 && rect.height > 0) {
            initializeFitZoom()
            fitZoomInitializedRef.current = true
            setIsFitZoomReady(true)
          }
        }
      }, 50)
      
      return () => clearTimeout(timer)
    }
    
    // 编辑器关闭时重置标记
    if (!isOpen) {
      fitZoomInitializedRef.current = false
      setIsFitZoomReady(false)
    }
  }, [state.image, isOpen, isModelLoading, initializeFitZoom])

  // 获取客户端坐标
  const getClientPoint = useCallback((e: React.MouseEvent | React.TouchEvent): Point | null => {
    if ('touches' in e) {
      if (e.touches.length === 0) return null
      return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    return { x: e.clientX, y: e.clientY }
  }, [])

  // 处理鼠标/触摸事件，转换为画布坐标
  const getCanvasPoint = useCallback((e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const clientPoint = getClientPoint(e)
    if (!clientPoint) return null

    // rect 已经是经过 CSS transform (translate + scale) 后的实际位置和尺寸
    // 所以不需要再减去 pan，只需要除以 zoom 来还原到原始画布坐标
    const x = (clientPoint.x - rect.left) / state.zoom
    const y = (clientPoint.y - rect.top) / state.zoom

    return { x, y }
  }, [canvasRef, state.zoom, getClientPoint])

  // 检查点是否在图片范围内
  const isPointInImage = useCallback((point: Point): boolean => {
    if (!state.image) return false
    return point.x >= 0 && point.x <= state.image.width && 
           point.y >= 0 && point.y <= state.image.height
  }, [state.image])

  // 追踪本次绘制是否真的在图片上绘制了内容
  const hasDrawnOnImageRef = useRef(false)

  // 鼠标/触摸按下
  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // 防止触摸时页面滚动
    if ('touches' in e) {
      e.preventDefault()
    }
    
    // 擦除工具：处理中时禁用
    if (currentTool === "eraser") {
      if (state.isProcessing) return
      
      const point = getCanvasPoint(e)
      if (!point) return
      
      // 只有在图片范围内才开始绘制
      if (!isPointInImage(point)) return
      
      hasDrawnOnImageRef.current = true
      startDrawing()
      // 立即在点击位置绘制一个点，支持单击绘制
      drawOnMask(point)
      lastPointRef.current = point
    } else if (currentTool === "hand") {
      // 抓手工具：处理中时也可以使用
      const clientPoint = getClientPoint(e)
      if (!clientPoint) return
      setIsPanning(true)
      lastPanPointRef.current = clientPoint
    }
  }, [getCanvasPoint, getClientPoint, startDrawing, drawOnMask, state.isProcessing, currentTool, isPointInImage])

  // 鼠标/触摸移动
  const handlePointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // 防止触摸时页面滚动
    if ('touches' in e) {
      e.preventDefault()
    }

    // 更新鼠标是否在图片上的状态（处理中时不更新，保持当前状态）
    if (!state.isProcessing) {
      const point = getCanvasPoint(e)
      if (point) {
        setIsMouseOnImage(isPointInImage(point))
      } else {
        setIsMouseOnImage(false)
      }
    }

    // 擦除工具：处理中时禁用
    if (currentTool === "eraser" && state.isDrawing && !state.isProcessing) {
      const point = getCanvasPoint(e)
      if (!point || !lastPointRef.current) return
      // 只在图片范围内绘制
      if (isPointInImage(point)) {
        drawLine(lastPointRef.current, point)
      }
      lastPointRef.current = point
    } else if (currentTool === "hand" && isPanning) {
      // 抓手工具：处理中时也可以使用
      const clientPoint = getClientPoint(e)
      if (!clientPoint || !lastPanPointRef.current) return
      
      const dx = clientPoint.x - lastPanPointRef.current.x
      const dy = clientPoint.y - lastPanPointRef.current.y
      
      setPan({
        x: state.pan.x + dx,
        y: state.pan.y + dy,
      })
      
      lastPanPointRef.current = clientPoint
    }
  }, [state.isDrawing, state.isProcessing, state.pan, currentTool, isPanning, getCanvasPoint, getClientPoint, drawLine, setPan, isPointInImage])

  // 鼠标/触摸抬起
  const handlePointerUp = useCallback(() => {
    if (currentTool === "eraser" && state.isDrawing) {
      stopDrawing()
      lastPointRef.current = null
      // 只有真正在图片上绘制了才触发生成
      if (hasDrawnOnImageRef.current) {
        hasDrawnOnImageRef.current = false
        requestAnimationFrame(() => {
          handleProcessRef.current()
        })
      }
    } else if (currentTool === "hand" && isPanning) {
      setIsPanning(false)
      lastPanPointRef.current = null
    }
  }, [currentTool, state.isDrawing, isPanning, stopDrawing])

  // 检查蒙版是否有实际内容（白色像素）
  const hasMaskContent = useCallback((maskData: ImageData): boolean => {
    const data = maskData.data
    for (let i = 0; i < data.length; i += 4) {
      // 检查是否有白色像素（R > 128 表示有内容）
      if (data[i] > 128) return true
    }
    return false
  }, [])

  // 处理图片
  const handleProcess = useCallback(async () => {
    if (!state.image || state.isProcessing || isModelLoading) return

    const maskData = getMaskData()
    if (!maskData) return

    // 检查蒙版是否有实际内容
    if (!hasMaskContent(maskData)) return

    // 使用 flushSync 强制同步更新 UI，确保 loading 状态立即显示
    flushSync(() => {
      setIsProcessing(true)
    })

    // 等待两帧确保 UI 已渲染
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

    try {
      const result = await processImage(state.image, maskData)
      if (result) {
        setProcessedImageData(result)
        // 处理完成后，将结果应用为新的基础图像并清除蒙版，以支持连续编辑
        applyProcessedImage(result)
      }
    } catch (error) {
      console.error("处理图片失败:", error)
    } finally {
      setIsProcessing(false)
    }
  }, [state.image, state.isProcessing, isModelLoading, getMaskData, hasMaskContent, processImage, setIsProcessing, setProcessedImageData, applyProcessedImage])

  // 更新 handleProcessRef
  useEffect(() => {
    handleProcessRef.current = handleProcess
  }, [handleProcess])

  // 下载图片
  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "cleaned-image.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }, [canvasRef])

  // 重置
  const handleReset = useCallback(() => {
    reset()
    clearMask()
    resetToFitZoom()
  }, [reset, clearMask, resetToFitZoom])

  // 滚轮缩放
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const fitZoom = getFitZoom()
    const delta = e.deltaY > 0 ? -fitZoom * 0.1 : fitZoom * 0.1
    setZoom(state.zoom + delta)
  }, [state.zoom, setZoom, getFitZoom])

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      // Ctrl/Cmd + Z 撤回
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        if (canUndo) undo()
        return
      }

      // Ctrl/Cmd + Shift + Z 或 Ctrl/Cmd + Y 取消撤回
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault()
        if (canRedo) redo()
        return
      }

      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "+":
        case "=":
          setZoom(state.zoom + getFitZoom() * 0.1)
          break
        case "-":
          setZoom(state.zoom - getFitZoom() * 0.1)
          break
        case "0":
          resetToFitZoom()
          break
        case "c":
          if (state.processedImageData) {
            toggleComparison()
          }
          break
        case "e":
          setCurrentTool("eraser")
          break
        case "h":
          setCurrentTool("hand")
          break
        case " ": // 空格键临时切换到抓手
          e.preventDefault()
          setCurrentTool("hand")
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!isOpen) return
      // 释放空格键时切换回擦除工具
      if (e.key === " ") {
        setCurrentTool("eraser")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [isOpen, onClose, state.zoom, state.processedImageData, setZoom, resetToFitZoom, getFitZoom, toggleComparison, canUndo, canRedo, undo, redo])

  // 防止移动端 body 滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [isOpen])

  // 获取画布区域的光标类名
  const getCanvasCursorClass = () => {
    if (state.isProcessing) return ""
    // 预览模式下显示正常光标
    if (state.showComparison) return ""
    // 只有鼠标在画布内才应用特殊光标
    if (!isMouseInCanvas) return ""
    // 抓手工具：显示 grab 或 grabbing 光标
    if (currentTool === "hand") return isPanning ? "!cursor-grabbing" : "!cursor-grab"
    // 擦除工具：只有在图片上才隐藏光标（显示自定义光环）
    if (currentTool === "eraser" && isMouseOnImage) return "cursor-none"
    return ""
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContentFullscreen showCloseButton={false}>
        <VisuallyHidden.Root>
          <DialogTitle>Image Editor</DialogTitle>
        </VisuallyHidden.Root>

        {/* 模型加载时显示全屏加载页面 */}
        {isModelLoading ? (
          <ModelLoadingScreen progress={loadingProgress} />
        ) : (
        <div className="flex flex-col h-full">
          {/* 顶部导航 */}
          <Toolbar
            onReset={handleReset}
            onDownload={handleDownload}
            onClose={onClose}
            hasProcessedImage={state.image !== state.originalImage && !!state.originalImage}
            geminiState={geminiToastState}
          />

          {/* 画布区域 */}
          <div 
            ref={containerRef}
            className={`flex-1 relative overflow-hidden flex items-center justify-center touch-none ${getCanvasCursorClass()}`}
            style={{ 
              backgroundColor: 'var(--canvas-bg)',
              backgroundImage: 'radial-gradient(var(--canvas-dot) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseEnter={() => setIsMouseInCanvas(true)}
            onMouseLeave={() => {
              handlePointerUp()
              setIsMouseInCanvas(false)
            }}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
            onTouchCancel={handlePointerUp}
            onWheel={handleWheel}
          >
            {/* 在 fitZoom 初始化完成前隐藏画布，防止大图闪现 */}
            <div style={{ opacity: isFitZoomReady ? 1 : 0, transition: 'opacity 0.15s ease-out' }}>
              {state.showComparison && state.originalImage && state.image !== state.originalImage ? (
                <CompareSlider
                  originalImage={state.originalImage}
                  currentImage={state.image}
                  position={state.comparisonPosition}
                  onPositionChange={setComparisonPosition}
                  zoom={state.zoom}
                  pan={state.pan}
                />
              ) : (
                <Canvas
                  canvasRef={canvasRef}
                  maskCanvasRef={maskCanvasRef}
                  image={state.image}
                  processedImageData={state.processedImageData}
                  zoom={state.zoom}
                  pan={state.pan}
                  isProcessing={state.isProcessing}
                  brushSize={state.brushSize}
                  currentTool={currentTool}
                  isMouseOnImage={isMouseOnImage}
                />
              )}
            </div>

            {/* 底部悬浮工具面板（包含缩放控制） */}
            <ToolPanel
                currentTool={currentTool}
                onToolChange={setCurrentTool}
                brushSize={state.brushSize}
                onBrushSizeChange={setBrushSize}
                zoom={state.zoom}
                fitZoom={getFitZoom()}
                onZoomIn={() => setZoom(state.zoom + getFitZoom() * 0.25)}
                onZoomOut={() => setZoom(state.zoom - getFitZoom() * 0.25)}
                onZoomReset={resetToFitZoom}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
                isProcessing={state.isProcessing}
                hasProcessedImage={state.image !== state.originalImage && !!state.originalImage}
                showComparison={state.showComparison}
                onToggleComparison={toggleComparison}
                onMouseEnter={() => setIsMouseInCanvas(false)}
                onMouseLeave={(e: React.MouseEvent) => {
                  // 检查鼠标是否移回到画布区域（而不是移到画布外部）
                  const container = containerRef.current
                  if (container) {
                    const rect = container.getBoundingClientRect()
                    const { clientX, clientY } = e
                    // 如果鼠标位置仍在画布容器内，则恢复 isMouseInCanvas
                    if (
                      clientX >= rect.left &&
                      clientX <= rect.right &&
                      clientY >= rect.top &&
                      clientY <= rect.bottom
                    ) {
                      setIsMouseInCanvas(true)
                    }
                  }
                }}
              />
          </div>
        </div>
        )}
      </DialogContentFullscreen>
    </Dialog>
  )
}
