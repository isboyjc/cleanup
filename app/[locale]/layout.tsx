import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { Space_Grotesk, Noto_Sans_JP, Noto_Sans_KR } from "next/font/google"
import Script from "next/script"
import { notFound } from "next/navigation"
import { locales, type Locale } from "@/i18n/config"
import { ThemeProvider } from "@/components/ThemeProvider"
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister"
import "../globals.css"

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const CF_BEACON_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// 各语言的关键词
const keywordsByLocale: Record<Locale, string[]> = {
  zh: [
    "去水印",
    "AI去水印",
    "Gemini去水印",
    "Gemini水印去除",
    "Gemini水印无损去除",
    "反向Alpha混合",
    "图片去水印",
    "在线去水印",
    "免费去水印",
    "去除水印",
    "水印去除工具",
    "AI水印去除",
    "Midjourney去水印",
    "Stable Diffusion去水印",
    "DALL-E去水印",
    "可灵去水印",
    "即梦去水印",
    "AI生成图片去水印",
    "图片水印去除",
    "文字水印去除",
    "Logo水印去除",
    "图像修复",
    "图片处理",
    "LaMa",
    "智能擦除",
    "一键去水印",
    "批量去水印",
    "高清去水印",
    "无损去水印"
  ],
  en: [
    "watermark remover",
    "AI watermark remover",
    "Gemini watermark remover",
    "Gemini watermark removal",
    "Gemini watermark lossless removal",
    "Reverse Alpha Blending",
    "remove watermark",
    "online watermark remover",
    "free watermark remover",
    "watermark removal tool",
    "AI watermark removal",
    "Midjourney watermark remover",
    "Stable Diffusion watermark remover",
    "DALL-E watermark remover",
    "Kling watermark remover",
    "AI generated image watermark remover",
    "remove image watermark",
    "remove text watermark",
    "remove logo watermark",
    "image inpainting",
    "image processing",
    "LaMa",
    "smart erase",
    "one click watermark remover",
    "batch watermark remover",
    "HD watermark remover",
    "lossless watermark removal"
  ],
  ja: [
    "透かし除去",
    "AI透かし除去",
    "Gemini透かし除去",
    "Gemini透かし削除",
    "Gemini透かしロスレス除去",
    "逆アルファブレンド",
    "透かしを消す",
    "オンライン透かし除去",
    "無料透かし除去",
    "透かし除去ツール",
    "AI透かし削除",
    "Midjourney透かし除去",
    "Stable Diffusion透かし除去",
    "DALL-E透かし除去",
    "AI生成画像透かし除去",
    "画像透かし除去",
    "テキスト透かし除去",
    "ロゴ透かし除去",
    "画像インペインティング",
    "画像処理",
    "LaMa",
    "スマート消去",
    "ワンクリック透かし除去",
    "HD透かし除去",
    "ロスレス透かし除去"
  ],
  ko: [
    "워터마크 제거",
    "AI 워터마크 제거",
    "Gemini 워터마크 제거",
    "Gemini 워터마크 삭제",
    "Gemini 워터마크 무손실 제거",
    "역 알파 블렌딩",
    "워터마크 지우기",
    "온라인 워터마크 제거",
    "무료 워터마크 제거",
    "워터마크 제거 도구",
    "AI 워터마크 삭제",
    "Midjourney 워터마크 제거",
    "Stable Diffusion 워터마크 제거",
    "DALL-E 워터마크 제거",
    "AI 생성 이미지 워터마크 제거",
    "이미지 워터마크 제거",
    "텍스트 워터마크 제거",
    "로고 워터마크 제거",
    "이미지 인페인팅",
    "이미지 처리",
    "LaMa",
    "스마트 지우기",
    "원클릭 워터마크 제거",
    "HD 워터마크 제거",
    "무손실 워터마크 제거"
  ],
  ru: [
    "удаление водяных знаков",
    "AI удаление водяных знаков",
    "Gemini удаление водяных знаков",
    "удалить водяной знак Gemini",
    "Gemini без потерь",
    "обратное альфа смешивание",
    "убрать водяной знак",
    "онлайн удаление водяных знаков",
    "бесплатное удаление водяных знаков",
    "инструмент удаления водяных знаков",
    "AI удалить водяной знак",
    "Midjourney удалить водяной знак",
    "Stable Diffusion удалить водяной знак",
    "DALL-E удалить водяной знак",
    "удалить водяной знак AI изображения",
    "удалить водяной знак с фото",
    "удалить текстовый водяной знак",
    "удалить логотип водяной знак",
    "восстановление изображений",
    "обработка изображений",
    "LaMa",
    "умное стирание",
    "удаление водяных знаков в один клик",
    "HD удаление водяных знаков",
    "удаление водяных знаков без потерь"
  ]
}

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const messages = await getMessages()
  const t = messages.metadata as Record<string, string>

  const siteUrl = "https://clean.picgo.studio"
  const currentLocale = locale as Locale

  // 生成 alternates languages
  const alternateLanguages = Object.fromEntries(
    locales.map((l) => [localeToLanguageCode[l], `${siteUrl}/${l}`])
  )
  alternateLanguages["x-default"] = `${siteUrl}/en`

  // 生成 alternateLocales for OpenGraph
  const alternateOGLocales = locales
    .filter((l) => l !== currentLocale)
    .map((l) => localeToOGLocale[l])

  return {
    title: {
      default: t.title,
      template: `%s | Clean PicGo`
    },
    description: t.description,
    keywords: keywordsByLocale[currentLocale],
    authors: [{ name: "isboyjc", url: "https://github.com/isboyjc" }],
    creator: "isboyjc",
    publisher: "Clean PicGo",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [
        { url: "/apple-icon.svg", type: "image/svg+xml" },
        { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
        { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      ],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Clean PicGo",
    },
    formatDetection: {
      telephone: false,
    },
    other: {
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "application-name": "Clean PicGo",
      "apple-mobile-web-app-title": "Clean PicGo",
      "msapplication-TileColor": "#1A1A1A",
      "msapplication-tap-highlight": "no",
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: alternateLanguages,
    },
    openGraph: {
      type: "website",
      locale: localeToOGLocale[currentLocale],
      alternateLocale: alternateOGLocales,
      url: siteUrl,
      siteName: "Clean PicGo",
      title: t.title,
      description: t.description,
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
      site: "@isboyjc",
      creator: "@isboyjc",
    },
    verification: {
      google: "_CvOg3BEbVhWAo6RtzmbLyEAkUD18obxJRXoe_JO1YU",
      yandex: "9cd39a330c743807",
      other: {
        "msvalidate.01": "245A3684B14E9358CC55A271164D378E",
      },
    },
    category: "technology",
  }
}

