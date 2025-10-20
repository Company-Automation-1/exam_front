// 引入相应的文件
import React from 'react';
// 引入路由
import * as Router from 'react-router-dom';
// 引入Request
import { http } from '@/utils/request';

// 将React、Router、http挂载到全局
React.Router = Router;
React.http = http;

// 路由守卫白名单配置
React.RouterRules = [
  '/',
  '/login',
  '/404',
  // 开发环境特殊路由
  ...(import.meta.env.DEV
    ? [
        '/dev/*', // 开发工具页面
      ]
    : []),
];

export default {};
