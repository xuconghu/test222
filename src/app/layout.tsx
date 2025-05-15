import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { GeistSans } from 'geist/font/sans';

export const metadata: Metadata = {
  title: '智视未来 - 机器人评估平台',
  description: '智视未来 - 洞察评估未来的机器人评估平台',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={GeistSans.variable}>
      <head>
        <link rel="canonical" href="https://zhishiweilai.com" />
      </head>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
