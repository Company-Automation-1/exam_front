import React from 'react';

const Index: React.FC = () => {
  return (
    <>
      <h1>Index</h1>
      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
        <Link to="/page1">Page1</Link>
        <Link to="/page2">Page2</Link>
        <Link to="/page3">Page3</Link>
        <Link to="/page4">Page4</Link>
        <Link to="/page5">Page5(跳转403)</Link>
      </div>
    </>
  );
};

export default Index;
