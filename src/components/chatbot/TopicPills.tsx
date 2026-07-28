import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';

interface TopicPillsProps {
  onSelectTopic: (topicText: string) => void;
}

export const TOPIC_SUGGESTIONS = [
  { id: 'coffee', label: '☕ Ordering Coffee', prompt: 'Hi! Can you help me practice ordering a coffee at Starbucks in English?' },
  { id: 'travel', label: '✈️ Airport & Travel', prompt: 'Hello! Let\'s pretend I am at an airport check-in counter and you are the airline staff.' },
  { id: 'interview', label: '💼 Job Interview', prompt: 'Hi Eva! I\'d like to practice answering common job interview questions in English.' },
  { id: 'movies', label: '🎬 Favorite Movies', prompt: 'Hey Adam! What kind of movies do you like? Let\'s talk about good films.' },
  { id: 'routine', label: '🌅 Daily Routine', prompt: 'Hi! Let\'s talk about our daily routines. What time do you usually wake up?' },
  { id: 'ielts', label: '🎯 IELTS Speaking', prompt: 'Hello! Can we practice IELTS Speaking Part 1 questions about hobbies?' },
];

export const TopicPills: React.FC<TopicPillsProps> = ({ onSelectTopic }) => {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <Sparkles size={14} color="var(--accent-gold)" />
        <span>Gợi ý chủ đề bắt đầu hội thoại nhanh:</span>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.4rem',
          scrollbarWidth: 'none',
        }}
      >
        {TOPIC_SUGGESTIONS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onSelectTopic(topic.prompt)}
            className="btn-secondary"
            style={{
              whiteSpace: 'nowrap',
              padding: '0.4rem 0.85rem',
              fontSize: '0.82rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.04)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--text-primary)',
            }}
          >
            {topic.label}
          </button>
        ))}
      </div>
    </div>
  );
};
