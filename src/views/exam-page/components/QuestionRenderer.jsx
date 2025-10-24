import React from 'react';
import { Card, Typography, Space, Tag } from 'antd';
import { QuestionChoice, QuestionFillBlank } from './Question';

// 将后端题型 code 映射为内部渲染类型
const mapBackendTypeToRenderType = (code) => {
  switch (code) {
    case 'choice':
      return 'choice';
    case 'fill_in':
      return 'fill_in';
    default:
      return code || 'choice';
  }
};

const typeTextMap = {
  choice: '选择题',
  fill_in: '填空题',
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
  // console.log('🔄 QuestionRenderer 重新渲染');
  if (!question) return null;

  // 适配后端字段：content -> stem；options 对象数组 -> 纯文案数组
  const backendTypeCode =
    question.questionType ||
    question.type ||
    question.typeCode ||
    question.code;
  const renderType = mapBackendTypeToRenderType(backendTypeCode);
  const stem = question.stem || question.content || '';
  const options = Array.isArray(question.options)
    ? question.options.map((opt) => opt?.content ?? opt?.label ?? opt)
    : [];

  let body = null;
  if (renderType === 'choice') {
    // 根据后端返回的 isMultipleChoice 字段判断单选/多选
    const isMultiple = question.isMultipleChoice || false;
    body = (
      <QuestionChoice
        options={options}
        value={value}
        onChange={onChange}
        multiple={isMultiple}
      />
    );
  } else if (renderType === 'fill_in') {
    body = (
      <QuestionFillBlank
        value={typeof value === 'string' ? value : ''}
        onChange={onChange}
      />
    );
  }

  // 根据题目类型和是否多选显示文案
  let typeText = '';
  if (renderType === 'choice') {
    const isMultiple = question.isMultipleChoice || false;

    // 智能识别判断题：只有2个选项且包含"正确"/"错误"
    const isTrueFalse =
      options.length === 2 &&
      options.some((opt) => opt.content === '正确' || opt.content === '错误');

    if (isTrueFalse) {
      typeText = '判断题';
    } else {
      typeText = isMultiple ? '多选题' : '单选题';
    }
  } else if (renderType === 'fill_in') {
    typeText = '填空题';
  } else {
    typeText = '题目';
  }

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
