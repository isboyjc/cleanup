"use client"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/Logo"
import { ProductName } from "@/components/ProductName"
import { 
  RotateCcw, 
  Download, 
  X
} from "lucide-react"
import { useTranslations } from "next-intl"

interface ToolbarProps {
  onReset: () => void
  onDownload: () => void
  onClose: () => void
  hasProcessedImage: boolean
}

export function Toolbar({
  onReset,
  onDownload,
  onClose,
  hasProcessedImage,
}: ToolbarProps) {
  const t = useTranslations("editor.toolbar")
  
  return (
    <div className="flex items-center justify-between px-4 md:px-6 h-14 md:h-16 bg-card border-b-2 border-border/20">
      {/* 左侧：关闭按钮 + Logo */}
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          className="text-foreground hover:bg-foreground/10 border-0"
        >
          <X className="w-5 h-5" />
        </Button>
        
        <div className="hidden md:flex items-center gap-2">
          <Logo size={36} />
          <ProductName className="text-primary-foreground" size="sm" />
        </div>
      </div>

      {/* 右侧：操作按钮 */}
      <div className="flex items-center gap-2 md:gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onReset}
          className="text-foreground hover:bg-foreground/10 border-0 md:hidden"
          title={t("reset")}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="hidden md:flex"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("reset")}
        </Button>

        {hasProcessedImage && (
          <Button
            variant="accent"
            size="sm"
            onClick={onDownload}
          >
            <Download className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">{t("download")}</span>
          </Button>
        )}
      </div>
    </div>
  )
}
