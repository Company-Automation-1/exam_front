import React from 'react';
import { Card, Avatar, Button, Typography, Tag } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';

const { Title, Text } = Typography;

const UserInfo: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    React.navigate('/login');
  };

  return (
    <Card style={{ margin: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Avatar size={64} icon={<UserOutlined />} />
        <div style={{ flex: 1 }}>
          <Title level={4} style={{ margin: 0 }}>
            {user.name}
          </Title>
          <Text type="secondary">{user.email}</Text>
          <div style={{ marginTop: '8px' }}>
            <Tag color={user.role === 'admin' ? 'red' : 'blue'}>
              {user.role === 'admin' ? '管理员' : '普通用户'}
            </Tag>
          </div>
        </div>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          退出登录
        </Button>
      </div>
    </Card>
  );
};

export { UserInfo };
