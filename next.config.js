/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',  // 启用静态HTML导出
  distDir: 'out',    // 输出目录
  images: {
    unoptimized: true,  // GitHub Pages不支持Next.js的图像优化
  },
  basePath: '',
  trailingSlash: true,  // 确保URL以斜杠结尾
};

module.exports = nextConfig; 