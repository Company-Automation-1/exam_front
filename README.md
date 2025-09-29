# React 19 项目模板

一个功能完整的 React 19 + TypeScript + Vite 项目模板，集成了现代前端开发的最佳实践和常用工具链。

## ✨ 核心特性

- 🚀 **Vite v7** - 极速的开发服务器和构建工具
- ⚛️ **React 19** - 最新版本的 React 框架，支持并发特性
- 📘 **TypeScript 5.8** - 完整的类型支持和严格模式
- 🎨 **Ant Design v5** - 企业级 UI 组件库，支持主题定制
- 🛣️ **React Router v7** - 现代化的路由管理，支持嵌套路由
- 🔄 **智能自动导入** - React Hooks 和 Antd 组件无需手动导入
- 📄 **文件路由系统** - 基于文件系统的自动路由生成
- 🌐 **企业级 HTTP 封装** - 完整的 Axios 封装，支持 token 自动刷新和错误处理
- 🔐 **身份认证系统** - 完整的登录、token 管理、权限控制示例
- 📊 **数据管理示例** - 用户管理、CRUD 操作等完整示例
- 📦 **代码质量保障** - ESLint + Prettier + TypeScript 严格检查
- 🚀 **一键部署** - 支持 Vercel、Netlify 等平台部署

## 🛠️ 技术栈详情

### 核心框架
- **React**: v19.1.1 - 最新版本，支持并发渲染和 Suspense
- **TypeScript**: v5.8.3 - 严格模式，完整类型支持
- **Vite**: v7.1.6 - 极速构建工具，支持 HMR

### UI 与路由
- **Ant Design**: v5.27.4 - 企业级 UI 组件库
- **React Router**: v7.9.1 - 现代化路由解决方案
- **@ant-design/v5-patch-for-react-19**: v1.0.3 - React 19 兼容补丁

### 开发工具
- **Axios**: v1.12.2 - HTTP 客户端
- **unplugin-auto-import**: v20.1.0 - 自动导入插件
- **unplugin-auto-import-antd**: v0.0.2 - Antd 组件自动导入
- **vite-plugin-pages**: v0.33.1 - 文件路由生成

### 代码质量
- **ESLint**: v9.35.0 - 代码规范检查
- **Prettier**: v3.6.2 - 代码格式化
- **TypeScript ESLint**: v8.43.0 - TypeScript 代码规范

## 📁 项目结构

```
react-template/
├── public/                    # 静态资源
│   └── vite.svg              # Vite 图标
├── src/
│   ├── assets/               # 资源文件
│   │   └── react.svg         # React 图标
│   ├── components/           # 可复用组件（具名导出）
│   ├── services/             # API 服务层
│   │   ├── api/              # API 接口定义
│   │   │   ├── index.ts      # API 统一导出
│   │   │   ├── auth.ts       # 认证相关 API
│   │   │   └── user.ts       # 用户相关 API
│   │   ├── types/            # TypeScript 类型定义
│   │   │   ├── index.ts      # 类型统一导出
│   │   │   ├── auth.ts       # 认证相关类型
│   │   │   └── user.ts       # 用户相关类型
│   │   └── request.ts        # HTTP 请求封装
│   ├── views/                # 页面组件（自动生成路由）
│   │   ├── index.tsx         # 首页 (/)
│   │   ├── example/          # 示例页面 (/example)
│   │   │   └── index.tsx     # 用户管理示例
│   │   ├── login/            # 登录页面 (/login)
│   │   │   └── index.tsx     # 登录表单
│   │   ├── page1/            # 页面1 (/page1)
│   │   ├── page2/            # 页面2 (/page2)
│   │   ├── page3/            # 页面3 (/page3)
│   │   └── page4/            # 页面4 (/page4)
│   ├── App.tsx               # 根组件
│   ├── main.tsx              # 入口文件
│   ├── auto-imports.d.ts     # 自动导入类型声明
│   ├── global.ts             # 全局配置
│   ├── App.css               # 应用样式
│   └── index.css             # 全局样式
├── .cursor/                  # Cursor 编辑器配置
├── package.json              # 项目依赖配置
├── vite.config.ts            # Vite 构建配置
├── tsconfig.json             # TypeScript 配置
├── tsconfig.app.json         # 应用 TypeScript 配置
├── tsconfig.node.json        # Node.js TypeScript 配置
├── eslint.config.js          # ESLint 配置
├── vercel.json               # Vercel 部署配置
├── AGENTS.md                 # AI 助手配置文档
└── README.md                 # 项目说明文档
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn
```

### 开发模式

```bash
# 启动开发服务器
npm run dev
# 或
yarn dev
```

开发服务器将在 `http://localhost:5173` 启动，并自动打开浏览器。

### 构建生产版本

```bash
# 构建生产版本
npm run build
# 或
yarn build
```

### 预览生产版本

```bash
# 预览构建结果
npm run preview
# 或
yarn preview
```

## 🎯 核心特性详解

### 🔄 智能自动导入

项目配置了完整的自动导入功能，开发体验更流畅：

