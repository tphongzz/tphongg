import React, { useState } from 'react';
import { UserProfile, GrammarLesson } from '../../types';
import { initialGrammarLessons, grammarCategories } from '../../data/grammarData';
import { addXpToUser, saveUserProfile } from '../../services/storage';
import { trackWeakTopic } from '../../services/trackingService';
import { GrammarCheckerWidget } from '../writing/GrammarCheckerWidget';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { BookOpen, CheckCircle, Volume2, ArrowLeft, ArrowRight, HelpCircle, Sparkles, PenTool, Edit3 } from 'lucide-react';

interface GrammarViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export const GrammarView: React.FC<GrammarViewProps> = ({ user, onUpdateUser }) => {
  const [lessons, setLessons] = useState<GrammarLesson[]>(initialGrammarLessons);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'lessons' | 'writing'>('lessons');

  // Quiz state inside lesson view
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const filteredLessons = lessons.filter(
    (l) => selectedCategory === 'All' || l.category === selectedCategory
  );

  const activeLesson = lessons.find((l) => l.id === activeLessonId);

  const handlePlayAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectQuizOption = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null || !activeLesson) return;
    const currentQuiz = activeLesson.quizzes[currentQuizIndex];
    if (selectedOption === currentQuiz.correctAnswer) {
      setQuizScore((prev) => prev + 1);
    } else {
      trackWeakTopic(activeLesson.title);
    }
    setShowExplanation(true);
  };

  const handleNextQuiz = () => {
    if (!activeLesson) return;

    if (currentQuizIndex + 1 < activeLesson.quizzes.length) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Completed all quizzes for this lesson
      markLessonCompleted(activeLesson.id);
    }
  };

  const markLessonCompleted = (lessonId: string) => {
    const updatedLessons = lessons.map((l) => {
      if (l.id === lessonId && !l.completed) {
        // Award XP and update profile
        const updatedUser = {
          ...user,
          grammarCompleted: user.grammarCompleted + 1
        };
        saveUserProfile(updatedUser);
        onUpdateUser(addXpToUser(30));
        return { ...l, completed: true };
      }
      return l;
    });

    setLessons(updatedLessons);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header & Main Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BookOpen color="var(--accent-pink)" size={32} />
            Phân Hệ Ngữ Pháp Tương Tác &amp; Viết Văn AI
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Lý thuyết ngữ pháp A1-C1 &amp; Công cụ kiểm tra lỗi chính tả, ngữ pháp LanguageTool real-time.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.35rem', borderRadius: 'var(--radius-md)' }}>
          <button
            onClick={() => setActiveTab('lessons')}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'lessons' ? 'var(--accent-pink)' : 'transparent',
              color: activeTab === 'lessons' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600
            }}
          >
            📚 Bài Học Ngữ Pháp
          </button>

          <button
            onClick={() => setActiveTab('writing')}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'writing' ? 'var(--accent-cyan)' : 'transparent',
              color: activeTab === 'writing' ? '#000' : 'var(--text-secondary)',
              fontWeight: 600
            }}
          >
            ✍️ Kiểm Tra Ngữ Pháp Real-time
          </button>
        </div>
      </div>

      {/* Render Selected Tab */}
      {activeTab === 'writing' ? (
        <GrammarCheckerWidget saplingApiKey={user.saplingApiKey} />
      ) : activeLesson ? (
        /* LESSON DETAIL VIEW */
        <div>
          {/* Back button & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Button variant="secondary" size="sm" onClick={() => { setActiveLessonId(null); setCurrentQuizIndex(0); setSelectedOption(null); setShowExplanation(false); }}>
              <ArrowLeft size={18} style={{ marginRight: '0.35rem' }} /> Quay Lại Danh Sách
            </Button>
            <span className="badge" style={{ background: 'rgba(255, 122, 26, 0.2)', color: 'var(--accent-pink)' }}>
              {activeLesson.level} • {activeLesson.category}
            </span>
          </div>

          <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
              {activeLesson.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '2rem', fontStyle: 'italic' }}>
              {activeLesson.summary}
            </p>

            <div style={{ height: '1px', background: 'var(--glass-border)', marginBottom: '2rem' }} />

            {/* Markdown/Formatted Theory Explanation */}
            <div style={{ lineHeight: '1.8', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '2.5rem' }}>
              {activeLesson.explanationMarkdown.split('\n').map((line, idx) => {
                if (line.startsWith('### ')) {
                  return <h3 key={idx} style={{ color: 'var(--accent-pink)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{line.replace('### ', '')}</h3>;
                }
                if (line.startsWith('#### ')) {
                  return <h4 key={idx} style={{ color: 'var(--accent-cyan)', marginTop: '1rem', marginBottom: '0.5rem' }}>{line.replace('#### ', '')}</h4>;
                }
                if (line.startsWith('- ')) {
                  return <li key={idx} style={{ marginLeft: '1.5rem', marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>{line.replace('- ', '')}</li>;
                }
                if (line.trim().length > 0) {
                  return <p key={idx} style={{ marginBottom: '0.75rem' }}>{line}</p>;
                }
                return null;
              })}
            </div>

            {/* Examples Section */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-gold)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} /> Ví Dụ Minh Họa Bằng Mẫu Câu:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activeLesson.examples.map((ex, i) => (
                  <div key={i} className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-cyan)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>{ex.english}</span>
                      <button
                        onClick={() => handlePlayAudio(ex.english)}
                        style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.35rem', borderRadius: '50%', color: 'var(--accent-cyan)' }}
                      >
                        <Volume2 size={18} />
                      </button>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>&rarr; {ex.vietnamese}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Lesson Quiz */}
            {activeLesson.quizzes.length > 0 && (
              <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 122, 26, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--accent-pink)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <HelpCircle size={22} /> Bài Tập Củng Cố Ngữ Pháp ({currentQuizIndex + 1}/{activeLesson.quizzes.length})
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-green)' }}>+30 XP Khi Hoàn Thành</span>
                </div>

                <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                  {activeLesson.quizzes[currentQuizIndex].question}
                </div>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {activeLesson.quizzes[currentQuizIndex].options.map((optionText, optIdx) => {
                    const isSelected = selectedOption === optIdx;
                    const isCorrect = optIdx === activeLesson.quizzes[currentQuizIndex].correctAnswer;

                    let bg = 'rgba(255, 255, 255, 0.04)';
                    let border = '1px solid var(--glass-border)';

                    if (showExplanation) {
                      if (isCorrect) {
                        bg = 'rgba(0, 255, 136, 0.2)';
                        border = '1.5px solid var(--accent-green)';
                      } else if (isSelected && !isCorrect) {
                        bg = 'rgba(255, 0, 85, 0.2)';
                        border = '1.5px solid #ff0055';
                      }
                    } else if (isSelected) {
                      bg = 'rgba(59, 130, 246, 0.15)';
                      border = '1.5px solid var(--accent-cyan)';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectQuizOption(optIdx)}
                        disabled={showExplanation}
                        style={{
                          padding: '1rem',
                          borderRadius: 'var(--radius-md)',
                          background: bg,
                          border: border,
                          textAlign: 'left',
                          color: 'var(--text-primary)',
                          fontWeight: 500
                        }}
                      >
                        {optionText}
                      </button>
                    );
                  })}
                </div>

                {/* Answer Explanation */}
                {showExplanation && (
                  <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem', background: 'rgba(59, 130, 246, 0.08)' }}>
                    <strong style={{ color: 'var(--accent-cyan)' }}>💡 Giải thích: </strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{activeLesson.quizzes[currentQuizIndex].explanation}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {!showExplanation ? (
                    <Button variant="primary" onClick={handleConfirmAnswer} disabled={selectedOption === null}>
                      Xác Nhận Đáp Án
                    </Button>
                  ) : (
                    <Button variant="gradient" onClick={handleNextQuiz}>
                      {currentQuizIndex + 1 < activeLesson.quizzes.length ? 'Câu Tiếp Theo' : 'Hoàn Thành Bài Học'} <ArrowRight size={18} style={{ marginLeft: '0.35rem' }} />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* LESSON LIST VIEW */
        <div>
          {/* Category Filter */}
          <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {grammarCategories.map((cat: string) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  background: selectedCategory === cat ? 'var(--accent-pink)' : 'rgba(255,255,255,0.05)',
                  color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
                  fontWeight: selectedCategory === cat ? 700 : 500
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Lessons Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredLessons.map((lesson) => (
              <Card
                key={lesson.id}
                onClick={() => {
                  setActiveLessonId(lesson.id);
                  setCurrentQuizIndex(0);
                  setSelectedOption(null);
                  setShowExplanation(false);
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-cyan)' }}>
                    {lesson.level}
                  </span>
                  {lesson.completed ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-green)', fontSize: '0.8rem', fontWeight: 600 }}>
                      <CheckCircle size={16} /> Đã Hoàn Thành
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lesson.category}</span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                  {lesson.title}
                </h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                  {lesson.summary}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--glass-border)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>+30 XP Phần Thưởng</span>
                  <Button variant="secondary" size="sm">
                    Học Ngay &rarr;
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
