"use client"

interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 40, className = "" }: LogoProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 64 64" 
      width={size} 
      height={size}
      className={className}
    >
      {/* Neo-Brutalism 简约橡皮擦 Logo */}
      
      {/* 阴影 */}
      <path 
        d="M14 22 L38 22 L50 34 L50 46 L26 46 L14 34 Z" 
        fill="currentColor" 
        className="text-foreground"
        transform="translate(3, 3)"
        opacity="0.9"
      />
      
      {/* 橡皮擦顶面 - 柠檬黄 */}
      <path 
        d="M14 22 L38 22 L50 34 L26 34 Z" 
        fill="#FFE500" 
        stroke="currentColor" 
        className="stroke-foreground"
        strokeWidth="3" 
        strokeLinejoin="round"
      />
      
      {/* 橡皮擦正面 - 珊瑚红 */}
      <path 
        d="M14 22 L14 34 L26 46 L26 34 Z" 
        fill="#FF6B6B" 
        stroke="currentColor" 
        className="stroke-foreground"
        strokeWidth="3" 
        strokeLinejoin="round"
      />
      
      {/* 橡皮擦侧面 - 薄荷绿 */}
      <path 
        d="M26 34 L50 34 L50 46 L26 46 Z" 
        fill="#7FFFD4" 
        stroke="currentColor" 
        className="stroke-foreground"
        strokeWidth="3" 
        strokeLinejoin="round"
      />
      
      {/* 高光 */}
      <path 
        d="M16 24 L34 24 L42 30 L24 30 Z" 
        fill="#FFFFFF" 
        opacity="0.3"
      />
    </svg>
  )
}

