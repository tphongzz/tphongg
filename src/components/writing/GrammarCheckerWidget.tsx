import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Sparkles, RefreshCw, BarChart2, BookOpen, Wand2 } from 'lucide-react';
import { GrammarMatch, TextStatistics } from '../../types';
import { checkGrammarLanguageTool, computeTextStatistics } from '../../services/grammarCheckerService';

interface GrammarCheckerWidgetProps {
  initialText?: string;
  saplingApiKey?: string;
  onApplyText?: (correctedText: string) => void;
}

export const GrammarCheckerWidget: React.FC<GrammarCheckerWidgetProps> = ({
  initialText = '',
  saplingApiKey,
  onApplyText,
}) => {
  const [text, setText] = useState(initialText);
  const [checking, setChecking] = useState(false);
  const [matches, setMatches] = useState<GrammarMatch[]>([]);
  const [stats, setStats] = useState<TextStatistics | null>(null);

  const runCheck = async (currentText: string) => {
    if (!currentText.trim()) {
      setMatches([]);
      setStats(null);
      return;
    }

    setChecking(true);
    try {
      const [foundMatches, calculatedStats] = await Promise.all([
        checkGrammarLanguageTool(currentText),
        computeTextStatistics(currentText, saplingApiKey),
      ]);
      setMatches(foundMatches);
      setStats(calculatedStats);
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      runCheck(text);
    }, 600);

    return () => clearTimeout(timer);
  }, [text, saplingApiKey]);

  const handleApplyReplacement = (match: GrammarMatch, replacement: string) => {
    const before = text.substring(0, match.offset);
    const after = text.substring(match.offset + match.length);
    const updated = before + replacement + after;
    setText(updated);
    if (onApplyText) onApplyText(updated);
  };

  const handleFixAll = () => {
    let current = text;
    // Sort matches from back to front to preserve offsets
    const sorted = [...matches].sort((a, b) => b.offset - a.offset);
    sorted.forEach(m => {
      if (m.replacements.length > 0) {
        const before = current.substring(0, m.offset);
        const after = current.substring(m.offset + m.length);
        current = before + m.replacements[0] + after;
      }
    });
    setText(current);
    if (onApplyText) onApplyText(current);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Real-time Grammar & Writing Assistant</span>
        </div>

        <div className="flex items-center gap-3">
          {checking && (
            <span className="flex items-center gap-1.5 text-xs text-cyan-400 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Checking...
            </span>
          )}
          {matches.length > 0 && (
            <button
              onClick={handleFixAll}
              className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Fix All ({matches.length})
            </button>
          )}
        </div>
      </div>

      {/* Editor Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type or paste your English text here to check grammar, spelling & readability..."
          rows={5}
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition resize-none custom-scrollbar font-sans"
        />
      </div>

      {/* Statistics Bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs">
          <div className="flex flex-col">
            <span className="text-slate-400">Words / Chars</span>
            <span className="font-bold text-white font-mono">{stats.wordCount} / {stats.characterCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400">Sentences</span>
            <span className="font-bold text-white font-mono">{stats.sentenceCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400">Reading Level</span>
            <span className="font-bold text-cyan-400 font-mono">Grade {stats.fleschKincaidGrade}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400">Readability Score</span>
            <span className="font-bold text-emerald-400 font-mono">{stats.readabilityScore}/100</span>
          </div>
        </div>
      )}

      {/* Grammar Matches List */}
      {matches.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Detected Suggestions ({matches.length})
          </h4>

          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {matches.map((m, idx) => (
              <div
                key={idx}
                className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <p className="text-slate-200 font-medium">{m.message}</p>
                  {m.contextText && (
                    <p className="text-[11px] text-slate-400 font-mono">
                      Context: "{m.contextText}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {m.replacements.slice(0, 3).map((rep, rIdx) => (
                    <button
                      key={rIdx}
                      onClick={() => handleApplyReplacement(m, rep)}
                      className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500 hover:text-white text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold transition"
                    >
                      Use "{rep}"
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : text.trim().length > 0 && !checking ? (
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4" />
          <span>Great writing! No grammar or spelling issues detected by LanguageTool.</span>
        </div>
      ) : null}
    </div>
  );
};
