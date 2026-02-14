
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

  useEffect(() => {
    const activeUser = db.getSession();
    if (activeUser) {
      setUser(activeUser);
      const savedProgress = db.getProgress(activeUser.id);
      if (savedProgress) {
        setProgress(savedProgress);
        setView(savedProgress.personalization || savedProgress.completedQuests.length > 0 ? 'Dashboard' : 'Personalization');
      } else {
        loadUserProgress(activeUser.id);
      }
    }
  }, []);

  const loadUserProgress = (userId: string) => {
    const savedProgress = db.getProgress(userId);
    if (savedProgress) {
      setProgress(savedProgress);
      setView(savedProgress.personalization || savedProgress.completedQuests.length > 0 ? 'Dashboard' : 'Personalization');
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
      title: "Terminal Synchronized",
      message: `Identity confirmed. Architect ${authenticatedUser.username} online.`,
      icon: "🔑"
    });
  };

  const handlePersonalizationComplete = (personalization: UserPersonalization | null) => {
    if (!user || !progress) return;
    
    // Handle skip or failed generation
    const finalPersonalization = personalization || {
      field: "General Intelligence",
      ambition: "Expert Architect",
      proficiency: "Neural Initiate",
      focus: "Python Core",
      aiDirective: "Master the fundamental laws of applied intelligence.",
      summary: "Explore the repository and find your path within the architecture.",
      philosophies: ["Discovery"],
      targetHardware: "Universal"
    };

    const updatedProgress = { ...progress, personalization: finalPersonalization };
    setProgress(updatedProgress);
    db.saveProgress(user.id, updatedProgress);
    setView('Dashboard');
    setNotification({
      title: personalization ? "Synaptic Alignment" : "Access Granted",
      message: personalization ? "Neural curriculum targeted to your ambition." : "Proceeding with standard orientation protocol.",
      icon: personalization ? "🧠" : "🔓"
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
    rank: progress.experience > 9000 ? 'Zenith Architect' : (progress.experience > 4500 ? 'Senior Neural Engineer' : (progress.experience > 1500 ? 'Applied Specialist' : 'Neural Initiate')),
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
    setLoadingTask({ message: "Conducting Neural Audit", sub: "Aura Kernel analyzing logic primitives and memory strides" });
    setEvaluation(null);
    
    try {
      const result = await evaluateQuestCode(currentQuest.title, currentQuest.objective, code, progress?.personalization);
      setEvaluation(result);
      if (result.status === 'success') {
        setShowQuiz(true);
      }
    } catch (err) {
      setNotification({ title: "Audit Fault", message: "Kernel timeout. Connection uplink unstable.", icon: "🚨" });
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
    setLoadingTask({ message: "Synthesizing Career Strategy", sub: "Building tech-tree for target professional zenith" });
    try {
      const roadmapData = await generateCareerStrategy(interestInput, progress.completedQuests, progress.personalization);
      const updatedProgress: Progress = { ...progress, roadmapData };
      setProgress(updatedProgress);
      db.saveProgress(user.id, updatedProgress);
      setNotification({ title: "Pathfinder Initialized", message: `Neural tech-tree updated.`, icon: "🗺️" });
    } catch (err) {
      setNotification({ title: "Synthesis Error", message: "Strategic architecture calculation failed.", icon: "⚠️" });
    } finally {
      setLoadingTask(null);
    }
  };

  if (view === 'Landing') return <LandingPage onInitialize={() => setView('Auth')} />;
  if (view === 'Auth') return <Auth onAuth={handleAuth} onBack={() => setView('Landing')} />;
  if (view === 'Personalization') return <PersonalizationQuiz onComplete={handlePersonalizationComplete} />;

  const renderSimpleNav = () => (
    <nav className="sticky top-0 z-50 bg-[#010208]/95 backdrop-blur-3xl border-b border-white/5 py-6">
      <div className="max-w-[1800px] mx-auto px-12 flex items-center justify-between">
        <div className="flex items-center gap-6 cursor-pointer group" onClick={() => setView('Dashboard')}>
          <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl transition-transform group-hover:scale-110 italic">P</div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">PyQuest</h1>
        </div>
        <div className="flex items-center gap-12">
          <div className="hidden lg:flex gap-12 text-[11px] font-black uppercase tracking-[0.5em] text-slate-500">
            {['Dashboard', 'Academy', 'Pathfinder'].map((v) => (
              <button 
                key={v}
                onClick={() => setView((v === 'Pathfinder' ? 'CareerPath' : v) as View)} 
                className={`hover:text-white pb-1 border-b-2 transition-all ${view === (v === 'Pathfinder' ? 'CareerPath' : v) ? 'text-indigo-400 border-indigo-400' : 'border-transparent'}`}
              >
                {v}
              </button>
            ))}
          </div>
          <button onClick={handleLogout} className="text-rose-500 hover:text-rose-400 font-black text-[11px] uppercase tracking-widest bg-rose-500/5 px-8 py-3.5 rounded-2xl border border-rose-500/10 transition-all">TERMINATE_SESSION</button>
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
          <div className="max-w-[1800px] mx-auto px-12 py-32 space-y-24 animate-in fade-in duration-1000">
            <div className="space-y-6">
              <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.8em]">Knowledge Base Directory</span>
              <h1 className="text-8xl font-black text-white tracking-tighter uppercase italic">The Repository.</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {QUESTS.map(q => <QuestCard key={q.id} quest={q} isCompleted={progress?.completedQuests.includes(q.id) || false} onSelect={handleQuestSelect} />)}
            </div>
          </div>
        )}
        {view === 'Quest' && currentQuest && (
          <div className="max-w-[1800px] mx-auto px-12 py-24 grid grid-cols-1 lg:grid-cols-12 gap-20 animate-in fade-in duration-700">
            <div className="lg:col-span-4 space-y-16">
              <button onClick={() => setView('Academy')} className="flex items-center gap-6 text-slate-600 hover:text-white font-black text-[12px] uppercase tracking-widest transition-all group italic">
                <span className="group-hover:-translate-x-2 transition-transform text-xl">←</span> 
                Repository Ingress
              </button>
              <div className="bg-[#0b0e14] border border-white/5 rounded-[80px] p-20 space-y-12 shadow-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -z-10 group-hover:bg-indigo-500/10 transition-all"></div>
                <h2 className="text-6xl font-black text-white uppercase tracking-tighter leading-none italic">{currentQuest.title}</h2>
                <p className="text-2xl text-slate-400 leading-relaxed font-medium">{currentQuest.longDescription}</p>
                <div className="p-12 bg-indigo-600/5 border border-indigo-500/20 rounded-[48px]">
                  <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.6em]">Module Objective</span>
                  <p className="text-white text-2xl font-bold mt-6 leading-tight uppercase italic">{currentQuest.objective}</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 space-y-12">
              <div className="bg-[#0b0e14] rounded-[80px] border border-white/5 overflow-hidden flex flex-col h-[850px] shadow-3xl">
                <div className="bg-[#05070d] px-14 py-7 border-b border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-rose-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20"></div>
                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest ml-4">Applied_Core.py</span>
                  </div>
                </div>
                <textarea 
                  value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false}
                  className="flex-1 w-full p-20 bg-[#010208] text-indigo-100 font-mono text-2xl focus:outline-none resize-none leading-relaxed"
                />
                <div className="p-14 bg-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5">
                  <div className="flex gap-12">
                    <button onClick={async () => setAiHint(await getAIHint(currentQuest.title, currentQuest.objective, code))} className="text-[12px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors italic">Request Hint</button>
                    <button onClick={() => setIsAuraOpen(true)} className="text-[12px] font-black text-indigo-500 hover:text-indigo-400 uppercase tracking-widest transition-colors italic">Consult Aura</button>
                  </div>
                  <button onClick={handleRunCode} className="px-16 py-6 bg-white text-black rounded-3xl font-black uppercase text-sm tracking-widest active:scale-95 shadow-3xl transition-all hover:bg-indigo-50 italic">Audit Logic</button>
                </div>
              </div>
              {aiHint && <div className="bg-indigo-600/10 border border-indigo-500/20 p-12 rounded-[48px] text-center italic text-3xl text-indigo-200 animate-in slide-in-from-top-4">"{aiHint}"</div>}
              {evaluation && (
                <div className="bg-[#0b0e14] border border-white/5 rounded-[80px] p-20 space-y-12 animate-in fade-in zoom-in duration-700 shadow-3xl">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-4xl font-black uppercase tracking-tighter italic ${evaluation.status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>{evaluation.status === 'success' ? 'Logic Valid' : 'Logic Fault'}</h3>
                    <div className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest ${evaluation.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>Kernel_{evaluation.status}</div>
                  </div>
                  <p className="text-2xl text-slate-400 font-medium leading-relaxed italic">"{evaluation.feedback}"</p>
                  <div className="h-[450px] w-full"><Visualizer data={evaluation.visualizationData || []} /></div>
                </div>
              )}
            </div>
            {showQuiz && <QuizOverlay questions={currentQuest.quiz} onComplete={handleQuizComplete} onClose={() => setShowQuiz(false)} />}
          </div>
        )}
        {view === 'CareerPath' && (
          <div className="max-w-[1600px] mx-auto px-12 py-40 space-y-32 animate-in fade-in duration-1000">
            <div className="text-center space-y-8">
              <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.8em]">Neural Strategist Unit</span>
              <h1 className="text-9xl font-black text-white tracking-tighter uppercase italic">Pathfinder.</h1>
              <p className="text-3xl text-slate-500 font-medium max-w-5xl mx-auto leading-tight">Define your objective to synthesize a high-fidelity roadmap.</p>
            </div>
            <div className="bg-[#0b0e14] border border-white/5 rounded-[100px] p-32 space-y-16 text-center shadow-3xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-indigo-600/5 blur-[150px] -z-10 animate-neural"></div>
              <input value={interestInput} onChange={(e) => setInterestInput(e.target.value)} className="w-full bg-black/40 border-2 border-white/10 rounded-[48px] px-16 py-12 text-4xl text-white outline-none focus:border-indigo-600 transition-all text-center font-black placeholder:text-slate-900 italic" placeholder="e.g. Lead Robotics Engineer, Data Scientist..." />
              <button onClick={generateNewRoadmap} disabled={!interestInput} className="w-full bg-white text-black py-12 rounded-[48px] text-4xl font-black active:scale-95 disabled:opacity-50 hover:bg-indigo-50 transition-all shadow-3xl uppercase tracking-tighter italic">Architect Strategy</button>
            </div>
            {progress?.roadmapData && <CareerArchitect data={progress.roadmapData} />}
          </div>
        )}
      </main>
      
      <AuraHub 
        isOpen={isAuraOpen} 
        onClose={() => setIsAuraOpen(false)} 
        onOpen={() => setIsAuraOpen(true)}
        context={currentQuest ? `Current Quest: ${currentQuest.title}` : 'Global Architect Terminal'}
        personalization={progress?.personalization}
      />

      {loadingTask && <LoadingOverlay message={loadingTask.message} subMessage={loadingTask.sub} />}
      {notification && <Notification title={notification.title} message={notification.message} icon={notification.icon} onClose={() => setNotification(null)} />}
      <style>{`
        @keyframes neural-drift { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .animate-neural { animation: neural-drift 30s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default App;
