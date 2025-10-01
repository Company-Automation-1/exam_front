import React, { useState, useEffect, useCallback, type ReactNode } from 'react';
import type { UserProfile, LoginRequest } from '@/services/types/auth';
import { authApi } from '@/services/api/auth';
import { AuthContext } from './AuthContext.instance';
import type { AuthContextType } from './AuthContext.types';

// 认证提供者组件
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 检查是否已认证
  const isAuthenticated = !!user;

  // 从本地存储获取 token
  const getStoredToken = (): string | null => {
    return localStorage.getItem('auth_token');
  };

  // 保存 token 到本地存储
  const setStoredToken = (token: string): void => {
    localStorage.setItem('auth_token', token);
  };

  // 清除本地存储的 token
  const clearStoredToken = (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  };

  // 设置请求头中的 token
  const setAuthToken = useCallback((token: string | null): void => {
    if (token) {
      setStoredToken(token);
    } else {
      clearStoredToken();
    }
  }, []);

  // 登录函数
  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);

      if (response.code === 200) {
        const { accessToken, refreshToken, user: userData } = response.result;
        setUser(userData);
        setStoredToken(accessToken);
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('登录失败:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出函数
  const logout = useCallback((): void => {
    setUser(null);
    setAuthToken(null);
    // 可以调用服务端登出 API
    authApi.logout().catch(console.error);
  }, [setAuthToken]);

  // 刷新用户信息
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const token = getStoredToken();
      if (!token) {
        setUser(null);
        return;
      }

      const response = await authApi.getProfile();
      if (response.code === 200) {
        setUser(response.result);
      } else {
        // token 无效，清除用户状态
        logout();
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      logout();
    }
  }, [logout]);

  // 初始化时检查认证状态
  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken();
      if (token) {
        await refreshUser();
      }
      setIsLoading(false);
    };

    initAuth();
  }, [refreshUser]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
