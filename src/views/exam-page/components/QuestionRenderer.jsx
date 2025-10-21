import React from 'react';
import { Card, Typography, Space, Tag } from 'antd';
import {
  QuestionChoice,
  QuestionFillBlank,
  QuestionTextAnswer,
} from './Question';

// 将后端题型 code 映射为内部渲染类型
const mapBackendTypeToRenderType = (code) => {
  switch (code) {
    case 'single_choice':
    case 'true_false':
      return 'single';
    case 'multiple_choice':
      return 'multiple';
    case 'fill_blank':
      return 'blank';
    case 'short_answer':
    case 'essay':
      return 'text';
    default:
      return code || 'single';
  }
};

const typeTextMap = {
  single_choice: '单选题',
  true_false: '判断题',
  multiple_choice: '多选题',
  fill_blank: '填空题',
  short_answer: '简答题',
  essay: '论述题',
};

/**
 * 题目渲染组件
 */
const QuestionRenderer = ({
  currentIndex,
  total,
  question,
  value,
  onChange,
}) => {
  if (!question) return null;

  // 适配后端字段：content -> stem；options 对象数组 -> 纯文案数组
  const backendTypeCode = question.type || question.typeCode || question.code;
  const renderType = mapBackendTypeToRenderType(backendTypeCode);
  const stem = question.stem || question.content || '';
  const options = Array.isArray(question.options)
    ? question.options.map((opt) => opt?.content ?? opt?.label ?? opt)
    : [];

  let body = null;
  if (renderType === 'single' || renderType === 'multiple') {
    body = (
      <QuestionChoice
        options={options}
        value={value}
        onChange={onChange}
        multiple={renderType === 'multiple'}
      />
    );
  } else if (renderType === 'blank') {
    body = (
      <QuestionFillBlank
        value={typeof value === 'string' ? value : ''}
        onChange={onChange}
      />
    );
  } else if (renderType === 'text') {
    body = (
      <QuestionTextAnswer
        value={typeof value === 'string' ? value : ''}
        onChange={onChange}
      />
    );
  }

  // 文案优先使用后端code映射，否则回退到内部类型
  const typeText =
    typeTextMap[backendTypeCode] ||
    { single: '单选题', multiple: '多选题', blank: '填空题', text: '简答题' }[
      renderType
    ];

  return (
    <Card>
      <div style={{ marginBottom: 12 }}>
        <Space align="center" size={8} wrap>
          <Tag color="blue">{typeText || '题目'}</Tag>
          <Typography.Text type="secondary">{`${(currentIndex ?? 0) + 1} / ${total ?? 0}`}</Typography.Text>
        </Space>
        <Typography.Paragraph style={{ marginTop: 8 }}>
          {stem}
        </Typography.Paragraph>
      </div>
      {body}
    </Card>
  );
};

export { QuestionRenderer };
