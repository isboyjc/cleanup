"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { motion } from "framer-motion"
import { GripVertical } from "lucide-react"
import { useTranslations } from "next-intl"

interface CompareSliderProps {
  originalImage: HTMLImageElement | null
  currentImage: HTMLImageElement | null
  position: number
  onPositionChange: (position: number) => void
  zoom: number
  pan: { x: number; y: number }
}

export function CompareSlider({
  originalImage,
  currentImage,
  position,
  onPositionChange,
  zoom,
  pan,
}: CompareSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const originalCanvasRef = useRef<HTMLCanvasElement>(null)
  const currentCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const t = useTranslations("editor.compare")

  // 初始化画布
  useEffect(() => {
    if (!originalImage || !currentImage) return

    const originalCanvas = originalCanvasRef.current
    const currentCanvas = currentCanvasRef.current
    if (!originalCanvas || !currentCanvas) return

    // 设置画布尺寸
    originalCanvas.width = originalImage.width
    originalCanvas.height = originalImage.height
    currentCanvas.width = currentImage.width
    currentCanvas.height = currentImage.height

    // 绘制原始图片
    const originalCtx = originalCanvas.getContext("2d")
    if (originalCtx) {
      originalCtx.drawImage(originalImage, 0, 0)
    }

    // 绘制当前图片
    const currentCtx = currentCanvas.getContext("2d")
    if (currentCtx) {
      currentCtx.drawImage(currentImage, 0, 0)
    }
  }, [originalImage, currentImage])

  // 计算位置的通用函数
  const calculatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = (x / rect.width) * 100
    onPositionChange(Math.max(0, Math.min(100, percentage)))
  }, [onPositionChange])

  // 鼠标事件处理
  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    calculatePosition(e.clientX)
  }, [isDragging, calculatePosition])

  // 触摸事件处理
  const handleTouchStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return
    e.preventDefault()
    calculatePosition(e.touches[0].clientX)
  }, [isDragging, calculatePosition])

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => setIsDragging(false)
      const handleGlobalTouchEnd = () => setIsDragging(false)
      
      window.addEventListener("mouseup", handleGlobalMouseUp)
      window.addEventListener("touchend", handleGlobalTouchEnd)
      
      return () => {
        window.removeEventListener("mouseup", handleGlobalMouseUp)
        window.removeEventListener("touchend", handleGlobalTouchEnd)
      }
    }
  }, [isDragging])

  if (!originalImage || !currentImage) return null

  return (
    <motion.div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg shadow-2xl cursor-col-resize touch-none"
      style={{
        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        transformOrigin: "center center",
        width: originalImage.width,
        height: originalImage.height,
      }}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* 当前图片（底层，处理后的结果） */}
      <canvas
        ref={currentCanvasRef}
        className="absolute top-0 left-0"
      />

      {/* 原始图片（带裁剪） */}
      <div
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <canvas
          ref={originalCanvasRef}
          className="max-w-none"
          style={{ width: originalImage.width, height: originalImage.height }}
        />
      </div>

      {/* 分割线 */}
      <div
        className="absolute top-0 bottom-0 bg-white cursor-col-resize z-10"
        style={{ 
          left: `${position}%`, 
          transform: "translateX(-50%)",
          width: Math.max(2, 4 / zoom), // 线宽度根据缩放调整
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* 拖动手柄 - 应用反向缩放保持固定视觉大小 */}
        <div 
          className="absolute top-1/2 left-1/2 bg-white rounded-full border-3 border-foreground shadow-[3px_3px_0_var(--foreground)] flex items-center justify-center"
          style={{
            transform: `translate(-50%, -50%) scale(${1 / zoom})`,
            width: 44,
            height: 44,
          }}
        >
          <GripVertical className="w-5 h-5 text-foreground" />
        </div>
      </div>

      {/* 标签 - 应用反向缩放保持固定视觉大小 */}
      <div 
        className="absolute bg-foreground text-background text-sm font-bold rounded-lg px-3 py-1 whitespace-nowrap"
        style={{
          top: 16 / zoom,
          left: 16 / zoom,
          transform: `scale(${1 / zoom})`,
          transformOrigin: "top left",
        }}
      >
        {t("original")}
      </div>
      <div 
        className="absolute bg-primary text-foreground text-sm font-bold rounded-lg px-3 py-1 border-2 border-foreground whitespace-nowrap"
        style={{
          top: 16 / zoom,
          right: 16 / zoom,
          transform: `scale(${1 / zoom})`,
          transformOrigin: "top right",
        }}
      >
        {t("processed")}
      </div>
    </motion.div>
  )
}
