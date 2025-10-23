import React, { useState, useEffect, useRef } from 'react';
import { HeaderBar } from '@/components/HeaderBar';
import { Typography, Progress, Space, Button, Tag } from 'antd';
import { ClockCircleOutlined, ProfileOutlined } from '@ant-design/icons';

/**
 * 考试头部组件
 * @param title 标题
 * @param progressText 进度文本
 * @param progressPercent 进度百分比
 * @param sessionData 会话数据
 * @param examData 考试数据
 * @param isMobile 是否为移动端
 * @param onSubmit 提交回调
 * @param onBack 返回回调
 * @param onTimeUp 时间到回调
 */
const ExamHeader = ({
  title,
  progressText,
  progressPercent,
  sessionData,
  examData,
  isMobile,
  isPracticeMode = false,
  onSubmit,
  onBack,
  onTimeUp,
}) => {
  console.log('🔄 ExamHeader 重新渲染');
  const [leftSeconds, setLeftSeconds] = useState(null);
  const prevLeftRef = useRef(null);
  const countdownStartedRef = useRef(false);

  // 倒计时逻辑
  useEffect(() => {
    if (!sessionData?.startTime || !examData?.timeLimit) {
      setLeftSeconds(null);
      return;
    }

    const start = new Date(sessionData.startTime).getTime();
    const end = start + (examData.timeLimit || 0) * 60 * 1000;

    const tick = () => {
      const secs = Math.max(0, Math.floor((end - Date.now()) / 1000));
      setLeftSeconds(secs);

      if (!countdownStartedRef.current && secs !== null) {
        countdownStartedRef.current = true;
      }

      prevLeftRef.current = secs;
      console.log('⏰ 倒计时更新:', secs, '秒');
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [sessionData?.startTime, examData?.timeLimit]);

  // 检测时间到0，触发自动交卷
  useEffect(() => {
    const prev = prevLeftRef.current;
    const hasStarted = countdownStartedRef.current;

    if (
      hasStarted &&
      examData?.timeLimit > 0 &&
      typeof prev === 'number' &&
      prev > 0 &&
      leftSeconds === 0
    ) {
      if (onTimeUp) {
        onTimeUp();
      }
    }
  }, [leftSeconds, examData?.timeLimit, onTimeUp]);

  const formatLeft = (secs) => {
    if (secs == null) return '计算中...';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0)
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const leftTimeText = formatLeft(leftSeconds);
  return (
    <>
      <HeaderBar
        title={
          <Space>
            <span>{title}</span>
            {isPracticeMode && (
              <Tag color="orange" style={{ margin: 0 }}>
                练习模式
              </Tag>
            )}
          </Space>
        }
        onBack={onBack}
        backText={'返回'}
        useAnimation={false}
      />

      {/* 下半部分：左计时 / 中进度（文案+条） / 右答题卡 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginTop: 8,
        }}
      >
        <Space size={6} align="center" style={{ color: '#555' }}>
          <ClockCircleOutlined />
          <span>{leftTimeText}</span>
        </Space>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flex: 1,
            minWidth: 0,
          }}
        >
          <Typography.Text type="secondary" style={{ whiteSpace: 'nowrap' }}>
            {progressText}
          </Typography.Text>
          <div style={{ flex: 1, minWidth: 120 }}>
            <Progress
              percent={Math.min(100, Math.max(0, progressPercent))}
              showInfo={false}
              strokeColor="#1677ff"
              size={isMobile ? 'small' : 'default'}
            />
          </div>
        </div>

        <Button type="text" icon={<ProfileOutlined />} onClick={onSubmit}>
          答题卡
        </Button>
      </div>
    </>
  );
};

export default ExamHeader;
