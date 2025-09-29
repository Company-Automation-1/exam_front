import React from 'react';
import { Card, Radio, Space, Typography } from 'antd';

interface QuestionSingleChoiceProps {
  options: string[];
  value?: string;
  onChange: (value: string) => void;
}

const QuestionSingleChoice: React.FC<QuestionSingleChoiceProps> = ({
  options,
  value,
  onChange,
}) => {
  return (
    <Radio.Group
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: '100%' }}
    >
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        {options.map((opt, idx) => {
          const label = String.fromCharCode(65 + idx);
          const checked = value === label;
          return (
            <Card
              key={label}
              size="small"
              style={{
                borderColor: checked ? '#52c41a' : undefined,
                background: checked ? '#f6ffed' : undefined,
              }}
            >
              <Radio value={label}>
                <Space>
                  <Typography.Text strong>{label}.</Typography.Text>
                  <Typography.Text>{opt}</Typography.Text>
                </Space>
              </Radio>
            </Card>
          );
        })}
      </Space>
    </Radio.Group>
  );
};

export { QuestionSingleChoice };
