import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://clean.picgo.studio"
  const lastModified = new Date()

  return [
    // 主页 - 英文
    {
      url: `${baseUrl}/en`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    // 主页 - 中文
    {
      url: `${baseUrl}/zh`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    // Changelog - 英文
    {
      url: `${baseUrl}/en/changelog`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // Changelog - 中文
    {
      url: `${baseUrl}/zh/changelog`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]
}

