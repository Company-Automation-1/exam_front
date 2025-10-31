import React, { useEffect, useRef } from 'react';

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

// 导入布局渲染器
import LayoutRenderer from '@/components/LayoutRenderer';

// 导入认证相关
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/auth';
import { getToken, removeToken } from '@/utils/token';

import Loading from '@/components/Loading';

const RootLayout = () => {
  // 使用 useNavigate 钩子获取导航函数，并在副作用中赋值给 React.navigate
  const navigate = useNavigate();
  const { setUser, setIsLoading } = useAuth();

  const { user } = useAuth();

  console.log(' 😶‍🌫️ user', user);

  useEffect(() => {
    React.navigate = navigate;
  }, [navigate]);

  // 初始化认证状态
  useEffect(() => {
    const initAuth = async () => {
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

    return () => {
      setIsLoading(false);
    };
  }, []); // 添加依赖项

  return (
    <LayoutRenderer>
      {/* 使用 React.Suspense 包裹路由组件，实现懒加载 */}
      <React.Suspense
        fallback={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              width: '100%',
            }}
          >
            <Loading />
          </div>
        }
      >
        {/* Outlet: 渲染当前路由的子路由组件 */}
        <Outlet />
      </React.Suspense>
    </LayoutRenderer>
  );
};

// HydrateFallback 组件：用于 React Router v7 的初始水合过程
// 在服务端渲染或部分水合场景中，当数据还未加载完成时显示
// 对于纯客户端应用，使用空组件避免不必要的视觉闪烁
const HydrateFallback = () => {
  console.log('HydrateFallback');

  return <></>;
};

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
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
