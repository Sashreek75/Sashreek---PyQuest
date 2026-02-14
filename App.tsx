
import React, { useState, useEffect } from 'react';
import { QUESTS, INITIAL_ACHIEVEMENTS } from './constants';
import { Quest, Progress, CodeEvaluation, UserStats, User, RoadmapData, UserPersonalization } from './types';
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
import PersonalizationQuiz from './components/PersonalizationQuiz';
import { evaluateQuestCode, getAIHint, generateCareerStrategy } from './services/geminiService';
import { db } from './services/dbService';

type View = 'Landing' | 'Auth' | 'Personalization' | 'Dashboard' | 'Academy' | 'Quest' | 'CareerPath' | 'Profile';

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
    const activeUser = db.getSession();
    if (activeUser) {
      setUser(activeUser);
      loadUserProgress(activeUser.id);
    }
  }, []);

  const loadUserProgress = (userId: string) => {
    const savedProgress = db.getProgress(userId);
    if (savedProgress) {
      setProgress(savedProgress);
      if (!savedProgress.personalization) {
        setView('Personalization');
      } else {
        setView('Dashboard');
      }
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
      setView('Personalization');
    }
  };

  const handleAuth = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    loadUserProgress(authenticatedUser.id);
    setNotification({
      title: "Terminal Linked",
      message: `Identity verified. Architect ${authenticatedUser.username} online.`,
      icon: "🔑"
    });
  };

  const handlePersonalizationComplete = (personalization: UserPersonalization) => {
    if (!user || !progress) return;
    const updatedProgress = { ...progress, personalization };
    setProgress(updatedProgress);
    db.saveProgress(user.id, updatedProgress);
    setView('Dashboard');
    setNotification({
      title: "Neural Synapse Formed",
      message: "Curriculum recalibrated to target objectives.",
      icon: "🧠"
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
    rank: progress.experience > 9000 ? 'Master Architect' : (progress.experience > 4500 ? 'Senior Engineer' : (progress.experience > 1500 ? 'Applied Specialist' : 'Neural Initiate')),
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
    setLoadingTask({ message: "Neural Audit in Progress", sub: "Aura Kernel v9.5.1 evaluating logical kernels" });
    setEvaluation(null);
    
    try {
      const result = await evaluateQuestCode(currentQuest.title, currentQuest.objective, code, progress?.personalization);
      setEvaluation(result);
      if (result.status === 'success') {
        setShowQuiz(true);
      }
    } catch (err) {
      console.error("Evaluation Error:", err);
      setNotification({ title: "Audit Exception", message: "Failed to verify neural logic.", icon: "🚨" });
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
    setLoadingTask({ message: "Synthesizing Career Path", sub: "Architecting strategic nodes for target profile" });
    try {
      const roadmapData = await generateCareerStrategy(interestInput, progress.completedQuests, progress.personalization);
      const updatedProgress: Progress = { ...progress, roadmapData };
      setProgress(updatedProgress);
      db.saveProgress(user.id, updatedProgress);
      setNotification({ title: "Pathfinder Active", message: `Neural tech-tree has been generated.`, icon: "🗺️" });
    } catch (err) {
      console.error("Roadmap generation failed", err);
      setNotification({ title: "Synthesis Error", message: "Strategic architecture failure.", icon: "⚠️" });
    } finally {
      setLoadingTask(null);
    }
  };

  if (view === 'Landing') return <LandingPage onInitialize={() => setView('Auth')} />;
  if (view === 'Auth') return <Auth onAuth={handleAuth} onBack={() => setView('Landing')} />;
  if (view === 'Personalization') return <PersonalizationQuiz onComplete={handlePersonalizationComplete} />;

  const renderSimpleNav = () => (
    <nav className="sticky top-0 z-50 bg-[#010208]/90 backdrop-blur-3xl border-b border-white/10 py-5">
      <div className="max-w-[1800px] mx-auto px-12 flex items-center justify-between">
        <div className="flex items-center gap-5 cursor-pointer group" onClick={() => setView('Dashboard')}>
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-xl">P</div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">PyQuest</h1>
        </div>
        <div className="flex items-center gap-12">
          <div className="hidden lg:flex gap-12 text-[11px] font-black uppercase tracking-[0.5em] text-slate-500">
            {['Dashboard', 'Academy', 'Strategist'].map((v) => (
              <button 
                key={v}
                onClick={() => setView((v === 'Strategist' ? 'CareerPath' : v) as View)} 
                className={`hover:text-white pb-1 border-b-2 transition-all ${view === (v === 'Strategist' ? 'CareerPath' : v) ? 'text-indigo-400 border-indigo-400' : 'border-transparent'}`}
              >
                {v}
              </button>
            ))}
          </div>
          <button onClick={handleLogout} className="text-rose-500 hover:text-rose-400 font-black text-[11px] uppercase tracking-widest bg-rose-500/5 px-6 py-3 rounded-xl border border-rose-500/10 transition-all">TERMINATE SESSION</button>
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
            onNavigate={(v) => setView((v === 'CareerPath' ? 'CareerPath' : v) as View)} 
            onSelectQuest={handleQuestSelect} 
            onLogout={handleLogout}
            onToggleAura={() => setIsAuraOpen(true)}
          />
        )}
        {view === 'Academy' && (
          <div className="max-w-[1800px] mx-auto px-12 py-24 space-y-20 animate-in fade-in duration-1000">
            <div className="space-y-4">
              <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.6em]">Academic Directory</span>
              <h1 className="text-7xl font-black text-white tracking-tighter uppercase italic">Applied Repository.</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {QUESTS.map(q => <QuestCard key={q.id} quest={q} isCompleted={progress?.completedQuests.includes(q.id) || false} onSelect={handleQuestSelect} />)}
            </div>
          </div>
        )}
        {view === 'Quest' && currentQuest && (
          <div className="max-w-[1800px] mx-auto px-12 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16 animate-in fade-in duration-700">
            <div className="lg:col-span-4 space-y-12">
              <button onClick={() => setView('Academy')} className="flex items-center gap-4 text-slate-500 hover:text-white font-black text-[11px] uppercase tracking-widest transition-all group">
                <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> 
                Return to Repository
              </button>
              <div className="bg-[#0b0e14] border border-white/5 rounded-[64px] p-16 space-y-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-[80px]"></div>
                <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">{currentQuest.title}</h2>
                <p className="text-xl text-slate-400 leading-relaxed font-medium">{currentQuest.longDescription}</p>
                <div className="p-10 bg-indigo-600/5 border border-indigo-500/20 rounded-[40px]">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em]">Current Objective</span>
                  <p className="text-white text-xl font-bold mt-4 leading-tight">{currentQuest.objective}</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 space-y-10">
              <div className="bg-[#0b0e14] rounded-[64px] border border-white/5 overflow-hidden flex flex-col h-[750px] shadow-3xl">
                <div className="bg-[#05070d] px-10 py-5 border-b border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Applied_Kernel.py</span>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20"></div>
                  </div>
                </div>
                <textarea 
                  value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false}
                  className="flex-1 w-full p-16 bg-[#010208] text-indigo-100 font-mono text-xl focus:outline-none resize-none leading-relaxed"
                />
                <div className="p-12 bg-slate-900/50 flex justify-between items-center border-t border-white/5">
                  <div className="flex gap-10">
                    <button onClick={async () => setAiHint(await getAIHint(currentQuest.title, currentQuest.objective, code))} className="text-[11px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">Request Hint</button>
                    <button onClick={() => setIsAuraOpen(true)} className="text-[11px] font-black text-indigo-500 hover:text-indigo-400 uppercase tracking-widest transition-colors">Consult Aura</button>
                  </div>
                  <button onClick={handleRunCode} className="px-14 py-5 bg-white text-black rounded-2xl font-black uppercase text-[12px] tracking-widest active:scale-95 shadow-2xl transition-all hover:bg-indigo-50">Audit Logic</button>
                </div>
              </div>
              {aiHint && <div className="bg-indigo-600/10 border border-indigo-500/20 p-10 rounded-[40px] text-center italic text-2xl text-indigo-200 animate-in slide-in-from-top-4">"{aiHint}"</div>}
              {evaluation && (
                <div className="bg-[#0b0e14] border border-white/5 rounded-[64px] p-16 space-y-10 animate-in fade-in zoom-in duration-500 shadow-3xl">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-3xl font-black uppercase tracking-tighter italic ${evaluation.status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>{evaluation.status === 'success' ? 'Logic Verified' : 'Logic Fault Detected'}</h3>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${evaluation.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>Status: {evaluation.status}</div>
                  </div>
                  <p className="text-xl text-slate-400 font-medium leading-relaxed">{evaluation.feedback}</p>
                  <div className="h-[400px] w-full"><Visualizer data={evaluation.visualizationData || []} /></div>
                </div>
              )}
            </div>
            {showQuiz && <QuizOverlay questions={currentQuest.quiz} onComplete={handleQuizComplete} onClose={() => setShowQuiz(false)} />}
          </div>
        )}
        {view === 'CareerPath' && (
          <div className="max-w-[1600px] mx-auto px-12 py-32 space-y-24 animate-in fade-in duration-1000">
            <div className="text-center space-y-6">
              <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.6em]">Neural Strategist</span>
              <h1 className="text-8xl font-black text-white tracking-tighter uppercase italic">Pathfinder.</h1>
              <p className="text-2xl text-slate-500 font-medium max-w-4xl mx-auto">Define your target career objective to generate a high-fidelity technology roadmap.</p>
            </div>
            <div className="bg-[#0b0e14] border border-white/5 rounded-[80px] p-24 space-y-12 text-center shadow-3xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/5 blur-[120px]"></div>
              <input value={interestInput} onChange={(e) => setInterestInput(e.target.value)} className="w-full bg-black/40 border-2 border-white/5 rounded-[32px] px-12 py-10 text-3xl text-white outline-none focus:border-indigo-600 transition-all text-center font-black placeholder:text-slate-800" placeholder="e.g. Quant Research, Deep Perception, Robotics Architect..." />
              <button onClick={generateNewRoadmap} disabled={isGeneratingPath || !interestInput} className="w-full bg-white text-black py-10 rounded-[32px] text-3xl font-black active:scale-95 disabled:opacity-50 hover:bg-indigo-50 transition-all shadow-2xl uppercase tracking-tighter">Architect Roadmap</button>
            </div>
            {progress?.roadmapData && <CareerArchitect data={progress.roadmapData} />}
          </div>
        )}
      </main>
      
      <AuraHub 
        isOpen={isAuraOpen} 
        onClose={() => setIsAuraOpen(false)} 
        onOpen={() => setIsAuraOpen(true)}
        context={currentQuest ? `Quest: ${currentQuest.title}` : 'Global Exploration'}
        personalization={progress?.personalization}
      />

      {loadingTask && <LoadingOverlay message={loadingTask.message} subMessage={loadingTask.sub} />}
      {notification && <Notification title={notification.title} message={notification.message} icon={notification.icon} onClose={() => setNotification(null)} />}
    </div>
  );
};

export default App;
