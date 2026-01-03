"use client"

interface RemoveBgLogoProps {
  size?: number
  className?: string
}

export function RemoveBgLogo({ size = 40, className = "" }: RemoveBgLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
    >
      {/* Neo-Brutalism 去除背景 Logo */}

      {/* 阴影 */}
      <rect x="15" y="15" width="40" height="40" rx="4" fill="#000000" transform="translate(3, 3)"/>

      {/* 主图像框 */}
      <rect x="12" y="12" width="40" height="40" rx="4" fill="#FFFBEB" stroke="#000000" strokeWidth="3"/>

      {/* 左侧实色区域 - 珊瑚红 */}
      <path d="M12 16 Q12 12 16 12 L32 12 L32 52 L16 52 Q12 52 12 48 Z" fill="#FF6B6B" stroke="#000000" strokeWidth="3"/>

      {/* 右侧透明格子效果 */}
      <clipPath id="rightClip">
        <path d="M32 12 L48 12 Q52 12 52 16 L52 48 Q52 52 48 52 L32 52 Z"/>
      </clipPath>

      <g clipPath="url(#rightClip)">
        {/* 棋盘格背景 - 表示透明 */}
        <rect x="32" y="12" width="8" height="8" fill="#E5E5E5"/>
        <rect x="40" y="12" width="12" height="8" fill="#FFFFFF"/>
        <rect x="32" y="20" width="8" height="8" fill="#FFFFFF"/>
        <rect x="40" y="20" width="12" height="8" fill="#E5E5E5"/>
        <rect x="32" y="28" width="8" height="8" fill="#E5E5E5"/>
        <rect x="40" y="28" width="12" height="8" fill="#FFFFFF"/>
        <rect x="32" y="36" width="8" height="8" fill="#FFFFFF"/>
        <rect x="40" y="36" width="12" height="8" fill="#E5E5E5"/>
        <rect x="32" y="44" width="8" height="8" fill="#E5E5E5"/>
        <rect x="40" y="44" width="12" height="8" fill="#FFFFFF"/>
      </g>

      {/* 右侧边框 */}
      <path d="M32 12 L48 12 Q52 12 52 16 L52 48 Q52 52 48 52 L32 52" fill="none" stroke="#000000" strokeWidth="3"/>

      {/* 分割线 - 薄荷绿 */}
      <line x1="32" y1="12" x2="32" y2="52" stroke="#7FFFD4" strokeWidth="4"/>
      <line x1="32" y1="12" x2="32" y2="52" stroke="#000000" strokeWidth="1.5"/>

      {/* 高光 */}
      <rect x="14" y="14" width="16" height="6" rx="2" fill="#FFFFFF" opacity="0.4"/>
    </svg>
  )
}
