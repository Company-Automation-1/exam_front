import React from 'react';
import { Result, Button } from 'antd';

const UnauthorizedPage: React.FC = () => {
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
        status="403"
        title="403"
        subTitle="抱歉，您没有权限访问此页面。"
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

export default UnauthorizedPage;
