import React, { useState } from 'react';
import { User } from '../types';
import { db } from '../services/dbService';

interface AuthProps {
  onAuth: (user: User) => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuth, onBack }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [handshakeStep, setHandshakeStep] = useState(0);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();

    if (!validateEmail(cleanEmail)) {
      setError('Invalid Neural ID format (Email)');
      return;
    }

    if (password.length < 6) {
      setError('Access Key must be at least 6 characters');
      return;
    }

    if (activeTab === 'register' && password !== confirmPassword) {
      setError('Key mismatch. Confirm your Access Key.');
      return;
    }

    if (activeTab === 'register' && username.trim().length < 3) {
      setError('Architect Name must be at least 3 characters');
      return;
    }

    setIsProcessing(true);
    setHandshakeStep(0);
    
    // Cinematic Handshake
    const steps = ["Hashing Keys...", "Syncing Distributed Nodes...", "Finalizing Identity Matrix...", "Access Granted"];
    let currentStep = 0;
    const interval = setInterval(() => {
      setHandshakeStep(currentStep);
      currentStep++;
      if (currentStep >= steps.length) {
        clearInterval(interval);
        processAuth();
      }
    }, 400);
  };

  const processAuth = () => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanUsername = username.trim();

      if (activeTab === 'login') {
        const result = db.login(cleanEmail, password);
        if (result.success) {
          const sessionUser = { ...result.user, rememberMe };
          db.setSession(sessionUser);
          onAuth(sessionUser);
        } else {
          setIsProcessing(false);
          // Fix: Narrowing AuthResult using 'in' operator to safely access 'reason' property
          if ('reason' in result) {
            if (result.reason === 'NOT_FOUND') {
              setError('Neural ID not found. Did you create a profile yet?');
            } else if (result.reason === 'WRONG_PASSWORD') {
              setError('Access Key mismatch. Verify your credentials.');
            } else {
              setError('Authorization Failure: Uplink unstable.');
            }
          }
        }
      } else {
        const newUser: User = {
          id: `PQ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          username: cleanUsername,
          email: cleanEmail,
          password: password,
          createdAt: new Date().toISOString(),
          interests: '',
          goal: '',
          avatarSeed: Math.random().toString(36).substr(2, 9),
          provider: 'email',
          rememberMe
        };

        const result = db.register(newUser);
        if (result.success) {
          db.setSession(newUser);
          onAuth(newUser);
        } else {
          setError(result.error || 'Identity Registration failed.');
          setIsProcessing(false);
        }
      }
    } catch (err) {
      console.error('Auth crash:', err);
      setError('Kernel Exception: Memory fault. Reload required.');
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    const labels = ["ENCRYPTING", "SYNCING", "FINALIZING", "ACTIVE"];
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#010208] relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/5 animate-pulse"></div>
        <div className="z-10 text-center space-y-12 animate-in zoom-in duration-500">
          <div className="relative w-40 h-40 mx-auto">
            <div className="absolute inset-0 border-4 border-indigo-500/10 border-t-indigo-500 animate-[spin_1s_linear_infinite] rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white font-black text-4xl shadow-3xl crt-flicker italic">P</div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-4xl font-black text-white tracking-tighter uppercase italic">{labels[handshakeStep]}</div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.8em]">System Integrity: Validated</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#010208] px-12 py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[1200px] h-[1200px] bg-indigo-600/10 rounded-full blur-[200px] animate-neural"></div>
      </div>

      <div className="w-full max-w-xl bg-[#0b0e14]/90 border border-white/5 rounded-[64px] p-16 md:p-24 shadow-3xl backdrop-blur-3xl relative z-10 space-y-12 animate-in fade-in zoom-in duration-700">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[32px] flex items-center justify-center font-black text-4xl mx-auto text-white shadow-3xl crt-flicker mb-10 italic">P</div>
          
          <div className="flex bg-black/60 p-1.5 rounded-[28px] border border-white/5 mb-12">
            <button 
              onClick={() => { setActiveTab('login'); setError(''); }}
              className={`flex-1 py-4 rounded-[22px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'login' ? 'bg-white text-black shadow-2xl scale-105' : 'text-slate-500 hover:text-white'}`}
            >
              Uplink
            </button>
            <button 
              onClick={() => { setActiveTab('register'); setError(''); }}
              className={`flex-1 py-4 rounded-[22px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'register' ? 'bg-white text-black shadow-2xl scale-105' : 'text-slate-500 hover:text-white'}`}
            >
              New Profile
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {activeTab === 'register' && (
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-6">Architect Designation</label>
              <input 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/60 border border-white/5 rounded-3xl px-8 py-5 text-white font-bold outline-none focus:border-indigo-600 transition-all text-lg" 
                placeholder="Ex: Alan_Turing"
              />
            </div>
          )}
          
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-6">Neural ID (Email)</label>
            <input 
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/60 border border-white/5 rounded-3xl px-8 py-5 text-white font-bold outline-none focus:border-indigo-600 transition-all text-lg" 
              placeholder="pioneer@pyquest.ai"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-6">Access Key</label>
            <input 
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/60 border border-white/5 rounded-3xl px-8 py-5 text-white font-bold outline-none focus:border-indigo-600 transition-all text-lg" 
              placeholder="••••••••"
            />
          </div>

          {activeTab === 'register' && (
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-6">Verify Key</label>
              <input 
                required
                type="password"
                value={confirmPassword}
                // Fix: Correctly update confirmPassword state instead of password
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-black/60 border border-white/5 rounded-3xl px-8 py-5 text-white font-bold outline-none focus:border-indigo-600 transition-all text-lg" 
                placeholder="••••••••"
              />
            </div>
          )}

          <div className="flex items-center gap-4 px-4 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
            <div className={`w-6 h-6 rounded-lg border-2 border-white/10 flex items-center justify-center transition-all ${rememberMe ? 'bg-indigo-600 border-indigo-500' : 'bg-black/40'}`}>
              {rememberMe && <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Keep Session Persisted</span>
          </div>

          {error && (
            <div className="p-5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-black uppercase rounded-3xl text-center animate-pulse">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isProcessing}
            className="w-full bg-white text-slate-950 py-6 rounded-3xl font-black text-xl uppercase tracking-tighter shadow-3xl hover:bg-indigo-50 transition-all active:scale-95 disabled:opacity-50"
          >
            {activeTab === 'login' ? 'Synchronize' : 'Register Profile'}
          </button>
        </form>

        <div className="text-center pt-6 border-t border-white/5">
          <button onClick={onBack} className="text-[10px] font-black text-slate-800 uppercase tracking-[0.8em] hover:text-slate-500 transition-colors">Abort Terminal Ingress</button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes neural-drift { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .animate-neural { animation: neural-drift 20s infinite ease-in-out; }
      ` }} />
    </div>
  );
};

export default Auth;