"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { useGeminiDetection } from "@/hooks/useGeminiDetection"

interface GeminiDetectionToggleProps {
  className?: string
}

// Gemini 风格图标 - 填充版本
function GeminiIconFilled({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className}
      fill="currentColor"
    >
      <path d="M24 12.024c-6.437.388-11.59 5.539-11.977 11.976h-.047C11.588 17.563 6.436 12.412 0 12.024v-.047C6.437 11.588 11.588 6.437 11.976 0h.047c.388 6.437 5.54 11.588 11.977 11.977z"/>
    </svg>
  )
}

// Gemini 风格图标 - 描边版本
function GeminiIconOutline({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M24 12.024c-6.437.388-11.59 5.539-11.977 11.976h-.047C11.588 17.563 6.436 12.412 0 12.024v-.047C6.437 11.588 11.588 6.437 11.976 0h.047c.388 6.437 5.54 11.588 11.977 11.977z"/>
    </svg>
  )
}

export function GeminiDetectionToggle({ className = "" }: GeminiDetectionToggleProps) {
  const { enabled, toggle } = useGeminiDetection()
  const t = useTranslations("geminiDetection")

  const handleClick = (e: React.MouseEvent) => {
    // 阻止事件冒泡，防止触发上传
    e.stopPropagation()
    e.preventDefault()
    toggle()
  }

  return (
    <motion.button
      onClick={handleClick}
      className={`
        group relative
        w-12 h-12
        border-3 border-foreground rounded-lg
        shadow-[2px_2px_0_var(--foreground)]
        flex items-center justify-center
        transition-all duration-200
        hover:shadow-[3px_3px_0_var(--foreground)]
        hover:-translate-x-0.5 hover:-translate-y-0.5
        active:shadow-[1px_1px_0_var(--foreground)]
        active:translate-x-0 active:translate-y-0
        -rotate-12
        ${enabled 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted text-muted-foreground"
        }
        ${className}
      `}
      initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
      animate={{ opacity: 1, scale: 1, rotate: -12 }}
      transition={{ delay: 0.4, duration: 0.4, type: "spring" }}
      whileHover={{ rotate: 0 }}
    >
      {enabled ? (
        <GeminiIconFilled className="w-6 h-6" />
      ) : (
        <GeminiIconOutline className="w-6 h-6" />
      )}

      {/* 悬浮提示卡片 - 显示在右上方 */}
      <div className="
        absolute bottom-[calc(100%-15px)] left-1/2
        px-3 py-2 
        bg-card border-2 border-foreground rounded-lg
        shadow-[2px_2px_0_var(--foreground)]
        opacity-0 invisible group-hover:opacity-100 group-hover:visible
        transition-all duration-200
        pointer-events-none
        z-50
        rotate-12
        min-w-max
      ">
        <div className="flex items-center gap-2 mb-1">
          <GeminiIconFilled className="w-4 h-4 text-primary" />
          <span className="font-bold text-sm">{t("label")}</span>
          <span className={`
            px-1.5 py-0.5 text-xs font-bold rounded
            ${enabled 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground"
            }
          `}>
            {enabled ? t("statusOn") : t("statusOff")}
          </span>
        </div>
        <p className="text-xs text-muted-foreground whitespace-nowrap">
          {t("tooltip")}
        </p>
        {/* 底部箭头 - 指向下方按钮 */}
        <span className="
          absolute -bottom-[10px] left-4
          w-0 h-0
          border-l-[8px] border-l-transparent
          border-r-[8px] border-r-transparent
          border-t-[10px] border-t-foreground
        " />
        <span className="
          absolute -bottom-[6px] left-[18px]
          w-0 h-0
          border-l-[6px] border-l-transparent
          border-r-[6px] border-r-transparent
          border-t-[8px] border-t-card
        " />
      </div>
    </motion.button>
  )
}
