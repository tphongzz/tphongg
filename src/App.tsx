import React, { useState } from 'react';
import { UserProfile, ActiveTab } from './types';
import { getUserProfile, saveUserProfile } from './services/storage';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { SettingsModal } from './components/modals/SettingsModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { PlacementTestView } from './components/placement/PlacementTestView';
import { VocabularyView } from './components/vocabulary/VocabularyView';
import { GrammarView } from './components/grammar/GrammarView';
import { ChatbotView } from './components/chatbot/ChatbotView';
import { ShadowingView } from './components/shadowing/ShadowingView';
import { CentralTutorView } from './components/tutor/CentralTutorView';
import { MiniGamesHub } from './components/minigames/MiniGamesHub';
import { ExamCenterView } from './components/exam/ExamCenterView';
import { FloatingTutorWidget } from './components/tutor/FloatingTutorWidget';
import { RankNotificationToast } from './components/gamification/RankNotificationToast';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Bot, Youtube, GraduationCap, Settings as SettingsIcon } from 'lucide-react';

export const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile>(getUserProfile());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ message: string; subText?: string; type?: 'xp' | 'rank' } | null>(null);

  const handleUpdateUser = (updatedUser: UserProfile) => {
    const prevRank = user.rank;
    const prevXp = user.xp;
    setUser(updatedUser);
    saveUserProfile(updatedUser);

    if (updatedUser.rank !== prevRank) {
      setToastMessage({
        message: `THĂNG RANK MỚI: ${updatedUser.rank.toUpperCase()}! 🏆`,
        subText: 'Chúc mừng bạn đã chinh phục nấc thang học tập mới!',
        type: 'rank'
      });
    } else if (updatedUser.xp > prevXp) {
      const gained = updatedUser.xp - prevXp;
      setToastMessage({
        message: `+${gained} XP Nhận Được! ⚡`,
        subText: `Tổng tích lũy: ${updatedUser.xp} XP`,
        type: 'xp'
      });
    }
  };

  const handleSaveApiKey = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    saveUserProfile(updatedUser);
  };

  const renderModuleContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView user={user} onNavigate={setActiveTab} />;

      case 'minigames':
        return (
          <MiniGamesHub
            user={user}
            onUpdateUser={handleUpdateUser}
          />
        );

      case 'exams':
        return (
          <ExamCenterView
            user={user}
            onUpdateUser={handleUpdateUser}
          />
        );

      case 'placement':
        return (
          <PlacementTestView
            user={user}
            onUpdateUser={handleUpdateUser}
            onNavigate={setActiveTab}
          />
        );

      case 'vocabulary':
        return (
          <VocabularyView
            user={user}
            onUpdateUser={handleUpdateUser}
          />
        );

      case 'grammar':
        return (
          <GrammarView
            user={user}
            onUpdateUser={handleUpdateUser}
          />
        );

      case 'chatbot':
        return (
          <ChatbotView
            user={user}
            onUpdateUser={handleUpdateUser}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        );

      case 'shadowing':
        return (
          <ShadowingView
            user={user}
            onUpdateUser={handleUpdateUser}
          />
        );

      case 'tutor':
        return (
          <CentralTutorView
            user={user}
            onUpdateUser={handleUpdateUser}
            onNavigate={setActiveTab}
          />
        );

      case 'settings':
        return (
          <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <SettingsIcon size={28} color="var(--accent-cyan)" />
              <h2 style={{ margin: 0 }}>Cấu Hình Hệ Thống</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Quản lý Gemini API Key của bạn để kết nối với các trợ lý AI Adam, Eva và AI Gia Sư.
            </p>
            <Card hoverable={false}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0 }}>Gemini API Key</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {user.geminiApiKey ? 'Đã lưu API Key' : 'Chưa cấu hình API Key'}
                  </span>
                </div>
                <Button variant="primary" size="sm" onClick={() => setIsSettingsOpen(true)}>
                  Thay đổi API Key
                </Button>
              </div>
            </Card>
          </div>
        );

      default:
        return <DashboardView user={user} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      {/* Navigation Sidebar */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Container */}
      <div className="main-content">
        <Header user={user} onOpenSettings={() => setIsSettingsOpen(true)} />
        
        <main className="page-container">
          {renderModuleContent()}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        user={user}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaveApiKey={handleSaveApiKey}
      />

      {/* Rank / XP Notification Toast */}
      {toastMessage && (
        <RankNotificationToast
          message={toastMessage.message}
          subText={toastMessage.subText}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Floating AI Tutor Widget */}
      <FloatingTutorWidget user={user} />
    </div>
  );
};

export default App;
