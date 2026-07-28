import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Zap, Clock, Trophy, BookOpen, RotateCw } from 'lucide-react';
import { GameReviewModal, ReviewItem } from '../ui/GameReviewModal';

interface SpeedQuizProps {
  onComplete: (xp: number) => void;
  onBack: () => void;
}

const QUESTIONS = [
  {
    q: 'Synonym of "Huge":',
    options: ['Tiny', 'Enormous', 'Narrow', 'Slender'],
    ans: 1,
    exp: '"Huge" và "Enormous" đều mang nghĩa khổng lồ, to lớn. (Tiny = tí hon, Narrow = hẹp, Slender = mảnh khảnh).'
  },
  {
    q: 'She _______ coffee right now.',
    options: ['drinks', 'is drinking', 'drank', 'drunk'],
    ans: 1,
    exp: 'Trạng từ chỉ thời gian "right now" (ngay bây giờ) yêu cầu thì Hiện tại tiếp diễn (S + am/is/are + V-ing).'
  },
  {
    q: 'Antonym of "Ancient":',
    options: ['Old', 'Modern', 'Historic', 'Antique'],
    ans: 1,
    exp: '"Ancient" nghĩa là cổ kính, lâu đời. Từ trái nghĩa là "Modern" (hiện đại).'
  },
  {
    q: 'If it rains, we _______ at home.',
    options: ['stay', 'will stay', 'stayed', 'would stay'],
    ans: 1,
    exp: 'Câu điều kiện loại 1 (Conditional Type 1): Mệnh đề If dùng Hiện tại đơn (If it rains), mệnh đề chính dùng Tương lai đơn (will stay).'
  },
  {
    q: 'Choose the correct spelling:',
    options: ['Accomodate', 'Accommodate', 'Acommodate', 'Accommodat'],
    ans: 1,
    exp: 'Chính tả chuẩn xác là "Accommodate" (có 2 chữ c và 2 chữ m - nghĩa là đáp ứng/cung cấp chỗ ở).'
  }
];

export const SpeedQuizGame: React.FC<SpeedQuizProps> = ({ onComplete, onBack }) => {
  const [index, setIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);

  useEffect(() => {
    if (isFinished) return;
    if (timeLeft <= 0) {
      handleAnswer(-1); // timeout
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const handleAnswer = (chosenIndex: number) => {
    const q = QUESTIONS[index];
    const isCorrect = chosenIndex === q.ans;
    const chosenText = chosenIndex >= 0 ? q.options[chosenIndex] : 'Hết giờ (Không chọn)';

    const newReviewItem: ReviewItem = {
      question: q.q,
      userAnswer: chosenText,
      correctAnswer: q.options[q.ans],
      isCorrect,
      explanation: q.exp,
      category: 'Speed Quiz'
    };

    setReviewItems(prev => [...prev, newReviewItem]);

    let newScore = score;
    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
    }

    if (index + 1 >= QUESTIONS.length) {
      setIsFinished(true);
      const earnedXp = Math.max(10, newScore * 10);
      onComplete(earnedXp);
    } else {
      setIndex(prev => prev + 1);
      setTimeLeft(10);
    }
  };

  const handleRestart = () => {
    setIndex(0);
    setTimeLeft(10);
    setScore(0);
    setIsFinished(false);
    setReviewItems([]);
    setShowReviewModal(false);
  };

  const q = QUESTIONS[index];

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '650px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#FF007A' }}>⚡ Speed Quiz 10s</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: timeLeft <= 3 ? '#FF3333' : 'var(--accent-cyan)', fontWeight: 700 }}>
          <Clock size={20} /> {timeLeft}s
        </div>
      </div>

      {isFinished ? (
        <Card hoverable={false} style={{ textAlign: 'center', padding: '2.5rem' }}>
          <Trophy size={48} color="#FFB800" style={{ marginBottom: '1rem', margin: '0 auto' }} />
          <h2 style={{ color: '#FFB800', marginTop: '0.5rem' }}>TỐC ĐỘ XUẤT SẮC!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Điểm số: <strong>{score}</strong>/{QUESTIONS.length}</p>
          <div style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', margin: '1rem 0', fontWeight: 700 }}>
            +{Math.max(10, score * 10)} XP Thưởng! ⚡
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <Button variant="primary" onClick={() => setShowReviewModal(true)}>
              <BookOpen size={16} style={{ marginRight: '6px' }} /> Xem Giải Thích Đáp Án
            </Button>
            <Button variant="secondary" onClick={onBack}>
              Về Arcade Hub
            </Button>
          </div>
        </Card>
      ) : (
        <Card hoverable={false} style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', textAlign: 'center' }}>{q.q}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {q.options.map((opt, i) => (
              <Button key={i} variant="secondary" onClick={() => handleAnswer(i)}>
                {opt}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Game Review Modal */}
      <GameReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        gameTitle="Speed Quiz 10s"
        score={score}
        totalQuestions={QUESTIONS.length}
        earnedXp={Math.max(10, score * 10)}
        reviewItems={reviewItems}
        onPlayAgain={handleRestart}
      />
    </div>
  );
};
