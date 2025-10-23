import { Checkbox, Space, Card, Typography, Input } from 'antd';
const { TextArea } = Input;

// 选择题组件（统一处理单选和多选）
export const QuestionChoice = ({
  options,
  value,
  onChange,
  multiple = false, // 是否多选
}) => {
  // 统一处理value格式：单选转为数组，多选保持数组
  const normalizedValue = multiple
    ? Array.isArray(value)
      ? value
      : [value]
    : Array.isArray(value)
      ? value
      : [value];

  return (
    <Checkbox.Group
      value={normalizedValue}
      onChange={(val) => {
        if (multiple) {
          // 多选：直接返回数组
          onChange(val);
        } else {
          // 单选：只取最后一个选中的值
          onChange(val.length > 0 ? val[val.length - 1] : null);
        }
      }}
      style={{ width: '100%' }}
    >
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        {options.map((opt, idx) => {
          const label = String.fromCharCode(65 + idx);
          const checked = normalizedValue?.includes(label);
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

// 简答题组件（已移除，统一使用填空题）

// 填空题组件
export const QuestionFillBlank = ({ value, onChange }) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="请输入答案"
    />
  );
};
