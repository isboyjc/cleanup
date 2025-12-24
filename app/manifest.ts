import type { MetadataRoute } from "next"
import { headers, cookies } from "next/headers"
import { locales, type Locale } from "@/i18n/config"

// 各语言的描述
const descriptionsByLocale: Record<Locale, string> = {
  zh: "AI去水印 · 图片擦除 · Gemini水印无损去除",
  en: "AI Watermark Remover · Image Eraser · Gemini Lossless",
  ja: "AI透かし除去 · 画像消しゴム · Geminiロスレス",
  ko: "AI 워터마크 제거 · 이미지 지우개 · Gemini 무손실",
  ru: "AI удаление водяных знаков · Ластик · Gemini без потерь"
}

// 语言代码映射
const localeToLangCode: Record<Locale, string> = {
  zh: "zh-CN",
  en: "en-US",
  ja: "ja-JP",
  ko: "ko-KR",
  ru: "ru-RU"
}

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // 尝试从多个来源获取语言偏好
  const headersList = await headers()
  const cookieStore = await cookies()
  
  // 1. 从 cookie 获取（next-intl 设置的）
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value
  
  // 2. 从 Accept-Language header 获取
  const acceptLanguage = headersList.get("accept-language") || ""
  
  // 3. 从 referer 获取（如果用户从特定语言页面请求）
  const referer = headersList.get("referer") || ""
  
  // 确定语言
  let detectedLocale: Locale = "en" // 默认英文
  
  if (localeCookie && locales.includes(localeCookie as Locale)) {
    detectedLocale = localeCookie as Locale
  } else {
    // 检查 referer 中是否有语言路径
    for (const loc of locales) {
      if (referer.includes(`/${loc}`)) {
        detectedLocale = loc
        break
      }
    }
    
    // 如果没有从 referer 检测到，使用 Accept-Language
    if (detectedLocale === "en") {
      const langLower = acceptLanguage.toLowerCase()
      if (langLower.includes("zh")) {
        detectedLocale = "zh"
      } else if (langLower.includes("ja")) {
        detectedLocale = "ja"
      } else if (langLower.includes("ko")) {
        detectedLocale = "ko"
      } else if (langLower.includes("ru")) {
        detectedLocale = "ru"
      }
    }
  }

  return {
    name: "Clean PicGo",
    short_name: "Clean PicGo",
    description: descriptionsByLocale[detectedLocale],
    start_url: "/",
    id: "/",
    display: "standalone",
    background_color: "#1A1A1A",
    theme_color: "#1A1A1A",
    orientation: "portrait-primary",
    scope: "/",
    lang: localeToLangCode[detectedLocale],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
