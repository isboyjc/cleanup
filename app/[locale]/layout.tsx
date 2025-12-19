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

  return {
    title: t.title,
    description: t.description,
    keywords: locale === "zh" 
      ? ["去水印", "图片处理", "AI", "图像修复", "LaMa"]
      : ["watermark remover", "image processing", "AI", "image inpainting", "LaMa"],
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: [
        { url: "/apple-icon.svg", type: "image/svg+xml" },
      ],
    },
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
