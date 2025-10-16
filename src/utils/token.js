/**
 * Token 管理工具
 * 提供统一的 token 存储、获取、删除和验证功能
 */

// Token 存储键名常量
const TOKEN_KEY = 'token';

/**
 * 安全地执行 localStorage 操作
 * @param {Function} operation - 要执行的操作
 * @param {any} defaultValue - 操作失败时的默认值
 * @returns {any} 操作结果或默认值
 */
const safeLocalStorage = (operation, defaultValue = null) => {
  try {
    return operation();
  } catch {
    return defaultValue;
  }
};

/**
 * 设置 token
 * @param {string} token - token 值
 */
export const setToken = (token) => {
  safeLocalStorage(() => {
    localStorage.setItem(TOKEN_KEY, token);
  });
};

/**
 * 获取 token
 * @returns {string|null} token 或 null
 */
export const getToken = () => {
  return safeLocalStorage(() => localStorage.getItem(TOKEN_KEY));
};

/**
 * 删除 token
 */
export const removeToken = () => {
  safeLocalStorage(() => {
    localStorage.removeItem(TOKEN_KEY);
  });
};

/**
 * 检查 token 是否过期
 * @param {string} token - 要检查的 token
 * @returns {boolean} token 是否过期
 */
export const isTokenExpired = (token) => {
  // 检查 token 是否存在且不为空
  if (!token || typeof token !== 'string' || token.trim() === '') {
    return true;
  }

  try {
    // 优化：只解析一次，缓存结果
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return !payload.exp || payload.exp <= currentTime;
  } catch {
    return true;
  }
};
