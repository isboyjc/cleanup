import type { MetadataRoute } from "next"
import { locales } from "@/i18n/config"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://clean.picgo.studio"
  const lastModified = new Date()

  // 生成所有语言的主页
  const homePages: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 1,
  }))

  // 生成所有语言的更新日志页面
  const changelogPages: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${baseUrl}/${locale}/changelog`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.5,
  }))

  return [...homePages, ...changelogPages]
}

