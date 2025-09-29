import type { ApiResponse } from '@/services/request';

// 认证相关类型定义
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// API 响应类型
export type LoginApiResponse = ApiResponse<LoginResponse>;
export type RefreshTokenApiResponse = ApiResponse<RefreshTokenResponse>;
export type GetProfileApiResponse = ApiResponse<UserProfile>;
export type LogoutApiResponse = ApiResponse<null>;
