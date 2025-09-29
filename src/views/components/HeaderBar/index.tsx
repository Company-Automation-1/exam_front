import React from 'react';
import { Typography, Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

interface HeaderBarProps {
  title: string;
  onBack: () => void;
  backText?: string;
  useAnimation?: boolean;
}

// 确保只注册一次动画 keyframes
let moveKeyframesRegistered: boolean = false;
const ensureMoveKeyframes: () => void = () => {
  if (moveKeyframesRegistered) return;
  try {
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-headerbar-move', '');
    styleEl.textContent = `
@keyframes headerbar-move {
  from {
    opacity: 0;
    transform: translateY(300%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;
    document.head.appendChild(styleEl);
    moveKeyframesRegistered = true;
  } catch {
    // 忽略样式注入失败，仅在极端环境下发生
  }
};

const useAnimatedLetters = (
  text: React.ReactNode,
  enabled: boolean
): (() => React.ReactNode) => {
  const [animate, setAnimate] = useState<boolean>(true);

  useEffect(() => {
    if (enabled && typeof text === 'string') {
      ensureMoveKeyframes();
    }
  }, [enabled, text]);

  useEffect(() => {
    setAnimate(true);
  }, [text]);

  const getNodes = useCallback((): React.ReactNode => {
    if (!enabled) return text;
    if (typeof text === 'string') {
      return text.split('').map((letter: string, index: number) => (
        <span
          key={index}
          style={{
            opacity: 0,
            display: 'inline-block',
            animation: animate
              ? `headerbar-move 1s ${index * 0.1}s cubic-bezier(0.46, -0.15, 0.49, 1.48) forwards`
              : 'none',
          }}
        >
          {letter}
        </span>
      ));
    }
    return text;
  }, [text, animate, enabled]);

  return getNodes;
};

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  onBack,
  backText = '返回',
  useAnimation = true,
}) => {
  const getAnimatedTitle = useAnimatedLetters(title, useAnimation);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: '1.1vh 0',
      }}
    >
      <Button
        type="link"
        onClick={onBack}
        style={{
          padding: 0,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
        }}
        icon={<LeftOutlined />}
      >
        {backText}
      </Button>
      <Typography.Title
        level={5}
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          margin: 0,
          whiteSpace: 'nowrap',
        }}
      >
        {getAnimatedTitle()}
      </Typography.Title>
    </div>
  );
};

export { HeaderBar };
