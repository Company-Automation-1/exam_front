import React from 'react';
import { Button } from 'antd';
import MyTabBar from '@/components/MyTabBar';

const Test = () => {
  return (
    <>
      <div style={{ padding: '20px', minHeight: 'calc(100vh - 60px)' }}>
        <h1>Test 页面</h1>
        <p>这是测试页面</p>
        <Button
          type="primary"
          onClick={() => {
            React.navigate('/home');
          }}
        >
          返回首页
        </Button>
        <Button
          type="default"
          onClick={() => {
            React.navigate('/about');
          }}
        >
          去关于页面
        </Button>
      </div>
      <MyTabBar />
    </>
  );
};

export default Test;
