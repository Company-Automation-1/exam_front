import { Button } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const { canSuperAdmin, canAdmin, canUser, userAccess } = usePermission();

  // useEffect(() => {
  //   console.log('🔍 权限状态:', {
  //     canSuperAdmin,
  //     canAdmin,
  //     canUser,
  //     userAccess,
  //   });
  //   console.log('🔍 用户信息:', { user, isAuthenticated });
  // }, [canSuperAdmin, canAdmin, canUser, userAccess, user, isAuthenticated]);

  return (
    <>
      <h1>Home</h1>
      <Button disabled={!canSuperAdmin}>仅限超管可用</Button>
      <Button disabled={!canAdmin}>管理员以上可用</Button>
      <Button disabled={!canUser}>用户以上可用</Button>
    </>
  );
};

export default Index;
