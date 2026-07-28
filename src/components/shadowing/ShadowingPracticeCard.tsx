import React, { useState, useEffect } from 'react';
import { TranscriptLine } from '../../types';
import { Mic, MicOff, Volume2, RotateCcw, Award, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { startListening, stopListening, isSTTSupported, speakText } from '../../services/speechService';
import { evaluateShadowingSpeech, ShadowingEvaluationResult } from '../../utils/stringDistance';

interface ShadowingPracticeCardProps {
  currentLine: TranscriptLine | null;
  onNextLine?: () => void;
  onPrevLine?: () => void;
  onReplayLineVideo?: () => void;
  onAwardXp?: (score: number) => void;
}

export const ShadowingPracticeCard: React.FC<ShadowingPracticeCardProps> = ({
  currentLine,
  onNextLine,
  onPrevLine,
  onReplayLineVideo,
  onAwardXp,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [spokenText, setSpokenText] = useState<string>('');
  const [evaluation, setEvaluation] = useState<ShadowingEvaluationResult | null>(null);
  const [sttError, setSttError] = useState<string | null>(null);
  const [hasAwardedThisLine, setHasAwardedThisLine] = useState<boolean>(false);

  // Reset state when current line changes
  useEffect(() => {
    setSpokenText('');
    setEvaluation(null);
    setSttError(null);
    setHasAwardedThisLine(false);
    if (isRecording) {
      stopListening();
      setIsRecording(false);
    }
  }, [currentLine?.id]);

  if (!currentLine) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Chọn một câu trong transcript để bắt đầu luyện Shadowing.</p>
      </div>
    );
  }

  const handleStartRecording = () => {
    if (!isSTTSupported()) {
      setSttError('Trình duyệt của bạn không hỗ trợ Web Speech STT. Hãy sử dụng Chrome hoặc Edge.');
      return;
    }

    setSpokenText('');
    setEvaluation(null);
    setSttError(null);
    setIsRecording(true);

    const started = startListening(
      (transcript) => {
        setSpokenText(transcript);
      },
      (error) => {
        setSttError(error);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );

    if (!started) {
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    stopListening();
    setIsRecording(false);

    // Evaluate speech accuracy
    if (spokenText && currentLine) {
      const evalResult = evaluateShadowingSpeech(currentLine.text, spokenText);
      setEvaluation(evalResult);

      if (evalResult.score >= 60 && !hasAwardedThisLine && onAwardXp) {
        onAwardXp(evalResult.score);
        setHasAwardedThisLine(true);
      }
    }
  };

  // Evaluate whenever spoken text changes if recording stopped
  useEffect(() => {
    if (!isRecording && spokenText && currentLine && !evaluation) {
      const evalResult = evaluateShadowingSpeech(currentLine.text, spokenText);
      setEvaluation(evalResult);

      if (evalResult.score >= 60 && !hasAwardedThisLine && onAwardXp) {
        onAwardXp(evalResult.score);
        setHasAwardedThisLine(true);
      }
    }
  }, [isRecording, spokenText]);

  return (
    <Card hoverable={false} className="glass-panel">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Title Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="badge" style={{ background: 'rgba(255, 122, 26, 0.15)', color: 'var(--accent-pink)' }}>
            Luyện Thu Âm Nhại Giọng (Shadowing)
          </span>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="secondary" size="sm" icon={<Volume2 size={15} />} onClick={() => speakText(currentLine.text)}>
              Nghe Mẫu
            </Button>
            {onReplayLineVideo && (
              <Button variant="secondary" size="sm" icon={<RotateCcw size={15} />} onClick={onReplayLineVideo}>
                Phát Video Câu Này
              </Button>
            )}
          </div>
        </div>

        {/* Target Sentence Box */}
        <div
          style={{
            padding: '1.2rem',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
            CÂU MẪU CẦN ĐỌC:
          </span>
          <p style={{ fontSize: '1.15rem', fontWeight: 600, color: '#fff', margin: 0, lineHeight: 1.5 }}>
            "{currentLine.text}"
          </p>
          {currentLine.translation && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem', marginBottom: 0 }}>
              {currentLine.translation}
            </p>
          )}
        </div>

        {/* Record Control Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {!isRecording ? (
            <Button
              variant="gradient"
              size="lg"
              icon={<Mic size={20} />}
              onClick={handleStartRecording}
              style={{ background: 'linear-gradient(135deg, #ff0055, #ff9900)' }}
            >
              Bắt Đầu Thu Âm Giọng Nói
            </Button>
          ) : (
            <Button
              variant="danger"
              size="lg"
              icon={<MicOff size={20} />}
              onClick={handleStopRecording}
              style={{ animation: 'pulse 1.5s infinite' }}
            >
              Dừng Thu Âm & Chấm Điểm
            </Button>
          )}

          {isRecording && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-red)' }}>
              <span className="live-dot" />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Đang lắng nghe... Nói câu mẫu trên!</span>
            </div>
          )}
        </div>

        {sttError && (
          <div style={{ color: 'var(--accent-red)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertCircle size={16} /> {sttError}
          </div>
        )}

        {/* Live Spoken Speech Display */}
        {spokenText && (
          <div
            style={{
              padding: '1rem',
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.05)',
              border: '1px dashed rgba(59, 130, 246, 0.3)',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
              GIỌNG NÓI NHẬN DẠNG ĐƯỢC:
            </span>
            <p style={{ fontSize: '1rem', color: '#fff', margin: 0, fontStyle: 'italic' }}>"{spokenText}"</p>
          </div>
        )}

        {/* Evaluation & Scoring Breakdown Results */}
        {evaluation && (
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '14px',
              background: 'rgba(18, 24, 36, 0.8)',
              border: `1px solid ${evaluation.feedbackColor}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ĐỘ CHÍNH XÁC PHÁT ÂM</span>
                <h3 style={{ fontSize: '2rem', margin: '0.2rem 0 0 0', color: evaluation.feedbackColor }}>
                  {evaluation.score}%
                </h3>
              </div>

              {evaluation.score >= 60 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold)' }}>
                  <Award size={24} />
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>+20 XP</span>
                </div>
              )}
            </div>

            {/* Word-by-Word Highlight Comparison */}
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                CHI TIẾT TỪNG TỪ:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {evaluation.wordMatches.map((item, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.25rem 0.55rem',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background:
                        item.status === 'correct'
                          ? 'rgba(46, 213, 115, 0.2)'
                          : 'rgba(255, 71, 87, 0.2)',
                      color:
                        item.status === 'correct'
                          ? 'var(--accent-green, #2ed573)'
                          : 'var(--accent-red, #ff4757)',
                      border:
                        item.status === 'correct'
                          ? '1px solid rgba(46, 213, 115, 0.4)'
                          : '1px solid rgba(255, 71, 87, 0.4)',
                    }}
                  >
                    {item.word}
                  </span>
                ))}
              </div>
            </div>

            {/* Feedback Message */}
            <p style={{ fontSize: '0.9rem', color: evaluation.feedbackColor, fontWeight: 500, margin: 0 }}>
              {evaluation.feedback}
            </p>

            {/* Next / Previous Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              {onPrevLine && (
                <Button variant="secondary" size="sm" onClick={onPrevLine}>
                  Câu Trước
                </Button>
              )}
              {onNextLine && (
                <Button variant="gradient" size="sm" icon={<ArrowRight size={16} />} onClick={onNextLine}>
                  Câu Tiếp Theo
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
