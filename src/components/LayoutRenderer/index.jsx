import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { layoutConfig, layoutPriority } from '@/config/layouts';
import {
  getMatchedLayouts,
  sortLayoutsByPriority,
} from '@/utils/layoutMatcher';
import AppLayout from '@/components/AppLayout/AppLayout';
import MyTabBar from '@/components/MyTabBar';

// 布局组件映射（静态导入）
const layoutComponents = {
  AppLayout,
  MyTabBar,
};

const LayoutRenderer = ({ children }) => {
  const location = useLocation();

  // 获取匹配的布局类型
  const matchedLayouts = useMemo(() => {
    const layouts = getMatchedLayouts(location.pathname, layoutConfig);
    return sortLayoutsByPriority(layouts, layoutPriority);
  }, [location.pathname]);

  // 应用布局（从内到外）
  let content = children;
  matchedLayouts.forEach((layoutType) => {
    const config = layoutConfig[layoutType];
    const LayoutComponent = layoutComponents[config.component];

    if (LayoutComponent) {
      content = <LayoutComponent>{content}</LayoutComponent>;
    }
  });

  return content;
};

export default LayoutRenderer;
