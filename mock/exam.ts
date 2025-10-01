import { MockMethod } from 'vite-plugin-mock';
import type {
  ExamPaper,
  ExamRecord,
  UserAnswer,
  GetPapersRequest,
  GetPapersResponse,
  GetPaperRequest,
  StartExamRequest,
  StartExamResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  SubmitExamRequest,
  SubmitExamResponse,
  GetExamRecordsRequest,
  GetExamRecordsResponse,
  GetExamRecordRequest,
  GetExamRecordResponse,
  GetExamStatsResponse,
  ExamStats,
} from '../src/services/types/exam';

// Mock 试卷数据
const mockPapers: ExamPaper[] = [
  {
    paperId: 'paper-1',
    title: 'React 基础知识测试',
    description: '测试你对 React 基础知识的掌握程度',
    durationSec: 1800, // 30分钟
    totalScore: 100,
    questions: [
      {
        id: 'q1',
        stem: '1. React 中用于描述 UI 的基本单位是？',
        type: 'single',
        options: ['Component', 'Service', 'Controller', 'Mixin'],
        score: 10,
        difficulty: 'easy',
      },
      {
        id: 'q2',
        stem: '2. 以下哪项常用于管理路由？',
        type: 'single',
        options: ['redux', 'react-router', 'jotai', 'zustand'],
        score: 10,
        difficulty: 'easy',
      },
      {
        id: 'q3',
        stem: '3. Vite 的主要优势是？',
        type: 'single',
        options: [
          '运行时编译',
          '基于 Webpack 构建',
          '更快的冷启动',
          '仅支持 Node 运行',
        ],
        score: 10,
        difficulty: 'medium',
      },
      {
        id: 'q4',
        stem: '4. React 19 推荐的状态更新 API 是？',
        type: 'single',
        options: ['setState 回调', 'useState Hook', 'this.forceUpdate', 'MobX'],
        score: 10,
        difficulty: 'medium',
      },
      {
        id: 'q5',
        stem: '5. 在 React Router 中用于声明式导航的组件是？',
        type: 'single',
        options: ['Link', 'NavigateFunction', 'Outlet', 'Switch'],
        score: 10,
        difficulty: 'easy',
      },
      {
        id: 'q6',
        stem: '6. Ant Design 中用于栅格布局的组件组合是？',
        type: 'single',
        options: ['Grid + Item', 'Row + Col', 'Flex + Box', 'Layout + Header'],
        score: 10,
        difficulty: 'easy',
      },
      {
        id: 'q7',
        stem: '7. TypeScript 中用于表示可选属性的语法是？',
        type: 'single',
        options: ['name?', 'name!', 'name*', 'name$'],
        score: 10,
        difficulty: 'medium',
      },
      {
        id: 'q8',
        stem: '8. 以下哪项可以减少不必要的重新渲染？',
        type: 'single',
        options: [
          'useMemo/useCallback',
          '增加 key',
          '改用 any 类型',
          '启用 StrictMode',
        ],
        score: 10,
        difficulty: 'hard',
      },
      {
        id: 'q9',
        stem: '9. 下列哪些属于 React 的 Hook？',
        type: 'multiple',
        options: ['useState', 'useFetch', 'useEffect', 'useAjax'],
        score: 10,
        difficulty: 'medium',
      },
      {
        id: 'q10',
        stem: '10. 请填写 Vite 的主要构建工具：',
        type: 'blank',
        options: [],
        score: 10,
        difficulty: 'easy',
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    paperId: 'paper-2',
    title: 'JavaScript 高级特性测试',
    description: '测试你对 JavaScript 高级特性的理解',
    durationSec: 2400, // 40分钟
    totalScore: 100,
    questions: [
      {
        id: 'q1',
        stem: '1. 以下哪个不是 JavaScript 的基本数据类型？',
        type: 'single',
        options: ['string', 'number', 'array', 'boolean'],
        score: 20,
        difficulty: 'easy',
      },
      {
        id: 'q2',
        stem: '2. 请简述你对闭包的理解。',
        type: 'text',
        options: [],
        score: 30,
        difficulty: 'hard',
      },
      {
        id: 'q3',
        stem: '3. 以下哪些是 ES6 的新特性？',
        type: 'multiple',
        options: ['箭头函数', 'let/const', 'class', 'var'],
        score: 25,
        difficulty: 'medium',
      },
      {
        id: 'q4',
        stem: '4. Promise 的三种状态是？',
        type: 'blank',
        options: [],
        score: 25,
        difficulty: 'medium',
      },
    ],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

// Mock 考试记录数据
const mockExamRecords: ExamRecord[] = [
  {
    recordId: 'record-1',
    paperId: 'paper-1',
    userId: 1,
    startTime: '2024-01-15T09:00:00Z',
    endTime: '2024-01-15T09:25:00Z',
    duration: 1500,
    answers: [
      {
        questionId: 'q1',
        answer: 'Component',
        answeredAt: '2024-01-15T09:05:00Z',
      },
      {
        questionId: 'q2',
        answer: 'react-router',
        answeredAt: '2024-01-15T09:10:00Z',
      },
    ],
    score: 85,
    status: 'completed',
    submittedAt: '2024-01-15T09:25:00Z',
  },
  {
    recordId: 'record-2',
    paperId: 'paper-2',
    userId: 1,
    startTime: '2024-01-16T10:00:00Z',
    endTime: '2024-01-16T10:35:00Z',
    duration: 2100,
    answers: [
      {
        questionId: 'q1',
        answer: 'array',
        answeredAt: '2024-01-16T10:05:00Z',
      },
      {
        questionId: 'q2',
        answer: '闭包是指有权访问另一个函数作用域中变量的函数...',
        answeredAt: '2024-01-16T10:15:00Z',
      },
    ],
    score: 75,
    status: 'completed',
    submittedAt: '2024-01-16T10:35:00Z',
  },
];

// 当前进行中的考试记录
let currentExamRecord: ExamRecord | null = null;

// 生成唯一ID
const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// 获取当前用户ID（从token中解析）
const getCurrentUserId = (headers: any): number => {
  const token =
    headers.authorization?.replace('Bearer ', '') || headers['x-auth-token'];
  if (token && token.includes('mock_token_')) {
    const match = token.match(/mock_token_(\d+)_/);
    if (match) {
      return parseInt(match[1]);
    }
  }
  return 1; // 默认用户ID
};

// 计算考试得分
const calculateScore = (paper: ExamPaper, answers: UserAnswer[]): number => {
  let totalScore = 0;
  const answerMap = new Map(answers.map((a) => [a.questionId, a.answer]));

  for (const question of paper.questions) {
    const userAnswer = answerMap.get(question.id);
    if (userAnswer) {
      // 简单的评分逻辑，实际项目中需要更复杂的评分算法
      if (question.type === 'single' || question.type === 'boolean') {
        // 单选题和判断题的正确答案（这里简化处理）
        const correctAnswers: Record<string, string> = {
          q1: 'Component',
          q2: 'react-router',
          q3: '更快的冷启动',
          q4: 'useState Hook',
          q5: 'Link',
          q6: 'Row + Col',
          q7: 'name?',
          q8: 'useMemo/useCallback',
        };
        if (correctAnswers[question.id] === userAnswer) {
          totalScore += question.score || 0;
        }
      } else if (question.type === 'multiple') {
        // 多选题的正确答案（这里简化处理）
        const correctAnswers: Record<string, string[]> = {
          q9: ['useState', 'useEffect'],
        };
        if (correctAnswers[question.id]) {
          const userAnswers = Array.isArray(userAnswer)
            ? userAnswer
            : [userAnswer];
          const correctAnswersList = correctAnswers[question.id];
          const isCorrect =
            userAnswers.every((ans) => correctAnswersList.includes(ans)) &&
            userAnswers.length === correctAnswersList.length;
          if (isCorrect) {
            totalScore += question.score || 0;
          }
        }
      } else {
        // 填空题和问答题给部分分数
        totalScore += (question.score || 0) * 0.8; // 给80%的分数
      }
    }
  }

  return Math.round(totalScore);
};

export default [
  // 获取试卷列表
  {
    url: '/api/exam/papers',
    method: 'get',
    response: ({ query }: { query: GetPapersRequest }) => {
      console.log('🔍 Mock get papers endpoint called with query:', query);

      let filteredPapers = [...mockPapers];

      // 关键词过滤
      if (query.keyword) {
        filteredPapers = filteredPapers.filter(
          (paper) =>
            paper.title.toLowerCase().includes(query.keyword!.toLowerCase()) ||
            paper.description
              ?.toLowerCase()
              .includes(query.keyword!.toLowerCase())
        );
      }

      // 状态过滤（这里简化处理，所有试卷都是active状态）
      if (query.status) {
        // 实际项目中需要根据状态过滤
      }

      // 分页
      const page = query.page || 1;
      const pageSize = query.pageSize || 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      const papers = filteredPapers.slice(start, end);

      const response: GetPapersResponse = {
        papers,
        total: filteredPapers.length,
        page,
        pageSize,
      };

      console.log('✅ Get papers successful, returning:', response);
      return {
        code: 200,
        message: '获取试卷列表成功',
        result: response,
      };
    },
  },

  // 获取试卷详情
  {
    url: '/api/exam/papers/:paperId',
    method: 'get',
    response: ({ params }: { params: GetPaperRequest }) => {
      console.log('🔍 Mock get paper endpoint called with params:', params);

      const paper = mockPapers.find((p) => p.paperId === params.paperId);

      if (paper) {
        console.log('✅ Get paper successful, returning:', paper);
        return {
          code: 200,
          message: '获取试卷详情成功',
          result: paper,
        };
      } else {
        console.log('❌ Paper not found:', params.paperId);
        return {
          code: 404,
          message: '试卷不存在',
          result: null,
        };
      }
    },
  },

  // 开始考试
  {
    url: '/api/exam/start',
    method: 'post',
    response: ({ body, headers }: { body: StartExamRequest; headers: any }) => {
      console.log('🔍 Mock start exam endpoint called with body:', body);

      const userId = getCurrentUserId(headers);
      const paper = mockPapers.find((p) => p.paperId === body.paperId);

      if (!paper) {
        return {
          code: 404,
          message: '试卷不存在',
          result: null,
        };
      }

      // 创建新的考试记录
      const recordId = generateId('record');
      const startTime = new Date().toISOString();

      currentExamRecord = {
        recordId,
        paperId: body.paperId,
        userId,
        startTime,
        duration: 0,
        answers: [],
        status: 'in_progress',
      };

      const response: StartExamResponse = {
        recordId,
        paper,
        startTime,
      };

      console.log('✅ Start exam successful, returning:', response);
      return {
        code: 200,
        message: '开始考试成功',
        result: response,
      };
    },
  },

  // 提交答案
  {
    url: '/api/exam/answer',
    method: 'post',
    response: ({ body }: { body: SubmitAnswerRequest }) => {
      console.log('🔍 Mock submit answer endpoint called with body:', body);

      if (!currentExamRecord || currentExamRecord.recordId !== body.recordId) {
        return {
          code: 400,
          message: '考试记录不存在',
          result: null,
        };
      }

      // 更新答案
      const existingAnswerIndex = currentExamRecord.answers.findIndex(
        (a) => a.questionId === body.questionId
      );

      const newAnswer: UserAnswer = {
        questionId: body.questionId,
        answer: body.answer,
        answeredAt: new Date().toISOString(),
      };

      if (existingAnswerIndex >= 0) {
        currentExamRecord.answers[existingAnswerIndex] = newAnswer;
      } else {
        currentExamRecord.answers.push(newAnswer);
      }

      const response: SubmitAnswerResponse = {
        success: true,
        message: '答案提交成功',
      };

      console.log('✅ Submit answer successful, returning:', response);
      return {
        code: 200,
        message: '答案提交成功',
        result: response,
      };
    },
  },

  // 提交考试
  {
    url: '/api/exam/submit',
    method: 'post',
    response: ({ body }: { body: SubmitExamRequest }) => {
      console.log('🔍 Mock submit exam endpoint called with body:', body);

      if (!currentExamRecord || currentExamRecord.recordId !== body.recordId) {
        return {
          code: 400,
          message: '考试记录不存在',
          result: null,
        };
      }

      const paper = mockPapers.find(
        (p) => p.paperId === currentExamRecord!.paperId
      );
      if (!paper) {
        return {
          code: 404,
          message: '试卷不存在',
          result: null,
        };
      }

      // 计算得分
      const score = calculateScore(paper, body.answers);
      const endTime = new Date().toISOString();
      const startTime = new Date(currentExamRecord.startTime);
      const duration = Math.floor(
        (new Date(endTime).getTime() - startTime.getTime()) / 1000
      );

      // 更新考试记录
      currentExamRecord.endTime = endTime;
      currentExamRecord.duration = duration;
      currentExamRecord.answers = body.answers;
      currentExamRecord.score = score;
      currentExamRecord.status = 'completed';
      currentExamRecord.submittedAt = endTime;

      // 保存到历史记录
      mockExamRecords.push({ ...currentExamRecord });

      const response: SubmitExamResponse = {
        recordId: currentExamRecord.recordId,
        score,
        totalScore: paper.totalScore,
        correctCount: Math.round(
          (score / paper.totalScore) * paper.questions.length
        ),
        totalCount: paper.questions.length,
        submittedAt: endTime,
      };

      console.log('✅ Submit exam successful, returning:', response);
      return {
        code: 200,
        message: '考试提交成功',
        result: response,
      };
    },
  },

  // 获取考试记录列表
  {
    url: '/api/exam/records',
    method: 'get',
    response: ({
      query,
      headers,
    }: {
      query: GetExamRecordsRequest;
      headers: any;
    }) => {
      console.log(
        '🔍 Mock get exam records endpoint called with query:',
        query
      );

      const userId = getCurrentUserId(headers);
      let filteredRecords = mockExamRecords.filter(
        (record) => record.userId === userId
      );

      // 试卷ID过滤
      if (query.paperId) {
        filteredRecords = filteredRecords.filter(
          (record) => record.paperId === query.paperId
        );
      }

      // 状态过滤
      if (query.status) {
        filteredRecords = filteredRecords.filter(
          (record) => record.status === query.status
        );
      }

      // 分页
      const page = query.page || 1;
      const pageSize = query.pageSize || 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      const records = filteredRecords.slice(start, end);

      const response: GetExamRecordsResponse = {
        records,
        total: filteredRecords.length,
        page,
        pageSize,
      };

      console.log('✅ Get exam records successful, returning:', response);
      return {
        code: 200,
        message: '获取考试记录成功',
        result: response,
      };
    },
  },

  // 获取考试记录详情
  {
    url: '/api/exam/records/:recordId',
    method: 'get',
    response: ({ params }: { params: GetExamRecordRequest }) => {
      console.log(
        '🔍 Mock get exam record endpoint called with params:',
        params
      );

      const record = mockExamRecords.find(
        (r) => r.recordId === params.recordId
      );

      if (!record) {
        return {
          code: 404,
          message: '考试记录不存在',
          result: null,
        };
      }

      const paper = mockPapers.find((p) => p.paperId === record.paperId);
      if (!paper) {
        return {
          code: 404,
          message: '试卷不存在',
          result: null,
        };
      }

      const response: GetExamRecordResponse = {
        record,
        paper,
      };

      console.log('✅ Get exam record successful, returning:', response);
      return {
        code: 200,
        message: '获取考试记录详情成功',
        result: response,
      };
    },
  },

  // 获取考试统计
  {
    url: '/api/exam/stats',
    method: 'get',
    response: ({ headers }: { headers: any }) => {
      console.log('🔍 Mock get exam stats endpoint called');

      const userId = getCurrentUserId(headers);
      const userRecords = mockExamRecords.filter(
        (record) => record.userId === userId
      );

      const stats: ExamStats = {
        totalExams: userRecords.length,
        completedExams: userRecords.filter((r) => r.status === 'completed')
          .length,
        averageScore:
          userRecords.length > 0
            ? Math.round(
                userRecords.reduce((sum, r) => sum + (r.score || 0), 0) /
                  userRecords.length
              )
            : 0,
        bestScore:
          userRecords.length > 0
            ? Math.max(...userRecords.map((r) => r.score || 0))
            : 0,
        totalTime: userRecords.reduce((sum, r) => sum + r.duration, 0),
        averageTime:
          userRecords.length > 0
            ? Math.round(
                userRecords.reduce((sum, r) => sum + r.duration, 0) /
                  userRecords.length
              )
            : 0,
      };

      const response: GetExamStatsResponse = {
        stats,
      };

      console.log('✅ Get exam stats successful, returning:', response);
      return {
        code: 200,
        message: '获取考试统计成功',
        result: response,
      };
    },
  },

  // 获取当前用户的考试记录
  {
    url: '/api/exam/my-records',
    method: 'get',
    response: ({
      query,
      headers,
    }: {
      query: Omit<GetExamRecordsRequest, 'userId'>;
      headers: any;
    }) => {
      console.log(
        '🔍 Mock get my exam records endpoint called with query:',
        query
      );

      const userId = getCurrentUserId(headers);
      let filteredRecords = mockExamRecords.filter(
        (record) => record.userId === userId
      );

      // 试卷ID过滤
      if (query.paperId) {
        filteredRecords = filteredRecords.filter(
          (record) => record.paperId === query.paperId
        );
      }

      // 状态过滤
      if (query.status) {
        filteredRecords = filteredRecords.filter(
          (record) => record.status === query.status
        );
      }

      // 分页
      const page = query.page || 1;
      const pageSize = query.pageSize || 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      const records = filteredRecords.slice(start, end);

      const response: GetExamRecordsResponse = {
        records,
        total: filteredRecords.length,
        page,
        pageSize,
      };

      console.log('✅ Get my exam records successful, returning:', response);
      return {
        code: 200,
        message: '获取我的考试记录成功',
        result: response,
      };
    },
  },

  // 获取当前用户的考试统计
  {
    url: '/api/exam/my-stats',
    method: 'get',
    response: ({ headers }: { headers: any }) => {
      console.log('🔍 Mock get my exam stats endpoint called');

      const userId = getCurrentUserId(headers);
      const userRecords = mockExamRecords.filter(
        (record) => record.userId === userId
      );

      const stats: ExamStats = {
        totalExams: userRecords.length,
        completedExams: userRecords.filter((r) => r.status === 'completed')
          .length,
        averageScore:
          userRecords.length > 0
            ? Math.round(
                userRecords.reduce((sum, r) => sum + (r.score || 0), 0) /
                  userRecords.length
              )
            : 0,
        bestScore:
          userRecords.length > 0
            ? Math.max(...userRecords.map((r) => r.score || 0))
            : 0,
        totalTime: userRecords.reduce((sum, r) => sum + r.duration, 0),
        averageTime:
          userRecords.length > 0
            ? Math.round(
                userRecords.reduce((sum, r) => sum + r.duration, 0) /
                  userRecords.length
              )
            : 0,
      };

      const response: GetExamStatsResponse = {
        stats,
      };

      console.log('✅ Get my exam stats successful, returning:', response);
      return {
        code: 200,
        message: '获取我的考试统计成功',
        result: response,
      };
    },
  },
] as MockMethod[];
