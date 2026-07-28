import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage } from '../../types';
import { askCentralTutor } from '../../services/geminiTutorService';
import { speakText } from '../../services/speechService';
import { GraduationCap, X, Send, Sparkles, Bot } from 'lucide-react';
import { Button } from '../ui/Button';

interface FloatingTutorWidgetProps {
  user: UserProfile;
}

export const FloatingTutorWidget: React.FC<FloatingTutorWidgetProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'floating_init',
      sender: 'tutor',
      text: `Xin chào ${user.name}! Cần thầy Dr. NTP hỗ trợ giải đáp điều gì ngay lúc này không?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMsg, setInputMsg] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking, isOpen]);

  const handleSend = async () => {
    const text = inputMsg.trim();
    if (!text || isThinking) return;

    setInputMsg('');
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHist = [...messages, userMsg];
    setMessages(newHist);
    setIsThinking(true);

    const res = await askCentralTutor(user.geminiApiKey, text, user, newHist);

    const tutorMsg: ChatMessage = {
      id: `tutor_${Date.now()}`,
      sender: 'tutor',
      text: res.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, tutorMsg]);
    setIsThinking(false);
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {/* Expanded Floating Chat Box */}
      {isOpen && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            bottom: '70px',
            right: 0,
            width: '360px',
            height: '480px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            animation: 'fadeInUp 0.3s ease-out',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.4), rgba(59, 130, 246, 0.2))',
              borderBottom: '1px solid var(--glass-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={20} color="var(--accent-cyan)" />
              <strong style={{ fontSize: '0.95rem' }}>Dr. NTP - Floating AI Tutor</strong>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Body */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '12px',
                  background: m.sender === 'user' ? 'var(--accent-purple)' : 'rgba(255, 255, 255, 0.08)',
                  fontSize: '0.85rem',
                  lineHeight: 1.5
                }}
              >
                {m.text}
              </div>
            ))}
            {isThinking && (
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Sparkles size={14} className="pulse-glow" /> Dr. NTP đang suy nghĩ...
              </div>
            )}
          </div>

          {/* Footer Input */}
          <div style={{ padding: '0.75rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Hỏi nhanh thầy Dr. NTP..."
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <Button variant="primary" size="sm" onClick={handleSend} disabled={!inputMsg.trim() || isThinking}>
              <Send size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
          transition: 'transform 0.2s ease',
          transform: isOpen ? 'scale(0.9)' : 'scale(1)'
        }}
        title="Trò chuyện nhanh với AI Gia Sư Dr. NTP"
      >
        <GraduationCap size={28} />
      </button>
    </div>
  );
};
