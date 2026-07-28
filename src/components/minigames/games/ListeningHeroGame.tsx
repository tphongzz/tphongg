import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Headphones, Volume2, Trophy, BookOpen } from 'lucide-react';
import { playTtsSpeech } from '../../../utils/speechUtils';
import { GameReviewModal, ReviewItem } from '../ui/GameReviewModal';

interface ListeningHeroProps {
  onComplete: (xp: number) => void;
  onBack: () => void;
}

const LISTENING_WORDS = [
  { word: 'Happiness', options: ['Happiness', 'Sadness', 'Friendship', 'Loneliness'], correct: 0, exp: 'Happiness /ˈhæp.i.nəs/ có âm đầu /hæp/ phát âm rõ ràng, mang nghĩa sự hạnh phúc.' },
  { word: 'Innovation', options: ['Tradition', 'Innovation', 'Creation', 'Invention'], correct: 1, exp: 'Innovation /ˌɪn.əˈveɪ.ʃən/ có trọng âm rơi vào âm tiết thứ 3 "va", nghĩa là sự đổi mới sáng tạo.' },
  { word: 'Perseverance', options: ['Patience', 'Tolerance', 'Perseverance', 'Persistence'], correct: 2, exp: 'Perseverance /ˌpɜː.sɪˈvɪə.rəns/ phát âm 4 âm tiết với trọng âm thứ 3, nghĩa là sự kiên trì nhẫn nại.' }
];

export const ListeningHeroGame: React.FC<ListeningHeroProps> = ({ onComplete, onBack }) => {
  const [index, setIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);

  const item = LISTENING_WORDS[index];

  const handlePlayAudio = () => {
    if (item) playTtsSpeech(item.word, 'en-US');
  };

  const handleChoice = (i: number) => {
    const isCorrect = i === item.correct;
    const newReview: ReviewItem = {
      question: `Nghe phát âm từ: "${item.word}"`,
      userAnswer: item.options[i],
      correctAnswer: item.options[item.correct],
      isCorrect,
      explanation: item.exp,
      category: 'Listening Hero'
    };

    setReviewItems(prev => [...prev, newReview]);

    let newScore = score;
    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
    }

    if (index + 1 >= LISTENING_WORDS.length) {
      setIsDone(true);
      const earnedXp = Math.max(15, newScore * 10);
      onComplete(earnedXp);
    } else {
      setIndex(prev => prev + 1);
    }
  };

  const handleRestart = () => {
    setIndex(0);
    setScore(0);
    setIsDone(false);
    setReviewItems([]);
    setShowReviewModal(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '650px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#00FF66' }}>🎧 Listening Hero</h2>
        <span>{index + 1}/{LISTENING_WORDS.length}</span>
      </div>

      {isDone ? (
        <Card hoverable={false} style={{ textAlign: 'center', padding: '3rem' }}>
          <Trophy size={48} color="#FFB800" style={{ marginBottom: '1rem', margin: '0 auto' }} />
          <h2 style={{ color: '#FFB800', marginTop: '0.5rem' }}>HOÀN THÀNH LISTENING HERO!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Điểm tai nghe chuẩn: <strong>{score}</strong>/{LISTENING_WORDS.length}</p>
          <div style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', margin: '1rem 0', fontWeight: 700 }}>
            +{Math.max(15, score * 10)} XP Nhận Được! ⚡
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <Button variant="primary" onClick={() => setShowReviewModal(true)}>
              <BookOpen size={16} style={{ marginRight: '6px' }} /> Phân Tích & Giải Thích Phát Âm
            </Button>
            <Button variant="secondary" onClick={onBack}>
              Về Arcade Hub
            </Button>
          </div>
        </Card>
      ) : (
        <Card hoverable={false} style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Bấm nút loa bên dưới để nghe âm thanh từ bản ngữ:</p>
          <Button variant="primary" size="lg" onClick={handlePlayAudio} style={{ marginBottom: '2rem', borderRadius: '50%', width: '80px', height: '80px', margin: '0 auto 2rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Volume2 size={36} />
          </Button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {item.options.map((opt, i) => (
              <Button key={i} variant="secondary" onClick={() => handleChoice(i)}>
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
        gameTitle="Listening Hero"
        score={score}
        totalQuestions={LISTENING_WORDS.length}
        earnedXp={Math.max(15, score * 10)}
        reviewItems={reviewItems}
        onPlayAgain={handleRestart}
      />
    </div>
  );
};
