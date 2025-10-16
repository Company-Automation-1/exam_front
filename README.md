# README

### App.jsx 层级结构
```jsx
// App.jsx 的完整结构
<AuthProvider>           // 第1层：认证上下文
  <RouterProvider>       // 第2层：路由系统
    <RootLayout>         // 第3层：根布局
      <AppLayout>        // 第4层：布局组件（根据路由路径控制）
        <useRouteGuard /> // 第5层：路由守卫
        <React.Suspense> // 第6层：懒加载
          <Outlet />      // 第7层：页面渲染
        </React.Suspense>
      </AppLayout>
    </RootLayout>
  </RouterProvider>
</AuthProvider>
```

### 权限控制
```jsx
// 基于后端 access 字段的权限控制
const { isAdmin, isUser, hasAccess } = usePermission();

// 使用示例
{isAdmin() && <AdminPanel />}
{hasAccess('admin') && <AdminButton />}
```