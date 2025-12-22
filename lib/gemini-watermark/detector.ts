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
  
  // 置信度阈值判断
  const CONFIDENCE_THRESHOLD = 0.65
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
 * Gemini 水印是半透明白色叠加，所以检测时：
 * 1. 在有水印的区域，像素值会被"提亮"
 * 2. Alpha 值越高的地方，像素被提亮得越多
 * 3. 我们检测这种"提亮模式"是否与 Alpha 贴图匹配
 */
function calculateSimilarity(
  region: Uint8ClampedArray,
  alphaMap: Float32Array,
  size: number
): number {
  let matchCount = 0
  let totalChecked = 0
  
  // 采样检测（不需要检查所有像素）
  const step = 2
  
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      const idx = y * size + x
      const pixelIdx = idx * 4
      
      const alpha = alphaMap[idx]
      
      // 只检查 alpha > 0.05 的区域（水印实际存在的部分）
      if (alpha > 0.05) {
        const r = region[pixelIdx]
        const g = region[pixelIdx + 1]
        const b = region[pixelIdx + 2]
        
        // 计算亮度
        const brightness = (r + g + b) / 3
        
        // 水印是白色的，所以在水印区域像素会被提亮
        // alpha 越高，被提亮得越多
        // 预期的提亮量：alpha * 255
        const expectedBrightening = alpha * 255
        
        // 如果原始像素较暗，提亮效果更明显
        // 检查亮度是否在合理范围内（考虑各种背景色）
        // 水印区域的特征：亮度相对较高，且与 alpha 有正相关
        if (brightness > 50 + expectedBrightening * 0.3) {
          matchCount++
        }
        
        totalChecked++
      }
    }
  }
  
  if (totalChecked === 0) return 0
  
  return matchCount / totalChecked
}

