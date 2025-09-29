import request from '@/services/request';
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
    request.get<GetUsersResponse>('/api/users', { params }),

  // 获取单个用户
  getUser: (id: number) => request.get<GetUserResponse>(`/api/users/${id}`),

  // 创建用户
  createUser: (data: CreateUserRequest) =>
    request.post<CreateUserResponse>('/api/users', data),

  // 更新用户
  updateUser: (id: number, data: UpdateUserRequest) =>
    request.put<UpdateUserResponse>(`/api/users/${id}`, data),

  // 删除用户
  deleteUser: (id: number) =>
    request.delete<DeleteUserResponse>(`/api/users/${id}`),
};
