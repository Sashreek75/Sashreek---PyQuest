
import React, { useState, useEffect } from 'react';
import { User, Progress, Quest, UserStats, SkillNode } from '../types';
import { QUESTS } from '../constants';
import Visualizer from './Visualizer';

interface DashboardProps {
  user: User;
  progress: Progress;
  stats: UserStats;
  onNavigate: (view: 'Academy' | 'CareerPath' | 'Profile') => void;
  onSelectQuest: (quest: Quest) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, progress, stats, onNavigate, onSelectQuest, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  // Skill categorization
  const getCategoryProgress = (category: string) => {
    const totalInCat = QUESTS.filter(q => q.category.includes(category)).length;
    const completedInCat = QUESTS.filter(q => q.category.includes(category) && progress.completedQuests.includes(q.id)).length;
    return totalInCat === 0 ? 0 : Math.round((completedInCat / totalInCat) * 100);
  };

  const skillMatrix: SkillNode[] = [
    { name: 'Python Engineering', level: getCategoryProgress('Python'), xp: progress.experience / 4, color: 'indigo' },
    { name: 'Data Manipulation', level: getCategoryProgress('Data'), xp: progress.experience / 5, color: 'emerald' },
    { name: 'Classical Algorithms', level: getCategoryProgress('Classical'), xp: progress.experience / 6, color: 'amber' },
    { name: 'Neural Design', level: getCategoryProgress('Neural') || getCategoryProgress('Deep'), xp: progress.experience / 8, color: 'rose' },
  ];

