import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Trophy, RefreshCw, Sparkles, BookOpen } from 'lucide-react';
import { GameReviewModal, ReviewItem } from '../ui/GameReviewModal';

interface CardItem {
  id: string;
  pairId: string;
  text: string;
  type: 'english' | 'vietnamese';
  isFlipped: boolean;
  isMatched: boolean;
}

interface WordMatchGameProps {
  onComplete: (xp: number) => void;
  onBack: () => void;
}

const SAMPLE_PAIRS = [
  { pairId: 'p1', english: 'Happiness', vietnamese: 'Sự hạnh phúc', exp: 'Happiness (n): Trạng thái sung sướng, vui vẻ.' },
  { pairId: 'p2', english: 'Resilience', vietnamese: 'Sự kiên cường', exp: 'Resilience (n): Khả năng phục hồi nhanh chóng sau biến cố.' },
  { pairId: 'p3', english: 'Innovation', vietnamese: 'Sự đổi mới', exp: 'Innovation (n): Sáng kiến, phát minh mới mang lại giá trị.' },
  { pairId: 'p4', english: 'Perseverance', vietnamese: 'Sự kiên trì', exp: 'Perseverance (n): Sự nhẫn nại, nỗ lực không ngừng nghỉ.' },
  { pairId: 'p5', english: 'Ubiquitous', vietnamese: 'Có ở khắp nơi', exp: 'Ubiquitous (adj): Hiện diện phổ biến khắp nơi cùng lúc.' },
  { pairId: 'p6', english: 'Serendipity', vietnamese: 'Sự may mắn cờ duyên', exp: 'Serendipity (n): Sự tình cờ gặp điều may mắn bất ngờ.' }
];

export const WordMatchGame: React.FC<WordMatchGameProps> = ({ onComplete, onBack }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardItem[]>([]);
  const [matchesCount, setMatchesCount] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const cardList: CardItem[] = [];
    SAMPLE_PAIRS.forEach((pair) => {
      cardList.push({
        id: `eng_${pair.pairId}`,
        pairId: pair.pairId,
        text: pair.english,
        type: 'english',
        isFlipped: false,
        isMatched: false
      });
      cardList.push({
        id: `viet_${pair.pairId}`,
        pairId: pair.pairId,
        text: pair.vietnamese,
        type: 'vietnamese',
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle
    cardList.sort(() => Math.random() - 0.5);
    setCards(cardList);
    setSelectedCards([]);
    setMatchesCount(0);
    setMoves(0);
    setIsGameOver(false);
    setShowReviewModal(false);
  };

  const handleCardClick = (card: CardItem) => {
    if (card.isFlipped || card.isMatched || selectedCards.length >= 2) return;

    const newFlippedCard = { ...card, isFlipped: true };
    const updatedCards = cards.map(c => c.id === card.id ? newFlippedCard : c);
    setCards(updatedCards);

    const newSelected = [...selectedCards, newFlippedCard];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newSelected;
      if (first.pairId === second.pairId) {
        // Match!
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(c =>
              c.pairId === first.pairId ? { ...c, isMatched: true } : c
            )
          );
          setSelectedCards([]);
          setMatchesCount(prev => {
            const next = prev + 1;
            if (next === SAMPLE_PAIRS.length) {
              setIsGameOver(true);
              onComplete(35);
            }
            return next;
          });
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(c =>
              c.id === first.id || c.id === second.id ? { ...c, isFlipped: false } : c
            )
          );
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  const reviewItems: ReviewItem[] = SAMPLE_PAIRS.map((pair, idx) => ({
    question: `Cặp từ vựng #${idx + 1}: ${pair.english}`,
    userAnswer: pair.vietnamese,
    correctAnswer: pair.vietnamese,
    isCorrect: true,
    explanation: pair.exp,
    category: 'Word Match'
  }));

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--accent-cyan)' }}>🧩 Word Match 3D Pro</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nối đúng cặp Từ vựng Tiếng Anh & Nghĩa Tiếng Việt</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span>Lượt thử: <strong>{moves}</strong></span>
          <span>Đã ghép: <strong>{matchesCount}/{SAMPLE_PAIRS.length}</strong></span>
          <Button variant="ghost" size="sm" onClick={initGame}><RefreshCw size={16} /></Button>
        </div>
      </div>

      {isGameOver ? (
        <Card hoverable={false} style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <Sparkles size={48} color="#FFB800" style={{ marginBottom: '1rem', margin: '0 auto' }} />
          <h2 style={{ color: '#FFB800', margin: '0 0 0.5rem 0' }}>XIN CHÚC MỪNG! THẮNG LỢI RỰC RỠ!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Bạn đã hoàn thành ghép toàn bộ thẻ với <strong>{moves}</strong> lượt bấm!
          </p>
          <div style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '2rem' }}>
            +35 XP Đã Được Cộng Vào Tài Khoản! ⚡
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Button variant="primary" onClick={() => setShowReviewModal(true)}>
              <BookOpen size={16} style={{ marginRight: '6px' }} /> Xem Giải Thích Các Cặp Từ
            </Button>
            <Button variant="secondary" onClick={onBack}>Về Arcade Hub</Button>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              style={{
                height: '100px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: card.isMatched
                  ? 'rgba(0, 255, 102, 0.15)'
                  : card.isFlipped
                  ? 'rgba(59, 130, 246, 0.2)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: card.isMatched
                  ? '2px solid var(--accent-green)'
                  : card.isFlipped
                  ? '2px solid var(--accent-cyan)'
                  : '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.75rem',
                textAlign: 'center',
                cursor: card.isMatched ? 'default' : 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: card.isFlipped || card.isMatched ? 'var(--text-primary)' : 'var(--text-muted)'
              }}
            >
              {card.isFlipped || card.isMatched ? card.text : '❓'}
            </div>
          ))}
        </div>
      )}

      {/* Game Review Modal */}
      <GameReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        gameTitle="Word Match 3D Pro"
        score={SAMPLE_PAIRS.length}
        totalQuestions={SAMPLE_PAIRS.length}
        earnedXp={35}
        reviewItems={reviewItems}
        onPlayAgain={initGame}
      />
    </div>
  );
};
