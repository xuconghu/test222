"use client";

import { useState, useEffect } from 'react';
import { RobotDisplay } from '@/components/image-upload-area';
import { AssessmentPanel } from '@/components/assessment-panel';
import { ASSESSMENT_QUESTIONS as ALL_QUESTIONS, INITIAL_SLIDER_VALUE } from '@/config/questions';
import { getRandomRobots, ROBOTS_PER_ASSESSMENT } from '../config/robots';
import type { AssessmentQuestion, StoredRobotAssessment, RobotImage, AssessmentSession } from '@/types';
import { Bot, Save, Download, ChevronRight, Upload, ExternalLink, User, Brain, Award, Book, AlertTriangle, Info, Braces, PencilRuler, Clipboard, Activity, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateCsvContent, downloadCsv } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import MetaData from '@/components/meta-data';

// Helper function to shuffle an array (Fisher-Yates shuffle)
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const calculateOverallScore = (values: number[]): number => {
  if (!values || values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / values.length);
};

export default function RobotVisionaryPage() {
  // 用户信息状态
  const [userInfo, setUserInfo] = useState({
    name: '',
    age: '',
    gender: '',
    major: ''
  });
  const [showUserForm, setShowUserForm] = useState(true);
  
  const [shuffledQuestions, setShuffledQuestions] = useState<AssessmentQuestion[]>([]);
  const [sliderValues, setSliderValues] = useState<number[]>([]);
  const [session, setSession] = useState<AssessmentSession>({
    selectedRobots: [],
    currentRobotIndex: 0,
    completedAssessments: []
  });
  const { toast } = useToast();

  // 添加一个状态来跟踪用户是否调整了滑块
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);

  // 添加一个状态来跟踪当前评估的机器人id，用于触发评估面板滚动
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string>('');
  
  // 添加评估开始时间状态，用于记录每个机器人的评估耗时
  // 这里使用state而不是ref是因为状态更新需要触发重渲染，
  // 且state提供的是不可变值，更适合记录特定时间点
  const [startTime, setStartTime] = useState<number | null>(null);
  
  // 添加当前评估时间计数器（仅用于后台记录，不在UI显示）
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // 使用useEffect设置计时器，每秒更新一次评估时间
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    
    // 如果有开始时间，开始计时
    if (startTime !== null) {
      // 立即更新一次
      setElapsedTime(Math.round((Date.now() - startTime) / 1000));
      
      // 设置定时器每秒更新
      timerId = setInterval(() => {
        setElapsedTime(Math.round((Date.now() - startTime) / 1000));
      }, 1000);
    }
    
    // 清理函数
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [startTime]);

  // 处理用户信息输入变化
  const handleUserInfoChange = (field: string, value: string) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 提交用户信息，开始评估并记录开始时间
  const handleUserInfoSubmit = () => {
    // 简单验证
    if (!userInfo.name || !userInfo.age || !userInfo.gender || !userInfo.major) {
      toast({
        title: "请填写完整信息",
        description: "所有字段都是必填的",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // 验证年龄是否为数字
    if (isNaN(Number(userInfo.age)) || Number(userInfo.age) <= 0) {
      toast({
        title: "年龄格式错误",
        description: "请输入有效的年龄数字",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // 通过验证，隐藏表单并开始评估
    setShowUserForm(false);
    
    // 记录评估开始时间
    setStartTime(Date.now());
    
    toast({
      title: "信息已保存",
      description: `${userInfo.name}，欢迎参与机器人评估！`,
      duration: 3000,
    });
  };

  // 初始化: 随机选择机器人和问题
  useEffect(() => {
    // 随机选择机器人
    const randomRobots = getRandomRobots(ROBOTS_PER_ASSESSMENT);
    
    // 随机排序问题
    const shuffled = shuffleArray(ALL_QUESTIONS);
    
    setSession(prev => ({
      ...prev,
      selectedRobots: randomRobots,
      currentRobotIndex: 0,
      completedAssessments: []
    }));
    
    setShuffledQuestions(shuffled);
  }, []);

  // 当问题加载后初始化滑块值
  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      setSliderValues(shuffledQuestions.map(() => INITIAL_SLIDER_VALUE));
    }
  }, [shuffledQuestions]);

  // 当问题加载后初始化回答状态
  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      setAnsweredQuestions(shuffledQuestions.map(() => false));
    }
  }, [shuffledQuestions]);

  // 获取当前机器人
  const currentRobot = session.selectedRobots[session.currentRobotIndex] || null;

  // 检查所有问题是否都已回答（滑块值是否改变）
  const checkAllQuestionsAnswered = () => {
    if (answeredQuestions.length === 0) return false;
    
    // 检查是否有任何问题尚未回答
    const unansweredQuestions = answeredQuestions.filter(answered => !answered);
    
    if (unansweredQuestions.length > 0) {
      toast({
        title: "评估未完成",
        description: `还有 ${unansweredQuestions.length} 道问题未评分，请完成所有问题后再继续。`,
        variant: "destructive",
        duration: 4000,
      });
      return false;
    }
    
    return true;
  };

  // 格式化时间显示 (将秒转为分:秒格式)
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds}秒`;
  };

  // 保存当前机器人评估并进入下一个
  const handleSaveAndNext = () => {
    if (!currentRobot || shuffledQuestions.length === 0 || sliderValues.length !== shuffledQuestions.length) {
      toast({
        title: "错误",
        description: "评估数据不完整，无法保存。",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // 检查是否所有问题都已回答
    if (!checkAllQuestionsAnswered()) {
      return;
    }

    // 计算评估耗时（秒）
    const assessmentDuration = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

    const overallScore = calculateOverallScore(sliderValues);
    const currentAssessment: StoredRobotAssessment = {
      robotId: currentRobot.id,
      robotName: currentRobot.name,
      robotImageUrl: currentRobot.filename,
      timestamp: new Date().toISOString(),
      sliderValues: [...sliderValues],
      shuffledQuestionsSnapshot: [...shuffledQuestions],
      overallScore,
      // 添加用户信息到评估数据
      userName: userInfo.name,
      userAge: Number(userInfo.age),
      userGender: userInfo.gender,
      userMajor: userInfo.major,
      // 添加评估耗时
      assessmentDuration
    };

    // 保存当前评估
    setSession(prev => ({
      ...prev,
      completedAssessments: [...prev.completedAssessments, currentAssessment],
      currentRobotIndex: prev.currentRobotIndex + 1
    }));

    // 重置滑块值为初始值
    setSliderValues(shuffledQuestions.map(() => INITIAL_SLIDER_VALUE));
    
    // 重置回答状态
    setAnsweredQuestions(shuffledQuestions.map(() => false));
    
    // 滚动到页面顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // 更新currentAssessmentId以触发评估面板滚动到顶部
    setCurrentAssessmentId(Date.now().toString());
    
    // 为下一个机器人重置评估开始时间
    setStartTime(Date.now());

    toast({
      title: "已保存",
      description: `已保存对${currentRobot.name}的评估，总分: ${overallScore}%`,
      duration: 3000,
    });
  };

  // 完成所有评估并导出
  const handleFinishAndExport = () => {
    // 检查是否有完成的评估
    if (session.completedAssessments.length === 0) {
      toast({
        title: "没有数据",
        description: "没有可导出的数据。请至少评估一个机器人。",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // 导出CSV
    const csvContent = generateCsvContent(session.completedAssessments);
    if (!csvContent) {
      toast({
        title: "导出失败",
        description: "生成CSV内容时发生错误。",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    const filename = `robot_assessments_${userInfo.name}_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCsv(csvContent, filename);

    toast({
      title: "导出成功",
      description: `已导出${session.completedAssessments.length}个机器人的评估数据。`,
      duration: 5000,
    });
  };

  // 所有机器人评估完成
  const isAllCompleted = session.currentRobotIndex >= session.selectedRobots.length;
  
  // 计算进度
  const completionPercentage = session.selectedRobots.length > 0
    ? Math.round((session.completedAssessments.length / session.selectedRobots.length) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <MetaData />

      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
          <div className="container flex h-20 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">
                智视未来
              </h1>
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
          {showUserForm ? (
            // 用户信息表单与研究说明
            <div className="grid md:grid-cols-12 gap-6">
              <Card className="md:col-span-5 shadow-lg rounded-lg">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-card-foreground/5">
                  <div className="flex items-center">
                    <User className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <CardTitle className="text-xl font-semibold text-primary">
                        参与者信息
                      </CardTitle>
                      <CardDescription>
                        请先填写您的基本信息再开始评估
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">姓名</Label>
                    <Input 
                      id="username" 
                      placeholder="请输入您的姓名" 
                      value={userInfo.name}
                      onChange={(e) => handleUserInfoChange('name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age">年龄</Label>
                    <Input 
                      id="age" 
                      type="number" 
                      placeholder="请输入您的年龄" 
                      value={userInfo.age}
                      onChange={(e) => handleUserInfoChange('age', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">性别</Label>
                    <Select 
                      value={userInfo.gender} 
                      onValueChange={(value) => handleUserInfoChange('gender', value)}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="请选择您的性别" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="男">男</SelectItem>
                        <SelectItem value="女">女</SelectItem>
                        <SelectItem value="其他">其他</SelectItem>
                        <SelectItem value="不愿透露">不愿透露</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="major">专业</Label>
                    <Input 
                      id="major" 
                      placeholder="请输入您所学的专业" 
                      value={userInfo.major}
                      onChange={(e) => handleUserInfoChange('major', e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleUserInfoSubmit} 
                    className="w-full mt-6 py-5 text-base"
                  >
                    开始评估
                  </Button>
                </CardContent>
              </Card>

              <Card className="md:col-span-7 shadow-lg rounded-lg">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-card-foreground/5">
                  <div className="flex items-center">
                    <Info className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <CardTitle className="text-xl font-semibold text-primary">
                        关于本研究
                      </CardTitle>
                      <CardDescription>
                        机器人评估研究项目的背景与目的
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <Brain className="h-10 w-10 text-primary/80 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">研究目标</h3>
                        <p className="text-muted-foreground">
                          本研究旨在通过人类对机器人的评估数据，分析人们如何认知和评价不同类型机器人的潜能。您的参与将帮助我们更好地理解人类-机器人交互的认知基础。
                        </p>
                      </div>
                    </div>

                    <Separator />
                    
                    <div className="flex items-start space-x-4">
                      <Clipboard className="h-10 w-10 text-primary/80 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">评估流程</h3>
                        <p className="text-muted-foreground">
                          您将评估3个随机选择的机器人形象，每个机器人需要回答27个关于其各方面潜能的问题。请确保每个问题都经过认真思考后再作答。
                        </p>
                      </div>
                    </div>

                    <Separator />
                    
                    <div className="flex items-start space-x-4">
                      <Activity className="h-10 w-10 text-primary/80 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">数据用途</h3>
                        <p className="text-muted-foreground">
                          您的评估数据将用于科学研究，帮助我们分析人类对机器人能力的认知模式，并可能为未来机器人设计提供洞见。所有数据将以匿名方式处理。
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg bg-primary/5 p-4 mt-4">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">
                          <strong>重要提示：</strong> 评估过程中请确保对每个问题都进行评分，未完成所有问题将无法进入下一个机器人的评估。完成所有机器人评估后，请务必导出并提交您的评估数据。
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : !isAllCompleted ? (
            // 评估界面
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {session.selectedRobots.length > 0 && (
                <RobotDisplay 
                  robot={currentRobot} 
                  currentIndex={session.currentRobotIndex}
                  totalRobots={session.selectedRobots.length}
                />
              )}
              
              {shuffledQuestions.length > 0 && sliderValues.length === shuffledQuestions.length ? (
                <AssessmentPanel
                  questions={shuffledQuestions}
                  sliderValues={sliderValues}
                  onSliderValuesChange={setSliderValues}
                  robotsAssessedCount={session.completedAssessments.length}
                  totalRobotsToAssess={session.selectedRobots.length}
                  isAssessmentActive={!!currentRobot}
                  answeredQuestions={answeredQuestions}
                  setAnsweredQuestions={setAnsweredQuestions}
                  currentAssessmentId={currentAssessmentId}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-card rounded-lg shadow-lg p-6">
                  <p className="text-muted-foreground">正在加载评估问题...</p>
                </div>
              )}
            </div>
          ) : (
            // 评估完成界面
            <Card className="shadow-lg rounded-lg overflow-hidden mb-6">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-card-foreground/5">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-primary mr-3" />
                  <div>
                    <CardTitle className="text-xl font-semibold text-primary">评估完成</CardTitle>
                    <CardDescription>
                      您已完成所有{session.selectedRobots.length}个机器人的评估
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="text-center py-6">
                  <Bot className="mx-auto h-16 w-16 text-accent mb-4" />
                  <h2 className="text-2xl font-bold mb-2">感谢您的参与！</h2>
                  <p className="text-muted-foreground">
                    您的评估对我们的研究非常有价值。请按照以下步骤完成数据提交。
                  </p>
                </div>
                
                <div className="rounded-lg border bg-card text-card-foreground p-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">1</span>
                    导出评估数据
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    首先，您需要下载包含您评估结果的CSV文件。
                  </p>
                  <Button 
                    onClick={handleFinishAndExport} 
                    className="w-full py-5 text-base"
                  >
                    <Download className="mr-2 h-5 w-5" /> 导出评估数据 (CSV)
                  </Button>
                </div>
                
                <div className="rounded-lg border bg-card text-card-foreground p-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">2</span>
                    上传CSV文件到WPS表单
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    请勿急于退出，将下载的CSV文件上传到以下WPS表单链接：
                  </p>
                  <a 
                    href="https://f.wps.cn/g/GTGsCwjw/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center py-5 px-4 w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-md font-medium text-base"
                  >
                    <Upload className="mr-2 h-5 w-5" /> 前往WPS表单上传数据
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                  <p className="mt-3 text-xs text-muted-foreground">
                    表单名称：【WPS表单】邀你填写「数据采集」
                  </p>
                </div>
                
                <div className="rounded-lg border bg-card text-card-foreground/80 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4" />
                        <path d="M12 16h.01" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium">重要提示</h3>
                      <div className="mt-1 text-xs text-muted-foreground">
                        <p>
                          上传CSV文件是本次评估的最后一步，对于研究数据收集至关重要。请确保完成此步骤。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!showUserForm && !isAllCompleted && (
            <Card className="mt-6 lg:mt-8 shadow-lg rounded-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-card-foreground/5">
                <div className="flex items-center">
                  <PencilRuler className="h-7 w-7 text-primary mr-3" />
                  <CardTitle className="text-xl font-semibold text-primary">操作控制</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>完成进度</span>
                      <span className="font-medium">{completionPercentage}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                  </div>
                  
                  <Button 
                    onClick={handleSaveAndNext} 
                    disabled={!currentRobot || shuffledQuestions.length === 0} 
                    className="w-full py-6 text-lg"
                  >
                    保存并评估下一个机器人 <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 mt-2">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm text-amber-800 dark:text-amber-400">
                        请确保完成对所有27个问题的评分，否则无法进入下一个机器人的评估。
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>

        <footer className="py-6 border-t bg-card">
          <div className="container flex flex-col items-center justify-center gap-2 md:h-20 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground">
              智视未来 &copy; {new Date().getFullYear()}. 洞察评估未来。由 
              <a 
                href="https://github.com/xuconghu" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mx-1 underline underline-offset-4 hover:text-primary"
              >
                xuconghu
              </a>
              开发。
              <span className="block md:inline md:ml-2">
                <a 
                  href="https://creativecommons.org/licenses/by-nc-sa/4.0/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline underline-offset-4 hover:text-primary"
                >
                  CC BY-NC-SA 4.0
                </a>
              </span>
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
