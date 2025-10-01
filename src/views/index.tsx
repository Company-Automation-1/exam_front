import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserInfo } from './components/UserInfo';
import { Button, Space, Typography, Card } from 'antd';

const { Title, Text } = Typography;

const Index: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // 等待认证状态完成，避免首屏闪烁
  if (isLoading) {
    return null; // 或者返回一个轻量骨架屏
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={1}>首页</Title>

      {isAuthenticated ? (
        <>
          <UserInfo />
          <Card title="功能导航" style={{ marginTop: '20px' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Link to="/exam-paper">
                <Button type="primary" size="large" block>
                  开始考试
                </Button>
              </Link>
              <Link to="/page1">
                <Button size="large" block>
                  页面1
                </Button>
              </Link>
              <Link to="/page2">
                <Button size="large" block>
                  页面2
                </Button>
              </Link>
              <Link to="/page3">
                <Button size="large" block>
                  页面3
                </Button>
              </Link>
            </Space>
          </Card>
        </>
      ) : (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Title level={3}>请先登录</Title>
            <Text type="secondary">登录后即可使用系统功能</Text>
            <div style={{ marginTop: '20px' }}>
              <Link to="/login">
                <Button type="primary" size="large">
                  立即登录
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Index;
