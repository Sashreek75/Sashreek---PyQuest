
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [handshakeStep, setHandshakeStep] = useState(0);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Invalid Neural ID format (Email)');
      return;
    }

    if (password.length < 6) {
      setError('Access Key must be at least 6 characters');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Key mismatch. Confirm your Access Key.');
      return;
    }

    if (!isLogin && username.trim().length < 3) {
      setError('Architect Name must be at least 3 characters');
      return;
    }

    setIsProcessing(true);
    
    // High-fidelity security handshake sequence
    const steps = ["Encypting Credentials...", "Handshaking with Sentinel...", "Syncing Neural Progress...", "Access Granted"];
    let currentStep = 0;
    const interval = setInterval(() => {
      setHandshakeStep(currentStep);
      currentStep++;
      if (currentStep >= steps.length) {
        clearInterval(interval);
        processAuth();
      }
    }, 600);
  };

  const processAuth = () => {
    const usersStr = localStorage.getItem('pyquest_users') || '[]';
    const users: User[] = JSON.parse(usersStr);
    const cleanEmail = email.trim().toLowerCase();

    if (isLogin) {
      const found = users.find(u => u.email === cleanEmail && u.password === password);
      if (found) {
        onAuth(found);
      } else {
        setError('Authorization Failed: Invalid Email or Access Key.');
        setIsProcessing(false);
      }
    } else {
      if (users.find(u => u.email === cleanEmail)) {
        setError('Collision Detected: Neural ID already registered.');
        setIsProcessing(false);
      } else {
        const newUser: User = {
          id: `PQ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          username: username.trim(),
          email: cleanEmail,
          password: password,
          createdAt: new Date().toISOString(),
          interests: '',
          goal: '',
          avatarSeed: Math.random().toString(36).substr(2, 9),
          provider: 'email'
        };
        users.push(newUser);
        localStorage.setItem('pyquest_users', JSON.stringify(users));
        onAuth(newUser);
      }
    }
  };

  if (isProcessing) {
    const steps = ["ENCRYPTING...", "HANDSHAKING...", "SYNCING...", "GRANTED"];
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#010208] relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/5 animate-pulse"></div>
        <div className="z-10 text-center space-y-8 animate-in zoom-in duration-500">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-3xl crt-flicker">P</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-black text-white tracking-tighter uppercase">{steps[handshakeStep]}</div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em]">System Integrity Check: Valid</div>
          </div>
          <div className="max-w-xs mx-auto h-1 bg-slate-900 rounded-full overflow-hidden">
             <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${(handshakeStep + 1) * 25}%` }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#010208] px-6 py-20 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-indigo-600/10 rounded-full blur-[180px] animate-neural"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-violet-600/5 rounded-full blur-[150px] animate-neural"></div>
      </div>

      <div className="w-full max-w-lg bg-[#0b0e14]/80 border border-white/5 rounded-[56px] p-12 md:p-16 shadow-3xl backdrop-blur-3xl relative z-10 space-y-12 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[28px] flex items-center justify-center font-black text-4xl mx-auto text-white shadow-2xl crt-flicker mb-6">P</div>
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
            {isLogin ? 'Welcome Back' : 'Join the Elite'}
          </h2>
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">{isLogin ? 'Resume your ascension' : 'Initialize your architect profile'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Architect Name</label>
              <input 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-3xl px-8 py-5 text-white font-medium outline-none focus:border-indigo-600 transition-all placeholder:text-slate-900" 
                placeholder="Ex: Alan_Turing"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Neural ID (Email)</label>
            <input 
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-3xl px-8 py-5 text-white font-medium outline-none focus:border-indigo-600 transition-all placeholder:text-slate-900" 
              placeholder="pioneer@pyquest.ai"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Access Key</label>
              <input 
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-3xl px-8 py-5 text-white font-medium outline-none focus:border-indigo-600 transition-all placeholder:text-slate-900" 
                placeholder="••••••••"
              />
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Confirm Key</label>
                <input 
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-3xl px-8 py-5 text-white font-medium outline-none focus:border-indigo-600 transition-all placeholder:text-slate-900" 
                  placeholder="••••••••"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="p-5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-black uppercase rounded-3xl text-center animate-shake">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-white text-slate-950 py-6 rounded-3xl font-black text-xl uppercase tracking-tighter shadow-3xl hover:bg-indigo-50 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLogin ? 'Authenticate Session' : 'Create Architect Identity'}
          </button>
        </form>

        <div className="text-center space-y-6 pt-6">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-[11px] font-black text-slate-500 hover:text-white uppercase tracking-[0.3em] transition-colors"
          >
            {isLogin ? "Need a profile? Initialize new sequence" : "Have a profile? Synchronize session"}
          </button>
          <div className="pt-4">
            <button onClick={onBack} className="text-[9px] font-black text-slate-800 uppercase tracking-[0.5em] hover:text-slate-500 transition-colors">Abort Terminal Connection</button>
          </div>
        </div>
      </div>
      
      <style>{`
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default Auth;
