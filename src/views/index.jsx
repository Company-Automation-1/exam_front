import { Divider, theme, Button } from 'antd';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/LoginForm';
import '@/styles/index.css';
import Loading from '@/components/Loading';
import { Player } from '@lottiefiles/react-lottie-player';
import loadingAnimation from '@/assets/page-index.json';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import ScrambleText from '@/components/ScrambleText';

// 注册插件
gsap.registerPlugin(MotionPathPlugin);

const Index = () => {
  const { user, isLoading } = useAuth();
  const { token } = theme.useToken();

  // 导航到首页的通用函数
  const navigateToHome = () => React.navigate('/home');

  // 导航到登录页的通用函数
  const navigateToLogin = () => React.navigate('/login');

  // 如果正在加载认证状态，显示加载中
  if (isLoading) {
    return (
      <div className="index-container">
        <div className="logo-container">
          <Player
            className="logo-image"
            src={loadingAnimation}
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className="content-container">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="index-container">
        {/* Logo 区域 */}
        <div className="logo-container">
          <Player
            className="logo-image"
            src={loadingAnimation}
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* 登录区域 */}
        <div className="content-container">
          <div className="tablet-content">
            {user ? (
              // 已登录 + 平板端
              <div className="home-icon-container">
                {/* 登录成功提示 */}
                <ScrambleText
                  segments={[
                    {
                      text: `欢迎回来，${user?.name || '用户'}！`,
                      chars: 'lowerCase',
                      duration: 2,
                    },
                    {
                      text: '点击下方按钮进入首页',
                      chars: 'upperCase',
                      speed: 0.3,
                      duration: 1.5,
                    },
                  ]}
                  showCursor={false}
                  className="primary"
                  onComplete={() => console.log('登录提示动画完成！')}
                />
                <Button
                  type="primary"
                  size="large"
                  onClick={navigateToHome}
                  style={{ marginTop: '20px' }}
                >
                  进入首页
                </Button>
              </div>
            ) : (
              // 未登录 + 平板端：显示登录表单
              <LoginForm
                showLogo={true}
                showTitle={false}
                style={{
                  minWidth: '350px',
                  maxWidth: '400px',
                }}
              />
            )}
          </div>

          <div className="mobile-content">
            <Divider plain>
              {user ? (
                // 已登录 + 手机端：Home
                <span
                  className="nav-link"
                  style={{ color: token.colorPrimary }}
                  onClick={navigateToHome}
                >
                  Home
                </span>
              ) : (
                // 未登录 + 手机端：显示 Login / Home
                <>
                  <span
                    className="nav-link"
                    style={{ color: token.colorPrimary }}
                    onClick={navigateToLogin}
                  >
                    Login
                  </span>{' '}
                  /{' '}
                  <span
                    className="nav-link"
                    style={{ color: token.colorPrimary }}
                    onClick={navigateToHome}
                  >
                    Home
                  </span>
                </>
              )}
            </Divider>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
