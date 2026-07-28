import React, { useState } from 'react';
import { ChatMessage } from '../../types';
import { Volume2, Sparkles, Check, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { speakText } from '../../services/speechService';

interface ChatBubbleProps {
  message: ChatMessage;
  userName: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, userName }) => {
  const isUser = message.sender === 'user';
  const isAdam = message.sender === 'adam';
  const isEva = message.sender === 'eva';
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFixDetails, setShowFixDetails] = useState(true);

  const handleSpeak = () => {
    setIsPlaying(true);
    const gender = isAdam ? 'male' : isEva ? 'female' : 'male';
    speakText(message.text, gender, 1.0, () => {
      setIsPlaying(false);
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: '0.75rem',
        marginBottom: '1.25rem',
      }}
    >
      {/* Sender Avatar */}
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          flexShrink: 0,
          background: isUser
            ? 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))'
            : isAdam
            ? 'linear-gradient(135deg, #3b82f6, #0077ff)'
            : 'linear-gradient(135deg, #ff7a1a, #1e40af)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          boxShadow: isUser
            ? '0 2px 10px rgba(255, 122, 26, 0.3)'
            : isAdam
            ? '0 2px 10px rgba(59, 130, 246, 0.3)'
            : '0 2px 10px rgba(255, 122, 26, 0.3)',
        }}
      >
        {isUser ? '👤' : isAdam ? '👨‍💼' : '👩‍🏫'}
      </div>

      {/* Bubble Content Container */}
      <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
        {/* Name & Time Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
            {isUser ? userName : isAdam ? 'Adam (Bạn Học)' : 'Eva (Gia Sư)'}
          </span>
          <span>{message.timestamp}</span>
        </div>

        {/* Text Message Card */}
        <div
          style={{
            padding: '0.9rem 1.25rem',
            borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
            background: isUser
              ? 'linear-gradient(135deg, rgba(30, 64, 175, 0.25), rgba(255, 122, 26, 0.25))'
              : 'rgba(255, 255, 255, 0.05)',
            border: isUser
              ? '1px solid rgba(255, 122, 26, 0.3)'
              : `1px solid ${isAdam ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 122, 26, 0.2)'}`,
            backdropFilter: 'blur(10px)',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            lineHeight: 1.5,
            position: 'relative',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
            <span>{message.text}</span>
            <button
              onClick={handleSpeak}
              title="Phát âm thanh TTS"
              style={{
                background: 'transparent',
                color: isPlaying ? 'var(--accent-cyan)' : 'var(--text-muted)',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s',
              }}
            >
              <Volume2 size={18} />
            </button>
          </div>
        </div>

        {/* Instant Grammar Fix Card (if AI detected error in user's message) */}
        {message.grammarFix && (
          <div
            style={{
              marginTop: '0.6rem',
              width: '100%',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 153, 0, 0.08)',
              border: '1px solid rgba(255, 153, 0, 0.3)',
              padding: '0.75rem 1rem',
              fontSize: '0.85rem',
              boxShadow: '0 4px 12px rgba(255, 153, 0, 0.1)',
            }}
          >
            <div
              onClick={() => setShowFixDetails(!showFixDetails)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                color: 'var(--accent-orange)',
                fontWeight: 600,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={16} />
                <span>Gợi ý sửa lỗi ngữ pháp (Instant Fix)</span>
              </div>
              {showFixDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>

            {showFixDetails && (
              <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ color: '#ff6b6b', textDecoration: 'line-through', fontSize: '0.82rem' }}>
                  ❌ {message.grammarFix.original}
                </div>
                <div style={{ color: 'var(--accent-green)', fontWeight: 600, fontSize: '0.88rem' }}>
                  ✅ {message.grammarFix.corrected}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontStyle: 'italic', marginTop: '0.2rem' }}>
                  💡 {message.grammarFix.explanation}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
