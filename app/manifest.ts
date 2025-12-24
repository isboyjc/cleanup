import type { MetadataRoute } from "next"
import { headers, cookies } from "next/headers"

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // 尝试从多个来源获取语言偏好
  const headersList = await headers()
  const cookieStore = await cookies()
  
  // 1. 从 cookie 获取（next-intl 设置的）
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value
  
  // 2. 从 Accept-Language header 获取
  const acceptLanguage = headersList.get("accept-language") || ""
  const prefersChinese = acceptLanguage.toLowerCase().includes("zh")
  
  // 3. 从 referer 获取（如果用户从 /zh 或 /en 页面请求）
  const referer = headersList.get("referer") || ""
  const refererHasZh = referer.includes("/zh")
  const refererHasEn = referer.includes("/en")
  
  // 确定语言
  let isZh = false
  if (localeCookie) {
    isZh = localeCookie === "zh"
  } else if (refererHasZh || refererHasEn) {
    isZh = refererHasZh
  } else {
    isZh = prefersChinese
  }

  return {
    name: "Clean PicGo",
    short_name: "Clean PicGo",
    description: isZh
      ? "AI去水印 · 图片擦除 · Gemini水印无损去除"
      : "AI Watermark Remover · Image Eraser · Gemini Lossless",
    start_url: "/",
    id: "/",
    display: "standalone",
    background_color: "#1A1A1A",
    theme_color: "#1A1A1A",
    orientation: "portrait-primary",
    scope: "/",
    lang: isZh ? "zh-CN" : "en-US",
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
