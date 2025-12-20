"use client"

import { useState } from "react"
import { Hero } from "@/components/Hero"
import { Features } from "@/components/Features"
import { HowItWorks } from "@/components/HowItWorks"
import { Examples } from "@/components/Examples"
import { Footer } from "@/components/Footer"
import { ImageEditor } from "@/components/ImageEditor"
import { Navbar } from "@/components/Navbar"

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)

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
      <Navbar />
      <Hero onImageSelect={handleImageSelect} />
      <HowItWorks />
      <Examples />
      <Features />
      <Footer />
      
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
