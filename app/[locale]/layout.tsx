import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { Space_Grotesk } from "next/font/google"
import { notFound } from "next/navigation"
import { locales, type Locale } from "@/i18n/config"
import { ThemeProvider } from "@/components/ThemeProvider"
import "../globals.css"

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
      template: `%s | Clean PigGo`
    },
    description: t.description,
    keywords: locale === "zh" ? keywordsZh : keywordsEn,
    authors: [{ name: "isboyjc", url: "https://github.com/isboyjc" }],
    creator: "isboyjc",
    publisher: "Clean PigGo",
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
      ],
      apple: [
        { url: "/apple-icon.svg", type: "image/svg+xml" },
      ],
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: siteUrl,
      languages: {
        "zh-CN": `${siteUrl}/zh`,
        "en-US": `${siteUrl}/en`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      alternateLocale: locale === "zh" ? "en_US" : "zh_CN",
      url: siteUrl,
      siteName: "Clean PigGo",
      title: t.title,
      description: t.description,
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Clean PigGo - AI Watermark Remover",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
      creator: "@isboyjc",
      images: [`${siteUrl}/og-image.png`],
    },
    verification: {
      // google: "your-google-verification-code",
      // yandex: "your-yandex-verification-code",
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

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
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
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
