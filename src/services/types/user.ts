import type { ApiResponse } from '@/services/request';

// 用户相关类型定义
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  createTime: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'admin' | 'user';
}

// API 响应类型
export type GetUsersResponse = ApiResponse<UserListResponse>;
export type GetUserResponse = ApiResponse<User>;
export type CreateUserResponse = ApiResponse<User>;
export type UpdateUserResponse = ApiResponse<User>;
export type DeleteUserResponse = ApiResponse<null>;
