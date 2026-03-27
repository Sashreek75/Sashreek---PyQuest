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
    const labels = ["PREPARING", "SYNCING", "FINALIZING", "READY"];
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] relative overflow-hidden grid-bg">
        <div className="absolute inset-0 bg-[#f5c842]/5 animate-pulse"></div>
        <div className="z-10 text-center space-y-12 animate-in zoom-in duration-700">
          <div className="relative w-48 h-48 mx-auto">
            <div className="absolute inset-0 border-4 border-[#f5c842]/10 border-t-[#f5c842] animate-[spin_2s_linear_infinite] rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-[#1a1714] rounded-[32px] flex items-center justify-center text-[#f5c842] font-serif text-5xl shadow-2xl animate-float">P</div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-serif text-[#1a1714] tracking-tight italic">{labels[handshakeStep]}</div>
            <div className="text-[10px] font-bold text-[#9a9088] uppercase tracking-[0.8em]">Architect Identity: Validating</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] px-6 py-24 relative overflow-hidden grid-bg">
      <div className="absolute top-0 left-0 rail-text h-full flex items-center justify-center pl-8 opacity-20 select-none">
        AUTHENTICATION TERMINAL — PYQUEST SYSTEM
      </div>
      <div className="absolute top-0 right-0 rail-text h-full flex items-center justify-center pr-8 opacity-20 select-none rotate-180">
        SECURE ACCESS — ARCHITECT DESIGNATION
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[1200px] h-[1200px] bg-[#f5c842]/5 rounded-full blur-[200px] animate-neural"></div>
      </div>

      <div className="w-full max-w-xl bg-white border border-[#e8e3db] rounded-[64px] p-12 md:p-20 shadow-2xl relative z-10 space-y-12 animate-in fade-in zoom-in duration-700">
        <div className="text-center space-y-8">
          <div className="w-20 h-20 bg-[#f5c842] rounded-[28px] flex items-center justify-center font-serif text-4xl mx-auto text-[#1a1714] shadow-xl animate-float">P</div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-serif tracking-tight text-[#1a1714]">
              {activeTab === 'login' ? 'Welcome back.' : 'Join the Academy.'}
            </h1>
            <p className="text-sm font-medium text-[#6b6560]">
              {activeTab === 'login' ? 'Synchronize your profile to continue.' : 'Create your architect designation to begin.'}
            </p>
          </div>

          <div className="flex bg-[#faf8f5] p-1.5 rounded-[28px] border border-[#e8e3db]">
            <button 
              onClick={() => { setActiveTab('login'); setError(''); }}
              className={`flex-1 py-4 rounded-[22px] text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'login' ? 'bg-white text-[#1a1714] shadow-md scale-[1.02]' : 'text-[#9a9088] hover:text-[#1a1714]'}`}
            >
              Uplink
            </button>
            <button 
              onClick={() => { setActiveTab('register'); setError(''); }}
              className={`flex-1 py-4 rounded-[22px] text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'register' ? 'bg-white text-[#1a1714] shadow-md scale-[1.02]' : 'text-[#9a9088] hover:text-[#1a1714]'}`}
            >
              New Profile
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {activeTab === 'register' && (
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#9a9088] uppercase tracking-widest px-6">Architect Name</label>
              <input 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#e8e3db] rounded-3xl px-8 py-5 text-[#1a1714] font-medium outline-none focus:border-[#f5c842] transition-all text-lg placeholder:text-[#b0a89e]/50" 
                placeholder="Ex: Alan_Turing"
              />
            </div>
          )}
          
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-[#9a9088] uppercase tracking-widest px-6">Neural ID (Email)</label>
            <input 
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#faf8f5] border border-[#e8e3db] rounded-3xl px-8 py-5 text-[#1a1714] font-medium outline-none focus:border-[#f5c842] transition-all text-lg placeholder:text-[#b0a89e]/50" 
              placeholder="pioneer@pyquest.ai"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-[#9a9088] uppercase tracking-widest px-6">Access Key</label>
            <input 
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#faf8f5] border border-[#e8e3db] rounded-3xl px-8 py-5 text-[#1a1714] font-medium outline-none focus:border-[#f5c842] transition-all text-lg placeholder:text-[#b0a89e]/50" 
              placeholder="••••••••"
            />
          </div>

          {activeTab === 'register' && (
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#9a9088] uppercase tracking-widest px-6">Verify Key</label>
              <input 
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#e8e3db] rounded-3xl px-8 py-5 text-[#1a1714] font-medium outline-none focus:border-[#f5c842] transition-all text-lg placeholder:text-[#b0a89e]/50" 
                placeholder="••••••••"
              />
            </div>
          )}

          <div className="flex items-center gap-4 px-4 cursor-pointer group" onClick={() => setRememberMe(!rememberMe)}>
            <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${rememberMe ? 'bg-[#f5c842] border-[#f5c842]' : 'bg-[#faf8f5] border-[#e8e3db]'}`}>
              {rememberMe && <svg className="w-4 h-4 text-[#1a1714]" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
            </div>
            <span className="text-[10px] font-bold text-[#9a9088] uppercase tracking-widest group-hover:text-[#1a1714] transition-colors">Keep Session Persisted</span>
          </div>

          {error && (
            <div className="p-5 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold uppercase tracking-widest rounded-3xl text-center animate-pulse">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isProcessing}
            className="w-full bg-[#1a1714] text-[#f5c842] py-6 rounded-3xl font-bold text-lg uppercase tracking-widest shadow-xl hover:bg-[#2a2724] transition-all active:scale-95 disabled:opacity-50"
          >
            {activeTab === 'login' ? 'Synchronize' : 'Register Profile'}
          </button>
        </form>

        <div className="text-center pt-8 border-t border-[#e8e3db]">
          <button onClick={onBack} className="text-[10px] font-bold text-[#9a9088] uppercase tracking-[0.4em] hover:text-rose-600 transition-colors">Abort Terminal Ingress</button>
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