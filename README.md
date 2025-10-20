# README

### App.jsx 层级结构
```jsx
// App.jsx 的完整结构
<AuthProvider>           // 第1层：认证上下文
  <RouterProvider>       // 第2层：路由系统
    <RootLayout>         // 第3层：根布局
      <LayoutRenderer>   // 第4层：布局渲染器（配置驱动）
        <React.Suspense> // 第5层：懒加载
          <Outlet />     // 第6层：页面渲染
        </React.Suspense>
      </LayoutRenderer>
    </RootLayout>
  </RouterProvider>
</AuthProvider>
```

### 路由守卫集成
```jsx
// 路由守卫通过 enhanceRoutesWithGuards 集成到路由配置中
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    HydrateFallback: HydrateFallback, // 水合阶段显示
    children: [
      ...enhanceRoutesWithGuards(routes), // 路由守卫集成
      { path: '*', element: <NotFoundPage /> }
    ]
  }
]);
```

### 权限控制
```jsx
// 基于后端 access 字段的权限控制
const { isAdmin, isUser, hasAccess } = usePermission();

// 使用示例
{isAdmin() && <AdminPanel />}
{hasAccess('admin') && <AdminButton />}
```

### 水合阶段
```jsx
// HydrateFallback 组件：用于 React Router v7 的初始水合过程
const HydrateFallback = () => {
  console.log('HydrateFallback');
  return <></>;
};

// 在首次访问和刷新时触发水合阶段
// 执行顺序：路由守卫 → HydrateFallback → 页面渲染
```

### 布局系统
```jsx
// 配置驱动的布局系统
export const layoutConfig = {
  app: {
    paths: ['/admin', '/settings'],
    component: 'AppLayout',
  },
  tabBar: {
    paths: ['/home', '/about'],
    component: 'MyTabBar',
  },
};

// 布局优先级配置
export const layoutPriority = {
  app: 2,      // 优先级低
  tabBar: 1,   // 优先级高
};
```

### 关键特性
- **路由守卫**：通过 `enhanceRoutesWithGuards` 集成到路由配置中
- **配置驱动布局**：`LayoutRenderer` 根据配置文件动态渲染布局
- **布局优先级**：支持多个布局嵌套，优先级控制渲染顺序
- **懒加载**：`React.Suspense` 实现组件懒加载
- **权限管理**：基于后端 `access` 字段的细粒度权限控制
- **水合优化**：`HydrateFallback` 避免水合阶段的视觉闪烁