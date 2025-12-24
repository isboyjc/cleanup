import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // 匹配所有路径，但排除 API 路由、静态文件、sitemap、robots 等
  matcher: ['/', '/(zh|en|ja|ko|ru)/:path*', '/((?!api|_next|_vercel|models|sitemap|robots|.*\\..*).*)']
}

