import React from 'react';
import { Award, CheckCircle, AlertCircle, Mic, Activity, Volume2 } from 'lucide-react';
import { DetailedPronunciationScore } from '../../types';

interface PronunciationScoreBadgeProps {
  scoreData: DetailedPronunciationScore;
}

export const PronunciationScoreBadge: React.FC<PronunciationScoreBadgeProps> = ({ scoreData }) => {
  const { overallScore, accuracyScore, fluencyScore, completenessScore, prosodyScore, wordsDetails } = scoreData;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'from-emerald-500 to-teal-400 text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 70) return 'from-cyan-500 to-blue-400 text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
    if (score >= 50) return 'from-amber-500 to-yellow-400 text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'from-rose-500 to-pink-400 text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 animate-fade-in">
      {/* Header & Overall Score Ring */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl border ${getScoreColor(overallScore)} shadow-lg`}>
            {overallScore}%
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Pronunciation Assessment
            </h3>
            <p className="text-xs text-slate-400">
              {overallScore >= 85
                ? 'Excellent pronunciation & natural rhythm!'
                : overallScore >= 70
                ? 'Good effort! Clear pronunciation with slight accent.'
                : 'Keep practicing! Focus on stress and phoneme clarity.'}
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Scores Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
            Accuracy
          </span>
          <p className="text-lg font-bold text-cyan-400 font-mono">{accuracyScore}%</p>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Fluency
          </span>
          <p className="text-lg font-bold text-emerald-400 font-mono">{fluencyScore}%</p>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 flex items-center gap-1">
            <Mic className="w-3.5 h-3.5 text-purple-400" />
            Completeness
          </span>
          <p className="text-lg font-bold text-purple-400 font-mono">{completenessScore}%</p>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            Prosody (Intonation)
          </span>
          <p className="text-lg font-bold text-amber-400 font-mono">{prosodyScore || accuracyScore}%</p>
        </div>
      </div>

      {/* Word-by-Word Breakdown */}
      {wordsDetails && wordsDetails.length > 0 && (
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Word-by-Word Phoneme Details:
          </h4>
          <div className="flex flex-wrap gap-2 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            {wordsDetails.map((w, idx) => {
              const bg =
                w.score >= 80
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : w.score >= 50
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30';

              return (
                <div
                  key={idx}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 ${bg}`}
                  title={`Score: ${w.score}% (${w.errorType || 'OK'})`}
                >
                  <span>{w.word}</span>
                  <span className="text-[10px] font-mono opacity-80">({w.score}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
