import React, { useState } from 'react';
import { UserProfile, CEFRLevel, ExamTest, ExamResult } from '../../types';
import { getExamsBank, getExamByNumber, getExamsByLevel } from '../../data/examEngine';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  FileText,
  Search,
  Filter,
  CheckCircle,
  Clock,
  BookOpen,
  Award,
  ArrowRight,
  BarChart2,
  Sparkles,
  Volume2
} from 'lucide-react';
import { ExamTakingView } from './ExamTakingView';
import { ExamReviewView } from './ExamReviewView';

interface ExamCenterViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export const ExamCenterView: React.FC<ExamCenterViewProps> = ({ user, onUpdateUser }) => {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTest, setActiveTest] = useState<ExamTest | null>(null);
  const [reviewResult, setReviewResult] = useState<ExamResult | null>(null);

  const allExams = getExamsBank();

  // Filter exams
  const filteredExams = allExams.filter((exam) => {
    const matchesLevel = selectedLevel === 'ALL' || exam.level === selectedLevel;
    const matchesSearch =
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `đề ${exam.testNumber}`.includes(searchQuery.toLowerCase()) ||
      `exam ${exam.testNumber}`.includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleStartExam = (test: ExamTest) => {
    setReviewResult(null);
    setActiveTest(test);
  };

  const handleCompleteExam = (result: ExamResult) => {
    const earnedXp = Math.round(result.score * 3.5); // Up to +105 XP per test
    if (earnedXp > 0) {
      onUpdateUser({
        ...user,
        xp: user.xp + earnedXp
      });
    }
    setActiveTest(null);
    setReviewResult(result);
  };

  if (activeTest) {
    return (
      <ExamTakingView
        test={activeTest}
        onComplete={handleCompleteExam}
        onCancel={() => setActiveTest(null)}
      />
    );
  }

  if (reviewResult) {
    return (
      <ExamReviewView
        result={reviewResult}
        onBack={() => setReviewResult(null)}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2.2rem',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(112, 0, 255, 0.15))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Award size={36} color="var(--accent-cyan)" />
            <h1 style={{ margin: 0, fontSize: '2rem', background: 'linear-gradient(135deg, #3b82f6, #7000FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Ngân Hàng 500+ Bộ Đề Thi Phân Cấp
            </h1>
          </div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', maxWidth: '700px', fontSize: '0.95rem' }}>
            Kho bộ đề đồ sộ 500 đề thi phân loại theo cấp độ (A1 → C2). Mỗi đề thi gồm <strong>đúng 30 câu hỏi</strong> đánh giá toàn diện 4 kỹ năng (<strong>Vocabulary, Grammar, Reading, Listening</strong>) kèm <strong>giải thích đáp án chi tiết bằng Tiếng Việt</strong>!
          </p>
        </div>

        <Card hoverable={false} style={{ padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <BookOpen size={32} color="#3b82f6" />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TỔNG SỐ ĐỀ THI</span>
            <strong style={{ fontSize: '1.4rem', color: '#3b82f6', display: 'block' }}>500 BỘ ĐỀ</strong>
          </div>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Level Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const).map((lvl) => (
            <Button
              key={lvl}
              variant={selectedLevel === lvl ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedLevel(lvl)}
            >
              {lvl === 'ALL' ? 'Tất cả (500 Đề)' : `Cấp ${lvl}`}
            </Button>
          ))}
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Tìm theo mã đề (VD: Đề #042)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem 0.55rem 2.4rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem'
            }}
          />
        </div>
      </div>

      {/* Exams Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filteredExams.slice(0, 48).map((exam) => (
          <Card key={exam.id} hoverable style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-cyan)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                  CẤP ĐỘ {exam.level}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={14} /> {exam.durationMinutes} phút
                </span>
              </div>

              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{exam.title}</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', margin: '1rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div>📚 Từ vựng: <strong>7 câu</strong></div>
                <div>📖 Ngữ pháp: <strong>7 câu</strong></div>
                <div>📰 Đọc hiểu: <strong>8 câu</strong></div>
                <div>🎧 Nghe hiểu: <strong>8 câu</strong></div>
              </div>
            </div>

            <Button variant="primary" style={{ width: '100%', marginTop: '0.5rem' }} onClick={() => handleStartExam(exam)}>
              LÀM BÀI TEST THỬ (30 CÂU) <ArrowRight size={16} style={{ marginLeft: '0.4rem' }} />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
