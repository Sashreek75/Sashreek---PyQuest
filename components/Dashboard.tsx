
import React, { useState } from 'react';
import { User, Progress, Quest, UserStats, SkillNode } from '../types';
import { QUESTS } from '../constants';
import AuraFeed from './AuraFeed';

interface DashboardProps {
  user: User;
  progress: Progress;
  stats: UserStats;
  onNavigate: (view: 'Academy' | 'CareerPath' | 'Profile' | 'Sandbox' | 'Brain') => void;
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
    <div className="min-h-screen bg-[#02040a] text-slate-200 flex font-jakarta selection:bg-indigo-500/30 relative">
      <aside className="w-80 border-r border-white/5 flex flex-col bg-[#050810] hidden lg:flex shadow-2xl relative z-20">
        <div className="p-10 flex-1">
          <div className="flex items-center gap-5 mb-16 group">
            <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg transition-transform group-hover:scale-110 italic">P</div>
            <div>
               <span className="font-bold tracking-tight text-white uppercase text-sm block">PyQuest Core</span>
               <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Architect Terminal</span>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'Overview', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', action: () => setActiveTab('Overview') },
              { id: 'Academy', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', action: () => onNavigate('Academy') },
              { id: 'Brain', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', action: () => onNavigate('Brain') },
              { id: 'Sandbox', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', action: () => onNavigate('Sandbox') },
              { id: 'Strategist', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', action: () => onNavigate('CareerPath') },
              { id: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', action: () => onNavigate('Profile') }
            ].map(item => (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center gap-5 px-6 py-4 rounded-xl transition-all text-[11px] font-bold uppercase tracking-widest ${
                  activeTab === item.id || (item.id === 'Sandbox' && activeTab === 'Sandbox') ? 'bg-white/10 text-white shadow-xl border border-white/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
                {item.id}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-10 border-t border-white/5 space-y-6 bg-[#03060c]">
          {/* Neural Directive Sidebar Card */}
          {progress.personalization && (
            <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl space-y-3 shadow-inner">
              <span className="text-[9px] font-bold text-indigo-400/70 uppercase tracking-[0.2em]">Active Directive</span>
              <div className="text-[13px] font-medium text-indigo-50/90 leading-relaxed">
                "{progress.personalization.aiDirective}"
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white text-lg shadow-xl relative overflow-hidden group">
               {user.username.charAt(0).toUpperCase()}
             </div>
             <div className="flex-1 overflow-hidden">
               <div className="text-sm font-bold text-white leading-none truncate tracking-tight">{user.username}</div>
               <div className="text-[10px] font-medium text-slate-500 mt-2 tracking-widest uppercase">{stats.rank}</div>
             </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full text-center py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-rose-400 transition-colors border border-white/5 rounded-lg"
          >
            End Protocol
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#02040a] relative z-10 scroll-smooth">
        <header className="h-20 border-b border-white/5 px-14 flex items-center justify-between sticky top-0 bg-[#02040a]/90 backdrop-blur-xl z-40">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
            Network / <span className="text-indigo-400">Node_{user.id.slice(-4)}</span> / Interface
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 rounded-full border border-emerald-500/10">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[9px] font-bold uppercase text-emerald-400 tracking-widest">Uplink Active</span>
            </div>
          </div>
        </header>

        <div className="p-14 max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.5em]">Dashboard Orientation</span>
            <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tight leading-none">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 drop-shadow-sm italic">{user.username}.</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium max-w-3xl leading-relaxed">
              {progress.personalization?.summary || "Your neural training terminal is ready. Select a module to begin your professional evolution."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Intelligence Points', val: progress.experience.toLocaleString(), sub: 'XP EARNED', color: 'indigo' },
              { label: 'Milestones Mastered', val: stats.questsCompleted, sub: 'BENCHMARKS', color: 'emerald' },
              { label: 'Neural Streak', val: stats.streak, sub: 'CONSECUTIVE DAYS', color: 'amber' }
            ].map((stat, i) => (
              <div key={i} className="p-10 rounded-[40px] bg-[#0b0e14]/50 border border-white/5 hover:border-white/10 transition-all shadow-xl group">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">{stat.label}</div>
                <div className="flex items-baseline gap-3">
                  <div className="text-5xl font-extrabold text-white tracking-tight group-hover:scale-[1.02] transition-transform">{stat.val}</div>
                  <div className={`text-[10px] font-black text-${stat.color}-400 uppercase tracking-widest`}>{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              <div className="p-10 rounded-[48px] bg-[#0b0e14]/50 border border-white/5 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                  <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-4xl font-extrabold text-white tracking-tight leading-none italic">Architect <span className="text-indigo-400">Tier {stats.level}</span></h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Evolution Progress: {Math.round((progress.experience % 1000) / 10)}%</p>
                  </div>
                  <div className="w-full md:w-80 h-3 bg-slate-900 rounded-full overflow-hidden border border-white/5 p-0.5">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(79,70,229,0.3)]" 
                      style={{ width: `${(progress.experience % 1000) / 10}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.3em] flex items-center gap-3 ml-4">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                  Pending Tactical Goal
                </h3>

                {nextQuest ? (
                  <div 
                    onClick={() => onSelectQuest(nextQuest)}
                    className="group p-10 rounded-[48px] bg-[#0b0e14] border border-white/5 hover:border-indigo-500/30 transition-all duration-500 cursor-pointer flex items-center justify-between shadow-2xl"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-indigo-500/10">Next Benchmark</span>
                        <h4 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight italic">{nextQuest.title}</h4>
                      </div>
                      <p className="text-lg text-slate-500 max-w-2xl font-medium">{nextQuest.description}</p>
                    </div>
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-white group-hover:text-black transition-all">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                ) : (
                  <div className="p-16 text-center bg-emerald-500/5 border border-emerald-500/10 rounded-[48px] shadow-xl">
                    <div className="text-5xl mb-6">✨</div>
                    <div className="text-3xl font-bold text-white tracking-tight uppercase">Curriculum Mastered</div>
                  </div>
                )}
              </div>

              <div className="h-[300px]">
                <AuraFeed />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-12">
              <div className="p-10 rounded-[48px] bg-indigo-600 border border-indigo-400/30 space-y-8 shadow-2xl group hover:scale-[1.01] transition-transform">
                <div className="text-white text-6xl opacity-90 transition-transform group-hover:rotate-12 group-hover:scale-110">🧠</div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white tracking-tight">Consult Lead AI</h3>
                  <p className="text-sm text-indigo-50 font-medium leading-relaxed opacity-80">Deep technical insights and socratic guidance on active neural kernels.</p>
                </div>
                <button onClick={onToggleAura} className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold text-[11px] uppercase tracking-widest shadow-xl hover:bg-indigo-50 transition-colors">Initialize Uplink</button>
              </div>

              <div className="p-10 rounded-[48px] bg-[#0b0e14]/50 border border-white/5 space-y-10 shadow-xl">
                <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.3em] flex items-center gap-3">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                  Neural Specializations
                </h3>
                <div className="space-y-8">
                  {skillMatrix.map((skill, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{skill.name}</span>
                        <span className={`text-[10px] font-bold text-white`}>{skill.level}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden p-0.5">
                        <div 
                          className={`h-full bg-indigo-500 rounded-full transition-all duration-1000`} 
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => onNavigate('Brain')}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5 transition-all text-center italic"
                >
                  Visualize Evolution Graph
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={() => onNavigate('Sandbox')}
                  className="p-8 rounded-[32px] bg-[#1a1c24]/50 hover:bg-emerald-600 transition-all text-center space-y-4 border border-white/5 shadow-xl group"
                >
                  <div className="text-3xl group-hover:scale-110 transition-transform">🧪</div>
                  <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-white">Sandbox</div>
                </button>
                <button 
                  onClick={() => onNavigate('CareerPath')}
                  className="p-8 rounded-[32px] bg-[#1a1c24]/50 hover:bg-indigo-600 transition-all text-center space-y-4 border border-white/5 shadow-xl group"
                >
                  <div className="text-3xl group-hover:scale-110 transition-transform">🗺️</div>
                  <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-white">Pathfinder</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
