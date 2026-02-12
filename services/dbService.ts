
import { User, Progress } from '../types';

const KEYS = {
  USERS: 'pyquest_db_users',
  PROGRESS: 'pyquest_db_progress',
  SESSION: 'pyquest_active_session'
};

class DatabaseService {
  private getUsers(): User[] {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  }

  private saveUsers(users: User[]) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  }

  private getAllProgress(): Record<string, Progress> {
    const data = localStorage.getItem(KEYS.PROGRESS);
    return data ? JSON.parse(data) : {};
  }

  private saveAllProgress(allProgress: Record<string, Progress>) {
    localStorage.setItem(KEYS.PROGRESS, JSON.stringify(allProgress));
  }

  // --- Auth ---

  public register(user: User): { success: boolean; error?: string } {
    const users = this.getUsers();
    if (users.find(u => u.email.toLowerCase() === user.email.toLowerCase())) {
      return { success: false, error: 'Neural ID already exists in our archives.' };
    }
    users.push(user);
    this.saveUsers(users);
    return { success: true };
  }

  public login(email: string, password?: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    return user || null;
  }

  public setSession(user: User) {
    localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
  }

  public getSession(): User | null {
    const data = localStorage.getItem(KEYS.SESSION);
    return data ? JSON.parse(data) : null;
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
