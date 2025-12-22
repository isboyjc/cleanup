"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { 
  Eraser, 
  Hand,
  Minus,
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Undo2,
  Redo2,
  SplitSquareHorizontal
} from "lucide-react"
import { useTranslations } from "next-intl"

export type ToolType = "eraser" | "hand"

interface ToolPanelProps {
  currentTool: ToolType
  onToolChange: (tool: ToolType) => void
  brushSize: number
  onBrushSizeChange: (size: number) => void
  zoom: number
  fitZoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomReset: () => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  isProcessing: boolean
  hasProcessedImage: boolean
  showComparison: boolean
  onToggleComparison: () => void
  onMouseEnter?: () => void
  onMouseLeave?: (e: React.MouseEvent) => void
}

export function ToolPanel({
  currentTool,
  onToolChange,
  brushSize,
  onBrushSizeChange,
  zoom,
  fitZoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isProcessing,
  hasProcessedImage,
  showComparison,
  onToggleComparison,
  onMouseEnter,
  onMouseLeave,
}: ToolPanelProps) {
  const t = useTranslations("editor.toolPanel")
  const [showBrushPreview, setShowBrushPreview] = useState(false)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 显示画笔大小预览
  const showPreview = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
    }
    setShowBrushPreview(true)
    hideTimeoutRef.current = setTimeout(() => {
      setShowBrushPreview(false)
    }, 1000)
  }

  // 处理画笔大小变化
  const handleBrushSizeChange = (size: number) => {
    onBrushSizeChange(size)
    showPreview()
  }

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [])
  
  // 阻止所有指针事件冒泡到画布，防止工具栏区域触发擦除
  const stopPropagation = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    e.stopPropagation()
  }

  return (
    <motion.div 
      className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 cursor-default"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={stopPropagation}
      onMouseUp={stopPropagation}
      onMouseMove={stopPropagation}
      onPointerDown={stopPropagation}
      onPointerUp={stopPropagation}
      onPointerMove={stopPropagation}
      onTouchStart={stopPropagation}
      onTouchEnd={stopPropagation}
      onTouchMove={stopPropagation}
    >
      {/* 画笔大小预览 */}
      <AnimatePresence>
        {showBrushPreview && currentTool === "eraser" && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-4 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.15 }}
          >
            <div 
              className="rounded-full border-2 border-primary bg-primary/20"
              style={{
                width: Math.min(brushSize * zoom, 120),
                height: Math.min(brushSize * zoom, 120),
                boxShadow: '0 0 0 1px var(--foreground)',
              }}
            />
            <div className="mt-2 px-2 py-1 bg-card border-2 border-foreground rounded-md shadow-[2px_2px_0_var(--foreground)]">
              <span className="text-xs font-bold text-foreground">{brushSize}px</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-1.5 md:gap-2 h-11 md:h-12 bg-card border-2 border-border/20 rounded-xl px-2 md:px-3 shadow-xl">
        {/* 预览模式下只显示退出预览按钮 */}
        {showComparison ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleComparison}
            className="gap-1.5"
          >
            <SplitSquareHorizontal className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm">{t("exitCompare")}</span>
          </Button>
        ) : (
          <>
            {/* 撤回/取消撤回 */}
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onUndo}
                disabled={!canUndo || isProcessing}
                className="text-foreground hover:bg-foreground/10 border-0 w-7 h-7 md:w-8 md:h-8 disabled:opacity-30"
                title={t("undo")}
              >
                <Undo2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onRedo}
                disabled={!canRedo || isProcessing}
                className="text-foreground hover:bg-foreground/10 border-0 w-7 h-7 md:w-8 md:h-8 disabled:opacity-30"
                title={t("redo")}
              >
                <Redo2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Button>
            </div>

            {/* 分隔线 */}
            <div className="w-px h-6 bg-foreground/20" />

        {/* 工具选择 */}
        <div className="flex items-center gap-0.5 bg-muted/30 rounded-lg p-0.5">
          <Button
            variant={currentTool === "eraser" ? "default" : "ghost"}
            size="icon"
            onClick={() => onToolChange("eraser")}
            className={`
              w-7 h-7 md:w-8 md:h-8 rounded-md transition-all
              ${currentTool === "eraser" 
                ? "bg-secondary text-secondary-foreground shadow-[2px_2px_0_var(--foreground)]" 
                : "text-foreground hover:bg-foreground/10 border-0"
              }
            `}
            title={t("eraser")}
          >
            <Eraser className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>
          
          <Button
            variant={currentTool === "hand" ? "default" : "ghost"}
            size="icon"
            onClick={() => onToolChange("hand")}
            className={`
              w-7 h-7 md:w-8 md:h-8 rounded-md transition-all
              ${currentTool === "hand" 
                ? "bg-accent text-accent-foreground shadow-[2px_2px_0_var(--foreground)]" 
                : "text-foreground hover:bg-foreground/10 border-0"
              }
            `}
            title={t("hand")}
          >
            <Hand className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>
        </div>

        {/* 分隔线 */}
        <div className="w-px h-6 bg-foreground/20" />

        {/* 笔刷大小调节（仅擦除工具时显示） */}
        {currentTool === "eraser" && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleBrushSizeChange(Math.max(5, brushSize - 10))}
              className="text-foreground hover:bg-foreground/10 border-0 w-6 h-6 md:w-7 md:h-7"
            >
              <Minus className="w-3 h-3" />
            </Button>
            
            <div className="w-14 md:w-20">
              <Slider
                value={[brushSize]}
                onValueChange={(value) => handleBrushSizeChange(value[0])}
                min={5}
                max={100}
                step={1}
              />
            </div>
            
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleBrushSizeChange(Math.min(100, brushSize + 10))}
              className="text-foreground hover:bg-foreground/10 border-0 w-6 h-6 md:w-7 md:h-7"
            >
              <Plus className="w-3 h-3" />
            </Button>
            
            <span className="text-foreground font-medium text-xs w-6 text-center">
              {brushSize}
            </span>
          </div>
        )}

        {/* 抓手工具提示 */}
        {currentTool === "hand" && (
          <div className="px-1.5 md:px-2">
            <span className="text-muted-foreground text-xs whitespace-nowrap">
              {t("handHint")}
            </span>
          </div>
        )}

        {/* 分隔线 */}
        <div className="w-px h-6 bg-foreground/20" />

        {/* 缩放控制 */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onZoomOut}
            disabled={zoom <= fitZoom * 0.25}
            className="text-foreground hover:bg-foreground/10 border-0 w-6 h-6 md:w-7 md:h-7 disabled:opacity-30"
            title={t("zoomOut")}
          >
            <ZoomOut className="w-3 h-3" />
          </Button>

          <button
            onClick={onZoomReset}
            className="text-foreground font-medium text-xs w-9 md:w-10 text-center hover:bg-foreground/10 rounded py-0.5 transition-colors"
            title={t("zoomReset")}
          >
            {Math.round((zoom / fitZoom) * 100)}%
          </button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onZoomIn}
            disabled={zoom >= fitZoom * 4}
            className="text-foreground hover:bg-foreground/10 border-0 w-6 h-6 md:w-7 md:h-7 disabled:opacity-30"
            title={t("zoomIn")}
          >
            <ZoomIn className="w-3 h-3" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onZoomReset}
            className="text-foreground hover:bg-foreground/10 border-0 w-6 h-6 md:w-7 md:h-7 hidden md:flex"
            title={t("zoomReset")}
          >
            <Maximize2 className="w-3 h-3" />
          </Button>
        </div>

            {/* 预览对比按钮（有处理结果时显示） */}
            {hasProcessedImage && (
              <>
                <div className="w-px h-6 bg-foreground/20" />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onToggleComparison}
                  className="w-7 h-7 md:w-8 md:h-8 text-foreground hover:bg-foreground/10 border-0"
                  title={t("compare")}
                >
                  <SplitSquareHorizontal className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}
