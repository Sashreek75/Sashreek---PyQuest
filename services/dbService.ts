
import { User, Progress } from '../types';

const KEYS = {
  USERS: 'pyquest_engine_users_v3',
  PROGRESS: 'pyquest_engine_progress_v3',
  SESSION: 'pyquest_active_session_v3'
};

export type AuthResult = 
  | { success: true; user: User }
  | { success: false; reason: 'NOT_FOUND' | 'WRONG_PASSWORD' | 'ERROR' };

class DatabaseService {
  private normalizeEmail(email: string): string {
    return (email || '').trim().toLowerCase();
  }

  private getUsers(): User[] {
    try {
      const data = localStorage.getItem(KEYS.USERS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Critical: Database corruption. Attempting recovery.", e);
      return [];
    }
  }

  private saveUsers(users: User[]) {
    try {
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.error("Storage Error: Local quota might be exceeded.", e);
    }
  }

  private getAllProgress(): Record<string, Progress> {
    try {
      const data = localStorage.getItem(KEYS.PROGRESS);
      if (!data) return {};
      const parsed = JSON.parse(data);
      return (parsed && typeof parsed === 'object') ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  private saveAllProgress(allProgress: Record<string, Progress>) {
    try {
      localStorage.setItem(KEYS.PROGRESS, JSON.stringify(allProgress));
    } catch (e) {}
  }

  // --- Auth ---

  public register(user: User): { success: boolean; error?: string } {
    const users = this.getUsers();
    const cleanEmail = this.normalizeEmail(user.email);
    
    const existing = users.find(u => this.normalizeEmail(u.email) === cleanEmail);
    if (existing) {
      return { success: false, error: 'Neural ID already active. Attempt uplink via login.' };
    }

    const normalizedUser = {
      ...user,
      email: cleanEmail
    };

    users.push(normalizedUser);
    this.saveUsers(users);
    console.debug(`New Architect Registered: ${cleanEmail}. Total: ${users.length}`);
    return { success: true };
  }

  public login(email: string, password?: string): AuthResult {
    const users = this.getUsers();
    const cleanEmail = this.normalizeEmail(email);
    
    const user = users.find(u => this.normalizeEmail(u.email) === cleanEmail);
    
    if (!user) {
      console.warn(`Login Fail: Account ${cleanEmail} not found. DB size: ${users.length}`);
      return { success: false, reason: 'NOT_FOUND' };
    }

    if (user.password !== password) {
      console.warn(`Login Fail: Password mismatch for ${cleanEmail}`);
      return { success: false, reason: 'WRONG_PASSWORD' };
    }
    
    console.debug(`Uplink Successful: ${cleanEmail}`);
    return { success: true, user: { ...user } };
  }

  public setSession(user: User) {
    try {
      localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
    } catch (e) {}
  }

  public getSession(): User | null {
    const data = localStorage.getItem(KEYS.SESSION);
    try {
      if (!data) return null;
      const sessionUser = JSON.parse(data) as User;
      const allUsers = this.getUsers();
      const verifiedUser = allUsers.find(u => u.id === sessionUser.id);
      return verifiedUser ? { ...verifiedUser, rememberMe: sessionUser.rememberMe } : null;
    } catch {
      return null;
    }
  }

  public clearSession() {
    localStorage.removeItem(KEYS.SESSION);
  }

  // --- Progress ---

  public getProgress(userId: string): Progress | null {
    const all = this.getAllProgress();
    return all[userId] || null;
  }

  public saveProgress(userId: string, progress: Progress) {
    const all = this.getAllProgress();
    all[userId] = progress;
    this.saveAllProgress(all);
  }
}

export const db = new DatabaseService();
