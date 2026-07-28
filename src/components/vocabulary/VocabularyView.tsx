import React, { useState, useEffect } from 'react';
import { UserProfile, CEFRLevel, WordItem, DatamuseSuggestion } from '../../types';
import { fullVocabularyDatabase, vocabularyTopics } from '../../data/vocabularyData';
import { addXpToUser, saveUserProfile } from '../../services/storage';
import { fetchDatamuseSuggestions, fetchDynamicWordItem, fetchRandomWordsByRank } from '../../services/dictionaryService';
import { WordLookupModal } from '../ui/WordLookupModal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { BookOpen, Volume2, RotateCw, CheckCircle, ChevronLeft, ChevronRight, Shuffle, Gamepad2, Award, Sparkles, Search, ExternalLink, Timer, Zap, HelpCircle, AlertCircle, Loader2 } from 'lucide-react';

interface VocabularyViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export const VocabularyView: React.FC<VocabularyViewProps> = ({ user, onUpdateUser }) => {
  const [words, setWords] = useState<WordItem[]>(fullVocabularyDatabase);
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'flashcards' | 'matching' | 'unscramble' | 'speedquiz'>('flashcards');

  // Search & Autocomplete State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<DatamuseSuggestion[]>([]);
  const [lookupWord, setLookupWord] = useState<string | null>(null);
  const [loadingDynamicWord, setLoadingDynamicWord] = useState<boolean>(false);
  const [loadingRankWords, setLoadingRankWords] = useState<boolean>(false);

