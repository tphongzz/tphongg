import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Table, CheckCircle, Sparkles, BookOpen } from 'lucide-react';
import { SAMPLE_CROSSWORD_GRID, CROSSWORD_CLUES } from '../../../data/miniGamesData';
import { GameNotificationModal } from '../ui/GameNotificationModal';
import { GameReviewModal, ReviewItem } from '../ui/GameReviewModal';

interface CrosswordProps {
  onComplete: (xp: number) => void;
  onBack: () => void;
}

export const CrosswordGame: React.FC<CrosswordProps> = ({ onComplete, onBack }) => {
  const [grid, setGrid] = useState(SAMPLE_CROSSWORD_GRID);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{ isOpen: boolean; message: string; type: 'error' | 'success' }>({
    isOpen: false,
    message: '',
    type: 'error'
  });

  const handleCellChange = (r: number, c: number, val: string) => {
    const newGrid = grid.map((row, ri) =>
      row.map((cell, ci) => {
        if (ri === r && ci === c) {
          return { ...cell, userLetter: val.toUpperCase() };
        }
        return cell;
      })
    );
    setGrid(newGrid);
  };

  const handleCheckSolution = () => {
    let allCorrect = true;
    grid.forEach(row => {
      row.forEach(cell => {
        if (!cell.isBlocked && cell.userLetter !== cell.letter) {
          allCorrect = false;
        }
      });
    });

    if (allCorrect) {
      setIsCompleted(true);
      onComplete(45);
    } else {
      setModalState({
        isOpen: true,
        type: 'error',
        message: 'Vẫn còn một số ô chữ chưa điền đúng! Hãy kiểm tra lại các gợi ý Ngang / Dọc nhé.'
      });
    }
  };

  const reviewItems: ReviewItem[] = CROSSWORD_CLUES.map((clue) => ({
    question: `Ô chữ #${clue.number} (${clue.direction}): ${clue.clue}`,
    userAnswer: clue.answer || 'CHÍNH XÁC',
    correctAnswer: clue.answer || 'HAPPINESS',
    isCorrect: true,
    explanation: clue.explanation || `Từ vựng "${clue.answer}" khớp hoàn toàn với định nghĩa ô chữ số #${clue.number}.`,
    category: 'Crossword'
  }));

  const handleRestart = () => {
    setGrid(SAMPLE_CROSSWORD_GRID);
    setIsCompleted(false);
    setShowReviewModal(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#00D2FF' }}>🔍 Vocabulary Crossword</h2>
      </div>

      {isCompleted ? (
        <Card hoverable={false} style={{ textAlign: 'center', padding: '3rem' }}>
          <Sparkles size={48} color="#FFB800" style={{ marginBottom: '1rem', margin: '0 auto' }} />
          <h2 style={{ color: '#FFB800', marginTop: '0.5rem' }}>GIẢI XONG Ô CHỮ TIẾNG ANH!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Tất cả các từ vựng đã được điền chính xác 100%!</p>
          <div style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', margin: '1rem 0', fontWeight: 700 }}>
            +45 XP Nhận Được! ⚡
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <Button variant="primary" onClick={() => setShowReviewModal(true)}>
              <BookOpen size={16} style={{ marginRight: '6px' }} /> Giải Thích Đáp Án Ô Chữ
            </Button>
            <Button variant="secondary" onClick={onBack}>Về Arcade Hub</Button>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Grid View */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {grid.map((row, r) => (
              <div key={r} style={{ display: 'flex' }}>
                {row.map((cell, c) => (
                  <div
                    key={c}
                    style={{
                      width: '45px',
                      height: '45px',
                      border: '1px solid var(--glass-border)',
                      backgroundColor: cell.isBlocked ? '#111' : 'rgba(255,255,255,0.08)',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {cell.number && (
                      <span style={{ position: 'absolute', top: '2px', left: '4px', fontSize: '0.65rem', color: 'var(--accent-cyan)' }}>
                        {cell.number}
                      </span>
                    )}
                    {!cell.isBlocked && (
                      <input
                        type="text"
                        maxLength={1}
                        value={cell.userLetter || ''}
                        onChange={(e) => handleCellChange(r, c, e.target.value)}
                        style={{
                          width: '100%',
                          height: '100%',
                          background: 'transparent',
                          border: 'none',
                          color: '#fff',
                          textAlign: 'center',
                          fontSize: '1.2rem',
                          fontWeight: 700
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
            <Button variant="primary" style={{ marginTop: '1.5rem' }} onClick={handleCheckSolution}>
              Kiểm Tra Ô Chữ <CheckCircle size={18} style={{ marginLeft: '0.4rem' }} />
            </Button>
          </div>

          {/* Clues Panel */}
          <div>
            <h3>Gợi Ý Ô Chữ</h3>
            {CROSSWORD_CLUES.map((clue, i) => (
              <Card key={i} hoverable={false} style={{ marginBottom: '0.75rem', padding: '0.85rem' }}>
                <strong>#{clue.number} ({clue.direction}):</strong> {clue.clue}
              </Card>
            ))}
          </div>
        </div>
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
        gameTitle="Vocabulary Crossword"
        score={CROSSWORD_CLUES.length}
        totalQuestions={CROSSWORD_CLUES.length}
        earnedXp={45}
        reviewItems={reviewItems}
        onPlayAgain={handleRestart}
      />
    </div>
  );
};
