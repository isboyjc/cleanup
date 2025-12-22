<div align="center">

<img src="app/icon.svg" alt="Clean PicGo Logo" width="120" />

# Clean PicGo

**AI 驱动的图片去水印工具 | AI-Powered Image Watermark Remover**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-clean.picgo.studio-blue?style=for-the-badge)](https://clean.picgo.studio)
[![Version](https://img.shields.io/badge/Version-1.1.0-orange?style=for-the-badge)](https://github.com/isboyjc/cleanup/releases)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

<p align="center">
  <strong>🚀 秒级处理 · 🔒 本地运行 · 💯 完全免费 · ✨ 高质量输出</strong>
</p>

[![GitHub](https://img.shields.io/badge/GitHub-isboyjc-181717?style=flat&logo=github)](https://github.com/isboyjc/cleanup)
[![X](https://img.shields.io/badge/X-@isboyjc-000000?style=flat&logo=x)](https://x.com/isboyjc)

[English](#english) | [简体中文](#简体中文)

</div>

## 简体中文

### ✨ 简介

**Clean PicGo** 是一款基于 AI 技术的在线图片去水印工具。使用先进的 [LaMa (Large Mask Inpainting)](https://github.com/advimman/lama) 深度学习模型，可以智能地去除图片中的水印、文字和不需要的物体。

🌟 **核心亮点：所有处理完全在浏览器本地进行，图片不会上传到任何服务器，充分保护您的隐私！**

### 🎯 在线体验

访问 **[clean.picgo.studio](https://clean.picgo.studio)** 立即体验！

### 🚀 功能特性

| 功能 | 描述 |
|------|------|
| 🎨 **智能擦除** | 使用橡皮擦工具选中需要去除的区域，AI 会自动填充背景 |
| ⚡ **Gemini 专用模式** | 自动检测并无损去除 Gemini AI 生成图片的水印，基于反向 Alpha 混合算法 |
| 🧵 **Web Worker 后台处理** | 模型推理在独立线程运行，主线程完全不阻塞，处理期间可自由操作 |
| 🔒 **隐私安全** | 所有处理完全在本地进行，图片不会上传到任何服务器 |
| 🎭 **蒙版技术** | 精确的蒙版生成技术，确保只处理选中的区域 |
| 👁️ **实时对比** | 处理完成后可以左右对比查看处理前后的效果差异 |
| 📥 **高清导出** | 支持导出原始分辨率的处理结果，保持图片质量 |
| 📱 **PWA 支持** | 可安装为桌面应用，支持离线使用 |

#### ⚡ Gemini 水印专用处理

针对 Gemini AI 生成图片的水印，Clean PicGo 提供了专门的无损去除方案：

- **自动检测**：上传图片后自动检测是否存在 Gemini 水印
- **无损去除**：使用数学精确的反向 Alpha 混合算法，而非 AI 推理
- **毫秒级处理**：无需加载大模型，处理速度极快
- **可回退操作**：自动处理作为一个可回退的编辑步骤

> 此功能基于 [gemini-watermark-remover](https://github.com/journey-ad/gemini-watermark-remover) 项目的算法原理实现。

### 📖 使用方法

1. **上传图片** - 拖拽或点击上传需要处理的图片（支持 JPG、PNG、WebP）
2. **自动检测** - 如果是 Gemini 图片，系统会自动检测并去除水印
3. **选择区域** - 使用橡皮擦工具涂抹需要去除的其他水印区域
4. **AI 处理** - LaMa 模型自动分析并填充选中区域
5. **下载结果** - 预览效果满意后下载处理后的图片

### 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | [Next.js 16](https://nextjs.org/) + [React 19](https://react.dev/) |
| **语言** | [TypeScript 5](https://www.typescriptlang.org/) |
| **样式** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **AI 推理** | [ONNX Runtime Web](https://onnxruntime.ai/) + Web Worker |
| **AI 模型** | [LaMa](https://github.com/advimman/lama) (Large Mask Inpainting) |
| **动画** | [Framer Motion](https://www.framer.com/motion/) |
| **国际化** | [next-intl](https://next-intl-docs.vercel.app/) |
| **UI 组件** | [Radix UI](https://www.radix-ui.com/) |

### 📦 本地开发

```bash
# 克隆项目
git clone https://github.com/isboyjc/cleanup.git
cd cleanup

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 🌍 国际化

Clean PicGo 支持以下语言：

- 🇨🇳 简体中文
- 🇺🇸 English

### 🎨 主题

支持浅色模式和深色模式，可跟随系统设置自动切换。

---

## English

### ✨ Introduction

**Clean PicGo** is an AI-powered online image watermark removal tool. Using the advanced [LaMa (Large Mask Inpainting)](https://github.com/advimman/lama) deep learning model, it can intelligently remove watermarks, text, and unwanted objects from images.

🌟 **Key Highlight: All processing is done entirely in your browser locally. Images are never uploaded to any server, fully protecting your privacy!**

### 🎯 Live Demo

Visit **[clean.picgo.studio](https://clean.picgo.studio)** to try it now!

### 🚀 Features

| Feature | Description |
|---------|-------------|
| 🎨 **Smart Erase** | Select the area to remove with the eraser tool, and AI will automatically fill in the background |
| ⚡ **Gemini Mode** | Auto-detect and losslessly remove watermarks from Gemini AI images using Reverse Alpha Blending |
| 🧵 **Web Worker Processing** | Model inference runs in a separate thread, keeping the main thread responsive during processing |
| 🔒 **Privacy Safe** | All processing is done locally, images are never uploaded to any server |
| 🎭 **Mask Technology** | Precise mask generation ensures only selected areas are processed |
| 👁️ **Real-time Comparison** | Compare before and after effects with a side-by-side slider |
| 📥 **HD Export** | Export results at original resolution, maintaining image quality |
| 📱 **PWA Support** | Install as a desktop app with offline support |

#### ⚡ Gemini Watermark Removal

Clean PicGo provides a dedicated lossless removal solution for Gemini AI-generated image watermarks:

- **Auto Detection**: Automatically detects Gemini watermarks after image upload
- **Lossless Removal**: Uses mathematically precise Reverse Alpha Blending algorithm instead of AI inference
- **Instant Processing**: No large model loading required, extremely fast processing
- **Undoable Operation**: Auto-processing is saved as an undoable editing step

> This feature is based on the algorithm from [gemini-watermark-remover](https://github.com/journey-ad/gemini-watermark-remover) project.

### 📖 How to Use

1. **Upload Image** - Drag and drop or click to upload an image (supports JPG, PNG, WebP)
2. **Auto-Detection** - If it's a Gemini image, system auto-detects and removes watermark
3. **Select Area** - Use the eraser tool to paint over other watermark areas
4. **AI Processing** - LaMa model automatically analyzes and fills the selected area
5. **Download Result** - Preview the result and download the processed image

### 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) + [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **AI Inference** | [ONNX Runtime Web](https://onnxruntime.ai/) + Web Worker |
| **AI Model** | [LaMa](https://github.com/advimman/lama) (Large Mask Inpainting) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **i18n** | [next-intl](https://next-intl-docs.vercel.app/) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) |

### 📦 Local Development

```bash
# Clone the repository
git clone https://github.com/isboyjc/cleanup.git
cd cleanup

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 🌍 Internationalization

Clean PicGo supports the following languages:

- 🇨🇳 Simplified Chinese
- 🇺🇸 English

### 🎨 Theme

Supports light and dark mode, can automatically switch based on system settings.

---

<div align="center">

## 📄 License

[MIT](./LICENSE) © [isboyjc](https://github.com/isboyjc)

[![Follow on X](https://img.shields.io/badge/Follow_@isboyjc-000000?style=flat&logo=x)](https://x.com/isboyjc)
[![GitHub](https://img.shields.io/github/stars/isboyjc/cleanup?style=social)](https://github.com/isboyjc/cleanup)

---

**⭐ 如果这个项目对你有帮助，请给它一个 Star！**

**⭐ If this project helps you, please give it a Star!**

<br />

Made with ❤️ and AI

</div>
