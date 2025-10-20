/**
 * 路由匹配工具函数
 * @param {string} pathname - 当前路径
 * @param {string[]} paths - 配置的路径数组
 * @returns {boolean} 是否匹配
 */
export const matchPath = (pathname, paths) => {
  return paths.some((path) => {
    if (path.endsWith('*')) {
      // 通配符匹配：/admin/* 匹配 /admin/xxx
      const prefix = path.slice(0, -1);
      return pathname.startsWith(prefix);
    }
    // 精确匹配
    return pathname === path;
  });
};

/**
 * 获取匹配的布局类型
 * @param {string} pathname - 当前路径
 * @param {object} layoutConfig - 布局配置
 * @returns {string[]} 匹配的布局类型数组
 */
export const getMatchedLayouts = (pathname, layoutConfig) => {
  const matchedLayouts = [];

  Object.entries(layoutConfig).forEach(([layoutType, config]) => {
    if (matchPath(pathname, config.paths)) {
      matchedLayouts.push(layoutType);
    }
  });

  return matchedLayouts;
};

/**
 * 根据优先级排序布局
 * @param {string[]} layouts - 布局类型数组
 * @param {object} priority - 优先级配置
 * @returns {string[]} 排序后的布局类型数组
 */
export const sortLayoutsByPriority = (layouts, priority) => {
  return layouts.sort((a, b) => priority[a] - priority[b]);
};
