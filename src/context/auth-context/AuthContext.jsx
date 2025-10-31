import React, { createContext, useState, useMemo } from 'react';

// 创建认证上下文
export const AuthContext = createContext(undefined);

/**
 * 认证状态提供者 - 只管理状态
 * 职责：状态存储、状态共享、避免prop drilling
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const value = useMemo(
    () => ({
      // 状态
      user, // 用户信息
      isLoading, // 是否加载中
      isAuthenticated, // 是否已认证

      // 状态更新方法
      setUser, // 设置用户信息
      setIsLoading, // 设置是否加载中
    }),
    [user, isLoading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
