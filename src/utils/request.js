/**
 * Axios 基础封装
 * 提供统一的请求处理、错误处理、token管理
 */

import axios from 'axios';
import { getApiConfig } from '../config/env.js';
import { getToken, removeToken, setToken } from './token.js';

// 获取环境配置
const apiConfig = getApiConfig();

// 请求取消控制器映射
const cancelTokenMap = new Map();

// 请求去重映射
const pendingRequests = new Map();

// 刷新状态管理
let isRefreshing = false;
let refreshPromise = null;

/**
 * 网络错误处理函数
 * @param {string} message - 错误消息
 * @param {string} code - 错误代码
 * @param {object} error - 原始错误对象
 * @returns {Promise} 拒绝的Promise
 */
const createNetworkError = (message, code, error = null) => {
  return Promise.reject({
    success: false,
    message,
    code,
    error,
  });
};

/**
 * 处理 401 认证错误
 * @param {object} error - 错误对象
 * @returns {Promise} 处理结果
 */
const handle401Error = async (error) => {
  const refreshToken = getToken('refresh');

  if (!refreshToken) {
    removeToken('all');
    return Promise.reject(error.response);
  }

  // 如果正在刷新，等待刷新完成
  if (isRefreshing) {
    return refreshPromise.then(() => {
      return request(error.config);
    });
  }

  // 开始刷新
  isRefreshing = true;
  refreshPromise = request
    .post('/auth/refresh', { refreshToken })
    .then((response) => {
      setToken(response.accessToken, 'access');
      setToken(response.refreshToken, 'refresh');
      return response;
    })
    .catch(() => {
      removeToken('all');
      throw new Error('Token refresh failed');
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  try {
    await refreshPromise;
    return request(error.config);
  } catch {
    return Promise.reject(error.response);
  }
};

/**
 * 处理 HTTP 状态码错误
 * @param {object} error - 错误对象
 * @returns {object} 处理后的错误
 */
const handleHttpError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    // 优先使用后端的 message，如果没有则使用状态码映射
    if (data && data.message) {
      error.message = data.message;
      return error;
    }

    // 后端没有 message 时，使用状态码映射
    const statusMessages = {
      400: '错误请求',
      401: '未授权，请重新登录',
      403: '拒绝访问',
      404: '请求错误,未找到该资源',
      405: '请求方法未允许',
      408: '请求超时',
      500: '服务器端出错',
      501: '网络未实现',
      502: '网络错误',
      503: '服务不可用',
      504: '网络超时',
      505: 'http版本不支持该请求',
    };

    error.message = statusMessages[status] || `连接错误${status}`;
  } else {
    error.message = '连接到服务器失败';
  }

  return error;
};

// 创建 axios 实例
const request = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  withCredentials: apiConfig.withCredentials,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加 token
    const token = getToken('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 请求去重：检查是否有相同的请求正在进行
    const requestKey = `${config.method?.toUpperCase()}:${config.url}`;
    if (pendingRequests.has(requestKey)) {
      return Promise.reject(new Error('请求重复，已取消'));
    }

    // 生成请求 ID 用于取消请求（优化性能）
    const requestId = `${config.method?.toUpperCase()}:${config.url}:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    config.requestId = requestId;

    // 创建取消控制器
    const controller = new AbortController();
    config.signal = controller.signal;
    cancelTokenMap.set(requestId, controller);
    pendingRequests.set(requestKey, controller);

    return config;
  },
  (error) => {
    console.error('❌ 请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 清理取消控制器和去重映射
    if (response.config.requestId) {
      cancelTokenMap.delete(response.config.requestId);
    }

    const requestKey = `${response.config.method?.toUpperCase()}:${response.config.url}`;
    pendingRequests.delete(requestKey);

    // 直接返回原始响应数据，保持后端数据格式
    return response.data;
  },
  (error) => {
    // 清理取消控制器和去重映射
    if (error.config?.requestId) {
      cancelTokenMap.delete(error.config.requestId);
    }

    const requestKey = `${error.config?.method?.toUpperCase()}:${error.config?.url}`;
    pendingRequests.delete(requestKey);

    // 处理请求取消错误
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      return createNetworkError('请求已取消', 'CANCELED', error);
    }

    // 处理网络层面的错误（服务器无法返回结果）
    if (error.code === 'ECONNABORTED') {
      return createNetworkError('请求超时', 'TIMEOUT', error);
    }

    if (error.code === 'ERR_NETWORK') {
      return createNetworkError('网络连接失败', 'NETWORK_ERROR', error);
    }

    if (error.response) {
      const { status } = error.response;

      // 处理401认证错误
      if (status === 401) {
        return handle401Error(error);
      }

      // 处理其他 HTTP 状态码错误
      return Promise.reject(handleHttpError(error));
    }

    return createNetworkError('未知网络错误', 'UNKNOWN', error);
  }
);

// 封装常用的 HTTP 方法
export const http = {
  /**
   * GET 请求
   * @param {string} url - 请求地址
   * @param {object} params - 请求参数
   * @param {object} config - 请求配置
   * @returns {Promise} 请求结果
   */
  get: (url, params = {}, config = {}) =>
    request.get(url, { ...config, params }),

  /**
   * POST 请求
   * @param {string} url - 请求地址
   * @param {object} data - 请求数据
   * @param {object} config - 请求配置
   * @returns {Promise} 请求结果
   */
  post: (url, data = {}, config = {}) => request.post(url, data, config),

  /**
   * PUT 请求
   * @param {string} url - 请求地址
   * @param {object} data - 请求数据
   * @param {object} config - 请求配置
   * @returns {Promise} 请求结果
   */
  put: (url, data = {}, config = {}) => request.put(url, data, config),

  /**
   * DELETE 请求
   * @param {string} url - 请求地址
   * @param {object} config - 请求配置
   * @returns {Promise} 请求结果
   */
  delete: (url, config = {}) => request.delete(url, config),

  /**
   * 文件上传
   * @param {string} url - 上传地址
   * @param {object} data - 上传数据
   * @param {object} config - 请求配置
   * @returns {Promise} 上传结果
   */
  upload: (url, data = {}, config = {}) => {
    const formData = new FormData();

    // 处理上传数据
    if (data && typeof data === 'object') {
      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach((item) => {
            formData.append(`${key}[]`, item);
          });
        } else {
          formData.append(key, data[key]);
        }
      });
    }

    return request.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers,
      },
    });
  },
};

/**
 * 取消指定请求
 * @param {string} requestId - 请求 ID
 */
export const cancelRequest = (requestId) => {
  const controller = cancelTokenMap.get(requestId);
  if (controller) {
    controller.abort();
    cancelTokenMap.delete(requestId);
  }
};

/**
 * 取消所有请求
 */
export const cancelAllRequests = () => {
  cancelTokenMap.forEach((controller) => {
    controller.abort();
  });
  cancelTokenMap.clear();
};
