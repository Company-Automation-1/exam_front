import React from 'react';
import { HeaderBar } from '@/components/HeaderBar';
import { Typography, Progress, Space, Button, Tag } from 'antd';
import { ClockCircleOutlined, ProfileOutlined } from '@ant-design/icons';

/**
 * 考试头部组件
 * @param title 标题
 * @param progressText 进度文本
 * @param progressPercent 进度百分比
 * @param leftTimeText 剩余时间文本
 * @param isMobile 是否为移动端
 * @param onSubmit 提交回调
 * @param onBack 返回回调
 */
const ExamHeader = ({
  title,
  progressText,
  progressPercent,
  leftTimeText,
  isMobile,
  isPracticeMode = false,
  onSubmit,
  onBack,
}) => {
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
