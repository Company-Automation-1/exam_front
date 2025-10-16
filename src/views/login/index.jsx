import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import LoginCard from './login';
import RegisterCard from './register';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('login');

  const tabItems = [
    {
      key: 'login',
      label: '登录',
      children: <LoginCard onSwitchToRegister={() => setActiveTab('register')} />
    },
    {
      key: 'register',
      label: '注册',
      children: <RegisterCard onSwitchToLogin={() => setActiveTab('login')} />
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          border: 'none'
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          centered
          size="large"
        />
      </Card>
    </div>
  );
};

export default LoginPage;