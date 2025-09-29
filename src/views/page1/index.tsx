import React from 'react';
import { FloatButton } from 'antd';

const Page1: React.FC = () => {
  const items = useMemo(() => Array.from({ length: 200 }, (_, i) => i + 1), []);

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ marginTop: 0 }}>Page1 列表</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((n) => (
          <div
            key={n}
            style={{
              height: 80,
              border: '1px solid #f0f0f0',
              borderRadius: 8,
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
            }}
          >
            列表项 {n}
          </div>
        ))}
      </div>
      <FloatButton.BackTop visibilityHeight={400} />
    </div>
  );
};

export default Page1;