// 获取语言对应的特性列表
function getFeatureList(locale: Locale): string[] {
  const featureLists: Record<Locale, string[]> = {
    zh: ["AI智能去水印", "Gemini水印无损去除", "本地浏览器处理", "完全免费", "支持撤销重做", "多格式支持"],
    en: ["AI Smart Watermark Removal", "Gemini Lossless Removal", "Local Browser Processing", "Completely Free", "Undo/Redo Support", "Multi-format Support"],
    ja: ["AIスマート透かし除去", "Geminiロスレス除去", "ローカルブラウザ処理", "完全無料", "元に戻す/やり直しサポート", "マルチフォーマットサポート"],
    ko: ["AI 스마트 워터마크 제거", "Gemini 무손실 제거", "로컬 브라우저 처리", "완전 무료", "실행 취소/다시 실행 지원", "다중 포맷 지원"],
    ru: ["AI умное удаление водяных знаков", "Gemini без потерь", "Локальная обработка в браузере", "Полностью бесплатно", "Поддержка отмены/повтора", "Мульти-формат поддержка"]
  }
  return featureLists[locale]
}

// 获取语言对应的关键词字符串
function getKeywordsString(locale: Locale): string {
  const keywordsStrings: Record<Locale, string> = {
    zh: "去水印,AI去水印,Gemini水印去除,Gemini无损去水印,图片去水印,在线去水印,免费去水印",
    en: "watermark remover,AI watermark remover,Gemini watermark remover,Gemini lossless removal,remove watermark,online watermark remover,free watermark remover",
    ja: "透かし除去,AI透かし除去,Gemini透かし除去,Geminiロスレス除去,オンライン透かし除去,無料透かし除去",
    ko: "워터마크 제거,AI 워터마크 제거,Gemini 워터마크 제거,Gemini 무손실 제거,온라인 워터마크 제거,무료 워터마크 제거",
    ru: "удаление водяных знаков,AI удаление водяных знаков,Gemini удаление водяных знаков,Gemini без потерь,онлайн удаление водяных знаков"
  }
  return keywordsStrings[locale]
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  // 验证 locale
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  const currentLocale = locale as Locale

  // 启用静态渲染
  setRequestLocale(locale)

  // 获取消息
  const messages = await getMessages()

  // JSON-LD 结构化数据
  const t = messages.metadata as Record<string, string>
  const siteUrl = "https://clean.picgo.studio"
  
  // WebApplication Schema
  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Clean PicGo",
    "description": t.description,
    "url": siteUrl,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript, WebGL",
    "softwareVersion": "1.1.0",
    "screenshot": `${siteUrl}/screenshots/desktop.png`,
    "featureList": getFeatureList(currentLocale),
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "126",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Person",
      "name": "isboyjc",
      "url": "https://github.com/isboyjc"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Clean PicGo",
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/icons/icon-512x512.png`
      }
    },
    "inLanguage": localeToLanguageCode[currentLocale],
    "keywords": getKeywordsString(currentLocale)
  }
  
  // Organization Schema
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Clean PicGo",
    "url": siteUrl,
    "logo": `${siteUrl}/icons/icon-512x512.png`,
    "sameAs": [
      "https://github.com/isboyjc/cleanup",
      "https://twitter.com/isboyjc"
    ]
  }

  // 根据语言选择合适的字体类
  const fontClasses = `${spaceGrotesk.variable} ${notoSansJP.variable} ${notoSansKR.variable}`

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* JSON-LD 结构化数据 - WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        />
        {/* JSON-LD 结构化数据 - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* 预连接关键域名 */}
        <link rel="dns-prefetch" href="https://cdn.isboyjc.com" />
        <link rel="preconnect" href="https://cdn.isboyjc.com" crossOrigin="anonymous" />
        {/* Google Fonts 预连接 - 需要同时连接 fonts.googleapis.com 和 fonts.gstatic.com */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* PWA Theme Color - 支持明暗模式 */}
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fffbeb" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1A1A1A" />
        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
        {/* Cloudflare Web Analytics */}
        {CF_BEACON_TOKEN && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${CF_BEACON_TOKEN}"}`}
            strategy="afterInteractive"
          />
        )}
        {/* 防止主题闪烁的脚本 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = theme === 'dark' || (theme !== 'light' && systemDark);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${fontClasses} antialiased`} suppressHydrationWarning>
        <ServiceWorkerRegister />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
