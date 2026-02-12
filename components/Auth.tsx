
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

    if (activeTab === 'register' && password !== confirmPassword) {
      setError('Key mismatch. Confirm your Access Key.');
      return;
    }

    if (activeTab === 'register' && username.trim().length < 3) {
      setError('Architect Name must be at least 3 characters');
      return;
    }

    setIsProcessing(true);
    
    // Handshake animation
    const steps = ["Encrypting Credentials...", "Handshaking with Sentinel...", "Syncing Neural Progress...", "Access Granted"];
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
    if (activeTab === 'login') {
      const user = db.login(email, password);
      if (user) {
        db.setSession(user);
        onAuth(user);
      } else {
        setError('Authorization Failed: Identity not found or key mismatch.');
        setIsProcessing(false);
      }
    } else {
      const newUser: User = {
        id: `PQ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        createdAt: new Date().toISOString(),
        interests: '',
        goal: '',
        avatarSeed: Math.random().toString(36).substr(2, 9),
        provider: 'email'
      };

      const result = db.register(newUser);
      if (result.success) {
        db.setSession(newUser);
        onAuth(newUser);
      } else {
        setError(result.error || 'Registration failed.');
        setIsProcessing(false);
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#010208] px-6 py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-indigo-600/10 rounded-full blur-[180px] animate-neural"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-violet-600/5 rounded-full blur-[150px] animate-neural"></div>
      </div>

      <div className="w-full max-w-lg bg-[#0b0e14]/90 border border-white/5 rounded-[56px] p-10 md:p-14 shadow-3xl backdrop-blur-3xl relative z-10 space-y-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[22px] flex items-center justify-center font-black text-3xl mx-auto text-white shadow-2xl crt-flicker mb-8">P</div>
          
          {/* Tab Selector */}
          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 mb-10">
            <button 
              onClick={() => { setActiveTab('login'); setError(''); }}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'login' ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setActiveTab('register'); setError(''); }}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'register' ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
            >
              Register
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === 'register' && (
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-4">Architect Name</label>
              <input 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:border-indigo-600 transition-all" 
                placeholder="Ex: Alan_Turing"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-4">Neural ID (Email)</label>
            <input 
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:border-indigo-600 transition-all" 
              placeholder="pioneer@pyquest.ai"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-4">Access Key</label>
            <input 
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:border-indigo-600 transition-all" 
              placeholder="••••••••"
            />
          </div>

          {activeTab === 'register' && (
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-4">Confirm Key</label>
              <input 
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:border-indigo-600 transition-all" 
                placeholder="••••••••"
              />
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase rounded-2xl text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black text-lg uppercase tracking-tighter shadow-3xl hover:bg-indigo-50 transition-all active:scale-95"
          >
            {activeTab === 'login' ? 'Synchronize Session' : 'Initialize Profile'}
          </button>
        </form>

        <div className="text-center pt-4">
          <button onClick={onBack} className="text-[9px] font-black text-slate-800 uppercase tracking-[0.5em] hover:text-slate-500 transition-colors">Abort Terminal Connection</button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
