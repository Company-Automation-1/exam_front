import React from 'react';

const Page2: React.FC = () => {
  return (
    <>
      {/* 背景层，不影响内容 */}
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#000',
          pointerEvents: 'none',
          zIndex: -1,
          position: 'fixed', // 关键：zIndex 需配合非 static 的 position
          left: 0,
          top: 0,
        }}
      />
      <h1>Page2</h1>
      <Link to="/">Home</Link>
    </>
  );
};

export default Page2;
