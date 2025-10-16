/**
 * Token 管理工具
 * 提供统一的 token 存储、获取、删除和验证功能
 */

// Token 存储键名常量
const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
};

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
 * @param {'access' | 'refresh'} type - token 类型，默认为 'access'
 */
export const setToken = (token, type = 'access') => {
  safeLocalStorage(() => {
    const key =
      type === 'refresh' ? TOKEN_KEYS.REFRESH_TOKEN : TOKEN_KEYS.ACCESS_TOKEN;
    localStorage.setItem(key, token);
  });
};

/**
 * 获取 token
 * @param {'access' | 'refresh'} type - token 类型，默认为 'access'
 * @returns {string|null} token 或 null
 */
export const getToken = (type = 'access') => {
  const key =
    type === 'refresh' ? TOKEN_KEYS.REFRESH_TOKEN : TOKEN_KEYS.ACCESS_TOKEN;
  return safeLocalStorage(() => localStorage.getItem(key));
};

/**
 * 删除 token
 * @param {'access' | 'refresh' | 'all'} type - token 类型，默认为 'all'
 */
export const removeToken = (type = 'all') => {
  safeLocalStorage(() => {
    if (type === 'all') {
      localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    } else {
      const key =
        type === 'refresh' ? TOKEN_KEYS.REFRESH_TOKEN : TOKEN_KEYS.ACCESS_TOKEN;
      localStorage.removeItem(key);
    }
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
