import { getRequestConfig } from 'next-intl/server'
import { locales, type Locale } from './config'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  // 验证 locale 是否有效
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'zh'
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})

