"use client"

import { motion } from "framer-motion"
import { 
  Cpu, 
  Layers, 
  Cog, 
  Box,
  ArrowRight,
  Image,
  Paintbrush,
  Sparkles
} from "lucide-react"
import { useTranslations } from "next-intl"

export function LamaArchitecture() {
  const t = useTranslations("lamaArchitecture")

  const pipelineSteps = [
    {
      icon: Image,
      titleKey: "pipeline.input.title",
      descKey: "pipeline.input.description",
      color: "bg-primary",
    },
    {
      icon: Paintbrush,
      titleKey: "pipeline.mask.title",
      descKey: "pipeline.mask.description",
      color: "bg-secondary",
    },
    {
      icon: Cpu,
      titleKey: "pipeline.inference.title",
      descKey: "pipeline.inference.description",
      color: "bg-accent",
    },
    {
      icon: Sparkles,
      titleKey: "pipeline.output.title",
      descKey: "pipeline.output.description",
      color: "bg-primary",
    },
  ]

  const techFeatures = [
    {
      icon: Box,
      titleKey: "tech.onnx.title",
      descKey: "tech.onnx.description",
    },
    {
      icon: Cog,
      titleKey: "tech.worker.title",
      descKey: "tech.worker.description",
    },
    {
      icon: Layers,
      titleKey: "tech.wasm.title",
      descKey: "tech.wasm.description",
    },
    {
      icon: Cpu,
      titleKey: "tech.cache.title",
      descKey: "tech.cache.description",
    },
  ]

  return (
    <section className="py-20 px-4 bg-muted/30 relative">
      {/* 装饰背景 */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-foreground" />
      
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* 徽章 */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground border-3 border-foreground rounded-full shadow-[3px_3px_0_var(--foreground)] mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Cpu className="w-5 h-5" />
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

        {/* 处理流水线 */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-center mb-8">{t("pipeline.title")}</h3>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
            {pipelineSteps.map((step, index) => (
              <div key={index} className="flex items-center">
                <motion.div
                  className="bg-card border-3 border-foreground rounded-xl p-4 shadow-[4px_4px_0_var(--foreground)] w-full md:w-48"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <div className={`w-12 h-12 ${step.color} text-foreground border-2 border-foreground rounded-lg flex items-center justify-center mb-3 shadow-[2px_2px_0_var(--foreground)]`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm mb-1">{t(step.titleKey)}</h4>
                  <p className="text-xs text-muted-foreground">{t(step.descKey)}</p>
                </motion.div>
                
                {index < pipelineSteps.length - 1 && (
                  <div className="hidden md:flex items-center px-2">
                    <ArrowRight className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* 技术架构 */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* LaMa 模型介绍 */}
          <motion.div
            className="bg-card border-3 border-foreground rounded-2xl p-6 shadow-[6px_6px_0_var(--foreground)]"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-secondary text-secondary-foreground border-3 border-foreground rounded-xl flex items-center justify-center shadow-[3px_3px_0_var(--foreground)]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{t("lama.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("lama.subtitle")}</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {t("lama.description")}
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>{t("lama.features.fourier")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-secondary rounded-full" />
                <span>{t("lama.features.attention")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span>{t("lama.features.perceptual")}</span>
              </div>
            </div>
          </motion.div>

          {/* ONNX Runtime 技术栈 */}
          <motion.div
            className="bg-card border-3 border-foreground rounded-2xl p-6 shadow-[6px_6px_0_var(--foreground)]"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-accent text-accent-foreground border-3 border-foreground rounded-xl flex items-center justify-center shadow-[3px_3px_0_var(--foreground)]">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{t("runtime.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("runtime.subtitle")}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {techFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-muted border-2 border-foreground rounded-lg p-3"
                >
                  <feature.icon className="w-5 h-5 mb-2 text-muted-foreground" />
                  <h4 className="font-bold text-sm mb-1">{t(feature.titleKey)}</h4>
                  <p className="text-xs text-muted-foreground">{t(feature.descKey)}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 性能指标 */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "~200MB", labelKey: "stats.modelSize" },
              { value: "512×512", labelKey: "stats.inputSize" },
              { value: "2-5s", labelKey: "stats.inferenceTime" },
              { value: "100%", labelKey: "stats.clientSide" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-card border-3 border-foreground rounded-xl p-4 text-center shadow-[3px_3px_0_var(--foreground)]"
              >
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t(stat.labelKey)}
                </div>
              </div>
            ))}
          </div>
          
          {/* 备注说明 */}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            💡 {t("note")}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
