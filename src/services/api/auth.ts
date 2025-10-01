import React from 'react';
import type {
  LoginRequest,
  LoginApiResponse,
  RefreshTokenApiResponse,
  GetProfileApiResponse,
  LogoutApiResponse,
} from '@/services/types/auth';

// 认证 API 服务
export const authApi = {
  // 用户登录
  login: (credentials: LoginRequest) =>
    React.Http.post<LoginApiResponse>('/api/auth/login', credentials),

  // 用户登出
  logout: () => React.Http.post<LogoutApiResponse>('/api/auth/logout'),

  // 刷新令牌
  refreshToken: (refreshToken: string) =>
    React.Http.post<RefreshTokenApiResponse>('/api/auth/refresh', {
      refreshToken,
    }),

  // 获取用户信息
  getProfile: () => React.Http.get<GetProfileApiResponse>('/api/auth/profile'),
};
