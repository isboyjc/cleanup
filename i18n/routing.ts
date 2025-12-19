import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'
import { locales, defaultLocale } from './config'

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // 默认语言不显示前缀
})

// 导出导航函数
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)

