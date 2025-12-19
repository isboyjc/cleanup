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
    display: "standalone",
    background_color: "#1A1A1A",
    theme_color: "#1A1A1A",
    orientation: "portrait-primary",
    scope: "/",
    lang: isZh ? "zh-CN" : "en-US",
    categories: ["utilities", "productivity", "photo"],
    icons: [
      {
        src: "/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/desktop.png",
        sizes: "1920x1080",
        type: "image/png",
        form_factor: "wide",
        label: isZh ? "Clean PigGo 桌面端" : "Clean PigGo Desktop View",
      },
      {
        src: "/screenshots/mobile.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
        label: isZh ? "Clean PigGo 移动端" : "Clean PigGo Mobile View",
      },
    ],
    shortcuts: [
      {
        name: isZh ? "开始去水印" : "Start Removing",
        short_name: isZh ? "去水印" : "Remove",
        description: isZh ? "上传图片开始去水印" : "Upload an image to remove watermarks",
        url: `/${locale}`,
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  }
}
