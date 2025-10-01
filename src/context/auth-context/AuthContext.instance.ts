import { createContext } from 'react';
import type { AuthContextType } from './AuthContext.types';

// 创建认证上下文
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
