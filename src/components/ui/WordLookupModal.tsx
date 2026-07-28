import React, { useEffect, useState } from 'react';
import { Volume2, ExternalLink, BookmarkPlus, Check, X, BookOpen, Sparkles, Loader2, Lightbulb } from 'lucide-react';
import { DetailedWordLookup } from '../../types';
import { lookupWord } from '../../services/dictionaryService';
import { speakText } from '../../services/speechService';
import { saveUserMasteredWord } from '../../services/storage';
import { generateTutorExplanation } from '../../services/geminiService';

interface WordLookupModalProps {
  word: string | null;
  onClose: () => void;
  merriamWebsterApiKey?: string;
  onWordAdded?: (word: string) => void;
}

export const WordLookupModal: React.FC<WordLookupModalProps> = ({
  word,
  onClose,
  merriamWebsterApiKey,
  onWordAdded,
}) => {
  const [loading, setLoading] = useState(false);
  const [wordData, setWordData] = useState<DetailedWordLookup | null>(null);
  const [saved, setSaved] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (!word) {
      setWordData(null);
      setSaved(false);
      setAiExplanation(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setSaved(false);
    setAiExplanation(null);

    lookupWord(word, merriamWebsterApiKey)
      .then(res => {
        if (isMounted) {
          setWordData(res);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Lookup error:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [word, merriamWebsterApiKey]);

  if (!word) return null;

  const handlePlayAudio = (audioUrl?: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(() => speakText(word));
    } else {
      speakText(word);
    }
  };

  const handleSaveWord = () => {
    saveUserMasteredWord(word);
    setSaved(true);
    if (onWordAdded) onWordAdded(word);
  };

  const handleAskAi = async () => {
    if (loadingAi || aiExplanation) return;
    setLoadingAi(true);
    try {
      const explanation = await generateTutorExplanation(
        `Hãy giải thích từ vựng tiếng Anh "${word}" ngắn gọn bằng tiếng Việt bao gồm: Nghĩa chính, 2 cụm từ thông dụng (collocations), và 1 mẹo nhớ nhanh từ này.`,
        'B2'
      );
      setAiExplanation(explanation);
    } catch (err) {
      setAiExplanation('Không thể kết nối với AI Gia Sư lúc này. Vui lòng thử lại sau!');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="dict-modal-backdrop" onClick={onClose}>
      <div className="dict-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="dict-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.95rem' }}>
            <BookOpen size={20} />
            <span style={{ background: 'linear-gradient(135deg, #3b82f6, #7000FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Instant Dictionary & AI Lookup
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => (e.currentTarget.style.color = '#ffffff')}
            onMouseOut={e => (e.currentTarget.style.color = '#94a3b8')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="dict-modal-body custom-scrollbar">
          {loading ? (
            <div style={{ padding: '3rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <Loader2 size={36} color="var(--accent-cyan)" className="animate-spin" />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Đang tra cứu từ vựng & phiên âm cho "{word}"...</p>
            </div>
          ) : wordData ? (
            <>
              {/* Word Header Card */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '1.25rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: 0, textTransform: 'capitalize' }}>
                      {wordData.word}
                    </h2>
                    <button
                      onClick={() => handlePlayAudio(wordData.phonetics.find(p => p.audio)?.audio)}
                      style={{
                        background: 'rgba(59, 130, 246, 0.15)',
                        border: '1px solid rgba(59, 130, 246, 0.4)',
                        color: 'var(--accent-cyan)',
                        borderRadius: '50%',
                        width: '38px',
                        height: '38px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      title="Nghe phát âm"
                    >
                      <Volume2 size={20} />
                    </button>
                  </div>

                  {/* Phonetics Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.6rem' }}>
                    {wordData.phonetics.length > 0 ? (
                      wordData.phonetics.map((p, idx) => (
                        <span
                          key={idx}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.8rem',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            background: 'rgba(15, 23, 42, 0.8)',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            color: '#3b82f6',
                            fontFamily: 'monospace'
                          }}
                        >
                          {p.tag && <strong style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8' }}>{p.tag}:</strong>}
                          {p.text}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontFamily: 'monospace' }}>/{wordData.word}/</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSaveWord}
                  disabled={saved}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '8px 14px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    borderRadius: '10px',
                    border: 'none',
                    cursor: saved ? 'default' : 'pointer',
                    background: saved
                      ? 'rgba(16, 185, 129, 0.2)'
                      : 'linear-gradient(135deg, #3b82f6, #0072FF)',
                    color: saved ? '#34d399' : '#ffffff',
                    boxShadow: saved ? 'none' : '0 4px 15px rgba(59, 130, 246, 0.3)',
                    transition: 'all 0.2s'
                  }}
                >
                  {saved ? (
                    <>
                      <Check size={16} />
                      <span>Đã Lưu</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus size={16} />
                      <span>Lưu Từ Vựng</span>
                    </>
                  )}
                </button>
              </div>

              {/* Ask AI Tutor Banner */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.15), rgba(59, 130, 246, 0.1))',
                  border: '1px solid rgba(30, 64, 175, 0.3)',
                  borderRadius: '14px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontWeight: 600, fontSize: '0.9rem' }}>
                    <Sparkles size={18} /> Phân Tích Chuyên Sâu AI (Dr. NTP)
                  </div>
                  {!aiExplanation && (
                    <button
                      onClick={handleAskAi}
                      disabled={loadingAi}
                      style={{
                        background: 'linear-gradient(135deg, #7000FF, #3b82f6)',
                        border: 'none',
                        color: '#ffffff',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      {loadingAi ? <Loader2 size={14} className="animate-spin" /> : <Lightbulb size={14} />}
                      <span>{loadingAi ? 'AI Đang Phân Tích...' : 'Hỏi AI Ngay'}</span>
                    </button>
                  )}
                </div>

                {aiExplanation && (
                  <div
                    style={{
                      background: 'rgba(10, 15, 26, 0.8)',
                      padding: '0.85rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(30, 64, 175, 0.2)',
                      fontSize: '0.85rem',
                      color: '#e2e8f0',
                      whiteSpace: 'pre-line',
                      lineHeight: 1.6
                    }}
                  >
                    {aiExplanation}
                  </div>
                )}
              </div>

              {/* Meanings & Definitions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {wordData.meanings.map((meaning, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <span
                      style={{
                        alignSelf: 'flex-start',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: 'rgba(168, 85, 247, 0.2)',
                        color: '#c084fc',
                        border: '1px solid rgba(168, 85, 247, 0.3)'
                      }}
                    >
                      {meaning.partOfSpeech}
                    </span>

                    <ol style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {meaning.definitions.map((def, dIdx) => (
                        <li key={dIdx} style={{ fontSize: '0.9rem', color: '#f1f5f9', lineHeight: 1.5 }}>
                          <span>{def.definition}</span>
                          {def.example && (
                            <div
                              style={{
                                marginTop: '4px',
                                paddingLeft: '0.75rem',
                                borderLeft: '2px solid var(--accent-cyan)',
                                fontSize: '0.82rem',
                                color: '#94a3b8',
                                fontStyle: 'italic'
                              }}
                            >
                              "{def.example}"
                            </div>
                          )}
                        </li>
                      ))}
                    </ol>

                    {/* Synonyms */}
                    {meaning.synonyms && meaning.synonyms.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Từ đồng nghĩa:</span>
                        {meaning.synonyms.slice(0, 6).map((syn, sIdx) => (
                          <span
                            key={sIdx}
                            style={{
                              fontSize: '0.75rem',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: 'rgba(59, 130, 246, 0.1)',
                              color: '#3b82f6',
                              border: '1px solid rgba(59, 130, 246, 0.2)'
                            }}
                          >
                            {syn}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Source Link */}
              {wordData.sourceUrl && (
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <a
                    href={wordData.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.8rem',
                      color: '#94a3b8',
                      textDecoration: 'none',
                      transition: 'color 0.2s'
                    }}
                    onMouseOver={e => (e.currentTarget.style.color = '#3b82f6')}
                    onMouseOut={e => (e.currentTarget.style.color = '#94a3b8')}
                  >
                    <span>Xem từ điển Oxford/Wiktionary đầy đủ</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
              Không tìm thấy dữ liệu từ điển cho "{word}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
