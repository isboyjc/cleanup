"use client"

export type WatermarkSize = 48 | 96

export interface WatermarkConfig {
  size: WatermarkSize
  marginRight: number
  marginBottom: number
}

// 缓存已加载的 Alpha 贴图
const alphaMapCache: Map<WatermarkSize, Float32Array> = new Map()

/**
 * 根据图片尺寸获取水印配置
 * 
 * Gemini 水印规则：
 * - 图片宽度 > 1024 且 高度 > 1024：使用 96×96 水印，边距 64px
 * - 其他情况：使用 48×48 水印，边距 32px
 */
export function getWatermarkConfig(width: number, height: number): WatermarkConfig {
  if (width > 1024 && height > 1024) {
    return { size: 96, marginRight: 64, marginBottom: 64 }
  }
  return { size: 48, marginRight: 32, marginBottom: 32 }
}

/**
 * 加载指定尺寸的 Alpha 贴图
 */
export async function loadAlphaMap(size: WatermarkSize): Promise<Float32Array | null> {
  // 检查缓存
  if (alphaMapCache.has(size)) {
    return alphaMapCache.get(size)!
  }
  
  try {
    const imagePath = `/assets/gemini/wm-alpha-${size}.png`
    const img = await loadImage(imagePath)
    
    // 从图片提取 Alpha 值
    const alphaMap = extractAlphaFromImage(img, size)
    
    // 缓存结果
    alphaMapCache.set(size, alphaMap)
    
    return alphaMap
  } catch (error) {
    console.warn(`加载 Alpha 贴图失败 (${size}px):`, error)
    // 如果加载失败，尝试使用生成的贴图
    return generateFallbackAlphaMap(size)
  }
}

/**
 * 加载图片
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * 从图片提取 Alpha 贴图
 * 
 * Alpha 贴图是在纯黑背景上捕获的水印图像
 * 像素的亮度值就是 Alpha 值
 */
function extractAlphaFromImage(img: HTMLImageElement, size: number): Float32Array {
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")!
  
  ctx.drawImage(img, 0, 0, size, size)
  const imageData = ctx.getImageData(0, 0, size, size)
  
  const alphaMap = new Float32Array(size * size)
  
  for (let i = 0; i < alphaMap.length; i++) {
    const pixelIdx = i * 4
    // 取 RGB 通道的最大值作为 Alpha
    const maxChannel = Math.max(
      imageData.data[pixelIdx],
      imageData.data[pixelIdx + 1],
      imageData.data[pixelIdx + 2]
    )
    alphaMap[i] = maxChannel / 255.0
  }
  
  return alphaMap
}

/**
 * 生成备用 Alpha 贴图（基于 Gemini 水印的已知特征）
 * 
 * Gemini 水印是一个简单的 "G" 形状或星形图标
 * 这个函数生成一个近似的 Alpha 贴图作为备用
 */
function generateFallbackAlphaMap(size: WatermarkSize): Float32Array {
  const alphaMap = new Float32Array(size * size)
  const center = size / 2
  const radius = size * 0.35
  
  // 生成一个简化的星形水印图案
  // 这只是一个近似，实际水印图案需要从真实样本获取
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - center
      const dy = y - center
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      // 外圈
      if (dist > radius * 0.7 && dist < radius) {
        const angle = Math.atan2(dy, dx)
        // 创建星形图案（4个角）
        const starFactor = Math.abs(Math.cos(angle * 2))
        const innerRadius = radius * 0.7
        const outerRadius = radius
        const starRadius = innerRadius + (outerRadius - innerRadius) * starFactor
        
        if (dist < starRadius) {
          // 边缘渐变
          const edgeDist = (starRadius - dist) / (starRadius - innerRadius * 0.8)
          alphaMap[y * size + x] = Math.min(0.15, edgeDist * 0.15)
        }
      }
      
      // 中心圆点
      if (dist < radius * 0.2) {
        const centerAlpha = 1 - (dist / (radius * 0.2))
        alphaMap[y * size + x] = Math.max(alphaMap[y * size + x], centerAlpha * 0.12)
      }
    }
  }
  
  return alphaMap
}

