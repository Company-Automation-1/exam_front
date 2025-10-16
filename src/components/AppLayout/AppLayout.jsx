import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const AppLayout = React.memo(({ children }) => {
  const location = useLocation();
  
  // 使用useMemo缓存布局判断逻辑
  const shouldUseLayout = useMemo(() => {
    return !React.NoLayoutPaths.includes(location.pathname);
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
