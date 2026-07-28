import React, { useState, useEffect } from 'react';
import { ExamTest, ExamResult } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Clock, Volume2, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { playTtsSpeech } from '../../utils/speechUtils';

interface ExamTakingProps {
  test: ExamTest;
  onComplete: (result: ExamResult) => void;
  onCancel: () => void;
}

export const ExamTakingView: React.FC<ExamTakingProps> = ({ test, onComplete, onCancel }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(test.durationMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentQ = test.questions[currentIdx];

  const handleOptionSelect = (optionIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIdx
    }));
  };

  const handleSubmitTest = () => {
    let score = 0;
    const skillScores = { vocabulary: 0, grammar: 0, reading: 0, listening: 0 };

    test.questions.forEach((q) => {
      const chosen = userAnswers[q.id];
      if (chosen === q.correctAnswer) {
        score++;
        skillScores[q.skill]++;
      }
    });

    const percentage = Math.round((score / test.totalQuestions) * 100);

    onComplete({
      testId: test.id,
      testNumber: test.testNumber,
      title: test.title,
      level: test.level,
      score: score,
      percentage: percentage,
      completedAt: new Date().toISOString(),
      timeSpentSeconds: test.durationMinutes * 60 - timeLeft,
      skillScores: skillScores,
      userAnswers: userAnswers
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--accent-cyan)' }}>{test.title}</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Câu {currentIdx + 1} / {test.totalQuestions} ({currentQ.skill.toUpperCase()})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: timeLeft < 300 ? '#FF3333' : 'var(--accent-cyan)', fontWeight: 700, fontSize: '1.1rem' }}>
            <Clock size={20} /> {formatTime(timeLeft)}
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Hủy bài làm
          </Button>
        </div>
      </div>

      {/* Main Question Card */}
      <Card hoverable={false} style={{ padding: '2rem' }}>
        {/* Reading Passage Card if reading skill */}
        {currentQ.readingPassage && (
          <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--accent-cyan)', background: 'rgba(59, 130, 246, 0.05)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-cyan)' }}>{currentQ.readingPassage.title}</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              {currentQ.readingPassage.content}
            </p>
          </div>
        )}

        {/* Listening Audio Button if listening skill */}
        {currentQ.audioText && (
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(112, 0, 255, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(112, 0, 255, 0.3)' }}>
            <Button variant="primary" onClick={() => playTtsSpeech(currentQ.audioText!, 'en-US')}>
              <Volume2 size={20} style={{ marginRight: '0.4rem' }} /> PHÁT ÂM BẢN NGỮ (AUDIO)
            </Button>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Bấm loa để nghe bài nghe 🎧</span>
          </div>
        )}

        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          {currentQ.question}
        </h3>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {currentQ.options.map((opt, idx) => {
            const isSelected = userAnswers[currentQ.id] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--glass-border)',
                  color: isSelected ? 'var(--accent-cyan)' : 'var(--text-primary)',
                  textAlign: 'left',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: isSelected ? 600 : 400
                }}
              >
                <strong>{String.fromCharCode(65 + idx)}.</strong> {opt}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Navigation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="secondary" onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))} disabled={currentIdx === 0}>
          <ArrowLeft size={16} style={{ marginRight: '0.4rem' }} /> Câu trước
        </Button>

        {currentIdx + 1 === test.totalQuestions ? (
          <Button variant="primary" size="lg" onClick={handleSubmitTest} style={{ background: 'linear-gradient(135deg, var(--accent-green), #000)' }}>
            NỘP BÀI THI <CheckCircle size={18} style={{ marginLeft: '0.4rem' }} />
          </Button>
        ) : (
          <Button variant="primary" onClick={() => setCurrentIdx(prev => Math.min(test.totalQuestions - 1, prev + 1))}>
            Câu tiếp theo <ArrowRight size={16} style={{ marginLeft: '0.4rem' }} />
          </Button>
        )}
      </div>
    </div>
  );
};
