"use client";

import { Twitter, Youtube, Heart } from "lucide-react"
import { useTranslations } from "next-intl"
import { Logo } from "./Logo"
import { ProductName } from "./ProductName"

function BilibiliIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.659.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
    </svg>
  )
}

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
              href="https://x.com/isboyjc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-card border-2 border-foreground rounded-lg shadow-[2px_2px_0_var(--foreground)] flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors hover:shadow-[3px_3px_0_var(--foreground)] hover:-translate-x-px hover:-translate-y-px"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="https://www.youtube.com/@isboyjc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-card border-2 border-foreground rounded-lg shadow-[2px_2px_0_var(--foreground)] flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors hover:shadow-[3px_3px_0_var(--foreground)] hover:-translate-x-px hover:-translate-y-px"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a 
              href="https://space.bilibili.com/445033268" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-card border-2 border-foreground rounded-lg shadow-[2px_2px_0_var(--foreground)] flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors hover:shadow-[3px_3px_0_var(--foreground)] hover:-translate-x-px hover:-translate-y-px"
            >
              <BilibiliIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t-2 border-foreground/20 text-center">
          <p className="text-sm text-muted-foreground" suppressHydrationWarning>
            © {new Date().getFullYear()} Clean PigGo. {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  )
}
