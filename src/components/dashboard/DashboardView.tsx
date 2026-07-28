import React from 'react';
import { UserProfile, ActiveTab } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { RankBadge } from '../ui/RankBadge';
import { ProgressBar } from '../ui/ProgressBar';
import { 
  Award, 
  BookOpen, 
  Bot, 
  Youtube, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  CheckCircle,
  GraduationCap
} from 'lucide-react';

interface DashboardViewProps {
  user: UserProfile;
  onNavigate: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ user, onNavigate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Welcome Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem',
          background: 'linear-gradient(135deg, rgba(18, 24, 36, 0.9), rgba(30, 64, 175, 0.2))',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-cyan)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <Sparkles size={14} /> Chào mừng trở lại
            </span>
            <RankBadge rank={user.rank} size="sm" />
          </div>

          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', lineHeight: 1.2 }}>
            Xin chào, <span className="gradient-text">{user.name}</span>!
          </h1>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {user.placementTestDone
              ? 'Hôm nay bạn muốn rèn luyện kỹ năng nào? Đừng quên trò chuyện 15 phút cùng AI Adam & Eva để giữ vững chuỗi Streak nhé!'
              : 'Bạn chưa làm Bài Test Phân Trình Độ! Hãy thực hiện test ngay để mở khóa Rank ban đầu và nhận lộ trình học cá nhân hóa.'}
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {!user.placementTestDone ? (
              <Button variant="gradient" size="lg" icon={<Award size={18} />} onClick={() => onNavigate('placement')}>
                Làm Bài Test Phân Rank Ngay
              </Button>
            ) : (
              <Button variant="primary" size="lg" icon={<Bot size={18} />} onClick={() => onNavigate('chatbot')}>
                Luyện Nói 1:1 Với Adam & Eva
              </Button>
            )}
            <Button variant="secondary" size="lg" icon={<Youtube size={18} />} onClick={() => onNavigate('shadowing')}>
              Luyện Youtube Shadowing
            </Button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div
          style={{
            position: 'absolute',
            right: '-40px',
            bottom: '-40px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <Card hoverable={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Từ Vựng Đã Thuộc</span>
              <h3 style={{ fontSize: '1.8rem', marginTop: '0.2rem' }}>{user.wordsLearned} từ</h3>
            </div>
            <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-cyan)' }}>
              <BookOpen size={22} />
            </div>
          </div>
          <ProgressBar current={user.wordsLearned} max={100} label="Mục tiêu tuần: 100 từ" color="var(--accent-cyan)" />
        </Card>

        <Card hoverable={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Chuỗi Ngày Streak</span>
              <h3 style={{ fontSize: '1.8rem', marginTop: '0.2rem', color: 'var(--accent-orange)' }}>{user.streak} ngày</h3>
            </div>
            <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(255, 153, 0, 0.15)', color: 'var(--accent-orange)' }}>
              <Flame size={22} />
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Giữ phong độ học mỗi ngày!</p>
        </Card>

        <Card hoverable={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bài Ngữ Pháp Hoàn Thành</span>
              <h3 style={{ fontSize: '1.8rem', marginTop: '0.2rem' }}>{user.grammarCompleted} bài</h3>
            </div>
            <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(30, 64, 175, 0.15)', color: 'var(--accent-purple)' }}>
              <GraduationCap size={22} />
            </div>
          </div>
          <ProgressBar current={user.grammarCompleted} max={20} label="Tiến độ level hiện tại" color="var(--accent-purple)" />
        </Card>

        <Card hoverable={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Video Shadowing</span>
              <h3 style={{ fontSize: '1.8rem', marginTop: '0.2rem', color: 'var(--accent-pink)' }}>{user.shadowingCompleted} video</h3>
            </div>
            <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(255, 122, 26, 0.15)', color: 'var(--accent-pink)' }}>
              <Youtube size={22} />
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Luyện giọng chuẩn bản ngữ</p>
        </Card>
      </div>

      {/* Featured Feature Modules Launcher */}
      <div>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Các Phân Hệ Rèn Luyện</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          <Card onClick={() => onNavigate('tutor')}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.8rem', borderRadius: '14px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))', color: '#fff' }}>
                <GraduationCap size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>AI Gia Sư Tổng Quản (Dr. NTP)</h3>
                  <ArrowRight size={18} color="var(--accent-cyan)" />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.5 }}>
                  Báo cáo học tập cá nhân hóa, đề xuất lộ trình hàng ngày, phòng sửa điểm yếu &amp; tư vấn 1:1 cùng Dr. NTP.
                </p>
              </div>
            </div>
          </Card>

          <Card onClick={() => onNavigate('chatbot')}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.8rem', borderRadius: '14px', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))', color: '#fff' }}>
                <Bot size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>Chatbot AI 1:1 (Adam & Eva)</h3>
                  <ArrowRight size={18} color="var(--accent-pink)" />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.5 }}>
                  Trò chuyện bằng Giọng nói (Voice STT/TTS). Lựa chọn Adam (Thân thiện) hoặc Eva (Academic). AI tự động sửa lỗi câu nói.
                </p>
              </div>
            </div>
          </Card>

          <Card onClick={() => onNavigate('shadowing')}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.8rem', borderRadius: '14px', background: 'linear-gradient(135deg, #ff0055, #ff9900)', color: '#fff' }}>
                <Youtube size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>YouTube Shadowing</h3>
                  <ArrowRight size={18} color="var(--accent-orange)" />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.5 }}>
                  Dán URL YouTube &rarr; Tách phụ đề &rarr; Thu âm nhại giọng &rarr; AI chấm điểm độ chính xác câu nói theo % Levenshtein.
                </p>
              </div>
            </div>
          </Card>

          <Card onClick={() => onNavigate('vocabulary')}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.8rem', borderRadius: '14px', background: 'linear-gradient(135deg, var(--accent-cyan), #2563eb)', color: '#000' }}>
                <BookOpen size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>Từ Vựng & Ngữ Pháp CEFR</h3>
                  <ArrowRight size={18} color="var(--accent-cyan)" />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.5 }}>
                  Thẻ lật 3D (Flashcards), nghe âm thanh chuẩn IPA, bài tập trắc nghiệm & mở rộng vốn từ A1-C2.
                </p>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};
