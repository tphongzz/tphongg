import React, { useState } from 'react';
import { ExamResult } from '../../types';
import { getExamByNumber } from '../../data/examEngine';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Trophy, ArrowLeft, CheckCircle, XCircle, BookOpen, BarChart2 } from 'lucide-react';

interface ExamReviewProps {
  result: ExamResult;
  onBack: () => void;
}

export const ExamReviewView: React.FC<ExamReviewProps> = ({ result, onBack }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'wrong' | 'correct'>('all');
  const exam = getExamByNumber(result.testNumber);

  if (!exam) return null;

  const filteredQuestions = exam.questions.filter((q) => {
    const userChoice = result.userAnswers[q.id];
    const isCorrect = userChoice === q.correctAnswer;
    if (activeFilter === 'wrong') return !isCorrect;
    if (activeFilter === 'correct') return isCorrect;
    return true;
  });

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Button variant="ghost" size="sm" onClick={onBack} style={{ alignSelf: 'flex-start' }}>
        <ArrowLeft size={16} style={{ marginRight: '0.4rem' }} /> Quay lại Danh sách 500 Bộ Đề
      </Button>

      {/* Result Score Summary Header */}
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(112, 0, 255, 0.15))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem'
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-cyan)' }}>
            KẾT QUẢ ĐỀ THI #{result.testNumber} (CẤP {result.level})
          </span>
          <h1 style={{ margin: '0.5rem 0 0.5rem 0', fontSize: '2rem' }}>{result.title}</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            Thời gian làm bài: {Math.round(result.timeSpentSeconds / 60)} phút | Hoàn thành lúc: {new Date(result.completedAt).toLocaleTimeString()}
          </p>
        </div>

        <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.4)', padding: '1.5rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
          <Trophy size={40} color="#FFB800" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {result.score} / 30
          </div>
          <span style={{ fontSize: '0.9rem', color: 'var(--accent-green)', fontWeight: 600 }}>Tỷ lệ đúng: {result.percentage}%</span>
        </div>
      </div>

      {/* 4 Skills Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <Card hoverable={false} style={{ padding: '1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>VOCABULARY</span>
          <h3 style={{ margin: '0.3rem 0 0 0', color: 'var(--accent-cyan)' }}>{result.skillScores.vocabulary} / 7</h3>
        </Card>
        <Card hoverable={false} style={{ padding: '1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GRAMMAR</span>
          <h3 style={{ margin: '0.3rem 0 0 0', color: 'var(--accent-purple)' }}>{result.skillScores.grammar} / 7</h3>
        </Card>
        <Card hoverable={false} style={{ padding: '1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>READING</span>
          <h3 style={{ margin: '0.3rem 0 0 0', color: 'var(--accent-green)' }}>{result.skillScores.reading} / 8</h3>
        </Card>
        <Card hoverable={false} style={{ padding: '1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LISTENING</span>
          <h3 style={{ margin: '0.3rem 0 0 0', color: '#FF007A' }}>{result.skillScores.listening} / 8</h3>
        </Card>
      </div>

      {/* Review Questions & Vietnamese Explanations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Chi Tiết 30 Câu Hỏi & Giải Thích Đáp Án</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant={activeFilter === 'all' ? 'primary' : 'secondary'} size="sm" onClick={() => setActiveFilter('all')}>
              Tất cả (30 câu)
            </Button>
            <Button variant={activeFilter === 'wrong' ? 'primary' : 'secondary'} size="sm" onClick={() => setActiveFilter('wrong')}>
              Câu sai
            </Button>
            <Button variant={activeFilter === 'correct' ? 'primary' : 'secondary'} size="sm" onClick={() => setActiveFilter('correct')}>
              Câu đúng
            </Button>
          </div>
        </div>

        {filteredQuestions.map((q, idx) => {
          const userChoice = result.userAnswers[q.id];
          const isCorrect = userChoice === q.correctAnswer;

          return (
            <Card key={q.id} hoverable={false} style={{ padding: '1.5rem', borderLeft: `4px solid ${isCorrect ? 'var(--accent-green)' : '#FF3333'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  CÂU HỎI [{q.skill.toUpperCase()}]
                </span>
                {isCorrect ? (
                  <span style={{ color: 'var(--accent-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle size={16} /> ĐÚNG (+1 Điểm)
                  </span>
                ) : (
                  <span style={{ color: '#FF3333', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <XCircle size={16} /> SAI
                  </span>
                )}
              </div>

              <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', lineHeight: 1.5 }}>{q.question}</h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                {q.options.map((opt, oIdx) => {
                  const isUserChosen = userChoice === oIdx;
                  const isRightAnswer = q.correctAnswer === oIdx;

                  let bgColor = 'rgba(255, 255, 255, 0.04)';
                  let borderColor = 'var(--glass-border)';
                  if (isRightAnswer) {
                    bgColor = 'rgba(0, 255, 102, 0.15)';
                    borderColor = 'var(--accent-green)';
                  } else if (isUserChosen && !isRightAnswer) {
                    bgColor = 'rgba(255, 51, 51, 0.15)';
                    borderColor = '#FF3333';
                  }

                  return (
                    <div
                      key={oIdx}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: bgColor,
                        border: `1px solid ${borderColor}`,
                        fontSize: '0.9rem',
                        color: isRightAnswer ? 'var(--accent-green)' : isUserChosen ? '#FF3333' : 'var(--text-secondary)'
                      }}
                    >
                      <strong>{String.fromCharCode(65 + oIdx)}.</strong> {opt}
                      {isRightAnswer && ' ✓ (Đáp án đúng)'}
                      {isUserChosen && !isRightAnswer && ' ✗ (Bạn chọn)'}
                    </div>
                  );
                })}
              </div>

              {/* Detailed Vietnamese Explanation Card */}
              <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.2)', marginTop: '1rem' }}>
                <strong style={{ color: 'var(--accent-cyan)', display: 'block', marginBottom: '0.4rem' }}>
                  💡 LỜI GIẢI & GIẢI THÍCH CHI TIẾT:
                </strong>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {q.explanation}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
