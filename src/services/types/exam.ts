// 考试相关类型定义

// 题目类型
export type QuestionType = 'single' | 'multiple' | 'blank' | 'text' | 'boolean';

// 题目接口
export interface Question {
  id: string;
  stem: string;
  type?: QuestionType;
  options?: string[];
  score?: number; // 题目分值
  difficulty?: 'easy' | 'medium' | 'hard'; // 难度等级
}

// 用户作答的值类型
export type AnswerValue = string | string[];

// 用户答案记录
export interface UserAnswer {
  questionId: string;
  answer: AnswerValue;
  answeredAt: string; // ISO 时间字符串
}

// 试卷接口
export interface ExamPaper {
  paperId: string;
  title: string;
  description?: string;
  durationSec: number; // 考试时长（秒）
  totalScore: number; // 总分
  questions: Question[];
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}

// 考试记录接口
export interface ExamRecord {
  recordId: string;
  paperId: string;
  userId: number;
  startTime: string; // 开始时间
  endTime?: string; // 结束时间
  duration: number; // 实际用时（秒）
  answers: UserAnswer[]; // 用户答案
  score?: number; // 得分
  status: 'in_progress' | 'completed' | 'timeout' | 'submitted'; // 考试状态
  submittedAt?: string; // 提交时间
}

// 获取试卷列表请求参数
export interface GetPapersRequest {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: 'active' | 'inactive';
}

// 获取试卷列表响应
export interface GetPapersResponse {
  papers: ExamPaper[];
  total: number;
  page: number;
  pageSize: number;
}

// 获取试卷详情请求参数
export interface GetPaperRequest {
  paperId: string;
}

// 开始考试请求参数
export interface StartExamRequest {
  paperId: string;
}

// 开始考试响应
export interface StartExamResponse {
  recordId: string;
  paper: ExamPaper;
  startTime: string;
}

// 提交答案请求参数
export interface SubmitAnswerRequest {
  recordId: string;
  questionId: string;
  answer: AnswerValue;
}

// 提交答案响应
export interface SubmitAnswerResponse {
  success: boolean;
  message: string;
}

// 提交考试请求参数
export interface SubmitExamRequest {
  recordId: string;
  answers: UserAnswer[];
}

// 提交考试响应
export interface SubmitExamResponse {
  recordId: string;
  score: number;
  totalScore: number;
  correctCount: number;
  totalCount: number;
  submittedAt: string;
}

// 获取考试记录请求参数
export interface GetExamRecordsRequest {
  page?: number;
  pageSize?: number;
  userId?: number;
  paperId?: string;
  status?: ExamRecord['status'];
}

// 获取考试记录响应
export interface GetExamRecordsResponse {
  records: ExamRecord[];
  total: number;
  page: number;
  pageSize: number;
}

// 获取考试记录详情请求参数
export interface GetExamRecordRequest {
  recordId: string;
}

// 获取考试记录详情响应
export interface GetExamRecordResponse {
  record: ExamRecord;
  paper: ExamPaper;
}

// 考试统计接口
export interface ExamStats {
  totalExams: number; // 总考试次数
  completedExams: number; // 已完成考试次数
  averageScore: number; // 平均分
  bestScore: number; // 最高分
  totalTime: number; // 总用时（秒）
  averageTime: number; // 平均用时（秒）
}

// 获取考试统计响应
export interface GetExamStatsResponse {
  stats: ExamStats;
}
