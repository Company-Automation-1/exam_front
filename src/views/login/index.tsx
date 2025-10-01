import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { LoginRequest } from '@/services/types/auth';
import { message, Form, Input, Button, Card, Typography } from 'antd';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const { login, isLoading, isAuthenticated } = useAuth();

  // 已登录状态下不渲染登录表单，防止闪屏
  if (!isLoading && isAuthenticated) {
    return null;
  }

  const handleLogin = async (values: LoginRequest) => {
    const success = await login(values);
    if (success) {
      message.success('登录成功');
      // 登录后优先回跳到上次访问页
      const back = sessionStorage.getItem('lastVisitedPage') || '/';
      React.navigate(back);
    } else {
      message.error('登录失败，请检查邮箱和密码');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2}>用户登录</Title>
          <Text type="secondary">请输入您的登录凭据</Text>
        </div>

        <Form onFinish={handleLogin} layout="vertical">
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              size="large"
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            测试账号：admin@example.com / admin123
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
