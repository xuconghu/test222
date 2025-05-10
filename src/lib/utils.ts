import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { StoredRobotAssessment, AssessmentQuestion } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateCsvContent(data: StoredRobotAssessment[]): string {
  if (!data || data.length === 0) {
    return "";
  }

  const header = [
    "用户姓名 (UserName)",
    "用户年龄 (UserAge)",
    "用户性别 (UserGender)",
    "用户专业 (UserMajor)",
    "机器人ID (RobotID)",
    "机器人名称 (RobotName)",
    "机器人图片URL (RobotImageURL)",
    "评估时间戳 (Timestamp)",
    "机器人综合评分 (OverallRobotScore)",
    "问题ID (QuestionID)",
    "问题分类 (Category)",
    "问题子分类 (SubCategory)",
    "问题文本 (QuestionText)",
    "单项评分 (IndividualScore)",
  ];

  const rows = data.flatMap((robotAssessment) => {
    return robotAssessment.shuffledQuestionsSnapshot.map((question, index) => {
      return [
        `"${robotAssessment.userName}"`,
        robotAssessment.userAge,
        `"${robotAssessment.userGender}"`,
        `"${robotAssessment.userMajor}"`,
        `"${robotAssessment.robotId}"`,
        `"${robotAssessment.robotName}"`,
        `"${robotAssessment.robotImageUrl}"`,
        `"${robotAssessment.timestamp}"`,
        robotAssessment.overallScore,
        `"${question.id}"`,
        `"${question.category}"`,
        `"${question.subCategory}"`,
        `"${question.text.replace(/"/g, '""')}"`, // Escape double quotes in question text
        robotAssessment.sliderValues[index],
      ].join(',');
    });
  });

  return [header.join(','), ...rows].join('\n');
}

export function downloadCsv(csvContent: string, filename: string): void {
  if (typeof window === "undefined") return;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) { // feature detection
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
