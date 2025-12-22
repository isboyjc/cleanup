"use client"

import { motion } from "framer-motion"
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Layers,
  Smartphone,
  Globe,
  Paintbrush,
  History
} from "lucide-react"
import { useTranslations } from "next-intl"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function Capabilities() {
  const t = useTranslations("capabilities")
  
  const capabilities = [
    {
      icon: Sparkles,
      titleKey: "items.aiPowered.title",
      descKey: "items.aiPowered.description",
      color: "bg-primary text-primary-foreground",
      badge: null,
    },
    {
      icon: Zap,
      titleKey: "items.geminiOptimized.title",
      descKey: "items.geminiOptimized.description",
      color: "bg-primary text-primary-foreground",
      badge: null,
    },
    {
      icon: Shield,
      titleKey: "items.privacy.title",
      descKey: "items.privacy.description",
      color: "bg-accent text-accent-foreground",
      badge: null,
    },
    {
      icon: Globe,
      titleKey: "items.noCost.title",
      descKey: "items.noCost.description",
      color: "bg-secondary text-secondary-foreground",
      badge: null,
    },
    {
      icon: Paintbrush,
      titleKey: "items.preciseControl.title",
      descKey: "items.preciseControl.description",
      color: "bg-secondary text-secondary-foreground",
      badge: null,
    },
    {
      icon: History,
      titleKey: "items.undoRedo.title",
      descKey: "items.undoRedo.description",
      color: "bg-accent text-accent-foreground",
      badge: null,
    },
    {
      icon: Layers,
      titleKey: "items.multiFormat.title",
      descKey: "items.multiFormat.description",
      color: "bg-primary text-primary-foreground",
      badge: null,
    },
    {
      icon: Smartphone,
      titleKey: "items.crossPlatform.title",
      descKey: "items.crossPlatform.description",
      color: "bg-secondary text-secondary-foreground",
      badge: "PWA",
    },
  ]

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
      </div>
      
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground border-3 border-foreground rounded-full shadow-[3px_3px_0_var(--foreground)] mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-bold">{t("badge")}</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t("title")}
            <span className="relative inline-block mx-2">
              <span className="relative z-10">{t("highlight")}</span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-secondary -z-0 rotate-1" />
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </p>
        </motion.div>

        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {capabilities.map((cap, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="group"
            >
              <div className="h-full bg-card border-3 border-foreground rounded-xl p-5 shadow-[3px_3px_0_var(--foreground)] hover:shadow-[5px_5px_0_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 relative">
                {/* PWA 徽章 */}
                {cap.badge && (
                  <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-accent text-accent-foreground text-xs font-bold border-2 border-foreground rounded-md shadow-[1px_1px_0_var(--foreground)] rotate-6">
                    {cap.badge}
                  </div>
                )}
                <div className={`w-12 h-12 ${cap.color} border-2 border-foreground rounded-lg flex items-center justify-center mb-4 shadow-[2px_2px_0_var(--foreground)] group-hover:scale-110 transition-transform`}>
                  <cap.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2">{t(cap.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(cap.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

