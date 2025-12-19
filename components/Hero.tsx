"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Upload, ImageIcon, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"

interface HeroProps {
  onImageSelect: (file: File) => void
}

export function Hero({ onImageSelect }: HeroProps) {
  const [isDragging, setIsDragging] = useState(false)
  const t = useTranslations("hero")

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

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
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
        <motion.div 
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground border-3 border-foreground rounded-full shadow-[3px_3px_0_var(--foreground)] mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-bold">{t("badge")}</span>
        </motion.div>
        
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
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("description")}
          <br className="hidden md:block" />
          {t("descriptionSub")}
        </p>
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
            <p className="text-sm text-muted-foreground mt-4">
              {t("upload.formats")}
            </p>
          </motion.div>

          {/* 装饰角标 */}
          <div className="absolute -top-3 -right-3 w-12 h-12 bg-accent text-accent-foreground border-3 border-foreground rounded-lg shadow-[2px_2px_0_var(--foreground)] flex items-center justify-center rotate-12">
            <Sparkles className="w-6 h-6" />
          </div>
        </label>
      </motion.div>

      {/* 特性标签 */}
      <motion.div 
        className="flex flex-wrap justify-center gap-4 mt-10"
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