  // Flashcard state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // GAME 1: Matching game state
  const [matchingCards, setMatchingCards] = useState<{ id: string; text: string; type: 'en' | 'vi'; wordId: string }[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [matchingScore, setMatchingScore] = useState<number>(0);

  // GAME 2: Word Unscramble state
  const [unscrambleTarget, setUnscrambleTarget] = useState<WordItem | null>(null);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [userUnscrambleInput, setUserUnscrambleInput] = useState<string>('');
  const [unscrambleResult, setUnscrambleResult] = useState<'correct' | 'wrong' | null>(null);
  const [unscrambleScore, setUnscrambleScore] = useState<number>(0);

  // GAME 3: Speed Quiz 10s state
  const [speedQuizTarget, setSpeedQuizTarget] = useState<WordItem | null>(null);
  const [speedQuizOptions, setSpeedQuizOptions] = useState<string[]>([]);
  const [speedTimer, setSpeedTimer] = useState<number>(10);
  const [speedScore, setSpeedScore] = useState<number>(0);
  const [speedCombo, setSpeedCombo] = useState<number>(0);
  const [speedQuizFeedback, setSpeedQuizFeedback] = useState<'correct' | 'wrong' | 'timeout' | null>(null);

  // Datamuse Autocomplete Effect
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      fetchDatamuseSuggestions(searchQuery).then(res => setSuggestions(res));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Auto-fetch & Insert ANY word into Vocabulary Flashcards
  const handleSelectOrSearchWord = async (termToLookup: string) => {
    const clean = termToLookup.trim().toLowerCase();
    if (!clean) return;

    setSearchQuery(termToLookup);
    setSuggestions([]);
    setLookupWord(termToLookup);

    // If word already exists in local list, jump to it
    const existingIdx = words.findIndex((w) => w.term.toLowerCase() === clean);
    if (existingIdx >= 0) {
      setCurrentIndex(existingIdx);
      return;
    }

    // Otherwise fetch online dynamically and prepend to flashcards list
    setLoadingDynamicWord(true);
    try {
      const newItem = await fetchDynamicWordItem(clean);
      setWords((prev) => [newItem, ...prev]);
      setSelectedLevel('All');
      setSelectedTopic('All');
      setCurrentIndex(0);
    } catch (err) {
      console.error('Error fetching dynamic word item:', err);
    } finally {
      setLoadingDynamicWord(false);
    }
  };

  // Generate infinite random high-frequency words matching student's rank
  const handleGenerateRankWords = async () => {
    setLoadingRankWords(true);
    try {
      const newItems = await fetchRandomWordsByRank(user.rank, 8);
      if (newItems.length > 0) {
        const uniqueNewItems = newItems.filter(
          (item) => !words.some((w) => w.term.toLowerCase() === item.term.toLowerCase())
        );
        if (uniqueNewItems.length > 0) {
          setWords((prev) => [...uniqueNewItems, ...prev]);
          setCurrentIndex(0);
          onUpdateUser(addXpToUser(25));
        }
      }
    } catch (err) {
      console.error('Error generating rank words:', err);
    } finally {
      setLoadingRankWords(false);
    }
  };

  // Speed Quiz Timer Effect
  useEffect(() => {
    if (activeTab !== 'speedquiz' || !speedQuizTarget || speedQuizFeedback !== null) return;

    if (speedTimer <= 0) {
      setSpeedQuizFeedback('timeout');
      setSpeedCombo(0);
      return;
    }

    const interval = setInterval(() => {
      setSpeedTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTab, speedQuizTarget, speedTimer, speedQuizFeedback]);

  // Filtered words
  const filteredWords = words.filter((w) => {
    const levelMatch = selectedLevel === 'All' || w.level === selectedLevel;
    const topicMatch = selectedTopic === 'All' || w.topic === selectedTopic;
    const searchMatch = !searchQuery || w.term.toLowerCase().includes(searchQuery.toLowerCase()) || w.vietnameseMeaning.toLowerCase().includes(searchQuery.toLowerCase());
    return levelMatch && topicMatch && searchMatch;
  });

  const currentWord = filteredWords[currentIndex] || filteredWords[0];

  const handlePlayAudio = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleMastered = (wordId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedWords = words.map((w) => {
      if (w.id === wordId) {
        const nextMastered = !w.mastered;
        if (nextMastered) {
          const updatedUser = {
            ...user,
            wordsLearned: user.wordsLearned + 1
          };
          saveUserProfile(updatedUser);
          onUpdateUser(addXpToUser(15));
        }
        return { ...w, mastered: nextMastered };
      }
      return w;
    });
    setWords(updatedWords);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    if (filteredWords.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % filteredWords.length);
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    if (filteredWords.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
    }
  };

  const handleRandomCard = () => {
    setIsFlipped(false);
    if (filteredWords.length > 1) {
      const randomIndex = Math.floor(Math.random() * filteredWords.length);
      setCurrentIndex(randomIndex);
    }
  };

  // ================= GAME 1: Matching Game Setup =================
  const startMatchingGame = () => {
    const subset = [...words].sort(() => 0.5 - Math.random()).slice(0, 4);
    const cards: { id: string; text: string; type: 'en' | 'vi'; wordId: string }[] = [];

    subset.forEach((w) => {
      cards.push({ id: `en_${w.id}`, text: w.term, type: 'en', wordId: w.id });
      cards.push({ id: `vi_${w.id}`, text: w.vietnameseMeaning, type: 'vi', wordId: w.id });
    });

    setMatchingCards(cards.sort(() => 0.5 - Math.random()));
    setSelectedCardId(null);
    setMatchedIds([]);
    setMatchingScore(0);
    setActiveTab('matching');
  };

  const handleCardClick = (card: { id: string; text: string; type: 'en' | 'vi'; wordId: string }) => {
    if (matchedIds.includes(card.id)) return;
    if (selectedCardId === card.id) {
      setSelectedCardId(null);
      return;
    }

    if (!selectedCardId) {
      setSelectedCardId(card.id);
      if (card.type === 'en') handlePlayAudio(card.text);
      return;
    }

    const firstCard = matchingCards.find((c) => c.id === selectedCardId);
    if (firstCard && firstCard.wordId === card.wordId && firstCard.type !== card.type) {
      const newMatched = [...matchedIds, firstCard.id, card.id];
      setMatchedIds(newMatched);
      setSelectedCardId(null);
      setMatchingScore((prev) => prev + 1);

      if (newMatched.length === matchingCards.length) {
        onUpdateUser(addXpToUser(30));
      }
    } else {
      setSelectedCardId(card.id);
    }
  };

  // ================= GAME 2: Word Unscramble Setup =================
  const startUnscrambleGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setUnscrambleTarget(randomWord);

    // Scramble letters
    const letters = randomWord.term.toLowerCase().split('');
    const shuffled = [...letters].sort(() => 0.5 - Math.random());
    setScrambledLetters(shuffled);
    setUserUnscrambleInput('');
    setUnscrambleResult(null);
    setActiveTab('unscramble');
  };

  const handleUnscrambleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unscrambleTarget || !userUnscrambleInput.trim()) return;

    if (userUnscrambleInput.trim().toLowerCase() === unscrambleTarget.term.toLowerCase()) {
      setUnscrambleResult('correct');
      setUnscrambleScore((prev) => prev + 1);
      onUpdateUser(addXpToUser(20));
    } else {
      setUnscrambleResult('wrong');
    }
  };

