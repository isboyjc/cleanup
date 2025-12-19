"use client"

import { useEffect, useRef, RefObject } from "react"
import { useTranslations } from "next-intl"
import type { ToolType } from "./ToolPanel"

interface CanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>
  maskCanvasRef: RefObject<HTMLCanvasElement | null>
  image: HTMLImageElement | null
  processedImageData: ImageData | null
  zoom: number
  pan: { x: number; y: number }
  isProcessing: boolean
  brushSize: number
  currentTool: ToolType
  isMouseOnImage: boolean
}

export function Canvas({
  canvasRef,
  maskCanvasRef,
  image,
  processedImageData,
  zoom,
  pan,
  isProcessing,
  brushSize,
  currentTool,
  isMouseOnImage,
}: CanvasProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const t = useTranslations("editor.canvas")

  // 初始化画布并绘制图像
  useEffect(() => {
    if (!image) return

    const canvas = canvasRef.current
    const maskCanvas = maskCanvasRef.current
    if (!canvas || !maskCanvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 设置画布尺寸（这也会清除画布内容）
    canvas.width = image.width
    canvas.height = image.height
    maskCanvas.width = image.width
    maskCanvas.height = image.height

    // 清除画布确保干净
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 绘制图片
    if (processedImageData) {
      ctx.putImageData(processedImageData, 0, 0)
    } else {
      ctx.drawImage(image, 0, 0)
    }
  }, [image, processedImageData, canvasRef, maskCanvasRef])

  // 自定义光标跟随（仅桌面端且擦除工具且鼠标在画布区域内）
  useEffect(() => {
    // 检测是否为触摸设备
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice || currentTool !== "eraser") return

    const handleMouseMove = (e: MouseEvent) => {
      if (!cursorRef.current) return
      cursorRef.current.style.left = `${e.clientX}px`
      cursorRef.current.style.top = `${e.clientY}px`
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [currentTool])

  if (!image) {
    return (
      <div className="flex items-center justify-center text-muted-foreground p-8 text-center">
        {t("loading")}
      </div>
    )
  }

  // 检测是否为触摸设备
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  // 只有在图片上、使用擦除工具、非触摸设备、非处理中时才显示光标
  const showBrushCursor = currentTool === "eraser" && !isTouchDevice && !isProcessing && isMouseOnImage

  return (
    <>
      {/* 自定义画笔光标（仅擦除工具在桌面端且鼠标在图片上时显示） */}
      {showBrushCursor && (
        <div
          ref={cursorRef}
          className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary"
          style={{
            width: brushSize * zoom,
            height: brushSize * zoom,
            boxShadow: '0 0 0 1px var(--foreground)',
          }}
        />
      )}

      {/* 画布容器 */}
      <div
        className="relative touch-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        {/* 主画布 */}
        <canvas
          ref={canvasRef}
          className="max-w-none shadow-2xl rounded-lg"
          style={{ 
            touchAction: "none",
          }}
        />

        {/* 蒙版画布（叠加显示） */}
        <canvas
          ref={maskCanvasRef}
          className="absolute top-0 left-0 max-w-none opacity-50 pointer-events-none"
          style={{
            mixBlendMode: "screen",
          }}
        />

        {/* 处理中呼吸蒙版 + 加载提示 */}
        {isProcessing && (
          <>
            {/* 呼吸效果蒙版层 - 使用 Tailwind pulse 动画 */}
            <div className="absolute inset-0 rounded-lg pointer-events-none bg-background/25 animate-pulse" />
          </>
        )}
      </div>

      {/* 移动端触摸提示 */}
      {isTouchDevice && !isProcessing && currentTool === "eraser" && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white/70 text-xs">
          {t("touchHint")}
        </div>
      )}
    </>
  )
}
