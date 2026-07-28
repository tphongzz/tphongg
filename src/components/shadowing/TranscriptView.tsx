import React, { useState } from 'react';
import { TranscriptLine } from '../../types';
import { Play, Languages, Volume2, Search } from 'lucide-react';
import { speakText } from '../../services/speechService';

interface TranscriptViewProps {
  transcript: TranscriptLine[];
  currentTime: number;
  selectedLineId: string | null;
  onSelectLine: (line: TranscriptLine) => void;
  onWordClick?: (word: string) => void;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({
  transcript,
  currentTime,
  selectedLineId,
  onSelectLine,
  onWordClick,
}) => {
  const [showTranslation, setShowTranslation] = useState<boolean>(true);

  // Format seconds into MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderClickableWords = (text: string) => {
    if (!onWordClick) return text;
    const words = text.split(/(\s+|[.,!?;:"'()]+)/);
    return words.map((chunk, idx) => {
      const isWord = /^[a-zA-Z0-9]+$/.test(chunk);
      if (isWord) {
        return (
          <span
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              onWordClick(chunk);
            }}
            title={`Click để tra từ "${chunk}"`}
            style={{
              cursor: 'pointer',
              borderBottom: '1px dotted rgba(59, 130, 246, 0.4)',
              transition: 'all 0.15s ease',
            }}
            className="hover:text-cyan-400 hover:bg-cyan-500/10 rounded px-0.5"
          >
            {chunk}
          </span>
        );
      }
      return <span key={idx}>{chunk}</span>;
    });
  };

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '620px',
        padding: '1.25rem',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Phụ Đề Tương Tác (Transcript)</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {transcript.length} câu • Click câu để tua • Click từ để tra từ điển 1-click
          </span>
        </div>

        <button
          onClick={() => setShowTranslation(!showTranslation)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: showTranslation ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.06)',
            color: showTranslation ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            border: showTranslation ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0.4rem 0.75rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 500,
            transition: 'all 0.2s ease',
          }}
        >
          <Languages size={15} />
          {showTranslation ? 'Ẩn Dịch Việt' : 'Hiện Dịch Việt'}
        </button>
      </div>

      {/* Interactive Transcript Lines Scroll Container */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          paddingRight: '0.5rem',
        }}
      >
        {transcript.map((line) => {
          const isActiveTime = currentTime >= line.startTime && currentTime < line.endTime;
          const isSelected = selectedLineId === line.id;

          return (
            <div
              key={line.id}
              onClick={() => onSelectLine(line)}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                cursor: 'pointer',
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(30, 64, 175, 0.15))'
                  : isActiveTime
                  ? 'rgba(59, 130, 246, 0.08)'
                  : 'rgba(255, 255, 255, 0.03)',
                border: isSelected
                  ? '1px solid var(--accent-cyan)'
                  : isActiveTime
                  ? '1px solid rgba(59, 130, 246, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.06)',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span
                  className="badge"
                  style={{
                    fontSize: '0.75rem',
                    background: isSelected ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.08)',
                    color: isSelected ? '#000' : 'var(--text-secondary)',
                  }}
                >
                  {formatTime(line.startTime)} - {formatTime(line.endTime)}
                </span>

                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(line.text);
                    }}
                    title="Nghe phát âm chuẩn TTS"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '0.2rem',
                    }}
                  >
                    <Volume2 size={15} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLine(line);
                    }}
                    title="Tua video tới câu này"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-cyan)',
                      cursor: 'pointer',
                      padding: '0.2rem',
                    }}
                  >
                    <Play size={15} />
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.5, margin: 0, color: '#fff' }}>
                {renderClickableWords(line.text)}
              </p>

              {showTranslation && line.translation && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.3rem', marginBottom: 0 }}>
                  {line.translation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