  // ================= GAME 3: Speed Quiz 10s Setup =================
  const startSpeedQuizRound = () => {
    const randomTarget = words[Math.floor(Math.random() * words.length)];
    setSpeedQuizTarget(randomTarget);

    // Create 4 option choices (1 correct + 3 distractor meanings)
    const distractors = words
      .filter((w) => w.id !== randomTarget.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((w) => w.vietnameseMeaning);

    const options = [randomTarget.vietnameseMeaning, ...distractors].sort(() => 0.5 - Math.random());
    setSpeedQuizOptions(options);

    setSpeedTimer(10);
    setSpeedQuizFeedback(null);
    setActiveTab('speedquiz');
  };

  const handleSelectSpeedOption = (selectedMeaning: string) => {
    if (speedQuizFeedback !== null || !speedQuizTarget) return;

    if (selectedMeaning === speedQuizTarget.vietnameseMeaning) {
      setSpeedQuizFeedback('correct');
      setSpeedScore((prev) => prev + 1);
      setSpeedCombo((prev) => prev + 1);
      const bonusXp = speedCombo >= 3 ? 25 : 15;
      onUpdateUser(addXpToUser(bonusXp));
    } else {
      setSpeedQuizFeedback('wrong');
      setSpeedCombo(0);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Dictionary Lookup Modal */}
      {lookupWord && (
        <WordLookupModal
          word={lookupWord}
          onClose={() => setLookupWord(null)}
          merriamWebsterApiKey={user.merriamWebsterApiKey}
        />
      )}

      {/* Top Header & Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BookOpen color="var(--accent-purple)" size={32} />
            Học Từ Vựng Tiếng Anh CEFR &amp; Mini-Games
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Khám phá từ vựng Oxford/Wiktionary, Thẻ lật 3D &amp; 3 Trò chơi luyện tập phản xạ đa dạng.
          </p>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', padding: '0.35rem', borderRadius: 'var(--radius-md)', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('flashcards')}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'flashcards' ? 'var(--accent-purple)' : 'transparent',
              color: activeTab === 'flashcards' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            🎴 Thẻ Lật 3D
          </button>

          <button
            onClick={startMatchingGame}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'matching' ? 'var(--accent-cyan)' : 'transparent',
              color: activeTab === 'matching' ? '#000' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            🎮 Nối Từ (Match)
          </button>

          <button
            onClick={startUnscrambleGame}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'unscramble' ? 'var(--accent-pink)' : 'transparent',
              color: activeTab === 'unscramble' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            🔤 Xếp Từ (Unscramble)
          </button>

          <button
            onClick={startSpeedQuizRound}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'speedquiz' ? 'var(--accent-gold)' : 'transparent',
              color: activeTab === 'speedquiz' ? '#000' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            ⚡ Speed Quiz (10s)
          </button>
        </div>
      </div>

      {/* Autocomplete Search & Filter Controls */}
      {activeTab === 'flashcards' && (
        <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Search Bar with Datamuse Suggestions */}
          <form
            className="relative"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) handleSelectOrSearchWord(searchQuery);
            }}
          >
            <Input
              placeholder="Nhập BẤT KỲ từ Tiếng Anh nào (không giới hạn)... Nhấn Enter để tự động tra & nạp Thẻ Lật 3D!"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              icon={<Search size={18} />}
            />

