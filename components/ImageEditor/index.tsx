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
  } = useImageEditor(image)

  const { processImage, isModelLoading, loadingProgress } = useLamaModel()
  const lastPointRef = useRef<Point | null>(null)
  const lastPanPointRef = useRef<Point | null>(null)
  const handleProcessRef = useRef<() => void>(() => {})
  const [currentTool, setCurrentTool] = useState<ToolType>("eraser")
  const [isPanning, setIsPanning] = useState(false)
  const [isMouseInCanvas, setIsMouseInCanvas] = useState(false)
  const [isMouseOnImage, setIsMouseOnImage] = useState(false)

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

    // 考虑缩放和平移
    const x = (clientPoint.x - rect.left - state.pan.x) / state.zoom
    const y = (clientPoint.y - rect.top - state.pan.y) / state.zoom

    return { x, y }
  }, [canvasRef, state.zoom, state.pan, getClientPoint])

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
    if (state.isProcessing) return
    
    // 防止触摸时页面滚动
    if ('touches' in e) {
      e.preventDefault()
    }
    
    if (currentTool === "eraser") {
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
      const clientPoint = getClientPoint(e)
      if (!clientPoint) return
      setIsPanning(true)
      lastPanPointRef.current = clientPoint
    }
  }, [getCanvasPoint, getClientPoint, startDrawing, drawOnMask, state.isProcessing, currentTool, isPointInImage])

  // 鼠标/触摸移动
  const handlePointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (state.isProcessing) return

    // 防止触摸时页面滚动
    if ('touches' in e) {
      e.preventDefault()
    }

    // 更新鼠标是否在图片上的状态
    const point = getCanvasPoint(e)
    if (point) {
      setIsMouseOnImage(isPointInImage(point))
    } else {
      setIsMouseOnImage(false)
    }

    if (currentTool === "eraser" && state.isDrawing) {
      if (!point || !lastPointRef.current) return
      // 只在图片范围内绘制
      if (isPointInImage(point)) {
        drawLine(lastPointRef.current, point)
      }
      lastPointRef.current = point
    } else if (currentTool === "hand" && isPanning) {
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
    setPan({ x: 0, y: 0 })
    setZoom(1)
  }, [reset, clearMask, setPan, setZoom])

  // 滚轮缩放
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom(state.zoom + delta)
  }, [state.zoom, setZoom])

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
          setZoom(state.zoom + 0.1)
          break
        case "-":
          setZoom(state.zoom - 0.1)
          break
        case "0":
          setZoom(1)
          setPan({ x: 0, y: 0 })
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
  }, [isOpen, onClose, state.zoom, state.processedImageData, setZoom, setPan, toggleComparison, canUndo, canRedo, undo, redo])

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

            {/* 底部悬浮工具面板（包含缩放控制） */}
            <ToolPanel
                currentTool={currentTool}
                onToolChange={setCurrentTool}
                brushSize={state.brushSize}
                onBrushSizeChange={setBrushSize}
                zoom={state.zoom}
                onZoomIn={() => setZoom(state.zoom + 0.25)}
                onZoomOut={() => setZoom(state.zoom - 0.25)}
                onZoomReset={() => {
                  setZoom(1)
                  setPan({ x: 0, y: 0 })
                }}
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
