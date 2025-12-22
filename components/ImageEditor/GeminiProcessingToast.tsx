"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Zap, X, Loader2, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"

export type GeminiToastState = "detecting" | "processing" | "success" | "not-found" | "hidden"

interface GeminiProcessingToastProps {
  state: GeminiToastState
  onClose?: () => void
}

export function GeminiProcessingToast({ state, onClose }: GeminiProcessingToastProps) {
  const t = useTranslations("geminiDetection")

  if (state === "hidden") return null

  const config = {
    detecting: {
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      text: t("detecting"),
      bgColor: "bg-muted",
      textColor: "text-muted-foreground",
    },
    processing: {
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      text: t("processing"),
      bgColor: "bg-primary",
      textColor: "text-primary-foreground",
    },
    success: {
      icon: <Sparkles className="w-4 h-4" />,
      text: t("success"),
      bgColor: "bg-accent",
      textColor: "text-accent-foreground",
    },
    "not-found": {
      icon: null,
      text: t("notFound"),
      bgColor: "bg-muted",
      textColor: "text-muted-foreground",
    },
  }[state]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`
          fixed top-20 left-1/2 -translate-x-1/2 z-50
          flex items-center gap-2 px-4 py-2.5
          border-2 border-foreground rounded-xl
          shadow-[3px_3px_0_var(--foreground)]
          ${config.bgColor} ${config.textColor}
          font-medium text-sm
        `}
      >
        <Zap className="w-4 h-4 fill-current" />
        {config.icon}
        <span>{config.text}</span>
        {(state === "success" || state === "not-found") && onClose && (
          <button
            onClick={onClose}
            className="ml-1 p-1 hover:bg-foreground/10 rounded-md transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

