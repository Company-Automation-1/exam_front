import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { examApi } from '@/api/exam';
import { Layout, Grid, FloatButton, message, Modal } from 'antd';
import ExamHeader from './components/ExamHeader';
import { ExamBottomBar } from './components/ExamBottomBar';
import { QuestionRenderer } from './components/QuestionRenderer';
import { AnswerSheetModal } from './components/AnswerSheetModal';
import styles from './index.module.css';

const Index = () => {
  const screens = Grid.useBreakpoint(); // 判断是否为移动端
  const isMobile = !screens.md;

  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const examId = searchParams.get('examId');
  const [loading, setLoading] = useState(false);

  // 考试数据状态存储
  const [examData, setExamData] = useState(null); // 试卷详情数据
  const [sessionData, setSessionData] = useState(null); // 考试会话数据
  const [questions, setQuestions] = useState([]); // 题目列表
  const [answers, setAnswers] = useState({}); // 作答缓存 { [questionId]: value }
  const [sheetOpen, setSheetOpen] = useState(false);
  // 当前题目索引（0开始）
  const [currentIndex, setCurrentIndex] = useState(0);
  // 倒计时（秒）
  const [leftSeconds, setLeftSeconds] = useState(null);
  const prevLeftRef = useRef(null);
  const countdownStartedRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchExamData = async () => {
      setLoading(true);

      try {
        // 1. 获取考试会话详情
        if (sessionId) {
          const sessionResponse = await examApi.getExamSession(sessionId);
          if (sessionResponse.success) {
            setSessionData(sessionResponse.data);
            // 从会话数据中获取试卷信息
            if (sessionResponse.data.exam) {
              setExamData(sessionResponse.data.exam);
            }
          }
        }

        // 2. 获取题目列表
        let questionsData = [];
        if (examId) {
          const questionsResponse = await examApi.getExamQuestions(examId);
          if (questionsResponse.success) {
            questionsData = questionsResponse.data || [];
            setQuestions(questionsData);
          }
        }

        // 3. 获取已保存的答案
        if (sessionId) {
          console.log('获取已保存答案，sessionId:', sessionId);
          const answersResponse = await examApi.getUserAnswers(sessionId);
          console.log('答案响应:', answersResponse);
          if (answersResponse.success) {
            console.log('原始答案数据:', answersResponse.data);
            // 恢复答案到本地状态
            const localAnswers = {};
            answersResponse.data.forEach((answer) => {
              console.log('处理答案:', answer);
              console.log(
                '答案questionId:',
                answer.questionId,
                '类型:',
                typeof answer.questionId
              );
              console.log('题目数据:', questionsData);
              if (answer.answerOptions?.selectedOptions) {
                // 直接使用原始答案，统一组件会处理格式
                localAnswers[answer.questionId] =
                  answer.answerOptions.selectedOptions;
                console.log(
                  '恢复答案:',
                  answer.questionId,
                  '答案:',
                  localAnswers[answer.questionId]
                );
              } else if (answer.content) {
                localAnswers[answer.questionId] = answer.content;
                console.log(
                  '恢复主观题答案:',
                  answer.questionId,
                  answer.content
                );
              }
            });
            console.log('恢复的本地答案:', localAnswers);
            setAnswers(localAnswers);
          }
        } else {
          console.log('sessionId 为空，跳过获取答案');
        }

        console.log('=== 考试页面数据获取完成 ===');
      } catch (error) {
        console.error('获取考试数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId && examId) {
      fetchExamData();
    } else {
      console.log('缺少必要参数: sessionId 或 examId');
    }
  }, [sessionId, examId]);

  // 清理调试：移除全量状态打印

  // 基于会话开始时间 + timeLimit 计算倒计时
  useEffect(() => {
    if (!sessionData?.startTime || !examData?.timeLimit) {
      setLeftSeconds(null);
      return;
    }
    const start = new Date(sessionData.startTime).getTime();
    const end = start + (examData.timeLimit || 0) * 60 * 1000;
    const tick = () => {
      const secs = Math.max(0, Math.floor((end - Date.now()) / 1000));
      setLeftSeconds(secs);
      if (!countdownStartedRef.current && secs !== null) {
        countdownStartedRef.current = true;
      }
      prevLeftRef.current = secs;
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [sessionData?.startTime, examData?.timeLimit]);

  // 保存答案到后端（实时提交）
  const saveAnswer = async (questionId, value, questionType) => {
    if (!sessionId || !questionId) return;

    try {
      let content = null;
      let answerOptions = null;

      // 根据题目类型处理答案
      if (
        questionType === 'single_choice' ||
        questionType === 'multiple_choice'
      ) {
        answerOptions = {
          selectedOptions: Array.isArray(value) ? value : [value],
        };
      } else {
        content = value;
      }

      console.log('保存答案数据:', {
        sessionId,
        questionId,
        content,
        answerOptions,
        questionType,
      });

      const response = await examApi.saveAnswer(
        sessionId,
        questionId,
        content,
        answerOptions
      );
      console.log('保存答案响应:', response);
    } catch (error) {
      console.error('保存答案失败:', error);
    }
  };

  // 处理答案变化（实时保存）
  const handleAnswerChange = (value) => {
    const questionId = questions[currentIndex]?.id;
    const questionType = questions[currentIndex]?.type;

    if (!questionId) return;

    // 更新本地答案状态
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // 实时保存到后端
    saveAnswer(questionId, value, questionType);
  };

  const totalQuestions = questions?.length ?? 0;
  const progressText = `${Math.min(currentIndex + 1, totalQuestions)}/${totalQuestions}`;

  const formatLeft = (secs) => {
    if (secs == null) return '计算中...';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0)
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // 交卷
  const submitExam = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      const timeSpent = (() => {
        if (leftSeconds != null && examData?.timeLimit) {
          const limit = examData.timeLimit * 60;
          return Math.max(0, limit - leftSeconds);
        }
        if (sessionData?.startTime) {
          return Math.max(
            0,
            Math.floor(
              (Date.now() - new Date(sessionData.startTime).getTime()) / 1000
            )
          );
        }
        return 0;
      })();

      // 调用完成考试接口
      const response = await examApi.completeExam(sessionId);

      if (response.success) {
        const { summary } = response.data;
        message.success(
          `考试完成！得分：${summary.userScore}/${summary.totalScore}，${summary.isPassed ? '通过' : '未通过'}`
        );
        window.location.href = '/exam';
      } else {
        message.error(response.message || '交卷失败，请重试');
      }
    } catch (err) {
      message.error('交卷失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmSubmit = () => {
    Modal.confirm({
      title: '确认交卷',
      content: '交卷后将无法继续作答，确认提交吗？',
      okText: '交卷',
      cancelText: '再检查一下',
      onOk: submitExam,
    });
  };

  // 倒计时到 0 自动交卷（避免进入页面就立即触发：需要从>0降到0）
  useEffect(() => {
    const prev = prevLeftRef.current;
    const hasStarted = countdownStartedRef.current;
    if (
      hasStarted &&
      examData?.timeLimit > 0 &&
      typeof prev === 'number' &&
      prev > 0 &&
      leftSeconds === 0
    ) {
      submitExam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftSeconds]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          // background: '#fafafa',
        }}
      >
        {/* 顶部操作区（sticky） */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 80,
            // background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              maxWidth: 960,
              margin: '0 auto',
              padding: isMobile ? '8px 8px' : '12px 12px',
            }}
          >
            <ExamHeader
              title={examData?.title}
              progressText={progressText}
              progressPercent={Math.round(
                ((currentIndex + 1) / (totalQuestions || 1)) * 100
              )}
              leftTimeText={formatLeft(leftSeconds)}
              isMobile={isMobile}
              onSubmit={() => setSheetOpen(true)}
              onBack={() => React.navigate('/exam')}
            />
          </div>
        </div>

        {/* 中部内容（撑满剩余高度，内部滚动） */}
        <div id="page1-center" style={{ flex: 1, overflow: 'auto' }}>
          <div
            style={{
              maxWidth: 960,
              margin: '12px auto',
              padding: isMobile ? '8px' : '12px',
            }}
          >
            {questions?.length > 0 && questions[currentIndex] && (
              <div data-question-index={currentIndex}>
                <QuestionRenderer
                  currentIndex={currentIndex}
                  total={totalQuestions}
                  question={questions[currentIndex]}
                  value={answers[questions[currentIndex]?.id]}
                  onChange={handleAnswerChange}
                />
              </div>
            )}
          </div>
        </div>

        {/* 底部操作区（sticky） */}
        <div
          style={{
            borderTop: '1px solid #f0f0f0',
            boxShadow: '0 -1px 2px rgba(0,0,0,0.04)',
            position: 'sticky',
            bottom: 0,
            zIndex: 90,
          }}
        >
          <div
            style={{
              maxWidth: 960,
              margin: '0 auto',
              padding: isMobile ? '8px 8px' : '12px 12px',
            }}
          >
            <ExamBottomBar
              isMobile={isMobile}
              disablePrev={currentIndex === 0}
              disableNext={questions?.length === 0}
              onPrev={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              onNext={() => {
                if (currentIndex + 1 >= totalQuestions) {
                  confirmSubmit();
                } else {
                  setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1));
                }
              }}
              isLast={currentIndex + 1 >= totalQuestions}
            />
          </div>
        </div>
      </div>

      {/* 答题卡弹窗 */}
      <AnswerSheetModal
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        questions={questions}
        answers={answers}
        highlightIndex={currentIndex}
        onGoto={(idx) => {
          setCurrentIndex(idx);
          setSheetOpen(false);
        }}
        onBrowseAll={() => {
          setSheetOpen(false);
        }}
      />

      {/* 回到顶部按钮 */}
      <FloatButton.BackTop
        visibilityHeight={400}
        className={styles.backtop}
        style={{ right: 16, bottom: 96, zIndex: 1000 }}
      />
    </Layout>
  );
};

export default Index;
