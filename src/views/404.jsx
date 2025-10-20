import React from 'react';
import { Result, Button } from 'antd';

const NotFoundPage = ({
  status = '404',
  title = '404',
  subTitle = '抱歉，您访问的页面不存在。',
  showBackButton = true,
}) => {
  const handleGoHome = () => {
    React.navigate('/home');
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const buttons = [
    <Button type="primary" key="home" onClick={handleGoHome}>
      返回首页
    </Button>,
  ];

  if (showBackButton) {
    buttons.push(
      <Button key="back" onClick={handleGoBack}>
        返回上页
      </Button>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Result
        status={status}
        title={title}
        subTitle={subTitle}
        extra={buttons}
      />
    </div>
  );
};

export default NotFoundPage;
