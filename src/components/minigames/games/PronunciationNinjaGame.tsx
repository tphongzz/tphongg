import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Mic, Volume2, Trophy, Sparkles, BookOpen } from 'lucide-react';
import { startSpeechRecognition } from '../../../utils/speechUtils';
import { GameReviewModal, ReviewItem } from '../ui/GameReviewModal';

interface PronunciationNinjaProps {
  onComplete: (xp: number) => void;
  onBack: () => void;
}

const TARGET_WORDS = [
  { word: 'Perseverance', vi: 'Sự kiên trì', exp: 'Perseverance /ˌpɜː.sɪˈvɪə.rəns/ có trọng âm rơi vào âm tiết thứ 3 "vɪə". Đọc rõ các âm tiết: Per - se - ver - ance.' },
  { word: 'Sustainability', vi: 'Phát triển bền vững', exp: 'Sustainability /səˌsteɪ.nəˈbɪl.ə.ti/ có 6 âm tiết. Trọng âm chính nằm ở "bɪl".' },
  { word: 'Serendipity', vi: 'Sự may mắn cờ duyên', exp: 'Serendipity /ˌser.ənˈdɪp.ə.ti/ có 5 âm tiết. Trọng âm chính ở "dɪp".' }
];

export const PronunciationNinjaGame: React.FC<PronunciationNinjaProps> = ({ onComplete, onBack }) => {
  const [index, setIndex] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [spokenText, setSpokenText] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);

  const current = TARGET_WORDS[index];

  const handleRecord = () => {
    setIsRecording(true);
    setSpokenText('Đang lắng nghe giọng nói của Ninja...');

    startSpeechRecognition(
      (transcript: string) => {
        setIsRecording(false);
        setSpokenText(transcript);
        const isMatch = transcript.toLowerCase().includes(current.word.toLowerCase());

        const newReview: ReviewItem = {
          question: `Phát âm từ Ninja: "${current.word}" (${current.vi})`,
          userAnswer: transcript,
          correctAnswer: current.word,
          isCorrect: isMatch,
          explanation: current.exp,
          category: 'Pronunciation Ninja'
        };

        setReviewItems(prev => [...prev, newReview]);

        if (isMatch) {
          setScore(prev => prev + 1);
        }
      },
      (error: string) => {
        setIsRecording(false);
        setSpokenText(error || 'Không kết nối được mic. Vui lòng kiểm tra lại mic.');
      }
    );
  };

  const handleNext = () => {
    if (index + 1 >= TARGET_WORDS.length) {
      setIsFinished(true);
      const earnedXp = Math.max(15, score * 15);
      onComplete(earnedXp);
    } else {
      setIndex(prev => prev + 1);
      setSpokenText('');
    }
  };

  const handleRestart = () => {
    setIndex(0);
    setScore(0);
    setIsFinished(false);
    setSpokenText('');
    setReviewItems([]);
    setShowReviewModal(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#A855F7' }}>🥷 Pronunciation Ninja</h2>
        <span>{index + 1}/{TARGET_WORDS.length}</span>
      </div>

      {isFinished ? (
        <Card hoverable={false} style={{ textAlign: 'center', padding: '3rem' }}>
          <Sparkles size={48} color="#FFB800" style={{ marginBottom: '1rem', margin: '0 auto' }} />
          <h2 style={{ color: '#FFB800', marginTop: '0.5rem' }}>NINJA PHÁT ÂM THUẦN THỤC!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Phát âm chuẩn: <strong>{score}</strong>/{TARGET_WORDS.length}</p>
          <div style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', margin: '1rem 0', fontWeight: 700 }}>
            +{Math.max(15, score * 15)} XP Thưởng! ⚡
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <Button variant="primary" onClick={() => setShowReviewModal(true)}>
              <BookOpen size={16} style={{ marginRight: '6px' }} /> Xem Giải Thích Trọng Âm & Phiên Âm
            </Button>
            <Button variant="secondary" onClick={onBack}>Về Arcade Hub</Button>
          </div>
        </Card>
      ) : (
        <Card hoverable={false} style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--accent-cyan)', marginBottom: '0.3rem' }}>{current.word}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>({current.vi})</p>

          <Button
            variant="primary"
            size="lg"
            onClick={handleRecord}
            disabled={isRecording}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              margin: '0 auto 1.5rem auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isRecording ? '#FF3333' : 'linear-gradient(135deg, #A855F7, #7000FF)'
            }}
          >
            <Mic size={40} />
          </Button>

          {spokenText && (
            <p style={{ fontStyle: 'italic', color: 'var(--accent-cyan)', marginBottom: '1.5rem' }}>
              Giọng bạn thu được: "{spokenText}"
            </p>
          )}

          <Button variant="secondary" onClick={handleNext}>
            Chuyển Từ Tiếp Theo ➡️
          </Button>
        </Card>
      )}

      {/* Game Review Modal */}
      <GameReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        gameTitle="Pronunciation Ninja"
        score={score}
        totalQuestions={TARGET_WORDS.length}
        earnedXp={Math.max(15, score * 15)}
        reviewItems={reviewItems}
        onPlayAgain={handleRestart}
      />
    </div>
  );
};
