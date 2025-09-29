import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { Link } from 'react-router-dom';
import { Layout, Grid, FloatButton } from 'antd';
import {
  ExamBottomBar,
  QuestionRenderer,
  ExamHeader,
  AnswerSheetModal,
} from './components';
import type { Question } from './components';
import type { AnswerValue } from './components/Question.types';

import styles from './index.module.css';

// Question 类型已由组件导出

interface Paper {
  paperId: string;
  title: string;
  durationSec: number;
  questions: Question[];
}

const demoPaper: Paper = {
  paperId: 'demo-1',
  title: '示例试卷',
  durationSec: 120,
  questions: [
    {
      id: 'q1',
      stem: '1. React 中用于描述 UI 的基本单位是？',
      options: ['Component', 'Service', 'Controller', 'Mixin'],
    },
    {
      id: 'q2',
      stem: '2. 以下哪项常用于管理路由？',
      options: ['redux', 'react-router', 'jotai', 'zustand'],
    },
    {
      id: 'q3',
      stem: '3. Vite 的主要优势是？',
      options: [
        '运行时编译',
        '基于 Webpack 构建',
        '更快的冷启动',
        '仅支持 Node 运行',
      ],
    },
    {
      id: 'q4',
      stem: '4. React 19 推荐的状态更新 API 是？',
      options: ['setState 回调', 'useState Hook', 'this.forceUpdate', 'MobX'],
    },
    {
      id: 'q5',
      stem: '5. 在 React Router 中用于声明式导航的组件是？',
      options: ['Link', 'NavigateFunction', 'Outlet', 'Switch'],
    },
    {
      id: 'q6',
      stem: '6. Ant Design 中用于栅格布局的组件组合是？',
      options: ['Grid + Item', 'Row + Col', 'Flex + Box', 'Layout + Header'],
    },
    {
      id: 'q7',
      stem: '7. TypeScript 中用于表示可选属性的语法是？',
      options: ['name?', 'name!', 'name*', 'name$'],
    },
    {
      id: 'q8',
      stem: '8. 以下哪项可以减少不必要的重新渲染？',
      options: [
        'useMemo/useCallback',
        '增加 key',
        '改用 any 类型',
        '启用 StrictMode',
      ],
    },
    {
      id: 'q9',
      type: 'multiple',
      stem: '9. 下列哪些属于 React 的 Hook？',
      options: ['useState', 'useFetch', 'useEffect', 'useAjax'],
    },
    {
      id: 'q10',
      type: 'blank',
      stem: '10. 请填写 Vite 的主要构建工具：',
      options: [],
    },
    {
      id: 'q11',
      type: 'text',
      stem: '11. 简述你对受控组件与非受控组件的理解。',
      options: [],
    },
  ],
};

const formatSeconds = (s: number) => {
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
};

const ExamPaper: React.FC = () => {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [leftSeconds, setLeftSeconds] = useState(demoPaper.durationSec);
  const [listMode, setListMode] = useState<boolean>(false);
  const [listReturnIndex, setListReturnIndex] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);

  const questions = demoPaper.questions;
  const currentQuestion = useMemo(
    () => questions[currentIndex],
    [questions, currentIndex]
  );
  const progressText = useMemo(() => {
    const cur = listMode ? questions.length : currentIndex + 1;
    return `${cur}/${questions.length}`;
  }, [currentIndex, questions.length, listMode]);
  const progressPercent = useMemo(() => {
    const cur = listMode ? questions.length : currentIndex + 1;
    return Math.round((cur / questions.length) * 100);
  }, [currentIndex, questions.length, listMode]);

  const handleSubmit = useCallback(
    (auto: boolean = false) => {
      if (!auto) {
        const ok = window.confirm('确认交卷吗？');
        if (!ok) return;
      }
      alert(
        `已提交！用时：${formatSeconds(demoPaper.durationSec - leftSeconds)}`
      );
    },
    [leftSeconds]
  );

  useEffect(() => {
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
  }, [handleSubmit]);

  const handleChoose = useCallback((qid: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  }, []);

  const goto = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= questions.length) return;
      setCurrentIndex(idx);
    },
    [questions.length]
  );

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
        {/* 顶部操作区（占自身高度，可 sticky） */}
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
              title={demoPaper.title}
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

        {/* 底部操作区（占自身高度，不 sticky） */}
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
      <FloatButton.BackTop
        visibilityHeight={400}
        className={styles.backtop}
        style={{ right: 16, bottom: 96, zIndex: 1000 }}
      />
    </Layout>
  );
};

export default ExamPaper;
