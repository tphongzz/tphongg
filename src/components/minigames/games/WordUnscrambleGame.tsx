import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Shuffle, CheckCircle, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { GameNotificationModal } from '../ui/GameNotificationModal';
import { GameReviewModal, ReviewItem } from '../ui/GameReviewModal';

interface WordUnscrambleProps {
  onComplete: (xp: number) => void;
  onBack: () => void;
}

const WORDS_POOL = [
  { word: 'RESILIENCE', hint: 'Khả năng phục hồi, sự kiên cường', exp: 'Resilience (danh từ) nghĩa là sự kiên cường, khả năng vượt qua thử thách khó khăn.' },
  { word: 'SUSTAINABILITY', hint: 'Sự phát triển bền vững', exp: 'Sustainability (danh từ) nghĩa là tính bền vững, bảo vệ môi trường và tài nguyên.' },
  { word: 'SERENDIPITY', hint: 'Sự may mắn cờ duyên', exp: 'Serendipity (danh từ) chỉ sự tình cờ phát hiện ra những điều may mắn, thú vị.' },
  { word: 'PERSEVERANCE', hint: 'Sự kiên trì bền chí', exp: 'Perseverance (danh từ) nghĩa là sự bền chí, quyết tâm đuổi theo mục tiêu đến cùng.' },
  { word: 'INNOVATION', hint: 'Sự đổi mới, sáng tạo', exp: 'Innovation (danh từ) chỉ sự đổi mới sáng tạo, đưa ra ý tưởng và giải pháp mới.' }
];

export const WordUnscrambleGame: React.FC<WordUnscrambleProps> = ({ onComplete, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [scrambled, setScrambled] = useState<string[]>([]);
  const [userLetters, setUserLetters] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{ isOpen: boolean; message: string; type: 'error' | 'success' }>({
    isOpen: false,
    message: '',
    type: 'error'
  });

  useEffect(() => {
    loadWord(currentIndex);
  }, [currentIndex]);

  const loadWord = (index: number) => {
    if (index >= WORDS_POOL.length) {
      setIsFinished(true);
      onComplete(40);
      return;
    }
    const current = WORDS_POOL[index];
    const letters = current.word.split('');
    // Fisher-Yates shuffle
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    // If by chance scrambled matches original word, swap first 2 characters
    if (letters.join('') === current.word && letters.length > 1) {
      [letters[0], letters[1]] = [letters[1], letters[0]];
    }
    setScrambled(letters);
    setUserLetters([]);
  };

  const handleLetterClick = (letter: string, index: number) => {
    setUserLetters([...userLetters, letter]);
    const newScrambled = [...scrambled];
    newScrambled.splice(index, 1);
    setScrambled(newScrambled);
  };

  const handleRemoveUserLetter = (letter: string, index: number) => {
    const newUserLetters = [...userLetters];
    newUserLetters.splice(index, 1);
    setUserLetters(newUserLetters);
    setScrambled([...scrambled, letter]);
  };

  const handleCheckAnswer = () => {
    const wordObj = WORDS_POOL[currentIndex];
    const userBuiltWord = userLetters.join('');
    const isCorrect = userBuiltWord === wordObj.word;

    const newReview: ReviewItem = {
      question: `Gợi ý: "${wordObj.hint}"`,
      userAnswer: userBuiltWord,
      correctAnswer: wordObj.word,
      isCorrect,
      explanation: wordObj.exp,
      category: 'Word Unscramble'
    };

    setReviewItems(prev => [...prev, newReview]);

    if (isCorrect) {
      setScore(prev => prev + 1);
      if (currentIndex + 1 >= WORDS_POOL.length) {
        setIsFinished(true);
        onComplete(40);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    } else {
      setModalState({
        isOpen: true,
        type: 'error',
        message: `Chưa chính xác! Từ đúng là "${wordObj.word}". Bấm câu tiếp theo để chuyển bài.`
      });
      if (currentIndex + 1 >= WORDS_POOL.length) {
        setIsFinished(true);
        onComplete(20);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setReviewItems([]);
    setShowReviewModal(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: 'var(--accent-purple)' }}>🔤 Word Unscramble</h2>
        <span>Câu: <strong>{currentIndex + 1}/{WORDS_POOL.length}</strong></span>
      </div>

      {isFinished ? (
        <Card hoverable={false} style={{ textAlign: 'center', padding: '3rem' }}>
          <Sparkles size={48} color="#FFB800" style={{ marginBottom: '1rem', margin: '0 auto' }} />
          <h2 style={{ color: '#FFB800', marginTop: '0.5rem' }}>HOÀN THÀNH THỬ THÁCH XẾP TỪ!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Bạn đã giải đúng <strong>{score}</strong>/{WORDS_POOL.length} từ vựng!</p>
          <div style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', margin: '1rem 0', fontWeight: 700 }}>
            +40 XP Đã Nhận! ⚡
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <Button variant="primary" onClick={() => setShowReviewModal(true)}>
              <BookOpen size={16} style={{ marginRight: '6px' }} /> Phân Tích & Giải Thích Định Nghĩa
            </Button>
            <Button variant="secondary" onClick={onBack}>
              Về Arcade Hub
            </Button>
          </div>
        </Card>
      ) : (
        <Card hoverable={false} style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
            Gợi ý: {WORDS_POOL[currentIndex]?.hint}
          </div>

          {/* User Built Word */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', minHeight: '50px', marginBottom: '2rem' }}>
            {userLetters.map((char, idx) => (
              <button
                key={idx}
                onClick={() => handleRemoveUserLetter(char, idx)}
                style={{
                  width: '40px',
                  height: '45px',
                  borderRadius: '8px',
                  background: 'var(--accent-purple)',
                  color: '#fff',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {char}
              </button>
            ))}
          </div>

          {/* Available Scrambled Letters */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {scrambled.map((char, idx) => (
              <button
                key={idx}
                onClick={() => handleLetterClick(char, idx)}
                style={{
                  width: '40px',
                  height: '45px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-primary)',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  border: '1px solid var(--glass-border)',
                  cursor: 'pointer'
                }}
              >
                {char}
              </button>
            ))}
          </div>

          <Button variant="primary" onClick={handleCheckAnswer} disabled={scrambled.length > 0}>
            Xác Nhận Đáp Án <CheckCircle size={18} style={{ marginLeft: '0.4rem' }} />
          </Button>
        </Card>
      )}

      <GameNotificationModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        message={modalState.message}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Game Review Modal */}
      <GameReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        gameTitle="Word Unscramble"
        score={score}
        totalQuestions={WORDS_POOL.length}
        earnedXp={40}
        reviewItems={reviewItems}
        onPlayAgain={handleRestart}
      />
    </div>
  );
};
