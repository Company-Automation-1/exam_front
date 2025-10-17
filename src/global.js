// 引入相应的文件
import React from 'react';
// 引入路由
import * as Router from 'react-router-dom';
// 引入Request
import { http } from '@/utils/request';

import { isDev } from '@/config/env';

// 将React、Router、http挂载到全局
React.Router = Router;
React.http = http;

// 路由守卫白名单配置
React.RouterRules = [
  '/',
  '/login',
  '/404',
  // 开发环境特殊路由
  ...(isDev()
    ? [
        '/dev/*', // 开发工具页面
      ]
    : []),
];

// 不需要布局的页面路径配置
// 支持精确匹配和通配符匹配
React.NoLayoutPaths = [
  '/',
  '/login',
  '/register',
  '/404',
  ...(isDev()
    ? [
        '/dev/*', // 通配符匹配：所有 /dev/ 开头的页面
      ]
    : []),
];

export default {};
