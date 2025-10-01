import React from 'react';
import { QuestionHeader } from './QuestionHeader';
import { QuestionSingleChoice } from './QuestionSingleChoice';
import { QuestionMultipleChoice } from './QuestionMultipleChoice';
import { QuestionFillBlank } from './QuestionFillBlank';
import { QuestionTextAnswer } from './QuestionTextAnswer';
import type { Question, QuestionType, AnswerValue } from './Question.types';
import { Card } from 'antd';

interface QuestionRendererProps {
  currentIndex: number;
  total: number;
  question: Question;
  value?: AnswerValue;
  onChange: (value: AnswerValue) => void;
}

/**
 * 题目渲染组件
 * @param currentIndex 当前题目索引
 * @param total 总题目数
 * @param question 题目
 * @param value 用户作答值
 * @param onChange 用户作答值改变回调
 */
const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  currentIndex,
  total,
  question,
  value,
  onChange,
}) => {
  const type: QuestionType = question.type || 'single';
  let body: React.ReactNode = null;
  if (type === 'single' || type === 'boolean') {
    body = (
      <QuestionSingleChoice
        options={question.options || []}
        value={typeof value === 'string' ? value : undefined}
        onChange={onChange}
      />
    );
  } else if (type === 'multiple') {
    body = (
      <QuestionMultipleChoice
        options={question.options || []}
        value={Array.isArray(value) ? value : []}
        onChange={onChange}
      />
    );
  } else if (type === 'blank') {
    body = (
      <QuestionFillBlank
        value={typeof value === 'string' ? value : ''}
        onChange={onChange}
      />
    );
  } else if (type === 'text') {
    body = (
      <QuestionTextAnswer
        value={typeof value === 'string' ? value : ''}
        onChange={onChange}
      />
    );
  }

  const typeTextMap: Record<string, string> = {
    single: '单选题',
    boolean: '判断题',
    multiple: '多选题',
    blank: '填空题',
    text: '简答题',
  };

  return (
    <Card>
      <QuestionHeader
        typeText={typeTextMap[type]}
        index={currentIndex}
        total={total}
        stem={question.stem}
      />
      {body}
    </Card>
  );
};

export { QuestionRenderer };
