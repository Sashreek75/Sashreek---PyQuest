
import React, { useState, useEffect } from 'react';
import { QUESTS } from './constants';
import { Quest, Progress, CodeEvaluation, UserStats } from './types';
import QuestCard from './components/QuestCard';
import Visualizer from './components/Visualizer';
import { evaluateQuestCode, getAIHint, generateCareerStrategy } from './services/geminiService';

type View = 'Dashboard' | 'Quest' | 'Profile' | 'CareerPath';

const App: React.FC = () => {
  const [view, setView] = useState<View>('Dashboard');
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [progress, setProgress] = useState<Progress>({
    completedQuests: [],
    currentQuestId: null,
    experience: 0,
    careerGoal: ''
  });
  const [code, setCode] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<CodeEvaluation | null>(null);
  const [aiHint, setAiHint] = useState<string | null>(null);
  
  // Career Path State
  const [interestInput, setInterestInput] = useState('');
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);
  const [generatedPath, setGeneratedPath] = useState('');

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('pyquest_data');
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('pyquest_data', JSON.stringify(progress));
  }, [progress]);

  const stats: UserStats = {
    level: Math.floor(progress.experience / 1000) + 1,
    xp: progress.experience % 1000,
    questsCompleted: progress.completedQuests.length,
    accuracy: 92, // Mocked for now
    streak: 5, // Mocked
    badges: progress.completedQuests.length > 5 ? ['Python Pioneer', 'Data Wizard'] : ['Beginner']
  };

  const handleQuestSelect = (quest: Quest) => {
    setCurrentQuest(quest);
    setCode(quest.startingCode);
    setEvaluation(null);
    setAiHint(null);
    setView('Quest');
  };

  const handleRunCode = async () => {
    if (!currentQuest) return;
    setIsEvaluating(true);
    const result = await evaluateQuestCode(currentQuest.title, currentQuest.objective, code);
    setEvaluation(result);
    if (result.status === 'success' && !progress.completedQuests.includes(currentQuest.id)) {
      setProgress(prev => ({
        ...prev,
        completedQuests: [...prev.completedQuests, currentQuest.id],
        experience: prev.experience + 150
      }));
    }
    setIsEvaluating(false);
  };

  const handleCreatePath = async () => {
    setIsGeneratingPath(true);
    const path = await generateCareerStrategy(interestInput, progress.completedQuests);
    setGeneratedPath(path);
    setProgress(p => ({ ...p, careerGoal: path }));
    setIsGeneratingPath(false);
  };

  const renderDashboard = () => (
    <div className="space-y-12">
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-4">Adapt or Get Replaced.</h1>
          <p className="text-indigo-100 text-lg md:text-xl max-w-2xl opacity-90">
            PyQuest is your roadmap to the AI revolution. Build projects, master Python, and launch your career in tech.
          </p>
          <div className="mt-8 flex gap-4">
            <button onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })} className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">
              Start Learning
            </button>
            <button onClick={() => setView('CareerPath')} className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-400 transition-colors">
              AI Strategy Plan
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Curriculum Path</h2>
            <p className="text-slate-400">16 modules from absolute beginner to AI master.</p>
          </div>
          <div className="text-sm font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-4 py-2 rounded-lg">
            {progress.completedQuests.length} / 16 Modules
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {QUESTS.map(quest => (
            <QuestCard 
              key={quest.id} 
              quest={quest} 
              isCompleted={progress.completedQuests.includes(quest.id)}
              onSelect={handleQuestSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderQuestView = () => currentQuest && (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
      <div className="lg:col-span-4 space-y-6">
        <button onClick={() => setView('Dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Dashboard
        </button>
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-2">{currentQuest.title}</h2>
          <span className="text-xs font-bold text-indigo-400 uppercase bg-indigo-500/10 px-2 py-1 rounded">{currentQuest.category}</span>
          <p className="text-slate-400 mt-4 text-sm leading-relaxed">{currentQuest.description}</p>
          <div className="mt-6 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <h4 className="text-xs font-bold text-indigo-400 uppercase mb-2">Objective</h4>
            <p className="text-sm text-indigo-100">{currentQuest.objective}</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 space-y-6">
        <div className="bg-[#0f172a] rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
          <div className="bg-slate-800 px-4 py-2 flex justify-between items-center text-xs font-mono text-slate-500">
            <span>workspace.py</span>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
            </div>
          </div>
          <textarea 
            value={code} onChange={(e) => setCode(e.target.value)}
            className="w-full h-[350px] p-6 bg-[#020617] text-indigo-200 font-mono text-sm focus:outline-none"
            spellCheck={false}
          />
          <div className="bg-slate-800 p-4 flex justify-between items-center">
            <button 
              onClick={async () => setAiHint(await getAIHint(currentQuest.title, currentQuest.objective, code))}
              className="text-xs font-bold text-slate-400 hover:text-white"
            >
              Need a Hint?
            </button>
            <button 
              onClick={handleRunCode} disabled={isEvaluating}
              className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-xl text-white font-bold flex items-center gap-2 transition-all shadow-lg"
            >
              {isEvaluating ? 'Evaluating...' : 'Run Module'}
            </button>
          </div>
        </div>

        {evaluation && (
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
            <h3 className={`text-xl font-bold mb-4 ${evaluation.status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {evaluation.status === 'success' ? 'Module Complete!' : 'Debugging Needed'}
            </h3>
            <p className="text-slate-400 text-sm mb-6">{evaluation.feedback}</p>
            <div className="h-64">
              <Visualizer data={evaluation.visualizationData || []} />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 flex flex-col md:flex-row gap-8 items-center">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-5xl font-black text-white shadow-xl">
          {stats.level}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-black text-white mb-1">Future Tech Architect</h2>
          <p className="text-slate-400 mb-4">Level {stats.level} Researcher</p>
          <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
            <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${(stats.xp / 1000) * 100}%` }}></div>
          </div>
          <div className="flex justify-between text-xs mt-2 font-bold text-slate-500">
            <span>{stats.xp} XP</span>
            <span>1000 XP TO LEVEL {stats.level + 1}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-center">
          <span className="text-slate-500 text-xs font-bold uppercase">Accuracy</span>
          <div className="text-3xl font-black text-white mt-1">{stats.accuracy}%</div>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-center">
          <span className="text-slate-500 text-xs font-bold uppercase">Streak</span>
          <div className="text-3xl font-black text-amber-400 mt-1">{stats.streak} Days</div>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-center">
          <span className="text-slate-500 text-xs font-bold uppercase">Modules</span>
          <div className="text-3xl font-black text-indigo-400 mt-1">{stats.questsCompleted}</div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-6">Achievement Badges</h3>
        <div className="flex flex-wrap gap-4">
          {stats.badges.map(b => (
            <div key={b} className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 text-sm font-bold flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              {b}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCareerPath = () => (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="text-center">
        <h2 className="text-4xl font-black text-white mb-4">Your AI Strategic Roadmap</h2>
        <p className="text-slate-400 text-lg">Tell us your passion, and we'll build your pathway to the tech workforce.</p>
      </div>

      <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-4">What are you passionate about?</h3>
        <p className="text-sm text-slate-500 mb-6">(e.g., Space Exploration, Video Games, Medicine, Climate Change)</p>
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-6 py-4 text-white focus:border-indigo-500 outline-none transition-colors"
            placeholder="I want to use AI for..."
          />
          <button 
            onClick={handleCreatePath} disabled={isGeneratingPath || !interestInput}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-8 py-4 rounded-xl text-white font-black shadow-lg shadow-indigo-600/20 transition-all"
          >
            {isGeneratingPath ? 'Strategizing...' : 'Generate Roadmap'}
          </button>
        </div>
      </div>

      {(generatedPath || progress.careerGoal) && (
        <div className="bg-slate-900 p-10 rounded-3xl border-2 border-indigo-500/50 shadow-2xl animate-in zoom-in duration-500">
          <div className="prose prose-invert max-w-none prose-indigo">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="text-2xl font-black text-white m-0">Personal Strategic Plan</h3>
            </div>
            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {generatedPath || progress.careerGoal}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <nav className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('Dashboard')}>
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-600/30 text-white">P</div>
            <div className="hidden md:block">
              <h1 className="text-xl font-black text-white leading-none">PyQuest</h1>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Master the AI Revolution</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8 font-bold text-sm">
            <button onClick={() => setView('Dashboard')} className={`${view === 'Dashboard' ? 'text-indigo-400' : 'text-slate-500 hover:text-white'} transition-colors`}>Curriculum</button>
            <button onClick={() => setView('CareerPath')} className={`${view === 'CareerPath' ? 'text-indigo-400' : 'text-slate-500 hover:text-white'} transition-colors`}>Career Path</button>
            <button onClick={() => setView('Profile')} className={`${view === 'Profile' ? 'text-indigo-400' : 'text-slate-500 hover:text-white'} transition-colors`}>My Stats</button>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="bg-slate-800 px-4 py-2 rounded-full border border-slate-700 flex items-center gap-2">
              <span className="text-xs text-slate-400">XP</span>
              <span className="text-indigo-400">{progress.experience}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {view === 'Dashboard' && renderDashboard()}
        {view === 'Quest' && renderQuestView()}
        {view === 'Profile' && renderProfile()}
        {view === 'CareerPath' && renderCareerPath()}
      </main>

      <footer className="border-t border-slate-800 py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-black text-xl text-white">P</div>
              <span className="text-2xl font-black text-white">PyQuest</span>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed">
              If you don't adapt to the AI revolution, you will get replaced in the job market by those who did. 
              Start your journey today and build the future.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Curriculum</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="hover:text-indigo-400 cursor-pointer">Python Basics</li>
              <li className="hover:text-indigo-400 cursor-pointer">Data Science Lab</li>
              <li className="hover:text-indigo-400 cursor-pointer">ML Foundations</li>
              <li className="hover:text-indigo-400 cursor-pointer">Neural Networks</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="hover:text-indigo-400 cursor-pointer">Community Guild</li>
              <li className="hover:text-indigo-400 cursor-pointer">AI Mentor Help</li>
              <li className="hover:text-indigo-400 cursor-pointer">Privacy Policy</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
