import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const nextConfig: NextConfig = {
  // Turbopack 配置（Next.js 16 默认使用）
  turbopack: {},
  
  // Webpack 配置（用于 Web Worker 支持）
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 确保 WASM 文件正确加载
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }
    return config
  },
  
  // 静态文件配置
  async headers() {
    return [
      {
        source: "/models/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
