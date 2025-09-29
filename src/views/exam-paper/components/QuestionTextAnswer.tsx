import React from 'react';
import { Input } from 'antd';

interface QuestionTextAnswerProps {
  value: string;
  onChange: (value: string) => void;
}

const { TextArea } = Input;

const QuestionTextAnswer: React.FC<QuestionTextAnswerProps> = ({
  value,
  onChange,
}) => {
  return (
    <TextArea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="请输入答案（简答）"
      autoSize={{ minRows: 3, maxRows: 8 }}
    />
  );
};

export { QuestionTextAnswer };
