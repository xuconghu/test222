"use client";

import { useEffect } from 'react';
import Head from 'next/head';

export default function MetaData() {
  useEffect(() => {
    // 修改浏览器标签上显示的标题
    document.title = "智视未来 - 机器人评估平台";
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