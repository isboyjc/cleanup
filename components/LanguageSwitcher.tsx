"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Globe, Check, ChevronDown } from "lucide-react"
import { locales, localeNames, type Locale } from "@/i18n/config"
import { useState, useRef, useEffect } from "react"

export function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const switchLocale = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale })
    setIsOpen(false)
  }

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // 键盘导航支持
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="brutal-border-2 brutal-shadow-sm brutal-hover min-w-[100px] justify-between"
        aria-label="Switch language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="flex items-center gap-1.5">
          <Globe className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">{localeNames[locale]}</span>
          <span className="sm:hidden">{locale.toUpperCase()}</span>
        </span>
        <ChevronDown 
          className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          aria-hidden="true" 
        />
      </Button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-40 bg-background brutal-border-2 brutal-shadow rounded-lg overflow-hidden z-50"
          role="listbox"
          aria-label="Select language"
        >
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`w-full px-3 py-2.5 text-left flex items-center justify-between hover:bg-muted transition-colors ${
                locale === loc ? 'bg-muted/50' : ''
              }`}
              role="option"
              aria-selected={locale === loc}
              lang={loc}
            >
              <span className="text-sm font-medium">{localeNames[loc]}</span>
              {locale === loc && (
                <Check className="w-4 h-4 text-primary" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
