import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import './index.css';

// 注册插件
gsap.registerPlugin(ScrambleTextPlugin);

/**
 * ScrambleText 组件 - 基于 GSAP ScrambleTextPlugin 的文字乱码动画组件
 *
 * @param {Object} props - 组件属性
 * @param {string} props.text - 原始文本内容，用于无障碍访问（默认隐藏）
 * @param {Array<Object>} props.segments - 动画段落配置数组
 * @param {string} props.segments[].text - 该段落的文本内容
 * @param {string} props.segments[].chars - 乱码字符集类型
 *   - "lowerCase": 小写字母 (a-z)
 *   - "upperCase": 大写字母 (A-Z)
 *   - "0123456789": 数字
 *   - "XO": 自定义字符 XO
 *   - 或任意自定义字符串，如 "!@#$%^&*"
 * @param {number} props.segments[].duration - 该段落的动画持续时间（秒）
 * @param {number} props.segments[].speed - 乱码切换速度，越小越快（0.1-1.0）
 * @param {boolean} props.showCursor - 是否显示闪烁光标
 * @param {string} props.cursorImage - 光标图片URL，为空时使用CSS样式光标
 * @param {string} props.className - 额外的CSS类名，支持主题样式：
 *   - "light": 浅色主题
 *   - "dark": 深色主题
 *   - "primary": 主色调
 *   - "success": 成功色
 *   - "warning": 警告色
 *   - "error": 错误色
 * @param {Object} props.style - 内联样式对象
 * @param {Function} props.onComplete - 动画完成回调函数
 * @param {boolean} props.autoPlay - 是否自动播放动画
 * @param {number} props.delay - 动画开始延迟时间（秒）
 *
 * @example
 * // 基础用法
 * <ScrambleText
 *   text="欢迎使用 ScrambleText 组件！"
 *   segments={[
 *     { text: "欢迎使用", chars: "lowerCase", duration: 2 },
 *     { text: " ScrambleText", chars: "upperCase", duration: 1.5 },
 *     { text: " 组件！", chars: "0123456789", duration: 2 }
 *   ]}
 * />
 *
 * @example
 * // 高级用法
 * <ScrambleText
 *   text="高级配置示例"
 *   segments={[
 *     { text: "高级", chars: "XO", speed: 0.3, duration: 1 },
 *     { text: "配置", chars: "!@#$%", speed: 0.5, duration: 1.5 },
 *     { text: "示例", chars: "lowerCase", speed: 0.2, duration: 2 }
 *   ]}
 *   showCursor={true}
 *   className="primary"
 *   autoPlay={false}
 *   delay={1}
 *   onComplete={() => console.log('动画完成！')}
 * />
 */
