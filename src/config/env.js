/**
 * 环境配置
 * 根据不同的环境设置不同的 API 配置
 */

// 环境配置
const ENV_CONFIG = {
  development: {
    baseURL: 'http://localhost:3001/api',
    timeout: 10000,
    withCredentials: false,
  },
  production: {
    baseURL: 'https://api.yourdomain.com',
    timeout: 20000,
    withCredentials: true,
  },
};

// 获取当前环境的配置
export const getApiConfig = () => {
  // 直接使用 Vite 提供的布尔值环境变量
  const config = import.meta.env.DEV
    ? ENV_CONFIG.development
    : ENV_CONFIG.production;

  return config;
};

// 环境判断工具函数 - 使用 Vite 内置的布尔值
export const isDev = () => import.meta.env.DEV;
export const isProd = () => import.meta.env.PROD;

// 导出环境配置
export default ENV_CONFIG;
