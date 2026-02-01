
import React, { useState, useEffect } from 'react';
import { User, Progress, Quest, UserStats } from '../types';
import { QUESTS } from '../constants';
import Visualizer from './Visualizer';

interface DashboardProps {
  user: User;
  progress: Progress;
  stats: UserStats;
  onNavigate: (view: 'Academy' | 'CareerPath' | 'Profile') => void;
  onSelectQuest: (quest: Quest) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, progress, stats, onNavigate, onSelectQuest }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getCategoryProgress = (category: string) => {
    const totalInCat = QUESTS.filter(q => q.category.includes(category)).length;
    const completedInCat = QUESTS.filter(q => q.category.includes(category) && progress.completedQuests.includes(q.id)).length;
    return totalInCat === 0 ? 0 : Math.round((completedInCat / totalInCat) * 100);
  };

  const skillProgress = [
    { skill: 'Python Foundations', level: getCategoryProgress('Python'), color: 'from-blue-500 to-cyan-500' },
    { skill: 'Data Science', level: getCategoryProgress('Data Science'), color: 'from-emerald-500 to-teal-500' },
    { skill: 'Machine Learning', level: getCategoryProgress('Machine Learning'), color: 'from-violet-500 to-purple-500' },
    { skill: 'Neural Architectures', level: getCategoryProgress('Neural'), color: 'from-orange-500 to-rose-500' },
  ];

  const activeQuests = QUESTS.filter(q => !progress.completedQuests.includes(q.id)).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden pb-32">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-violet-600/5 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto px-8 py-12">
        {/* Superior Header */}
        <header className="mb-16 animate-in fade-in slide-in-from-top duration-1000">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-slate-800 pb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <h1 className="text-7xl font-black tracking-tighter bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
                  Session: {user.username}
                </h1>
                <div className="text-5xl animate-bounce-slow">⚡</div>
              </div>
              <p className="text-2xl text-slate-500 font-medium">
                {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                <span className="mx-4 text-slate-700">|</span>
                <span className="text-indigo-400 font-black tabular-nums">{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {[
                { icon: '🔥', val: stats.streak, label: 'Day Streak', color: 'indigo' },
                { icon: '⭐', val: progress.experience, label: 'Experience', color: 'emerald' },
                { icon: '👑', val: stats.rank, label: 'Authority', color: 'amber' }
              ].map((pill, i) => (
                <div key={i} className={`px-8 py-4 rounded-3xl bg-${pill.color}-500/5 border border-${pill.color}-500/20 backdrop-blur-xl flex items-center gap-5 group hover:scale-105 transition-transform cursor-default shadow-2xl`}>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${pill.color}-500 to-${pill.color}-700 flex items-center justify-center text-2xl shadow-xl shadow-${pill.color}-500/20`}>{pill.icon}</div>
                  <div>
                    <div className="text-3xl font-black text-white">{pill.val.toLocaleString()}</div>
                    <div className={`text-[10px] font-black text-${pill.color}-300 uppercase tracking-[0.2em]`}>{pill.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Central Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-10">
            {/* Progression Panel */}
            <div className="group relative p-12 rounded-[48px] bg-gradient-to-br from-slate-900/80 to-slate-800/40 border border-slate-700/50 backdrop-blur-3xl overflow-hidden hover:border-indigo-500/40 transition-all duration-700 shadow-3xl">
              <div className="relative z-10 space-y-12">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h2 className="text-5xl font-black text-white tracking-tight">Level {stats.level}</h2>
                    <p className="text-xl text-slate-500 font-bold uppercase tracking-widest">{1000 - stats.xp} XP TO NEXT TIER</p>
                  </div>
                  <div className="text-7xl opacity-20 group-hover:opacity-100 transition-opacity">🚀</div>
                </div>

                <div className="relative">
                  <div className="h-6 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 rounded-full relative transition-all duration-1000"
                      style={{ width: `${(stats.xp / 1000) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:100px_100px] animate-[shimmer_2s_linear_infinite]"></div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-6 text-sm font-black uppercase tracking-[0.3em]">
                    <span className="text-slate-600">Level {stats.level}</span>
                    <span className="text-indigo-400">{Math.round((stats.xp / 1000) * 100)}% Synchronized</span>
                    <span className="text-slate-600">Level {stats.level + 1}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Visualization */}
            <div className="p-12 rounded-[48px] bg-slate-900/50 border border-slate-800 backdrop-blur-xl h-[550px] shadow-3xl space-y-8">
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white">Logic Stability</h3>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Real-time Academic Simulation Data</p>
                </div>
                <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-[10px] uppercase tracking-widest rounded-xl">
                  Node Status: Optimal
                </div>
              </div>
              <div className="h-full pb-16">
                <Visualizer data={[]} />
              </div>
            </div>

            {/* Tactical Mission Queue */}
            <div className="p-12 rounded-[48px] bg-slate-900/30 border border-slate-800 shadow-3xl space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-black text-white uppercase tracking-tight">Active Mission Queue</h3>
                <button onClick={() => onNavigate('Academy')} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                  Expand Curriculum
                </button>
              </div>

              <div className="space-y-6">
                {activeQuests.map((quest, i) => (
                  <div 
                    key={quest.id}
                    onClick={() => onSelectQuest(quest)}
                    className="group p-8 rounded-[32px] bg-slate-800/20 border border-slate-700/50 hover:border-indigo-500/40 hover:bg-slate-800/40 transition-all duration-300 cursor-pointer flex justify-between items-center shadow-lg"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <h4 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">
                          {quest.title}
                        </h4>
                        <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">
                          {quest.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{quest.category}</span>
                        <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Potential Reward: {quest.xpReward} XP</span>
                      </div>
                    </div>
                    <div className="text-indigo-500 font-black uppercase text-xs tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                      Initialize Mission &gt;
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary Intelligence Column */}
          <div className="lg:col-span-4 space-y-10">
            {/* Efficiency Metrics */}
            <div className="p-10 rounded-[48px] bg-slate-900 border border-slate-800 shadow-2xl space-y-10">
              <h3 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-4">
                <span className="w-8 h-8 bg-indigo-500/20 rounded-xl flex items-center justify-center text-sm">📊</span>
                KPI Overview
              </h3>

              <div className="space-y-6">
                {[
                  { label: 'Academic Accuracy', val: stats.accuracy + '%' },
                  { label: 'Active Modules', val: stats.questsCompleted + '/16' },
                  { label: 'Hours Deployed', val: stats.totalHours + 'h' },
                  { label: 'Skill Points', val: stats.level * 15 }
                ].map((kpi, i) => (
                  <div key={i} className="flex justify-between items-center p-6 bg-slate-950/50 rounded-3xl border border-slate-800 hover:border-slate-700 transition-colors">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{kpi.label}</span>
                    <span className="text-3xl font-black text-white">{kpi.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mastery Indicators */}
            <div className="p-10 rounded-[48px] bg-slate-900 border border-slate-800 shadow-2xl space-y-10">
              <h3 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-4">
                <span className="w-8 h-8 bg-emerald-500/20 rounded-xl flex items-center justify-center text-sm">⚡</span>
                Mastery Tiers
              </h3>

              <div className="space-y-8">
                {skillProgress.map((skill, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{skill.skill}</span>
                      <span className="text-lg font-black text-indigo-400">{skill.level}%</span>
                    </div>
                    <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tactical Redirects */}
            <div className="p-10 rounded-[48px] bg-indigo-500/5 border border-indigo-500/20 backdrop-blur-3xl shadow-3xl space-y-8">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Direct Commands</h3>
              <div className="space-y-4">
                <button 
                  onClick={() => onNavigate('Academy')}
                  className="w-full py-6 rounded-3xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                >
                  <span>▶️</span>
                  Resume Modules
                </button>
                <button 
                  onClick={() => onNavigate('CareerPath')}
                  className="w-full py-6 rounded-3xl border border-slate-700 text-slate-400 hover:text-white hover:border-indigo-500/50 font-black text-lg transition-all flex items-center justify-center gap-3"
                >
                  <span>🎯</span>
                  Strategize Future
                </button>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="p-10 rounded-[48px] bg-slate-900 border border-slate-800 shadow-2xl space-y-8">
              <h3 className="text-xl font-black text-white uppercase tracking-widest">Achievements</h3>
              <div className="grid grid-cols-4 gap-4">
                {progress.achievements.map(a => (
                  <div key={a.id} title={a.title} className="w-full aspect-square bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform cursor-help">
                    {a.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      ` }} />
    </div>
  );
};

export default Dashboard;
