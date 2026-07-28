import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  color?: string;
  height?: number;
  showPercent?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  label,
  color = 'var(--accent-cyan)',
  height = 10,
  showPercent = false
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((current / max) * 100))) || 0;

  return (
    <div style={{ width: '100%' }}>
      {(label || showPercent) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {label && <span>{label}</span>}
          {showPercent && <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{percentage}%</span>}
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '9999px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'relative'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            background: color.includes('linear-gradient') ? color : `linear-gradient(90deg, ${color}, #2563eb)`,
            borderRadius: '9999px',
            transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: `0 0 10px ${color}`
          }}
        />
      </div>
    </div>
  );
};
