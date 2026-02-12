
import React, { useState, useEffect } from 'react';
import { QUESTS, INITIAL_ACHIEVEMENTS } from './constants';
import { Quest, Progress, CodeEvaluation, UserStats, User, RoadmapData } from './types';
import QuestCard from './components/QuestCard';
import Visualizer from './components/Visualizer';
import QuizOverlay from './components/QuizOverlay';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CareerArchitect from './components/CareerArchitect';
import Notification from './components/Notification';
import Auth from './components/Auth';
import AuraHub from './components/AuraHub';
import LoadingOverlay from './components/LoadingOverlay';
import { evaluateQuestCode, getAIHint, generateCareerStrategy } from './services/geminiService';
import { db } from './services/dbService';

type View = 'Landing' | 'Auth' | 'Dashboard' | 'Academy' | 'Quest' | 'CareerPath' | 'Profile';

const App: React.FC = () => {
  const [view, setView] = useState<View>('Landing');
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  
  const [notification, setNotification] = useState<{ title: string; message: string; icon: string } | null>(null);
  const [isAuraOpen, setIsAuraOpen] = useState(false);
  const [loadingTask, setLoadingTask] = useState<{ message: string; sub: string } | null>(null);
  
  const [code, setCode] = useState('');
  const [evaluation, setEvaluation] = useState<CodeEvaluation | null>(null);
  const [aiHint, setAiHint] = useState<string | null>(null);
  
  const [interestInput, setInterestInput] = useState('');
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);

  useEffect(() => {
    // Check for active session on boot
    const activeUser = db.getSession();
    if (activeUser) {
      setUser(activeUser);
      loadUserProgress(activeUser.id);
      setView('Dashboard');
    }
  }, []);

  const loadUserProgress = (userId: string) => {
    const savedProgress = db.getProgress(userId);
    if (savedProgress) {
      setProgress(savedProgress);
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
      db.saveProgress(userId, initial);
    }
  };

  const handleAuth = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    loadUserProgress(authenticatedUser.id);
    setView('Dashboard');
    setNotification({
      title: "Terminal Linked",
      message: `Welcome back, Architect ${authenticatedUser.username}.`,
      icon: "🔑"
    });
  };

  const handleLogout = () => {
    db.clearSession();
    setUser(null);
    setProgress(null);
    setView('Landing');
    setIsAuraOpen(false);
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
    setLoadingTask({ message: "Auditing Logical Integrity", sub: "Aura Neural Kernel v9.5.0 Active" });
    setEvaluation(null);
    
    try {
      const result = await evaluateQuestCode(currentQuest.title, currentQuest.objective, code);
      setEvaluation(result);
      if (result.status === 'success') {
        setShowQuiz(true);
      }
    } catch (err) {
      console.error("Evaluation Error:", err);
      setNotification({ title: "Audit Error", message: "Failed to evaluate logic. Check connection.", icon: "🚨" });
    } finally {
      setLoadingTask(null);
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
          setNotification({ title: ach.title, message: ach.description, icon: ach.icon });
        }
      };

      if (updatedProgress.completedQuests.length === 1) triggerAchievement('first_step');
      if (updatedProgress.completedQuests.length === 3) triggerAchievement('math_wizard');
      if (currentQuest.id === 'trans-1') triggerAchievement('transformer_master');

      setProgress(updatedProgress);
      db.saveProgress(user.id, updatedProgress);
      setShowQuiz(false);
      setEvaluation(null);
      setView('Dashboard');
    }
  };

  const generateNewRoadmap = async () => {
    if (!user || !progress) return;
    setLoadingTask({ message: "Architecting Strategy", sub: "Synthesizing Career Branching Nodes" });
    try {
      const roadmapData = await generateCareerStrategy(interestInput, progress.completedQuests);
      const updatedProgress: Progress = { ...progress, roadmapData };
      setProgress(updatedProgress);
      db.saveProgress(user.id, updatedProgress);
      setNotification({ title: "Roadmap Architected", message: `High-fidelity tree generated.`, icon: "🗺️" });
    } catch (err) {
      console.error("Roadmap generation failed", err);
      setNotification({ title: "Strategy Failure", message: "Neural synthesis interrupted.", icon: "⚠️" });
    } finally {
      setLoadingTask(null);
    }
  };

  if (view === 'Landing') return <LandingPage onInitialize={() => setView('Auth')} />;
  if (view === 'Auth') return <Auth onAuth={handleAuth} onBack={() => setView('Landing')} />;

  const renderSimpleNav = () => (
    <nav className="sticky top-0 z-50 bg-[#010208]/90 backdrop-blur-3xl border-b border-white/5 py-4">
      <div className="max-w-[1800px] mx-auto px-10 flex items-center justify-between">
        <div className="flex items-center gap-6 cursor-pointer group" onClick={() => setView('Dashboard')}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-xl text-white">P</div>
          <h1 className="text-xl font-black text-white uppercase tracking-tighter">PyQuest</h1>
        </div>
        <div className="flex items-center gap-10">
          <div className="hidden lg:flex gap-10 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
            {['Dashboard', 'Academy', 'CareerPath'].map((v) => (
              <button 
                key={v}
                onClick={() => setView(v as View)} 
                className={`hover:text-white pb-1 border-b-2 transition-all ${view === v ? 'text-indigo-400 border-indigo-400' : 'border-transparent'}`}
              >
                {v === 'CareerPath' ? 'Strategist' : v}
              </button>
            ))}
          </div>
          <button onClick={handleLogout} className="text-rose-500 hover:text-rose-400 font-black text-[10px] uppercase tracking-widest bg-rose-500/5 px-4 py-2 rounded-lg border border-rose-500/10">Log Out</button>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#010208] text-slate-200">
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
            onToggleAura={() => setIsAuraOpen(true)}
          />
        )}
        {view === 'Academy' && (
          <div className="max-w-[1800px] mx-auto px-10 py-20 space-y-16">
            <h1 className="text-6xl font-black text-white tracking-tighter uppercase">Academy.</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {QUESTS.map(q => <QuestCard key={q.id} quest={q} isCompleted={progress?.completedQuests.includes(q.id) || false} onSelect={handleQuestSelect} />)}
            </div>
          </div>
        )}
        {view === 'Quest' && currentQuest && (
          <div className="max-w-[1800px] mx-auto px-10 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-8">
              <button onClick={() => setView('Academy')} className="flex items-center gap-2 text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all">&larr; Return to Academy</button>
              <div className="bg-[#0b0e14] border border-white/5 rounded-[48px] p-12 space-y-8 shadow-2xl">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">{currentQuest.title}</h2>
                <p className="text-lg text-slate-400 leading-relaxed">{currentQuest.longDescription}</p>
                <div className="p-8 bg-indigo-600/5 border border-indigo-500/20 rounded-3xl">
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em]">Objective</span>
                  <p className="text-indigo-100 font-bold mt-2">{currentQuest.objective}</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-[#0b0e14] rounded-[48px] border border-white/5 overflow-hidden flex flex-col h-[650px]">
                <textarea 
                  value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false}
                  className="flex-1 w-full p-12 bg-[#010208] text-indigo-100 font-mono text-xl focus:outline-none resize-none"
                />
                <div className="p-10 bg-slate-900/50 flex justify-between items-center">
                  <div className="flex gap-4">
                    <button onClick={async () => setAiHint(await getAIHint(currentQuest.title, currentQuest.objective, code))} className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest">Request Hint</button>
                    <button onClick={() => setIsAuraOpen(true)} className="text-[10px] font-black text-indigo-500 hover:text-indigo-400 uppercase tracking-widest">Consult Aura</button>
                  </div>
                  <button onClick={handleRunCode} className="px-10 py-4 bg-white text-black rounded-2xl font-black uppercase text-sm active:scale-95">Submit Logic</button>
                </div>
              </div>
              {aiHint && <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-3xl text-center italic text-indigo-200">"{aiHint}"</div>}
              {evaluation && (
                <div className="bg-[#0b0e14] border border-white/5 rounded-[48px] p-10 space-y-8">
                  <h3 className={`text-2xl font-black uppercase ${evaluation.status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>{evaluation.status === 'success' ? 'Logic Verified' : 'Logic Flaw Detected'}</h3>
                  <p className="text-slate-400">{evaluation.feedback}</p>
                  <div className="h-[300px] w-full"><Visualizer data={evaluation.visualizationData || []} /></div>
                </div>
              )}
            </div>
            {showQuiz && <QuizOverlay questions={currentQuest.quiz} onComplete={handleQuizComplete} onClose={() => setShowQuiz(false)} />}
          </div>
        )}
        {view === 'CareerPath' && (
          <div className="max-w-[1440px] mx-auto px-10 py-24 space-y-16">
            <h1 className="text-6xl font-black text-white tracking-tighter uppercase text-center">Strategist.</h1>
            <div className="bg-[#0b0e14] border border-white/5 rounded-[64px] p-16 space-y-10 text-center">
              <input value={interestInput} onChange={(e) => setInterestInput(e.target.value)} className="w-full bg-black/40 border-2 border-white/5 rounded-3xl px-10 py-6 text-xl text-white outline-none focus:border-indigo-600 transition-all text-center" placeholder="Define target: e.g. Quant Trading, Robotics..." />
              <button onClick={generateNewRoadmap} disabled={isGeneratingPath || !interestInput} className="w-full bg-white text-black py-6 rounded-3xl text-xl font-black active:scale-95 disabled:opacity-50">Generate Tech-Tree</button>
            </div>
            {progress?.roadmapData && <CareerArchitect data={progress.roadmapData} />}
          </div>
        )}
      </main>
      
      {/* Global AI Hub Overlay */}
      <AuraHub 
        isOpen={isAuraOpen} 
        onClose={() => setIsAuraOpen(false)} 
        onOpen={() => setIsAuraOpen(true)}
        context={currentQuest ? `Current Quest: ${currentQuest.title}` : 'General Exploration'}
      />

      {/* Global Processing Modal */}
      {loadingTask && <LoadingOverlay message={loadingTask.message} subMessage={loadingTask.sub} />}

      {notification && <Notification title={notification.title} message={notification.message} icon={notification.icon} onClose={() => setNotification(null)} />}
    </div>
  );
};

export default App;
