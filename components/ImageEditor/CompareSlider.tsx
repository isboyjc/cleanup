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
        className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-10"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* 拖动手柄 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full border-2 md:border-3 border-foreground shadow-[2px_2px_0_var(--foreground)] flex items-center justify-center">
          <GripVertical className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
        </div>
      </div>

      {/* 标签 */}
      <div className="absolute top-2 left-2 md:top-4 md:left-4 px-2 py-0.5 md:px-3 md:py-1 bg-foreground text-background text-xs md:text-sm font-bold rounded-lg">
        {t("original")}
      </div>
      <div className="absolute top-2 right-2 md:top-4 md:right-4 px-2 py-0.5 md:px-3 md:py-1 bg-primary text-foreground text-xs md:text-sm font-bold rounded-lg border md:border-2 border-foreground">
        {t("processed")}
      </div>
    </motion.div>
  )
}
