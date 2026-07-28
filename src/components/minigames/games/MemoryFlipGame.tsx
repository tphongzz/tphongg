import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { RotateCw, Sparkles, Trophy, BookOpen } from 'lucide-react';
import { GameReviewModal, ReviewItem } from '../ui/GameReviewModal';

interface MemoryFlipProps {
  onComplete: (xp: number) => void;
  onBack: () => void;
}

const MEMORY_CARDS_DATA = [
  { id: '1', term: 'Ubiquitous', hint: 'Present everywhere', exp: 'Ubiquitous (adj): Hiện diện khắp mọi nơi, rất phổ biến.', isFlipped: false },
  { id: '2', term: 'Serendipity', hint: 'Happy chance occurrence', exp: 'Serendipity (n): Sự tình cờ may mắn phát hiện ra những điều tốt đẹp.', isFlipped: false },
  { id: '3', term: 'Perseverance', hint: 'Persistence in effort', exp: 'Perseverance (n): Sự kiên trì bền chí vượt qua trở ngại.', isFlipped: false }
];

export const MemoryFlipGame: React.FC<MemoryFlipProps> = ({ onComplete, onBack }) => {
  const [cards, setCards] = useState(MEMORY_CARDS_DATA);
  const [flippedCount, setFlippedCount] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);

  const handleFlip = (id: string) => {
    const updated = cards.map(c => c.id === id ? { ...c, isFlipped: true } : c);
    setCards(updated);
    const count = flippedCount + 1;
    setFlippedCount(count);

    if (updated.every(c => c.isFlipped)) {
      setIsDone(true);
      onComplete(30);
    }
  };

  const reviewItems: ReviewItem[] = MEMORY_CARDS_DATA.map(card => ({
    question: `Thẻ trí nhớ: "${card.term}"`,
    userAnswer: card.hint,
    correctAnswer: card.hint,
    isCorrect: true,
    explanation: card.exp,
    category: 'Memory Flip'
  }));

  const handleRestart = () => {
    setCards(MEMORY_CARDS_DATA.map(c => ({ ...c, isFlipped: false })));
    setFlippedCount(0);
    setIsDone(false);
    setShowReviewModal(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '750px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#3B82F6' }}>🃏 Memory Flip Cards</h2>
      </div>

      {isDone ? (
        <Card hoverable={false} style={{ textAlign: 'center', padding: '3rem' }}>
          <Sparkles size={48} color="#FFB800" style={{ marginBottom: '1rem', margin: '0 auto' }} />
          <h2 style={{ color: '#FFB800', marginTop: '0.5rem' }}>ĐÃ LẬT VÀ GHI NHỚ TẤT CẢ THẺ!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Trí nhớ từ vựng siêu đẳng!</p>
          <div style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', margin: '1rem 0', fontWeight: 700 }}>
            +30 XP Thưởng Khủng! ⚡
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <Button variant="primary" onClick={() => setShowReviewModal(true)}>
              <BookOpen size={16} style={{ marginRight: '6px' }} /> Phân Tích & Giải Thích Chi Tiết
            </Button>
            <Button variant="secondary" onClick={onBack}>Về Arcade Hub</Button>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleFlip(card.id)}
              style={{
                height: '160px',
                borderRadius: 'var(--radius-md)',
                background: card.isFlipped ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                border: card.isFlipped ? '2px solid #3B82F6' : '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {card.isFlipped ? (
                <>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-cyan)' }}>{card.term}</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{card.hint}</p>
                </>
              ) : (
                <span style={{ fontSize: '2rem' }}>🎴</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Game Review Modal */}
      <GameReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        gameTitle="Memory Flip Cards"
        score={MEMORY_CARDS_DATA.length}
        totalQuestions={MEMORY_CARDS_DATA.length}
        earnedXp={30}
        reviewItems={reviewItems}
        onPlayAgain={handleRestart}
      />
    </div>
  );
};
