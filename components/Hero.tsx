"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, ImageIcon, Sparkles, Wand2, Zap } from "lucide-react"
import { useTranslations } from "next-intl"
import { isModelCached } from "@/lib/lama-processor"
import { GeminiDetectionToggle } from "./GeminiDetectionToggle"
import { RemoveBgLogo } from "./RemoveBgLogo"

const sampleImages = [
  {
    url: "https://cdn.isboyjc.com/picgo/clean/a0.png",
    labelKey: "samples.bag",
  },
  {
    url: "https://cdn.isboyjc.com/picgo/clean/b0.png",
    labelKey: "samples.room",
  },
  {
    url: "https://cdn.isboyjc.com/picgo/clean/c0.png",
    labelKey: "samples.jacket",
  },
  {
    url: "https://cdn.isboyjc.com/picgo/clean/long0.png",
    labelKey: "samples.portrait",
  },
]

interface HeroProps {
  onImageSelect: (file: File) => void
}

export function Hero({ onImageSelect }: HeroProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [loadingSample, setLoadingSample] = useState<number | null>(null)
  const [modelReady, setModelReady] = useState<boolean | null>(null)
  const t = useTranslations("hero")

  // 检查模型缓存状态
  useEffect(() => {
    isModelCached().then(setModelReady)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      onImageSelect(files[0])
    }
  }, [onImageSelect])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onImageSelect(files[0])
    }
  }, [onImageSelect])

  const handleSampleClick = useCallback(async (index: number, url: string) => {
    setLoadingSample(index)
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const fileName = url.split('/').pop() || 'sample.png'
      const file = new File([blob], fileName, { type: blob.type })
      onImageSelect(file)
    } catch (error) {
      console.error('Failed to load sample image:', error)
    } finally {
      setLoadingSample(null)
    }
  }, [onImageSelect])

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-12 md:pt-32 md:pb-20 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-40 h-40 bg-secondary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-48 h-48 bg-accent/30 rounded-full blur-3xl" />
        {/* 网格背景 */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(var(--foreground) 1px, transparent 1px),
              linear-gradient(90deg, var(--foreground) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* 标题 */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground border-3 border-foreground rounded-full shadow-[3px_3px_0_var(--foreground)]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold">{t("badge")}</span>
          </motion.div>

          {/* RemoveBG entrance */}
          <motion.a
            href="https://rmbg.picgo.studio/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground border-3 border-foreground rounded-full shadow-[3px_3px_0_var(--foreground)] hover:shadow-[4px_4px_0_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <RemoveBgLogo size={20} className="-ml-0.5" />
            <span className="text-sm font-bold">{t("removebg.text")}</span>
            <span className="text-sm">→</span>
          </motion.a>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="block">{t("title.line1")}</span>
          <span className="block mt-2">
            {t("title.line2")}
            <span className="relative inline-block mx-3">
              <span className="relative z-10">{t("title.highlight")}</span>
              <motion.span 
                className="absolute -bottom-1 left-0 right-0 h-4 bg-primary -z-0 -rotate-1"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              />
            </span>
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
          {t("description")}
          <br className="hidden md:block" />
          {t("descriptionSub")}
        </p>

        {/* 模型状态标识 */}
        <AnimatePresence mode="wait">
          {modelReady !== null && (
            <motion.div
              key={modelReady ? "ready" : "not-ready"}
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className={`
                inline-flex items-center gap-2 px-3 py-1.5
                border-2 border-foreground rounded-full
                shadow-[2px_2px_0_var(--foreground)]
                text-xs font-bold
                ${modelReady
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
                }
              `}
            >
              <Zap className={`w-3.5 h-3.5 ${modelReady ? "fill-current" : ""}`} />
              <span>
                {modelReady ? t("modelStatus.ready") : t("modelStatus.notReady")}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 上传区域 */}
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <label
          htmlFor="file-upload"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center
            w-full h-72 md:h-80
            bg-card border-3 border-dashed rounded-2xl
            cursor-pointer transition-all duration-200
            ${isDragging 
              ? "border-primary bg-primary/10 shadow-[8px_8px_0_var(--foreground)] -translate-x-1 -translate-y-1" 
              : "border-foreground hover:border-primary hover:shadow-[6px_6px_0_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5"
            }
            shadow-[4px_4px_0_var(--foreground)]
          `}
        >
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-label={t("upload.default")}
            aria-describedby="upload-formats"
          />
          
          <motion.div
            animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className={`
              w-20 h-20 mb-6 rounded-xl border-3 border-foreground
              flex items-center justify-center
              transition-colors duration-200
              ${isDragging ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}
              shadow-[3px_3px_0_var(--foreground)]
            `}>
              {isDragging ? (
                <Upload className="w-10 h-10" />
              ) : (
                <ImageIcon className="w-10 h-10" />
              )}
            </div>
            
            <p className="text-xl font-bold mb-2">
              {isDragging ? t("upload.dragging") : t("upload.default")}
            </p>
            <p className="text-muted-foreground">
              {t("upload.or")} <span className="text-primary font-bold underline">{t("upload.click")}</span>
            </p>
            <p id="upload-formats" className="text-sm text-muted-foreground mt-4">
              {t("upload.formats")}
            </p>
          </motion.div>

          {/* 装饰角标 */}
          <div className="absolute -top-3 -right-3 w-12 h-12 bg-accent text-accent-foreground border-3 border-foreground rounded-lg shadow-[2px_2px_0_var(--foreground)] flex items-center justify-center rotate-12" aria-hidden="true">
            <Sparkles className="w-6 h-6" />
          </div>

          {/* Gemini 水印开关 - 悬浮在左下角 */}
          <div className="absolute -bottom-3 -left-3">
            <GeminiDetectionToggle />
          </div>
        </label>
      </motion.div>

      {/* 示例图片快捷入口 */}
      <motion.div
        className="w-full max-w-2xl mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Wand2 className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-medium">
            {t("samples.title")}
          </span>
        </div>
        <div className="flex justify-center gap-4">
          {sampleImages.map((sample, index) => (
            <motion.button
              key={index}
              onClick={() => handleSampleClick(index, sample.url)}
              disabled={loadingSample !== null}
              className={`
                group relative
                w-20 h-20 md:w-24 md:h-24
                rounded-xl overflow-hidden
                border-3 border-foreground
                shadow-[3px_3px_0_var(--foreground)]
                transition-all duration-200
                hover:shadow-[5px_5px_0_var(--foreground)]
                hover:-translate-x-0.5 hover:-translate-y-0.5
                active:shadow-[2px_2px_0_var(--foreground)]
                active:translate-x-0 active:translate-y-0
                ${loadingSample === index ? "animate-pulse" : ""}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src={sample.url}
                alt={`${t("samples.title")} - ${t(sample.labelKey)}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              {/* 悬停遮罩 */}
              <div className="
                absolute inset-0 
                bg-gradient-to-t from-black/70 via-black/20 to-transparent
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
                flex items-end justify-center pb-2
              ">
                <span className="text-white text-xs font-bold px-2 py-0.5 bg-primary text-primary-foreground rounded-full border border-foreground">
                  {t("samples.try")}
                </span>
              </div>
              {/* 加载指示器 */}
              {loadingSample === index && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {/* 序号角标 */}
              <div className="
                absolute -top-1.5 -right-1.5
                w-6 h-6
                bg-accent text-accent-foreground
                border-2 border-foreground
                rounded-full
                flex items-center justify-center
                text-xs font-bold
                shadow-[1px_1px_0_var(--foreground)]
              ">
                {index + 1}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* 特性标签 */}
      <motion.div 
        className="flex flex-wrap justify-center items-center gap-3 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        {[t("tags.fast"), t("tags.local"), t("tags.free"), t("tags.quality")].map((tag, index) => (
          <span 
            key={index}
            className="px-4 py-2 bg-card border-2 border-foreground rounded-lg text-sm font-medium shadow-[2px_2px_0_var(--foreground)]"
          >
            {tag}
          </span>
        ))}
      </motion.div>
    </section>
  )
}
