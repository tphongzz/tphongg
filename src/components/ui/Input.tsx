import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ icon, className = '', style, ...props }) => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {icon && (
        <div
          style={{
            position: 'absolute',
            left: '12px',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }}
        >
          {icon}
        </div>
      )}
      <input
        style={{
          width: '100%',
          padding: icon ? '0.65rem 1rem 0.65rem 2.6rem' : '0.65rem 1rem',
          borderRadius: 'var(--radius-md, 10px)',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          color: '#ffffff',
          fontSize: '0.9rem',
          outline: 'none',
          transition: 'all 0.2s ease',
          ...style,
        }}
        className={className}
        {...props}
      />
    </div>
  );
};