```tsx
// React Hooks 无需导入，直接使用
const [count, setCount] = useState(0);
const navigate = useNavigate();
const { pathname } = useLocation();

// Antd 组件也无需导入
<Button type="primary">按钮</Button>
<Input placeholder="输入框" />
<Form onFinish={handleSubmit}>
  <Form.Item name="username">
    <Input />
  </Form.Item>
</Form>

// React Router 组件自动导入
<Link to="/about">关于我们</Link>
<NavLink to="/products">产品</NavLink>
```

### 📄 文件路由系统

基于 `vite-plugin-pages` 的自动路由生成，约定优于配置：

```tsx
// 文件路径 → 路由地址
src/views/index.tsx           → /
src/views/about/index.tsx     → /about
src/views/user/profile.tsx    → /user/profile
src/views/blog/[id].tsx       → /blog/:id
src/views/docs/[...slug].tsx  → /docs/*

// 页面组件示例
const HomePage = () => {
  return (
    <div>
      <h1>首页</h1>
      <Link to="/about">关于我们</Link>
    </div>
  );
};

export default HomePage; // 页面组件使用默认导出
```

### 🌐 企业级 HTTP 封装

完整的 Axios 封装，支持企业级应用需求：

```tsx
import request from '@/services/request';
import type { ApiResponse, User } from '@/services/types';

// 基础请求
const response = await request.get<ApiResponse<User[]>>('/api/users');

// POST 请求
const newUser = await request.post<ApiResponse<User>>('/api/users', {
  name: '张三',
  email: 'zhangsan@example.com'
});

// 文件上传
const uploadResponse = await request.upload('/api/upload', {
  file: fileObject,
  type: 'avatar'
});

// 文件下载
const fileBlob = await request.download('/api/download/report.pdf');

// 请求取消
const controller = request.createAbortController();
const data = await request.get('/api/data', { 
  signal: controller.signal 
});
controller.abort(); // 取消请求

// 带认证的请求实例
const authRequest = new Request({
  baseURL: '/api'
}, {
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setTokens: ({ accessToken, refreshToken }) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  },
  refreshToken: async (refreshToken) => {
    const response = await request.post('/api/auth/refresh', { refreshToken });
    return {
      accessToken: response.result.accessToken,
      refreshToken: response.result.refreshToken
    };
  }
});
```

### 🔐 身份认证系统

完整的认证流程，包含登录、token 管理、权限控制：

```tsx
// 登录页面示例
const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: LoginRequest) => {
    setLoading(true);
    try {
      const response = await authApi.login(values);
      if (response.code === 200) {
        message.success('登录成功');
        // 自动跳转到首页或目标页面
        React.navigate('/');
      }
    } catch (error) {
      message.error('登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={handleLogin}>
      <Form.Item name="email" rules={[{ required: true, message: '请输入邮箱' }]}>
        <Input placeholder="邮箱" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
        <Input.Password placeholder="密码" />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading} block>
        登录
      </Button>
    </Form>
  );
};
```

### 📊 数据管理示例

完整的 CRUD 操作示例，包含用户管理：

```tsx
// 用户管理页面
const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userApi.getUsers({ page: 1, pageSize: 10 });
      if (response.code === 200) {
        setUsers(response.result.users);
      }
    } catch (error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 创建用户
  const handleCreateUser = async (userData: CreateUserRequest) => {
    try {
      const response = await userApi.createUser(userData);
      if (response.code === 200) {
        message.success('创建用户成功');
        fetchUsers(); // 刷新列表
      }
    } catch (error) {
      message.error('创建用户失败');
    }
  };

  // 表格列定义
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '角色', dataIndex: 'role', key: 'role' },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>用户管理</h1>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};
```

## 📝 开发指南

### 🎨 代码规范

项目使用 ESLint 和 Prettier 进行代码规范：

```bash
# 检查代码规范
npm run lint

# 格式化代码
npm run format

# 检查代码格式
npm run format:check
```

### 📄 添加新页面

1. 在 `src/views/` 目录下创建新的组件文件
2. 路由会自动生成，无需手动配置
3. 使用 `Link` 组件进行页面跳转

```tsx
// src/views/about/index.tsx
const About = () => {
  return (
    <div>
      <h1>关于我们</h1>
      <Link to="/">返回首页</Link>
    </div>
  );
};

export default About; // 页面组件使用默认导出
```

### 🧩 添加新组件

在 `src/components/` 目录下创建可复用的组件：

```tsx
// src/components/Header/index.tsx
import React from 'react';

interface HeaderProps {
  title: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ title, className }) => {
  return (
    <header className={className}>
      <h1>{title}</h1>
    </header>
  );
};

export { Header }; // 可复用组件使用具名导出
```

### 🔧 添加新 API 服务

1. 在 `src/services/types/` 下定义类型
2. 在 `src/services/api/` 下创建 API 接口
3. 在 `src/services/api/index.ts` 中导出

