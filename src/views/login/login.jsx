import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/auth';
import { setToken } from '@/utils/token';

const { Title, Text, Link } = Typography;

const LoginCard = ({ onSwitchToRegister }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { setUser, setIsLoading } = useAuth();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setIsLoading(true);
      
      // 组件负责业务逻辑和API调用
      const response = await authApi.login({
        username: values.username,
        password: values.password,
        type: 'account'
      });

      if (response.success) {
        const { token, currentAuthority } = response.data;
        setUser({ 
          username: values.username,
          access: currentAuthority 
        });
        setToken(token);
        message.success('登录成功！');
        React.navigate('/about');
      } else {
        message.error(response.error?.message || '用户名或密码错误');
      }
    } catch (error) {
      message.error(error.message || '登录失败，请重试');
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={3} style={{ color: '#1890ff', marginBottom: '8px' }}>
          欢迎回来
        </Title>
        <Text type="secondary">
          请输入您的账号信息
        </Text>
      </div>

      <Form
        form={form}
        name="login"
        onFinish={handleSubmit}
        autoComplete="off"
        size="large"
        layout="vertical"
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            { required: true, message: '请输入用户名!' },
            { min: 3, message: '用户名至少3个字符!' }
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="请输入用户名"
            style={{ borderRadius: '8px' }}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[
            { required: true, message: '请输入密码!' },
            { min: 6, message: '密码至少6个字符!' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入密码"
            style={{ borderRadius: '8px' }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: '16px' }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            {loading ? '登录中...' : '登录'}
          </Button>
        </Form.Item>
      </Form>

      <Divider style={{ margin: '16px 0' }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          测试账号
        </Text>
      </Divider>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Space direction="vertical" size="small">
          <Text type="secondary" style={{ fontSize: '14px' }}>
            管理员：admin / admin123
          </Text>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            普通用户：user / user123
          </Text>
        </Space>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: '14px' }}>
          还没有账号？{' '}
          <Link onClick={onSwitchToRegister} style={{ fontWeight: '500' }}>
            立即注册
          </Link>
        </Text>
      </div>
    </div>
  );
};

export default LoginCard;
