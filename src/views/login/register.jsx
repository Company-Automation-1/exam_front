import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { authApi } from '@/api/auth';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Link } = Typography;

const RegisterCard = ({ onSwitchToLogin }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      // 调用注册API
      const response = await authApi.register({
        username: values.username,
        password: values.password,
        email: values.email,
        phone: values.phone,
        name: values.name
      });

      if (response.success) {
        message.success('注册成功！请登录');
        onSwitchToLogin();
      } else {
        message.error(response.message || '注册失败');
      }
    } catch (error) {
      message.error('注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={3} style={{ color: '#1890ff', marginBottom: '8px' }}>
          创建账号
        </Title>
        <Text type="secondary">
          请填写您的注册信息
        </Text>
      </div>

      <Form
        form={form}
        name="register"
        onFinish={handleSubmit}
        autoComplete="off"
        size="large"
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="姓名"
          rules={[
            { required: true, message: '请输入姓名!' },
            { min: 2, message: '姓名至少2个字符!' }
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="请输入真实姓名"
            style={{ borderRadius: '8px' }}
          />
        </Form.Item>

        <Form.Item
          name="username"
          label="用户名"
          rules={[
            { required: true, message: '请输入用户名!' },
            { min: 3, message: '用户名至少3个字符!' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线!' }
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="请输入用户名"
            style={{ borderRadius: '8px' }}
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱!' },
            { type: 'email', message: '请输入有效的邮箱地址!' }
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="请输入邮箱地址"
            style={{ borderRadius: '8px' }}
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="手机号"
          rules={[
            { required: true, message: '请输入手机号!' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号!' }
          ]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="请输入手机号"
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

        <Form.Item
          name="confirmPassword"
          label="确认密码"
          dependencies={['password']}
          rules={[
            { required: true, message: '请确认密码!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请再次输入密码"
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
            {loading ? '注册中...' : '注册'}
          </Button>
        </Form.Item>
      </Form>

      <Divider style={{ margin: '16px 0' }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          注册须知
        </Text>
      </Divider>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Text type="secondary" style={{ fontSize: '12px', lineHeight: '1.5' }}>
          注册即表示您同意我们的服务条款和隐私政策
        </Text>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: '14px' }}>
          已有账号？{' '}
          <Link onClick={onSwitchToLogin} style={{ fontWeight: '500' }}>
            立即登录
          </Link>
        </Text>
      </div>
    </div>
  );
};

export default RegisterCard;
