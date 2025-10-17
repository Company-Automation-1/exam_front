import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const AppLayout = React.memo(({ children }) => {
  const location = useLocation();

  // 使用useMemo缓存布局判断逻辑
  const shouldUseLayout = useMemo(() => {
    const noLayoutPaths = React.NoLayoutPaths || [];

    // 检查当前路径是否在 NoLayoutPaths 中
    const isInNoLayout = noLayoutPaths.some((path) => {
      if (path.endsWith('*')) {
        // 通配符匹配：/admin/* 匹配 /admin/xxx
        const prefix = path.slice(0, -1);
        return location.pathname.startsWith(prefix);
      }
      return location.pathname === path;
    });

    return !isInNoLayout;
  }, [location.pathname]);

  // 如果不需要布局，直接返回子组件
  if (!shouldUseLayout) {
    return <>{children}</>;
  }

  // 显示布局
  return (
    <div>
      <h1>9999</h1>
      {children}
    </div>
  );
});

export default AppLayout;
