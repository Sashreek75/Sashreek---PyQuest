
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
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1714] flex font-sans selection:bg-[#f5c842]/30 relative">
      <aside className="w-72 border-r border-[#e8e3db] flex flex-col bg-white hidden lg:flex shadow-sm relative z-20">
        <div className="p-8 flex-1">
          <div className="flex items-center gap-3 mb-12 group cursor-pointer" onClick={() => onNavigate('Academy')}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-transform group-hover:scale-110" style={{ background: '#f5c842' }}>🐍</div>
            <div>
               <span className="font-serif text-xl tracking-tight text-[#1a1714] block">PyQuest</span>
               <span className="text-[10px] font-semibold text-[#9a9088] uppercase tracking-widest">Learning Hub</span>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'Overview', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', action: () => setActiveTab('Overview') },
              { id: 'Academy', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', action: () => onNavigate('Academy') },
              { id: 'Skills', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', action: () => onNavigate('Brain') },
              { id: 'Sandbox', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', action: () => onNavigate('Sandbox') },
              { id: 'Pathfinder', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', action: () => onNavigate('CareerPath') },
              { id: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', action: () => onNavigate('Profile') }
            ].map(item => (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all text-sm font-medium ${
                  activeTab === item.id ? 'bg-[#f5c842]/10 text-[#1a1714] font-semibold' : 'text-[#6b6560] hover:text-[#1a1714] hover:bg-[#faf8f5]'
                }`}
              >
                <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
                {item.id}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8 border-t border-[#e8e3db] space-y-6 bg-white">
          {progress.personalization && (
            <div className="p-5 bg-[#faf8f5] border border-[#e8e3db] rounded-2xl space-y-2">
              <span className="text-[10px] font-semibold text-[#9a9088] uppercase tracking-widest">Your Focus</span>
              <div className="text-xs font-medium text-[#6b6560] leading-relaxed italic">
                "{progress.personalization.aiDirective}"
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-[#1a1714] flex items-center justify-center font-bold text-white text-sm shadow-md">
               {user.username.charAt(0).toUpperCase()}
             </div>
             <div className="flex-1 overflow-hidden">
               <div className="text-sm font-bold text-[#1a1714] truncate">{user.username}</div>
               <div className="text-[10px] font-semibold text-[#9a9088] uppercase tracking-widest">{stats.rank}</div>
             </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full text-center py-2.5 text-xs font-semibold text-[#9a9088] hover:text-rose-600 transition-colors border border-[#e8e3db] rounded-lg"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#faf8f5] relative z-10 scroll-smooth grid-bg">
        <div className="absolute top-0 left-0 rail-text h-full flex items-center justify-center pl-4 opacity-10 select-none pointer-events-none">
          DASHBOARD — ARCHITECT OVERVIEW — SYSTEM STATUS: OPTIMAL
        </div>

        <header className="h-20 border-b border-[#e8e3db] px-10 flex items-center justify-between sticky top-0 bg-[#faf8f5]/90 backdrop-blur-md z-40">
          <div className="text-[10px] font-bold text-[#9a9088] uppercase tracking-widest">
            Welcome back, <span className="text-[#1a1714]">{user.username}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#16a34a]/5 rounded-full border border-[#16a34a]/10">
              <span className="w-1.5 h-1.5 bg-[#16a34a] rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase text-[#16a34a] tracking-widest">System Ready</span>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
          <div className="space-y-4 relative">
            <div className="oversized-number absolute -top-12 -left-8 opacity-5">01</div>
            <span className="text-[10px] font-bold text-[#9a9088] uppercase tracking-[0.4em] ml-1">Your Progress</span>
            <h1 className="text-6xl md:text-7xl font-serif tracking-tight text-[#1a1714] leading-none">
              Hello, <span className="italic text-[#d97706]">{user.username}.</span>
            </h1>
            <p className="text-xl text-[#6b6560] font-medium max-w-2xl leading-tight">
              {progress.personalization?.summary || "Your learning journey is waiting. Pick up where you left off or start something new."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Total Experience', val: progress.experience.toLocaleString(), sub: 'XP', num: '01' },
              { label: 'Quests Finished', val: stats.questsCompleted, sub: 'COMPLETED', num: '02' },
              { label: 'Daily Streak', val: stats.streak, sub: 'DAYS', num: '03' }
            ].map((stat, i) => (
              <div key={i} className="p-10 rounded-[40px] bg-white border border-[#e8e3db] hover:border-[#f5c842] transition-all shadow-sm group relative overflow-hidden">
                <div className="oversized-number absolute -bottom-4 -right-4 opacity-[0.03] group-hover:scale-110 transition-transform">{stat.num}</div>
                <div className="text-[10px] font-bold text-[#9a9088] uppercase tracking-widest mb-6 relative z-10">{stat.label}</div>
                <div className="flex items-baseline gap-2 relative z-10">
                  <div className="text-5xl font-bold text-[#1a1714] tracking-tighter group-hover:scale-[1.02] transition-transform">{stat.val}</div>
                  <div className={`text-[10px] font-bold text-[#6b6560] uppercase tracking-widest`}>{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              <div className="p-10 rounded-[48px] bg-white border border-[#e8e3db] shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f5c842]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                  <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-4xl font-serif tracking-tight text-[#1a1714]">Level {stats.level}</h2>
                    <p className="text-[10px] font-bold text-[#9a9088] uppercase tracking-[0.2em]">Next Level: {Math.round((progress.experience % 1000) / 10)}%</p>
                  </div>
                  <div className="w-full md:w-80 h-3 bg-[#faf8f5] rounded-full overflow-hidden border border-[#e8e3db] p-0.5">
                    <div 
                      className="h-full bg-[#f5c842] rounded-full transition-all duration-1000 ease-out shadow-sm" 
                      style={{ width: `${(progress.experience % 1000) / 10}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-bold text-[#1a1714] uppercase tracking-[0.4em] flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#f5c842] rounded-full animate-pulse"></div>
                    Your Next Adventure
                  </h3>
                  <button onClick={() => onNavigate('Academy')} className="text-[10px] font-bold text-[#9a9088] uppercase tracking-widest hover:text-[#1a1714] transition-colors">View All Academy →</button>
                </div>

                {nextQuest ? (
                  <div 
                    onClick={() => onSelectQuest(nextQuest)}
                    className="group p-10 rounded-[48px] bg-white border border-[#e8e3db] hover:border-[#f5c842] transition-all duration-500 cursor-pointer flex items-center justify-between shadow-sm relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-[#f5c842]/0 group-hover:bg-[#f5c842]/[0.02] transition-colors"></div>
                    <div className="space-y-4 relative z-10">
                      <div className="flex items-center gap-4">
                        <span className="px-4 py-1.5 bg-[#f5c842]/10 text-[#d97706] rounded-full text-[10px] font-bold uppercase tracking-widest">Recommended</span>
                        <h4 className="text-3xl font-serif tracking-tight text-[#1a1714] group-hover:text-[#d97706] transition-colors italic">{nextQuest.title}</h4>
                      </div>
                      <p className="text-lg text-[#6b6560] max-w-xl font-medium leading-snug">{nextQuest.description}</p>
                    </div>
                    <div className="w-16 h-16 bg-[#faf8f5] rounded-3xl flex items-center justify-center text-[#9a9088] group-hover:bg-[#f5c842] group-hover:text-[#1a1714] group-hover:scale-110 transition-all shadow-sm relative z-10">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                ) : (
                  <div className="p-16 text-center bg-[#16a34a]/5 border border-[#16a34a]/10 rounded-[48px] shadow-sm">
                    <div className="text-5xl mb-6 animate-bounce">✨</div>
                    <div className="text-3xl font-serif tracking-tight text-[#1a1714]">All Quests Completed!</div>
                    <p className="text-[#6b6560] mt-2 font-medium">You've mastered the current curriculum.</p>
                  </div>
                )}
              </div>

              <div className="h-[320px] relative">
                <div className="absolute -top-4 -right-4 rail-text opacity-20 rotate-90 pointer-events-none">AURA FEED — REALTIME INSIGHTS</div>
                <AuraFeed />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-12">
              <div className="p-10 rounded-[48px] bg-[#1a1714] border border-[#1a1714] space-y-8 shadow-2xl group hover:scale-[1.02] transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#f5c842]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="text-white text-6xl opacity-90 transition-transform group-hover:rotate-12 group-hover:scale-110">💡</div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-serif tracking-tight text-white">Ask Aura</h3>
                  <p className="text-base text-white/70 font-medium leading-snug">Get personalized help and deep insights into your Python code.</p>
                </div>
                <button onClick={onToggleAura} className="w-full py-4.5 bg-[#f5c842] text-[#1a1714] rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-[#f5c842]/90 transition-all active:scale-95">Start Chat</button>
              </div>

              <div className="p-10 rounded-[48px] bg-white border border-[#e8e3db] space-y-10 shadow-sm relative overflow-hidden">
                <div className="oversized-number absolute -top-4 -right-4 opacity-[0.02]">02</div>
                <h3 className="text-[10px] font-bold text-[#1a1714] uppercase tracking-[0.4em] flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#f5c842] rounded-full"></div>
                  Skill Mastery
                </h3>
                <div className="space-y-8">
                  {skillMatrix.map((skill, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-[#6b6560] uppercase tracking-widest">{skill.name}</span>
                        <span className={`text-[10px] font-bold text-[#1a1714]`}>{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-[#faf8f5] rounded-full overflow-hidden border border-[#e8e3db] p-0.5">
                        <div 
                          className={`h-full bg-[#f5c842] rounded-full transition-all duration-1000 shadow-sm`} 
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => onNavigate('Brain')}
                  className="w-full py-4 bg-[#faf8f5] hover:bg-[#e8e3db] text-[#1a1714] rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-[#e8e3db] transition-all text-center shadow-sm"
                >
                  View Skill Map
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={() => onNavigate('Sandbox')}
                  className="p-8 rounded-[40px] bg-white hover:bg-[#f5c842]/10 transition-all text-center space-y-4 border border-[#e8e3db] shadow-sm group relative overflow-hidden"
                >
                  <div className="text-3xl group-hover:scale-110 group-hover:-rotate-12 transition-transform">🧪</div>
                  <div className="text-[10px] font-bold text-[#6b6560] uppercase tracking-widest group-hover:text-[#1a1714]">Sandbox</div>
                </button>
                <button 
                  onClick={() => onNavigate('CareerPath')}
                  className="p-8 rounded-[40px] bg-white hover:bg-[#f5c842]/10 transition-all text-center space-y-4 border border-[#e8e3db] shadow-sm group relative overflow-hidden"
                >
                  <div className="text-3xl group-hover:scale-110 group-hover:rotate-12 transition-transform">🗺️</div>
                  <div className="text-[10px] font-bold text-[#6b6560] uppercase tracking-widest group-hover:text-[#1a1714]">Pathfinder</div>
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
