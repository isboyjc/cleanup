import type { MetadataRoute } from "next"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function manifest({ params }: Props): Promise<MetadataRoute.Manifest> {
  const { locale } = await params
  const isZh = locale === "zh"

  return {
    name: "Clean PigGo",
    short_name: "Clean PigGo",
    description: isZh
      ? "AI 驱动的免费在线图片去水印工具，支持去除各类 AI 水印、图片水印、文字水印"
      : "AI-powered free online watermark remover. Remove AI watermarks, image watermarks, and text watermarks.",
    start_url: `/${locale}`,
    id: `/${locale}`,
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
