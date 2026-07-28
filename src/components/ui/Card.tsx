import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  glow?: boolean;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = true,
  glow = false,
  style = {}
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-panel ${className}`}
      style={{
        padding: '1.5rem',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        ...(glow ? { boxShadow: '0 0 25px rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.3)' } : {}),
        ...style
      }}
      onMouseEnter={(e) => {
        if (hoverable && onClick) {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable && onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = glow ? 'rgba(59, 130, 246, 0.3)' : 'var(--glass-border)';
        }
      }}
    >
      {children}
    </div>
  );
};
