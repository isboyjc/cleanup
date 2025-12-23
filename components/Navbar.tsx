"use client"

import { motion } from "framer-motion"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { ThemeSwitcher } from "./ThemeSwitcher"
import { GitHubStarButton } from "./GitHubStarButton"
import { Logo } from "./Logo"
import { ProductName } from "./ProductName"
import { Link, usePathname, useRouter } from "@/i18n/routing"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const isHomePage = pathname === "/"

  const handleLogoClick = (e: React.MouseEvent) => {
    if (isHomePage) {
      e.preventDefault()
      router.refresh()
    }
  }

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between bg-card/80 backdrop-blur-md border-3 border-foreground rounded-2xl px-4 py-2 shadow-[4px_4px_0_var(--foreground)]">
          {/* Logo */}
          <Link 
            href="/" 
            onClick={handleLogoClick}
            className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <Logo size={44} />
            <ProductName size="md" className="hidden sm:inline-flex" />
          </Link>

          {/* 右侧操作 */}
          <div className="flex items-center gap-2">
            <GitHubStarButton />
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
