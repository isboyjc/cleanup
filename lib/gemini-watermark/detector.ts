"use client"

import { loadAlphaMap, getWatermarkConfig, type WatermarkSize } from "./alpha-map"

export interface DetectionResult {
  exists: boolean
  confidence: number
  size: WatermarkSize | null
  position: { x: number; y: number } | null
}

/**
 * 检测图片中是否存在 Gemini 水印
 * 通过与预置的 Alpha 贴图进行相似度匹配来判断
 */
export async function detectGeminiWatermark(
  imageData: ImageData
): Promise<DetectionResult> {
  const { width, height } = imageData
  
  // 根据图片尺寸确定应该使用的水印配置
  const config = getWatermarkConfig(width, height)
  
  // 加载对应尺寸的 Alpha 贴图
  const alphaMap = await loadAlphaMap(config.size)
  if (!alphaMap) {
    return { exists: false, confidence: 0, size: null, position: null }
  }
  
  // 计算水印位置（右下角）
  const wmX = width - config.size - config.marginRight
  const wmY = height - config.size - config.marginBottom
  
  // 确保位置有效
  if (wmX < 0 || wmY < 0) {
    return { exists: false, confidence: 0, size: null, position: null }
  }
  
  // 提取水印区域的像素
  const watermarkRegion = extractRegion(imageData, wmX, wmY, config.size, config.size)
  
  // 计算与 Alpha 贴图的相似度
  const confidence = calculateSimilarity(watermarkRegion, alphaMap, config.size)
  
  // 置信度阈值判断（提高阈值以减少误报）
  const CONFIDENCE_THRESHOLD = 0.75
  const exists = confidence >= CONFIDENCE_THRESHOLD
  
  return {
    exists,
    confidence,
    size: exists ? config.size : null,
    position: exists ? { x: wmX, y: wmY } : null,
  }
}

/**
 * 提取图片的指定区域
 */
function extractRegion(
  imageData: ImageData,
  startX: number,
  startY: number,
  regionWidth: number,
  regionHeight: number
): Uint8ClampedArray {
  const { width, data } = imageData
  const region = new Uint8ClampedArray(regionWidth * regionHeight * 4)
  
  for (let y = 0; y < regionHeight; y++) {
    for (let x = 0; x < regionWidth; x++) {
      const srcIdx = ((startY + y) * width + (startX + x)) * 4
      const dstIdx = (y * regionWidth + x) * 4
      
      region[dstIdx] = data[srcIdx]         // R
      region[dstIdx + 1] = data[srcIdx + 1] // G
      region[dstIdx + 2] = data[srcIdx + 2] // B
      region[dstIdx + 3] = data[srcIdx + 3] // A
    }
  }
  
  return region
}

/**
 * 计算图像区域与 Alpha 贴图的相似度
 * 
 * 检测思路：
 * 1. 将水印区域的像素按 alpha 值分组（高alpha区和低alpha区）
 * 2. 如果存在水印，高alpha区的亮度应该比低alpha区明显更高
 * 3. 计算两组之间的亮度差异，与预期的水印特征进行匹配
 * 4. 同时检测亮度分布是否符合星形水印的特征模式
 */
function calculateSimilarity(
  region: Uint8ClampedArray,
  alphaMap: Float32Array,
  size: number
): number {
  // 收集高alpha区域和背景区域的亮度样本
  const highAlphaPixels: { brightness: number; alpha: number }[] = []
  const backgroundPixels: number[] = []
  
  const step = 2
  
  // 高alpha阈值（水印星形的中心部分）
  const HIGH_ALPHA_THRESHOLD = 0.3
  // 低alpha阈值（用于区分背景区域）
  const LOW_ALPHA_THRESHOLD = 0.05
  
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      const idx = y * size + x
      const pixelIdx = idx * 4
      
      const alpha = alphaMap[idx]
      const r = region[pixelIdx]
      const g = region[pixelIdx + 1]
      const b = region[pixelIdx + 2]
      const brightness = (r + g + b) / 3
      
      if (alpha >= HIGH_ALPHA_THRESHOLD) {
        highAlphaPixels.push({ brightness, alpha })
      } else if (alpha < LOW_ALPHA_THRESHOLD) {
        // 背景区域（alpha ≈ 0）
        backgroundPixels.push(brightness)
      }
      // 中间alpha区域（边缘）不参与计算，减少噪声干扰
    }
  }
  
  // 需要足够的样本才能进行可靠检测
  if (highAlphaPixels.length < 10 || backgroundPixels.length < 20) {
    return 0
  }
  
  // 计算各区域的平均亮度
  const avgHighBrightness = highAlphaPixels.reduce((sum, p) => sum + p.brightness, 0) / highAlphaPixels.length
  const avgBackgroundBrightness = backgroundPixels.reduce((sum, b) => sum + b, 0) / backgroundPixels.length
  
  // 水印特征检测：
  // 1. 高alpha区域相对于背景应该有明显的亮度提升
  // 2. 这个提升量应该与预期的水印叠加效果一致
  
  // 计算实际的亮度差异
  const actualDiff = avgHighBrightness - avgBackgroundBrightness
  
  // 计算高alpha区域的平均alpha值
  const avgHighAlpha = highAlphaPixels.reduce((sum, p) => sum + p.alpha, 0) / highAlphaPixels.length
  
  // 预期的亮度提升量（基于水印混合公式：watermarked = α × 255 + (1 - α) × original）
  // 预期提升 = α × (255 - original) ≈ α × (255 - avgBackgroundBrightness)
  const expectedDiff = avgHighAlpha * (255 - avgBackgroundBrightness)
  
  // 检测条件：
  // 1. 必须有正向的亮度差异（高alpha区更亮）
  // 2. 差异量应该在预期范围内（允许一定误差）
  // 3. 差异量不能太小（需要有可检测的水印效果）
  
  if (actualDiff <= 0) {
    // 高alpha区域没有比背景更亮，肯定没有白色水印
    return 0
  }
  
  // 计算差异比率
  const diffRatio = actualDiff / Math.max(expectedDiff, 1)
  
  // 检测相似度：差异应该接近预期值
  // 允许的范围：预期值的 50% ~ 150%
  if (diffRatio < 0.4 || diffRatio > 2.0) {
    return 0
  }
  
  // 进一步验证：检测亮度的相关性
  // 如果确实有水印，alpha值和亮度应该有正相关
  const correlation = calculateCorrelation(highAlphaPixels)
  
  // 相关性太低说明不是水印模式
  if (correlation < 0.2) {
    return 0
  }
  
  // 综合评分
  // 1. 差异比率越接近 1.0，得分越高
  // 2. 相关性越高，得分越高
  // 3. 实际差异越大，得分越高（水印更明显）
  
  const ratioScore = 1 - Math.abs(diffRatio - 1) * 0.5
  const correlationScore = Math.min(correlation, 1)
  const diffScore = Math.min(actualDiff / 30, 1) // 差异超过30视为满分
  
  return Math.max(0, Math.min(1, (ratioScore + correlationScore + diffScore) / 3))
}

/**
 * 计算 alpha 值和亮度之间的相关系数
 */
function calculateCorrelation(pixels: { brightness: number; alpha: number }[]): number {
  if (pixels.length < 5) return 0
  
  const n = pixels.length
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0
  
  for (const p of pixels) {
    sumX += p.alpha
    sumY += p.brightness
    sumXY += p.alpha * p.brightness
    sumX2 += p.alpha * p.alpha
    sumY2 += p.brightness * p.brightness
  }
  
  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
  
  if (denominator === 0) return 0
  
  return numerator / denominator
}

