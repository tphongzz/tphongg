import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Activity, Trophy, Flame, BookOpen } from 'lucide-react';
import { GameReviewModal, ReviewItem } from '../ui/GameReviewModal';

interface WordRunnerProps {
  onComplete: (xp: number) => void;
  onBack: () => void;
}

const RUNNER_STAGES = [
  { target: 'Happiness (Sự hạnh phúc)', wordA: 'Happiness', wordB: 'Hapiness', correct: 'A', exp: 'Chính tả chuẩn là "Happiness" với 2 chữ p.' },
  { target: 'Delicious (Ngon miệng)', wordA: 'Delicius', wordB: 'Delicious', correct: 'B', exp: 'Chính tả chuẩn là "Delicious" (đuôi -ious).' },
  { target: 'Environment (Môi trường)', wordA: 'Environment', wordB: 'Enviroment', correct: 'A', exp: 'Chính tả chuẩn là "Environment" (chú ý chữ n âm câm sau enviro-).' }
];

export const WordRunnerGame: React.FC<WordRunnerProps> = ({ onComplete, onBack }) => {
  const [index, setIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);

  const current = RUNNER_STAGES[index];

  const handleChoice = (lane: 'A' | 'B') => {
    const isCorrect = lane === current.correct;
    const chosenWord = lane === 'A' ? current.wordA : current.wordB;
    const correctWord = current.correct === 'A' ? current.wordA : current.wordB;

    const newReview: ReviewItem = {
      question: `Chính tả từ: "${current.target}"`,
      userAnswer: chosenWord,
      correctAnswer: correctWord,
      isCorrect,
      explanation: current.exp,
      category: 'Word Runner'
    };

    setReviewItems(prev => [...prev, newReview]);

    let newScore = score;
    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
    }

    if (index + 1 >= RUNNER_STAGES.length) {
      setIsFinished(true);
      const earnedXp = Math.max(15, newScore * 12);
      onComplete(earnedXp);
    } else {
      setIndex(prev => prev + 1);
    }
  };

  const handleRestart = () => {
    setIndex(0);
    setScore(0);
    setIsFinished(false);
    setReviewItems([]);
    setShowReviewModal(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#FF00E5' }}>🏃 Word Runner Arcade</h2>
        <span>Chặng: <strong>{index + 1}/{RUNNER_STAGES.length}</strong></span>
      </div>

      {isFinished ? (
        <Card hoverable={false} style={{ textAlign: 'center', padding: '3rem' }}>
          <Trophy size={48} color="#FFB800" style={{ marginBottom: '1rem', margin: '0 auto' }} />
          <h2 style={{ color: '#FFB800', marginTop: '0.5rem' }}>HOÀN THÀNH ĐƯỜNG CHẠY!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Thu thập từ đúng: <strong>{score}</strong>/{RUNNER_STAGES.length}</p>
          <div style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', margin: '1rem 0', fontWeight: 700 }}>
            +{Math.max(15, score * 12)} XP Thưởng! ⚡
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <Button variant="primary" onClick={() => setShowReviewModal(true)}>
              <BookOpen size={16} style={{ marginRight: '6px' }} /> Giải Thích Lỗi Chính Tả
            </Button>
            <Button variant="secondary" onClick={onBack}>Về Arcade Hub</Button>
          </div>
        </Card>
      ) : (
        <Card hoverable={false} style={{ padding: '2rem', textAlign: 'center', background: 'linear-gradient(180deg, rgba(255,0,229,0.1), transparent)' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🏃‍♂️</div>
          <h3 style={{ marginBottom: '1.5rem' }}>Mục tiêu: {current.target}</h3>

          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Né từ sai chính tả và chạy vào làn đường đúng chính tả:</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <Button variant="primary" size="lg" onClick={() => handleChoice('A')} style={{ padding: '2rem 1rem', fontSize: '1.2rem' }}>
              Làn 1: {current.wordA}
            </Button>
            <Button variant="primary" size="lg" onClick={() => handleChoice('B')} style={{ padding: '2rem 1rem', fontSize: '1.2rem', background: 'linear-gradient(135deg, #7000FF, #FF00E5)' }}>
              Làn 2: {current.wordB}
            </Button>
          </div>
        </Card>
      )}

      {/* Game Review Modal */}
      <GameReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        gameTitle="Word Runner Arcade"
        score={score}
        totalQuestions={RUNNER_STAGES.length}
        earnedXp={Math.max(15, score * 12)}
        reviewItems={reviewItems}
        onPlayAgain={handleRestart}
      />
    </div>
  );
};
