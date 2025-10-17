import { useContext } from 'react';
import { AuthContext } from '@/context/auth-context';

/**
 * 认证 Hook - 简化 Context 使用
 * 作用：1. 简化 Context 使用 2. 错误检查 3. 类型安全
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
