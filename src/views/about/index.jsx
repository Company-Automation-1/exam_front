import React from 'react';
import { Result } from 'antd';

const About = () => {
  return (
    <>
      <div
        style={{
          height: 'calc(100vh - 60px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Result status="404" title="关于我们" subTitle="待开发页面，敬请期待" />
      </div>
    </>
  );
};

export default About;
