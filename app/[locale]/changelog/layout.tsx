import type { Metadata } from "next"
import { getMessages } from "next-intl/server"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const messages = await getMessages()
  const t = messages.changelog as Record<string, string>
  const meta = messages.metadata as Record<string, string>

  const siteUrl = "https://clean.picgo.studio"
  const pageUrl = `${siteUrl}/${locale}/changelog`

  return {
    title: locale === "zh" ? "更新日志 - Clean PicGo" : "Changelog - Clean PicGo",
    description: t.description || meta.description,
    alternates: {
      canonical: pageUrl,
      languages: {
        "zh-CN": `${siteUrl}/zh/changelog`,
        "en-US": `${siteUrl}/en/changelog`,
        "x-default": `${siteUrl}/en/changelog`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      url: pageUrl,
      siteName: "Clean PicGo",
      title: locale === "zh" ? "更新日志 - Clean PicGo" : "Changelog - Clean PicGo",
      description: t.description || meta.description,
    },
  }
}

export default function ChangelogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

