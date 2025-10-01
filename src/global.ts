// 引入相应的文件
import React from 'react';
// 引入路由
import * as Router from 'react-router-dom';
// 引入Request
import { Request } from '@/services/request';

// 注入鉴权能力的 Request 实例
const Http = new Request(
  {},
  {
    // 获取访问令牌
    getAccessToken: () => {
      return localStorage.getItem('auth_token');
    },

    // 设置新的令牌
    setTokens: (tokens) => {
      localStorage.setItem('auth_token', tokens.accessToken);
      if (tokens.refreshToken) {
        localStorage.setItem('refresh_token', tokens.refreshToken);
      }
    },

    // 获取刷新令牌
    getRefreshToken: () => {
      return localStorage.getItem('refresh_token');
    },

    // 刷新令牌逻辑
    refreshToken: async (refreshToken) => {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // 这里调用刷新token的API
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      return {
        accessToken: data.result.accessToken,
        refreshToken: data.result.refreshToken,
      };
    },
  }
);

// 在React命名空间定义相应属性
React.Router = Router;
React.Http = Http;

// 不需要登录的路由地址
// 支持精确路径：'/login'，支持前缀：'/public/*'
React.RouterRules = ['/login', '/404', '/'];

export default {};
