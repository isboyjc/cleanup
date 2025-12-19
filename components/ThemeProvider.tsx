"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")
  const [mounted, setMounted] = useState(false)

  // 获取系统主题
  const getSystemTheme = useCallback((): "light" | "dark" => {
    if (typeof window === "undefined") return "light"
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }, [])

  // 应用主题到 DOM
  const applyTheme = useCallback((newResolvedTheme: "light" | "dark") => {
    const root = document.documentElement
    if (newResolvedTheme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    setResolvedTheme(newResolvedTheme)
  }, [])

  // 设置主题
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)
    
    const resolved = newTheme === "system" ? getSystemTheme() : newTheme
    applyTheme(resolved)
  }, [getSystemTheme, applyTheme])

  // 初始化 - 仅在客户端执行
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null
    const initialTheme = savedTheme || "system"
    setThemeState(initialTheme)
    
    const resolved = initialTheme === "system" ? getSystemTheme() : initialTheme
    applyTheme(resolved)
    setMounted(true)
  }, [getSystemTheme, applyTheme])

  // 监听系统主题变化
  useEffect(() => {
    if (!mounted) return
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    
    const handleChange = () => {
      if (theme === "system") {
        applyTheme(getSystemTheme())
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, mounted, getSystemTheme, applyTheme])

  // 提供一致的初始值以避免 hydration 不匹配
  const value = {
    theme: mounted ? theme : "system",
    setTheme,
    resolvedTheme: mounted ? resolvedTheme : "light",
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
