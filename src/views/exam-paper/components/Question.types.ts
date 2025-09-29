export type QuestionType = 'single' | 'multiple' | 'blank' | 'text' | 'boolean';

export interface Question {
  id: string;
  stem: string;
  type?: QuestionType;
  options?: string[];
}

// 用户作答的值类型：
// - single/boolean/text/blank 使用字符串
// - multiple 使用字符串数组
export type AnswerValue = string | string[];
