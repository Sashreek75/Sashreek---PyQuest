
import React, { useMemo, useState } from 'react';
import { User, Progress, UserStats, QuestCategory } from '../types';
import DigitalBrain from './DigitalBrain';
import { QUESTS } from '../constants';

interface ProfileProps {
  user: User;
  progress: Progress;
  stats: UserStats;
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, progress, stats, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'achievements' | 'customize'>('overview');
  
  const synapticDensity = useMemo(() => {
    const score = (progress.completedQuests.length * 300) + (progress.experience / 2) + (progress.passedQuizzes.length * 200);
    return Math.min(100, (score / 20000) * 100);
  }, [progress]);

  const activeSynapses = Math.floor(progress.experience * 16.4);
  
  const learningVelocity = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentQuests = (progress.activityLog || []).filter(a => new Date(a.date) > weekAgo).length;
    return Math.min(100, recentQuests * 20); 
  }, [progress]);

  const knowledgeRetention = useMemo(() => {
    if (progress.completedQuests.length === 0) return 0;
    return Math.min(100, (progress.passedQuizzes.length / (progress.completedQuests.length || 1)) * 100);
  }, [progress]);

  const cognitiveDepth = useMemo(() => {
    return Math.min(100, (progress.completedQuests.length * 8) + (progress.experience / 100));
  }, [progress]);

  const neuralPathways = useMemo(() => {
    return progress.completedQuests.length * 7 + progress.passedQuizzes.length * 3;
  }, [progress]);

  const weeklyActivity = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const result = days.map((day, idx) => {
      const dayDate = new Date();
      dayDate.setDate(now.getDate() - (now.getDay() - idx));
      const dateStr = dayDate.toISOString().split('T')[0];
      const count = (progress.activityLog || []).filter(a => a.date.startsWith(dateStr)).length;
      return { day, count: Math.min(1, count / 5) * 100 }; // Normalize to 100%
    });
    return result;
  }, [progress]);

  const topicDistribution = useMemo(() => {
    const categories: QuestCategory[] = [
      'Python Foundations', 'Mathematical Logic', 'Data Engineering', 
      'Classical ML', 'Deep Learning', 'Neural Architectures', 
      'LLM & Transformers', 'MLOps & Deployment'
    ];
    
    const totalXP = progress.experience || 1;
    return categories
      .map(cat => ({
        topic: cat,
        percent: Math.round(((progress.topicXP?.[cat] || 0) / totalXP) * 100),
        color: cat.includes('Python') ? 'bg-blue-500' : 
               cat.includes('Math') ? 'bg-purple-500' :
               cat.includes('Data') ? 'bg-pink-500' : 'bg-green-500'
      }))
      .filter(t => t.percent > 0)
      .sort((a, b) => b.percent - a.percent);
  }, [progress]);

  const milestones = useMemo(() => {
    return (progress.achievements || []).slice(-4).map(ach => ({
      milestone: ach.title,
      date: ach.unlockedAt ? new Date(ach.unlockedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Active'
    }));
  }, [progress]);

  const brainGrowthRate = useMemo(() => {
    const baseGrowth = (synapticDensity / 100) * 10;
    const velocityBonus = (learningVelocity / 100) * 5;
    return Math.min(15, baseGrowth + velocityBonus).toFixed(1);
  }, [synapticDensity, learningVelocity]);

  return (
    <div className="min-h-screen bg-[#010208] text-white font-jakarta overflow-x-hidden">
      <header className="h-24 border-b border-white/5 px-8 md:px-12 flex items-center justify-between sticky top-0 bg-[#010208]/95 backdrop-blur-3xl z-50">
        <div className="flex items-center gap-6 md:gap-8">
          <button onClick={onBack} className="text-slate-500 hover:text-white transition-colors group flex items-center gap-3">
             <span className="group-hover:-translate-x-1 transition-transform font-black text-xl">←</span>
             <span className="text-[10px] font-bold uppercase tracking-widest italic hidden sm:inline">Return to Core</span>
          </button>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <h1 className="text-lg md:text-xl font-black uppercase tracking-tighter italic text-glow">Neural_Profile</h1>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest hidden sm:inline">Status</span>
              <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest animate-pulse">Active</span>
           </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-8 md:px-12 pt-8">
        <div className="flex gap-2 overflow-x-auto pb-4 border-b border-white/5">
          {[
            { id: 'overview', label: 'Overview', icon: '◈' },
            { id: 'detailed', label: 'Deep Stats', icon: '◉' },
            { id: 'achievements', label: 'Milestones', icon: '★' },
            { id: 'customize', label: 'Customize', icon: '⚙' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/50' 
                  : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-[1800px] mx-auto p-8 md:p-12">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
            <div className="lg:col-span-4 space-y-6 md:space-y-10">
              <div className="bg-[#0b0e14]/80 border border-white/5 rounded-[40px] md:rounded-[56px] p-8 md:p-12 space-y-8 md:space-y-12 shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/5 blur-[100px] -z-10"></div>
                <div className="flex flex-col items-center text-center space-y-6 md:space-y-8">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-br from-indigo-600 to-pink-500 rounded-[48px] opacity-20 blur-xl animate-pulse"></div>
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-[40px] bg-gradient-to-br from-indigo-600 to-pink-600 flex items-center justify-center text-4xl md:text-5xl font-black text-white shadow-2xl relative z-10">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">{user.username}</h2>
                    <div className="px-4 md:px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mt-4 inline-block">
                      Level {stats.level} {stats.rank}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 md:gap-8 border-t border-white/5 pt-8 md:pt-12">
                   <div className="space-y-2">
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Neural XP</span>
                      <div className="text-2xl md:text-3xl font-black text-white italic">{progress.experience.toLocaleString()}</div>
                   </div>
                   <div className="space-y-2">
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Percentile</span>
                      <div className="text-2xl md:text-3xl font-black text-white italic">{stats.globalPercentile.toFixed(1)}%</div>
                   </div>
                </div>
                <div className="space-y-6 pt-6">
                   <div className="p-6 md:p-8 bg-black/40 border border-white/5 rounded-[32px] md:rounded-[40px] space-y-4">
                      <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Active Directive</span>
                      <p className="text-sm font-medium text-slate-400 leading-relaxed italic">
                        "{progress.personalization?.aiDirective || "Master the fundamental laws of applied intelligence."}"
                      </p>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0b0e14]/50 border border-white/5 rounded-3xl p-6 space-y-2">
                  <div className="text-[9px] font-black text-pink-400 uppercase tracking-widest">Quests</div>
                  <div className="text-3xl font-black text-white italic">{progress.completedQuests.length}</div>
                </div>
                <div className="bg-[#0b0e14]/50 border border-white/5 rounded-3xl p-6 space-y-2">
                  <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Quizzes</div>
                  <div className="text-3xl font-black text-white italic">{progress.passedQuizzes.length}</div>
                </div>
                <div className="bg-[#0b0e14]/50 border border-white/5 rounded-3xl p-6 space-y-2">
                  <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Accuracy</div>
                  <div className="text-3xl font-black text-white italic">{stats.accuracy}%</div>
                </div>
                <div className="bg-[#0b0e14]/50 border border-white/5 rounded-3xl p-6 space-y-2">
                  <div className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Streak</div>
                  <div className="text-3xl font-black text-white italic">{stats.streak || 0}d</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-8 md:space-y-12">
               <div className="bg-[#0b0e14]/30 border border-white/5 rounded-[60px] md:rounded-[80px] p-8 md:p-16 flex flex-col items-center justify-center relative overflow-hidden shadow-3xl min-h-[800px] md:min-h-[1000px]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(79,70,229,0.1)_0%,transparent_70%)]"></div>
                  <div className="text-center space-y-4 md:space-y-6 mb-8 md:mb-16 z-10 relative">
                    <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic leading-none text-glow">
                      Neural <br /> <span className="text-indigo-400">Architecture.</span>
                    </h2>
                    <p className="text-slate-500 font-bold text-xs md:text-sm uppercase tracking-[0.5em] opacity-60">Live visualization of cognitive growth</p>
                    <div className="flex items-center justify-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Growing</span>
                      </div>
                      <div className="w-px h-4 bg-slate-700"></div>
                      <div className="text-[10px] font-bold text-emerald-400 uppercase">+{brainGrowthRate}% Today</div>
                    </div>
                  </div>
                  <div className="w-full max-w-5xl h-[500px] md:h-[700px] relative z-10">
                     <DigitalBrain progress={progress} stats={stats} />
                  </div>
                  <div className="mt-auto w-full max-w-5xl bg-black/80 backdrop-blur-3xl border border-white/10 p-6 md:p-12 rounded-[48px] md:rounded-[64px] space-y-8 md:space-y-12 z-20 shadow-[0_50px_150px_rgba(0,0,0,0.8)]">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 md:gap-10">
                       <div className="space-y-3 md:space-y-4">
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em]">Neural Density</span>
                          <div className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none">
                             {synapticDensity.toFixed(2)}%
                          </div>
                          <p className="text-xs text-slate-500 font-medium max-w-xs">Your brain is {synapticDensity < 30 ? 'forming new connections' : synapticDensity < 70 ? 'rapidly expanding' : 'highly optimized'}</p>
                       </div>
                       <div className="text-left md:text-right space-y-3 md:space-y-4">
                          <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.5em]">Active Synapses</span>
                          <div className="text-3xl md:text-4xl font-black text-white italic leading-none">{activeSynapses.toLocaleString()}</div>
                          <p className="text-xs text-slate-500 font-medium">+{Math.floor(learningVelocity * 10)} firing/day</p>
                       </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-[9px] font-black text-slate-600 uppercase tracking-widest">
                        <span>Formation Progress</span>
                        <span>{synapticDensity.toFixed(0)}% Complete</span>
                      </div>
                      <div className="h-4 bg-slate-950 rounded-full overflow-hidden p-1 border border-white/10 shadow-inner relative">
                         <div 
                           className="h-full bg-gradient-to-r from-indigo-600 via-pink-500 to-emerald-400 rounded-full shadow-[0_0_40px_rgba(244,114,182,0.6)] transition-all duration-[3000ms] cubic-bezier(0.23, 1, 0.32, 1) relative overflow-hidden"
                           style={{ width: `${synapticDensity}%` }}
                         >
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                         </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 text-center pt-4">
                       <div className="space-y-2 border-r border-white/5 last:border-r-0 md:last:border-r">
                          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Velocity</div>
                          <div className="text-lg md:text-xl font-black text-white italic">{learningVelocity}%</div>
                       </div>
                       <div className="space-y-2 border-r border-white/5 md:border-r">
                          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Retention</div>
                          <div className="text-lg md:text-xl font-black text-white italic">{knowledgeRetention.toFixed(0)}%</div>
                       </div>
                       <div className="space-y-2 border-r border-white/5 last:border-r-0 md:last:border-r">
                          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Depth</div>
                          <div className="text-lg md:text-xl font-black text-white italic">{cognitiveDepth.toFixed(0)}%</div>
                       </div>
                       <div className="space-y-2">
                          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pathways</div>
                          <div className="text-lg md:text-xl font-black text-white italic text-emerald-400">{neuralPathways}</div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'detailed' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <StatCard title="Learning Velocity" value={`${learningVelocity}%`} description="Acquisition rate based on the last 7 days." icon="⚡" color="yellow" metrics={[{ label: 'Active Tasks', value: weeklyActivity.filter(d => d.count > 0).length }, { label: 'Peak Capacity', value: '100%' }]} />
            <StatCard title="Knowledge Retention" value={`${knowledgeRetention.toFixed(0)}%`} description="Quiz performance relative to total quests." icon="🧠" color="purple" metrics={[{ label: 'Passed Quizzes', value: progress.passedQuizzes.length }, { label: 'Mastery', value: knowledgeRetention > 80 ? 'Zenith' : 'Forming' }]} />
            <StatCard title="Cognitive Depth" value={`${cognitiveDepth.toFixed(0)}%`} description="Total complexity level of your skill graph." icon="🔬" color="blue" metrics={[{ label: 'Topics Explored', value: topicDistribution.length }, { label: 'Level', value: stats.level }]} />
            
            <div className="lg:col-span-2 xl:col-span-3 bg-[#0b0e14]/80 border border-white/5 rounded-[40px] p-10 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black uppercase italic text-white">Neural History Graph</h3>
                  <p className="text-sm text-slate-500 font-medium mt-2">Real activity patterns logged in the academy.</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-white italic">{progress.completedQuests.length}</div>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Completed Protocols</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">7-Day Activity</div>
                  <div className="space-y-2">
                    {weeklyActivity.map((item) => (
                      <div key={item.day} className="flex items-center gap-4">
                        <span className="text-xs text-slate-500 font-bold w-8">{item.day}</span>
                        <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-600 to-pink-500 rounded-full" style={{ width: `${item.count}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Specialization Spread</div>
                  <div className="space-y-3">
                    {topicDistribution.length > 0 ? topicDistribution.map(item => (
                      <div key={item.topic}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400 font-medium truncate pr-4">{item.topic}</span>
                          <span className="text-white font-bold">{item.percent}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }}></div>
                        </div>
                      </div>
                    )) : <p className="text-xs text-slate-600">No telemetry data available.</p>}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Latest Milestones</div>
                  <div className="space-y-3">
                    {milestones.length > 0 ? milestones.map(item => (
                      <div key={item.milestone} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-xs text-white font-bold">{item.milestone}</div>
                          <div className="text-[10px] text-slate-500">{item.date}</div>
                        </div>
                      </div>
                    )) : <p className="text-xs text-slate-600 italic">Initiate quests to log milestones.</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ... other tabs remain same ... */}
        {activeTab === 'achievements' && (
          <div className="space-y-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-6xl font-black uppercase italic text-white">Achievement Vault</h2>
              <p className="text-slate-500 font-medium">Milestones unlocked on your learning journey</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {progress.achievements.length > 0 ? progress.achievements.map(ach => (
                <div key={ach.id} className="bg-[#0b0e14]/80 border border-white/5 rounded-[40px] p-8 space-y-6 hover:border-indigo-500/30 transition-all hover:scale-105 group">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-pink-600 rounded-[32px] flex items-center justify-center text-4xl group-hover:scale-110 transition-transform shadow-lg">
                    {ach.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-white uppercase italic">{ach.title}</h3>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">{ach.description}</p>
                    {ach.unlockedAt && (
                      <div className="text-[10px] text-slate-600 uppercase font-bold tracking-widest pt-2">
                        Unlocked {new Date(ach.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-20">
                  <div className="text-6xl mb-6 opacity-20">🏆</div>
                  <p className="text-slate-600 font-black uppercase tracking-widest">No achievements yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <style>{`
        .shadow-3xl { box-shadow: 0 60px 180px -40px rgba(0,0,0,0.9); }
        .text-glow { text-shadow: 0 0 30px rgba(99, 102, 241, 0.4); }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-shimmer { animation: shimmer 2s infinite; }
      `}</style>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string;
  description: string;
  icon: string;
  color: string;
  metrics: { label: string; value: string | number }[];
}> = ({ title, value, description, icon, color, metrics }) => {
  const colorMap: Record<string, string> = {
    yellow: 'border-yellow-500/20 bg-yellow-500/5',
    purple: 'border-purple-500/20 bg-purple-500/5',
    blue: 'border-blue-500/20 bg-blue-500/5',
    green: 'border-green-500/20 bg-green-500/5',
    red: 'border-red-500/20 bg-red-500/5',
    pink: 'border-pink-500/20 bg-pink-500/5'
  };
  return (
    <div className={`bg-[#0b0e14]/80 border ${colorMap[color]} rounded-[40px] p-8 space-y-6 hover:scale-105 transition-transform`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">{title}</h3>
          <div className="text-4xl font-black text-white italic mt-2">{value}</div>
          <p className="text-xs text-slate-500 font-medium mt-2">{description}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
      <div className="border-t border-white/5 pt-4 space-y-3">
        {metrics.map(metric => (
          <div key={metric.label} className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">{metric.label}</span>
            <span className="text-sm text-white font-bold">{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ToggleSetting: React.FC<{
  label: string;
  description: string;
  defaultChecked: boolean;
}> = ({ label, description, defaultChecked }) => {
  const [checked, setChecked] = React.useState(defaultChecked);
  return (
    <div className="flex items-center justify-between p-6 bg-black/20 rounded-3xl border border-white/5">
      <div className="flex-1">
        <div className="text-sm font-bold text-white">{label}</div>
        <div className="text-xs text-slate-500 mt-1">{description}</div>
      </div>
      <button onClick={() => setChecked(!checked)} className={`w-12 h-6 rounded-full transition-all ${checked ? 'bg-indigo-600' : 'bg-slate-700'}`}>
        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
      </button>
    </div>
  );
};

export default Profile;
