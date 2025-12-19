"use client";

import { Github, Twitter, Heart } from "lucide-react"
import { useTranslations } from "next-intl"
import { Logo } from "./Logo"
import { ProductName } from "./ProductName"

export function Footer() {
  const t = useTranslations("footer")
  
  return (
    <footer className="py-8 px-4 border-t-3 border-foreground bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size={44} />
            <ProductName size="md" />
          </div>
          
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            By{" "}<Heart className="w-4 h-4 text-secondary fill-secondary" />{" "}
            <a 
              href="https://github.com/isboyjc/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-primary transition-colors underline underline-offset-2"
            >
              Isboyjc
            </a>
          </p>
          
          <div className="flex items-center gap-3">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-card border-2 border-foreground rounded-lg shadow-[2px_2px_0_var(--foreground)] flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors hover:shadow-[3px_3px_0_var(--foreground)] hover:-translate-x-px hover:-translate-y-px"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-card border-2 border-foreground rounded-lg shadow-[2px_2px_0_var(--foreground)] flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors hover:shadow-[3px_3px_0_var(--foreground)] hover:-translate-x-px hover:-translate-y-px"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t-2 border-foreground/20 text-center">
          <p className="text-sm text-muted-foreground" suppressHydrationWarning>
            © {new Date().getFullYear()} Clean PicGo. {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  )
}
