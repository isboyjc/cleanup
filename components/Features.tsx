"use client"

import { motion } from "framer-motion"
import { 
  Eraser, 
  Zap, 
  Lock, 
  Layers, 
  Download, 
  Eye 
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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

export function Features() {
  const t = useTranslations("features")
  
  const features = [
    {
      icon: Eraser,
      titleKey: "items.smartErase.title",
      descKey: "items.smartErase.description",
      color: "bg-primary text-primary-foreground",
    },
    {
      icon: Zap,
      titleKey: "items.realtime.title",
      descKey: "items.realtime.description",
      color: "bg-secondary text-secondary-foreground",
    },
    {
      icon: Lock,
      titleKey: "items.privacy.title",
      descKey: "items.privacy.description",
      color: "bg-accent text-accent-foreground",
    },
    {
      icon: Layers,
      titleKey: "items.mask.title",
      descKey: "items.mask.description",
      color: "bg-primary text-primary-foreground",
    },
    {
      icon: Eye,
      titleKey: "items.compare.title",
      descKey: "items.compare.description",
      color: "bg-secondary text-secondary-foreground",
    },
    {
      icon: Download,
      titleKey: "items.export.title",
      descKey: "items.export.description",
      color: "bg-accent text-accent-foreground",
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
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full hover:shadow-[6px_6px_0_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200">
                <CardContent className="pt-6">
                  <div className={`w-14 h-14 ${feature.color} border-3 border-foreground rounded-xl flex items-center justify-center mb-4 shadow-[3px_3px_0_var(--foreground)]`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t(feature.titleKey)}</h3>
                  <p className="text-muted-foreground">{t(feature.descKey)}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
