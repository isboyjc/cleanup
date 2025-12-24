"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/Logo"
import { ProductName } from "@/components/ProductName"
import { 
  RotateCcw, 
  Download, 
  X,
  Loader2
} from "lucide-react"
import { useTranslations } from "next-intl"
import type { GeminiToastState } from "./GeminiProcessingToast"

// Gemini Logo 组件
function GeminiLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id="geminiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="50%" stopColor="#9B72CB" />
          <stop offset="100%" stopColor="#D96570" />
        </linearGradient>
      </defs>
      <path 
        d="M12 2C12 2 12 12 12 12C12 12 2 12 2 12C2 12 12 12 12 12C12 12 12 22 12 22C12 22 12 12 12 12C12 12 22 12 22 12C22 12 12 12 12 12C12 12 12 2 12 2Z" 
        fill="url(#geminiGradient)"
      />
    </svg>
  )
}

interface ToolbarProps {
  onReset: () => void
  onDownload: () => void
  onClose: () => void
  hasProcessedImage: boolean
  geminiState?: GeminiToastState
}

export function Toolbar({
  onReset,
  onDownload,
  onClose,
  hasProcessedImage,
  geminiState = "hidden",
}: ToolbarProps) {
  const t = useTranslations("editor.toolbar")
  const tGemini = useTranslations("geminiDetection")
  
  // Gemini 状态配置
  const geminiConfig = {
    detecting: {
      showLoader: true,
      text: tGemini("detecting"),
    },
    processing: {
      showLoader: true,
      text: tGemini("processing"),
    },
    success: {
      showLoader: false,
      text: tGemini("success"),
    },
    "not-found": {
      showLoader: false,
      text: tGemini("notFound"),
    },
    hidden: null,
  }[geminiState]
  
  return (
    <div className="flex items-center justify-between px-4 md:px-6 h-14 md:h-16 bg-card border-b-2 border-border/20" role="toolbar" aria-label="Editor toolbar">
      {/* 左侧：关闭按钮 + Logo */}
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          className="text-foreground hover:bg-foreground/10 border-0"
          aria-label={t("close") || "Close editor"}
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </Button>
        
        <div className="hidden md:flex items-center gap-2" aria-hidden="true">
          <Logo size={36} />
          <ProductName className="text-primary-foreground" size="sm" />
        </div>
      </div>

      {/* 右侧：Gemini 状态 + 操作按钮 */}
      <div className="flex items-center gap-2 md:gap-3" role="group" aria-label="Editor actions">
        {/* Gemini 检测状态 */}
        <AnimatePresence mode="wait">
          {geminiConfig && (
            <motion.div
              key={geminiState}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5 text-xs text-foreground/70"
              role="status"
              aria-live="polite"
              aria-label={geminiConfig.text}
            >
              <GeminiLogo className="w-4 h-4" aria-hidden="true" />
              {geminiConfig.showLoader && (
                <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
              )}
              <span className="whitespace-nowrap hidden sm:inline">{geminiConfig.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 分隔线 */}
        {geminiConfig && (
          <div className="w-px h-5 bg-border/50 hidden sm:block" aria-hidden="true" />
        )}

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onReset}
          className="text-foreground hover:bg-foreground/10 border-0 md:hidden"
          title={t("reset")}
          aria-label={t("reset")}
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="hidden md:flex"
          aria-label={t("reset")}
        >
          <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
          {t("reset")}
        </Button>

        {hasProcessedImage && (
          <Button
            variant="accent"
            size="sm"
            onClick={onDownload}
            aria-label={t("download")}
          >
            <Download className="w-4 h-4 md:mr-2" aria-hidden="true" />
            <span className="hidden md:inline">{t("download")}</span>
          </Button>
        )}
      </div>
    </div>
  )
}
