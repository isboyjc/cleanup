"use client"

import { motion } from "framer-motion"
import { Upload, MousePointerClick, Wand2, Download, Zap, Undo2, Eye } from "lucide-react"
import { useTranslations } from "next-intl"

export function HowItWorks() {
  const t = useTranslations("howItWorks")

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t("title")}
            <span className="relative inline-block mx-2">
              <span className="relative z-10">{t("highlight")}</span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-accent z-0 -rotate-1" />
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </p>
        </motion.div>

        {/* 主流程 */}
        <div className="relative">
          {/* Step 1: 上传 */}
          <motion.div
            className="flex flex-col items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 bg-card border-3 border-foreground rounded-2xl flex items-center justify-center shadow-[4px_4px_0_var(--foreground)] relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-xl flex items-center justify-center">
                <Upload className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-lg font-bold mt-4 mb-2">{t("steps.upload.title")}</h3>
            <p className="text-sm text-muted-foreground text-center max-w-xs">{t("steps.upload.description")}</p>
          </motion.div>

          {/* 分支指示器 */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-muted border-2 border-foreground rounded-full shadow-[2px_2px_0_var(--foreground)]">
              <span className="text-sm font-bold">{t("branch.title")}</span>
            </div>
          </motion.div>

          {/* 两个分支 */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* 左分支：Gemini 自动流程 */}
            <motion.div
              className="bg-primary/10 border-3 border-foreground rounded-2xl p-6 shadow-[4px_4px_0_var(--foreground)]"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary text-primary-foreground border-2 border-foreground rounded-lg flex items-center justify-center shadow-[2px_2px_0_var(--foreground)]">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="font-bold">{t("branch.gemini.title")}</h4>
                  <p className="text-xs text-muted-foreground">{t("branch.gemini.subtitle")}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* 步骤 2A：自动检测 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground border-2 border-foreground rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">{t("steps.autoDetect.title")}</h5>
                    <p className="text-xs text-muted-foreground">{t("steps.autoDetect.description")}</p>
                  </div>
                </div>

                {/* 步骤 3A：可回退 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground border-2 border-foreground rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">{t("steps.undoable.title")}</h5>
                    <p className="text-xs text-muted-foreground">{t("steps.undoable.description")}</p>
                  </div>
                </div>

                {/* 步骤 4A：继续编辑 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground border-2 border-foreground rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    4
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">{t("steps.continueEdit.title")}</h5>
                    <p className="text-xs text-muted-foreground">{t("steps.continueEdit.description")}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 右分支：通用 AI 流程 */}
            <motion.div
              className="bg-secondary/10 border-3 border-foreground rounded-2xl p-6 shadow-[4px_4px_0_var(--foreground)]"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-secondary text-secondary-foreground border-2 border-foreground rounded-lg flex items-center justify-center shadow-[2px_2px_0_var(--foreground)]">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold">{t("branch.ai.title")}</h4>
                  <p className="text-xs text-muted-foreground">{t("branch.ai.subtitle")}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* 步骤 2B：选择区域 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-secondary text-secondary-foreground border-2 border-foreground rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">{t("steps.select.title")}</h5>
                    <p className="text-xs text-muted-foreground">{t("steps.select.description")}</p>
                  </div>
                </div>

                {/* 步骤 3B：AI 处理 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-secondary text-secondary-foreground border-2 border-foreground rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">{t("steps.process.title")}</h5>
                    <p className="text-xs text-muted-foreground">{t("steps.process.description")}</p>
                  </div>
                </div>

                {/* 步骤 4B：预览对比 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-secondary text-secondary-foreground border-2 border-foreground rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    4
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">{t("steps.compare.title")}</h5>
                    <p className="text-xs text-muted-foreground">{t("steps.compare.description")}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 汇合：下载 */}
          <motion.div
            className="flex flex-col items-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {/* 汇合线 */}
            <div className="w-px h-8 bg-foreground/30 mb-4" />
            
            <div className="w-20 h-20 bg-card border-3 border-foreground rounded-2xl flex items-center justify-center shadow-[4px_4px_0_var(--foreground)] relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-accent text-accent-foreground border-2 border-foreground rounded-full flex items-center justify-center font-bold text-sm">
                5
              </div>
              <div className="w-16 h-16 bg-accent text-accent-foreground rounded-xl flex items-center justify-center">
                <Download className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-lg font-bold mt-4 mb-2">{t("steps.download.title")}</h3>
            <p className="text-sm text-muted-foreground text-center max-w-xs">{t("steps.download.description")}</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
