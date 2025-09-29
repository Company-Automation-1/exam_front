# 项目开发指南

## 技术栈

- React 19 + TypeScript + Vite
- Ant Design UI 组件库
- React Router v7 路由管理
- Axios HTTP 请求封装
- 自动导入和文件路由

## 开发规范

### 代码风格

- 使用 TypeScript 严格模式
- 组件使用函数式组件和 React.FC 类型
- 优先使用具名导出，页面组件使用默认导出
- 使用 2 个空格缩进，单引号，行尾不添加分号

### 组件开发

- 在 `src/views/` 目录创建页面组件，自动生成路由
- 在 `src/components/` 目录创建可复用组件
- 使用自动导入的 React Hooks 和 Antd 组件
- 组件 Props 使用 TypeScript 接口定义

### API 调用

- 使用 `@/services/request` 进行 HTTP 请求
- 统一的错误处理和 token 自动刷新
- 支持文件上传下载和请求取消

### 路由管理

- 基于文件系统的自动路由生成
- 使用 `Link` 和 `useNavigate` 进行导航
- 支持动态路由和查询参数

## 项目结构

```
src/
├── components/     # 可复用组件
├── views/         # 页面组件（自动路由）
├── services/      # API 服务
├── hooks/         # 自定义 Hooks
├── utils/         # 工具函数
└── types/         # 类型定义
```

## 开发命令

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run lint` - 代码规范检查
- `npm run format` - 代码格式化
