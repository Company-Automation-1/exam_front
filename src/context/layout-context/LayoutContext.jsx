import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [useLayout, setUseLayout] = useState(true);

  // 使用useCallback缓存setUseLayout函数
  const toggleLayout = useCallback(() => {
    setUseLayout((prev) => !prev);
  }, []);

  const setLayout = useCallback((value) => {
    setUseLayout(value);
  }, []);

  // 使用useMemo缓存value，只有依赖变化时才重新创建
  const value = useMemo(
    () => ({
      useLayout,
      setUseLayout,
      toggleLayout,
      setLayout,
    }),
    [useLayout, setUseLayout, toggleLayout, setLayout]
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
