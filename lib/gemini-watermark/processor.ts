"use client"

import { loadAlphaMap, getWatermarkConfig, type WatermarkSize } from "./alpha-map"
import type { DetectionResult } from "./detector"

export interface RemoveResult {
  success: boolean
  imageData: ImageData | null
  error?: string
}

// Alpha 上限，防止除零错误
const MAX_ALPHA = 0.99

/**
 * 使用反向 Alpha 混合算法去除 Gemini 水印
 * 
 * 原理：
 * Gemini 水印添加公式：watermarked = α × 255 + (1 - α) × original
 * 反向解算：original = (watermarked - α × 255) / (1 - α)
 */
export async function removeGeminiWatermark(
  imageData: ImageData,
  detectionResult: DetectionResult
): Promise<RemoveResult> {
  if (!detectionResult.exists || !detectionResult.size || !detectionResult.position) {
    return { success: false, imageData: null, error: "未检测到水印" }
  }
  
  const { size, position } = detectionResult
  
  // 加载 Alpha 贴图
  const alphaMap = await loadAlphaMap(size)
  if (!alphaMap) {
    return { success: false, imageData: null, error: "无法加载 Alpha 贴图" }
  }
  
  // 创建输出图像数据（复制原始数据）
  const outputData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  )
  
  // 处理水印区域
  processWatermarkRegion(outputData, alphaMap, position.x, position.y, size)
  
  return { success: true, imageData: outputData }
}

/**
 * 处理水印区域，应用反向 Alpha 混合
 */
function processWatermarkRegion(
  imageData: ImageData,
  alphaMap: Float32Array,
  startX: number,
  startY: number,
  size: number
): void {
  const { width, data } = imageData
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const alphaIdx = y * size + x
      const alpha = alphaMap[alphaIdx]
      
      // 跳过透明区域
      if (alpha < 0.001) continue
      
      // 应用 alpha 上限保护，防止除零
      const safeAlpha = Math.min(alpha, MAX_ALPHA)
      
      const imgX = startX + x
      const imgY = startY + y
      const pixelIdx = (imgY * width + imgX) * 4
      
      // 反向 Alpha 混合公式：original = (watermarked - α × 255) / (1 - α)
      const divisor = 1.0 - safeAlpha
      const alphaContribution = safeAlpha * 255
      
      // 处理 RGB 三个通道
      for (let c = 0; c < 3; c++) {
        const watermarked = data[pixelIdx + c]
        const original = (watermarked - alphaContribution) / divisor
        
        // 限制在有效范围内
        data[pixelIdx + c] = Math.max(0, Math.min(255, Math.round(original)))
      }
      
      // Alpha 通道保持不变
      // data[pixelIdx + 3] = data[pixelIdx + 3]
    }
  }
}


