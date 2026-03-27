import React, { useMemo, useState } from 'react';
import { User, Progress, UserStats, QuestCategory } from '../types';
import DigitalBrain from './DigitalBrain';

interface ProfileProps {
  user: User;
  progress: Progress;
  stats: UserStats;
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, progress, stats, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'achievements' | 'customize'>('overview');
  
  const learningDepth = useMemo(() => {
    const score = (progress.completedQuests.length * 300) + (progress.experience / 2) + (progress.passedQuizzes.length * 200);
    return Math.min(100, (score / 20000) * 100);
  }, [progress]);

  const activeConnections = Math.floor(progress.experience * 16.4);
  
  const learningMomentum = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentQuests = (progress.activityLog || []).filter(a => new Date(a.date) > weekAgo).length;
    return Math.min(100, recentQuests * 20); 
  }, [progress]);

  const knowledgeRetention = useMemo(() => {
    if (progress.completedQuests.length === 0) return 0;
    return Math.min(100, (progress.passedQuizzes.length / (progress.completedQuests.length || 1)) * 100);
  }, [progress]);

  const masteryLevel = useMemo(() => {
    return Math.min(100, (progress.completedQuests.length * 8) + (progress.experience / 100));
  }, [progress]);

  const learningPathways = useMemo(() => {
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
        color: cat.includes('Python') ? 'bg-[#f5c842]' : 
               cat.includes('Math') ? 'bg-[#d97706]' :
               cat.includes('Data') ? 'bg-[#9a9088]' : 'bg-[#6b6560]'
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

  const growthRate = useMemo(() => {
    const baseGrowth = (learningDepth / 100) * 10;
    const momentumBonus = (learningMomentum / 100) * 5;
    return Math.min(15, baseGrowth + momentumBonus).toFixed(1);
  }, [learningDepth, learningMomentum]);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1714] font-sans overflow-x-hidden">
      <header className="h-24 border-b border-[#e8e3db] px-8 md:px-12 flex items-center justify-between sticky top-0 bg-[#faf8f5]/95 backdrop-blur-md z-50">
        <div className="flex items-center gap-6 md:gap-8">
          <button onClick={onBack} className="text-[#6b6560] hover:text-[#1a1714] transition-colors group flex items-center gap-3">
             <span className="group-hover:-translate-x-1 transition-transform font-bold text-xl">←</span>
             <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Return to Dashboard</span>
          </button>
          <div className="h-4 w-px bg-[#e8e3db] hidden sm:block" />
          <h1 className="text-lg md:text-xl font-serif tracking-tight">Learner Profile</h1>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-[#9a9088] uppercase tracking-widest hidden sm:inline">Status</span>
              <span className="text-[#16a34a] text-[10px] font-black uppercase tracking-widest animate-pulse">Active Learner</span>
           </div>
        </div>
      </header>

      <div className="grid-bg absolute inset-0 pointer-events-none opacity-40" />
      
      {/* Rail Text */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 rail-text opacity-20 hidden lg:block">
        USER_PROFILE_DATA // ARCHIVE_001
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 rail-text opacity-20 hidden lg:block">
        LEARNING_METRICS // PERSISTENCE
      </div>

      <div className="max-w-[1800px] mx-auto px-8 md:px-12 pt-8 relative z-10">
        <div className="flex gap-2 overflow-x-auto pb-4 border-b border-[#e8e3db]">
          {[
            { id: 'overview', label: 'Overview', icon: '◈' },
            { id: 'detailed', label: 'Learning Stats', icon: '◉' },
            { id: 'achievements', label: 'Milestones', icon: '★' },
            { id: 'customize', label: 'Settings', icon: '⚙' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-[#f5c842] text-[#1a1714] shadow-md' 
                  : 'bg-white border border-[#e8e3db] text-[#6b6560] hover:text-[#1a1714] hover:bg-[#faf8f5]'
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
              <div className="bg-white border border-[#e8e3db] rounded-[40px] md:rounded-[56px] p-8 md:p-12 space-y-8 md:space-y-12 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#f5c842]/5 blur-[100px] -z-10"></div>
                <div className="flex flex-col items-center text-center space-y-6 md:space-y-8">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-[#f5c842]/20 rounded-[48px] opacity-20 blur-xl animate-pulse"></div>
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-[40px] bg-[#f5c842] flex items-center justify-center text-4xl md:text-5xl font-black text-[#1a1714] shadow-md relative z-10">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-serif tracking-tight">{user.username}</h2>
                    <div className="px-4 md:px-6 py-2 bg-[#f5c842]/10 border border-[#f5c842]/20 text-[#d97706] rounded-full text-[10px] font-black uppercase tracking-[0.4em] mt-4 inline-block">
                      Level {stats.level} {stats.rank}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 md:gap-8 border-t border-[#e8e3db] pt-8 md:pt-12">
                   <div className="space-y-2">
                      <span className="text-[9px] font-black text-[#9a9088] uppercase tracking-widest">Learning XP</span>
                      <div className="text-2xl md:text-3xl font-black text-[#1a1714]">{progress.experience.toLocaleString()}</div>
                   </div>
                   <div className="space-y-2">
                      <span className="text-[9px] font-black text-[#9a9088] uppercase tracking-widest">Global Percentile</span>
                      <div className="text-2xl md:text-3xl font-black text-[#1a1714]">{stats.globalPercentile.toFixed(1)}%</div>
                   </div>
                </div>
                <div className="space-y-6 pt-6">
                   <div className="p-6 md:p-8 bg-[#faf8f5] border border-[#e8e3db] rounded-[32px] md:rounded-[40px] space-y-4">
                      <span className="text-[9px] font-black text-[#d97706] uppercase tracking-widest">Learning Directive</span>
                      <p className="text-sm font-medium text-[#6b6560] leading-relaxed italic">
                        "{progress.personalization?.aiDirective || "Master the fundamental laws of applied intelligence."}"
                      </p>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-[#e8e3db] rounded-3xl p-6 space-y-2 shadow-sm relative overflow-hidden group">
                  <div className="oversized-number absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">01</div>
                  <div className="text-[9px] font-black text-[#d97706] uppercase tracking-widest relative z-10">Quests</div>
                  <div className="text-3xl font-black text-[#1a1714] relative z-10">{progress.completedQuests.length}</div>
                </div>
                <div className="bg-white border border-[#e8e3db] rounded-3xl p-6 space-y-2 shadow-sm relative overflow-hidden group">
                  <div className="oversized-number absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">02</div>
                  <div className="text-[9px] font-black text-[#16a34a] uppercase tracking-widest relative z-10">Quizzes</div>
                  <div className="text-3xl font-black text-[#1a1714] relative z-10">{progress.passedQuizzes.length}</div>
                </div>
                <div className="bg-white border border-[#e8e3db] rounded-3xl p-6 space-y-2 shadow-sm relative overflow-hidden group">
                  <div className="oversized-number absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">03</div>
                  <div className="text-[9px] font-black text-[#2563eb] uppercase tracking-widest relative z-10">Accuracy</div>
                  <div className="text-3xl font-black text-[#1a1714] relative z-10">{stats.accuracy}%</div>
                </div>
                <div className="bg-white border border-[#e8e3db] rounded-3xl p-6 space-y-2 shadow-sm relative overflow-hidden group">
                  <div className="oversized-number absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">04</div>
                  <div className="text-[9px] font-black text-[#d97706] uppercase tracking-widest relative z-10">Streak</div>
                  <div className="text-3xl font-black text-[#1a1714] relative z-10">{stats.streak || 0}d</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-8 md:space-y-12">
               <div className="bg-white border border-[#e8e3db] rounded-[60px] md:rounded-[80px] p-8 md:p-16 flex flex-col items-center justify-center relative overflow-hidden shadow-sm min-h-[800px] md:min-h-[1000px]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,200,66,0.05)_0%,transparent_70%)]"></div>
                  <div className="text-center space-y-4 md:space-y-6 mb-8 md:mb-16 z-10 relative">
                    <h2 className="text-5xl md:text-8xl font-serif tracking-tight text-[#1a1714] leading-none">
                      Learning <br /> <span className="text-[#d97706]">Growth.</span>
                    </h2>
                    <p className="text-[#9a9088] font-bold text-xs md:text-sm uppercase tracking-[0.5em]">Live visualization of cognitive expansion</p>
                    <div className="flex items-center justify-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#f5c842] rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold text-[#9a9088] uppercase">Expanding</span>
                      </div>
                      <div className="w-px h-4 bg-[#e8e3db]"></div>
                      <div className="text-[10px] font-bold text-[#16a34a] uppercase">+{growthRate}% Today</div>
                    </div>
                  </div>
                  <div className="w-full max-w-5xl h-[500px] md:h-[700px] relative z-10">
                     <DigitalBrain progress={progress} stats={stats} />
                  </div>
                  <div className="mt-auto w-full max-w-5xl bg-white border border-[#e8e3db] p-6 md:p-12 rounded-[48px] md:rounded-[64px] space-y-8 md:space-y-12 z-20 shadow-xl">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 md:gap-10">
                       <div className="space-y-3 md:space-y-4">
                          <span className="text-[10px] font-black text-[#d97706] uppercase tracking-[0.5em]">Learning Depth</span>
                          <div className="text-5xl md:text-7xl font-black text-[#1a1714] italic tracking-tighter leading-none">
                             {learningDepth.toFixed(2)}%
                          </div>
                          <p className="text-xs text-[#6b6560] font-medium max-w-xs">Your understanding is {learningDepth < 30 ? 'forming new roots' : learningDepth < 70 ? 'rapidly branching' : 'highly refined'}</p>
                       </div>
                       <div className="text-left md:text-right space-y-3 md:space-y-4">
                          <span className="text-[10px] font-black text-[#9a9088] uppercase tracking-[0.5em]">Active Connections</span>
                          <div className="text-3xl md:text-4xl font-black text-[#1a1714] italic leading-none">{activeConnections.toLocaleString()}</div>
                          <p className="text-xs text-[#6b6560] font-medium">+{Math.floor(learningMomentum * 10)} insights/day</p>
                       </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-[9px] font-black text-[#9a9088] uppercase tracking-widest">
                        <span>Development Progress</span>
                        <span>{learningDepth.toFixed(0)}% Complete</span>
                      </div>
                      <div className="h-4 bg-[#faf8f5] rounded-full overflow-hidden p-1 border border-[#e8e3db] shadow-inner relative">
                         <div 
                           className="h-full bg-gradient-to-r from-[#f5c842] to-[#d97706] rounded-full shadow-sm transition-all duration-[3000ms] cubic-bezier(0.23, 1, 0.32, 1) relative overflow-hidden"
                           style={{ width: `${learningDepth}%` }}
                         >
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                         </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 text-center pt-4">
                       <div className="space-y-2 border-r border-[#e8e3db] last:border-r-0 md:last:border-r">
                          <div className="text-[9px] font-black text-[#9a9088] uppercase tracking-widest">Momentum</div>
                          <div className="text-lg md:text-xl font-black text-[#1a1714]">{learningMomentum}%</div>
                       </div>
                       <div className="space-y-2 border-r border-[#e8e3db] md:border-r">
                          <div className="text-[9px] font-black text-[#9a9088] uppercase tracking-widest">Retention</div>
                          <div className="text-lg md:text-xl font-black text-[#1a1714]">{knowledgeRetention.toFixed(0)}%</div>
                       </div>
                       <div className="space-y-2 border-r border-[#e8e3db] last:border-r-0 md:last:border-r">
                          <div className="text-[9px] font-black text-[#9a9088] uppercase tracking-widest">Mastery</div>
                          <div className="text-lg md:text-xl font-black text-[#1a1714]">{masteryLevel.toFixed(0)}%</div>
                       </div>
                       <div className="space-y-2">
                          <div className="text-[9px] font-black text-[#9a9088] uppercase tracking-widest">Pathways</div>
                          <div className="text-lg md:text-xl font-black text-[#16a34a]">{learningPathways}</div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'detailed' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <StatCard title="Learning Momentum" value={`${learningMomentum}%`} description="Acquisition rate based on the last 7 days." icon="⚡" color="yellow" metrics={[{ label: 'Active Sessions', value: weeklyActivity.filter(d => d.count > 0).length }, { label: 'Peak Capacity', value: '100%' }]} />
            <StatCard title="Knowledge Retention" value={`${knowledgeRetention.toFixed(0)}%`} description="Quiz performance relative to total quests." icon="🧠" color="amber" metrics={[{ label: 'Passed Quizzes', value: progress.passedQuizzes.length }, { label: 'Mastery', value: knowledgeRetention > 80 ? 'Zenith' : 'Forming' }]} />
            <StatCard title="Mastery Level" value={`${masteryLevel.toFixed(0)}%`} description="Total complexity level of your skill graph." icon="🔬" color="gray" metrics={[{ label: 'Topics Explored', value: topicDistribution.length }, { label: 'Level', value: stats.level }]} />
            
            <div className="lg:col-span-2 xl:col-span-3 bg-white border border-[#e8e3db] rounded-[40px] p-10 space-y-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-serif tracking-tight text-[#1a1714]">Learning History</h3>
                  <p className="text-sm text-[#6b6560] font-medium mt-2">Real activity patterns logged in the academy.</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-[#1a1714]">{progress.completedQuests.length}</div>
                  <div className="text-xs text-[#9a9088] uppercase font-bold tracking-widest">Completed Modules</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="text-[10px] font-black text-[#9a9088] uppercase tracking-widest">7-Day Activity</div>
                  <div className="space-y-2">
                    {weeklyActivity.map((item) => (
                      <div key={item.day} className="flex items-center gap-4">
                        <span className="text-xs text-[#6b6560] font-bold w-8">{item.day}</span>
                        <div className="flex-1 h-2 bg-[#faf8f5] rounded-full overflow-hidden border border-[#e8e3db]">
                          <div className="h-full bg-gradient-to-r from-[#f5c842] to-[#d97706] rounded-full" style={{ width: `${item.count}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-[10px] font-black text-[#9a9088] uppercase tracking-widest">Specialization Spread</div>
                  <div className="space-y-3">
                    {topicDistribution.length > 0 ? topicDistribution.map(item => (
                      <div key={item.topic}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#6b6560] font-medium truncate pr-4">{item.topic}</span>
                          <span className="text-[#1a1714] font-bold">{item.percent}%</span>
                        </div>
                        <div className="h-1.5 bg-[#faf8f5] rounded-full overflow-hidden border border-[#e8e3db]">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }}></div>
                        </div>
                      </div>
                    )) : <p className="text-xs text-[#9a9088]">No learning data available.</p>}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-[10px] font-black text-[#9a9088] uppercase tracking-widest">Latest Milestones</div>
                  <div className="space-y-3">
                    {milestones.length > 0 ? milestones.map(item => (
                      <div key={item.milestone} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#16a34a] rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-xs text-[#1a1714] font-bold">{item.milestone}</div>
                          <div className="text-[10px] text-[#6b6560]">{item.date}</div>
                        </div>
                      </div>
                    )) : <p className="text-xs text-[#9a9088] italic">Complete modules to log milestones.</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-6xl font-serif tracking-tight text-[#1a1714]">Achievement Vault</h2>
              <p className="text-[#6b6560] font-medium">Milestones unlocked on your learning journey</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {progress.achievements.length > 0 ? progress.achievements.map(ach => (
                <div key={ach.id} className="bg-white border border-[#e8e3db] rounded-[40px] p-8 space-y-6 hover:border-[#f5c842] transition-all hover:shadow-lg group">
                  <div className="w-20 h-20 bg-[#f5c842] rounded-[32px] flex items-center justify-center text-4xl group-hover:scale-110 transition-transform shadow-sm">
                    {ach.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-serif tracking-tight text-[#1a1714]">{ach.title}</h3>
                    <p className="text-sm text-[#6b6560] font-medium leading-relaxed">{ach.description}</p>
                    {ach.unlockedAt && (
                      <div className="text-[10px] text-[#9a9088] uppercase font-bold tracking-widest pt-2">
                        Unlocked {new Date(ach.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-20">
                  <div className="text-6xl mb-6 opacity-20">🏆</div>
                  <p className="text-[#9a9088] font-black uppercase tracking-widest">No achievements yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'customize' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-6xl font-serif tracking-tight text-[#1a1714]">Settings</h2>
              <p className="text-[#6b6560] font-medium">Personalize your learning experience</p>
            </div>
            <div className="bg-white border border-[#e8e3db] rounded-[40px] p-10 space-y-6 shadow-sm">
              <ToggleSetting label="Focus Mode" description="Minimize distractions during learning modules." defaultChecked={true} />
              <ToggleSetting label="AI Mentorship" description="Allow Aura to provide proactive hints and guidance." defaultChecked={true} />
              <ToggleSetting label="Public Profile" description="Allow others to see your learning achievements." defaultChecked={false} />
              <div className="pt-6">
                <button className="w-full py-4 bg-[#f5c842] text-[#1a1714] rounded-2xl font-bold transition-all active:scale-95 shadow-md">
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <style>{`
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
    yellow: 'border-[#f5c842]/20 bg-[#f5c842]/5',
    amber: 'border-[#d97706]/20 bg-[#d97706]/5',
    gray: 'border-[#9a9088]/20 bg-[#9a9088]/5',
    green: 'border-[#16a34a]/20 bg-[#16a34a]/5',
    blue: 'border-[#2563eb]/20 bg-[#2563eb]/5'
  };
  return (
    <div className={`bg-white border ${colorMap[color] || 'border-[#e8e3db]'} rounded-[40px] p-8 space-y-6 hover:shadow-md transition-all`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-black text-[#9a9088] uppercase tracking-widest">{title}</h3>
          <div className="text-4xl font-black text-[#1a1714] italic mt-2">{value}</div>
          <p className="text-xs text-[#6b6560] font-medium mt-2">{description}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
      <div className="border-t border-[#e8e3db] pt-4 space-y-3">
        {metrics.map(metric => (
          <div key={metric.label} className="flex justify-between items-center">
            <span className="text-xs text-[#6b6560] font-medium">{metric.label}</span>
            <span className="text-sm text-[#1a1714] font-bold">{metric.value}</span>
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
    <div className="flex items-center justify-between p-6 bg-[#faf8f5] rounded-3xl border border-[#e8e3db]">
      <div className="flex-1">
        <div className="text-sm font-bold text-[#1a1714]">{label}</div>
        <div className="text-xs text-[#6b6560] mt-1">{description}</div>
      </div>
      <button onClick={() => setChecked(!checked)} className={`w-12 h-6 rounded-full transition-all ${checked ? 'bg-[#f5c842]' : 'bg-[#e8e3db]'}`}>
        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
      </button>
    </div>
  );
};

export default Profile;
