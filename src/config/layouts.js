/**
 * 布局配置
 * 定义不同路径对应的布局组件
 */
export const layoutConfig = {
  // AppLayout 布局路径
  appLayout: {
    paths: ['/', '/login', '/dev/*'],
    component: 'AppLayout', // 组件名称
  },

  // // MyTabBar 布局路径
  // myTabBar: {
  //   paths: ['/home', '/about', '/profile'],
  //   component: 'MyTabBar', // 组件名称
  // },
};

/**
 * 布局优先级配置
 *
 * 渲染规则：
 * - 数字越小，优先级越高
 * - 优先级高的组件先渲染，成为内层容器
 * - 优先级低的组件后渲染，成为外层容器
 *
 * 渲染顺序：
 * 1. appLayout (优先级高) → 先渲染 → 内层容器
 * 2. myTabBar (优先级低) → 后渲染 → 外层容器
 *
 * 最终DOM结构：
 * ```html
 * <!-- 外层：myTabBar（优先级低，后渲染） -->
 * <MyTabBar>
 *   <!-- 内层：appLayout（优先级高，先渲染） -->
 *   <AppLayout>
 *     {children}
 *     <MyFooter /> <!-- AppLayout的fixed元素 -->
 *   </AppLayout>
 *   <!-- MyTabBar的fixed元素 -->
 *   <div style="position: fixed; ..."></div>
 * </MyTabBar>
 * ```
 */
export const layoutPriority = {
  appLayout: 2, // 优先级高(内层)
  // myTabBar: 1, // 优先级低(外层)
};