```tsx
// src/services/types/product.ts
import type { ApiResponse } from '@/services/request';

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

export type GetProductsResponse = ApiResponse<Product[]>;
export type GetProductResponse = ApiResponse<Product>;

// src/services/api/product.ts
import request from '@/services/request';
import type { GetProductsResponse, GetProductResponse } from '@/services/types/product';

export const productApi = {
  getProducts: () => request.get<GetProductsResponse>('/api/products'),
  getProduct: (id: number) => request.get<GetProductResponse>(`/api/products/${id}`),
};

// src/services/api/index.ts
export * from './user';
export * from './auth';
export * from './product'; // 新增导出
```

### 🌐 使用 HTTP 请求

```tsx
import { userApi } from '@/services/api';
import type { User, CreateUserRequest } from '@/services/types/user';

const UserComponent = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await userApi.getUsers();
      if (response.code === 200) {
        setUsers(response.result.users);
        message.success('获取用户列表成功');
      }
    } catch (error) {
      message.error('获取用户列表失败');
      console.error('错误:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};
```

### 🔐 配置身份认证

```tsx
// src/services/auth-config.ts
import { Request } from '@/services/request';

// 创建带认证的请求实例
export const authRequest = new Request({
  baseURL: '/api'
}, {
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setTokens: ({ accessToken, refreshToken }) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  },
  refreshToken: async (refreshToken) => {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    const data = await response.json();
    return {
      accessToken: data.result.accessToken,
      refreshToken: data.result.refreshToken
    };
  }
});

// 使用认证请求
export const authApi = {
  getProfile: () => authRequest.get('/auth/profile'),
  updateProfile: (data: any) => authRequest.put('/auth/profile', data),
};
```

### 🎯 最佳实践

1. **组件命名**：使用 PascalCase，文件名与组件名保持一致
2. **类型定义**：为所有 Props 和 API 响应定义 TypeScript 类型
3. **错误处理**：使用 try-catch 包装异步操作，提供用户友好的错误提示
4. **状态管理**：优先使用 useState，复杂状态考虑 useReducer
5. **性能优化**：使用 useCallback 和 useMemo 优化性能
6. **代码分割**：大型组件考虑拆分为更小的子组件

## 🚀 部署指南

### Vercel 部署（推荐）

项目已配置 Vercel 部署，支持一键部署：

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **在 Vercel 中导入项目**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 自动检测构建配置

3. **自动部署完成**
   - Vercel 会自动构建和部署
   - 获得生产环境 URL
   - 支持自动 HTTPS 和 CDN

### Netlify 部署

1. **构建项目**
   ```bash
   npm run build
   ```

2. **部署到 Netlify**
   - 拖拽 `dist/` 文件夹到 Netlify
   - 或连接 GitHub 仓库自动部署

### 其他平台部署

构建后的文件在 `dist/` 目录，可以部署到：
- **静态托管服务**：GitHub Pages、GitLab Pages、Firebase Hosting
- **云服务商**：阿里云 OSS、腾讯云 COS、AWS S3
- **自建服务器**：Nginx、Apache、IIS

### 环境变量配置

生产环境可能需要配置环境变量：

```bash
# .env.production
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_TITLE=生产应用名称
```

## 🔧 故障排除

### 常见问题

1. **自动导入不生效**
   ```bash
   # 重启开发服务器
   npm run dev
   ```

2. **TypeScript 类型错误**
   ```bash
   # 重新生成类型文件
   npm run dev
   ```

3. **路由不工作**
   - 确保页面组件使用默认导出
   - 检查文件路径是否正确

4. **API 请求失败**
   - 检查网络连接
   - 验证 API 地址是否正确
   - 查看浏览器控制台错误信息

### 性能优化建议

1. **代码分割**
   ```tsx
   const LazyComponent = lazy(() => import('./LazyComponent'));
   ```

2. **图片优化**
   - 使用 WebP 格式
   - 实现懒加载
   - 压缩图片大小

3. **Bundle 分析**
   ```bash
   npm install --save-dev vite-bundle-analyzer
   ```

## 📚 学习资源

### 官方文档
- [React 19 官方文档](https://react.dev/) - 最新 React 特性
- [TypeScript 官方文档](https://www.typescriptlang.org/) - 类型系统详解
- [Vite 官方文档](https://vitejs.dev/) - 构建工具配置
- [Ant Design 官方文档](https://ant.design/) - UI 组件库
- [React Router v7 文档](https://reactrouter.com/) - 路由管理

### 推荐教程
- [React 19 新特性](https://react.dev/blog/2024/12/05/react-19)
- [TypeScript 最佳实践](https://typescript-eslint.io/docs/linting/typed-linting/)
- [Vite 插件开发](https://vitejs.dev/guide/api-plugin.html)

### 社区资源
- [React 中文社区](https://zh-hans.react.dev/)
- [TypeScript 中文网](https://www.tslang.cn/)
- [Ant Design 中文文档](https://ant.design/docs/react/introduce-cn)

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目的支持：
- React 团队提供的优秀框架
- Vite 团队提供的极速构建工具
- Ant Design 团队提供的企业级 UI 组件
- 所有贡献者和社区成员
