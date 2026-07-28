import React from 'react';
import { RankLevel } from '../../types';
import { Shield, Award, Crown, Zap, Flame, Trophy } from 'lucide-react';

interface RankBadgeProps {
  rank: RankLevel;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const rankConfig: Record<RankLevel, { name: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  bronze: {
    name: 'Đồng',
    color: '#CD7F32',
    bg: 'rgba(205, 127, 50, 0.15)',
    border: 'rgba(205, 127, 50, 0.4)',
    icon: Shield
  },
  silver: {
    name: 'Bạc',
    color: '#A8B2C1',
    bg: 'rgba(168, 178, 193, 0.15)',
    border: 'rgba(168, 178, 193, 0.4)',
    icon: Award
  },
  gold: {
    name: 'Vàng',
    color: '#FFD700',
    bg: 'rgba(255, 215, 0, 0.15)',
    border: 'rgba(255, 215, 0, 0.4)',
    icon: Trophy
  },
  platinum: {
    name: 'Bạch Kim',
    color: '#00E5FF',
    bg: 'rgba(0, 229, 255, 0.15)',
    border: 'rgba(0, 229, 255, 0.4)',
    icon: Zap
  },
  diamond: {
    name: 'Kim Cương',
    color: '#A855F7',
    bg: 'rgba(168, 85, 247, 0.15)',
    border: 'rgba(168, 85, 247, 0.4)',
    icon: Flame
  },
  master: {
    name: 'Cao Thủ',
    color: '#FF0055',
    bg: 'rgba(255, 0, 85, 0.2)',
    border: 'rgba(255, 0, 85, 0.6)',
    icon: Crown
  }
};

export const RankBadge: React.FC<RankBadgeProps> = ({ rank, showName = true, size = 'md' }) => {
  const config = rankConfig[rank] || rankConfig.bronze;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: { font: '0.7rem', padding: '0.2rem 0.5rem', iconSize: 12 },
    md: { font: '0.8rem', padding: '0.35rem 0.8rem', iconSize: 16 },
    lg: { font: '0.95rem', padding: '0.5rem 1.1rem', iconSize: 20 }
  }[size];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: sizeClasses.padding,
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: '9999px',
        color: config.color,
        fontSize: sizeClasses.font,
        fontWeight: 700,
        letterSpacing: '0.03em',
        boxShadow: `0 0 12px ${config.bg}`,
        fontFamily: 'var(--font-heading)'
      }}
    >
      <IconComponent size={sizeClasses.iconSize} color={config.color} />
      {showName && <span>{config.name}</span>}
    </div>
  );
};
