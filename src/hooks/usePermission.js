import { useAuth } from './useAuth';

/**
 * 权限判断 Hook
 * 基于后端返回的 access 字段进行权限控制
 */
export const usePermission = () => {
  const { user } = useAuth();
  const userAccess = user?.access;

  return {
    // 基础权限 - 权限包含关系（参考 admin/access.ts）
    canSuperAdmin: userAccess === 'super_admin',
    canAdmin: userAccess === 'admin' || userAccess === 'super_admin',
    canUser:
      userAccess === 'user' ||
      userAccess === 'admin' ||
      userAccess === 'super_admin',

    // 用户信息
    userAccess,
  };
};
