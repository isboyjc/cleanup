import type { Point } from "@/types"

// 计算两点之间的距离
export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

// 在两点之间进行线性插值
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

// 获取两点之间的插值点
export function getInterpolatedPoints(p1: Point, p2: Point, stepSize: number = 2): Point[] {
  const points: Point[] = []
  const d = distance(p1, p2)
  const steps = Math.ceil(d / stepSize)

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    points.push({
      x: lerp(p1.x, p2.x, t),
      y: lerp(p1.y, p2.y, t),
    })
  }

  return points
}

// 创建圆形路径
export function createCirclePath(
  ctx: CanvasRenderingContext2D,
  center: Point,
  radius: number
): void {
  ctx.beginPath()
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2)
  ctx.fill()
}

// 平滑绘制路径
export function drawSmoothPath(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  lineWidth: number
): void {
  if (points.length < 2) {
    if (points.length === 1) {
      createCirclePath(ctx, points[0], lineWidth / 2)
    }
    return
  }

  ctx.lineWidth = lineWidth
  ctx.lineCap = "round"
  ctx.lineJoin = "round"

  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)

  for (let i = 1; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2
    const yc = (points[i].y + points[i + 1].y) / 2
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
  }

  const last = points[points.length - 1]
  ctx.lineTo(last.x, last.y)
  ctx.stroke()
}

// 从 Canvas 获取 ImageData
export function getCanvasImageData(canvas: HTMLCanvasElement): ImageData | null {
  const ctx = canvas.getContext("2d")
  if (!ctx) return null
  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

// 将 ImageData 绘制到 Canvas
export function putImageDataToCanvas(
  canvas: HTMLCanvasElement,
  imageData: ImageData
): void {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  canvas.width = imageData.width
  canvas.height = imageData.height
  ctx.putImageData(imageData, 0, 0)
}

// 将图片绘制到 Canvas
export function drawImageToCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement
): void {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0)
}

// 清除 Canvas
export function clearCanvas(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

// 缩放图片
export function scaleImage(
  image: HTMLImageElement,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number; scale: number } {
  const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1)
  return {
    width: Math.round(image.width * scale),
    height: Math.round(image.height * scale),
    scale,
  }
}

// 将 Canvas 转换为 Blob
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string = "image/png",
  quality: number = 1
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality)
  })
}

// 下载 Canvas 为图片
export async function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string = "image.png"
): Promise<void> {
  const blob = await canvasToBlob(canvas)
  if (!blob) return

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

