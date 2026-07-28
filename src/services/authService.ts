export interface UserAccount {
  username: string;
  password: string;
  displayName: string;
  avatarUrl?: string;
}

const USERS_KEY = 'ntp_users_db';
const CURRENT_USER_KEY = 'ntp_current_user';

export const authService = {
  getUsers(): UserAccount[] {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getCurrentUser(): UserAccount | null {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  register(account: UserAccount): { success: boolean; message: string } {
    const users = this.getUsers();
    if (users.some(u => u.username === account.username)) {
      return { success: false, message: 'Tên tài khoản đã tồn tại!' };
    }
    users.push(account);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(account));
    return { success: true, message: 'Đăng ký tài khoản thành công!' };
  },

  login(username: string, password: string): { success: boolean; message: string; user?: UserAccount } {
    const users = this.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      return { success: false, message: 'Tài khoản hoặc mật khẩu không chính xác!' };
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return { success: true, message: 'Đăng nhập thành công!', user };
  },

  updateProfile(updatedData: Partial<UserAccount>): UserAccount | null {
    const current = this.getCurrentUser();
    if (!current) return null;

    const newProfile = { ...current, ...updatedData };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newProfile));

    const users = this.getUsers();
    const index = users.findIndex(u => u.username === current.username);
    if (index !== -1) {
      users[index] = newProfile;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    return newProfile;
  },

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};
