# Gemini 水印 Alpha 贴图

此目录存放 Gemini AI 水印的 Alpha 贴图文件。

## 文件说明

- `wm-alpha-48.png` - 48×48 像素的水印 Alpha 贴图（用于小于 1024×1024 的图片）
- `wm-alpha-96.png` - 96×96 像素的水印 Alpha 贴图（用于大于 1024×1024 的图片）

## 获取方式

Alpha 贴图需要通过在纯黑背景上捕获 Gemini 水印来生成：

1. 使用 Gemini 生成一张纯黑色背景的图片
2. 裁剪出右下角的水印区域
3. 水印区域的像素亮度即为 Alpha 值

## 参考项目

- [gemini-watermark-remover](https://github.com/journey-ad/gemini-watermark-remover) - 原始的 Alpha 贴图来源

## 备用方案

如果贴图文件不存在，系统会自动生成一个近似的 Alpha 贴图作为备用。

