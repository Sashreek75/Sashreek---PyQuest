
import React, { useState, useEffect } from 'react';
import { QUESTS, INITIAL_ACHIEVEMENTS } from './constants';
import { Quest, Progress, CodeEvaluation, UserStats, User, RoadmapData, UserPersonalization, QuestCategory, ActivityRecord } from './types';
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
import Sandbox from './components/Sandbox';
import KnowledgeGraph from './components/KnowledgeGraph';
import Profile from './components/Profile';
import LessonContent from './components/LessonContent';
import { evaluateQuestCode, getAIHint, generateCareerStrategy } from './services/geminiService';
import { db } from './services/dbService';

type View = 'Landing' | 'Auth' | 'Personalization' | 'Dashboard' | 'Academy' | 'Quest' | 'CareerPath' | 'Profile' | 'Sandbox' | 'Brain';

const App: React.FC = () => {
  const [view, setView] = useState<View>('Landing');
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<QuestCategory | null>(null);
  
  const [notification, setNotification] = useState<{ title: string; message: string; icon: string } | null>(null);
  const [isAuraOpen, setIsAuraOpen] = useState(false);
  const [loadingTask, setLoadingTask] = useState<{ message: string; sub: string } | null>(null);
  
  const [code, setCode] = useState('');
  const [evaluation, setEvaluation] = useState<CodeEvaluation | null>(null);
  const [aiHint, setAiHint] = useState<string | null>(null);
  
  const [interestInput, setInterestInput] = useState('');

  useEffect(() => {
    // Check for API Key if in AI Studio environment
    const checkApiKey = async () => {
      const aistudio = window.aistudio;
      if (aistudio && typeof aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await aistudio.hasSelectedApiKey();
        if (!hasKey) {
          setNotification({
            title: "AI Core Offline",
            message: "Please select your Gemini API key to activate Aura.",
            icon: "🔑"
          });
          if (typeof aistudio.openSelectKey === 'function') {
            await aistudio.openSelectKey();
          }
        }
      }
    };
    checkApiKey();

    const activeUser = db.getSession();
    if (activeUser) {
      setUser(activeUser);
      const savedProgress = db.getProgress(activeUser.id);
      if (savedProgress) {
        setProgress(savedProgress);
        // If they have personalization or have finished quests, go to dashboard
        const hasFinishedOnboarding = !!savedProgress.personalization || savedProgress.completedQuests.length > 0;
        setView(hasFinishedOnboarding ? 'Dashboard' : 'Personalization');
      } else {
        loadUserProgress(activeUser.id);
      }
    }
  }, []);

  const loadUserProgress = (userId: string) => {
    const savedProgress = db.getProgress(userId);
    if (savedProgress) {
      setProgress(savedProgress);
      const hasFinishedOnboarding = !!savedProgress.personalization || savedProgress.completedQuests.length > 0;
      setView(hasFinishedOnboarding ? 'Dashboard' : 'Personalization');
    } else {
      const initial: Progress = {
        userId,
        completedQuests: [],
        passedQuizzes: [],
        experience: 0,
        currentStreak: 1,
        longestStreak: 1,
        dailyLoginCount: 1,
        achievements: [INITIAL_ACHIEVEMENTS[0]],
        lastActiveDate: new Date().toISOString(),
        activityLog: [],
        topicXP: {}
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
      title: "Access Granted",
      message: `Identity confirmed. Welcome back, ${authenticatedUser.username}.`,
      icon: "🔑"
    });
  };

  const handlePersonalizationComplete = (personalization: UserPersonalization | null) => {
    if (!user || !progress) return;
    
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
      title: "Sync Complete",
      message: personalization ? "Your personalized curriculum is ready." : "Proceeding with standard training protocol.",
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
    accuracy: Math.min(100, 75 + (progress.passedQuizzes.length * 1.5)),
    streak: progress.currentStreak,
    longestStreak: progress.longestStreak || progress.currentStreak,
    badges: progress.achievements.map(a => a.title),
    rank: progress.experience > 9000 ? 'Zenith Architect' : (progress.experience > 4500 ? 'Senior Neural Engineer' : (progress.experience > 1500 ? 'Applied Specialist' : 'Neural Initiate')),
    totalHours: Math.floor(progress.experience / 120) + 1,
    skillMatrix: [], 
    globalPercentile: Math.min(99.9, 15 + (progress.experience / 100))
  } : { level: 1, xp: 0, questsCompleted: 0, accuracy: 0, streak: 0, longestStreak: 0, badges: [], rank: '', totalHours: 0, skillMatrix: [], globalPercentile: 0 };

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
    setLoadingTask({ message: "AI Reviewing Your Logic", sub: "Aura is checking your code structure and math..." });
    setEvaluation(null);
    
    try {
      const result = await evaluateQuestCode(currentQuest.title, currentQuest.objective, code, progress?.personalization);
      setEvaluation(result);
      if (result.status === 'success') {
        setShowQuiz(true);
      }
    } catch (err) {
      setNotification({ title: "Audit Failed", message: "Aura connection was interrupted. Please try again.", icon: "🚨" });
    } finally {
      setLoadingTask(null);
    }
  };

  const handleQuizComplete = (passed: boolean) => {
    if (passed && currentQuest && progress && user) {
      const activity: ActivityRecord = {
        date: new Date().toISOString(),
        questId: currentQuest.id,
        xpEarned: currentQuest.xpReward,
        type: 'quest'
      };

      const newTopicXP = { ...progress.topicXP };
      newTopicXP[currentQuest.category] = (newTopicXP[currentQuest.category] || 0) + currentQuest.xpReward;

      const updatedProgress: Progress = {
        ...progress,
        completedQuests: Array.from(new Set([...progress.completedQuests, currentQuest.id])),
        passedQuizzes: Array.from(new Set([...progress.passedQuizzes, currentQuest.id])),
        experience: progress.experience + currentQuest.xpReward,
        activityLog: [...(progress.activityLog || []), activity],
        topicXP: newTopicXP
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
    setLoadingTask({ message: "Designing Your Career Roadmap", sub: "Synthesizing the perfect path for your goals..." });
    try {
      const roadmapData = await generateCareerStrategy(interestInput, progress.completedQuests, progress.personalization);
      const updatedProgress: Progress = { ...progress, roadmapData };
      setProgress(updatedProgress);
      db.saveProgress(user.id, updatedProgress);
      setNotification({ title: "Roadmap Ready", message: `Your new tech-tree has been generated.`, icon: "🗺️" });
    } catch (err) {
      setNotification({ title: "Synthesis Error", message: "Something went wrong while designing your path.", icon: "⚠️" });
    } finally {
      setLoadingTask(null);
    }
  };

  if (view === 'Landing') return <LandingPage onInitialize={() => setView('Auth')} />;
  if (view === 'Auth') return <Auth onAuth={handleAuth} onBack={() => setView('Landing')} />;
  if (view === 'Personalization') return <PersonalizationQuiz onComplete={handlePersonalizationComplete} />;
  if (view === 'Sandbox') return <Sandbox onBack={() => setView('Dashboard')} onOpenAura={() => setIsAuraOpen(true)} personalization={progress?.personalization} />;
  if (view === 'Brain' && progress) return <KnowledgeGraph progress={progress} onBack={() => setView('Dashboard')} onSelectCategory={(cat) => { setSelectedCategory(cat); setView('Academy'); }} />;
  if (view === 'Profile' && user && progress) return <Profile user={user} progress={progress} stats={stats} onBack={() => setView('Dashboard')} />;

  const renderSimpleNav = () => (
    <nav className="sticky top-0 z-50 bg-[#010208]/95 backdrop-blur-3xl border-b border-white/5 py-6">
      <div className="max-w-[1800px] mx-auto px-12 flex items-center justify-between">
        <div className="flex items-center gap-6 cursor-pointer group" onClick={() => setView('Dashboard')}>
          <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl transition-transform group-hover:scale-110 italic">P</div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">PyQuest</h1>
        </div>
        <div className="flex items-center gap-12">
          <div className="hidden lg:flex gap-12 text-[11px] font-black uppercase tracking-[0.5em] text-slate-500">
            {['Dashboard', 'Academy', 'Skills', 'Sandbox', 'Pathfinder'].map((v) => (
              <button 
                key={v}
                onClick={() => setView((v === 'Pathfinder' ? 'CareerPath' : (v === 'Skills' ? 'Brain' : v)) as View)} 
                className={`hover:text-white pb-1 border-b-2 transition-all ${(view as any) === (v === 'Pathfinder' ? 'CareerPath' : (v === 'Skills' ? 'Brain' : v)) ? 'text-indigo-400 border-indigo-400' : 'border-transparent'}`}
              >
                {v}
              </button>
            ))}
          </div>
          <button onClick={handleLogout} className="text-rose-500 hover:text-rose-400 font-black text-[11px] uppercase tracking-widest bg-rose-500/5 px-8 py-3.5 rounded-2xl border border-rose-500/10 transition-all">LOGOUT</button>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#010208] text-slate-200">
      {(view !== 'Dashboard' && view !== 'Brain' && view !== 'Profile' && view !== 'Quest') && renderSimpleNav()}
      <main className="w-full">
        {view === 'Dashboard' && user && progress && (
          <Dashboard 
            user={user} 
            progress={progress} 
            stats={stats} 
            onNavigate={(v) => setView((v === 'CareerPath' ? 'CareerPath' : (v === 'Brain' ? 'Brain' : v)) as View)} 
            onSelectQuest={handleQuestSelect} 
            onLogout={handleLogout}
            onToggleAura={() => setIsAuraOpen(true)}
          />
        )}
        {view === 'Academy' && (
          <div className="max-w-[1800px] mx-auto px-12 py-32 space-y-24 animate-in fade-in duration-1000">
            <div className="space-y-6">
              <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.8em]">Knowledge Base Directory</span>
              <h1 className="text-8xl font-black text-white tracking-tighter uppercase italic">{selectedCategory || 'The Repository.'}</h1>
              {selectedCategory && (
                <button onClick={() => setSelectedCategory(null)} className="text-slate-600 hover:text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 transition-colors">
                  <span className="text-lg">×</span> Clear Categorical Filter
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {QUESTS
                .filter(q => !selectedCategory || q.category === selectedCategory)
                .map(q => <QuestCard key={q.id} quest={q} isCompleted={progress?.completedQuests.includes(q.id) || false} onSelect={handleQuestSelect} />)
              }
            </div>
          </div>
        )}
        {view === 'Quest' && currentQuest && (
          <div className="h-screen flex flex-col overflow-hidden bg-[#010208]">
            <header className="h-20 border-b border-white/5 px-12 flex items-center justify-between shrink-0 bg-[#010208]/90 backdrop-blur-xl">
              <div className="flex items-center gap-8">
                <button onClick={() => setView('Academy')} className="text-slate-500 hover:text-white transition-all group flex items-center gap-3">
                  <span className="group-hover:-translate-x-1 transition-transform font-black text-xl">←</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest italic">Academy</span>
                </button>
                <div className="h-4 w-px bg-slate-800" />
                <h2 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none">{currentQuest.title}</h2>
              </div>
              <div className="flex items-center gap-10">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Reward</span>
                  <span className="text-indigo-400 text-xs font-black">+{currentQuest.xpReward} XP</span>
                </div>
                <button onClick={handleLogout} className="text-rose-500 hover:text-rose-400 font-black text-[10px] uppercase tracking-widest">Abort</button>
              </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
              {/* Left Side: Lesson (The Odin Project Style) */}
              <div className="flex-1 overflow-y-auto border-r border-white/5 custom-scroll bg-[#05070d]/30">
                <div className="max-w-4xl mx-auto px-12 py-20">
                  <LessonContent 
                    introduction={currentQuest.lesson.introduction} 
                    sections={currentQuest.lesson.sections} 
                    summary={currentQuest.lesson.summary} 
                  />
                </div>
              </div>

              {/* Right Side: Challenge (Codecademy Style) */}
              <div className="flex-1 flex flex-col bg-[#010208]">
                {/* Editor Container */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                   <div className="px-10 py-5 bg-[#0b0e14] border-b border-white/5 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-rose-500/20"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500/20"></div>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">challenge.py</span>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={async () => setAiHint(await getAIHint(currentQuest.title, currentQuest.objective, code))} className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest italic">Hint</button>
                        <button onClick={() => setIsAuraOpen(true)} className="text-[10px] font-black text-indigo-500 hover:text-white uppercase tracking-widest italic">Consult Aura</button>
                      </div>
                   </div>
                   
                   <textarea 
                    value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false}
                    className="flex-1 w-full p-12 bg-transparent text-indigo-100 font-mono text-xl focus:outline-none resize-none leading-relaxed code-font selection:bg-indigo-500/30"
                  />

                  {/* Objective Overlay (Sticky at bottom) */}
                  <div className="p-10 bg-[#0b0e14] border-t border-white/5 shadow-2xl">
                    <div className="space-y-4">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em]">Active Objective</span>
                      <p className="text-xl font-bold text-white uppercase italic leading-tight">{currentQuest.objective}</p>
                    </div>
                    <div className="mt-8 flex justify-end">
                      <button 
                        onClick={handleRunCode} 
                        className="px-12 py-5 bg-white text-black rounded-[24px] font-black uppercase text-xs tracking-widest active:scale-95 shadow-3xl transition-all hover:bg-indigo-50 italic"
                      >
                        Verify Logic →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Audit Results Overlay (Appears only on scroll/action) */}
                {(evaluation || aiHint) && (
                  <div className="h-[400px] border-t border-white/5 bg-[#05070d] p-10 overflow-y-auto custom-scroll animate-in slide-in-from-bottom-full duration-500">
                    <div className="max-w-4xl mx-auto space-y-10">
                      {aiHint && (
                        <div className="p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-[32px] text-center italic text-xl text-indigo-200">
                          "{aiHint}"
                        </div>
                      )}
                      {evaluation && (
                        <div className="space-y-10">
                          <div className="flex items-center justify-between">
                            <h3 className={`text-3xl font-black uppercase tracking-tighter italic ${evaluation.status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {evaluation.status === 'success' ? '✓ Kernel Verified' : '⚠ Logical Error'}
                            </h3>
                          </div>
                          <p className="text-xl text-slate-400 font-medium leading-relaxed italic">"{evaluation.feedback}"</p>
                          <div className="h-[350px] w-full"><Visualizer data={evaluation.visualizationData || []} /></div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {showQuiz && <QuizOverlay questions={currentQuest.quiz} onComplete={handleQuizComplete} onClose={() => setShowQuiz(false)} />}
          </div>
        )}
        {view === 'CareerPath' && (
          <div className="max-w-[1600px] mx-auto px-12 py-40 space-y-32 animate-in fade-in duration-1000">
            <div className="text-center space-y-8">
              <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.8em]">Career Strategist Unit</span>
              <h1 className="text-9xl font-black text-white tracking-tighter uppercase italic">Pathfinder.</h1>
              <p className="text-3xl text-slate-500 font-medium max-w-5xl mx-auto leading-tight">Tell Aura your goal to design your personalized skill path.</p>
            </div>
            <div className="bg-[#0b0e14] border border-white/5 rounded-[100px] p-32 space-y-16 text-center shadow-3xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-indigo-600/5 blur-[150px] -z-10 animate-neural"></div>
              <input value={interestInput} onChange={(e) => setInterestInput(e.target.value)} className="w-full bg-black/40 border-2 border-white/10 rounded-[48px] px-16 py-12 text-4xl text-white outline-none focus:border-indigo-600 transition-all text-center font-black placeholder:text-slate-900 italic" placeholder="e.g. Lead Robotics Engineer, Data Scientist..." />
              <button onClick={generateNewRoadmap} disabled={!interestInput} className="w-full bg-white text-black py-12 rounded-[48px] text-4xl font-black active:scale-95 disabled:opacity-50 hover:bg-indigo-50 transition-all shadow-3xl uppercase tracking-tighter italic">Generate Strategy</button>
            </div>
            {progress?.roadmapData && <CareerArchitect data={progress.roadmapData} />}
          </div>
        )}
      </main>
      
      <AuraHub 
        isOpen={isAuraOpen} 
        onClose={() => setIsAuraOpen(false)} 
        onOpen={() => setIsAuraOpen(true)}
        context={currentQuest ? `Current Quest: ${currentQuest.title}` : 'General Coaching Interface'}
        personalization={progress?.personalization}
      />

      {loadingTask && <LoadingOverlay message={loadingTask.message} subMessage={loadingTask.sub} />}
      {notification && <Notification title={notification.title} message={notification.message} icon={notification.icon} onClose={() => setNotification(null)} />}
      <style>{`
        @keyframes neural-drift { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .animate-neural { animation: neural-drift 30s infinite ease-in-out; }
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
