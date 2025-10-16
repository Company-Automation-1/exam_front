import React, { useState, useEffect, useCallback } from 'react';
import { authApi } from '@/api/auth';
import { AuthContext } from './AuthContext.instance';
import { getToken, setToken, removeToken } from '@/utils/token';

// 认证提供者组件

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 检查是否已认证
  const isAuthenticated = !!user;

  // 登录函数
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);

      if (response.code === 200) {
        const { accessToken, refreshToken, user: userData } = response.result;
        setUser(userData);
        setToken(accessToken, 'access');
        if (refreshToken) {
          setToken(refreshToken, 'refresh');
        }
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出函数
  const logout = useCallback(() => {
    setUser(null);
    removeToken('all');
    // 可以调用服务端登出 API
    // authApi.logout().catch(console.error);
  }, []);

  // 初始化时检查认证状态（仅在组件挂载时执行一次）
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken('access');
      if (token) {
        try {
          const response = await authApi.getProfile();
          if (response.code === 200) {
            setUser(response.result);
          } else {
            removeToken('all');
          }
        } catch (error) {
          removeToken('all');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []); // 只在挂载时执行

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
