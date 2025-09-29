/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from 'axios';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

/**
 * 业务通用响应结构
 * 后端接口统一返回的数据格式
 */
export type ApiResponse<T = unknown> = {
  code: number; // 业务状态码
  message: string; // 业务消息
  result: T; // 实际数据
};

/**
 * 通用请求数据类型
 * 用于 POST、PUT 等请求的数据参数
 */
export type RequestData =
  | Record<string, unknown>
  | { [key: string]: any }
  | FormData
  | string
  | null
  | undefined;

/**
 * 统一错误结构
 * 将各种错误（网络、超时、取消、业务错误）统一为这个格式
 * 调用方可以稳定处理，不用关心错误来源
 */
export type ApiError = {
  status?: number; // HTTP状态码（如401、500等）
  code?: string; // 错误代码（如ECONNABORTED）
  message: string; // 错误消息（中文提示）
  details?: unknown; // 错误详情（通常是后端返回的错误数据）
  isNetworkError?: boolean; // 是否为网络错误（无响应）
  isTimeout?: boolean; // 是否为超时错误
  isCanceled?: boolean; // 是否为取消错误
};

/**
 * 鉴权配置选项
 * 用于自定义token的获取、存储和刷新逻辑
 * 如果不传这个配置，就不会自动添加任何认证头
 */
export type AuthOptions = {
  // 获取当前访问令牌（必须）
  getAccessToken: () => string | null;

  // 设置新的访问令牌和刷新令牌（可选）
  // 当token刷新成功后，会调用这个函数更新存储
  setTokens?: (tokens: {
    accessToken: string;
    refreshToken?: string | null;
  }) => void;

  // 获取刷新令牌（可选）
  // 用于401时自动刷新token
  getRefreshToken?: () => string | null;

  // 刷新token的逻辑（可选）
  // 输入旧的刷新令牌，返回新的访问令牌和刷新令牌
  // 如果配置了这个，遇到401时会自动调用并重试原请求
  refreshToken?: (
    refreshToken: string | null
  ) => Promise<{ accessToken: string; refreshToken?: string | null }>;
};

/**
 * HTTP状态码到中文提示的映射表
 * 用于将后端返回的状态码转换为用户友好的中文提示
 */
const statusMessageMap: Record<number, string> = {
  400: '请求错误(400)',
  401: '未授权，请重新登录(401)',
  403: '拒绝访问(403)',
  404: '请求出错(404)',
  408: '请求超时(408)',
  500: '服务器错误(500)',
  501: '服务未实现(501)',
  502: '网络错误(502)',
  503: '服务不可用(503)',
  504: '网络超时(504)',
  505: 'HTTP版本不受支持(505)',
};

/**
 * 将各种错误统一转换为 ApiError 格式
 * 处理：取消请求、网络错误、超时、HTTP错误等
 *
 * @param error 原始错误对象
 * @returns 标准化的错误信息
 */
function normalizeAxiosError(error: unknown): ApiError {
  // 处理 AbortController 取消的请求
  if (
    typeof AbortController !== 'undefined' &&
    error instanceof DOMException &&
    error.name === 'AbortError'
  ) {
    return { message: '请求已取消', isCanceled: true };
  }

  // 处理 axios 的 CancelToken 取消的请求（已废弃，但兼容处理）
  if (axios.isCancel(error)) {
    return { message: '请求已取消', isCanceled: true };
  }

  // 转换为 AxiosError 类型
  const axError = error as AxiosError;
  const status = axError.response?.status; // HTTP状态码
  const code = axError.code; // 错误代码

  // 没有响应的情况：网络错误或超时
  if (!axError.response) {
    const isTimeout = code === 'ECONNABORTED'; // 超时错误
    return {
      message: isTimeout ? '请求超时' : '网络异常，请检查网络连接',
      isNetworkError: !isTimeout, // 非超时就是网络错误
      isTimeout,
    };
  }

  // 有响应的情况：HTTP错误
  const message = status
    ? statusMessageMap[status] || `连接出错(${status})!`
    : axError.message || '请求错误';
  return {
    status, // HTTP状态码
    code, // 错误代码
    message, // 中文错误提示
    details: axError.response?.data, // 后端返回的错误详情
  };
}

