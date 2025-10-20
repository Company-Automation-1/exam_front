import { memo } from 'react';

const Footer = memo(() => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          textAlign: 'center',
          paddingTop: '24px',
          paddingBottom: '5px',
          color: '#666',
          fontSize: '14px',
        }}
      >
        Made with ❤ by
      </div>
      <div
        style={{
          textAlign: 'center',
          paddingBottom: '24px',
          color: '#666',
          fontSize: '14px',
        }}
      >
        ©2025
      </div>
    </div>
  );
});

export default Footer;
