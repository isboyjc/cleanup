"use client"

import { motion } from "framer-motion"
import { Logo } from "@/components/Logo"
import { ProductName } from "@/components/ProductName"
import { useTranslations } from "next-intl"

interface ModelLoadingScreenProps {
  progress: number
}

export function ModelLoadingScreen({ progress }: ModelLoadingScreenProps) {
  const t = useTranslations("editor.modelLoading")
  const percentage = Math.round(progress * 100)

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* 背景装饰 */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(var(--canvas-dot) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* 主要内容 */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo 动画 */}
        <motion.div
          animate={{ 
            rotate: [0, -5, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Logo size={80} />
        </motion.div>

        {/* 产品名称 */}
        <ProductName size="lg" className="text-foreground" />

        {/* 加载状态文字 */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {percentage < 10 ? t("preparing") : percentage < 80 ? t("downloading") : t("initializing")}
          </span>
        </div>

        {/* 进度条容器 */}
        <div className="w-64 md:w-80">
          {/* 进度条背景 */}
          <div className="relative h-6 bg-card border-3 border-foreground rounded-lg overflow-hidden shadow-brutal-sm">
            {/* 进度条填充 */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
            
            {/* 条纹动画效果 */}
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)',
              }}
              animate={{ backgroundPositionX: ['0px', '40px'] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />

            {/* 百分比文字 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-foreground">
                {percentage}%
              </span>
            </div>
          </div>

          {/* 进度提示 */}
          <div className="mt-3 text-center">
            <span className="text-xs text-muted-foreground">
              {t("hint")}
            </span>
          </div>
        </div>

        {/* 装饰元素 */}
        <div className="flex gap-3 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full border-2 border-foreground"
              style={{
                backgroundColor: i === 0 ? '#FFE500' : i === 1 ? '#FF6B6B' : '#7FFFD4',
              }}
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

