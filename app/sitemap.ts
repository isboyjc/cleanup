import type { MetadataRoute } from "next"
import { locales } from "@/i18n/config"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://clean.picgo.studio"
  const lastModified = new Date()

  // 生成所有语言的主页
  const homePages = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l === 'zh' ? 'zh-CN' : l === 'en' ? 'en-US' : l === 'ja' ? 'ja-JP' : l === 'ko' ? 'ko-KR' : 'ru-RU', `${baseUrl}/${l}`])
      ),
    },
  }))

  // 生成所有语言的更新日志页面
  const changelogPages = locales.map((locale) => ({
    url: `${baseUrl}/${locale}/changelog`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.5,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l === 'zh' ? 'zh-CN' : l === 'en' ? 'en-US' : l === 'ja' ? 'ja-JP' : l === 'ko' ? 'ko-KR' : 'ru-RU', `${baseUrl}/${l}/changelog`])
      ),
    },
  }))

  return [...homePages, ...changelogPages]
}
