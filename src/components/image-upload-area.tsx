"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, Loader2 } from 'lucide-react'; 
import type { RobotImage } from '@/types';
import { getImagePath } from '@/lib/image-utils';

interface RobotDisplayProps {
  robot: RobotImage | null;
  currentIndex: number;
  totalRobots: number;
}

export function RobotDisplay({ robot, currentIndex, totalRobots }: RobotDisplayProps) {
  // 添加图片加载状态
  const [imageLoading, setImageLoading] = useState(true);

  // 当机器人变化时重置加载状态
  useEffect(() => {
    if (robot) {
      setImageLoading(true);
    }
  }, [robot]);

  return (
    <Card className="shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-card-foreground/5">
        <CardTitle className="text-xl font-semibold text-primary">当前机器人</CardTitle>
        <CardDescription>
          {robot ? `正在评估: ${robot.name} (${currentIndex + 1}/${totalRobots})` : '准备中...'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="aspect-[4/3] w-full bg-muted/50 rounded-md flex items-center justify-center overflow-hidden border-2 border-dashed border-border hover:border-accent transition-colors">
          {robot ? (
            <div className="relative w-full h-full">
              <Image
                src={getImagePath(robot.filename)}
                alt={robot.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'contain' }}
                priority
                data-ai-hint="robot image"
                onLoadingComplete={() => setImageLoading(false)}
                onLoad={() => setImageLoading(false)}
              />
              
              {/* 图片加载状态提示 */}
              {imageLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm transition-opacity z-10">
                  <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
                  <p className="text-sm font-medium text-primary">图片加载中...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-8 text-muted-foreground space-y-2">
              <Bot className="mx-auto h-16 w-16 opacity-70" />
              <p className="text-base font-medium">正在准备机器人图片...</p>
              <p className="text-xs mt-1">评估将在图片加载完成后开始。</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
