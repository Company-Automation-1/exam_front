import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { examApi } from '@/api/exam';
import { Layout, Grid, FloatButton, message, Modal } from 'antd';
import ExamHeader from './components/ExamHeader';
import { ExamBottomBar } from './components/ExamBottomBar';
import { QuestionRenderer } from './components/QuestionRenderer';
import { AnswerSheetModal } from './components/AnswerSheetModal';
import VideoRecorder from '@/utils/VideoRecorder';
import styles from './index.module.css';

const Index = () => {
  // console.log('🔄 主页面重新渲染');
  const screens = Grid.useBreakpoint(); // 判断是否为移动端
  const isMobile = !screens.md;

  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const examId = searchParams.get('examId');
  const [_loading, setLoading] = useState(false);

  // 考试数据状态存储
  const [examData, setExamData] = useState(null); // 试卷详情数据
  const [sessionData, setSessionData] = useState(null); // 考试会话数据
  const [questions, setQuestions] = useState([]); // 题目列表
  const [answers, setAnswers] = useState({}); // 作答缓存 { [questionId]: value }
  const [sheetOpen, setSheetOpen] = useState(false);
  // 当前题目索引（0开始）
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // 视频录制器
  const videoRecorder = useRef(new VideoRecorder());

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
          const answersResponse = await examApi.getUserAnswers(sessionId);
          if (answersResponse.success) {
            // 恢复答案到本地状态
            const localAnswers = {};
            answersResponse.data.forEach((answer) => {
              if (answer.answerOptions?.selectedOptions) {
                // 选择题：使用 selectedOptions
                localAnswers[answer.questionId] =
                  answer.answerOptions.selectedOptions;
              } else if (answer.content) {
                // 填空题：使用 content
                localAnswers[answer.questionId] = answer.content;
              }
            });
            setAnswers(localAnswers);
          }
        }

        // 4. 开始录制第一段视频
        if (questionsData.length > 0 && sessionId) {
          await videoRecorder.current.startFirstSegment(
            sessionId,
            questionsData[0].id,
            0
          );
        }
      } catch (error) {
        console.error('获取考试数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId && examId) {
      fetchExamData();
    }

    // 组件卸载时停止录制
    return () => {
      if (videoRecorder.current) {
        videoRecorder.current.stopRecording();
      }
    };
  }, [sessionId, examId]);

  // 清理调试：移除全量状态打印

  // 保存答案到后端（实时提交）
  const saveAnswer = async (questionId, value, questionType) => {
    if (!sessionId || !questionId) return;

    try {
      let content = null;
      let answerOptions = null;

      // 根据题目类型处理答案
      if (questionType === 'choice') {
        // 选择题：使用 answerOptions
        answerOptions = {
          selectedOptions: Array.isArray(value) ? value : [value],
        };
      } else if (questionType === 'fill_in') {
        // 填空题：使用 content
        content = value;
      }

      const response = await examApi.saveAnswer(
        sessionId,
        questionId,
        content,
        answerOptions
      );
    } catch (error) {
      console.error('保存答案失败:', error);
    }
  };

  // 处理答案变化（实时保存）
  const handleAnswerChange = (value) => {
    const questionId = questions[currentIndex]?.id;
    const questionType = questions[currentIndex]?.questionType;

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

  // 处理题目切换
  const handleQuestionChange = async (newIndex) => {
    if (newIndex < 0 || newIndex >= totalQuestions) return;

    // 切换录制
    await videoRecorder.current.switchSegment(questions[newIndex].id, newIndex);

    setCurrentIndex(newIndex);
  };

  // 交卷
  const submitExam = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);

      // 停止录制
      await videoRecorder.current.stopRecording();

      (() => {
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
              sessionData={sessionData}
              examData={examData}
              isMobile={isMobile}
              onSubmit={() => setSheetOpen(true)}
              onBack={() => React.navigate('/exam')}
              onTimeUp={submitExam}
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
              onPrev={() => handleQuestionChange(currentIndex - 1)}
              onNext={() => {
                if (currentIndex + 1 >= totalQuestions) {
                  confirmSubmit();
                } else {
                  handleQuestionChange(currentIndex + 1);
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
          handleQuestionChange(idx);
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
