"use client"

import { motion } from "framer-motion"
import { Upload, MousePointerClick, Wand2, Download } from "lucide-react"
import { useTranslations } from "next-intl"

export function HowItWorks() {
  const t = useTranslations("howItWorks")
  
  const steps = [
    {
      icon: Upload,
      titleKey: "steps.upload.title",
      descKey: "steps.upload.description",
      color: "bg-primary text-primary-foreground",
    },
    {
      icon: MousePointerClick,
      titleKey: "steps.select.title",
      descKey: "steps.select.description",
      color: "bg-secondary text-secondary-foreground",
    },
    {
      icon: Wand2,
      titleKey: "steps.process.title",
      descKey: "steps.process.description",
      color: "bg-accent text-accent-foreground",
    },
    {
      icon: Download,
      titleKey: "steps.download.title",
      descKey: "steps.download.description",
      color: "bg-primary text-primary-foreground",
    },
  ]

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
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-accent -z-0 -rotate-1" />
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </p>
        </motion.div>

        <div className="relative">
          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="
                  w-20 h-20 bg-card
                  border-3 border-foreground rounded-2xl 
                  flex items-center justify-center mb-4
                  shadow-[4px_4px_0_var(--foreground)]
                  relative
                ">
                  {/* 步骤数字 */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className={`w-16 h-16 ${step.color} rounded-xl flex items-center justify-center`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2">{t(step.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(step.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
