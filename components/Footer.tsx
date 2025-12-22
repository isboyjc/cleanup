"use client";

import { Twitter, Youtube, Heart, ExternalLink, FileText } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Logo } from "./Logo"
import { ProductName } from "./ProductName"

function BilibiliIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.659.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
    </svg>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

export function Footer() {
  const t = useTranslations("footer")
  
  return (
    <footer className="py-12 px-4 border-t-3 border-foreground bg-card relative overflow-hidden">
      {/* 装饰背景 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-6xl mx-auto">
        {/* 主要内容 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          {/* Logo 和描述 */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-3">
              <Logo size={44} />
              <ProductName size="md" />
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs">
              {t("copyright")}
            </p>
          </div>
          
          {/* 链接区域 */}
          <div className="flex flex-col items-center md:items-end gap-4">
            {/* 项目相关链接 */}
            <div className="flex flex-wrap justify-center md:justify-end items-center gap-3">
              <a 
                href="https://github.com/isboyjc/cleanup" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-card border-2 border-foreground rounded-lg shadow-[2px_2px_0_var(--foreground)] hover:shadow-[3px_3px_0_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <GitHubIcon className="w-4 h-4" />
                GitHub
              </a>
              <Link 
                href="/changelog"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-card border-2 border-foreground rounded-lg shadow-[2px_2px_0_var(--foreground)] hover:shadow-[3px_3px_0_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <FileText className="w-4 h-4" />
                {t("changelog")}
              </Link>
            </div>

            {/* 友链 */}
            <div className="flex flex-wrap justify-center md:justify-end items-center gap-2 text-xs text-muted-foreground">
              <span>{t("friendLinks")}：</span>
              <a
                href="https://github.com/advimman/lama"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors underline underline-offset-2"
              >
                LaMa
              </a>
              <span>·</span>
              <a
                href="https://onnxruntime.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors underline underline-offset-2"
              >
                ONNX Runtime
              </a>
              <span>·</span>
              <a
                href="https://github.com/journey-ad/gemini-watermark-remover"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors underline underline-offset-2"
              >
                gemini-watermark-remover
              </a>
            </div>
          </div>
        </div>
        
        {/* 底部栏 */}
        <div className="pt-6 border-t-2 border-foreground/20 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* 作者信息和社交链接 */}
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              By{" "}<Heart className="w-3.5 h-3.5 text-secondary fill-secondary" />{" "}
              <a 
                href="https://github.com/isboyjc/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-primary transition-colors"
              >
                Isboyjc
              </a>
            </p>
            
            <div className="flex items-center gap-1.5">
              <a 
                href="https://x.com/isboyjc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-card border-2 border-foreground rounded-lg shadow-[2px_2px_0_var(--foreground)] flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors hover:shadow-[2px_2px_0_var(--foreground)] hover:-translate-x-px hover:-translate-y-px"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://www.youtube.com/@isboyjc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-card border-2 border-foreground rounded-lg shadow-[2px_2px_0_var(--foreground)] flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors hover:shadow-[2px_2px_0_var(--foreground)] hover:-translate-x-px hover:-translate-y-px"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="https://space.bilibili.com/445033268" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-card border-2 border-foreground rounded-lg shadow-[2px_2px_0_var(--foreground)] flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors hover:shadow-[2px_2px_0_var(--foreground)] hover:-translate-x-px hover:-translate-y-px"
              >
                <BilibiliIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {/* 版权信息 */}
          <p className="text-sm text-muted-foreground" suppressHydrationWarning>
            © {new Date().getFullYear()} Clean PicGo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
