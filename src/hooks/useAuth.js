import { useContext } from 'react';
import { AuthContext } from '@/context/auth-context';

// 基础认证 Hook（透传 Context，保持最小表面）
export const useAuth = () => {
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
  const { login, logout } = useAuth();
  return { login, logout };
};

// 权限判断 Hook
export const usePermission = () => {
  const { user } = useAuth();

  const hasRole = (role) => user?.role === role;
  const hasAnyRole = (roles) => (user ? roles.includes(user.role) : false);

  const isAdmin = () => hasRole('admin');
  const isUser = () => hasRole('user');

  return { hasRole, hasAnyRole, isAdmin, isUser };
};
