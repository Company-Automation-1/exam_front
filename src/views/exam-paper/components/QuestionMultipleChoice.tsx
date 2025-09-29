import React from 'react';
import { Card, Checkbox, Space, Typography } from 'antd';

interface QuestionMultipleChoiceProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

const QuestionMultipleChoice: React.FC<QuestionMultipleChoiceProps> = ({
  options,
  value,
  onChange,
}) => {
  return (
    <Checkbox.Group
      value={value}
      onChange={(val) => onChange(val as string[])}
      style={{ width: '100%' }}
    >
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        {options.map((opt, idx) => {
          const label = String.fromCharCode(65 + idx);
          const checked = value?.includes(label);
          return (
            <Card
              key={label}
              size="small"
              style={{
                borderColor: checked ? '#52c41a' : undefined,
                background: checked ? '#f6ffed' : undefined,
              }}
            >
              <Checkbox value={label}>
                <Space>
                  <Typography.Text strong>{label}.</Typography.Text>
                  <Typography.Text>{opt}</Typography.Text>
                </Space>
              </Checkbox>
            </Card>
          );
        })}
      </Space>
    </Checkbox.Group>
  );
};

export { QuestionMultipleChoice };