  const nextQuest = QUESTS.find(q => !progress.completedQuests.includes(q.id));

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-200 flex font-sans selection:bg-indigo-500/30">
      {/* Resumax-Style Sidebar */}
      <aside className="w-72 border-r border-white/5 flex flex-col bg-[#050810] hidden lg:flex shadow-2xl">
        <div className="p-10">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg">P</div>
            <span className="font-black tracking-tight text-white uppercase text-sm">PyQuest Core</span>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'Overview', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', action: () => setActiveTab('Overview') },
              { id: 'Academy', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', action: () => onNavigate('Academy') },
              { id: 'Strategist', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', action: () => onNavigate('CareerPath') },
              { id: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', action: () => onNavigate('Profile') }
            ].map(item => (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest ${
                  activeTab === item.id ? 'bg-white/10 text-white shadow-xl border border-white/5' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
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

        <div className="mt-auto p-10 border-t border-white/5 space-y-8">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center font-black text-white text-sm shadow-xl">
               {user.username.charAt(0)}
             </div>
             <div className="flex-1 overflow-hidden">
               <div className="text-[11px] font-black text-white leading-none truncate uppercase tracking-tighter">{user.username}</div>
               <div className="text-[9px] font-bold text-slate-600 uppercase mt-2 tracking-widest">{stats.rank} Rank</div>
             </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full text-left px-5 py-3 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-400 transition-colors bg-rose-500/5 rounded-xl border border-rose-500/10"
          >
            Sign Out Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#02040a]">
        {/* Header Bar */}
        <header className="h-20 border-b border-white/5 px-12 flex items-center justify-between sticky top-0 bg-[#02040a]/90 backdrop-blur-2xl z-30">
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">
            Academy / Terminal / <span className="text-white">Overview</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/5 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Aura Online</span>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <div className="p-12 max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          
          {/* Top Bar Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Academic XP', val: progress.experience.toLocaleString(), sub: 'Training Points', color: 'indigo' },
              { label: 'Unlocked Nodes', val: stats.questsCompleted + '/16', sub: 'Project Modules', color: 'emerald' },
              { label: 'Training Streak', val: stats.streak, sub: 'Days Active', color: 'amber' }
            ].map((stat, i) => (
              <div key={i} className="p-10 rounded-3xl bg-[#0b0e14] border border-white/5 hover:border-white/10 transition-all shadow-2xl relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 blur-3xl`}></div>
                <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">{stat.label}</div>
                <div className="flex items-baseline gap-3">
                  <div className="text-5xl font-black text-white tracking-tighter">{stat.val}</div>
                  <div className={`text-[10px] font-black text-${stat.color}-400 uppercase tracking-widest`}>{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Col: Activity & Feed */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Level Ascension Tracker */}
              <div className="p-12 rounded-[40px] bg-gradient-to-br from-[#0b0e14] to-[#07090f] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                  <div className="space-y-3 text-center md:text-left">
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Level {stats.level} <br /> <span className="text-slate-700">Specialist</span></h2>
                    <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-[0.4em]">Next Node Unlock in {1000 - (progress.experience % 1000)} XP</p>
                  </div>
                  <div className="w-full md:w-64 h-3 bg-slate-900 rounded-full overflow-hidden border border-white/5 p-0.5">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-1000 ease-out shadow-lg" 
                      style={{ width: `${(progress.experience % 1000) / 10}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Mission Objectives Feed */}
              <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">Tactical Objective Queue</h3>
                  <button onClick={() => onNavigate('Academy')} className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors">Curriculum Roadmap Node &rarr;</button>
                </div>

                {nextQuest ? (
                  <div 
                    onClick={() => onSelectQuest(nextQuest)}
                    className="group p-10 rounded-[40px] bg-[#0b0e14] border border-white/5 hover:border-indigo-500/30 transition-all duration-500 cursor-pointer flex items-center justify-between shadow-2xl"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="px-4 py-1.5 bg-indigo-600/10 text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-600/20">Active Node</span>
                        <h4 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors leading-none">{nextQuest.title}</h4>
                      </div>
                      <p className="text-sm text-slate-500 max-w-xl leading-relaxed font-medium">{nextQuest.description}</p>
                      <div className="flex gap-4">
                        {nextQuest.topics.slice(0, 3).map(t => (
                          <span key={t} className="text-[9px] font-black uppercase text-slate-700 tracking-widest"># {t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl">
                       <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                ) : (
                  <div className="p-16 text-center bg-emerald-500/5 border border-emerald-500/10 rounded-[40px] shadow-2xl">
                    <div className="text-5xl mb-6">🏆</div>
                    <div className="text-3xl font-black text-white uppercase tracking-tighter">Mission Accomplished</div>
                    <p className="text-sm text-slate-500 mt-4 font-medium max-w-md mx-auto leading-relaxed">You have successfully decrypted all 16 foundational nodes of the PyQuest Curriculum.</p>
                  </div>
                )}
              </div>

              {/* Neural Diagnostics Visualizer */}
              <div className="p-10 rounded-[40px] bg-[#0b0e14] border border-white/5 h-[450px] flex flex-col shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                  <div className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em]">Neural Network Stability Monitor</div>
                  <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Status: Optimal</div>
                </div>
                <div className="flex-1 min-h-0">
                  <Visualizer data={[]} />
                </div>
              </div>
            </div>

            {/* Right Col: Analytics Sidebar */}
            <div className="lg:col-span-4 space-y-10">
              {/* Technical Mastery Matrix */}
              <div className="p-10 rounded-[40px] bg-[#0b0e14] border border-white/5 space-y-12 shadow-2xl">
                <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  Mastery Matrix
                </h3>
                <div className="space-y-10">
                  {skillMatrix.map((skill, i) => (
                    <div key={i} className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{skill.name}</span>
                        <span className={`text-xs font-black text-indigo-400`}>{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5 p-0.5">
                        <div 
                          className={`h-full bg-indigo-500 transition-all duration-1000 shadow-lg`} 
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Biometrics */}
              <div className="p-10 rounded-[40px] bg-[#0b0e14] border border-white/5 space-y-10 shadow-2xl">
                 <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    Identity Biometrics
                 </h3>
                 <div className="space-y-6">
                    {[
                      { l: 'Global Percentile', v: stats.globalPercentile + '%' },
                      { l: 'Logical Accuracy', v: stats.accuracy + '%' },
                      { l: 'System Up-time', v: stats.totalHours + 'h' },
                      { l: 'Academy Rank', v: stats.rank }
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-baseline py-4 border-b border-white/5 last:border-0">
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{row.l}</span>
                        <span className="text-xl font-black text-white uppercase tracking-tighter">{row.v}</span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Operational Redirection */}
              <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={() => onNavigate('CareerPath')}
                  className="p-8 rounded-[32px] bg-indigo-600 hover:bg-indigo-500 transition-all text-center space-y-4 group shadow-3xl shadow-indigo-600/20 active:scale-95"
                >
                  <div className="text-3xl">🎯</div>
                  <div className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Strategist</div>
                </button>
                <button 
                  onClick={() => onNavigate('Academy')}
                  className="p-8 rounded-[32px] bg-[#1a1c24] hover:bg-[#252834] transition-all text-center space-y-4 group border border-white/5 shadow-2xl active:scale-95"
                >
                  <div className="text-3xl">📚</div>
                  <div className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Academy</div>
                </button>
              </div>

              {/* Achievement Badge Mini-Gallery */}
              <div className="p-8 rounded-[40px] bg-[#0b0e14] border border-white/5 space-y-8 shadow-2xl">
                 <div className="flex justify-between items-center">
                   <h3 className="text-xs font-black text-white uppercase tracking-widest">Credential Badges</h3>
                   <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{progress.achievements.length} UNLOCKED</span>
                 </div>
                 <div className="grid grid-cols-4 gap-4">
                    {progress.achievements.slice(0, 8).map(a => (
                      <div key={a.id} title={a.title} className="aspect-square bg-[#010208] border border-white/5 rounded-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform cursor-help shadow-inner">
                        {a.icon}
                      </div>
                    ))}
                    {[...Array(Math.max(0, 4 - progress.achievements.length))].map((_, i) => (
                      <div key={i} className="aspect-square bg-white/5 border border-dashed border-white/10 rounded-2xl"></div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
