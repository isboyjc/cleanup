export const locales = ['zh', 'en', 'ja', 'ko', 'ru'] as const
export const defaultLocale = 'zh' as const

export type Locale = (typeof locales)[number]

// 语言显示名称
export const localeNames: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
  ru: 'Русский',
}

// 语言对应的国家/地区代码
export const localeCountries: Record<Locale, string> = {
  zh: 'CN',
  en: 'US',
  ja: 'JP',
  ko: 'KR',
  ru: 'RU',
}

