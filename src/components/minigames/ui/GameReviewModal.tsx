import React, { useState } from 'react';
import { Trophy, CheckCircle, XCircle, Lightbulb, BookmarkPlus, ArrowRight, RotateCw, Award, Sparkles, X } from 'lucide-react';
import { Button } from '../../ui/Button';
import { saveUserWeakness } from '../../../services/storage';

export interface ReviewItem {
  id?: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  category?: string;
}

interface GameReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameTitle: string;
  score: number;
  totalQuestions: number;
  earnedXp: number;
  reviewItems: ReviewItem[];
  onPlayAgain?: () => void;
}

export const GameReviewModal: React.FC<GameReviewModalProps> = ({
  isOpen,
  onClose,
  gameTitle,
  score,
  totalQuestions,
  earnedXp,
  reviewItems,
  onPlayAgain
}) => {
  const [savedItems, setSavedItems] = useState<Record<number, boolean>>({});

  if (!isOpen) return null;

  const accuracyPercent = Math.round((score / Math.max(1, totalQuestions)) * 100);

  const handleSaveItem = (item: ReviewItem, idx: number) => {
    saveUserWeakness({
      id: item.id || `game_weak_${Date.now()}_${idx}`,
      type: 'grammar',
      title: item.question,
      userAnswer: item.userAnswer,
      correctAnswer: item.correctAnswer,
      explanation: item.explanation,
      timestamp: Date.now()
    });
    setSavedItems(prev => ({ ...prev, [idx]: true }));
  };

  return (
    <div className="dict-modal-backdrop" onClick={onClose}>
      <div className="dict-modal-card" style={{ maxWidth: '720px' }} onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="dict-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#FFB800', fontWeight: 700, fontSize: '1.05rem' }}>
            <Trophy size={22} color="#FFB800" />
            <span style={{ background: 'linear-gradient(135deg, #FFD700, #FF007A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Báo Cáo Kết Quả & Giải Thích Chi Tiết: {gameTitle}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="dict-modal-body custom-scrollbar" style={{ gap: '1.25rem' }}>
          {/* Summary Score Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(112, 0, 255, 0.15))',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '18px',
              padding: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                TỈ LỆ CHÍNH XÁC
              </span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: accuracyPercent >= 70 ? '#34d399' : '#f43f5e' }}>
                {accuracyPercent}%
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                Đã trả lời đúng <strong>{score}</strong> / <strong>{totalQuestions}</strong> câu hỏi.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '14px',
                  textAlign: 'center'
                }}
              >
                <Award size={20} color="#FFD700" style={{ margin: '0 auto 2px auto' }} />
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>THƯỞNG XP</span>
                <strong style={{ fontSize: '1.1rem', color: '#FFD700' }}>+{earnedXp} XP</strong>
              </div>
            </div>
          </div>

          <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lightbulb size={18} color="var(--accent-cyan)" /> Danh Sách Câu Hỏi & Phân Tích Đáp Án Chi Tiết:
          </h3>

          {/* List of Review Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviewItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: item.isCorrect ? 'rgba(16, 185, 129, 0.06)' : 'rgba(244, 63, 94, 0.06)',
                  border: item.isCorrect ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(244, 63, 94, 0.25)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                {/* Header item */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {item.isCorrect ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#34d399', fontSize: '0.8rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.2)', padding: '2px 8px', borderRadius: '20px' }}>
                        <CheckCircle size={14} /> Câu {idx + 1}: Đúng
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#f43f5e', fontSize: '0.8rem', fontWeight: 700, background: 'rgba(244, 63, 94, 0.2)', padding: '2px 8px', borderRadius: '20px' }}>
                        <XCircle size={14} /> Câu {idx + 1}: Chưa Đúng
                      </span>
                    )}
                    {item.category && (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '6px' }}>
                        {item.category}
                      </span>
                    )}
                  </div>

                  {!item.isCorrect && (
                    <button
                      onClick={() => handleSaveItem(item, idx)}
                      disabled={savedItems[idx]}
                      style={{
                        background: savedItems[idx] ? 'rgba(52, 211, 153, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                        border: savedItems[idx] ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid rgba(59, 130, 246, 0.3)',
                        color: savedItems[idx] ? '#34d399' : '#3b82f6',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '8px',
                        cursor: savedItems[idx] ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <BookmarkPlus size={14} />
                      <span>{savedItems[idx] ? 'Đã Lưu Sổ Yếu' : 'Lưu Vào Sổ Cần Ôn'}</span>
                    </button>
                  )}
                </div>

                {/* Question */}
                <h4 style={{ margin: 0, fontSize: '0.98rem', color: '#ffffff', lineHeight: 1.5 }}>
                  {item.question}
                </h4>

                {/* Answers Comparison */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div style={{ background: 'rgba(10, 15, 26, 0.6)', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block' }}>Lựa chọn của bạn:</span>
                    <strong style={{ color: item.isCorrect ? '#34d399' : '#f43f5e' }}>{item.userAnswer || '(Bỏ trống / Hết giờ)'}</strong>
                  </div>

                  <div style={{ background: 'rgba(10, 15, 26, 0.6)', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block' }}>Đáp án chuẩn xác:</span>
                    <strong style={{ color: '#34d399' }}>{item.correctAnswer}</strong>
                  </div>
                </div>

                {/* Explanation Box */}
                {item.explanation && (
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      borderLeft: '3px solid var(--accent-cyan)',
                      padding: '0.75rem 1rem',
                      borderRadius: '0 10px 10px 0',
                      fontSize: '0.85rem',
                      color: '#cbd5e1',
                      lineHeight: 1.5
                    }}
                  >
                    <strong style={{ color: 'var(--accent-cyan)', display: 'block', marginBottom: '2px', fontSize: '0.78rem' }}>
                      💡 PHÂN TÍCH GIẢI THÍCH:
                    </strong>
                    {item.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Modal Footer Actions */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {onPlayAgain && (
              <Button variant="secondary" onClick={onPlayAgain}>
                <RotateCw size={16} style={{ marginRight: '6px' }} /> Chơi Lại Game Này
              </Button>
            )}
            <Button variant="gradient" onClick={onClose} style={{ marginLeft: 'auto' }}>
              Hoàn Thành & Trở Về Arcade <ArrowRight size={16} style={{ marginLeft: '6px' }} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
