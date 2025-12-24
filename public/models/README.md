# LaMa 模型说明

## 模型加载

模型会自动从 CDN 下载并缓存到浏览器中：

- **CDN 地址**: `https://cdn.isboyjc.com/models/lama/lama_fp32.onnx`
- **模型大小**: 约 200MB
- **首次加载**: 需要从 CDN 下载，时间取决于网络速度
- **后续加载**: 直接从浏览器缓存读取，速度很快

## 缓存机制

- 使用浏览器 Cache API 存储模型
- 缓存名称: `lama-model-cache-v1`
- 模型下载一次后会自动缓存，后续访问无需重新下载

## 清除缓存

如需清除缓存，可以在浏览器开发者工具 → Application → Cache Storage 中删除 `lama-model-cache-v1`

## 模型信息

- **模型**: LaMa (Large Mask Inpainting)
- **格式**: ONNX (fp32)
- **输入**: 
  - `image`: [1, 3, H, W] 归一化到 [0, 1]
  - `mask`: [1, 1, H, W] 二值蒙版
- **输出**: [1, 3, H, W] 修复后的图像
