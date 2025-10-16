import React, { useEffect, useRef } from 'react';
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

// 导入路由守卫
import { enhanceRoutesWithGuards } from '@/utils/route-guards';

// 导入 404 页面组件
import NotFoundPage from '@/views/404';

// 导入认证提供者
import { AuthProvider } from '@/context/auth-context';

// 导入布局提供者
import { LayoutProvider } from '@/context/layout-context/LayoutContext';

// 导入布局组件
import AppLayout from '@/components/AppLayout/AppLayout';

// 导入认证相关
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/auth';
import { getToken, removeToken } from '@/utils/token';

const RootLayout = () => {
  // 使用 useNavigate 钩子获取导航函数，并在副作用中赋值给 React.navigate
  const navigate = useNavigate();
  const { setUser, setIsLoading } = useAuth();

  useEffect(() => {
    React.navigate = navigate;
  }, [navigate]);

  // 使用 useRef 防止重复初始化
  const isInitiated = useRef(false);
  
  // 初始化认证状态
  useEffect(() => {
    const initAuth = async () => {
      if (isInitiated.current) return; // 如果已经初始化过，直接返回
      isInitiated.current = true; // 设置为已初始化

      const token = getToken();
      if (token) {
        try {
          console.log('🔍 正在验证token...');
          const response = await authApi.getProfile();
          if (response.success) {
            console.log('✅ Token验证成功');
            setUser(response.data);
          } else {
            console.log('❌ Token验证失败，清除token');
            removeToken();
          }
        } catch (error) {
          console.log('❌ Token验证出错，清除token:', error);
          removeToken();
        }
      }
      setIsLoading(false);
    };

    initAuth();
    
    // 返回清理函数（StrictMode 需要）
    return () => {
      // 重置加载状态，避免状态不一致
      setIsLoading(false);
    };
  }, []); // 添加依赖项

  return (
    <AppLayout>
      {/* 使用 React.Suspense 包裹路由组件，实现懒加载 */}
      <React.Suspense
        fallback={
          <div style={{ padding: '20px', textAlign: 'center' }}>加载中...</div>
        }
      >
        {/* Outlet: 渲染当前路由的子路由组件 */}
        <Outlet />
      </React.Suspense>
    </AppLayout>
  );
};

// HydrateFallback 组件：用于 React Router v7 的初始水合过程
// 在服务端渲染或部分水合场景中，当数据还未加载完成时显示
// 对于纯客户端应用，使用空组件避免不必要的视觉闪烁
const HydrateFallback = () => <></>;

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      // HydrateFallback: 解决 React Router v7 的 "No HydrateFallback element provided" 警告
      // 在初始水合期间显示，直到路由数据加载完成
      HydrateFallback: HydrateFallback,
      children: [
        // 自动生成的路由（来自 src/views）+ 前置守卫
        ...enhanceRoutesWithGuards(routes),
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
      <LayoutProvider>
        <RouterProvider router={router} />
      </LayoutProvider>
    </AuthProvider>
  );
};

export default App;
