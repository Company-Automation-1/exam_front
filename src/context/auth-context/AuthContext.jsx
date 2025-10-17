import React, { createContext, useState, useMemo } from 'react';

// 创建认证上下文
export const AuthContext = createContext(undefined);

/**
 * 认证状态提供者 - 只管理状态
 * 职责：状态存储、状态共享、避免prop drilling
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user;

  const value = useMemo(
    () => ({
      // 状态
      user,
      isLoading,
      isAuthenticated,

      // 状态更新方法
      setUser,
      setIsLoading,
    }),
    [user, isLoading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
