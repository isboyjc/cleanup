"use client"

import { motion } from "framer-motion"
import { Zap, Sparkles, Timer, Undo2, Shield } from "lucide-react"
import { useTranslations } from "next-intl"

export function GeminiFeature() {
  const t = useTranslations("geminiFeature")

  const features = [
    {
      icon: Sparkles,
      titleKey: "items.autoDetect.title",
      descKey: "items.autoDetect.description",
    },
    {
      icon: Timer,
      titleKey: "items.instant.title",
      descKey: "items.instant.description",
    },
    {
      icon: Shield,
      titleKey: "items.lossless.title",
      descKey: "items.lossless.description",
    },
    {
      icon: Undo2,
      titleKey: "items.undoable.title",
      descKey: "items.undoable.description",
    },
  ]

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Gemini 徽章 */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground border-3 border-foreground rounded-full shadow-[3px_3px_0_var(--foreground)] mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Zap className="w-5 h-5 fill-current" />
            <span className="text-sm font-bold">{t("badge")}</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t("title")}
            <span className="relative inline-block mx-2">
              <span className="relative z-10">{t("highlight")}</span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-primary -z-0 -rotate-1" />
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </p>
        </motion.div>

        {/* 主要内容区 */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* 左侧：特性列表 */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4 p-4 bg-card border-3 border-foreground rounded-xl shadow-[3px_3px_0_var(--foreground)] hover:shadow-[5px_5px_0_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <div className="w-10 h-10 bg-primary text-primary-foreground border-2 border-foreground rounded-lg flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0_var(--foreground)]">
                  <feature.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{t(feature.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(feature.descKey)}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* 右侧：算法说明卡片 */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-card border-3 border-foreground rounded-2xl p-6 shadow-[6px_6px_0_var(--foreground)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-accent text-accent-foreground border-3 border-foreground rounded-xl flex items-center justify-center shadow-[3px_3px_0_var(--foreground)]">
                  <Zap className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{t("algorithm.title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("algorithm.subtitle")}</p>
                </div>
              </div>

              {/* 公式展示 */}
              <div className="bg-muted border-2 border-foreground rounded-lg p-4 mb-4 font-mono text-sm">
                <p className="text-muted-foreground mb-2">{t("algorithm.watermarkFormula")}</p>
                <code className="block text-foreground">watermarked = α × 255 + (1 - α) × original</code>
                <p className="text-muted-foreground mt-4 mb-2">{t("algorithm.reverseFormula")}</p>
                <code className="block text-foreground">original = (watermarked - α × 255) / (1 - α)</code>
              </div>

              <p className="text-sm text-muted-foreground">
                {t("algorithm.description")}
              </p>

              {/* 来源说明 */}
              <div className="mt-4 pt-4 border-t-2 border-foreground/20">
                <p className="text-xs text-muted-foreground">
                  {t("algorithm.credit")}{" "}
                  <a
                    href="https://github.com/journey-ad/gemini-watermark-remover"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-bold hover:underline"
                  >
                    gemini-watermark-remover
                  </a>
                </p>
              </div>
            </div>

            {/* 装饰元素 */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-secondary text-secondary-foreground border-3 border-foreground rounded-xl shadow-[3px_3px_0_var(--foreground)] flex items-center justify-center rotate-12">
              <span className="text-2xl font-bold">⚡</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

