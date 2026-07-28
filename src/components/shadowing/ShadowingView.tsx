import React, { useState } from 'react';
import { UserProfile, ShadowingLesson, TranscriptLine, CEFRLevel } from '../../types';
import { CURATED_SHADOWING_LESSONS } from '../../data/shadowingData';
import { YouTubePlayer } from './YouTubePlayer';
import { TranscriptView } from './TranscriptView';
import { ShadowingPracticeCard } from './ShadowingPracticeCard';
import { WordLookupModal } from '../ui/WordLookupModal';
import { extractYouTubeId, fetchOrGenerateTranscript } from '../../services/youtubeTranscriptService';
import { trackShadowingScore } from '../../services/trackingService';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Youtube, Search, Link as LinkIcon, Sparkles, Filter, ArrowLeft, Play, CheckCircle } from 'lucide-react';

interface ShadowingViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export const ShadowingView: React.FC<ShadowingViewProps> = ({ user, onUpdateUser }) => {
  const [selectedLesson, setSelectedLesson] = useState<ShadowingLesson | null>(CURATED_SHADOWING_LESSONS[0]);
  const [selectedLine, setSelectedLine] = useState<TranscriptLine | null>(CURATED_SHADOWING_LESSONS[0].transcript[0]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [seekTime, setSeekTime] = useState<number | null>(null);
  const [activeLookupWord, setActiveLookupWord] = useState<string | null>(null);

  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [isLoadingCustom, setIsLoadingCustom] = useState<boolean>(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSelectLesson = (lesson: ShadowingLesson) => {
    setSelectedLesson(lesson);
    if (lesson.transcript && lesson.transcript.length > 0) {
      setSelectedLine(lesson.transcript[0]);
      setSeekTime(lesson.transcript[0].startTime);
    }
  };

  const handleSelectLine = (line: TranscriptLine) => {
    setSelectedLine(line);
    setSeekTime(line.startTime);
  };

  const handleNextLine = () => {
    if (!selectedLesson || !selectedLine) return;
    const currentIndex = selectedLesson.transcript.findIndex((l) => l.id === selectedLine.id);
    if (currentIndex !== -1 && currentIndex < selectedLesson.transcript.length - 1) {
      const next = selectedLesson.transcript[currentIndex + 1];
      setSelectedLine(next);
      setSeekTime(next.startTime);
    }
  };

  const handlePrevLine = () => {
    if (!selectedLesson || !selectedLine) return;
    const currentIndex = selectedLesson.transcript.findIndex((l) => l.id === selectedLine.id);
    if (currentIndex > 0) {
      const prev = selectedLesson.transcript[currentIndex - 1];
      setSelectedLine(prev);
      setSeekTime(prev.startTime);
    }
  };

  const handleCustomUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError(null);

    const videoId = extractYouTubeId(customUrlInput);
    if (!videoId) {
      setUrlError('URL YouTube không hợp lệ. Vui lòng kiểm tra lại link YouTube.');
      return;
    }

    setIsLoadingCustom(true);
    try {
      const customLesson = await fetchOrGenerateTranscript(videoId, user.geminiApiKey);
      setSelectedLesson(customLesson);
      if (customLesson.transcript.length > 0) {
        setSelectedLine(customLesson.transcript[0]);
        setSeekTime(customLesson.transcript[0].startTime);
      }
      setCustomUrlInput('');
    } catch (err: any) {
      setUrlError('Không thể tạo phụ đề cho URL này. Hãy thử lại.');
    } finally {
      setIsLoadingCustom(false);
    }
  };

  const handleAwardXp = (score: number) => {
    const xpBonus = 20;
    if (selectedLesson) {
      trackShadowingScore(selectedLesson.title, score);
    }
    const updatedUser = {
      ...user,
      xp: user.xp + xpBonus,
      shadowingCompleted: user.shadowingCompleted + 1,
    };
    onUpdateUser(updatedUser);
  };

  const filteredLessons = CURATED_SHADOWING_LESSONS.filter((lesson) => {
    const matchesLevel = selectedLevel === 'all' || lesson.level === selectedLevel;
    const matchesQuery =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesQuery;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Word Lookup Modal */}
      {activeLookupWord && (
        <WordLookupModal
          word={activeLookupWord}
          onClose={() => setActiveLookupWord(null)}
          merriamWebsterApiKey={user.merriamWebsterApiKey}
        />
      )}

      {/* Top Banner Header */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(18, 24, 36, 0.95), rgba(255, 122, 26, 0.15))',
          border: '1px solid rgba(255, 122, 26, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <Youtube size={26} color="var(--accent-pink)" />
            <h1 style={{ fontSize: '1.8rem', margin: 0 }}>YouTube Shadowing English</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
            Nhập URL YouTube hoặc chọn bài học mẫu &rarr; Xem phụ đề tương tác &rarr; Click từ vựng tra từ điển 1-click &rarr; Thu âm nhại giọng &rarr; AI Chấm điểm phát âm chuẩn %!
          </p>
        </div>

        {selectedLesson && (
          <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => setSelectedLesson(null)}>
            Đổi Video Khác
          </Button>
        )}
      </div>

      {/* Custom YouTube URL Input Section */}
      <Card hoverable={false} className="glass-panel">
        <form onSubmit={handleCustomUrlSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
            DÁN URL YOUTUBE TÙY CHỈNH CỦA BẠN:
          </span>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <Input
                placeholder="Ví dụ: https://www.youtube.com/watch?v=Kz8h5gAOHwY"
                value={customUrlInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomUrlInput(e.target.value)}
                icon={<LinkIcon size={18} />}
              />
            </div>
            <Button variant="gradient" type="submit" disabled={isLoadingCustom} icon={<Sparkles size={16} />}>
              {isLoadingCustom ? 'Đang Tách...' : 'Tách Phụ Đề & Học'}
            </Button>
          </div>
          {urlError && <span style={{ color: 'var(--accent-red)', fontSize: '0.85rem' }}>{urlError}</span>}
        </form>
      </Card>

      {/* Main Workspace Area (If Video Selected) */}
      {selectedLesson ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {/* Left Column: YouTube Video Player & Shadowing Practice Workbench */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <YouTubePlayer
              youtubeId={selectedLesson.youtubeId}
              seekTime={seekTime}
              onTimeUpdate={(t) => setCurrentTime(t)}
            />

            <ShadowingPracticeCard
              currentLine={selectedLine}
              onNextLine={handleNextLine}
              onPrevLine={handlePrevLine}
              onReplayLineVideo={() => {
                if (selectedLine) setSeekTime(selectedLine.startTime);
              }}
              onAwardXp={handleAwardXp}
            />
          </div>

          {/* Right Column: Interactive Subtitles Transcript View */}
          <div>
            <TranscriptView
              transcript={selectedLesson.transcript}
              currentTime={currentTime}
              selectedLineId={selectedLine?.id || null}
              onSelectLine={handleSelectLine}
              onWordClick={(w) => setActiveLookupWord(w)}
            />
          </div>
        </div>
      ) : (
        /* Video Library Section (If No Video Selected) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Search & CEFR Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['all', 'A1', 'A2', 'B1', 'B2', 'C1'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  style={{
                    background: selectedLevel === lvl ? 'var(--accent-pink)' : 'rgba(255, 255, 255, 0.08)',
                    color: selectedLevel === lvl ? '#fff' : 'var(--text-secondary)',
                    border: 'none',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {lvl === 'all' ? 'Tất Cả Level' : lvl}
                </button>
              ))}
            </div>

            <div style={{ width: '260px' }}>
              <Input
                placeholder="Tìm bài học..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                icon={<Search size={16} />}
              />
            </div>
          </div>

          {/* Video Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filteredLessons.map((lesson) => (
              <Card key={lesson.id} onClick={() => handleSelectLesson(lesson)}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Thumbnail Image Container */}
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      paddingBottom: '56.25%',
                      background: '#000',
                    }}
                  >
                    <img
                      src={lesson.thumbnailUrl}
                      alt={lesson.title}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        background: 'rgba(0,0,0,0.75)',
                        color: '#fff',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                      }}
                    >
                      {lesson.duration}
                    </span>
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'rgba(255, 122, 26, 0.85)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                      }}
                    >
                      <Play size={20} style={{ marginLeft: '3px' }} />
                    </div>
                  </div>

                  {/* Info Tags */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-cyan)' }}>
                      Level {lesson.level}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lesson.category}</span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', margin: 0, lineHeight: 1.4 }}>{lesson.title}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {lesson.transcript.length} câu luyện tập
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
