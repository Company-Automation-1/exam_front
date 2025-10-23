import React from 'react';
import { Row, Col, Button } from 'antd';

const ExamBottomBar = ({
  isMobile,
  disablePrev,
  disableNext,
  onPrev,
  onNext,
  nextText = '下一题',
  hidePrev = false,
  isLast = false, // 新增：是否为最后一题
}) => {
  console.log('🔄 ExamBottomBar 重新渲染');
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
          {isLast ? '交卷' : nextText}
        </Button>
      </Col>
    </Row>
  );
};

export { ExamBottomBar };
