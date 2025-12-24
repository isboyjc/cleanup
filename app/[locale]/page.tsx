"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Hero } from "@/components/Hero"
import { Capabilities } from "@/components/Capabilities"
import { HowItWorks } from "@/components/HowItWorks"
import { Examples } from "@/components/Examples"
import { GeminiFeature } from "@/components/GeminiFeature"
import { LamaArchitecture } from "@/components/LamaArchitecture"
import { FAQ } from "@/components/FAQ"
import { Footer } from "@/components/Footer"
import { ImageEditor } from "@/components/ImageEditor"
import { Navbar } from "@/components/Navbar"

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const t = useTranslations("accessibility")

  const handleImageSelect = (file: File) => {
    setSelectedImage(file)
    setIsEditorOpen(true)
  }

  const handleCloseEditor = () => {
    setIsEditorOpen(false)
    setSelectedImage(null)
  }

  return (
    <main className="min-h-screen bg-background relative">
      {/* 跳过导航链接 - 无障碍优化 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:border-2 focus:border-foreground focus:rounded-lg focus:shadow-brutal-sm"
      >
        {t("skipToContent")}
      </a>
      
      <Navbar />
      <div id="main-content">
        <Hero onImageSelect={handleImageSelect} />
      <Capabilities />
      <HowItWorks />
      <Examples />
      <LamaArchitecture />
        <GeminiFeature />
        <FAQ />
        <Footer />
      </div>
      
      {selectedImage && (
        <ImageEditor 
          key={selectedImage.name + selectedImage.lastModified}
          image={selectedImage}
          isOpen={isEditorOpen}
          onClose={handleCloseEditor}
        />
      )}
    </main>
  )
}
