import React from 'react';
import { Modal, Button, Typography, Row, Col } from 'antd';
import type { Question, AnswerValue } from './Question.types';

interface AnswerSheetModalProps {
  open: boolean;
  onClose: () => void;
  questions: Question[];
  answers: Record<string, AnswerValue>;
  highlightIndex?: number;
  onGoto: (index: number) => void;
  onBrowseAll: () => void;
}

/**
 * 答题卡弹窗组件
 * @param open 是否显示弹窗
 * @param onClose 关闭弹窗的回调
 * @param questions 题目列表
 * @param answers 用户作答记录，key 为题目 id
 * @param highlightIndex 当前高亮的题目索引（可选）
 * @param onGoto 跳转到指定题目的回调
 * @param onBrowseAll 整卷浏览回调
 */
const AnswerSheetModal: React.FC<AnswerSheetModalProps> = ({
  open,
  onClose,
  questions,
  answers,
  highlightIndex,
  onGoto,
  onBrowseAll,
}) => {
  const typeTextMap: Record<string, string> = {
    single: '单选题',
    boolean: '判断题',
    multiple: '多选题',
    blank: '填空题',
    text: '简答题',
  };

  const orderedTypes = ['single', 'boolean', 'multiple', 'blank', 'text'];

  const groups = orderedTypes
    .map((typeKey) => {
      const items = questions
        .map((q, idx) => ({ q, idx }))
        .filter(({ q }) => (q.type || 'single') === typeKey);
      return items.length
        ? { title: typeTextMap[typeKey] || typeKey, items }
        : null;
    })
    .filter(Boolean) as {
    title: string;
    items: { q: Question; idx: number }[];
  }[];

  /**
   * 渲染单个题号按钮
   */
  const renderItem = (q: Question, index: number) => {
    const value = answers[q.id];
    const answered = Array.isArray(value)
      ? value.length > 0
      : value !== undefined && value !== null && String(value).length > 0;
    const isCurrent = highlightIndex !== undefined && index === highlightIndex;

    const style = isCurrent
      ? undefined
      : answered
        ? { background: '#e6f4ff', borderColor: '#91caff', color: '#0958d9' }
        : undefined;

    return (
      <Col key={q.id} xs={6} sm={4} md={3} lg={3} style={{ marginBottom: 12 }}>
        <Button
          block
          type={isCurrent ? 'primary' : answered ? 'default' : 'dashed'}
          style={style}
          onClick={() => {
            onGoto(index);
            onClose();
          }}
        >
          {index + 1}
        </Button>
      </Col>
    );
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={
        <Button
          icon={null}
          type="link"
          onClick={() => {
            onClose();
            onBrowseAll();
          }}
        >
          整卷浏览
        </Button>
      }
      title="答题卡"
      centered
      width={560}
    >
      <div style={{ marginBottom: 8 }}>
        <Typography.Text type="secondary">点击题号可快速跳转</Typography.Text>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {groups.map((group) => (
          <div key={group.title}>
            <Typography.Text strong>{group.title}</Typography.Text>
            <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
              {group.items.map(({ q, idx }) => renderItem(q, idx))}
            </Row>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export { AnswerSheetModal };
