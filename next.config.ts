import type {NextConfig} from 'next';

// 获取仓库名称作为basePath
const basePath = process.env.GITHUB_REPOSITORY 
  ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}` 
  : '';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true, // 对于静态导出需要设置为true
  },
  // 静态导出设置
  output: 'export',
  // basePath配置简化为固定值
  basePath: '/test222',
  // 禁用基于服务器的特性
  trailingSlash: true,
};

export default nextConfig;
