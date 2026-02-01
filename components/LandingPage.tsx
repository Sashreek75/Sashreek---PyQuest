
import React, { useState, useEffect } from 'react';

interface LandingPageProps {
  onInitialize: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onInitialize }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden selection:bg-indigo-500/30">
      {/* Immersive Background Elements */}
      <div 
        className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out opacity-20"
        style={{ transform: `translate(${mousePos.x * 0.01}px, ${mousePos.y * 0.01}px)` }}
      >
        <div className="absolute top-[10%] left-[15%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px]" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      {/* Main Content Card */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl px-6 text-center">
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-sm mb-8">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Project-Based AI Academy</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8">
            Build Intelligence. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400">Not Just Syntax.</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium mb-12">
            PyQuest is the training ground for the next generation of machine learning engineers. 
            Solve real-world challenges with pure Python and industry-standard ML frameworks.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={onInitialize}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative px-12 py-6 bg-white text-slate-950 rounded-2xl font-black text-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 overflow-hidden"
            >
              <div className="relative z-10 flex items-center gap-3">
                <span>Launch Session</span>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className={`absolute inset-0 bg-indigo-50 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
            </button>
            <button 
              className="px-12 py-6 bg-slate-900/50 border border-slate-800 text-white rounded-2xl font-black text-2xl backdrop-blur-sm hover:bg-slate-800 transition-all active:scale-95"
            >
              Curriculum Map
            </button>
          </div>
        </div>

        {/* Floating Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full pt-12 border-t border-slate-800/50 animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
          {[
            { label: 'Active Quests', val: '16' },
            { label: 'AI Mentorship', val: '24/7' },
            { label: 'Tech Stack', val: 'Python' },
            { label: 'Community', val: '5k+' }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-3xl font-black text-white">{stat.val}</span>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative footer snippet */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-700 uppercase tracking-widest font-bold">
        Session Status: Ready for Initialization
      </div>
    </div>
  );
};

export default LandingPage;
