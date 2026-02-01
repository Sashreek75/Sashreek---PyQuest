
import React, { useState, useEffect } from 'react';
import { QUESTS, INITIAL_ACHIEVEMENTS } from './constants';
import { Quest, Progress, CodeEvaluation, UserStats, User, Achievement } from './types';
import QuestCard from './components/QuestCard';
import Visualizer from './components/Visualizer';
import QuizOverlay from './components/QuizOverlay';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import { evaluateQuestCode, getAIHint, generateCareerStrategy } from './services/geminiService';

type View = 'Landing' | 'Dashboard' | 'Academy' | 'Quest' | 'CareerPath' | 'Profile';

const App: React.FC = () => {
  const [view, setView] = useState<View>('Landing');
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  
  // Editor State
  const [code, setCode] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<CodeEvaluation | null>(null);
  const [aiHint, setAiHint] = useState<string | null>(null);
  
  // Career Path State
  const [interestInput, setInterestInput] = useState('');
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);

  // Persistence: Restore state on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('pyquest_active_session');
    if (savedSession) {
      const u = JSON.parse(savedSession);
      setUser(u);
      setView('Dashboard');
      loadUserProgress(u.id);
    }
  }, []);

  const loadUserProgress = (userId: string) => {
    const savedProgress = localStorage.getItem(`pyquest_progress_v2_${userId}`);
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    } else {
      const initial: Progress = {
        userId,
        completedQuests: [],
        passedQuizzes: [],
        experience: 0,
        currentStreak: 1,
        achievements: [INITIAL_ACHIEVEMENTS[0]],
        lastActiveDate: new Date().toISOString()
      };
      setProgress(initial);
      saveProgress(userId, initial);
    }
  };

  const saveProgress = (userId: string, p: Progress) => {
    localStorage.setItem(`pyquest_progress_v2_${userId}`, JSON.stringify(p));
  };

  const handleInitialize = () => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: 'Pioneer_' + Math.floor(Math.random() * 999),
      email: 'active@session.py',
      createdAt: new Date().toISOString(),
      interests: '',
      goal: ''
    };
    setUser(newUser);
    localStorage.setItem('pyquest_active_session', JSON.stringify(newUser));
    loadUserProgress(newUser.id);
    setView('Dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('pyquest_active_session');
    setUser(null);
    setProgress(null);
    setView('Landing');
  };

  const stats: UserStats = progress ? {
    level: Math.floor(progress.experience / 1000) + 1,
    xp: progress.experience % 1000,
    questsCompleted: progress.completedQuests.length,
    accuracy: 75 + (progress.passedQuizzes.length * 2),
    streak: progress.currentStreak,
    badges: progress.achievements.map(a => a.title),
    rank: progress.experience > 5000 ? 'Architect' : (progress.experience > 2000 ? 'Engineer' : 'Novice'),
    totalHours: Math.floor(progress.experience / 100),
    skillPoints: { 'Python': 10, 'ML': 5 }
  } : { level: 1, xp: 0, questsCompleted: 0, accuracy: 0, streak: 0, badges: [], rank: '', totalHours: 0, skillPoints: {} };

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
    const result = await evaluateQuestCode(currentQuest.title, currentQuest.objective, code);
    setEvaluation(result);
    if (result.status === 'success') {
      setShowQuiz(true);
    }
    setIsEvaluating(false);
  };

  const handleQuizComplete = (passed: boolean) => {
    if (passed && currentQuest && progress && user) {
      const updatedProgress: Progress = {
        ...progress,
        completedQuests: Array.from(new Set([...progress.completedQuests, currentQuest.id])),
        passedQuizzes: Array.from(new Set([...progress.passedQuizzes, currentQuest.id])),
        experience: progress.experience + currentQuest.xpReward
      };
      
      // Handle special achievements
      if (updatedProgress.completedQuests.length === 3 && !updatedProgress.achievements.find(a => a.id === 'math_wizard')) {
        updatedProgress.achievements.push(INITIAL_ACHIEVEMENTS[2]);
      }

      setProgress(updatedProgress);
      saveProgress(user.id, updatedProgress);
      setShowQuiz(false);
      setEvaluation(null);
      setView('Dashboard');
    }
  };

  // View Components
  if (view === 'Landing') {
    return <LandingPage onInitialize={handleInitialize} />;
  }

  const renderNav = () => (
    <nav className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-[1800px] mx-auto px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setView('Dashboard')}>
          <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-xl shadow-indigo-600/20 group-hover:scale-105 transition-transform">P</div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-black text-white leading-none tracking-tight">PyQuest Academy</h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Terminal Active</p>
          </div>
        </div>
        
        <div className="flex items-center gap-10">
          <div className="hidden md:flex gap-10 font-black text-[10px] uppercase tracking-[0.2em] text-slate-500">
            {['Dashboard', 'Academy', 'CareerPath', 'Profile'].map((v) => (
              <button 
                key={v}
                onClick={() => setView(v as View)} 
                className={`transition-all hover:text-white ${view === v ? 'text-indigo-400' : ''}`}
              >
                {v}
              </button>
            ))}
          </div>
          <button 
            onClick={handleLogout}
            className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-rose-500/10 hover:border-rose-500/50 transition-all text-slate-600 hover:text-rose-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30">
      {renderNav()}

      <main className="w-full">
        {view === 'Dashboard' && user && progress && (
          <Dashboard 
            user={user} 
            progress={progress} 
            stats={stats} 
            onNavigate={(v) => setView(v)} 
            onSelectQuest={handleQuestSelect}
          />
        )}

        {view === 'Academy' && (
          <div className="max-w-[1800px] mx-auto px-8 py-16 space-y-16 animate-in fade-in zoom-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-slate-800 pb-12">
              <div className="space-y-4">
                <h1 className="text-6xl font-black text-white tracking-tighter">Curriculum Map</h1>
                <p className="text-xl text-slate-500 font-medium">16 modules from foundations to neural architecture.</p>
              </div>
              <div className="flex gap-4">
                <div className="px-6 py-3 bg-slate-900 rounded-2xl border border-slate-800 text-xs font-black uppercase text-slate-400">
                  Unlocked: {progress?.completedQuests.length} / {QUESTS.length}
                </div>
              </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
          <div className="max-w-[1800px] mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-right duration-500">
            {/* Left Info Panel */}
            <div className="lg:col-span-4 space-y-8">
              <button onClick={() => setView('Academy')} className="flex items-center gap-3 text-slate-500 hover:text-white font-black text-xs uppercase tracking-[0.2em] transition-colors group">
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Return to curriculum
              </button>
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[40px] p-12 shadow-2xl space-y-8">
                <div>
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Module {currentQuest.id}</div>
                  <h2 className="text-4xl font-black text-white tracking-tight leading-tight">{currentQuest.title}</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-lg text-slate-400 leading-relaxed font-medium">{currentQuest.longDescription}</p>
                  <div className="flex flex-wrap gap-2">
                    {currentQuest.topics.map(t => (
                      <span key={t} className="px-3 py-1 bg-slate-950 rounded-lg text-[10px] font-black uppercase text-slate-600 border border-slate-800">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="p-8 bg-indigo-500/5 border border-indigo-500/20 rounded-3xl space-y-3">
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Logic Requirement</div>
                  <p className="text-indigo-100 font-bold leading-relaxed">{currentQuest.objective}</p>
                </div>
              </div>
            </div>

            {/* Right Editor Panel */}
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-[#0f172a] rounded-[40px] border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[700px]">
                <div className="bg-slate-800/50 px-10 py-5 flex justify-between items-center border-b border-slate-800">
                  <div className="flex gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-rose-500/50"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-amber-500/50"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/50"></div>
                  </div>
                  <div className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.2em]">interactive_terminal.py</div>
                  <div className="w-12"></div>
                </div>
                <textarea 
                  value={code} 
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck={false}
                  className="flex-1 w-full p-12 bg-[#020617] text-indigo-100 font-mono text-xl focus:outline-none resize-none selection:bg-indigo-500/30 leading-relaxed"
                />
                <div className="p-8 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row gap-6 justify-between items-center">
                  <button 
                    onClick={async () => {
                      const hint = await getAIHint(currentQuest.title, currentQuest.objective, code);
                      setAiHint(hint);
                    }}
                    className="text-[10px] font-black text-slate-600 hover:text-indigo-400 transition-colors uppercase tracking-[0.2em]"
                  >
                    Contextual Mentor Hint
                  </button>
                  <button 
                    onClick={handleRunCode}
                    disabled={isEvaluating}
                    className="w-full sm:w-auto px-16 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xl shadow-xl shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isEvaluating ? 'Simulating...' : 'Submit Logic'}
                  </button>
                </div>
              </div>

              {aiHint && (
                <div className="bg-indigo-950/20 border border-indigo-500/20 p-10 rounded-[32px] animate-in fade-in slide-in-from-top-4 text-center">
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">AI Mentor Response</div>
                  <p className="text-indigo-100 text-lg italic font-medium">"{aiHint}"</p>
                </div>
              )}

              {evaluation && (
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[40px] p-12 animate-in slide-in-from-bottom-8 duration-500 shadow-3xl space-y-10">
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-3xl shadow-2xl ${evaluation.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {evaluation.status === 'success' ? '✓' : '!'}
                    </div>
                    <div>
                      <h3 className={`text-4xl font-black ${evaluation.status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {evaluation.status === 'success' ? 'Validation Passed' : 'Logic Review Required'}
                      </h3>
                      <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">Audit complete</p>
                    </div>
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <p className="text-xl text-slate-400 leading-relaxed font-medium">{evaluation.feedback}</p>
                    {evaluation.mentorAdvice && (
                      <div className="mt-8 pt-8 border-t border-slate-800">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Mentor Wisdom</span>
                        <p className="text-indigo-200 mt-2 italic text-lg">{evaluation.mentorAdvice}</p>
                      </div>
                    )}
                  </div>

                  <div className="h-[450px] w-full bg-slate-950 rounded-[32px] border border-slate-800 p-10 shadow-inner">
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
          <div className="max-w-5xl mx-auto px-8 py-20 space-y-16 animate-in slide-in-from-bottom-12 duration-700">
            <div className="text-center space-y-6">
              <h1 className="text-7xl font-black text-white tracking-tighter uppercase">Strategic AI Plan</h1>
              <p className="text-2xl text-slate-500 font-medium max-w-3xl mx-auto">Analyze your current trajectory and architect a roadmap for technical dominance.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-[48px] p-16 shadow-3xl space-y-12">
              <div className="space-y-4 text-center">
                <h3 className="text-3xl font-black text-white">Target Industry Integration</h3>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Biotech, FinTech, Robotics, Gaming, Space-Tech</p>
              </div>
              <div className="flex flex-col gap-8">
                <input 
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  className="w-full bg-slate-950 border-2 border-slate-800 rounded-3xl px-10 py-8 text-2xl text-white font-bold outline-none focus:border-indigo-500 transition-all placeholder:text-slate-900"
                  placeholder="Tell your mentor your primary field of interest..."
                />
                <button 
                  onClick={async () => {
                    setIsGeneratingPath(true);
                    const path = await generateCareerStrategy(interestInput, progress?.completedQuests || []);
                    setProgress(p => p ? ({ ...p, careerGoal: path }) : null);
                    setIsGeneratingPath(false);
                  }}
                  disabled={isGeneratingPath || !interestInput}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 py-8 rounded-3xl text-2xl font-black text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {isGeneratingPath ? 'Architecting Pathway...' : 'Initialize Roadmap Generation'}
                </button>
              </div>
            </div>

            {progress?.careerGoal && (
              <div className="bg-[#020617] border border-indigo-500/20 rounded-[48px] p-16 shadow-3xl animate-in zoom-in-95 duration-700 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500 group-hover:w-4 transition-all"></div>
                <div className="prose prose-invert max-w-none text-indigo-50/90 text-2xl leading-[1.6] whitespace-pre-wrap font-medium">
                  {progress.careerGoal}
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'Profile' && user && progress && (
          <div className="max-w-4xl mx-auto px-8 py-20 space-y-12 animate-in zoom-in duration-700">
            <header className="text-center space-y-2">
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Academy Profile</h1>
              <p className="text-slate-600 font-black tracking-[0.4em] uppercase text-xs">Biometric & Academic Records</p>
            </header>
            
            <div className="bg-slate-900 border border-slate-800 rounded-[48px] p-16 shadow-3xl space-y-12">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="w-48 h-48 rounded-[48px] bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-7xl font-black text-white shadow-2xl">
                  {user.username.charAt(0)}
                </div>
                <div className="flex-1 text-center md:text-left space-y-2">
                  <h2 className="text-5xl font-black text-white tracking-tight">{user.username}</h2>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">{user.email}</p>
                  <div className="inline-block mt-6 px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 font-black uppercase text-xs tracking-widest">
                    Rank: {stats.rank}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-slate-800">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-white uppercase tracking-widest">Achievements Unlocked</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {progress.achievements.map(a => (
                      <div key={a.id} title={a.description} className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl hover:scale-110 transition-all cursor-help shadow-lg">
                        {a.icon}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-white uppercase tracking-widest">Session Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-slate-500">Member Since</span>
                      <span className="text-slate-200">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-slate-500">Modules Cleared</span>
                      <span className="text-slate-200">{progress.completedQuests.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center pt-8">
                <button onClick={handleLogout} className="text-rose-500 font-black uppercase tracking-[0.4em] text-[10px] hover:text-rose-400 transition-colors border-b-2 border-transparent hover:border-rose-400 pb-1">Reset Session Identity</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-32 border-t border-slate-900 py-24 bg-[#010411] text-center">
        <div className="max-w-7xl mx-auto px-8 flex flex-col items-center gap-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-black text-white">P</div>
            <span className="text-lg font-black tracking-tight text-white uppercase">PyQuest Platforms</span>
          </div>
          <div className="flex gap-16 text-[10px] font-black text-slate-700 uppercase tracking-[0.5em]">
            <span className="hover:text-white cursor-pointer transition-colors">Academy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-white cursor-pointer transition-colors">Ethics</span>
            <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
          </div>
          <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em]">&copy; 2026 PYQUEST PLATFORMS INC. SYSTEM PROTOCOL 8.4.1</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
