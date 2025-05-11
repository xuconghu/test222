"use client";

import { useEffect } from 'react';
import Head from 'next/head';

export default function MetaData() {
  useEffect(() => {
    // 修改浏览器标签上显示的标题
    const updateTitle = () => {
      document.title = "智视未来 - 机器人评估平台";
    };
    
    // 初次加载时设置标题
    updateTitle();
    
    // 监听页面加载事件
    window.addEventListener('load', updateTitle);
    
    // 监听路由变化（虽然这是单页应用，但以防万一）
    if (typeof window !== 'undefined' && 'navigation' in window) {
      // @ts-ignore - 新的Navigation API
      window.navigation?.addEventListener('navigate', updateTitle);
    }
    
    return () => {
      // 清理事件监听器
      window.removeEventListener('load', updateTitle);
      if (typeof window !== 'undefined' && 'navigation' in window) {
        // @ts-ignore - 新的Navigation API
        window.navigation?.removeEventListener('navigate', updateTitle);
      }
    };
  }, []);

  return (
    <>
      <Head>
        <meta name="description" content="智视未来 - 洞察评估未来的机器人评估平台" />
        <meta property="og:title" content="智视未来" />
        <meta property="og:description" content="智视未来 - 洞察评估未来的机器人评估平台" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://zhishiweilai.com" />
      </Head>
    </>
  );
} 