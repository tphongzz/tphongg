import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { Button } from '../../ui/Button';

interface GameNotificationModalProps {
  isOpen: boolean;
  type?: 'error' | 'success' | 'info';
  title?: string;
  message: string;
  onClose: () => void;
}

export const GameNotificationModal: React.FC<GameNotificationModalProps> = ({
  isOpen,
  type = 'error',
  title,
  message,
  onClose,
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    error: {
      color: 'var(--accent-pink)',
      bg: 'rgba(255, 122, 26, 0.15)',
      border: 'rgba(255, 122, 26, 0.3)',
      icon: <AlertCircle size={36} color="var(--accent-pink)" />,
      defaultTitle: 'Thử lại nhé!',
    },
    success: {
      color: 'var(--accent-green)',
      bg: 'rgba(0, 255, 136, 0.15)',
      border: 'rgba(0, 255, 136, 0.3)',
      icon: <CheckCircle size={36} color="var(--accent-green)" />,
      defaultTitle: 'Chính xác!',
    },
    info: {
      color: 'var(--accent-cyan)',
      bg: 'rgba(59, 130, 246, 0.15)',
      border: 'rgba(59, 130, 246, 0.3)',
      icon: <Info size={36} color="var(--accent-cyan)" />,
      defaultTitle: 'Thông báo',
    },
  };

  const config = typeConfig[type];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(10, 13, 20, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: '420px',
          width: '100%',
          padding: '2rem',
          textAlign: 'center',
          background: `linear-gradient(135deg, ${config.bg}, rgba(18, 24, 36, 0.95))`,
          border: `1px solid ${config.border}`,
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-glow)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <div style={{ marginBottom: '1rem', display: 'inline-block' }}>{config.icon}</div>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: config.color, marginBottom: '0.5rem' }}>
          {title || config.defaultTitle}
        </h3>

        <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          {message}
        </p>

        <Button variant="primary" style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>
          Đã Hiểu
        </Button>
      </div>
    </div>
  );
};
