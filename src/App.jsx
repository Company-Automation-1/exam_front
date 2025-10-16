import React, { useEffect } from 'react';
// import './App.css';

// 引入 react-router-dom 中的路由相关 API
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  Outlet,
} from 'react-router-dom';

// 获取所有的页面路由
// ~react-pages 是一个约定俗成的路径，通常表示自动生成的路由配置文件
import routes from '~react-pages';

// 导入 404 页面组件
import NotFoundPage from '@/views/404';

// 导入认证提供者
import { AuthProvider } from '@/context/auth-context';

// 全局路由守卫
import { useRouteGuard } from '@/hooks/useRouteGuard';

const RootLayout = () => {
  // 使用 useNavigate 钩子获取导航函数，并在副作用中赋值给 React.navigate
  const navigate = useNavigate();

  useEffect(() => {
    React.navigate = navigate;
  }, [navigate]);

  // 启用全局路由守卫（不侵入自动路由）
  useRouteGuard();

  return (
    <>
      {/* 使用 React.Suspense 包裹路由组件，实现懒加载 */}
      <React.Suspense
        fallback={
          <div style={{ padding: '20px', textAlign: 'center' }}>加载中...</div>
        }
      >
        {/* 使用 Outlet 渲染子路由 */}
        <Outlet />
      </React.Suspense>
    </>
  );
};

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        // 自动生成的路由（来自 src/views）
        ...routes,
        // 404 页面 - 捕获所有未匹配的路由
        {
          path: '*',
          element: <NotFoundPage />,
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
