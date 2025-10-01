// 考试相关API接口
import React from 'react';
import type {
  ExamPaper,
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
} from '@/services/types/exam';

// 考试API类
class ExamApi {
  private baseUrl = '/api/exam';

  // 获取试卷列表
  async getPapers(params: GetPapersRequest = {}): Promise<GetPapersResponse> {
    const response = await React.Http.get(`${this.baseUrl}/papers`, { params });
    return response.result;
  }

  // 获取试卷详情
  async getPaper(params: GetPaperRequest): Promise<ExamPaper> {
    const response = await React.Http.get(
      `${this.baseUrl}/papers/${params.paperId}`
    );
    return response.result;
  }

  // 开始考试
  async startExam(data: StartExamRequest): Promise<StartExamResponse> {
    const response = await React.Http.post(`${this.baseUrl}/start`, data);
    return response.result;
  }

  // 提交答案
  async submitAnswer(data: SubmitAnswerRequest): Promise<SubmitAnswerResponse> {
    const response = await React.Http.post(`${this.baseUrl}/answer`, data);
    return response.result;
  }

  // 提交考试
  async submitExam(data: SubmitExamRequest): Promise<SubmitExamResponse> {
    const response = await React.Http.post(`${this.baseUrl}/submit`, data);
    return response.result;
  }

  // 获取考试记录列表
  async getExamRecords(
    params: GetExamRecordsRequest = {}
  ): Promise<GetExamRecordsResponse> {
    const response = await React.Http.get(`${this.baseUrl}/records`, {
      params,
    });
    return response.result;
  }

  // 获取考试记录详情
  async getExamRecord(
    params: GetExamRecordRequest
  ): Promise<GetExamRecordResponse> {
    const response = await React.Http.get(
      `${this.baseUrl}/records/${params.recordId}`
    );
    return response.result;
  }

  // 获取考试统计
  async getExamStats(): Promise<GetExamStatsResponse> {
    const response = await React.Http.get(`${this.baseUrl}/stats`);
    return response.result;
  }

  // 获取当前用户的考试记录
  async getMyExamRecords(
    params: Omit<GetExamRecordsRequest, 'userId'> = {}
  ): Promise<GetExamRecordsResponse> {
    const response = await React.Http.get(`${this.baseUrl}/my-records`, {
      params,
    });
    return response.result;
  }

  // 获取当前用户的考试统计
  async getMyExamStats(): Promise<GetExamStatsResponse> {
    const response = await React.Http.get(`${this.baseUrl}/my-stats`);
    return response.result;
  }
}

// 导出考试API实例
export const examApi = new ExamApi();
