# README

### App.jsx
```jsx
// App.jsx 的完整结构
<AuthProvider>           // 第1层：认证上下文
  <RouterProvider>       // 第2层：路由系统
    <RootLayout>         // 第3层：根布局
      <useRouteGuard />  // 第4层：路由守卫
      <React.Suspense>  // 第5层：懒加载
        <Outlet />       // 第6层：页面渲染
      </React.Suspense>
    </RootLayout>
  </RouterProvider>
</AuthProvider>
```