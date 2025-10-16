import React from 'react';
import { redirect } from 'react-router-dom';
import { getToken } from '@/utils/token';

// 白名单检查（复用现有逻辑）
const isPublicRoute = (pathname) => {
  const rules = React.RouterRules || [];
  return rules.some(rule => {
    if (!rule) return false;
    // 前缀匹配：/public/*
    if (rule.endsWith('*')) {
      const prefix = rule.slice(0, -1);
      return pathname.startsWith(prefix);
    }
    return pathname === rule;
  });
};

// 前置守卫
export const authGuard = async ({ request }) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const isAuthenticated = !!getToken();
  
  // 已登录访问登录页 → 重定向到首页
  if (isAuthenticated && pathname === '/login') {
    const lastVisited = sessionStorage.getItem('lastVisitedPage') || '/';
    return redirect(lastVisited);
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
  return routes.map(route => ({
    ...route,
    loader: authGuard // 为每个路由添加前置守卫
  }));
};
