import React, { useState, useEffect } from 'react';
import { X, User, Lock, Camera, LogOut, Check, Sparkles } from 'lucide-react';
import { authService, UserAccount } from '../../services/authService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUserChange?: () => void;
}

export const AuthProfileModal: React.FC<Props> = ({ isOpen, onClose, onUserChange }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const user = authService.getCurrentUser();
      setCurrentUser(user);
      if (user) {
        setDisplayName(user.displayName);
        setAvatarUrl(user.avatarUrl || '');
      }
      setMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = authService.login(username, password);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setDisplayName(res.user.displayName);
      setAvatarUrl(res.user.avatarUrl || '');
      setMessage({ text: 'Đăng nhập thành công!', isError: false });
      if (onUserChange) onUserChange();
    } else {
      setMessage({ text: res.message, isError: true });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !displayName) {
      setMessage({ text: 'Vui lòng điền đầy đủ thông tin!', isError: true });
      return;
    }
    const res = authService.register({ username, password, displayName, avatarUrl });
    if (res.success) {
      setCurrentUser(authService.getCurrentUser());
      setMessage({ text: 'Tạo tài khoản thành công!', isError: false });
      if (onUserChange) onUserChange();
    } else {
      setMessage({ text: res.message, isError: true });
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = authService.updateProfile({ displayName, avatarUrl });
    if (updated) {
      setCurrentUser(updated);
      setMessage({ text: 'Đã cập nhật thông tin thành công!', isError: false });
      if (onUserChange) onUserChange();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setUsername('');
    setPassword('');
    setMessage({ text: 'Đã đăng xuất', isError: false });
    if (onUserChange) onUserChange();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          {currentUser ? 'Quản Lý Hồ Sơ' : (isRegisterMode ? 'Tạo Tài Khoản NTP' : 'Đăng Nhập')}
        </h2>

        {message && (
          <div className={`p-3 rounded-lg text-sm mb-4 ${message.isError ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
            {message.text}
          </div>
        )}

        {currentUser ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="flex flex-col items-center gap-3 my-2">
              <div className="relative group w-24 h-24 rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center border-2 border-indigo-400/50 shadow-lg">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {displayName.charAt(0).toUpperCase() || 'H'}
                  </span>
                )}
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition text-xs font-medium text-white gap-1">
                  <Camera className="w-5 h-5" />
                  Đổi ảnh
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Tên hiển thị (VD: NTP)</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                placeholder="Nhập tên hiển thị mới"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Lưu thay đổi
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="bg-slate-800 hover:bg-red-600/20 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/30 px-3 py-2 rounded-lg transition flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" /> Đăng xuất
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-4">
            {isRegisterMode && (
              <div>
                <label className="block text-xs text-slate-400 mb-1">Tên hiển thị trên App</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Ví dụ: NTP"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-400 mb-1">Tên tài khoản</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Nhập tên tài khoản"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Mật khẩu</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition mt-2"
            >
              {isRegisterMode ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setMessage(null);
                }}
                className="text-xs text-indigo-400 hover:underline"
              >
                {isRegisterMode ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Tạo tài khoản mới'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
