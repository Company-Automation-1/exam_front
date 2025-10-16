// 环境判断工具函数 - 使用 Vite 内置的布尔值
export const isDev = () => import.meta.env.DEV;
export const isProd = () => import.meta.env.PROD;
