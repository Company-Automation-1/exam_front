import React from 'react';
import MyFooter from '@/components/MyFooter';

const AppLayout = React.memo(({ children }) => {
  // 移除路由判断逻辑，因为 LayoutRenderer 已经处理了
  return (
    <>
      {children}
      <MyFooter />
    </>
  );
});

export default AppLayout;
