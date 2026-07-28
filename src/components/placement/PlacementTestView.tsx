import React, { useState } from 'react';
import { UserProfile, CEFRLevel, RankLevel } from '../../types';
import { placementQuestions } from '../../data/placementQuestions';
import { addXpToUser, saveUserProfile } from '../../services/storage';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Award, Volume2, CheckCircle2, XCircle, ArrowRight, RotateCcw, Zap, Sparkles } from 'lucide-react';

interface PlacementTestViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onNavigate: (tab: any) => void;
}

export const PlacementTestView: React.FC<PlacementTestViewProps> = ({
  user,
  onUpdateUser,
  onNavigate
}) => {
  const [started, setStarted] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [resultData, setResultData] = useState<{
    score: number;
    total: number;
    cefr: CEFRLevel;
    assignedRank: RankLevel;
    bonusXp: number;
  } | null>(null);

  const currentQ = placementQuestions[currentIndex];

  const handlePlayAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectOption = (option: string) => {
    if (showExplanation) return;
    setSelectedAnswer(option);
  };

  const handleConfirmAnswer = () => {
    if (!selectedAnswer) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: selectedAnswer }));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    setSelectedAnswer('');

    if (currentIndex + 1 < placementQuestions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    let score = 0;
    const finalAnswers = { ...answers, [currentQ.id]: selectedAnswer };

    placementQuestions.forEach((q) => {
      if (finalAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });

    const total = placementQuestions.length;
    const percentage = (score / total) * 100;

    let cefr: CEFRLevel = 'A1';
    let assignedRank: RankLevel = 'bronze';
    let bonusXp = 150;

    if (percentage >= 90) {
      cefr = 'C2';
      assignedRank = 'master';
      bonusXp = 500;
    } else if (percentage >= 75) {
      cefr = 'C1';
      assignedRank = 'diamond';
      bonusXp = 400;
    } else if (percentage >= 60) {
      cefr = 'B2';
      assignedRank = 'platinum';
      bonusXp = 300;
    } else if (percentage >= 45) {
      cefr = 'B1';
      assignedRank = 'gold';
      bonusXp = 250;
    } else if (percentage >= 30) {
      cefr = 'A2';
      assignedRank = 'silver';
      bonusXp = 200;
    } else {
      cefr = 'A1';
      assignedRank = 'bronze';
      bonusXp = 150;
    }

    const updatedUser: UserProfile = {
      ...user,
      placementTestDone: true,
      rank: assignedRank
    };

    saveUserProfile(updatedUser);
    const userWithBonus = addXpToUser(bonusXp);
    onUpdateUser(userWithBonus);

    setResultData({
      score,
      total,
      cefr,
      assignedRank,
      bonusXp
    });
    setIsCompleted(true);
  };

  const handleRetake = () => {
    setStarted(false);
    setCurrentIndex(0);
    setSelectedAnswer('');
    setAnswers({});
    setShowExplanation(false);
    setIsCompleted(false);
    setResultData(null);
  };

  if (isCompleted && resultData) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '1.5rem', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', marginBottom: '1.5rem' }}>
          <Award size={64} color="var(--accent-cyan)" />
        </div>
        
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }} className="gradient-text">
          Chúc Mừng! Bạn Đã Hoàn Thành Bài Placement Test
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Hệ thống AI đã phân tích kết quả và xếp rank khởi đầu cho tài khoản của bạn.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <Card hoverable={false}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Kết quả chính xác</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '0.5rem' }}>
              {resultData.score} / {resultData.total}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              ({Math.round((resultData.score / resultData.total) * 100)}%)
            </span>
          </Card>

          <Card hoverable={false}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Trình độ CEFR tương ứng</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-pink)', marginTop: '0.5rem' }}>
              {resultData.cefr}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Khung chuẩn Châu Âu</span>
          </Card>

          <Card hoverable={false}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Rank khởi đầu</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, textTransform: 'capitalize', color: 'var(--accent-green)', marginTop: '0.5rem' }}>
              {resultData.assignedRank}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-orange)' }}>
              +{resultData.bonusXp} XP Thưởng
            </span>
          </Card>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="gradient" size="lg" onClick={() => onNavigate('dashboard')}>
            <Sparkles size={20} style={{ marginRight: '0.5rem' }} /> Đến Trang Chủ &amp; Học Ngay
          </Button>
          <Button variant="secondary" size="lg" onClick={handleRetake}>
            <RotateCcw size={20} style={{ marginRight: '0.5rem' }} /> Làm Lại Test
          </Button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="glass-panel" style={{ padding: '3.5rem', maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '1.25rem', borderRadius: '50%', background: 'rgba(30, 64, 175, 0.15)', marginBottom: '1.5rem' }}>
          <Award size={56} color="var(--accent-purple)" />
        </div>

        <h1 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>
          Bài Test Phân Trình Độ Tiếng Anh (Placement Test)
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
          Bài kiểm tra bao gồm các câu hỏi từ cấp độ **A1 đến C2** (Trắc nghiệm, Điền từ &amp; Luyện nghe). 
          Kết quả sẽ xác định **Rank học tập khởi đầu** và trao điểm **XP thưởng** cho bạn!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem', textAlign: 'left' }}>
          <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
            <div style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '0.25rem' }}>⚡ Đánh giá Toàn Diện</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Đủ các kỹ năng từ Ngữ pháp, Từ vựng đến Luyện nghe</div>
          </div>
          <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
            <div style={{ fontWeight: 600, color: 'var(--accent-pink)', marginBottom: '0.25rem' }}>🏆 Xếp Rank Khởi Đầu</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Mở khóa Rank Đồng, Bạc, Vàng, Kim Cương hoặc Cao Thủ</div>
          </div>
          <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
            <div style={{ fontWeight: 600, color: 'var(--accent-green)', marginBottom: '0.25rem' }}>🎁 Thưởng XP Khủng</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cơ hội nhận tới +500 XP thưởng tùy thuộc vào số câu đúng</div>
          </div>
        </div>

        <Button variant="gradient" size="lg" onClick={() => setStarted(true)}>
          Bắt Đầu Bài Test Ngay <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
        </Button>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '850px', margin: '0 auto' }}>
      {/* Test Progress Bar Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-cyan)' }}>
            Level {currentQ.level}
          </span>
          <span style={{ marginLeft: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Câu {currentIndex + 1} / {placementQuestions.length}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={18} color="var(--accent-gold)" />
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent-gold)' }}>Placement Mode</span>
        </div>
      </div>

      {/* Progress Line */}
      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', marginBottom: '2rem', overflow: 'hidden' }}>
        <div 
          style={{ 
            height: '100%', 
            width: `${((currentIndex + 1) / placementQuestions.length) * 100}%`,
            background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))',
            transition: 'width 0.3s ease'
          }} 
        />
      </div>

      {/* Question Content */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', lineHeight: '1.5', marginBottom: '1rem' }}>
          {currentQ.question}
        </h3>

        {/* Audio player if listening question */}
        {currentQ.type === 'listening' && currentQ.audioText && (
          <div style={{ marginBottom: '1.5rem' }}>
            <Button variant="secondary" onClick={() => handlePlayAudio(currentQ.audioText!)}>
              <Volume2 size={20} style={{ marginRight: '0.5rem', color: 'var(--accent-cyan)' }} />
              Nghe Audio Phát Âm
            </Button>
          </div>
        )}

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {currentQ.options?.map((opt, idx) => {
            const isSelected = selectedAnswer === opt;
            const isCorrect = opt === currentQ.correctAnswer;
            
            let bg = 'rgba(255, 255, 255, 0.03)';
            let borderColor = 'var(--glass-border)';
            let textColor = 'var(--text-primary)';

            if (showExplanation) {
              if (isCorrect) {
                bg = 'rgba(0, 255, 136, 0.15)';
                borderColor = 'var(--accent-green)';
                textColor = 'var(--accent-green)';
              } else if (isSelected && !isCorrect) {
                bg = 'rgba(255, 0, 85, 0.15)';
                borderColor = '#ff0055';
                textColor = '#ff0055';
              }
            } else if (isSelected) {
              bg = 'rgba(59, 130, 246, 0.12)';
              borderColor = 'var(--accent-cyan)';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                disabled={showExplanation}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: bg,
                  border: `1.5px solid ${borderColor}`,
                  color: textColor,
                  fontSize: '1rem',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{opt}</span>
                {showExplanation && isCorrect && <CheckCircle2 size={20} color="var(--accent-green)" />}
                {showExplanation && isSelected && !isCorrect && <XCircle size={20} color="#ff0055" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Answer Explanation */}
      {showExplanation && (
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '0.35rem' }}>
            💡 Giải thích chi tiết:
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {currentQ.explanation}
          </p>
        </div>
      )}

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        {!showExplanation ? (
          <Button 
            variant="primary" 
            onClick={handleConfirmAnswer} 
            disabled={!selectedAnswer}
          >
            Xác Nhận Đáp Án
          </Button>
        ) : (
          <Button variant="gradient" onClick={handleNextQuestion}>
            {currentIndex + 1 < placementQuestions.length ? 'Câu Tiếp Theo' : 'Xem Kết Quả'} <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
          </Button>
        )}
      </div>
    </div>
  );
};
