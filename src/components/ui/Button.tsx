import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gradient' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, var(--accent-cyan), #2563eb)',
      color: '#0a0d14',
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.25)',
      border: 'none'
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.05)',
      color: 'var(--text-primary)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    gradient: {
      background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))',
      color: '#ffffff',
      boxShadow: '0 4px 15px rgba(255, 122, 26, 0.3)',
      border: 'none'
    },
    danger: {
      background: 'rgba(255, 59, 48, 0.15)',
      color: '#ff453a',
      border: '1px solid rgba(255, 59, 48, 0.3)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: 'none'
    }
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' },
    md: { padding: '0.65rem 1.3rem', fontSize: '0.9rem', borderRadius: 'var(--radius-md)' },
    lg: { padding: '0.85rem 1.8rem', fontSize: '1rem', borderRadius: 'var(--radius-md)' }
  };

  return (
    <button
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontWeight: 600,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        fontFamily: 'var(--font-heading)',
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style
      }}
      className={className}
      {...props}
    >
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
    </button>
  );
};