            {/* Autocomplete Dropdown List */}
            {suggestions.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 999,
                  marginTop: '8px',
                  background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(10, 15, 30, 0.98))',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '16px',
                  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.85), 0 0 25px rgba(59, 130, 246, 0.15)',
                  overflow: 'hidden',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)'
                }}
              >
                {suggestions.map((sug, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectOrSearchWord(sug.word)}
                    style={{
                      padding: '12px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: idx < suggestions.length - 1 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: 'transparent'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff', textTransform: 'lowercase' }}>
                      {sug.word}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                      <span>Tra từ điển &amp; Nạp thẻ 3D</span>
                      <ExternalLink size={14} color="var(--accent-cyan)" />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </form>

          {/* Level & Topic Filters */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '0.75rem', fontWeight: 600 }}>CẤP ĐỘ CEFR:</span>
              {['All', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => { setSelectedLevel(lvl); setCurrentIndex(0); }}
                  style={{
                    padding: '0.3rem 0.75rem',
                    marginRight: '0.35rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    background: selectedLevel === lvl ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.05)',
                    color: selectedLevel === lvl ? '#000' : 'var(--text-secondary)',
                    fontWeight: selectedLevel === lvl ? 700 : 500
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div style={{ height: '24px', width: '1px', background: 'var(--glass-border)' }} />

            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '0.75rem', fontWeight: 600 }}>CHỦ ĐỀ:</span>
              <select
                value={selectedTopic}
                onChange={(e) => { setSelectedTopic(e.target.value); setCurrentIndex(0); }}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--glass-border)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {vocabularyTopics.map((topic: string) => (
                  <option key={topic} value={topic} style={{ background: '#121824' }}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            {/* Rank-Adaptive Infinite Word Generator Button */}
            <div style={{ marginLeft: 'auto' }}>
              <Button
                variant="gradient"
                size="sm"
                onClick={handleGenerateRankWords}
                disabled={loadingRankWords}
                style={{ background: 'linear-gradient(135deg, #7000FF, #3b82f6)', boxShadow: '0 4px 15px rgba(112, 0, 255, 0.3)' }}
              >
                {loadingRankWords ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                <span>{loadingRankWords ? 'Đang Sinh Từ Vựng...' : `🎲 Sinh Từ Ngẫu Nhiên Vô Hạn (${user.rank.toUpperCase()})`}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Render */}
      {activeTab === 'flashcards' ? (
        <div>
          {filteredWords.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
              <Zap size={48} color="var(--accent-cyan)" />
              <div>
                <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                  Phá Bỏ Giới Hạn Từ Vựng 5000+!
                </h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '550px', margin: '0 auto', fontSize: '0.95rem' }}>
                  Từ vựng "{searchQuery}" chưa có trong danh sách bộ lọc. Bấm nút bên dưới để tự động tra cứu online &amp; nạp trực tiếp thành Thẻ Lật 3D học tập ngay lập tức!
                </p>
              </div>

              {searchQuery && (
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={() => handleSelectOrSearchWord(searchQuery)}
                  disabled={loadingDynamicWord}
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #7000FF)', padding: '0.8rem 2rem', fontSize: '1.05rem', fontWeight: 700 }}
                >
                  {loadingDynamicWord ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} />}
                  <span>{loadingDynamicWord ? 'Đang Tra & Nạp Thẻ 3D Online...' : `⚡ Tự Động Tra & Nạp Thẻ Lật 3D Cho "${searchQuery}"`}</span>
                </Button>
              )}
            </div>
          ) : (
            <div>
              {/* 3D Flip Card Container */}
              <div 
                style={{ 
                  perspective: '1000px', 
                  maxWidth: '650px', 
                  margin: '0 auto 2rem auto', 
                  height: '380px', 
                  cursor: 'pointer' 
                }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  {/* FRONT SIDE */}
                  <div
                    className="glass-panel"
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      padding: '2.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.15), rgba(18, 24, 36, 0.9))',
                      border: '1px solid rgba(30, 64, 175, 0.3)'
                    }}
                  >
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-cyan)' }}>
                        {currentWord.level} • {currentWord.topic}
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLookupWord(currentWord.term);
                          }}
                          style={{
                            background: 'rgba(59, 130, 246, 0.15)',
                            color: 'var(--accent-cyan)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            padding: '0.4rem 0.85rem',
                            borderRadius: 'var(--radius-full)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <Search size={14} /> Tra Chi Tiết
                        </button>

                        <button
                          onClick={(e) => handleToggleMastered(currentWord.id, e)}
                          style={{
                            background: currentWord.mastered ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                            color: currentWord.mastered ? 'var(--accent-green)' : 'var(--text-muted)',
                            border: currentWord.mastered ? '1px solid rgba(0, 255, 136, 0.4)' : '1px solid var(--glass-border)',
                            padding: '0.4rem 0.85rem',
                            borderRadius: 'var(--radius-full)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <CheckCircle size={16} /> {currentWord.mastered ? 'Đã Thuộc (+15 XP)' : 'Đánh dấu thuộc'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <h2 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '0.02em' }}>
                        {currentWord.term}
                      </h2>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-cyan)', fontSize: '1.2rem', fontWeight: 500 }}>
                        <span>{currentWord.phonetic}</span>
                        <button
                          onClick={(e) => handlePlayAudio(currentWord.term, e)}
                          style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.4rem', borderRadius: '50%', color: 'var(--accent-cyan)' }}
                        >
                          <Volume2 size={20} />
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <RotateCw size={14} /> Chạm vào thẻ để xem nghĩa &amp; ví dụ
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div
                    className="glass-panel"
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      padding: '2.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(18, 24, 36, 0.95))',
                      border: '1px solid rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                        Nghĩa Tiếng Việt:
                      </div>
                      <h3 style={{ fontSize: '1.8rem', color: 'var(--accent-green)', marginBottom: '1rem' }}>
                        {currentWord.vietnameseMeaning}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                        <strong>Định nghĩa:</strong> {currentWord.definition}
                      </p>
                    </div>

                    <div className="glass-card" style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.04)' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Ví dụ thực tế:
                      </div>
                      <div style={{ color: 'var(--text-primary)', fontStyle: 'italic', marginBottom: '0.25rem' }}>
                        "{currentWord.exampleSentence}"
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        &rarr; {currentWord.exampleTranslation}
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Chạm lại để lật về mặt trước
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                <Button variant="secondary" onClick={handlePrevCard}>
                  <ChevronLeft size={20} /> Từ Trước
                </Button>

                <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>
                  {currentIndex + 1} / {filteredWords.length}
                </span>

                <Button variant="secondary" onClick={handleRandomCard}>
                  <Shuffle size={18} style={{ marginRight: '0.35rem' }} /> Ngẫu Nhiên
                </Button>

                <Button variant="gradient" onClick={handleNextCard}>
                  Từ Tiếp Theo <ChevronRight size={20} style={{ marginLeft: '0.25rem' }} />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === 'matching' ? (
        /* GAME 1: Matching Game UI */
        <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Gamepad2 color="var(--accent-cyan)" /> Mini-Game 1: Nối Từ Vựng &amp; Nghĩa
            </h2>
            <div style={{ color: 'var(--accent-green)', fontWeight: 700 }}>
              Đã ghép: {matchingScore} / 4 cặp
            </div>
          </div>

          {matchedIds.length === matchingCards.length && matchingCards.length > 0 ? (
            <div style={{ padding: '2rem 0' }}>
              <Sparkles size={60} color="var(--accent-gold)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.8rem', color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>
                Chúc Mừng! Bạn Đã Thắng Game Nối Từ
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Bạn được cộng thêm **+30 XP** vào tài khoản!
              </p>
              <Button variant="gradient" size="lg" onClick={startMatchingGame}>
                <RotateCw size={18} style={{ marginRight: '0.5rem' }} /> Chơi Lượt Mới
              </Button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {matchingCards.map((card) => {
                const isMatched = matchedIds.includes(card.id);
                const isSelected = selectedCardId === card.id;

                let bg = 'rgba(255, 255, 255, 0.04)';
                let border = '1px solid var(--glass-border)';
                let color = 'var(--text-primary)';

                if (isMatched) {
                  bg = 'rgba(0, 255, 136, 0.15)';
                  border = '1.5px solid var(--accent-green)';
                  color = 'var(--accent-green)';
                } else if (isSelected) {
                  bg = 'rgba(59, 130, 246, 0.18)';
                  border = '1.5px solid var(--accent-cyan)';
                }

                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    disabled={isMatched}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: bg,
                      border: border,
                      color: color,
                      fontWeight: 600,
                      fontSize: '1.05rem',
                      transition: 'all 0.2s ease',
                      opacity: isMatched ? 0.6 : 1
                    }}
                  >
                    {card.text}
                  </button>
                );
              })}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="secondary" size="sm" onClick={startMatchingGame}>
              Làm Mới Trận Đấu
            </Button>
          </div>
        </div>
      ) : activeTab === 'unscramble' ? (
        /* GAME 2: Word Unscramble UI */
        <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-pink)' }}>
              <Sparkles size={24} /> Mini-Game 2: Xếp Từ Xáo Trộn (Word Unscramble)
            </h2>
            <span style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
              Điểm: {unscrambleScore} (+20 XP/từ)
            </span>
          </div>

          {unscrambleTarget && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Clue Box */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  GỢI Ý NGHĨA TIẾNG VIỆT &amp; ĐỊNH NGHĨA:
                </span>
                <p className="text-lg font-bold text-emerald-400">{unscrambleTarget.vietnameseMeaning}</p>
                <p className="text-xs text-slate-300 italic font-mono">"{unscrambleTarget.definition}"</p>
              </div>

              {/* Scrambled Letters Display */}
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold block mb-2">Các ký tự bị xáo trộn:</span>
                <div className="flex flex-wrap justify-center gap-2">
                  {scrambledLetters.map((char, idx) => (
                    <button
                      key={idx}
                      onClick={() => setUserUnscrambleInput((prev) => prev + char)}
                      className="w-12 h-12 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 text-cyan-300 font-bold text-xl uppercase shadow-lg hover:border-cyan-400 hover:text-white transition active:scale-95"
                    >
                      {char}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Form */}
              <form onSubmit={handleUnscrambleSubmit} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userUnscrambleInput}
                    onChange={(e) => setUserUnscrambleInput(e.target.value)}
                    placeholder="Nhập hoặc bấm các ô chữ để ghép từ..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-lg font-mono uppercase tracking-widest focus:outline-none focus:border-cyan-500"
                  />
                  <Button variant="secondary" onClick={() => setUserUnscrambleInput('')}>
                    Xóa
                  </Button>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Button variant="secondary" size="sm" onClick={startUnscrambleGame}>
                    Đổi Từ Khác
                  </Button>
                  <Button variant="gradient" type="submit" disabled={!userUnscrambleInput.trim()}>
                    Xác Nhận Từ
                  </Button>
                </div>
              </form>

              {/* Feedback Alert */}
              {unscrambleResult === 'correct' && (
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-sm font-semibold">
                  <CheckCircle className="w-5 h-5" />
                  <span>Chính xác 100%! Từ cần tìm là "{unscrambleTarget.term}". Bạn được thưởng +20 XP!</span>
                </div>
              )}
              {unscrambleResult === 'wrong' && (
                <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 text-sm font-semibold">
                  <AlertCircle className="w-5 h-5" />
                  <span>Chưa chính xác! Hãy thử lại hoặc bấm "Đổi Từ Khác".</span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* GAME 3: Speed Quiz 10s UI */
        <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)' }}>
              <Zap size={24} /> Mini-Game 3: Speed Quiz (Phản Xạ 10s)
            </h2>
            <div className="flex items-center gap-3 text-xs font-bold font-mono">
              <span className="text-cyan-400">Combo: x{speedCombo}</span>
              <span className="text-emerald-400">Điểm: {speedScore}</span>
            </div>
          </div>

          {speedQuizTarget && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Timer Bar */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Timer className="w-4 h-4 text-amber-400 animate-spin" /> Thời gian còn lại:
                  </span>
                  <span className={`font-mono font-bold text-base ${speedTimer <= 3 ? 'text-rose-400 animate-ping' : 'text-amber-400'}`}>
                    {speedTimer}s
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-1000"
                    style={{ width: `${(speedTimer / 10) * 100}%` }}
                  />
                </div>
              </div>

              {/* Target Word Display */}
              <div className="text-center py-6 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs uppercase font-bold text-slate-500 tracking-widest">TỪ VỰNG CẦN CHỌN NGHĨA:</span>
                <h3 className="text-4xl font-extrabold text-white tracking-tight">{speedQuizTarget.term}</h3>
                <span className="text-sm font-mono text-cyan-400">{speedQuizTarget.phonetic}</span>
              </div>

              {/* 4 Option Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {speedQuizOptions.map((opt, idx) => {
                  const isCorrect = opt === speedQuizTarget.vietnameseMeaning;
                  let btnStyle = 'bg-slate-950/60 border-slate-800 text-slate-100 hover:border-cyan-500';

                  if (speedQuizFeedback !== null) {
                    if (isCorrect) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                    else btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-50';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectSpeedOption(opt)}
                      disabled={speedQuizFeedback !== null}
                      className={`p-4 rounded-xl border text-sm font-medium text-left transition ${btnStyle}`}
                    >
                      <span className="text-cyan-400 font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Result Feedback & Next Button */}
              {speedQuizFeedback !== null && (
                <div className="pt-2 space-y-3">
                  <div className="text-sm font-semibold flex items-center justify-between">
                    {speedQuizFeedback === 'correct' && (
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle className="w-5 h-5" /> Chính xác! {speedCombo >= 3 ? 'Combo x' + speedCombo + ' (+25 XP)' : '(+15 XP)'}
                      </span>
                    )}
                    {speedQuizFeedback === 'wrong' && (
                      <span className="text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-5 h-5" /> Rất tiếc! Đáp án đúng là: "{speedQuizTarget.vietnameseMeaning}"
                      </span>
                    )}
                    {speedQuizFeedback === 'timeout' && (
                      <span className="text-amber-400 flex items-center gap-1.5">
                        <Timer className="w-5 h-5" /> Hết giờ! Đáp án đúng là: "{speedQuizTarget.vietnameseMeaning}"
                      </span>
                    )}

                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setLookupWord(speedQuizTarget.term)}>
                        📖 Xem Từ Điển & Giải Thích
                      </Button>
                      <Button variant="gradient" size="sm" onClick={startSpeedQuizRound}>
                        Câu Tiếp Theo &rarr;
                      </Button>
                    </div>
                  </div>

                  {speedQuizTarget.exampleSentence && (
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300">
                      <strong className="text-cyan-400 block mb-1">💡 GIẢI THÍCH & VÍ DỤ NỐI NGHĨA:</strong>
                      <p className="italic">"{speedQuizTarget.exampleSentence}"</p>
                      <p className="text-slate-400 mt-1">Dịch nghĩa: {speedQuizTarget.vietnameseMeaning} ({speedQuizTarget.topic})</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Word Lookup Modal */}
      {lookupWord && (
        <WordLookupModal
          word={lookupWord}
          onClose={() => setLookupWord(null)}
        />
      )}
    </div>
  );
};
