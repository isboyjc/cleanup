export interface EditorState {
  image: HTMLImageElement | null
  originalImage: HTMLImageElement | null // 原始图片，用于预览对比
  processedImageData: ImageData | null
  zoom: number
  pan: { x: number; y: number }
  brushSize: number
  isDrawing: boolean
  isProcessing: boolean
  showComparison: boolean
  comparisonPosition: number
  imageHistory: HTMLImageElement[] // 图像历史：[原图, 第一次生成, 第二次生成, ...]
  historyIndex: number // 当前所在的历史索引
}

export interface Point {
  x: number
  y: number
}
