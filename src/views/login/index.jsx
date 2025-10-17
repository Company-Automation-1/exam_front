import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Form, Input, message, Tabs } from 'antd';
import React, { useState } from 'react';
import { authApi } from '@/api/auth';
import { useAuth } from '@/hooks/useAuth';
import { setToken } from '@/utils/token';
import aLogo from '@/assets/react.svg';

// Footer组件
const Footer = () => {
  return (
    <>
      <div
        style={{
          textAlign: 'center',
          paddingTop: '24px',
          paddingBottom: '5px',
          color: '#666',
          fontSize: '14px',
        }}
      >
        Made with ❤ by
      </div>
      <div
        style={{
          textAlign: 'center',
          paddingBottom: '24px',
          color: '#666',
          fontSize: '14px',
        }}
      >
        ©2025
      </div>
    </>
  );
};

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

// 错误消息组件
const LoginMessage = ({ content }) => {
  return (
    <Alert
      style={{ marginBottom: 24 }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState('account');
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError('');

      if (loginType === 'account') {
        // 登录逻辑
        const response = await authApi.login({
          username: values.username,
          password: values.password,
          type: 'account',
        });

        if (response.success) {
          const { token, currentAuthority } = response.data;
          setUser({
            username: values.username,
            access: currentAuthority,
          });
          setToken(token);
          message.success('登录成功！');
          React.navigate('/about', { replace: true });
        } else {
          setError(response.error?.message || '用户名或密码错误');
        }
      } else {
        // 注册逻辑
        const response = await authApi.register({
          username: values.username,
          password: values.password,
          email: values.email,
          phone: values.phone,
        });

        if (response.success) {
          message.success('注册成功！请登录');
          setLoginType('account');
          form.resetFields();
        } else {
          setError(response.message || '注册失败');
        }
      }
    } catch (error) {
      console.error('操作错误:', error);
      setError(error.message || '操作失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  // 设置页面标题
  React.useEffect(() => {
    document.title = '登录';
  }, []);

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <div style={loginFormStyle}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}
          >
            <img
              alt="logo"
              src={aLogo}
              style={{ height: 40, marginRight: 12 }}
            />
            <h2 style={{ margin: 0 }}>Test</h2>
          </div>

          <Tabs
            activeKey={loginType}
            onChange={setLoginType}
            centered
            items={[
              {
                key: 'account',
                label: '登录',
              },
              {
                key: 'mobile',
                label: '注册',
              },
            ]}
          />

          {error && <LoginMessage content={error} />}

          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            autoComplete="off"
            size="large"
            initialValues={{ autoLogin: true }}
          >
            {loginType === 'account' && (
              <>
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: '请输入用户名!' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="用户名: admin or user"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '请输入密码!' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="密码: ant.design"
                    size="large"
                  />
                </Form.Item>
              </>
            )}

            {loginType === 'mobile' && (
              <>
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: '请输入用户名!' },
                    { min: 3, message: '用户名至少3个字符!' },
                    { max: 20, message: '用户名最多20个字符!' },
                    {
                      pattern: /^[a-zA-Z0-9_]+$/,
                      message: '用户名只能包含字母、数字和下划线!',
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="请输入用户名"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: '请输入密码!' },
                    { min: 6, message: '密码至少6个字符!' },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请输入密码"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: '请确认密码!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error('两次输入的密码不一致!')
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请再次输入密码"
                    size="large"
                  />
                </Form.Item>
              </>
            )}

            <div style={{ marginBottom: 24 }}>
              <Form.Item name="autoLogin" valuePropName="checked" noStyle>
                <Checkbox>自动登录</Checkbox>
              </Form.Item>
              <a style={{ float: 'right' }}>忘记密码</a>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ width: '100%' }}
                size="large"
              >
                {loginType === 'account' ? '登录' : '注册'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
