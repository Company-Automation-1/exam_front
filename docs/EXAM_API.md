# 考试系统API文档

## 概述

本文档描述了考试系统相关的API接口，包括试卷管理、考试流程、答案提交等功能。

## 类型定义

### 核心类型

```typescript
// 题目类型
export type QuestionType = 'single' | 'multiple' | 'blank' | 'text' | 'boolean';

// 题目接口
export interface Question {
  id: string;
  stem: string;
  type?: QuestionType;
  options?: string[];
  score?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// 用户答案
export interface UserAnswer {
  questionId: string;
  answer: AnswerValue;
  answeredAt: string;
}

// 试卷接口
export interface ExamPaper {
  paperId: string;
  title: string;
  description?: string;
  durationSec: number;
  totalScore: number;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

// 考试记录
export interface ExamRecord {
  recordId: string;
  paperId: string;
  userId: number;
  startTime: string;
  endTime?: string;
  duration: number;
  answers: UserAnswer[];
  score?: number;
  status: 'in_progress' | 'completed' | 'timeout' | 'submitted';
  submittedAt?: string;
}
```

## API接口

### 1. 试卷管理

#### 获取试卷列表

```typescript
const response = await examApi.getPapers({
  page: 1,
  pageSize: 10,
  keyword: 'React',
  status: 'active',
});
```

#### 获取试卷详情

```typescript
const paper = await examApi.getPaper({ paperId: 'paper-1' });
```

### 2. 考试流程

#### 开始考试

```typescript
const response = await examApi.startExam({ paperId: 'paper-1' });
// 返回: { recordId, paper, startTime }
```

#### 提交答案

```typescript
await examApi.submitAnswer({
  recordId: 'record-123',
  questionId: 'q1',
  answer: 'Component',
});
```

#### 提交考试

```typescript
const response = await examApi.submitExam({
  recordId: 'record-123',
  answers: [
    {
      questionId: 'q1',
      answer: 'Component',
      answeredAt: '2024-01-15T09:05:00Z',
    },
  ],
});
// 返回: { recordId, score, totalScore, correctCount, totalCount, submittedAt }
```

### 3. 考试记录

#### 获取考试记录列表

```typescript
const response = await examApi.getExamRecords({
  page: 1,
  pageSize: 10,
  userId: 1,
  paperId: 'paper-1',
  status: 'completed',
});
```

#### 获取考试记录详情

```typescript
const response = await examApi.getExamRecord({ recordId: 'record-123' });
// 返回: { record, paper }
```

### 4. 统计信息

#### 获取考试统计

```typescript
const response = await examApi.getExamStats();
// 返回: { stats: { totalExams, completedExams, averageScore, bestScore, totalTime, averageTime } }
```

#### 获取当前用户统计

```typescript
const response = await examApi.getMyExamStats();
```

## Mock数据

项目已配置Mock数据，包含以下内容：

### 试卷数据

- **paper-1**: React基础知识测试（10题，30分钟）
- **paper-2**: JavaScript高级特性测试（4题，40分钟）

### 考试记录

- 包含已完成的考试记录示例
- 支持不同状态的考试记录

## 使用示例

### 在React组件中使用

```typescript
import React from 'react';
import { examApi } from '@/services/api';
import type { ExamPaper, UserAnswer } from '@/services/types';

const ExamComponent: React.FC = () => {
  const [paper, setPaper] = useState<ExamPaper | null>(null);
  const [recordId, setRecordId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

  // 开始考试
  const startExam = async () => {
    try {
      const response = await examApi.startExam({ paperId: 'paper-1' });
      setPaper(response.paper);
      setRecordId(response.recordId);
    } catch (error) {
      console.error('开始考试失败:', error);
    }
  };

  // 提交答案
  const submitAnswer = async (questionId: string, answer: AnswerValue) => {
    if (!recordId) return;

    try {
      await examApi.submitAnswer({
        recordId,
        questionId,
        answer
      });
      setAnswers(prev => ({ ...prev, [questionId]: answer }));
    } catch (error) {
      console.error('提交答案失败:', error);
    }
  };

  // 提交考试
  const submitExam = async () => {
    if (!paper || !recordId) return;

    try {
      const userAnswers: UserAnswer[] = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
        answeredAt: new Date().toISOString()
      }));

      const response = await examApi.submitExam({
        recordId,
        answers: userAnswers
      });

      console.log('考试提交成功:', response);
    } catch (error) {
      console.error('提交考试失败:', error);
    }
  };

  return (
    <div>
      {/* 考试界面 */}
    </div>
  );
};
```

## 错误处理

所有API调用都应该包含适当的错误处理：

```typescript
try {
  const response = await examApi.startExam({ paperId: 'paper-1' });
  // 处理成功响应
} catch (error) {
  console.error('API调用失败:', error);
  // 显示错误消息给用户
  message.error('操作失败，请重试');
}
```

## 注意事项

1. **认证**: 所有API调用都需要有效的认证token
2. **自动提交**: 选择答案时会自动提交到服务器
3. **时间管理**: 考试有严格的时间限制，超时自动提交
4. **数据持久化**: 答案会实时保存，避免数据丢失
5. **错误恢复**: 网络错误时应该提供重试机制

## 测试

可以使用测试页面 `/test-exam` 来验证API功能是否正常。

## 扩展

如需添加新的API接口，请：

1. 在 `src/services/types/exam.ts` 中添加类型定义
2. 在 `src/services/api/exam.ts` 中添加API方法
3. 在 `mock/exam.ts` 中添加Mock数据
4. 更新相关文档
