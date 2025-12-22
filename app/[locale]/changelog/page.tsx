"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Tag, Sparkles, Zap, Bug, Wrench } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

interface VersionMeta {
  version: string
  date: string
  type: "major" | "minor" | "patch"
  translationKey: string
}

const versionsMeta: VersionMeta[] = [
  {
    version: "1.1.0",
    date: "2025-01-15",
    type: "minor",
    translationKey: "v1_1_0"
  },
  {
    version: "1.0.0",
    date: "2025-01-01",
    type: "major",
    translationKey: "v1_0_0"
  }
]

function getChangeIcon(type: string) {
  switch (type) {
    case "feature":
      return <Sparkles className="w-4 h-4" />
    case "improvement":
      return <Zap className="w-4 h-4" />
    case "fix":
      return <Bug className="w-4 h-4" />
    default:
      return <Wrench className="w-4 h-4" />
  }
}

function getChangeColor(type: string) {
  switch (type) {
    case "feature":
      return "bg-primary text-primary-foreground"
    case "improvement":
      return "bg-secondary text-secondary-foreground"
    case "fix":
      return "bg-accent text-accent-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function getVersionColor(type: string) {
  switch (type) {
    case "major":
      return "bg-primary text-primary-foreground"
    case "minor":
      return "bg-secondary text-secondary-foreground"
    default:
      return "bg-accent text-accent-foreground"
  }
}

export default function ChangelogPage() {
  const t = useTranslations("changelog")
  
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="py-30 px-4">
        <div className="max-w-3xl mx-auto">
          {/* 返回按钮 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-card border-2 border-foreground rounded-lg shadow-brutal-sm hover:shadow-[3px_3px_0_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("back")}
            </Link>
          </motion.div>

          {/* 标题 */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("title")}
              <span className="relative inline-block mx-2">
                <span className="relative z-10">{t("highlight")}</span>
                <span className="absolute -bottom-1 left-0 right-0 h-3 bg-accent z-0 -rotate-1" />
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {t("description")}
            </p>
          </motion.div>

          {/* 更新日志列表 */}
          <div className="space-y-8">
            {versionsMeta.map((entry, index) => {
              const changes = t.raw(`versions.${entry.translationKey}.changes`) as Array<{type: string, text: string}>
              
              return (
                <motion.div
                  key={entry.version}
                  className="bg-card border-3 border-foreground rounded-xl shadow-brutal overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {/* 版本头部 */}
                  <div className="px-6 py-4 border-b-3 border-foreground bg-muted/50 flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 text-sm font-bold rounded-lg border-2 border-foreground ${getVersionColor(entry.type)}`}>
                      v{entry.version}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {entry.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs px-2 py-1 bg-card border border-foreground/30 rounded">
                      <Tag className="w-3 h-3" />
                      {entry.type === "major" ? t("types.major") : entry.type === "minor" ? t("types.minor") : t("types.patch")}
                    </span>
                  </div>

                  {/* 更新内容 */}
                  <div className="px-6 py-4 space-y-3">
                    {changes.map((change, changeIndex) => (
                      <div key={changeIndex} className="flex items-start gap-3">
                        <span className={`w-6 h-6 flex items-center justify-center rounded ${getChangeColor(change.type)} shrink-0 mt-0.5`}>
                          {getChangeIcon(change.type)}
                        </span>
                        <span className="text-sm">{change.text}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* 底部提示 */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm text-muted-foreground">
              {t("moreUpdates")}{" "}
              <a
                href="https://github.com/isboyjc/cleanup/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-bold hover:underline"
              >
                GitHub Releases
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
