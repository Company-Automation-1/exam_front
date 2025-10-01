import React from 'react';
import type {
  CreateUserRequest,
  UpdateUserRequest,
  GetUsersResponse,
  GetUserResponse,
  CreateUserResponse,
  UpdateUserResponse,
  DeleteUserResponse,
} from '@/services/types/user';

// 用户 API 服务
export const userApi = {
  // 获取用户列表
  getUsers: (params?: { page?: number; pageSize?: number; keyword?: string }) =>
    React.Http.get<GetUsersResponse>('/api/users', { params }),

  // 获取单个用户
  getUser: (id: number) => React.Http.get<GetUserResponse>(`/api/users/${id}`),

  // 创建用户
  createUser: (data: CreateUserRequest) =>
    React.Http.post<CreateUserResponse>('/api/users', data),

  // 更新用户
  updateUser: (id: number, data: UpdateUserRequest) =>
    React.Http.put<UpdateUserResponse>(`/api/users/${id}`, data),

  // 删除用户
  deleteUser: (id: number) =>
    React.Http.delete<DeleteUserResponse>(`/api/users/${id}`),
};
