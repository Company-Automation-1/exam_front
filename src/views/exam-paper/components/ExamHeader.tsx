import React from 'react';
import { HeaderBar } from '@/views/components/HeaderBar';
import { Typography, Progress, Space, Button } from 'antd';
import { ClockCircleOutlined, ProfileOutlined } from '@ant-design/icons';

interface ExamHeaderProps {
  title: string;
  progressText: string;
  progressPercent: number;
  leftTimeText: string;
  isMobile: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

const ExamHeader: React.FC<ExamHeaderProps> = ({
  title,
  progressText,
  progressPercent,
  leftTimeText,
  isMobile,
  onSubmit,
  onBack,
}) => {
  return (
    <>
      <HeaderBar
        title={title}
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

export { ExamHeader };
