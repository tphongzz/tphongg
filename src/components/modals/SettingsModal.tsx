import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Key, ExternalLink, CheckCircle, ShieldCheck, Sparkles, BookOpen, Mic, Cpu } from 'lucide-react';
import { Button } from '../ui/Button';

interface SettingsModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveApiKey: (updatedUser: UserProfile) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  user,
  isOpen,
  onClose,
  onSaveApiKey,
}) => {
  const [geminiKey, setGeminiKey] = useState(user.geminiApiKey || '');
  const [mwKey, setMwKey] = useState(user.merriamWebsterApiKey || '');
  const [saplingKey, setSaplingKey] = useState(user.saplingApiKey || '');
  const [azureKey, setAzureKey] = useState(user.azureSpeechKey || '');
  const [azureRegion, setAzureRegion] = useState(user.azureSpeechRegion || 'eastus');
  const [speechSuperAppKey, setSpeechSuperAppKey] = useState(user.speechSuperAppKey || '');
  const [speechSuperSecretKey, setSpeechSuperSecretKey] = useState(user.speechSuperSecretKey || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const updatedUser: UserProfile = {
      ...user,
      geminiApiKey: geminiKey.trim(),
      merriamWebsterApiKey: mwKey.trim(),
      saplingApiKey: saplingKey.trim(),
      azureSpeechKey: azureKey.trim(),
      azureSpeechRegion: azureRegion.trim(),
      speechSuperAppKey: speechSuperAppKey.trim(),
      speechSuperSecretKey: speechSuperSecretKey.trim(),
    };

    onSaveApiKey(updatedUser);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '650px',
          backgroundColor: '#121824',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          boxShadow: '0 0 40px rgba(59, 130, 246, 0.2)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
        className="custom-scrollbar"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-cyan)' }}>
            <Key size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Cấu Hình Hệ Thống API &amp; Services</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gemini AI, Merriam-Webster, Sapling AI &amp; Azure Speech Engine</span>
          </div>
        </div>

        {/* Gemini API Key Box */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3 mb-4">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Google Gemini AI API Key (Chatbot &amp; AI Tutor)</span>
          </div>
          <input
            type="password"
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-cyan-500"
          />
          <span className="text-xs text-slate-400 block">
            Miễn phí tại <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-cyan-400 underline">Google AI Studio</a>. Nếu để trống, hệ thống dùng Smart Offline Fallback.
          </span>
        </div>

        {/* Merriam-Webster API Key Box */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3 mb-4">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
            <BookOpen className="w-4 h-4" />
            <span>Merriam-Webster Dictionary Key (Tùy chọn)</span>
          </div>
          <input
            type="password"
            value={mwKey}
            onChange={(e) => setMwKey(e.target.value)}
            placeholder="Key tra từ Merriam-Webster ESL..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-purple-500"
          />
          <span className="text-xs text-slate-400 block">
            Miễn phí tại <a href="https://dictionaryapi.com/" target="_blank" rel="noreferrer" className="text-purple-400 underline">dictionaryapi.com</a>. Mặc định dùng Free Dictionary API &amp; Wiktionary (Không cần Key).
          </span>
        </div>

        {/* Sapling AI API Key Box */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3 mb-4">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Cpu className="w-4 h-4" />
            <span>Sapling AI API Key (Viết văn &amp; Đánh giá Flesch-Kincaid)</span>
          </div>
          <input
            type="password"
            value={saplingKey}
            onChange={(e) => setSaplingKey(e.target.value)}
            placeholder="Key Sapling AI Statistics..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
          <span className="text-xs text-slate-400 block">
            Tài khoản miễn phí tại <a href="https://sapling.ai/docs/" target="_blank" rel="noreferrer" className="text-emerald-400 underline">sapling.ai</a>. Nếu để trống, hệ thống tự động chạy Local Readability Math Engine.
          </span>
        </div>

        {/* Azure Speech & SpeechSuper Key Box */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3 mb-4">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <Mic className="w-4 h-4" />
            <span>Azure Speech / SpeechSuper Engine (Đánh giá phát âm nâng cao)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="password"
              value={azureKey}
              onChange={(e) => setAzureKey(e.target.value)}
              placeholder="Azure Speech Subscription Key..."
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500"
            />
            <input
              type="text"
              value={azureRegion}
              onChange={(e) => setAzureRegion(e.target.value)}
              placeholder="Region (ví dụ: eastus)"
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <span className="text-xs text-slate-400 block">
            Nếu để trống, hệ thống tự động dùng <strong>Web Speech API STT + Levenshtein Similarity Engine (Miễn phí 100%)</strong>.
          </span>
        </div>

        {savedSuccess && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-green)', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
            <CheckCircle size={16} /> Đã lưu cấu hình API thành công!
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Button variant="secondary" onClick={onClose}>
            Hủy Bỏ
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Lưu Cấu Hình
          </Button>
        </div>
      </div>
    </div>
  );
};
