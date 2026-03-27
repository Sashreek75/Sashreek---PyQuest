
import React, { useState, useEffect, useRef } from 'react';
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

  const editorTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const checkApiKey = async () => {
      const aistudio = window.aistudio;
      if (aistudio && typeof aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await aistudio.hasSelectedApiKey();
        if (!hasKey) {
          setNotification({
            title: "AI Mentor Offline",
            message: "Please select your Gemini API key to activate your AI mentor, Aura.",
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
      title: "Welcome Back!",
      message: `Great to see you again, ${authenticatedUser.username}. Ready to code?`,
      icon: "👋"
    });
  };

  const handlePersonalizationComplete = (personalization: UserPersonalization | null) => {
    if (!user || !progress) return;
    
    const finalPersonalization = personalization || {
      field: "General Python",
      ambition: "Software Developer",
      proficiency: "Beginner",
      focus: "Python Core",
      aiDirective: "Master the fundamentals of Python and AI.",
      summary: "Start your journey by exploring the basics and building a strong foundation.",
      philosophies: ["Learning by doing"],
      targetHardware: "Standard PC"
    };

    const updatedProgress = { ...progress, personalization: finalPersonalization };
    setProgress(updatedProgress);
    db.saveProgress(user.id, updatedProgress);
    setView('Dashboard');
    setNotification({
      title: "Path Set!",
      message: personalization ? "Your personalized learning path is ready." : "Let's start with the standard curriculum.",
      icon: personalization ? "🗺️" : "🚀"
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
    rank: progress.experience > 9000 ? 'Master Developer' : (progress.experience > 4500 ? 'Senior Engineer' : (progress.experience > 1500 ? 'Skilled Coder' : 'New Learner')),
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
    setLoadingTask({ message: "Aura is reviewing your code", sub: "Checking your logic and providing feedback..." });
    setEvaluation(null);
    
    try {
      const result = await evaluateQuestCode(currentQuest.title, currentQuest.objective, code, progress?.personalization);
      setEvaluation(result);
      if (result.status === 'success') {
        setShowQuiz(true);
      }
    } catch (err) {
      setNotification({ title: "Review Failed", message: "I couldn't reach Aura. Please try again.", icon: "⚠️" });
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
    <nav className="sticky top-0 z-50 bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#e8e3db] py-4">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('Dashboard')}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-transform group-hover:scale-110" style={{ background: '#f5c842' }}>🐍</div>
          <h1 className="text-xl font-serif tracking-tight text-[#1a1714]">PyQuest</h1>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-8 text-sm font-medium text-[#6b6560]">
            {['Dashboard', 'Academy', 'Skills', 'Sandbox', 'Pathfinder'].map((v) => (
              <button 
                key={v}
                onClick={() => setView((v === 'Pathfinder' ? 'CareerPath' : (v === 'Skills' ? 'Brain' : v)) as View)} 
                className={`hover:text-[#1a1714] transition-all ${(view as any) === (v === 'Pathfinder' ? 'CareerPath' : (v === 'Skills' ? 'Brain' : v)) ? 'text-[#1a1714] border-b-2 border-[#f5c842]' : 'border-transparent'}`}
              >
                {v}
              </button>
            ))}
          </div>
          <button onClick={handleLogout} className="text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors">Logout</button>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1714]">
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
          <div className="max-w-6xl mx-auto px-6 py-24 space-y-16 animate-in fade-in duration-1000">
            <div className="space-y-4">
              <span className="text-sm font-semibold text-[#9a9088] uppercase tracking-widest">Learning Library</span>
              <h1 className="text-6xl font-serif tracking-tight text-[#1a1714]">{selectedCategory || 'The Learning Library.'}</h1>
              {selectedCategory && (
                <button onClick={() => setSelectedCategory(null)} className="text-[#6b6560] hover:text-[#1a1714] text-sm font-medium flex items-center gap-2 transition-colors">
                  <span className="text-lg">×</span> Clear category filter
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {QUESTS
                .filter(q => !selectedCategory || q.category === selectedCategory)
                .map(q => <QuestCard key={q.id} quest={q} isCompleted={progress?.completedQuests.includes(q.id) || false} onSelect={handleQuestSelect} />)
              }
            </div>
          </div>
        )}
        {view === 'Quest' && currentQuest && (
          <div className="h-screen flex flex-col overflow-hidden bg-[#faf8f5]">
            <header className="h-20 border-b border-[#e8e3db] px-6 flex items-center justify-between shrink-0 bg-[#faf8f5]/90 backdrop-blur-md">
              <div className="flex items-center gap-6">
                <button onClick={() => setView('Academy')} className="text-[#6b6560] hover:text-[#1a1714] transition-all group flex items-center gap-2">
                  <span className="group-hover:-translate-x-1 transition-transform font-bold text-lg">←</span>
                  <span className="text-sm font-medium hidden sm:inline">Academy</span>
                </button>
                <div className="h-4 w-px bg-[#e8e3db]" />
                <h2 className="text-lg font-serif tracking-tight text-[#1a1714]">{currentQuest.title}</h2>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-semibold text-[#9a9088] uppercase tracking-widest">Reward</span>
                  <span className="text-[#16a34a] text-sm font-bold">+{currentQuest.xpReward} XP</span>
                </div>
                <button onClick={handleLogout} className="text-rose-600 hover:text-rose-700 font-semibold text-sm">Abort</button>
              </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 overflow-y-auto border-r border-[#e8e3db] custom-scroll bg-white">
                <div className="max-w-3xl mx-auto px-6 py-16">
                  <LessonContent 
                    introduction={currentQuest.lesson.introduction} 
                    sections={currentQuest.lesson.sections} 
                    summary={currentQuest.lesson.summary}
                    onReadyForChallenge={() => {
                        editorTextareaRef.current?.focus();
                        editorTextareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                  />
                </div>
              </div>

              <div className="flex-1 flex flex-col bg-[#faf8f5]">
                <div className="flex-1 flex flex-col overflow-hidden relative">
                   <div className="px-6 py-4 bg-white border-b border-[#e8e3db] flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#fc6058]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#fec02f]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#2aca44]"></div>
                        <span className="text-xs font-medium text-[#6b6560] ml-3">challenge.py</span>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={async () => setAiHint(await getAIHint(currentQuest.title, currentQuest.objective, code))} className="text-xs font-semibold text-[#6b6560] hover:text-[#1a1714] transition-colors">Hint</button>
                        <button onClick={() => setIsAuraOpen(true)} className="text-xs font-semibold text-[#f5c842] hover:text-[#d97706] transition-colors">Consult Aura</button>
                      </div>
                   </div>
                   
                   <textarea 
                    ref={editorTextareaRef}
                    value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false}
                    className="flex-1 w-full p-8 bg-transparent text-[#1a1714] font-mono text-lg focus:outline-none resize-none leading-relaxed code-font selection:bg-[#f5c842]/30"
                  />

                  <div className="p-8 bg-white border-t border-[#e8e3db] shadow-lg">
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-[#9a9088] uppercase tracking-widest">Active Objective</span>
                      <p className="text-lg font-medium text-[#1a1714] leading-tight">{currentQuest.objective}</p>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button 
                        onClick={handleRunCode} 
                        className="px-8 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-md hover:opacity-90"
                        style={{ background: '#f5c842', color: '#1a1714' }}
                      >
                        Verify Logic →
                      </button>
                    </div>
                  </div>
                </div>

                {(evaluation || aiHint) && (
                  <div className="h-[400px] border-t border-[#e8e3db] bg-white p-8 overflow-y-auto custom-scroll animate-in slide-in-from-bottom-full duration-500">
                    <div className="max-w-3xl mx-auto space-y-8">
                      {aiHint && (
                        <div className="p-6 bg-[#eff6ff] border border-[#2563eb]/10 rounded-2xl text-center italic text-lg text-[#2563eb]">
                          "{aiHint}"
                        </div>
                      )}
                      {evaluation && (
                        <div className="space-y-8">
                          <div className="flex items-center justify-between">
                            <h3 className={`text-2xl font-serif tracking-tight ${evaluation.status === 'success' ? 'text-[#16a34a]' : 'text-rose-600'}`}>
                              {evaluation.status === 'success' ? '✓ Logic Verified' : '⚠ Logic Error'}
                            </h3>
                          </div>
                          <p className="text-lg text-[#6b6560] leading-relaxed italic">"{evaluation.feedback}"</p>
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
          <div className="max-w-5xl mx-auto px-6 py-24 space-y-24 animate-in fade-in duration-1000">
            <div className="text-center space-y-6">
              <span className="text-sm font-semibold text-[#9a9088] uppercase tracking-widest">Career Strategy</span>
              <h1 className="text-7xl font-serif tracking-tight text-[#1a1714]">Pathfinder.</h1>
              <p className="text-xl text-[#6b6560] font-medium max-w-2xl mx-auto leading-tight">Tell Aura your dream role to design your personalized skill path.</p>
            </div>
            <div className="bg-white border border-[#e8e3db] rounded-[48px] p-12 md:p-20 space-y-12 text-center shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#f5c842]/5 blur-[120px] -z-10 animate-pulse"></div>
              <input value={interestInput} onChange={(e) => setInterestInput(e.target.value)} className="w-full bg-[#faf8f5] border border-[#e8e3db] rounded-3xl px-8 py-6 text-3xl text-[#1a1714] outline-none focus:border-[#f5c842] transition-all text-center font-medium placeholder:text-[#b0a89e]" placeholder="e.g. Data Scientist, Web Developer..." />
              <button 
                onClick={generateNewRoadmap} 
                disabled={!interestInput} 
                className="w-full py-6 rounded-3xl text-3xl font-semibold transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg"
                style={{ background: '#f5c842', color: '#1a1714' }}
              >
                Generate Path
              </button>
            </div>
            {progress?.roadmapData && <CareerArchitect data={progress.roadmapData} />}
          </div>
        )}
      </main>
      
      <AuraHub 
        isOpen={isAuraOpen} 
        onClose={() => setIsAuraOpen(false)} 
        onOpen={() => setIsAuraOpen(true)}
        context={currentQuest ? `Current Quest: ${currentQuest.title}` : 'Mentorship Interface'}
        personalization={progress?.personalization}
      />

      {loadingTask && <LoadingOverlay message={loadingTask.message} subMessage={loadingTask.sub} />}
      {notification && <Notification title={notification.title} message={notification.message} icon={notification.icon} onClose={() => setNotification(null)} />}
      <style>{`
        @keyframes ambient-drift { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .animate-ambient { animation: ambient-drift 30s infinite ease-in-out; }
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
