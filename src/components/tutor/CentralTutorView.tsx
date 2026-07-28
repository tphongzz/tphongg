import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ActiveTab, ChatMessage, RemediationQuestion, RecommendedTask } from '../../types';
import { getLearningAnalytics, generateDailyTasks, generateRemediationQuiz } from '../../services/trackingService';
import { askCentralTutor } from '../../services/geminiTutorService';
import { startListening, stopListening, speakText, stopSpeaking } from '../../services/speechService';
import { addXpToUser } from '../../services/storage';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { RankBadge } from '../ui/RankBadge';
import { 
  GraduationCap, 
  Sparkles, 
  Target, 
  Zap, 
  Award, 
  Send, 
  Mic, 
  MicOff, 
  CheckCircle, 
  ArrowRight, 
  HelpCircle, 
  RotateCw,
  TrendingUp,
  AlertTriangle,
  BookOpen
} from 'lucide-react';

interface CentralTutorViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onNavigate: (tab: ActiveTab) => void;
}

export const CentralTutorView: React.FC<CentralTutorViewProps> = ({
  user,
  onUpdateUser,
  onNavigate,
}) => {
  const analytics = getLearningAnalytics();
  const dailyTasks = generateDailyTasks(user);
  const remediationQuestions = generateRemediationQuiz(analytics);

  // Active view tab inside Tutor Hub
  const [tutorTab, setTutorTab] = useState<'overview' | 'remediation' | 'chat'>('overview');

  // Remediation Lab state
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [remediationScore, setRemediationScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // AI Tutor Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init_tutor',
      sender: 'tutor',
      text: `Xin chào ${user.name}! Thầy là Dr. NTP - Gia sư AI Tổng quản của bạn. Thầy nắm rõ toàn bộ dữ liệu học tập của bạn (Rank ${user.rank.toUpperCase()}, ${user.xp} XP). Bạn có câu hỏi nào cần thầy tư vấn hoặc giải đáp không?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMsg, setInputMsg] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isThinking]);

  // Handle Remediation Quiz Option Select
  const handleSelectRemediationOpt = (idx: number) => {
    if (showExplanation) return;
    setSelectedOpt(idx);
  };

  const handleConfirmRemediation = () => {
    if (selectedOpt === null) return;
    const currentQ = remediationQuestions[currentQuizIdx];
    if (selectedOpt === currentQ.correctAnswer) {
      setRemediationScore((prev) => prev + 1);
    }
    setShowExplanation(true);
  };

  const handleNextRemediation = () => {
    if (currentQuizIdx + 1 < remediationQuestions.length) {
      setCurrentQuizIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
      onUpdateUser(addXpToUser(40));
    }
  };

  // Handle Send Chat Message to Dr. NTP
  const handleSendTutorChat = async (customText?: string) => {
    const text = (customText || inputMsg).trim();
    if (!text || isThinking) return;

    setInputMsg('');
    stopListening();
    setIsListening(false);

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...chatMessages, userMsg];
    setChatMessages(updatedHistory);
    setIsThinking(true);

    const res = await askCentralTutor(user.geminiApiKey, text, user, updatedHistory);

    const tutorMsg: ChatMessage = {
      id: `tutor_${Date.now()}`,
      sender: 'tutor',
      text: res.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, tutorMsg]);
    setIsThinking(false);
    speakText(res.reply, 'male');
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      const ok = startListening(
        (transcript) => setInputMsg(transcript),
        () => setIsListening(false),
        () => setIsListening(false)
      );
      if (ok) setIsListening(true);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Banner Header */}
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem',
          background: 'linear-gradient(135deg, rgba(18, 24, 36, 0.95), rgba(59, 130, 246, 0.15))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div style={{ maxWidth: '650px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-cyan)' }}>
              <GraduationCap size={16} /> Smart Central AI Tutor
            </span>
            <RankBadge rank={user.rank} size="sm" />
          </div>

          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', lineHeight: 1.2 }}>
            Dr. NTP - <span className="gradient-text">Gia Sư AI Tổng Quản</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.6 }}>
            Phần mềm tự động phân tích toàn bộ từ vựng yếu, bài ngữ pháp hay sai &amp; điểm shadowing để đề xuất lộ trình chuẩn hóa cá nhân cho riêng bạn.
          </p>
        </div>

        {/* Sub Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.4rem', borderRadius: 'var(--radius-md)' }}>
          <button
            onClick={() => setTutorTab('overview')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              background: tutorTab === 'overview' ? 'var(--accent-cyan)' : 'transparent',
              color: tutorTab === 'overview' ? '#000' : 'var(--text-secondary)',
              fontWeight: 700
            }}
          >
            📊 Báo Cáo &amp; Lộ Trình
          </button>
          <button
            onClick={() => setTutorTab('remediation')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              background: tutorTab === 'remediation' ? 'var(--accent-purple)' : 'transparent',
              color: tutorTab === 'remediation' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 700
            }}
          >
            🔬 Phòng Sửa Điểm Yếu
          </button>
          <button
            onClick={() => setTutorTab('chat')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              background: tutorTab === 'chat' ? 'var(--accent-pink)' : 'transparent',
              color: tutorTab === 'chat' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 700
            }}
          >
            💬 Tư Vấn 1:1 Cùng Dr. NTP
          </button>
        </div>
      </div>

      {/* RENDER BASED ON TUTOR TAB */}
      {tutorTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Analytics Summary Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <Card hoverable={false}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Từ Vựng Cần Củng Cố</span>
                  <h3 style={{ fontSize: '1.6rem', color: 'var(--accent-red)', marginTop: '0.2rem' }}>
                    {analytics.weakWords.length} từ yếu
                  </h3>
                </div>
                <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(255, 77, 77, 0.15)', color: 'var(--accent-red)' }}>
                  <AlertTriangle size={22} />
                </div>
              </div>
            </Card>

            <Card hoverable={false}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Chủ Đề Ngữ Pháp Sai</span>
                  <h3 style={{ fontSize: '1.6rem', color: 'var(--accent-orange)', marginTop: '0.2rem' }}>
                    {analytics.weakTopics.length} chủ đề
                  </h3>
                </div>
                <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(255, 153, 0, 0.15)', color: 'var(--accent-orange)' }}>
                  <BookOpen size={22} />
                </div>
              </div>
            </Card>

            <Card hoverable={false}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Shadowing Accuracy</span>
                  <h3 style={{ fontSize: '1.6rem', color: 'var(--accent-green)', marginTop: '0.2rem' }}>
                    {analytics.overallAccuracy}%
                  </h3>
                </div>
                <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(0, 255, 136, 0.15)', color: 'var(--accent-green)' }}>
                  <TrendingUp size={22} />
                </div>
              </div>
            </Card>

            <Card hoverable={false}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lỗi Hội Thoại Đã Sửa</span>
                  <h3 style={{ fontSize: '1.6rem', color: 'var(--accent-pink)', marginTop: '0.2rem' }}>
                    {analytics.chatFixHistory.length} lỗi
                  </h3>
                </div>
                <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(255, 122, 26, 0.15)', color: 'var(--accent-pink)' }}>
                  <Sparkles size={22} />
                </div>
              </div>
            </Card>
          </div>

          {/* Daily Recommended Tasks Section */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <Target color="var(--accent-gold)" size={24} />
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Lộ Trình Đề Xuất Hàng Ngày (Daily Recommended Tasks)</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
              Dr. NTP tự động tổng hợp 4 nhiệm vụ ưu tiên nhất dựa trên các điểm yếu bạn mắc phải gần đây:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {dailyTasks.map((task) => (
                <Card key={task.id} hoverable>
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span className="badge" style={{ background: 'rgba(255, 215, 0, 0.15)', color: 'var(--accent-gold)' }}>
                          +{task.xpReward} XP
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          {task.category}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.05rem', marginBottom: '0.4rem', lineHeight: 1.4 }}>{task.title}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                        {task.description}
                      </p>
                    </div>

                    <Button variant="primary" size="sm" icon={<ArrowRight size={16} />} onClick={() => onNavigate(task.targetTab)}>
                      Thực Hiện Ngay
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Weakness Details Breakdowns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {/* Weak Words Panel */}
            <Card hoverable={false}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-red)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} /> Danh Sách Từ Vựng Cần Củng Cố
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {analytics.weakWords.map((w, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                    <span style={{ fontWeight: 600 }}>{w.term}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-red)', background: 'rgba(255,77,77,0.15)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                      Sai {w.count} lần
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Chat Error Log History */}
            <Card hoverable={false}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-pink)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} /> Lỗi Ngữ Pháp Đã Sửa Từ Adam &amp; Eva
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '240px', overflowY: 'auto' }}>
                {analytics.chatFixHistory.map((item) => (
                  <div key={item.id} style={{ padding: '0.75rem', background: 'rgba(255, 122, 26, 0.08)', borderLeft: '3px solid var(--accent-pink)', borderRadius: '6px' }}>
                    <div style={{ color: 'var(--accent-red)', textDecoration: 'line-through', fontSize: '0.85rem' }}>
                      "{item.original}"
                    </div>
                    <div style={{ color: 'var(--accent-green)', fontWeight: 600, fontSize: '0.9rem', margin: '0.2rem 0' }}>
                      &rarr; "{item.corrected}"
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{item.explanation}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* REMEDIATION LAB TAB */}
      {tutorTab === 'remediation' && (
        <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle color="var(--accent-purple)" /> Phòng Sửa Điểm Yếu (Remediation Lab)
            </h2>
            <span className="badge" style={{ background: 'rgba(30, 64, 175, 0.2)', color: 'var(--accent-purple)' }}>
              +40 XP Phần Thưởng
            </span>
          </div>

          {quizFinished ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <Award size={64} color="var(--accent-gold)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.8rem', color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>
                Hoàn Thành Bài Tập Sửa Điểm Yếu!
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Bạn đã làm đúng **{remediationScore} / {remediationQuestions.length}** câu hỏi và nhận được **+40 XP**!
              </p>
              <Button variant="gradient" onClick={() => { setQuizFinished(false); setCurrentQuizIdx(0); setSelectedOpt(null); setShowExplanation(false); setRemediationScore(0); }}>
                <RotateCw size={18} style={{ marginRight: '0.4rem' }} /> Làm Lại Lượt Mới
              </Button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Câu {currentQuizIdx + 1} trên {remediationQuestions.length} • Mục tiêu: {remediationQuestions[currentQuizIdx].targetItem}
              </div>

              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                {remediationQuestions[currentQuizIdx].question}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                {remediationQuestions[currentQuizIdx].options.map((optText, optIdx) => {
                  const isSelected = selectedOpt === optIdx;
                  const isCorrect = optIdx === remediationQuestions[currentQuizIdx].correctAnswer;

                  let bg = 'rgba(255, 255, 255, 0.04)';
                  let border = '1px solid var(--glass-border)';

                  if (showExplanation) {
                    if (isCorrect) {
                      bg = 'rgba(0, 255, 136, 0.2)';
                      border = '1.5px solid var(--accent-green)';
                    } else if (isSelected && !isCorrect) {
                      bg = 'rgba(255, 0, 85, 0.2)';
                      border = '1.5px solid #ff0055';
                    }
                  } else if (isSelected) {
                    bg = 'rgba(59, 130, 246, 0.15)';
                    border = '1.5px solid var(--accent-cyan)';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectRemediationOpt(optIdx)}
                      disabled={showExplanation}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        background: bg,
                        border,
                        textAlign: 'left',
                        color: 'var(--text-primary)',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      {optText}
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem', background: 'rgba(59, 130, 246, 0.08)' }}>
                  <strong style={{ color: 'var(--accent-cyan)' }}>💡 Giải thích chi tiết từ Dr. NTP: </strong>
                  <span style={{ color: 'var(--text-secondary)' }}>{remediationQuestions[currentQuizIdx].explanation}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {!showExplanation ? (
                  <Button variant="primary" onClick={handleConfirmRemediation} disabled={selectedOpt === null}>
                    Xác Nhận Đáp Án
                  </Button>
                ) : (
                  <Button variant="gradient" onClick={handleNextRemediation}>
                    {currentQuizIdx + 1 < remediationQuestions.length ? 'Câu Tiếp Theo' : 'Xem Kết Quả'} <ArrowRight size={18} style={{ marginLeft: '0.35rem' }} />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI TUTOR CHAT TAB */}
      {tutorTab === 'chat' && (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '620px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingBottom: '0.75rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--glass-border)' }}>
            <GraduationCap color="var(--accent-cyan)" size={24} />
            <h3 style={{ margin: 0 }}>Trò Chuyện 1:1 Với Dr. NTP - Central AI Master Tutor</h3>
          </div>

          <div ref={chatScrollRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
            {chatMessages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '1rem 1.25rem',
                    borderRadius: '16px',
                    background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--accent-purple), #3b5fce)' : 'rgba(255, 255, 255, 0.07)',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--glass-border)',
                    color: '#fff',
                    lineHeight: 1.6
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>
                    {msg.sender === 'user' ? user.name : 'Dr. NTP (AI Master Tutor)'} • {msg.timestamp}
                  </div>
                  <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                </div>
              </div>
            ))}

            {isThinking && (
              <div style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={16} className="pulse-glow" /> Dr. NTP đang phân tích dữ liệu và soạn câu trả lời...
              </div>
            )}
          </div>

          {/* Input controls */}
          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--glass-border)' }}>
            <button
              onClick={toggleMic}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: isListening ? 'var(--accent-pink)' : 'rgba(255,255,255,0.06)',
                border: '1px solid var(--glass-border)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendTutorChat(); }}
              placeholder="Đặt câu hỏi cho thầy Dr. NTP..."
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1.1rem',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />

            <Button variant="primary" onClick={() => handleSendTutorChat()} disabled={!inputMsg.trim() || isThinking}>
              Gửi <Send size={16} style={{ marginLeft: '0.35rem' }} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
