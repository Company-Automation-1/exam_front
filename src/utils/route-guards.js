import React from 'react';
import { redirect } from 'react-router-dom';
import { getToken } from '@/utils/token';
import { message } from 'antd';

// 白名单检查
const isPublicRoute = (pathname) => {
  const rules = React.RouterRules || [];
  console.log('🔍 白名单规则:', rules);
  console.log('🔍 当前路径:', pathname);

  const result = rules.some((rule) => {
    if (!rule) return false;
    // 前缀匹配：/public/*
    if (rule.endsWith('*')) {
      const prefix = rule.slice(0, -1);
      const matches = pathname.startsWith(prefix);
      console.log(
        `🔍 通配符匹配: ${rule} -> ${prefix} -> ${pathname} -> ${matches}`
      );
      return matches;
    }
    const exactMatch = pathname === rule;
    console.log(`🔍 精确匹配: ${rule} -> ${pathname} -> ${exactMatch}`);
    return exactMatch;
  });

  console.log('🔍 最终结果:', result);
  return result;
};

// 前置守卫
export const authGuard = async ({ request }) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const isAuthenticated = !!getToken();

  // 已登录访问登录页 → 重定向到首页
  if (isAuthenticated && pathname === '/login') {
    message.success({
      content: '您已登录，请勿重复登录',
      key: 'login-redirect', // 使用唯一key，确保只有一条消息
    });
    return redirect('/');
  }

  // 未登录访问受保护路由 → 重定向到登录页
  if (!isAuthenticated && !isPublicRoute(pathname)) {
    sessionStorage.setItem('lastVisitedPage', pathname);
    return redirect('/login');
  }

  return null; // 允许访问
};

// 路由增强函数：为每个路由添加前置守卫
export const enhanceRoutesWithGuards = (routes) => {
  return routes.map((route) => ({
    ...route,
    loader: authGuard, // 为每个路由添加前置守卫
  }));
};
