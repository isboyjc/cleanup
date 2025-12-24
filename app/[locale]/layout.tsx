import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { Space_Grotesk } from "next/font/google"
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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
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
  
  const keywordsZh = [
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
  ]
  
  const keywordsEn = [
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
  ]

  return {
    title: {
      default: t.title,
      template: `%s | Clean PicGo`
    },
    description: t.description,
    keywords: locale === "zh" ? keywordsZh : keywordsEn,
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
      languages: {
        "zh-CN": `${siteUrl}/zh`,
        "en-US": `${siteUrl}/en`,
        "x-default": `${siteUrl}/en`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      alternateLocale: locale === "zh" ? "en_US" : "zh_CN",
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
    },
    category: "technology",
  }
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

  // 启用静态渲染
  setRequestLocale(locale)

  // 获取消息
  const messages = await getMessages()

  // JSON-LD 结构化数据
  const t = messages.metadata as Record<string, string>
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Clean PicGo",
    "description": t.description,
    "url": "https://clean.picgo.studio",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript, WebGL",
    "softwareVersion": "1.1.0",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Person",
      "name": "isboyjc",
      "url": "https://github.com/isboyjc"
    },
    "inLanguage": locale === "zh" ? "zh-CN" : "en-US",
    "keywords": locale === "zh" 
      ? "去水印,AI去水印,Gemini水印去除,Gemini无损去水印,图片去水印,在线去水印,免费去水印" 
      : "watermark remover,AI watermark remover,Gemini watermark remover,Gemini lossless removal,remove watermark,online watermark remover,free watermark remover"
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* JSON-LD 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
      <body className={`${spaceGrotesk.variable} antialiased`} suppressHydrationWarning>
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
