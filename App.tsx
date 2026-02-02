import React, { useState, useEffect } from 'react';
import { QUESTS, INITIAL_ACHIEVEMENTS } from './constants';
import { Quest, Progress, CodeEvaluation, UserStats, User, RoadmapData, Achievement } from './types';
import QuestCard from './components/QuestCard';
import Visualizer from './components/Visualizer';
import QuizOverlay from './components/QuizOverlay';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CareerArchitect from './components/CareerArchitect';
import Notification from './components/Notification';
import Auth from './components/Auth';
import { evaluateQuestCode, getAIHint, generateCareerStrategy } from './services/geminiService';

type View = 'Landing' | 'Auth' | 'Dashboard' | 'Academy' | 'Quest' | 'CareerPath' | 'Profile';

const App: React.FC = () => {
  const [view, setView] = useState<View>('Landing');
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  
  const [notification, setNotification] = useState<{ title: string; message: string; icon: string } | null>(null);
  
  const [code, setCode] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<CodeEvaluation | null>(null);
  const [aiHint, setAiHint] = useState<string | null>(null);
  
  const [interestInput, setInterestInput] = useState('');
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('pyquest_active_session');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      loadUserProgress(u.id);
      setView('Dashboard');
    }
  }, []);

  const loadUserProgress = (userId: string) => {
    const savedProgress = localStorage.getItem(`pyquest_progress_v6_${userId}`);
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    } else {
      const initial: Progress = {
        userId,
        completedQuests: [],
        passedQuizzes: [],
        experience: 0,
        currentStreak: 1,
        dailyLoginCount: 1,
        achievements: [INITIAL_ACHIEVEMENTS[0]],
        lastActiveDate: new Date().toISOString()
      };
      setProgress(initial);
      saveProgress(userId, initial);
    }
  };

  const saveProgress = (userId: string, p: Progress) => {
    localStorage.setItem(`pyquest_progress_v6_${userId}`, JSON.stringify(p));
  };

  const handleAuth = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    localStorage.setItem('pyquest_active_session', JSON.stringify(authenticatedUser));
    loadUserProgress(authenticatedUser.id);
    setView('Dashboard');
    setNotification({
      title: "Terminal Linked",
      message: `Welcome, ${authenticatedUser.username}. Your professional roadmap is ready.`,
      icon: "🔑"
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('pyquest_active_session');
    setUser(null);
    setProgress(null);
    setView('Landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stats: UserStats = progress ? {
    level: Math.floor(progress.experience / 1000) + 1,
    xp: progress.experience % 1000,
    questsCompleted: progress.completedQuests.length,
    accuracy: 80 + (progress.passedQuizzes.length * 1.2),
    streak: progress.currentStreak,
    badges: progress.achievements.map(a => a.title),
    rank: progress.experience > 9000 ? 'Architect' : (progress.experience > 4500 ? 'Core Engineer' : (progress.experience > 1500 ? 'Specialist' : 'Initiate')),
    totalHours: Math.floor(progress.experience / 120) + 1,
    skillMatrix: [], 
    globalPercentile: Math.min(99.9, 15 + (progress.experience / 100))
  } : { level: 1, xp: 0, questsCompleted: 0, accuracy: 0, streak: 0, badges: [], rank: '', totalHours: 0, skillMatrix: [], globalPercentile: 0 };

  const handleQuestSelect = (quest: Quest) => {
    setCurrentQuest(quest);
    setCode(quest.startingCode);
    setEvaluation(null);
    setAiHint(null);
    setView('Quest');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRunCode = async () => {
    if (!currentQuest) return;
    setIsEvaluating(true);
    setEvaluation(null);
    
    try {
      const result = await evaluateQuestCode(currentQuest.title, currentQuest.objective, code);
      setEvaluation(result);
      if (result.status === 'success') {
        setShowQuiz(true);
      }
    } catch (err) {
      console.error("Critical Evaluation Failure:", err);
      setNotification({
        title: "Kernel Error",
        message: "Failed to audit logic. Check API key status.",
        icon: "🚨"
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleQuizComplete = (passed: boolean) => {
    if (passed && currentQuest && progress && user) {
      const updatedProgress: Progress = {
        ...progress,
        completedQuests: Array.from(new Set([...progress.completedQuests, currentQuest.id])),
        passedQuizzes: Array.from(new Set([...progress.passedQuizzes, currentQuest.id])),
        experience: progress.experience + currentQuest.xpReward
      };
      
      const triggerAchievement = (id: string) => {
        const ach = INITIAL_ACHIEVEMENTS.find(a => a.id === id);
        if (ach && !updatedProgress.achievements.find(a => a.id === id)) {
          updatedProgress.achievements.push(ach);
          setNotification({
            title: ach.title,
            message: ach.description,
            icon: ach.icon
          });
        }
      };

      if (updatedProgress.completedQuests.length === 1) triggerAchievement('first_step');
      if (updatedProgress.completedQuests.length === 3) triggerAchievement('math_wizard');
      if (currentQuest.id === 'trans-1') triggerAchievement('transformer_master');
      if (updatedProgress.experience >= 5000) triggerAchievement('ai_architect');

      setProgress(updatedProgress);
      saveProgress(user.id, updatedProgress);
      setShowQuiz(false);
      setEvaluation(null);
      setView('Dashboard');
    }
  };

  const generateNewRoadmap = async () => {
    if (!user || !progress) return;
    setIsGeneratingPath(true);
    try {
      const roadmapData = await generateCareerStrategy(interestInput, progress.completedQuests);
      const updatedProgress: Progress = { ...progress, roadmapData };
      setProgress(updatedProgress);
      saveProgress(user.id, updatedProgress);
      setNotification({
        title: "Roadmap Architected",
        message: `High-fidelity tech tree generated for ${interestInput}.`,
        icon: "🗺️"
      });
    } catch (err) {
      console.error("Failed to generate roadmap", err);
      setNotification({
        title: "Strategy Failure",
        message: "The roadmap architect is offline. Verify network/API credentials.",
        icon: "⚠️"
      });
    } finally {
      setIsGeneratingPath(false);
    }
  };

  if (view === 'Landing') {
    return <LandingPage onInitialize={() => setView('Auth')} />;
  }

  if (view === 'Auth') {
    return <Auth onAuth={handleAuth} onBack={() => setView('Landing')} />;
  }

  const renderSimpleNav = () => (
    <nav className="sticky top-0 z-50 bg-[#010208]/80 backdrop-blur-3xl border-b border-white/5 py-4">
      <div className="max-w-[1800px] mx-auto px-10 flex items-center justify-between">
        <div className="flex items-center gap-6 cursor-pointer group" onClick={() => setView('Dashboard')}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-xl shadow-indigo-600/20 group-hover:scale-105 transition-transform">P</div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black text-white leading-none tracking-tighter uppercase">PyQuest</h1>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Terminal Status: Active</p>
          </div>
        </div>
        
        <div className="flex items-center gap-12">
          <div className="hidden lg:flex gap-12 font-black text-[10px] uppercase tracking-[0.4em] text-slate-600">
            {[
              { label: 'Dashboard', view: 'Dashboard' },
              { label: 'Academy', view: 'Academy' },
              { label: 'Strategist', view: 'CareerPath' }
            ].map((item) => (
              <button 
                key={item.view}
                onClick={() => setView(item.view as View)} 
                className={`transition-all hover:text-white border-b-2 pb-1 ${view === item.view ? 'text-indigo-400 border-indigo-400' : 'border-transparent'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button 
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center hover:bg-rose-500/10 hover:border-rose-500/50 transition-all text-slate-700 hover:text-rose-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#010208] text-slate-200 selection:bg-indigo-500/30">
      {view !== 'Dashboard' && renderSimpleNav()}

      <main className="w-full">
        {view === 'Dashboard' && user && progress && (
          <Dashboard 
            user={user} 
            progress={progress} 
            stats={stats} 
            onNavigate={(v) => setView(v as View)} 
            onSelectQuest={handleQuestSelect}
            onLogout={handleLogout}
          />
        )}

        {view === 'Academy' && (
          <div className="max-w-[1800px] mx-auto px-10 py-20 space-y-20 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-white/5 pb-16">
              <div className="space-y-4">
                <h1 className="text-7xl font-black text-white tracking-tighter uppercase">Academy.</h1>
                <p className="text-xl text-slate-500 font-medium max-w-2xl">The roadmap to AI sovereignty. 16 high-fidelity nodes optimized for technical depth.</p>
              </div>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-40">
              {QUESTS.map(q => (
                <QuestCard 
                  key={q.id} 
                  quest={q} 
                  isCompleted={progress?.completedQuests.includes(q.id) || false} 
                  onSelect={handleQuestSelect} 
                />
              ))}
            </div>
          </div>
        )}

        {view === 'Quest' && currentQuest && (
          <div className="max-w-[1800px] mx-auto px-10 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in slide-in-from-right duration-700">
            <div className="lg:col-span-4 space-y-10">
              <button onClick={() => setView('Dashboard')} className="flex items-center gap-4 text-slate-600 hover:text-white font-black text-xs uppercase tracking-[0.4em] transition-all group">
                <svg className="w-6 h-6 group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Abort Protocol
              </button>
              
              <div className="bg-slate-900/30 backdrop-blur-3xl border border-white/5 rounded-[48px] p-16 shadow-2xl space-y-12">
                <div className="space-y-4">
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Node: {currentQuest.id}</div>
                  <h2 className="text-4xl font-black text-white tracking-tighter leading-none uppercase">{currentQuest.title}</h2>
                </div>
                
                <div className="space-y-6">
                  <p className="text-xl text-slate-400 leading-relaxed font-medium">{currentQuest.longDescription}</p>
                  <div className="flex flex-wrap gap-3 pt-6 border-t border-white/5">
                    {currentQuest.topics.map(t => (
                      <span key={t} className="px-3 py-1.5 bg-slate-950 rounded-xl text-[9px] font-black uppercase text-slate-600 border border-white/5">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="p-8 bg-indigo-600/5 border border-indigo-500/20 rounded-[32px] space-y-4">
                  <div className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em]">Mission Target</div>
                  <p className="text-indigo-100 font-bold text-lg leading-relaxed">{currentQuest.objective}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-10">
              <div className="bg-[#0b0e14] rounded-[48px] border border-white/5 overflow-hidden shadow-3xl flex flex-col h-[750px]">
                <div className="bg-slate-900/50 px-12 py-6 flex justify-between items-center border-b border-white/5">
                  <div className="flex gap-4">
                    <div className="w-3 h-3 rounded-full bg-rose-500/40"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/40"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/40"></div>
                  </div>
                  <div className="text-[9px] font-mono font-black text-slate-700 uppercase tracking-[0.5em]">logic_architect.py</div>
                  <div className="w-12"></div>
                </div>
                <textarea 
                  value={code} 
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck={false}
                  className="flex-1 w-full p-12 bg-[#010208] text-indigo-100 font-mono text-xl focus:outline-none resize-none leading-relaxed"
                />
                <div className="p-10 bg-slate-900/50 border-t border-white/5 flex flex-col sm:flex-row gap-8 justify-between items-center">
                  <button 
                    onClick={async () => {
                      const hint = await getAIHint(currentQuest.title, currentQuest.objective, code);
                      setAiHint(hint);
                    }}
                    className="text-[9px] font-black text-slate-600 hover:text-indigo-400 transition-all uppercase tracking-[0.5em]"
                  >
                    Contextual AI Hint
                  </button>
                  <button 
                    onClick={handleRunCode}
                    disabled={isEvaluating}
                    className="w-full sm:w-auto px-12 py-5 bg-white text-black rounded-2xl font-black text-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 uppercase tracking-tighter"
                  >
                    {isEvaluating ? 'AUDITING...' : 'Submit Logic'}
                  </button>
                </div>
              </div>

              {aiHint && (
                <div className="bg-indigo-600/5 border border-indigo-500/20 p-10 rounded-[32px] animate-in fade-in text-center space-y-4 shadow-xl">
                  <div className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.5em]">Mentor Transmission</div>
                  <p className="text-indigo-100 text-xl italic font-medium leading-relaxed">"{aiHint}"</p>
                </div>
              )}

              {evaluation && (
                <div className="bg-slate-900 border border-white/5 rounded-[48px] p-12 animate-in slide-in-from-bottom-8 duration-700 shadow-3xl space-y-10">
                  <div className="flex items-center gap-8">
                    <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center text-4xl shadow-2xl ${evaluation.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                      {evaluation.status === 'success' ? '✓' : '!'}
                    </div>
                    <div>
                      <h3 className={`text-4xl font-black tracking-tighter uppercase ${evaluation.status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {evaluation.status === 'success' ? 'Mission Success' : 'Review Required'}
                      </h3>
                      <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Logical integrity audit complete</p>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <p className="text-lg text-slate-400 leading-relaxed font-medium">{evaluation.feedback}</p>
                    {evaluation.mentorAdvice && (
                      <div className="mt-8 pt-8 border-t border-white/5">
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em]">Mentor Wisdom</span>
                        <p className="text-indigo-200 mt-3 italic text-xl leading-relaxed">{evaluation.mentorAdvice}</p>
                      </div>
                    )}
                  </div>
                  <div className="h-[450px] w-full bg-[#010208] rounded-[32px] border border-white/5 p-8 shadow-inner">
                    <Visualizer data={evaluation.visualizationData || []} />
                  </div>
                </div>
              )}
            </div>
            {showQuiz && currentQuest && (
              <QuizOverlay questions={currentQuest.quiz} onComplete={handleQuizComplete} onClose={() => setShowQuiz(false)} />
            )}
          </div>
        )}

        {view === 'CareerPath' && (
          <div className="max-w-[1400px] mx-auto px-10 py-24 space-y-24">
            <div className="text-center space-y-8">
              <h1 className="text-7xl font-black text-white tracking-tighter uppercase leading-none">Strategist.</h1>
              <p className="text-2xl text-slate-500 font-medium max-w-3xl mx-auto leading-tight">Architect your position in the future global economy with a high-fidelity tech-tree.</p>
            </div>
            
            <div className="bg-slate-900 border border-white/5 rounded-[64px] p-20 shadow-3xl space-y-16">
              <div className="space-y-6 text-center">
                <h3 className="text-3xl font-black text-white uppercase tracking-tight">Identify Your Industrial Target</h3>
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.6em]">Robotics, Quant Finance, BioTech, CyberSecurity</p>
              </div>
              <div className="flex flex-col gap-10">
                <input 
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  className="w-full bg-[#010208] border-2 border-white/5 rounded-[32px] px-12 py-8 text-2xl text-white font-black outline-none focus:border-indigo-600 transition-all placeholder:text-slate-900"
                  placeholder="e.g. Quantitative High-Frequency Trading..."
                />
                <button 
                  onClick={generateNewRoadmap}
                  disabled={isGeneratingPath || !interestInput}
                  className="w-full bg-white text-black py-8 rounded-[32px] text-2xl font-black shadow-3xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 uppercase tracking-tighter"
                >
                  {isGeneratingPath ? 'Architecting Tech-Tree...' : 'Initialize Roadmap Generation'}
                </button>
              </div>
            </div>

            {progress?.roadmapData && (
              <CareerArchitect data={progress.roadmapData} />
            )}
          </div>
        )}

        {view === 'Profile' && user && progress && (
          <div className="max-w-5xl mx-auto px-10 py-24 space-y-16 animate-in zoom-in duration-1000">
            <header className="text-center space-y-4">
              <h1 className="text-7xl font-black text-white tracking-tighter uppercase leading-none">Profile.</h1>
              <p className="text-slate-800 font-black tracking-[0.5em] uppercase text-xs">Biometric & Academic Identity</p>
            </header>
            <div className="bg-slate-900 border border-white/5 rounded-[64px] p-20 shadow-3xl space-y-16 text-center md:text-left">
              <div className="flex flex-col md:flex-row gap-16 items-center">
                <div className="w-56 h-56 rounded-[48px] bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-8xl font-black text-white shadow-3xl">
                  {user.username.charAt(0)}
                </div>
                <div className="flex-1 space-y-4">
                  <h2 className="text-6xl font-black text-white tracking-tighter leading-none uppercase">{user.username}</h2>
                  <div className="space-y-2">
                    <p className="text-slate-500 font-bold uppercase tracking-[0.5em] text-lg">{user.id}</p>
                    <div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-widest">
                      <span>Auth Provider:</span>
                      <span className="bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{user.provider}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {notification && (
        <Notification 
          title={notification.title} 
          message={notification.message} 
          icon={notification.icon} 
          onClose={() => setNotification(null)} 
        />
      )}
    </div>
  );
};

export default App;