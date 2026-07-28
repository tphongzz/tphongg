import React, { useEffect } from 'react';
import { Award, Zap, X } from 'lucide-react';

interface RankNotificationToastProps {
  message: string;
  subText?: string;
  type?: 'xp' | 'rank';
  onClose: () => void;
}

export const RankNotificationToast: React.FC<RankNotificationToastProps> = ({
  message,
  subText,
  type = 'xp',
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="glass-panel pulse-glow"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        background: type === 'rank'
          ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.25), rgba(18, 24, 36, 0.95))'
          : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(18, 24, 36, 0.95))',
        border: type === 'rank' ? '1.5px solid var(--accent-gold)' : '1.5px solid var(--accent-cyan)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        animation: 'slideUp 0.4s ease-out'
      }}
    >
      <div
        style={{
          padding: '0.6rem',
          borderRadius: '50%',
          background: type === 'rank' ? 'rgba(255, 215, 0, 0.2)' : 'rgba(59, 130, 246, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {type === 'rank' ? <Award size={24} color="var(--accent-gold)" /> : <Zap size={24} color="var(--accent-cyan)" />}
      </div>

      <div>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: type === 'rank' ? 'var(--accent-gold)' : 'var(--accent-cyan)' }}>
          {message}
        </div>
        {subText && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
            {subText}
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        style={{ background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem', marginLeft: '0.5rem' }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
