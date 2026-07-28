import React, { useState } from 'react';
import { UserProfile, MiniGameType } from '../../types';
import { MINI_GAMES_LIST } from '../../data/miniGamesData';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  Gamepad2,
  Grid,
  Shuffle,
  Zap,
  Headphones,
  Layers,
  Swords,
  Table,
  Activity,
  Mic,
  RotateCw,
  Trophy,
  ArrowLeft,
  Flame
} from 'lucide-react';

// Import subgame components
import { WordMatchGame } from './games/WordMatchGame';
import { WordUnscrambleGame } from './games/WordUnscrambleGame';
import { SpeedQuizGame } from './games/SpeedQuizGame';
import { ListeningHeroGame } from './games/ListeningHeroGame';
import { SentenceBuilderGame } from './games/SentenceBuilderGame';
import { GrammarBossGame } from './games/GrammarBossGame';
import { CrosswordGame } from './games/CrosswordGame';
import { WordRunnerGame } from './games/WordRunnerGame';
import { PronunciationNinjaGame } from './games/PronunciationNinjaGame';
import { MemoryFlipGame } from './games/MemoryFlipGame';

interface MiniGamesHubProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Grid,
  Shuffle,
  Zap,
  Headphones,
  Layers,
  Swords,
  Table,
  Activity,
  Mic,
  RotateCw
};

export const MiniGamesHub: React.FC<MiniGamesHubProps> = ({ user, onUpdateUser }) => {
  const [selectedGame, setSelectedGame] = useState<MiniGameType | null>(null);

  const handleGameComplete = (earnedXp: number) => {
    if (earnedXp > 0) {
      onUpdateUser({
        ...user,
        xp: user.xp + earnedXp
      });
    }
  };

  const renderActiveGame = () => {
    switch (selectedGame) {
      case 'match':
        return <WordMatchGame onComplete={handleGameComplete} onBack={() => setSelectedGame(null)} />;
      case 'unscramble':
        return <WordUnscrambleGame onComplete={handleGameComplete} onBack={() => setSelectedGame(null)} />;
      case 'speed':
        return <SpeedQuizGame onComplete={handleGameComplete} onBack={() => setSelectedGame(null)} />;
      case 'listening':
        return <ListeningHeroGame onComplete={handleGameComplete} onBack={() => setSelectedGame(null)} />;
      case 'builder':
        return <SentenceBuilderGame onComplete={handleGameComplete} onBack={() => setSelectedGame(null)} />;
      case 'boss':
        return <GrammarBossGame onComplete={handleGameComplete} onBack={() => setSelectedGame(null)} />;
      case 'crossword':
        return <CrosswordGame onComplete={handleGameComplete} onBack={() => setSelectedGame(null)} />;
      case 'runner':
        return <WordRunnerGame onComplete={handleGameComplete} onBack={() => setSelectedGame(null)} />;
      case 'ninja':
        return <PronunciationNinjaGame onComplete={handleGameComplete} onBack={() => setSelectedGame(null)} />;
      case 'memory':
        return <MemoryFlipGame onComplete={handleGameComplete} onBack={() => setSelectedGame(null)} />;
      default:
        return null;
    }
  };

  if (selectedGame) {
    return (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <Button variant="ghost" size="sm" onClick={() => setSelectedGame(null)}>
            <ArrowLeft size={16} style={{ marginRight: '0.4rem' }} /> Quay lại Arcade Hub
          </Button>
        </div>
        {renderActiveGame()}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(112, 0, 255, 0.2), rgba(59, 130, 246, 0.15))',
          border: '1px solid rgba(112, 0, 255, 0.3)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Gamepad2 size={36} color="var(--accent-cyan)" />
            <h1 style={{ margin: 0, fontSize: '2rem', background: 'linear-gradient(135deg, #3b82f6, #7000FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              10 Mini Games Arcade Tương Tác
            </h1>
          </div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', maxWidth: '650px', fontSize: '0.95rem' }}>
            Vừa chơi vừa học! Thách thức bản thân qua 10 trò chơi rèn luyện Từ vựng, Ngữ pháp, Phản xạ nghe và Phát âm chuẩn bản ngữ để tích lũy hàng ngàn XP!
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Card hoverable={false} style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.3)' }}>
            <Trophy size={24} color="#FFB800" />
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>TỔNG XP HỌC TẬP</span>
              <strong style={{ fontSize: '1.2rem', color: '#FFB800' }}>{user.xp} XP</strong>
            </div>
          </Card>
          <Card hoverable={false} style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.3)' }}>
            <Flame size={24} color="#FF007A" />
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>STREAK HÀNG NGÀY</span>
              <strong style={{ fontSize: '1.2rem', color: '#FF007A' }}>{user.streak} Ngày</strong>
            </div>
          </Card>
        </div>
      </div>

      {/* Mini-Games Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {MINI_GAMES_LIST.map((game) => {
          const IconComponent = ICON_MAP[game.iconName] || Gamepad2;
          return (
            <Card
              key={game.id}
              hoverable
              onClick={() => setSelectedGame(game.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.5rem',
                border: `1px solid ${game.color}40`,
                background: `radial-gradient(circle at top left, ${game.color}15, transparent 70%)`,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: `${game.color}20`,
                      border: `1px solid ${game.color}60`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconComponent size={26} color={game.color} />
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: `${game.color}20`,
                      color: game.color,
                      border: `1px solid ${game.color}50`
                    }}
                  >
                    {game.badge}
                  </span>
                </div>

                <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.15rem' }}>{game.title}</h3>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 500 }}>
                  {game.subtitle}
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {game.description}
                </p>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+25 ~ +50 XP / Lượt</span>
                <Button variant="primary" size="sm" style={{ background: `linear-gradient(135deg, ${game.color}, #000)`, border: 'none' }}>
                  CHƠI NGAY 🎮
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
