import React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// 记录来源页键
const LAST_VISITED_KEY = 'lastVisitedPage';

// 白名单：从全局 React.RouterRules 读取（在 global.js 中定义）
const getPublicRoutes = () => {
  const rules = React.RouterRules;
  return Array.isArray(rules) ? rules : [];
};

// 判断是否命中白名单（支持前缀）
const isPublic = (path, rules) => {
  return rules.some((rule) => {
    if (!rule) return false;
    // 前缀匹配：/public/*
    if (rule.endsWith('*')) {
      const prefix = rule.slice(0, -1);
      return path.startsWith(prefix);
    }
    return path === rule;
  });
};

// 全局路由守卫 Hook：不侵入路由配置，配合自动路由生效
export const useRouteGuard = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // 等待认证状态完成初始化，避免闪烁
    if (isLoading) return;

    const path = location.pathname;
    const publicRules = getPublicRoutes();

    // 已登录：禁止访问登录页
    if (isAuthenticated && path === '/login') {
      const last = sessionStorage.getItem(LAST_VISITED_KEY) || '/';
      if (last !== path) {
        React.navigate(last);
      }
      return;
    }

    // 未登录：保护非白名单路由
    if (!isAuthenticated && !isPublic(path, publicRules)) {
      // 记录欲访问页面，登录完成后可回跳
      sessionStorage.setItem(LAST_VISITED_KEY, path);
      if (path !== '/login') {
        React.navigate('/login');
      }
      return;
    }

    // 登录后的正常页面访问，更新最近页面
    if (isAuthenticated && path !== '/login') {
      sessionStorage.setItem(LAST_VISITED_KEY, path);
    }
  }, [location.pathname, isAuthenticated, isLoading]);
};
