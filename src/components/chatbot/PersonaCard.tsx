import React from 'react';
import { PersonaType } from '../../services/geminiService';
import { Bot, Sparkles, CheckCircle2, UserCheck } from 'lucide-react';

interface PersonaCardProps {
  persona: PersonaType;
  isSelected: boolean;
  onSelect: (persona: PersonaType) => void;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({
  persona,
  isSelected,
  onSelect,
}) => {
  const isAdam = persona === 'adam';

  return (
    <div
      onClick={() => onSelect(persona)}
      className="glass-card"
      style={{
        cursor: 'pointer',
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: isSelected
          ? `2px solid ${isAdam ? 'var(--accent-cyan)' : 'var(--accent-pink)'}`
          : '1px solid var(--glass-border)',
        background: isSelected
          ? isAdam
            ? 'rgba(59, 130, 246, 0.08)'
            : 'rgba(255, 122, 26, 0.08)'
          : 'rgba(255, 255, 255, 0.02)',
        boxShadow: isSelected
          ? `0 0 20px ${isAdam ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 122, 26, 0.25)'}`
          : 'none',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            color: isAdam ? 'var(--accent-cyan)' : 'var(--accent-pink)',
          }}
        >
          <CheckCircle2 size={20} />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
        {/* Avatar Container */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: isAdam
              ? 'linear-gradient(135deg, #3b82f6, #0077ff)'
              : 'linear-gradient(135deg, #ff7a1a, #1e40af)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            boxShadow: `0 4px 15px ${isAdam ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 122, 26, 0.4)'}`,
          }}
        >
          {isAdam ? '👨‍💼' : '👩‍🏫'}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{isAdam ? 'Adam' : 'Eva'}</h3>
            <span
              className="badge"
              style={{
                background: isAdam ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 122, 26, 0.15)',
                color: isAdam ? 'var(--accent-cyan)' : 'var(--accent-pink)',
                border: `1px solid ${isAdam ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 122, 26, 0.3)'}`,
                fontSize: '0.7rem',
              }}
            >
              {isAdam ? 'Bạn Học Thân Thiện' : 'Cô Giáo Chuẩn Mực'}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              color: 'var(--accent-green)',
              marginTop: '0.2rem',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-green)',
                boxShadow: '0 0 8px var(--accent-green)',
              }}
            />
            Sẵn sàng trò chuyện 1:1
          </div>
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
        {isAdam
          ? 'Phong cách giao tiếp tự nhiên, đời thường, tạo không khí thoải mái, động viên bạn tự tin nói tiếng Anh hàng ngày.'
          : 'Phong cách academic/business chỉn chu, giúp bạn sửa kỹ từng cấu trúc ngữ pháp và trau chuốt từ vựng nâng cao.'}
      </p>

      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '0.8rem',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>
          🎙️ Voice: {isAdam ? 'US Male' : 'UK Female'}
        </span>
        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>
          ⚡ Gemini 1.5 Flash
        </span>
      </div>
    </div>
  );
};