const ScrambleText = React.forwardRef(
  (
    {
      text = 'Mix it up with ScrambleText. Animate using characters, numbers, UPPERCASE or lowercase.',
      segments = [
        {
          text: 'Mix it up with ScrambleText.',
          chars: 'lowerCase',
          duration: 2,
        },
        {
          text: 'Animate using characters',
          chars: 'XO',
          speed: 0.4,
          duration: 2,
        },
        { text: ' numbers,', chars: '0123456789', duration: 2 },
        { text: 'UPPERCASE', chars: 'upperCase', speed: 0.3, duration: 1 },
        {
          text: 'or lowercase.',
          chars: 'lowerCase',
          speed: 0.3,
          duration: 1.5,
        },
      ],
      showCursor = true,
      cursorImage = '',
      className = '',
      style = {},
      onComplete = null,
      autoPlay = true,
      delay = 0,
    },
    ref
  ) => {
    const containerRef = useRef(null);
    const scrambleTextRefs = useRef([]);
    const cursorRef = useRef(null);
    const timelineRef = useRef(null);
    const cursorTimelineRef = useRef(null);

    /**
     * 主要动画逻辑 - 组件挂载时初始化动画
     * 依赖项变化时会重新创建动画
     */
    useEffect(() => {
      // 确保容器元素存在
      if (!containerRef.current) return;

      // 创建主时间轴 - 控制整个文字动画序列
      const tl = gsap.timeline({
        id: 'text-scramble',
        defaults: { ease: 'none' }, // 默认无缓动，保持匀速
        delay: delay, // 延迟开始时间
        onComplete: () => {
          console.log('ScrambleText 主时间轴完成！');
          if (onComplete) {
            onComplete();
          }
        },
      });

      // 创建光标闪烁时间轴 - 无限循环
      const cursorTl = gsap.timeline({ repeat: -1 });

      // 设置光标闪烁动画
      if (showCursor && cursorRef.current) {
        cursorTl
          .to(cursorRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: 'none',
            delay: 0.2,
          })
          .to(cursorRef.current, {
            opacity: 1,
            duration: 0.5,
            ease: 'none',
            delay: 0.2,
          });
      }

      // 为每个段落创建乱码动画
      segments.forEach((segment, index) => {
        const element = scrambleTextRefs.current[index];
        if (element) {
          tl.to(element, {
            scrambleText: {
              text: segment.text, // 目标文本
              chars: segment.chars || 'lowerCase', // 乱码字符集
              speed: segment.speed || 0.5, // 乱码切换速度
            },
            duration: segment.duration || 2, // 动画持续时间
            onStart: () =>
              console.log(`段落 ${index + 1} 开始: "${segment.text}"`),
            onComplete: () =>
              console.log(`段落 ${index + 1} 完成: "${segment.text}"`),
          });
        }
      });

      // 光标动画独立运行，不影响主时间轴完成
      if (showCursor) {
        cursorTl.play(); // 独立播放光标动画
      }

      // 保存时间轴引用，供外部方法调用
      timelineRef.current = tl;
      cursorTimelineRef.current = cursorTl;

      // 根据 autoPlay 设置决定是否自动播放
      if (autoPlay) {
        tl.play();
      }

      // 清理函数 - 组件卸载时销毁动画
      return () => {
        if (timelineRef.current) {
          timelineRef.current.kill();
        }
        if (cursorTimelineRef.current) {
          cursorTimelineRef.current.kill();
        }
      };
    }, [segments, showCursor, autoPlay, delay, onComplete]);

    /**
     * 播放动画
     * 从当前位置开始播放动画
     */
    const play = () => {
      if (timelineRef.current) {
        timelineRef.current.play(0);
      }
    };

    /**
     * 暂停动画
     * 暂停当前播放的动画
     */
    const pause = () => {
      if (timelineRef.current) {
        timelineRef.current.pause();
      }
    };

    /**
     * 重启动画
     * 重新开始播放动画（从头开始）
     */
    const restart = () => {
      if (timelineRef.current) {
        timelineRef.current.restart();
      }
    };

    /**
     * 暴露方法给父组件
     * 通过 ref 可以调用这些方法控制动画
     * @example
     * const scrambleRef = useRef();
     * // 播放动画
     * scrambleRef.current.play();
     * // 暂停动画
     * scrambleRef.current.pause();
     * // 重启动画
     * scrambleRef.current.restart();
     */
    React.useImperativeHandle(ref, () => ({
      play,
      pause,
      restart,
    }));

    return (
      <div
        ref={containerRef}
        className={`text-scramble__content ${className}`}
        style={style}
      >
        {/* 乱码文本容器 - 实际显示的动画文本 */}
        <p className="text-scramble__text" aria-hidden="true">
          {/* 动态生成段落元素，每个段落对应 segments 中的一个配置 */}
          {segments.map((_, index) => (
            <span
              key={index}
              ref={(el) => (scrambleTextRefs.current[index] = el)}
              id={`scramble-text-${index + 1}`}
            />
          ))}

          {/* 闪烁光标 - 可选显示 */}
          {showCursor && cursorImage && (
            <img
              ref={cursorRef}
              id="scramble-cursor"
              src={cursorImage}
              alt=""
            />
          )}
        </p>
      </div>
    );
  }
);

// 设置组件的 displayName，便于调试
ScrambleText.displayName = 'ScrambleText';

export default ScrambleText;
