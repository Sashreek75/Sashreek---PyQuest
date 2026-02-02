
import React, { useState, useEffect, useRef } from 'react';
import { QUESTS } from '../constants';

interface LandingPageProps {
  onInitialize: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onInitialize }) => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [visibleNodes, setVisibleNodes] = useState<Set<string>>(new Set());
  const [activeCodeTab, setActiveCodeTab] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMove);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleNodes((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.15 }
    );

    const targets = document.querySelectorAll('.reveal-trigger');
    targets.forEach((t) => observer.observe(t));

    return () => targets.forEach((t) => observer.unobserve(t));
  }, []);

  // Modern, highly detailed Python Icon
  const PythonIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C10.7 2 9.5 2.1 8.4 2.3C5.9 2.7 4.6 4 4.2 6.5C3.8 9 3.8 10.5 4.2 13C4.6 15.5 5.9 16.8 8.4 17.2C9.5 17.4 10.7 17.5 12 17.5H12.1C13.4 17.5 14.6 17.4 15.7 17.2C18.2 16.8 19.5 15.5 19.9 13C20.3 10.5 20.3 9 19.9 6.5C19.5 4 18.2 2.7 15.7 2.3C14.6 2.1 13.4 2 12.1 2H12Z" fill="url(#py-grad-top)" />
      <path d="M12.1 22C13.4 22 14.6 21.9 15.7 21.7C18.2 21.3 19.5 20 19.9 17.5C20.3 15 20.3 13.5 19.9 11C19.5 8.5 18.2 7.2 15.7 6.8C14.6 6.6 13.4 6.5 12.1 6.5H12C10.7 6.5 9.5 6.6 8.4 6.8C5.9 7.2 4.6 8.5 4.2 11C3.8 13.5 3.8 15 4.2 17.5C4.6 20 5.9 21.3 8.4 21.7C9.5 21.9 10.7 22 12 22H12.1Z" fill="url(#py-grad-bot)" />
      <circle cx="8.5" cy="5" r="0.8" fill="white" fillOpacity="0.8" />
      <circle cx="15.5" cy="19" r="0.8" fill="white" fillOpacity="0.8" />
      <defs>
        <linearGradient id="py-grad-top" x1="4" y1="2" x2="20" y2="17.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3776AB" />
          <stop offset="1" stopColor="#2B5B84" />
        </linearGradient>
        <linearGradient id="py-grad-bot" x1="4" y1="6.5" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD43B" />
          <stop offset="1" stopColor="#FFE873" />
        </linearGradient>
      </defs>
    </svg>
  );

  const codeSnippets = [
    {
      title: "NumPy Vectorization",
      code: `import numpy as np\n\n# Vectorized Weight Update\ndef update_weights(w, x, y, lr):\n    # Replaces slow vanilla loops\n    # with optimized BLAS operations\n    grad = np.dot(x.T, (np.dot(x, w) - y))\n    return w - lr * grad`
    },
    {
      title: "Neural Architect",
      code: `from aura_core import Sequential, Dense\n\n# Dynamic Topology Generation\nmodel = Sequential([\n    Dense(512, act='relu', name='L1'),\n    Dense(256, act='relu', name='L2'),\n    Dense(1, act='sigmoid', name='OP')\n])\n\nmodel.audit() # Aura Integrity Check`
    },
    {
      title: "Data Pipeline",
      code: `import pandas as pd\n\n# High-Fidelity Preprocessing\ndf = pd.read_csv('telemetry.csv')\n\n# Auto-scale features via normalization\ndf['f1_scaled'] = (df['f1'] - df['f1'].mean()) / df['f1'].std()\n\nprint("Pipeline Active: Ready for Inference")`
    }
  ];

  return (
    <div className="min-h-screen bg-[#010208] text-white selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(79, 70, 229, 0.2) 0%, transparent 40%)` 
          }}
        ></div>
        <div className="absolute top-[-10%] left-[-10%] w-[1200px] h-[1200px] bg-indigo-600/5 rounded-full blur-[200px] animate-neural"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-violet-600/5 rounded-full blur-[180px] animate-neural" style={{ animationDelay: '5s' }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-[0.04]"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${scrollY > 60 ? 'bg-[#010208]/90 backdrop-blur-2xl border-b border-white/5 py-4 shadow-2xl' : 'py-8'}`}>
        <div className="max-w-[1440px] mx-auto px-10 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative">
              <div className="absolute -inset-2 bg-indigo-600/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-3xl transition-all group-hover:rotate-[15deg]">P</div>
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase text-white group-hover:text-indigo-400 transition-colors">PyQuest</span>
          </div>

          <div className="hidden lg:flex items-center gap-14 text-[11px] font-black uppercase tracking-[0.5em] text-slate-500">
            {['Philosophy', 'Roadmap', 'Architecture', 'Aura AI', 'ROI'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '-')}`} 
                className="hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-indigo-500 transition-all group-hover:w-full"></span>
              </a>
            ))}
            <button 
              onClick={onInitialize}
              className="px-10 py-3 bg-white text-black rounded-full font-black text-[12px] hover:bg-indigo-50 transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              INITIALIZE TRAINING
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[100vh] w-full flex flex-col items-center justify-center px-10 z-10 pt-20">
        <div className="max-w-7xl w-full text-center space-y-14 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="inline-flex items-center gap-5 px-8 py-3 rounded-full glass border border-white/10 shadow-3xl reveal-trigger" id="hero-badge">
            <PythonIcon className="w-6 h-6" />
            <div className="h-5 w-px bg-slate-800"></div>
            <span className="text-[12px] font-black uppercase tracking-[0.5em] text-indigo-400">Pure Python Machine Learning</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-7xl md:text-[11rem] font-black text-white tracking-tighter leading-[0.8] uppercase reveal-trigger" id="hero-title">
              Build the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-400 to-emerald-400 drop-shadow-2xl">Algorithm.</span>
            </h1>
          </div>

          <p className="text-2xl md:text-4xl text-slate-400 max-w-5xl mx-auto leading-tight font-medium reveal-trigger" id="hero-sub">
            Passive consumption is for spectators. <br />
            <span className="text-white">Become a Technical Architect.</span> <br /> 
            Master AI through 16 professional nodes built for the top 1%.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center pt-10 reveal-trigger" id="hero-cta">
            <button 
              onClick={onInitialize}
              className="group relative px-20 py-10 bg-white text-slate-950 rounded-[40px] font-black text-4xl shadow-3xl transition-all hover:scale-[1.05] active:scale-95 overflow-hidden"
            >
              <div className="relative z-10 flex items-center gap-6">
                <span>START TRAINING</span>
                <svg className="w-10 h-10 group-hover:translate-x-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </button>
            <button className="px-20 py-10 bg-slate-900/40 border border-slate-800 text-white rounded-[40px] font-black text-4xl backdrop-blur-md hover:bg-slate-800 transition-all active:scale-95 shadow-2xl">
              EXPLORE NODES
            </button>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="w-full py-60 px-10 relative z-10 overflow-hidden bg-[#020410]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-40 items-center">
          <div className="space-y-16 reveal-trigger" id="phi-text">
            <h2 className="text-7xl md:text-[9rem] font-black tracking-tighter text-white uppercase leading-[0.8]">The <br /> Dividend.</h2>
            <div className="space-y-20">
              {[
                { 
                  icon: '⚡', 
                  title: 'Computational Depth', 
                  text: 'Stop importing and start architecting. We reconstruct the math of backpropagation and optimizer mechanics from absolute zero.' 
                },
                { 
                  icon: '🛡️', 
                  title: 'Career Sovereignty', 
                  text: 'Skills are the only currency in the AI era. Master data engineering and neural design to ensure your seat at the head of the table.' 
                },
                { 
                  icon: '⚙️', 
                  title: 'Production Fidelity', 
                  text: 'Training a model is 5% of the battle. Learn to build inference pipelines, manage drift, and deploy with industrial-grade efficiency.' 
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-12 group">
                  <div className="w-24 h-24 rounded-[40px] bg-slate-900 border border-slate-800 flex-shrink-0 flex items-center justify-center text-5xl shadow-3xl transition-all group-hover:scale-110 group-hover:bg-indigo-600/10 group-hover:border-indigo-500/50">
                    {item.icon}
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-4xl font-black text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                    <p className="text-2xl text-slate-500 font-medium leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative reveal-trigger" id="phi-visual">
            <div className="absolute -inset-16 bg-indigo-600/10 rounded-full blur-[150px] animate-pulse"></div>
            <div className="relative bg-[#0b0e14] border border-slate-800 rounded-[80px] p-20 shadow-3xl backdrop-blur-3xl overflow-hidden group">
               <div className="space-y-12">
                  <div className="flex gap-4">
                    <div className="w-4 h-4 rounded-full bg-rose-500/30"></div>
                    <div className="w-4 h-4 rounded-full bg-amber-500/30"></div>
                    <div className="w-4 h-4 rounded-full bg-emerald-500/30"></div>
                  </div>
                  <h4 className="text-5xl font-black text-white uppercase leading-tight">Neural Logic <br /> Integrity Audit</h4>
                  <p className="text-2xl text-slate-400 font-medium">Every line of Python you write is audited in real-time by Aura, our proprietary evaluation kernel.</p>
                  
                  <div className="p-10 bg-[#010208] border border-slate-800 rounded-[48px] font-mono text-xl space-y-6">
                    <div className="flex justify-between items-center text-indigo-500 text-sm">
                      <span>ANALYZING_GRADIENTS</span>
                      <span className="animate-pulse">STABLE...</span>
                    </div>
                    <div className="text-slate-600">{'>>>'} weight_update = weight - (lr * gradient)</div>
                    <div className="text-slate-600">{'>>>'} convergence = np.linalg.norm(weight_update)</div>
                    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden mt-6">
                      <div className="h-full bg-indigo-500 w-[78%] animate-shimmer"></div>
                    </div>
                    <div className="text-emerald-400 font-black uppercase text-xs pt-4">Logic Verified: Convergence Detected [OK]</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="w-full py-60 px-10 relative z-10 border-y border-slate-900 bg-[#010208]">
        <div className="max-w-[1440px] mx-auto space-y-40">
          <div className="text-center space-y-10 reveal-trigger" id="road-header">
            <h2 className="text-8xl md:text-[11rem] font-black tracking-tighter text-white uppercase leading-none">The Path.</h2>
            <p className="text-3xl text-slate-500 font-medium max-w-5xl mx-auto leading-relaxed uppercase tracking-[0.3em]">
              16 high-fidelity nodes from Python primitives to self-attention mechanisms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {QUESTS.map((q, i) => (
              <div 
                key={q.id} 
                className={`group p-12 bg-[#070914] border border-slate-800/40 rounded-[64px] hover:border-indigo-500/40 transition-all hover:-translate-y-6 duration-700 shadow-3xl reveal-trigger ${visibleNodes.has(`node-${i}`) ? 'reveal-text' : 'opacity-0'}`} 
                id={`node-${i}`}
              >
                <div className="flex justify-between items-start mb-12">
                  <div className="text-[12px] font-black text-slate-700 uppercase tracking-[0.6em]">MISSION NODE {String(i + 1).padStart(2, '0')}</div>
                  <div className="w-12 h-12 rounded-[20px] border border-slate-800 flex items-center justify-center text-[12px] text-indigo-500 font-black group-hover:bg-indigo-600 group-hover:text-white transition-all">{i+1}</div>
                </div>
                <h3 className="text-3xl font-black text-white mb-6 group-hover:text-indigo-400 transition-colors leading-tight uppercase tracking-tight">{q.title}</h3>
                <p className="text-xl text-slate-500 leading-relaxed font-medium mb-12 line-clamp-3">{q.description}</p>
                <div className="flex flex-wrap gap-3 pt-10 border-t border-slate-800/50">
                  {q.topics.slice(0, 2).map(t => (
                    <span key={t} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-black text-slate-600 uppercase tracking-widest">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Massive Final Call to Action */}
      <section className="w-full py-80 px-10 text-center relative z-10 overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          <div className="relative bg-white rounded-[120px] p-60 shadow-[0_60px_120px_-20px_rgba(255,255,255,0.15)] overflow-hidden group reveal-trigger" id="final-cta">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-800 transition-opacity duration-1000 opacity-0 group-hover:opacity-100"></div>
            <div className="absolute top-0 right-0 w-[1400px] h-[1400px] bg-white opacity-5 rounded-full blur-[250px] -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 space-y-24">
              <h2 className="text-7xl md:text-[14rem] font-black text-slate-950 tracking-tighter uppercase leading-[0.7] group-hover:text-white transition-colors duration-700">
                Begin <br /> Ascension.
              </h2>
              <p className="text-4xl text-slate-600 font-medium max-w-5xl mx-auto leading-[1.3] group-hover:text-indigo-50 transition-colors duration-700">
                Join 10,000+ engineers architecting the future. Initialize your session and begin Node 01. No cost. No spectators. Just pure engineering.
              </p>
              <div className="pt-16">
                <button 
                  onClick={onInitialize}
                  className="px-36 py-16 bg-slate-950 text-white rounded-[60px] font-black text-6xl shadow-3xl hover:scale-[1.05] active:scale-95 transition-all uppercase tracking-tighter group-hover:bg-white group-hover:text-indigo-700 duration-700"
                >
                  LAUNCH PROTOCOL
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Massive Technical Footer */}
      <footer className="w-full py-60 bg-[#010208] relative z-10 border-t border-slate-900">
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-32 mb-40">
            <div className="space-y-12">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center font-black text-white text-3xl">P</div>
                <span className="text-4xl font-black tracking-tighter uppercase">PyQuest</span>
              </div>
              <p className="text-2xl text-slate-600 font-medium leading-relaxed max-w-sm">
                The world's leading technical training ground for the next generation of Machine Learning architects. Pure Python. Zero Fluff.
              </p>
            </div>
          </div>
          <div className="pt-32 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-16">
            <p className="text-[14px] font-black text-slate-800 uppercase tracking-[0.9em]">
              &copy; 2026 PYQUEST PLATFORMS INC. GLOBAL HQ. 9.5.0_STABLE_BUILD
            </p>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .shadow-3xl {
          box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.7);
        }
        .reveal-text {
          opacity: 0;
          transform: translateY(40px);
          animation: revealText 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes revealText {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-neural {
          animation: neural-drift 12s ease-in-out infinite;
        }
        @keyframes neural-drift {
            0%, 100% { opacity: 0.2; transform: scale(1) translate(0, 0); }
            50% { opacity: 0.4; transform: scale(1.1) translate(20px, -20px); }
        }
      ` }} />
    </div>
  );
};

export default LandingPage;
