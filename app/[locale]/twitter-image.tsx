import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "Clean PicGo - AI Watermark Remover | Gemini Lossless"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image({ params }: { params: { locale: string } }) {
  const isZh = params.locale === "zh"
  
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
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* 背景装饰 */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            width: 200,
            height: 200,
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 60,
            width: 300,
            height: 300,
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
          }}
        />
        
        {/* Logo - 橡皮擦图标 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <svg width="120" height="120" viewBox="10 18 46 36">
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
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            marginBottom: 20,
            textShadow: "4px 4px 0 rgba(0,0,0,0.2)",
          }}
        >
          Clean PicGo
        </div>

        {/* 副标题 */}
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "rgba(255,255,255,0.9)",
            marginBottom: 40,
          }}
        >
          {isZh ? "AI去水印 · 图片擦除 · Gemini无损" : "AI Watermark Remover · Image Eraser · Gemini Lossless"}
        </div>

        {/* 特性标签 */}
        <div
          style={{
            display: "flex",
            gap: 20,
          }}
        >
          {(isZh 
            ? ["🚀 秒级处理", "🔒 本地运行", "💯 完全免费", "✨ 高质量"] 
            : ["🚀 Fast", "🔒 Local", "💯 Free", "✨ HD"]
          ).map((tag, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                padding: "12px 24px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: 12,
                fontSize: 24,
                color: "white",
                fontWeight: 600,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* 网址 */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            fontSize: 24,
            color: "rgba(255,255,255,0.7)",
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
