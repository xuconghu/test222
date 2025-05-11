"use client";

import { getBasePath } from './utils';

/**
 * 获取正确的图片路径，根据不同环境（本地开发或GitHub Pages）返回适当的路径
 * @param imagePath 图片相对路径，例如'/robot-images/1_jia_jia_robot.jpg'
 * @returns 适合当前环境的完整图片路径
 */
export function getImagePath(imagePath: string): string {
  const basePath = getBasePath();
  
  // 确保图片路径以/开头
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // 拼接基础路径和图片路径
  return `${basePath}${normalizedPath}`;
} 