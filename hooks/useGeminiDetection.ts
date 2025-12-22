"use client"

import { useCallback, useSyncExternalStore } from "react"

const STORAGE_KEY = "gemini-watermark-detection-enabled"
const DEFAULT_ENABLED = true

// 用于同步外部存储的订阅器
let listeners: Array<() => void> = []

function subscribe(listener: () => void) {
  listeners = [...listeners, listener]
  return () => {
    listeners = listeners.filter(l => l !== listener)
  }
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return DEFAULT_ENABLED
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored !== null ? stored === "true" : DEFAULT_ENABLED
  } catch {
    return DEFAULT_ENABLED
  }
}

function getServerSnapshot(): boolean {
  return DEFAULT_ENABLED
}

/**
 * Gemini 水印检测开关 Hook
 * 
 * - 状态存储在 localStorage 中
 * - 默认开启
 * - 支持跨组件共享状态
 */
export function useGeminiDetection() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  // 更新状态并保存到 localStorage
  const setEnabled = useCallback((value: boolean) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, String(value))
        // 通知所有订阅者
        listeners.forEach(listener => listener())
      } catch {
        // localStorage 不可用时静默失败
      }
    }
  }, [])

  // 切换状态
  const toggle = useCallback(() => {
    setEnabled(!enabled)
  }, [enabled, setEnabled])

  // isLoaded 在客户端始终为 true（useSyncExternalStore 处理了 hydration）
  const isLoaded = typeof window !== "undefined"

  return {
    enabled,
    setEnabled,
    toggle,
    isLoaded,
  }
}

/**
 * 单独获取 Gemini 检测状态（用于不需要响应式更新的场景）
 */
export function getGeminiDetectionEnabled(): boolean {
  if (typeof window === "undefined") return DEFAULT_ENABLED
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored !== null ? stored === "true" : DEFAULT_ENABLED
  } catch {
    return DEFAULT_ENABLED
  }
}

