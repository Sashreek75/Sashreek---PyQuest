
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface AuthProps {
  onAuth: (user: User) => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuth, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  // Load last used email to "remember" the user across refreshes
  useEffect(() => {
    const lastEmail = localStorage.getItem('pyquest_last_email');
    if (lastEmail) {
      setEmail(lastEmail);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanUsername = username.trim();

    // Retrieve full list of simulated users from storage
    let users: User[] = [];
    try {
      const usersStr = localStorage.getItem('pyquest_users') || '[]';
      users = JSON.parse(usersStr);
    } catch (err) {
      users = [];
    }

    if (isLogin) {
      // Find matching user profile
      const found = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword);
      if (found) {
        localStorage.setItem('pyquest_last_email', cleanEmail);
        onAuth(found);
      } else {
        setError('Verification failed. Invalid email or password.');
      }
    } else {
      // Create new profile if email is unique
      if (users.find(u => u.email.toLowerCase() === cleanEmail)) {
        setError('This email is already associated with an account.');
        return;
      }
      
      // Added missing avatarSeed to comply with the User interface
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username: cleanUsername || 'Pioneer',
        email: cleanEmail,
        password: cleanPassword,
        createdAt: new Date().toISOString(),
        interests: '',
        goal: '',
        avatarSeed: Math.random().toString(36).substr(2, 9)
      };
      
      users.push(newUser);
      localStorage.setItem('pyquest_users', JSON.stringify(users));
      localStorage.setItem('pyquest_last_email', cleanEmail);
      onAuth(newUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-6 py-20 animate-in fade-in zoom-in duration-500 relative">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-[32px] p-8 md:p-12 shadow-3xl relative z-10 backdrop-blur-xl">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center font-black text-2xl mx-auto mb-6 text-white shadow-xl shadow-indigo-600/20">P</div>
          <h2 className="text-3xl font-black text-white tracking-tight">{isLogin ? 'Welcome Back' : 'Create Profile'}</h2>
          <p className="text-slate-500 mt-2 text-sm font-bold uppercase tracking-widest">{isLogin ? 'Resume Journey' : 'Initialize Session'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Display Name</label>
              <input 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-800" 
                placeholder="Architect_01"
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Email Address</label>
            <input 
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-800" 
              placeholder="pioneer@pyquest.ai"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Access Key</label>
            <input 
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-800" 
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase rounded-2xl text-center">
              {error}
            </div>
          )}

          <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 py-4 rounded-2xl text-white font-black text-lg shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98]">
            {isLogin ? 'Authenticate' : 'Register'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-[10px] font-black text-slate-500 hover:text-indigo-400 uppercase tracking-widest"
          >
            {isLogin ? "Need a profile? Initialize account" : "Have a profile? Synchronize session"}
          </button>
          <div className="h-px bg-slate-800 w-full my-4"></div>
          <button onClick={onBack} className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] hover:text-slate-400 transition-colors">Abort & Return</button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
