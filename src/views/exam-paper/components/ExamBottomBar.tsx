import React from 'react';
import { Row, Col, Button } from 'antd';

interface ExamBottomBarProps {
  isMobile: boolean;
  disablePrev: boolean;
  disableNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  nextText?: string;
  hidePrev?: boolean;
}

const ExamBottomBar: React.FC<ExamBottomBarProps> = ({
  isMobile,
  disablePrev,
  disableNext,
  onPrev,
  onNext,
  nextText = '下一题',
  hidePrev = false,
}) => {
  return (
    <Row gutter={8} style={{ width: '100%', padding: '.9vh 0' }}>
      {!hidePrev && (
        <Col xs={7} md={7}>
          <Button
            size={isMobile ? 'large' : 'middle'}
            block
            disabled={disablePrev}
            onClick={onPrev}
          >
            上一题
          </Button>
        </Col>
      )}
      <Col xs={hidePrev ? 24 : 17} md={hidePrev ? 24 : 17}>
        <Button
          size={isMobile ? 'large' : 'middle'}
          type="primary"
          block
          disabled={disableNext}
          onClick={onNext}
        >
          {nextText}
        </Button>
      </Col>
    </Row>
  );
};

export { ExamBottomBar };
