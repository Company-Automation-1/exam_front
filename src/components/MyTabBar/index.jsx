import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HomeTwoTone, UserOutlined, SnippetsTwoTone } from '@ant-design/icons';
import { Avatar, Segmented } from 'antd';

const bottomStyle = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
};

// 统一的路由配置 - 一个对象管理所有路由逻辑
const ROUTE_CONFIG = {
  '/home': 'home',
  '/about': 'about',
  '/exam': 'exam',
};

const MyTabBar = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // 优化：简化逻辑，移除调试日志，提高性能
  const activeValue = useMemo(() => {
    return ROUTE_CONFIG[location.pathname] || 'home';
  }, [location.pathname]);

  // 优化：使用反向查找，一个配置对象解决所有问题
  const handleChange = (value) => {
    // 通过反向查找找到对应的路径
    const route =
      Object.keys(ROUTE_CONFIG).find((path) => ROUTE_CONFIG[path] === value) ||
      '/home';
    navigate(route);
  };

  // 配置选项
  const options = [
    {
      label: (
        <div style={{ padding: 4 }}>
          <Avatar
            style={{ background: 'transparent' }}
            icon={<HomeTwoTone />}
          />
          <div>首页</div>
        </div>
      ),
      value: 'home',
    },
    {
      label: (
        <div style={{ padding: 4 }}>
          <Avatar
            style={{ background: 'transparent' }}
            icon={<SnippetsTwoTone />}
          />
          <div>试卷</div>
        </div>
      ),
      value: 'exam',
    },
    {
      label: (
        <div style={{ padding: 4 }}>
          <Avatar
            style={{ background: 'transparent' }}
            icon={<UserOutlined style={{ color: '#4096ff' }} />}
          />
          <div>关于</div>
        </div>
      ),
      value: 'about',
    },
  ];

  return (
    <>
      {children}
      <div style={{ height: '60px' }}></div>
      <div style={bottomStyle}>
        <Segmented
          block={true}
          options={options}
          value={activeValue}
          onChange={handleChange}
        />
      </div>
    </>
  );
};

export default MyTabBar;
