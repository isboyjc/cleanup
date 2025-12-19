"use client"

import { Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "./ThemeProvider"
import { Button } from "./ui/button"
import { useTranslations } from "next-intl"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const t = useTranslations("theme")

  // 确保客户端挂载后才渲染动态内容
  useEffect(() => {
    setMounted(true)
  }, [])

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const themes = [
    { value: "light" as const, icon: Sun, label: t("light") },
    { value: "dark" as const, icon: Moon, label: t("dark") },
    { value: "system" as const, icon: Monitor, label: t("system") },
  ]

  // 在客户端挂载前始终显示 Sun 图标以保持一致性
  const CurrentIcon = mounted && resolvedTheme === "dark" ? Moon : Sun

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => setIsOpen(!isOpen)}
        className="brutal-border-2 brutal-shadow-sm brutal-hover"
        aria-label={t("toggle")}
      >
        <CurrentIcon className="w-4 h-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 py-1 w-36 bg-card brutal-border-2 brutal-shadow rounded-lg z-50"
          >
            {themes.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => {
                  setTheme(value)
                  setIsOpen(false)
                }}
                className={`
                  flex items-center gap-2 w-full px-3 py-2 text-sm font-medium
                  transition-colors hover:bg-muted
                  ${theme === value ? "text-primary" : "text-foreground"}
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {theme === value && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
