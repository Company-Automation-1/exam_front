import React from 'react';
import { Row, Col, Space, Typography, Divider } from 'antd';

interface QuestionHeaderProps {
  typeText: string;
  index: number;
  total: number;
  stem: string;
}

const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  typeText,
  index,
  total,
  stem,
}) => {
  return (
    <>
      <Row align="middle" justify="space-between" gutter={[8, 8]}>
        <Col>
          <Space size={8} align="baseline">
            <Typography.Text strong>{typeText}</Typography.Text>
            <Typography.Text type="secondary">
              第 {index + 1} 题
            </Typography.Text>
          </Space>
        </Col>
        <Col>
          <Typography.Text type="secondary">共 {total} 题</Typography.Text>
        </Col>
      </Row>
      <Divider style={{ margin: '12px 0' }} />
      <Typography.Paragraph
        style={{ fontWeight: 600, marginBottom: 12, lineHeight: 1.6 }}
      >
        {stem}
      </Typography.Paragraph>
    </>
  );
};

export { QuestionHeader };
