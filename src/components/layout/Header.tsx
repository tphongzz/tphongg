import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { RankBadge } from '../ui/RankBadge';
import { ProgressBar } from '../ui/ProgressBar';
import { Flame, Key, Sparkles, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  user: UserProfile;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onOpenSettings }) => {
  // Calculate XP threshold for current rank
  const nextRankXp = 1000;

  return (
    <header
      style={{
        height: '70px',
        borderBottom: '1px solid var(--glass-border)',
        backgroundColor: 'rgba(10, 13, 20, 0.8)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      {/* Brand Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
          }}
        >
          <Sparkles size={20} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.2rem', margin: 0, lineHeight: 1.1 }}>
            ENGLISH <span className="gradient-text">NTP</span>
          </h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Nền tảng Học Tiếng Anh AI</span>
        </div>
      </div>

      {/* Stats Bar: Rank, XP, Streak */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* User Rank */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Rank:</span>
          <RankBadge rank={user.rank} size="md" />
        </div>

        {/* XP Progress */}
        <div style={{ width: '160px' }}>
          <ProgressBar
            current={user.xp}
            max={nextRankXp}
            label={`XP: ${user.xp}/${nextRankXp}`}
            color="var(--accent-purple)"
            height={8}
          />
        </div>

        {/* Streak Counter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.75rem',
            backgroundColor: 'rgba(255, 153, 0, 0.12)',
            border: '1px solid rgba(255, 153, 0, 0.3)',
            borderRadius: '9999px',
            color: 'var(--accent-orange)',
            fontSize: '0.85rem',
            fontWeight: 700
          }}
          title="Chuỗi ngày học liên tục"
        >
          <Flame size={18} color="var(--accent-orange)" style={{ filter: 'drop-shadow(0 0 6px rgba(255, 153, 0, 0.8))' }} />
          <span>{user.streak} ngày</span>
        </div>

        {/* Gemini API Key Indicator */}
        <Button
          variant={user.geminiApiKey ? 'secondary' : 'gradient'}
          size="sm"
          icon={<Key size={14} />}
          onClick={onOpenSettings}
        >
          {user.geminiApiKey ? 'API Configured' : 'Set Gemini API Key'}
        </Button>

        {/* User Avatar */}
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 0 10px rgba(30, 64, 175, 0.4)'
          }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};
