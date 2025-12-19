"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggleLocale = () => {
    const newLocale = locale === "zh" ? "en" : "zh"
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLocale}
      className="brutal-border-2 brutal-shadow-sm brutal-hover"
    >
      <Globe className="w-4 h-4 mr-1.5" />
      {locale === "zh" ? "EN" : "中文"}
    </Button>
  )
}
