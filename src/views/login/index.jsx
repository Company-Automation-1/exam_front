import React from 'react';
import MyFooter from '@/components/MyFooter';
import LoginForm from '@/components/LoginForm';

// 登录页面样式
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'auto',
};

const formContainerStyle = {
  flex: '1',
  padding: '32px 0',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  paddingTop: '80px',
};

const loginFormStyle = {
  minWidth: 280,
  maxWidth: '85vw',
  margin: '0 auto',
};

const Login = () => {
  // 设置页面标题
  React.useEffect(() => {
    document.title = '登录';
  }, []);

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <LoginForm
          showLogo={true}
          showTitle={true}
          title="Test"
          style={loginFormStyle}
        />
      </div>
      <MyFooter />
    </div>
  );
};

export default Login;
