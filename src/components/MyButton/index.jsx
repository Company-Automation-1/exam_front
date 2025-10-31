import React, { useRef, useState } from 'react';
import { Button } from 'antd';
import './index.scss';

const MyButton = ({ children, className = '', ...props }) => {
  const buttonRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e) => {
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;
    setMousePosition({ x, y });
  };

  const handleMouseMove = (e) => {
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = (e) => {
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <Button
      ref={buttonRef}
      className={`position-aware-btn ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
      <span
        className="position-aware-bg"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      />
    </Button>
  );
};

export default MyButton;
