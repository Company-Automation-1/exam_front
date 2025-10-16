import { request } from '@/utils/request';

/**
 * 认证相关API
 */
export const authApi = {
  /**
   * 用户登录
   * @param {Object} credentials - 登录凭据
   * @param {string} credentials.username - 用户名
   * @param {string} credentials.password - 密码
   * @param {string} credentials.type - 登录类型
   * @returns {Promise<Object>} 登录结果
   */
  async login(credentials) {
    return await request('/api/login/account', {
      method: 'POST',
      data: credentials,
    });
  },

  /**
   * 获取当前用户信息
   * @returns {Promise<Object>} 用户信息
   */
  async getProfile() {
    return await request('/api/currentUser', {
      method: 'GET',
    });
  },

  /**
   * 用户注册
   * @param {Object} userData - 注册信息
   * @param {string} userData.username - 用户名
   * @param {string} userData.password - 密码
   * @param {string} userData.email - 邮箱
   * @param {string} userData.phone - 手机号
   * @param {string} userData.name - 姓名
   * @returns {Promise<Object>} 注册结果
   */
  async register(userData) {
    return await request('/api/register', {
      method: 'POST',
      data: userData,
    });
  },

  /**
   * 用户登出
   * @returns {Promise<Object>} 登出结果
   */
  async logout() {
    return await request('/api/login/outLogin', {
      method: 'POST',
    });
  },
};
