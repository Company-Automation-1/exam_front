import React from 'react';
import { Input } from 'antd';

interface QuestionFillBlankProps {
  value: string;
  onChange: (value: string) => void;
}

const QuestionFillBlank: React.FC<QuestionFillBlankProps> = ({
  value,
  onChange,
}) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="请输入答案"
    />
  );
};

export { QuestionFillBlank };
