import React from 'react';
import { Layout, Grid, FloatButton, message } from 'antd';
import {
  ExamBottomBar,
  QuestionRenderer,
  ExamHeader,
  AnswerSheetModal,
} from './components';
import type { AnswerValue } from './components/Question.types';
import { examApi } from '@/services/api';
import type { ExamPaper, UserAnswer } from '@/services/types';
import NotFoundPage from '@/views/404';

import styles from './index.module.css';

// Question 类型已由组件导出

const formatSeconds = (s: number) => {
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
};

const ExamPaper: React.FC = () => {
  const screens = Grid.useBreakpoint(); // 判断是否为移动端
  const isMobile = !screens.md;

  // 先检查URL参数，避免页面闪烁
  const urlParams = new URLSearchParams(window.location.search);
  const paperId = urlParams.get('paperId');

  const [currentIndex, setCurrentIndex] = useState<number>(0); // 当前题目索引
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({}); // 用户作答记录
  const [leftSeconds, setLeftSeconds] = useState<number>(0); // 剩余时间
  const [listMode, setListMode] = useState<boolean>(false); // 列表模式
  const [listReturnIndex, setListReturnIndex] = useState<number | null>(null); // 列表返回索引
  const [sheetOpen, setSheetOpen] = useState<boolean>(false); // 答题卡弹窗
  const [paper, setPaper] = useState<ExamPaper | null>(null); // 试卷数据
  const [recordId, setRecordId] = useState<string | null>(null); // 考试记录ID
  const [loading, setLoading] = useState<boolean>(true); // 加载状态
  const initializedRef = useRef<boolean>(false); // 防止重复初始化

  const questions = useMemo(() => paper?.questions || [], [paper?.questions]); // 题目列表

  // 当前题目
  const currentQuestion = useMemo(
    () => questions[currentIndex],
    [questions, currentIndex]
  );
  // 进度文本
  const progressText = useMemo(() => {
    const cur = listMode ? questions.length : currentIndex + 1;
    return `${cur}/${questions.length}`;
  }, [currentIndex, questions.length, listMode]);
  // 进度百分比
  const progressPercent = useMemo(() => {
    const cur = listMode ? questions.length : currentIndex + 1;
    return Math.round((cur / questions.length) * 100);
  }, [currentIndex, questions.length, listMode]);

  // 初始化考试
  const initializeExam = useCallback(async () => {
    // 防止重复初始化
    if (initializedRef.current) return;
    initializedRef.current = true;

    try {
      setLoading(true);
      // 开始考试
      if (!paperId) {
        return (
          <NotFoundPage
            status="error"
            title="暂无试卷"
            subTitle="请检查试卷ID是否正确"
            showBackButton={false}
          />
        );
      }

      const startResponse = await examApi.startExam({ paperId: paperId! });

      setPaper(startResponse.paper);
      setRecordId(startResponse.recordId);
      setLeftSeconds(startResponse.paper.durationSec);

      message.success('考试开始！');
    } catch (error) {
      console.error('初始化考试失败:', error);
      message.error('初始化考试失败，请重试');
      React.navigate('/');
    } finally {
      setLoading(false);
    }
  }, [paperId]);

  // 提交试卷
  const handleSubmit = useCallback(
    async (auto: boolean = false) => {
      if (!paper || !recordId) return;

      if (!auto) {
        const ok = window.confirm('确认交卷吗？');
        if (!ok) return;
      }

      try {
        // 将答案转换为API格式
        const userAnswers: UserAnswer[] = Object.entries(answers).map(
          ([questionId, answer]) => ({
            questionId,
            answer,
            answeredAt: new Date().toISOString(),
          })
        );

        // 提交考试
        const submitResponse = await examApi.submitExam({
          recordId,
          answers: userAnswers,
        });

        message.success(
          `考试提交成功！得分：${submitResponse.score}/${submitResponse.totalScore}`
        );

        // 跳转到结果页面或首页
        React.navigate('/');
      } catch (error) {
        console.error('提交考试失败:', error);
        message.error('提交考试失败，请重试');
      }
    },
    [paper, recordId, answers]
  );

  // 初始化考试
  useEffect(() => {
    initializeExam();
  }, [initializeExam]);

  // 倒计时
  useEffect(() => {
    if (!paper || leftSeconds <= 0) return;

    const timer = setInterval(() => {
      setLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [handleSubmit, paper, leftSeconds]);

  // 选择答案
  const handleChoose = useCallback(
    async (qid: string, value: AnswerValue) => {
      setAnswers((prev) => ({ ...prev, [qid]: value }));

      // 自动提交答案到服务器（添加防抖）
      if (recordId) {
        try {
          await examApi.submitAnswer({
            recordId,
            questionId: qid,
            answer: value,
          });
        } catch (error) {
          console.error('提交答案失败:', error);
          // 不显示错误消息，避免干扰用户体验
        }
      }
    },
    [recordId]
  );

  // 跳转到指定题目
  const goto = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= questions.length) return;
      setCurrentIndex(idx);
    },
    [questions.length]
  );

  // 上一题
  const handlePrev = useCallback(() => {
    if (listMode) {
      setListMode(false);
      const backIdx = listReturnIndex ?? Math.max(questions.length - 1, 0);
      goto(backIdx);
      setListReturnIndex(null);
      return;
    }
    goto(currentIndex - 1);
  }, [currentIndex, goto, listMode, listReturnIndex, questions.length]);

  // 下一题
  const handleNext = useCallback(() => {
    if (listMode) {
      handleSubmit(false);
      return;
    }
    if (currentIndex === questions.length - 1) {
      setListReturnIndex(currentIndex);
      setListMode(true);
      // 回到顶部，便于浏览列表
      try {
        document
          .querySelector('#page1-center')
          ?.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        // 忽略滚动异常
      }
      return;
    }
    goto(currentIndex + 1);
  }, [currentIndex, goto, handleSubmit, listMode, questions.length]);

  // 加载状态
  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#fafafa',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', marginBottom: '16px' }}>
              正在加载考试...
            </div>
            <div>请稍候</div>
          </div>
        </div>
      </Layout>
    );
  }

  // 试卷不存在
  if (!paper) {
    return (
      <NotFoundPage
        status="error"
        title="试卷不存在"
        subTitle="请检查试卷ID是否正确"
        showBackButton={false}
      />
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          background: '#fafafa',
        }}
      >
        {/* 顶部操作区（sticky） */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 80,
            background: '#fff',
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
              title={paper.title}
              progressText={progressText}
              progressPercent={progressPercent}
              leftTimeText={formatSeconds(leftSeconds)}
              isMobile={isMobile}
              onSubmit={() => setSheetOpen(true)}
              onBack={() => {
                if (listMode) {
                  setListMode(false);
                  const backIdx =
                    listReturnIndex ?? Math.max(questions.length - 1, 0);
                  goto(backIdx);
                  setListReturnIndex(null);
                } else {
                  React.navigate('/');
                }
              }}
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
            {listMode ? (
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                {questions.map((q, idx) => (
                  <QuestionRenderer
                    key={q.id}
                    currentIndex={idx}
                    total={questions.length}
                    question={q}
                    value={answers[q.id]}
                    onChange={(val) => handleChoose(q.id, val)}
                  />
                ))}
              </div>
            ) : (
              <QuestionRenderer
                currentIndex={currentIndex}
                total={questions.length}
                question={currentQuestion}
                value={answers[currentQuestion.id]}
                onChange={(val) => handleChoose(currentQuestion.id, val)}
              />
            )}
          </div>
        </div>

        {/* 底部操作区（sticky） */}
        <div
          style={{
            background: '#fff',
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
              disablePrev={listMode ? false : currentIndex === 0}
              disableNext={false}
              onPrev={handlePrev}
              onNext={handleNext}
              nextText={
                listMode
                  ? '交卷'
                  : currentIndex === questions.length - 1
                    ? '下一步'
                    : '下一题'
              }
              hidePrev={listMode}
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
        highlightIndex={listMode ? undefined : currentIndex}
        onGoto={(idx) => {
          if (listMode) {
            setListMode(false);
            setListReturnIndex(null);
          }
          goto(idx);
        }}
        onBrowseAll={() => {
          setListReturnIndex(currentIndex);
          setListMode(true);
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

export default ExamPaper;
