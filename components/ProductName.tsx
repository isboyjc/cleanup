"use client"

interface ProductNameProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ProductName({ size = "md", className = "" }: ProductNameProps) {
  const sizeStyles = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  }
  
  return (
    <span 
      className={`${sizeStyles[size]} ${className}`}
      style={{ 
        fontFamily: "'Pacifico', cursive",
        fontWeight: 400,
      }}
    >
      Clean PigGo
    </span>
  )
}
