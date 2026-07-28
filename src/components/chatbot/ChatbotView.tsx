import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage } from '../../types';
import { PersonaType, sendMessageToGemini } from '../../services/geminiService';
import { isSTTSupported, startListening, stopListening, speakText, stopSpeaking } from '../../services/speechService';
import { addXpToUser } from '../../services/storage';
import { recordChatGrammarFix } from '../../services/trackingService';
import { PersonaCard } from './PersonaCard';
import { TopicPills } from './TopicPills';
import { ChatBubble } from './ChatBubble';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Send, Mic, MicOff, Volume2, Trash2, Key, Sparkles, Bot, AlertCircle } from 'lucide-react';

interface ChatbotViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onOpenSettings: () => void;
}

const INITIAL_MESSAGES: Record<PersonaType, ChatMessage[]> = {
  adam: [
    {
      id: 'init_adam',
      sender: 'adam',
      text: "Hey! I'm Adam, your friendly practice partner. What's on your mind today? Let's chat about anything you like!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ],
  eva: [
    {
      id: 'init_eva',
      sender: 'eva',
      text: "Good day! I am Eva, your dedicated English tutor. I am here to help you refine your grammar, vocabulary, and articulation. How may I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ],
};

export const ChatbotView: React.FC<ChatbotViewProps> = ({
  user,
  onUpdateUser,
  onOpenSettings,
}) => {
  const [persona, setPersona] = useState<PersonaType>('adam');
  const [chatHistory, setChatHistory] = useState<Record<PersonaType, ChatMessage[]>>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoReadTts, setAutoReadTts] = useState(true);
  const [sttError, setSttError] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const currentMessages = chatHistory[persona];

  // Auto scroll to bottom of chat when new message arrives
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentMessages, isSending]);

  const handleSwitchPersona = (newPersona: PersonaType) => {
    stopSpeaking();
    stopListening();
    setIsListening(false);
    setPersona(newPersona);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputText).trim();
    if (!messageText || isSending) return;

    setInputText('');
    stopListening();
    setIsListening(false);

    const userMsgId = `user_${Date.now()}`;
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: messageText,
      timestamp: timeString,
    };

    // Update history locally first
    const updatedUserHistory = [...chatHistory[persona], newUserMsg];
    setChatHistory((prev) => ({
      ...prev,
      [persona]: updatedUserHistory,
    }));

    setIsSending(true);

    // Call Gemini API Service
    const aiResponse = await sendMessageToGemini(
      user.geminiApiKey,
      persona,
      messageText,
      updatedUserHistory
    );

    if (aiResponse.grammarFix) {
      recordChatGrammarFix(
        aiResponse.grammarFix.original,
        aiResponse.grammarFix.corrected,
        aiResponse.grammarFix.explanation
      );
    }

    const aiMsgId = `${persona}_${Date.now()}`;
    const aiMsg: ChatMessage = {
      id: aiMsgId,
      sender: persona,
      text: aiResponse.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      grammarFix: aiResponse.grammarFix,
    };

    setChatHistory((prev) => ({
      ...prev,
      [persona]: [...prev[persona], aiMsg],
    }));

    setIsSending(false);

    // Auto read response via TTS if enabled
    if (autoReadTts) {
      speakText(aiResponse.reply, persona === 'adam' ? 'male' : 'female');
    }

    // Reward XP every 3 user messages
    const userMsgCount = updatedUserHistory.filter((m) => m.sender === 'user').length;
    if (userMsgCount > 0 && userMsgCount % 3 === 0) {
      const updatedUser = addXpToUser(15);
      onUpdateUser(updatedUser);
    }
  };

  const toggleListening = () => {
    setSttError(null);
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      const success = startListening(
        (transcript) => {
          setInputText(transcript);
        },
        (err) => {
          setSttError(err);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
      if (success) {
        setIsListening(true);
      }
    }
  };

  const handleClearChat = () => {
    stopSpeaking();
    setChatHistory((prev) => ({
      ...prev,
      [persona]: INITIAL_MESSAGES[persona],
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Header Title Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 className="gradient-text" style={{ margin: 0, fontSize: '1.8rem' }}>
              Phân Hệ Chatbot AI 1:1 (Adam &amp; Eva)
            </h1>
            <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-cyan)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              PHASE 3
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.92rem' }}>
            Luyện giao tiếp tiếng Anh qua Giọng nói (Web Speech STT/TTS) &amp; Nhận phản hồi sửa lỗi tức thì từ AI.
          </p>
        </div>

        {/* API Key Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {!user.geminiApiKey ? (
            <div
              onClick={onOpenSettings}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 153, 0, 0.1)',
                border: '1px solid rgba(255, 153, 0, 0.3)',
                color: 'var(--accent-orange)',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              <AlertCircle size={15} />
              <span>Đang dùng Smart Offline Fallback (Bấm để thêm Gemini API Key)</span>
            </div>
          ) : (
            <div
              onClick={onOpenSettings}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0, 255, 136, 0.1)',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                color: 'var(--accent-green)',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              <Key size={15} />
              <span>Gemini 1.5 Flash Connected</span>
            </div>
          )}
        </div>
      </div>

      {/* Persona Selection Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <PersonaCard
          persona="adam"
          isSelected={persona === 'adam'}
          onSelect={handleSwitchPersona}
        />
        <PersonaCard
          persona="eva"
          isSelected={persona === 'eva'}
          onSelect={handleSwitchPersona}
        />
      </div>

      {/* Main Chat Container */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '620px' }}>
        {/* Chat Control Toolbar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '0.75rem',
            marginBottom: '0.75rem',
            borderBottom: '1px solid var(--glass-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <Bot size={18} color={persona === 'adam' ? 'var(--accent-cyan)' : 'var(--accent-pink)'} />
            <span>
              Đang trò chuyện cùng <strong>{persona === 'adam' ? 'Adam' : 'Eva'}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={autoReadTts}
                onChange={(e) => setAutoReadTts(e.target.checked)}
                style={{ accentColor: 'var(--accent-cyan)' }}
              />
              Tự động phát âm (TTS)
            </label>

            <button
              onClick={handleClearChat}
              title="Xóa lịch sử chat"
              style={{
                background: 'transparent',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.8rem',
              }}
            >
              <Trash2 size={15} />
              Xóa chat
            </button>
          </div>
        </div>

        {/* Quick Topic Starter Pills */}
        <TopicPills onSelectTopic={(prompt) => handleSendMessage(prompt)} />

        {/* Scrollable Chat Messages Container */}
        <div
          ref={chatContainerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {currentMessages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} userName={user.name} />
          ))}

          {/* Typing Indicator */}
          {isSending && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>
              <Sparkles size={16} className="pulse-glow" />
              <span>{persona === 'adam' ? 'Adam' : 'Eva'} đang suy nghĩ &amp; phân tích câu...</span>
            </div>
          )}
        </div>

        {/* Error notification for STT */}
        {sttError && (
          <div style={{ color: '#ff4d4d', fontSize: '0.8rem', padding: '0.4rem', borderRadius: '4px', background: 'rgba(255, 77, 77, 0.1)', marginBottom: '0.5rem' }}>
            {sttError}
          </div>
        )}

        {/* Bottom Input Controls Bar */}
        <div
          style={{
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--glass-border)',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
          }}
        >
          {/* Microphone STT Button */}
          <button
            onClick={toggleListening}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: isListening
                ? 'linear-gradient(135deg, #ff0055, #ff7a1a)'
                : 'rgba(255, 255, 255, 0.06)',
              border: `1px solid ${isListening ? 'var(--accent-pink)' : 'var(--glass-border)'}`,
              color: isListening ? '#fff' : 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: isListening ? '0 0 15px rgba(255, 122, 26, 0.6)' : 'none',
              animation: isListening ? 'pulseGlow 1.5s infinite' : 'none',
            }}
            title={isListening ? 'Đang thu âm... Bấm để dừng' : 'Bấm để nói (Voice Input STT)'}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder={
              isListening
                ? '🎙️ Đang lắng nghe giọng nói tiếng Anh của bạn...'
                : `Nhắn tin tiếng Anh với ${persona === 'adam' ? 'Adam' : 'Eva'}...`
            }
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1.1rem',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />

          {/* Send Button */}
          <Button
            variant="primary"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isSending}
            style={{
              height: '46px',
              padding: '0 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>Gửi</span>
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
