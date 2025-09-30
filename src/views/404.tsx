import React from 'react';
import { Result, Button } from 'antd';

const NotFoundPage: React.FC = () => {
  const handleGoHome = () => {
    React.navigate('/');
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在。"
        extra={[
          <Button type="primary" key="home" onClick={handleGoHome}>
            返回首页
          </Button>,
          <Button key="back" onClick={handleGoBack}>
            返回上页
          </Button>,
        ]}
      />
    </div>
  );
};

export default NotFoundPage;
