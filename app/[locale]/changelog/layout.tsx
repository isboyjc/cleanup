import type { Metadata } from "next"
import { getMessages } from "next-intl/server"
import { locales, type Locale } from "@/i18n/config"

// 语言代码映射
const localeToLanguageCode: Record<Locale, string> = {
  zh: "zh-CN",
  en: "en-US",
  ja: "ja-JP",
  ko: "ko-KR",
  ru: "ru-RU"
}

// OpenGraph locale 映射
const localeToOGLocale: Record<Locale, string> = {
  zh: "zh_CN",
  en: "en_US",
  ja: "ja_JP",
  ko: "ko_KR",
  ru: "ru_RU"
}

// 各语言的更新日志标题
const changelogTitles: Record<Locale, string> = {
  zh: "更新日志 - Clean PicGo",
  en: "Changelog - Clean PicGo",
  ja: "更新履歴 - Clean PicGo",
  ko: "변경 로그 - Clean PicGo",
  ru: "Журнал изменений - Clean PicGo"
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const currentLocale = locale as Locale
  const messages = await getMessages()
  const t = messages.changelog as Record<string, string>
  const meta = messages.metadata as Record<string, string>

  const siteUrl = "https://clean.picgo.studio"
  const pageUrl = `${siteUrl}/${locale}/changelog`

  // 生成 alternates languages
  const alternateLanguages = Object.fromEntries(
    locales.map((l) => [localeToLanguageCode[l], `${siteUrl}/${l}/changelog`])
  )
  alternateLanguages["x-default"] = `${siteUrl}/en/changelog`

  return {
    title: changelogTitles[currentLocale],
    description: t.description || meta.description,
    alternates: {
      canonical: pageUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      type: "website",
      locale: localeToOGLocale[currentLocale],
      url: pageUrl,
      siteName: "Clean PicGo",
      title: changelogTitles[currentLocale],
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
