import React from 'react';
import { Button } from 'antd';

const About = () => {
  return (
    <>
      <div style={{ padding: '20px', minHeight: 'calc(100vh - 60px)' }}>
        <h1>About 页面</h1>
        <p>这是关于我们页面</p>
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
            React.navigate('/exam');
          }}
        >
          去试卷页面
        </Button>
      </div>
    </>
  );
};

export default About;