/**
 * 请求封装类
 * 基于 axios 封装，提供统一的请求处理、错误处理、token管理等功能
 */
export class Request {
  instance: AxiosInstance; // axios 实例
  private auth?: AuthOptions; // 鉴权配置（可选）
  private isRefreshing = false; // 是否正在刷新token（防止并发刷新）
  private refreshWaitQueue: Array<(token: string | null) => void> = []; // 刷新等待队列

  // 基础配置
  baseConfig: AxiosRequestConfig = {
    timeout: 60000, // 60秒超时
  };

  /**
   * 构造函数
   * @param config axios配置（可选）
   * @param auth 鉴权配置（可选）
   */
  constructor(config: AxiosRequestConfig = {}, auth?: AuthOptions) {
    // 创建axios实例
    this.instance = axios.create({ ...this.baseConfig, ...config });
    this.auth = auth;

    // 设置请求拦截器：根据配置添加token
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 只有在配置了AuthOptions时才自动添加token
        if (this.auth?.getAccessToken) {
          const token = this.auth.getAccessToken();
          if (token) {
            (config.headers as Record<string, string>).Authorization =
              `Bearer ${token}`;
          }
        }
        return config;
      },
      (err: unknown) => Promise.reject(normalizeAxiosError(err))
    );

    // 设置响应拦截器：处理响应和错误
    this.instance.interceptors.response.use(
      // 成功响应：只返回data部分
      (res: AxiosResponse) => {
        return res.data;
      },
      // 错误响应：处理401自动刷新、统一错误格式
      async (err: unknown) => {
        const apiError = normalizeAxiosError(err);
        const status = (err as AxiosError).response?.status;
        const originalConfig = (err as AxiosError).config as
          | (InternalAxiosRequestConfig & { _retry?: boolean })
          | undefined;

        // 401错误 + 配置了刷新逻辑 + 未重试过 = 自动刷新token并重试
        if (
          status === 401 &&
          this.auth?.refreshToken &&
          originalConfig &&
          !originalConfig._retry
        ) {
          originalConfig._retry = true; // 标记已重试，防止死循环

          try {
            // 尝试刷新token
            const newToken = await this.handleRefreshToken();
            if (newToken) {
              // 更新请求头中的token
              (originalConfig.headers as Record<string, string>).Authorization =
                `Bearer ${newToken}`;
            }
            // 用新token重新发送原请求
            return this.instance.request(originalConfig);
          } catch (refreshErr) {
            // 刷新失败，返回错误
            return Promise.reject(normalizeAxiosError(refreshErr));
          }
        }

        // 其他错误直接返回
        return Promise.reject(apiError);
      }
    );
  }

  /**
   * 通用请求方法
   * @param config 请求配置
   * @returns Promise<T> 返回服务端data（通常是ApiResponse<T>格式）
   */
  public request<T = ApiResponse>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request<unknown, T>(config);
  }

  /**
   * GET请求
   * @param url 请求地址
   * @param config 请求配置（可选）
   * @returns Promise<T> 返回服务端data
   */
  public get<T = ApiResponse>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.get<unknown, T>(url, config);
  }

  /**
   * POST请求
   * @param url 请求地址
   * @param data 请求数据（可选）
   * @param config 请求配置（可选）
   * @returns Promise<T> 返回服务端data
   */
  public post<T = ApiResponse>(
    url: string,
    data?: RequestData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.post<unknown, T>(url, data, config);
  }

  /**
   * PUT请求
   * @param url 请求地址
   * @param data 请求数据（可选）
   * @param config 请求配置（可选）
   * @returns Promise<T> 返回服务端data
   */
  public put<T = ApiResponse>(
    url: string,
    data?: RequestData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.put<unknown, T>(url, data, config);
  }

  /**
   * DELETE请求
   * @param url 请求地址
   * @param config 请求配置（可选）
   * @returns Promise<T> 返回服务端data
   */
  public delete<T = ApiResponse>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.delete<unknown, T>(url, config);
  }

  /**
   * 文件上传
   * 自动将数据转换为FormData格式，并设置multipart/form-data头
   * @param url 上传地址
   * @param data 上传数据（对象格式，会自动转换为FormData）
   * @param config 请求配置（可选）
   * @returns Promise<T> 返回服务端data
   */
  public upload<T = ApiResponse>(
    url: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    // 创建FormData对象
    const form = new FormData();
    if (data && typeof data === 'object') {
      // 将对象的所有属性添加到FormData中
      Object.keys(data).forEach((key) => {
        form.append(key, String(data[key]));
      });
    }

    // 设置请求头为multipart/form-data
    const finalConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...(config?.headers || {}),
        'Content-Type': 'multipart/form-data',
      },
    };

    return this.instance.post<unknown, T>(url, form, finalConfig);
  }

  /**
   * 文件下载
   * @param url 下载地址
   * @param config 请求配置（可选）
   * @returns Promise<Blob> 返回文件Blob对象
   */
  public download(url: string, config?: AxiosRequestConfig): Promise<Blob> {
    return this.instance.get<unknown, Blob>(url, {
      responseType: 'blob',
      ...(config || {}),
    });
  }

  /**
   * 创建AbortController，用于取消请求
   * @returns AbortController 取消控制器
   *
   * 使用示例：
   * const controller = http.createAbortController();
   * http.get('/api/data', { signal: controller.signal });
   * controller.abort(); // 取消请求
   */
  public createAbortController(): AbortController {
    return new AbortController();
  }

  /**
   * 处理token刷新逻辑
   * 核心功能：防止并发刷新，多个401请求只触发一次刷新，其他请求等待
   * @returns Promise<string | null> 新的访问令牌，失败返回null
   */
  private async handleRefreshToken(): Promise<string | null> {
    // 如果没有配置刷新逻辑，直接返回null
    if (!this.auth?.refreshToken) return null;

    // 创建等待Promise：将resolve函数加入等待队列
    const enqueueWait = () =>
      new Promise<string | null>((resolve) => {
        this.refreshWaitQueue.push(resolve);
      });

    // 如果正在刷新，当前请求加入等待队列
    if (this.isRefreshing) {
      return enqueueWait();
    }

    // 开始刷新流程
    this.isRefreshing = true;
    try {
      // 获取刷新令牌并调用刷新接口
      const refreshToken = this.auth.getRefreshToken
        ? this.auth.getRefreshToken()
        : null;
      const next = await this.auth.refreshToken(refreshToken);

      // 更新存储的令牌
      this.auth.setTokens?.({
        accessToken: next.accessToken,
        refreshToken: next.refreshToken,
      });

      // 唤醒所有等待的请求，传递新令牌
      this.refreshWaitQueue.forEach((resolve) => resolve(next.accessToken));
      this.refreshWaitQueue = []; // 清空等待队列

      return next.accessToken;
    } catch (e) {
      // 刷新失败，唤醒所有等待的请求，传递null
      this.refreshWaitQueue.forEach((resolve) => resolve(null));
      this.refreshWaitQueue = []; // 清空等待队列
      throw e; // 重新抛出错误
    } finally {
      // 无论成功失败，都要重置刷新状态
      this.isRefreshing = false;
    }
  }
}

/**
 * 默认导出的Request实例
 * 保持与现有使用方式兼容，可以直接使用
 * 特点：
 * - 纯HTTP请求，不自动添加任何认证头
 * - 统一错误处理
 * - 支持取消请求、文件上传下载
 * - 如需token认证，请传入AuthOptions配置
 */
export default new Request({});
