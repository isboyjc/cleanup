import { ImageResponse } from "next/og"
import type { Locale } from "@/i18n/config"

export const runtime = "edge"

export const alt = "Clean PicGo - AI Image Cleanup | Smart Object Removal"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

// 各语言的副标题
const subtitles: Record<Locale, string> = {
  zh: "AI智能擦除 · 图片清理 · Gemini水印检测",
  en: "AI Smart Cleanup · Image Eraser · Gemini Detection",
  ja: "AIスマート消去 · 画像クリーンアップ · Gemini検出",
  ko: "AI 스마트 지우개 · 이미지 정리 · Gemini 감지",
  ru: "AI умная очистка · Ластик · Gemini обнаружение"
}

// 各语言的标签
const tags: Record<Locale, string[]> = {
  zh: ["🚀 智能擦除", "🔒 本地运行", "💯 完全免费", "✨ 高质量"],
  en: ["🚀 Smart Erase", "🔒 Local", "💯 Free", "✨ HD"],
  ja: ["🚀 スマート消去", "🔒 ローカル", "💯 無料", "✨ 高品質"],
  ko: ["🚀 스마트 지우기", "🔒 로컬", "💯 무료", "✨ 고품질"],
  ru: ["🚀 Умное стирание", "🔒 Локально", "💯 Бесплатно", "✨ HD"]
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = (localeParam as Locale) || "en"
  const subtitle = subtitles[locale] || subtitles.en
  const localeTags = tags[locale] || tags.en
  
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFBEB",
          fontFamily: "sans-serif",
          position: "relative",
          padding: "80px",
        }}
      >
        {/* 简约背景装饰 - 只在角落 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 200,
            height: 200,
            background: "#7FFFD4",
            borderRadius: "0 0 100px 0",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 180,
            height: 180,
            background: "#FFE500",
            borderRadius: "100px 0 0 0",
          }}
        />

        {/* 主内容区域 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            background: "#FFFBEB",
            padding: "50px 60px 100px 60px",
          }}
        >
          {/* Logo - 橡皮擦图标 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <svg width="110" height="110" viewBox="10 18 46 36">
              {/* 阴影 */}
              <path d="M14 22 L38 22 L50 34 L50 46 L26 46 L14 34 Z" fill="#000000" transform="translate(3, 3)" opacity="0.3"/>
              {/* 橡皮擦顶面 - 柠檬黄 */}
              <path d="M14 22 L38 22 L50 34 L26 34 Z" fill="#FFE500" stroke="#000000" strokeWidth="3" strokeLinejoin="round"/>
              {/* 橡皮擦正面 - 珊瑚红 */}
              <path d="M14 22 L14 34 L26 46 L26 34 Z" fill="#FF6B6B" stroke="#000000" strokeWidth="3" strokeLinejoin="round"/>
              {/* 橡皮擦侧面 - 薄荷绿 */}
              <path d="M26 34 L50 34 L50 46 L26 46 Z" fill="#7FFFD4" stroke="#000000" strokeWidth="3" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* 标题 */}
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 900,
              color: "#000000",
              marginBottom: 20,
              padding: "14px 46px",
              background: "#FF6B6B",
              border: "5px solid #000000",
              borderRadius: 18,
              boxShadow: "7px 7px 0 #000000",
              letterSpacing: "-2px",
            }}
          >
            Clean PicGo
          </div>

          {/* 副标题 */}
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#262626",
              marginBottom: 32,
              fontWeight: 600,
              textAlign: "center",
              maxWidth: 800,
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </div>

          {/* 特性标签 */}
          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: 900,
            }}
          >
            {localeTags.map((tag, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  padding: "10px 20px",
                  background: i === 0 ? "#7FFFD4" : i === 1 ? "#FFE500" : i === 2 ? "#FF6B6B" : "#A78BFA",
                  borderRadius: 10,
                  fontSize: 20,
                  color: "#000000",
                  fontWeight: 800,
                  border: "3px solid #000000",
                  boxShadow: "3px 3px 0 #000000",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* 网址 */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            fontSize: 24,
            color: "#000000",
            fontWeight: 700,
            padding: "10px 28px",
            background: "#FFFFFF",
            border: "3px solid #000000",
            borderRadius: 10,
            boxShadow: "3px 3px 0 #000000",
          }}
        >
          clean.picgo.studio
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
