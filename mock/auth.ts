import { MockMethod } from 'vite-plugin-mock';
import type {
  LoginRequest,
  LoginResponse,
  UserProfile,
} from '../src/services/types/auth';

// Mock 用户数据
const mockUsers: UserProfile[] = [
  {
    id: 1,
    name: '管理员',
    email: 'admin@example.com',
    role: 'admin',
  },
  {
    id: 2,
    name: '普通用户',
    email: 'user@example.com',
    role: 'user',
  },
  {
    id: 3,
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'user',
  },
];

// Mock 登录凭据
const mockCredentials: Record<string, string> = {
  'admin@example.com': 'admin123',
  'user@example.com': 'user123',
  'zhangsan@example.com': 'zhangsan123',
};

// 生成 mock token
const generateMockToken = (userId: number): string => {
  return `mock_token_${userId}_${Date.now()}`;
};

// 验证 mock 凭据
const validateMockCredentials = (
  email: string,
  password: string
): UserProfile | null => {
  const user = mockUsers.find((u) => u.email === email);
  const correctPassword = mockCredentials[email];

  if (user && correctPassword === password) {
    return user;
  }

  return null;
};

// 根据 token 获取用户信息
const getUserByToken = (token: string): UserProfile | null => {
  const match = token.match(/mock_token_(\d+)_/);
  if (match) {
    const userId = parseInt(match[1]);
    return mockUsers.find((u) => u.id === userId) || null;
  }
  return null;
};

// 创建 mock 登录响应
const createMockLoginResponse = (user: UserProfile): LoginResponse => {
  return {
    accessToken: generateMockToken(user.id),
    refreshToken: generateMockToken(user.id),
    user,
  };
};

export default [
  // 登录接口
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }: { body: LoginRequest }) => {
      console.log('🔍 Mock login endpoint called with body:', body);
      const { email, password } = body;

      const user = validateMockCredentials(email, password);
      console.log('🔍 User found:', user);

      if (user) {
        const loginResponse = createMockLoginResponse(user);
        console.log('✅ Login successful, returning:', loginResponse);
        return {
          code: 200,
          message: '登录成功',
          result: loginResponse,
        };
      } else {
        console.log('❌ Login failed for:', email);
        return {
          code: 401,
          message: '邮箱或密码错误',
          result: null,
        };
      }
    },
  },

  // 获取用户信息接口
  {
    url: '/api/auth/profile',
    method: 'get',
    response: ({ headers }: { headers: any }) => {
      const token =
        headers.authorization?.replace('Bearer ', '') ||
        headers['x-auth-token'] ||
        localStorage.getItem('auth_token');

      if (!token) {
        return {
          code: 401,
          message: '未登录',
          result: null,
        };
      }

      const user = getUserByToken(token);
      if (user) {
        return {
          code: 200,
          message: '获取用户信息成功',
          result: user,
        };
      } else {
        return {
          code: 401,
          message: '令牌无效',
          result: null,
        };
      }
    },
  },

  // 登出接口
  {
    url: '/api/auth/logout',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '登出成功',
        result: null,
      };
    },
  },

  // 刷新令牌接口
  {
    url: '/api/auth/refresh',
    method: 'post',
    response: ({ body }: { body: { refreshToken: string } }) => {
      const { refreshToken } = body;

      const user = getUserByToken(refreshToken);
      if (user) {
        return {
          code: 200,
          message: '令牌刷新成功',
          result: {
            accessToken: generateMockToken(user.id),
            refreshToken: generateMockToken(user.id),
          },
        };
      } else {
        return {
          code: 401,
          message: '令牌无效',
          result: null,
        };
      }
    },
  },
] as MockMethod[];
