import { request } from '@/utils/request';

/**
 * 考试相关API
 */
export const examApi = {
  /**
   * 获取试卷列表
   * @param {Object} params - 查询参数
   * @param {number} params.current - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.status - 试卷状态
   * @param {number} params.categoryId - 分类ID
   * @returns {Promise<Object>} 试卷列表
   */
  async getExams(params = {}) {
    return await request('/api/exams', {
      method: 'GET',
      params,
    });
  },

  /**
   * 获取试卷详情
   * @param {number} id - 试卷ID
   * @returns {Promise<Object>} 试卷详情
   */
  async getExam(id) {
    return await request(`/api/exams/${id}`, {
      method: 'GET',
    });
  },

  /**
   * 获取考试统计
   * @param {number} examId - 试卷ID
   * @returns {Promise<Object>} 考试统计
   */
  async getExamStatistics(examId) {
    return await request(`/api/statistics/exam/${examId}`, {
      method: 'GET',
    });
  },

  /**
   * 开始考试
   * @param {number} examId - 试卷ID
   * @param {number} userId - 用户ID
   * @param {Object} options - 可选参数
   * @param {string} options.ipAddress - IP地址
   * @param {string} options.userAgent - 用户代理
   * @param {Object} options.deviceInfo - 设备信息
   * @returns {Promise<Object>} 考试会话信息
   */
  async startExam(examId, userId, options = {}) {
    return await request('/api/exam-sessions', {
      method: 'POST',
      data: {
        examId,
        userId: +userId,
        ...options,
      },
    });
  },

  /**
   * 获取考试会话详情
   * @param {number} sessionId - 会话ID
   * @returns {Promise<Object>} 考试会话详情
   */
  async getExamSession(sessionId) {
    return await request(`/api/exam-sessions/${sessionId}`, {
      method: 'GET',
    });
  },

  /**
   * 获取试卷题目列表
   * @param {number} examId - 试卷ID
   * @returns {Promise<Object>} 题目列表
   */
  async getExamQuestions(examId) {
    return await request(`/api/questions/exam/${examId}`, {
      method: 'GET',
    });
  },

  /**
   * 保存用户答案（实时提交）
   * @param {number} sessionId - 会话ID
   * @param {number} questionId - 题目ID
   * @param {string} content - 答案内容（主观题）
   * @param {Object} answerOptions - 答案选项（客观题）
   * @returns {Promise<Object>} 保存结果
   */
  async saveAnswer(sessionId, userId, questionId, content, answerOptions) {
    return await request('/api/user-answers', {
      method: 'POST',
      data: {
        sessionId: +sessionId,
        userId: +userId,
        questionId: +questionId,
        content,
        answerOptions,
      },
    });
  },

  /**
   * 获取用户答案列表
   * @param {number} sessionId - 会话ID
   * @param {number} current - 页码，默认1
   * @param {number} pageSize - 每页数量，默认1000（获取所有答案）
   * @returns {Promise<Object>} 答案列表
   */
  async getUserAnswers(sessionId, current = 1, pageSize = 1000) {
    return await request(
      `/api/user-answers?sessionId=${sessionId}&current=${current}&pageSize=${pageSize}`,
      {
        method: 'GET',
      }
    );
  },

  /**
   * 完成考试
   * @param {number} sessionId - 会话ID
   * @returns {Promise<Object>} 完成结果
   */
  async completeExam(sessionId) {
    return await request(`/api/exam-sessions/${sessionId}/complete`, {
      method: 'POST',
    });
  },
};
