import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  InfoCircleOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { Avatar, Segmented } from 'antd';

const bottomStyle = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
};

const MyTabBar = ({ children }) => {
  const location = useLocation();

  // 根据当前路径确定激活的选项（使用useMemo缓存）
  const activeValue = useMemo(() => {
    const path = location.pathname;
    console.log('🔍 MyTabBar getActiveValue - path:', path);
    console.log('🔍 MyTabBar getActiveValue - location:', location);

    if (path === '/' || path === '/home') {
      console.log('🔍 返回 home');
      return 'home';
    }
    if (path === '/about') {
      console.log('🔍 返回 about');
      return 'about';
    }
    if (path === '/test') {
      console.log('🔍 返回 test');
      return 'test';
    }
    console.log('🔍 默认返回 home');
    return 'home';
  }, [location.pathname]);

  // 处理选项切换
  const handleChange = (value) => {
    switch (value) {
      case 'home':
        React.navigate('/home');
        break;
      case 'about':
        React.navigate('/about');
        break;
      case 'test':
        React.navigate('/test');
        break;
      default:
        React.navigate('/home');
    }
  };

  // 配置选项
  const options = [
    {
      label: (
        <div style={{ padding: 4 }}>
          <Avatar icon={<HomeOutlined />} />
          <div>首页</div>
        </div>
      ),
      value: 'home',
    },
    {
      label: (
        <div style={{ padding: 4 }}>
          <Avatar icon={<InfoCircleOutlined />} />
          <div>关于</div>
        </div>
      ),
      value: 'about',
    },
    {
      label: (
        <div style={{ padding: 4 }}>
          <Avatar icon={<ExperimentOutlined />} />
          <div>测试</div>
        </div>
      ),
      value: 'test',
    },
  ];

  return (
    <>
      {children}
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
