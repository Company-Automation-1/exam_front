import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '@/context/auth-context';

// 基础认证 Hook（透传 Context，保持最小表面）
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 认证状态 Hook：衍生只读状态
export const useAuthState = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
  };
};

// 认证操作 Hook：稳定的函数引用
export const useAuthActions = () => {
  const { login, logout, refreshUser } = useAuth();
  return { login, logout, refreshUser };
};

// 权限判断 Hook
export const usePermission = () => {
  const { user } = useAuth();

  const hasRole = (role: 'admin' | 'user'): boolean => user?.role === role;
  const hasAnyRole = (roles: Array<'admin' | 'user'>): boolean =>
    user ? roles.includes(user.role) : false;

  const isAdmin = (): boolean => hasRole('admin');
  const isUser = (): boolean => hasRole('user');

  return { hasRole, hasAnyRole, isAdmin, isUser };
};
