import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  // Avatar,
  Tag,
  Button,
  Typography,
  Row,
  Col,
  Statistic,
  Tooltip,
  Empty,
  Spin,
  message,
  Alert,
} from 'antd';
import {
  ClockCircleOutlined,
  // UserOutlined,
  TrophyOutlined,
  BookOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { examApi } from '@/api/exam';

const { Title, Text, Paragraph } = Typography;

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [examStatistics, setExamStatistics] = useState({});
  const pageSize = 12;

  // 获取试卷列表
  const fetchExams = async (page = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await examApi.getExams({
        current: page,
        pageSize,
        status: 'published', // 只获取已发布的试卷
      });

      if (response.success) {
        const newExams = response.data.items || [];
        const total = response.data.pagination.total;

        if (isLoadMore) {
          setExams((prev) => [...prev, ...newExams]);
        } else {
          setExams(newExams);
        }

        setCurrentPage(page);
        setHasMore(exams.length + newExams.length < total);

        // 获取每个试卷的统计信息
        if (!isLoadMore) {
          fetchExamStatistics(newExams);
        }
      } else {
        message.error(response.message || '获取试卷列表失败');
        if (!isLoadMore) {
          setExams([]);
        }
      }
    } catch (error) {
      console.error('获取试卷列表失败:', error);
      message.error('获取试卷列表失败');
      if (!isLoadMore) {
        setExams([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 获取考试统计信息
  const fetchExamStatistics = async (examsList) => {
    const statisticsPromises = examsList.map(async (exam) => {
      try {
        const response = await examApi.getExamStatistics(exam.id);
        if (response.success) {
          return { examId: exam.id, statistics: response.data };
        }
        return { examId: exam.id, statistics: null };
      } catch (error) {
        console.error(`获取试卷 ${exam.id} 统计失败:`, error);
        return { examId: exam.id, statistics: null };
      }
    });

    const results = await Promise.all(statisticsPromises);
    const newStatistics = {};
    results.forEach(({ examId, statistics }) => {
      if (statistics) {
        newStatistics[examId] = statistics;
      }
    });

    setExamStatistics((prev) => ({ ...prev, ...newStatistics }));
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // 加载更多
  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchExams(currentPage + 1, true);
    }
  };

  // 开始考试
  const handleStartExam = async (exam) => {
    // 检查考试时间
    const now = dayjs();
    const startTime = exam.startTime ? dayjs(exam.startTime) : null;
    const endTime = exam.endTime ? dayjs(exam.endTime) : null;

    if (startTime && now.isBefore(startTime)) {
      message.warning(
        `考试尚未开始，开始时间：${startTime.format('YYYY-MM-DD HH:mm')}`
      );
      return;
    }

    if (endTime && now.isAfter(endTime)) {
      message.warning(
        `考试已结束，结束时间：${endTime.format('YYYY-MM-DD HH:mm')}`
      );
      return;
    }

    try {
      // 1. 先请求摄像头权限
      message.loading('正在请求摄像头权限...', 0);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 1280,
          height: 720,
          frameRate: 30,
        },
        audio: true,
      });

      // 权限获取成功，关闭测试流
      stream.getTracks().forEach((track) => track.stop());

      message.destroy();
      message.loading('正在创建考试会话...', 0);

      // 2. 获取用户信息
      const userAgent = navigator.userAgent;
      const deviceInfo = {
        platform: navigator.platform,
        language: navigator.language,
        screen: {
          width: window.screen.width,
          height: window.screen.height,
        },
      };

      // 3. 创建考试会话
      const response = await examApi.startExam(exam.id, {
        userAgent,
        deviceInfo,
      });

      if (response.success) {
        message.destroy();
        message.success(`开始考试: ${exam.title}`);
        // 跳转到考试页面
        React.navigate(
          `/exam-page?session=${response.data.id}&examId=${exam.id}`
        );
      } else {
        message.destroy();
        message.error(response.message || '开始考试失败');
      }
    } catch (error) {
      message.destroy();
      console.error('开始考试失败:', error);

      // 判断是否为摄像头权限错误
      if (
        error.name === 'NotAllowedError' ||
        error.name === 'PermissionDeniedError'
      ) {
        Modal.warning({
          title: '需要摄像头权限',
          content: '考试需要开启摄像头进行监控，请授权后重试。',
          okText: '我知道了',
        });
        return;
      }

      // 其他错误
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('开始考试失败，请稍后重试');
      }
    }
  };

  // 获取考试状态
  const getExamStatus = (exam) => {
    const now = dayjs();
    const startTime = exam.startTime ? dayjs(exam.startTime) : null;
    const endTime = exam.endTime ? dayjs(exam.endTime) : null;

    if (startTime && now.isBefore(startTime)) {
      return { type: 'warning', text: '未开始', icon: <CalendarOutlined /> };
    }

    if (endTime && now.isAfter(endTime)) {
      return {
        type: 'error',
        text: '已结束',
        icon: <ExclamationCircleOutlined />,
      };
    }

    return { type: 'success', text: '进行中', icon: <CheckCircleOutlined /> };
  };

  // 格式化时间
  const formatTime = (time) => {
    if (!time) return '无限制';
    return dayjs(time).format('YYYY-MM-DD HH:mm');
  };

  // 格式化时长
  const formatDuration = (minutes) => {
    if (!minutes) return '无限制';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <BookOutlined style={{ marginRight: '8px' }} />
          在线考试
        </Title>
        <Text type="secondary">选择您要参加的考试</Text>
      </div>

      {/* 试卷列表 */}
      <Spin spinning={loading}>
        {exams.length === 0 ? (
          <Empty description="暂无可用考试" />
        ) : (
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 2,
              lg: 2,
              xl: 3,
              xxl: 3,
            }}
            dataSource={exams}
            loadMore={
              hasMore ? (
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <Button
                    onClick={loadMore}
                    loading={loadingMore}
                    type="primary"
                    ghost
                  >
                    {loadingMore ? '加载中...' : '加载更多'}
                  </Button>
                </div>
              ) : (
                <div
                  style={{ textAlign: 'center', marginTop: 16, color: '#999' }}
                >
                  没有更多数据了
                </div>
              )
            }
            renderItem={(exam) => {
              const examStatus = getExamStatus(exam);
              const canStart = examStatus.type === 'success';

              return (
                <List.Item>
                  <Card
                    hoverable
                    style={{ height: '100%' }}
                    actions={[
                      <Tooltip
                        title={canStart ? '开始考试' : '考试未开始或已结束'}
                      >
                        <Button
                          type="primary"
                          icon={<PlayCircleOutlined />}
                          onClick={() => handleStartExam(exam)}
                          disabled={!canStart}
                          size="large"
                        >
                          {canStart ? '开始考试' : examStatus.text}
                        </Button>
                      </Tooltip>,
                    ]}
                  >
                    <Card.Meta
                      // avatar={<Avatar icon={<UserOutlined />} size="large" />}
                      title={
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Title
                            level={4}
                            style={{ margin: 0, fontSize: '16px' }}
                          >
                            {exam.title}
                          </Title>
                          <Tag color={examStatus.type} icon={examStatus.icon}>
                            {examStatus.text}
                          </Tag>
                        </div>
                      }
                      description={
                        <div>
                          <Paragraph
                            ellipsis={{
                              rows: 1,
                              expandable: false,
                            }}
                            style={{ marginBottom: '12px' }}
                            title={exam.description}
                          >
                            {exam.description}
                          </Paragraph>

                          {/* 考试基本信息 */}
                          <Row gutter={[8, 8]} style={{ marginBottom: '12px' }}>
                            <Col span={12}>
                              <Text type="secondary">
                                <ClockCircleOutlined
                                  style={{ marginRight: '4px' }}
                                />
                                时长: {formatDuration(exam.timeLimit)}
                              </Text>
                            </Col>
                            <Col span={12}>
                              <Text type="secondary">
                                <BookOutlined style={{ marginRight: '4px' }} />
                                题目: {exam.questionCount}题
                              </Text>
                            </Col>
                            <Col span={12}>
                              <Text type="secondary">
                                <TrophyOutlined
                                  style={{ marginRight: '4px' }}
                                />
                                总分: {exam.totalScore}分
                              </Text>
                            </Col>
                            <Col span={12}>
                              <Text type="secondary">
                                及格: {exam.passScore}分
                              </Text>
                            </Col>
                          </Row>

                          {/* 考试统计信息 */}
                          {examStatistics[exam.id] && (
                            <Row
                              gutter={[8, 8]}
                              style={{ marginBottom: '12px' }}
                            >
                              <Col span={8}>
                                <Statistic
                                  title="参与人数"
                                  value={
                                    examStatistics[exam.id].totalAttempts || 0
                                  }
                                  prefix={<TeamOutlined />}
                                  valueStyle={{ fontSize: '14px' }}
                                />
                              </Col>
                              <Col span={8}>
                                <Statistic
                                  title="平均分"
                                  value={
                                    examStatistics[exam.id].averageScore || 0
                                  }
                                  suffix="分"
                                  valueStyle={{ fontSize: '14px' }}
                                />
                              </Col>
                              <Col span={8}>
                                <Statistic
                                  title="通过率"
                                  value={examStatistics[exam.id].passRate || 0}
                                  suffix="%"
                                  valueStyle={{ fontSize: '14px' }}
                                />
                              </Col>
                            </Row>
                          )}

                          {/* 时间信息 */}
                          <div
                            style={{
                              marginTop: '12px',
                              fontSize: '12px',
                              color: '#999',
                            }}
                          >
                            <div
                              style={{
                                padding: '0 8px',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                              }}
                            >
                              <Text type="secondary" style={{ flex: 1 }}>
                                <CalendarOutlined
                                  style={{ marginRight: '4px' }}
                                />
                                开始: {formatTime(exam.startTime) || '无限制'}
                              </Text>
                              <Text type="secondary" style={{ flex: 1 }}>
                                结束: {formatTime(exam.endTime) || '无限制'}
                              </Text>
                            </div>
                          </div>

                          {/* 考试进度提示 */}
                          {examStatus.type === 'success' && (
                            <Alert
                              message="考试正在进行中，可以开始答题"
                              type="success"
                              showIcon
                              style={{ marginTop: '12px' }}
                            />
                          )}

                          {examStatus.type === 'warning' && exam.startTime && (
                            <Alert
                              message={`考试将于 ${formatTime(exam.startTime)} 开始`}
                              type="warning"
                              showIcon
                              style={{ marginTop: '12px' }}
                            />
                          )}

                          {examStatus.type === 'error' && exam.endTime && (
                            <Alert
                              message={`考试已于 ${formatTime(exam.endTime)} 结束`}
                              type="error"
                              showIcon
                              style={{ marginTop: '12px' }}
                            />
                          )}
                        </div>
                      }
                    />
                  </Card>
                </List.Item>
              );
            }}
          />
        )}
      </Spin>
    </div>
  );
};

export default ExamList;
