"use client";

import type { Dispatch, SetStateAction } from 'react';
import { useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import type { AssessmentQuestion } from '@/types';
import { Separator } from '@/components/ui/separator';
import { INITIAL_SLIDER_VALUE } from '@/config/questions';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

interface AssessmentPanelProps {
  questions: AssessmentQuestion[];
  sliderValues: number[];
  onSliderValuesChange: Dispatch<SetStateAction<number[]>>;
  robotsAssessedCount: number;
  totalRobotsToAssess: number;
  isAssessmentActive: boolean;
  answeredQuestions: boolean[];
  setAnsweredQuestions: Dispatch<SetStateAction<boolean[]>>;
  currentAssessmentId: string;
}

export function AssessmentPanel({ 
  questions, 
  sliderValues, 
  onSliderValuesChange,
  robotsAssessedCount,
  totalRobotsToAssess,
  isAssessmentActive,
  answeredQuestions,
  setAnsweredQuestions,
  currentAssessmentId
}: AssessmentPanelProps) {
  // 添加对内容区域的引用
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = (index: number, value: number[]) => {
    const newSliderValues = [...sliderValues];
    newSliderValues[index] = value[0];
    onSliderValuesChange(newSliderValues);
    
    // 标记为已回答
    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[index] = true;
    setAnsweredQuestions(newAnsweredQuestions);
  };

  const numAnsweredQuestions = useMemo(() => {
    if (!answeredQuestions || answeredQuestions.length === 0) return 0;
    return answeredQuestions.filter(answered => answered).length;
  }, [answeredQuestions]);

  const totalProgressPercentage = totalRobotsToAssess > 0 
    ? Math.min(100, Math.round((robotsAssessedCount / totalRobotsToAssess) * 100)) 
    : 0;
    
  // 当robotsAssessedCount或currentAssessmentId变化时，滚动到顶部
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [robotsAssessedCount, currentAssessmentId]);

  return (
    <Card className="shadow-lg rounded-lg overflow-hidden flex flex-col">
      <CardHeader className="bg-card-foreground/5">
        <CardTitle className="text-xl font-semibold text-primary">能力评估</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">请根据以下标准，对机器人的各项潜能进行评分。</CardDescription>
        
        <div className="mt-2 px-2 py-1 bg-primary/5 rounded-lg flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <ThumbsDown className="h-3.5 w-3.5 mr-1 text-red-500" />
            <span>完全不同意 (0)</span>
          </div>
          <div className="flex items-center">
            <span>完全同意 (100)</span>
            <ThumbsUp className="h-3.5 w-3.5 ml-1 text-green-500" />
          </div>
        </div>
      </CardHeader>

      <CardContent ref={contentRef} className="flex-grow space-y-6 p-6 overflow-y-auto max-h-[calc(100vh-24rem)]">
        {questions.map((question, index) => (
          <div key={question.id} className="space-y-3 pt-2 first:pt-0">
            <Label htmlFor={question.id} className="text-base font-medium block text-foreground">
              {question.text}
            </Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1 text-xs">
                <div className="flex items-center text-muted-foreground">
                  <ThumbsDown className="h-3 w-3 mr-1 text-red-500/80" />
                  <span>完全不同意</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <span>完全同意</span>
                  <ThumbsUp className="h-3 w-3 ml-1 text-green-500/80" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  id={question.id}
                  min={0}
                  max={100}
                  step={1}
                  value={[sliderValues[index]]}
                  onValueChange={(value) => handleSliderChange(index, value)}
                  className="flex-grow"
                  aria-label={`${question.text} slider`}
                />
                <span className="text-sm font-semibold w-12 text-right text-accent tabular-nums">
                  {sliderValues[index]}%
                </span>
              </div>
            </div>
            {index < questions.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col items-start space-y-4 p-6 bg-card-foreground/5">
        {isAssessmentActive && questions.length > 0 && sliderValues.length === questions.length && (
          <div className="w-full space-y-3">
            <h3 className="text-lg font-semibold text-primary">当前答题进度</h3>
            <div className="text-4xl font-bold text-accent text-center py-2">
              {numAnsweredQuestions} / {questions.length}
            </div>
            <p className="text-xs text-muted-foreground pt-1 text-center">
              已回答 {numAnsweredQuestions} 个问题，共 {questions.length} 个问题。
            </p>
          </div>
        )}

        {isAssessmentActive && questions.length > 0 && sliderValues.length > 0 && totalRobotsToAssess > 0 && <Separator className="my-2"/>}

        {totalRobotsToAssess > 0 && (
          <div className="w-full space-y-3">
            <h3 className="text-lg font-semibold text-primary">总评估进度</h3>
            <div className="text-center py-1">
              <span className="text-2xl font-bold text-accent">
                {robotsAssessedCount}
              </span>
              <span className="text-lg text-muted-foreground"> / {totalRobotsToAssess} 个机器人</span>
              {robotsAssessedCount <= totalRobotsToAssess && totalRobotsToAssess > 0 && (
                   <span className="ml-2 text-muted-foreground">
                   ({Math.round((robotsAssessedCount / totalRobotsToAssess) * 100)}%)
                 </span>
              )}
               {robotsAssessedCount > totalRobotsToAssess && totalRobotsToAssess > 0 && (
                   <span className="ml-2 text-muted-foreground">
                   ({Math.round((robotsAssessedCount / totalRobotsToAssess) * 100)}%)
                 </span>
              )}
            </div>
            <Progress 
              value={totalProgressPercentage} 
              className="w-full h-3 rounded-full" 
              aria-label="总评估进度条" 
            />
            <p className="text-xs text-muted-foreground pt-1">
              已完成评估的机器人数量占计划总数的比例。
            </p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
