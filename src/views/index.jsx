import { Button } from 'antd';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { removeToken } from '@/utils/token';

const Index = () => {
  const { setUser } = useAuth();

  const handleLogout = () => {
    setUser(null);
    removeToken();
  };

  return (
    <>
      <Button type="primary" onClick={handleLogout}>
        logout
      </Button>
      <Button
        type="primary"
        onClick={() => {
          React.navigate('/login');
        }}
      >
        Login
      </Button>
      <Button
        type="primary"
        onClick={() => {
          React.navigate('/about');
        }}
      >
        About
      </Button>
    </>
  );
};

export default Index;
