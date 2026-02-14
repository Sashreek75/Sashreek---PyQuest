
import React, { useState, useEffect } from 'react';
import { User, Progress, Quest, UserStats, SkillNode } from '../types';
import { QUESTS } from '../constants';
import Visualizer from './Visualizer';
import AuraFeed from './AuraFeed';

interface DashboardProps {
  user: User;
  progress: Progress;
  stats: UserStats;
  onNavigate: (view: 'Academy' | 'CareerPath' | 'Profile') => void;
  onSelectQuest: (quest: Quest) => void;
  onLogout: () => void;
  onToggleAura: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, progress, stats, onNavigate, onSelectQuest, onLogout, onToggleAura }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  const getCategoryProgress = (category: string) => {
    const totalInCat = QUESTS.filter(q => q.category.includes(category)).length;
    const completedInCat = QUESTS.filter(q => q.category.includes(category) && progress.completedQuests.includes(q.id)).length;
    return totalInCat === 0 ? 0 : Math.round((completedInCat / totalInCat) * 100);
  };

  const skillMatrix: SkillNode[] = [
    { name: 'Python Engineering', level: getCategoryProgress('Python Foundations'), xp: progress.experience / 4, color: 'indigo' },
    { name: 'Data Manipulation', level: getCategoryProgress('Data Engineering'), xp: progress.experience / 5, color: 'emerald' },
    { name: 'Classical Algorithms', level: getCategoryProgress('Classical ML'), xp: progress.experience / 6, color: 'amber' },
    { name: 'Neural Design', level: Math.max(getCategoryProgress('Neural Architectures'), getCategoryProgress('Deep Learning')), xp: progress.experience / 8, color: 'rose' },
  ];

  const nextQuest = QUESTS.find(q => !progress.completedQuests.includes(q.id));

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-200 flex font-sans selection:bg-indigo-500/30 relative">
      <aside className="w-80 border-r border-white/5 flex flex-col bg-[#050810] hidden lg:flex shadow-2xl relative z-20">
        <div className="p-10 flex-1">
          <div className="flex items-center gap-5 mb-16 group">
            <div className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg transition-transform group-hover:scale-110 italic">P</div>
            <div>
               <span className="font-black tracking-tight text-white uppercase text-base block">PyQuest Core</span>
               <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Applied Intelligence</span>
            </div>
          </div>

          <nav className="space-y-3">
            {[
              { id: 'Overview', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', action: () => setActiveTab('Overview') },
              { id: 'Academy', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', action: () => onNavigate('Academy') },
              { id: 'Strategist', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', action: () => onNavigate('CareerPath') },
              { id: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', action: () => onNavigate('Profile') }
            ].map(item => (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center gap-5 px-6 py-5 rounded-2xl transition-all text-[12px] font-black uppercase tracking-widest ${
                  activeTab === item.id ? 'bg-white/10 text-white shadow-xl border border-white/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
                </svg>
                {item.id}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-10 border-t border-white/5 space-y-8 bg-[#03060c]">
          <div className="flex items-center gap-5">
             <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center font-black text-white text-xl shadow-xl relative overflow-hidden group italic">
               <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               {user.username.charAt(0)}
             </div>
             <div className="flex-1 overflow-hidden">
               <div className="text-sm font-black text-white leading-none truncate uppercase tracking-tighter">{user.username}</div>
               <div className="text-[10px] font-bold text-indigo-400 uppercase mt-2 tracking-widest">{stats.rank}</div>
             </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full text-left px-6 py-4 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-500/5 transition-all rounded-xl border border-rose-500/10"
          >
            End Protocol
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#02040a] relative z-10">
        <header className="h-24 border-b border-white/5 px-14 flex items-center justify-between sticky top-0 bg-[#02040a]/95 backdrop-blur-3xl z-40">
          <div className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500">
            Academy / <span className="text-indigo-400">Terminal</span> / Overview
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-6 py-3 bg-indigo-500/5 rounded-full border border-indigo-500/20">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_#4f46e5]"></span>
              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Aura Uplink Stable</span>
            </div>
          </div>
        </header>

        <div className="p-14 max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          {/* Neural Directive */}
          {progress.personalization && (
            <div className="p-16 rounded-[64px] bg-[#0b0e14] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-700">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 animate-neural"></div>
              <div className="relative z-10 space-y-8">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.6em]">Neural Directive</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] italic max-w-5xl group-hover:text-indigo-50 transition-colors">
                  "{progress.personalization.aiDirective}"
                </h1>
                <p className="text-slate-400 text-2xl font-medium leading-relaxed max-w-4xl">
                  {progress.personalization.summary}
                </p>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { label: 'Neural Experience', val: progress.experience.toLocaleString(), sub: 'XP Points', color: 'indigo' },
              { label: 'Strategic Evolution', val: stats.questsCompleted, sub: 'Benchmarks Mastered', color: 'emerald' },
              { label: 'Activity Streak', val: stats.streak, sub: 'Consecutive Days', color: 'amber' }
            ].map((stat, i) => (
              <div key={i} className="p-12 rounded-[48px] bg-[#0b0e14] border border-white/5 hover:border-white/10 transition-all shadow-2xl group relative overflow-hidden">
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${stat.color}-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-10">{stat.label}</div>
                <div className="flex items-baseline gap-4">
                  <div className="text-6xl font-black text-white tracking-tighter group-hover:scale-105 transition-transform">{stat.val}</div>
                  <div className={`text-[11px] font-black text-${stat.color}-400 uppercase tracking-widest`}>{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
            <div className="lg:col-span-8 space-y-14">
              {/* Evolution Bar */}
              <div className="p-14 rounded-[56px] bg-[#0b0e14] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-14">
                  <div className="space-y-4 text-center md:text-left">
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none italic">Tier {stats.level} <br /> <span className="text-slate-700 not-italic">Architect</span></h2>
                    <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-[0.5em]">Next Evolution at {((stats.level) * 1000).toLocaleString()} XP</p>
                  </div>
                  <div className="w-full md:w-80 h-4 bg-slate-950 rounded-full overflow-hidden border border-white/10 p-1">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-600 via-indigo-400 to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(79,70,229,0.5)]" 
                      style={{ width: `${(progress.experience % 1000) / 10}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Objective Queue */}
              <div className="space-y-10">
                <div className="flex items-center justify-between px-4">
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.5em] flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_#4f46e5]"></div>
                    Current Tactical Priority
                  </h3>
                  <button onClick={() => onNavigate('Academy')} className="text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-widest transition-colors">Academy Access Repository &rarr;</button>
                </div>

                {nextQuest ? (
                  <div 
                    onClick={() => onSelectQuest(nextQuest)}
                    className="group p-12 rounded-[56px] bg-[#0b0e14] border border-white/5 hover:border-indigo-500/40 transition-all duration-500 cursor-pointer flex items-center justify-between shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors"></div>
                    <div className="space-y-6 relative z-10">
                      <div className="flex items-center gap-5">
                        <span className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Active Quest</span>
                        <h4 className="text-3xl font-black text-white group-hover:text-indigo-400 transition-colors leading-none tracking-tighter uppercase italic">{nextQuest.title}</h4>
                      </div>
                      <p className="text-xl text-slate-500 max-w-2xl leading-relaxed font-medium">{nextQuest.description}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-slate-700 group-hover:bg-white group-hover:text-black transition-all shadow-xl relative z-10">
                       <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                ) : (
                  <div className="p-20 text-center bg-emerald-500/5 border border-emerald-500/20 rounded-[56px] shadow-2xl animate-in zoom-in">
                    <div className="text-6xl mb-10">🏆</div>
                    <div className="text-4xl font-black text-white uppercase tracking-tighter italic">Strategic Milestone Mastery Complete</div>
                  </div>
                )}
              </div>

              <div className="h-[350px]">
                <AuraFeed />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-14">
              {/* Consult Aura Component */}
              <div className="p-12 rounded-[56px] bg-indigo-600 border border-indigo-400 space-y-10 shadow-[0_0_80px_rgba(79,70,229,0.3)] group relative overflow-hidden hover:scale-[1.02] transition-transform">
                <div className="absolute -inset-20 bg-white/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-white text-7xl animate-float">🧠</div>
                <div className="space-y-4 relative z-10">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Neural Co-Pilot</h3>
                  <p className="text-sm text-indigo-50 font-medium leading-relaxed">Stuck on a backpropagation implementation? Aura is ready to audit your logical kernels.</p>
                </div>
                <button onClick={onToggleAura} className="w-full py-5 bg-white text-indigo-600 rounded-[28px] font-black text-[12px] uppercase tracking-widest shadow-2xl hover:bg-indigo-50 transition-colors relative z-10">Initialize Aura Consultation</button>
              </div>

              {/* Cognitive Matrix */}
              <div className="p-12 rounded-[56px] bg-[#0b0e14] border border-white/5 space-y-14 shadow-2xl">
                <h3 className="text-xs font-black text-white uppercase tracking-[0.5em] flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_#4f46e5]"></div>
                  Cognitive Matrix
                </h3>
                <div className="space-y-12">
                  {skillMatrix.map((skill, i) => (
                    <div key={i} className="space-y-5">
                      <div className="flex justify-between items-end">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{skill.name}</span>
                        <span className={`text-xs font-black text-white`}>{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5 p-0.5">
                        <div 
                          className={`h-full bg-indigo-500 transition-all duration-1000 shadow-[0_0_10px_rgba(79,70,229,0.3)]`} 
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Utility Grid */}
              <div className="grid grid-cols-2 gap-8">
                <button 
                  onClick={() => onNavigate('CareerPath')}
                  className="p-10 rounded-[40px] bg-[#1a1c24] hover:bg-indigo-600 transition-all text-center space-y-5 group border border-white/5 shadow-2xl active:scale-95"
                >
                  <div className="text-4xl group-hover:scale-125 transition-transform duration-500">🗺️</div>
                  <div className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Pathfinder</div>
                </button>
                <button 
                  onClick={() => onNavigate('Academy')}
                  className="p-10 rounded-[40px] bg-[#1a1c24] hover:bg-indigo-600 transition-all text-center space-y-5 group border border-white/5 shadow-2xl active:scale-95"
                >
                  <div className="text-4xl group-hover:scale-125 transition-transform duration-500">📁</div>
                  <div className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Repository</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes neural-drift {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.1) translate(20px, -20px); }
        }
        .animate-neural { animation: neural-drift 20s ease-in-out infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      ` }} />
    </div>
  );
};

export default Dashboard;
