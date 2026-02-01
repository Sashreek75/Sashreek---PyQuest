
import React, { useState, useEffect, useRef } from 'react';
import { QUESTS } from './constants';

interface LandingPageProps {
  onInitialize: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onInitialize }) => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [visibleNodes, setVisibleNodes] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Intersection Observer for scroll-based reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleNodes((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
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

  return (
    <div ref={containerRef} className="min-h-screen bg-[#010208] text-white selection:bg-indigo-500/40 font-sans">
      {/* Background Neural Layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(79, 70, 229, 0.15) 0%, transparent 45%)` 
          }}
        ></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.03]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-indigo-600/5 rounded-full blur-[150px] animate-neural"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-violet-600/5 rounded-full blur-[130px] animate-neural" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Modern Navigation */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${scrollY > 60 ? 'bg-[#010208]/90 backdrop-blur-2xl border-b border-white/5 py-3' : 'py-8'}`}>
        <div className="max-w-[1400px] mx-auto px-10 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative">
              <div className="absolute -inset-2 bg-indigo-600/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-2xl transition-all group-hover:rotate-[15deg]">P</div>
            </div>
            <span className="text-xl font-black tracking-tighter uppercase group-hover:text-indigo-400 transition-colors">PyQuest</span>
          </div>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
            {['Philosophy', 'Roadmap', 'Architecture', 'AI Mentor'].map((item) => (
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
              className="px-8 py-2.5 bg-white text-black rounded-full font-black text-[11px] hover:bg-indigo-50 transition-all active:scale-95 shadow-xl shadow-white/5"
            >
              INITIALIZE TRAINING
            </button>
          </div>
        </div>
      </nav>

      {/* Hero: The Training Ground */}
      <section className="relative min-h-[95vh] w-full flex flex-col items-center justify-center px-8 z-10 pt-20">
        <div className="max-w-6xl w-full text-center space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-slate-900/50 border border-white/5 backdrop-blur-xl shadow-2xl reveal-trigger" id="hero-badge">
            <PythonIcon className="w-5 h-5" />
            <div className="h-4 w-px bg-slate-800"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Project-Based Engineering Protocol</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-7xl md:text-[9rem] font-black text-white tracking-tighter leading-[0.8] uppercase reveal-trigger" id="hero-title">
              Master the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-400 to-emerald-400">Intelligence.</span>
            </h1>
          </div>

          <p className="text-xl md:text-3xl text-slate-400 max-w-4xl mx-auto leading-relaxed font-medium reveal-trigger" id="hero-sub">
            The era of passive consumption is dead. <br />
            <span className="text-white">Become a technical architect.</span> Master Machine Learning through 16 professional quests built for the top 1%.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center pt-8 reveal-trigger" id="hero-cta">
            <button 
              onClick={onInitialize}
              className="group relative px-16 py-8 bg-white text-slate-950 rounded-[32px] font-black text-3xl shadow-3xl transition-all hover:scale-[1.03] active:scale-95 overflow-hidden"
            >
              <div className="relative z-10 flex items-center gap-4">
                <span>START TRAINING</span>
                <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </button>
            <button className="px-16 py-8 bg-slate-900/40 border border-slate-800 text-white rounded-[32px] font-black text-3xl backdrop-blur-md hover:bg-slate-800 transition-all active:scale-95 shadow-2xl">
              EXPLORE NODES
            </button>
          </div>
        </div>

        {/* Scroll Callout */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce opacity-20">
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">Deep Navigation</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* Authority Stats Ribbon */}
      <section className="w-full py-24 px-8 border-y border-slate-900 bg-slate-900/10 backdrop-blur-sm z-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {[
            { label: 'Modules', val: '16', sub: 'Fundamental to Transformers' },
            { label: 'Technical Accuracy', val: '100%', sub: 'Pure Python Implementation' },
            { label: 'Mentorship', val: '24/7', sub: 'Real-time Logic Auditing' },
            { label: 'Authority', val: '1%', sub: 'Elite Industry Placement' },
          ].map((s, i) => (
            <div key={i} className="space-y-2 reveal-trigger" id={`stat-${i}`}>
              <div className="text-6xl font-black text-white tracking-tighter">{s.val}</div>
              <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">{s.label}</div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Philosophy - The Deep Why */}
      <section id="philosophy" className="w-full py-48 px-8 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-12">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none reveal-trigger" id="phi-title">
              The <br /> Dividend.
            </h2>
            <div className="space-y-16">
              {[
                {
                  title: 'First Principles',
                  desc: 'We don’t just import libraries. We rebuild them. Understand the math of backpropagation and optimizer mechanics from the ground up.',
                  icon: '🧠',
                  color: 'indigo'
                },
                {
                  title: 'Applied Engineering',
                  desc: 'Machine learning is an engineering discipline. Every quest requires writing production-grade code that solves real-world constraints.',
                  icon: '⚙️',
                  color: 'emerald'
                },
                {
                  title: 'Neural Strategy',
                  desc: 'Guided by Aura AI, you will architect a roadmap that aligns with the highest-leverage opportunities in the 2026 AI landscape.',
                  icon: '🎯',
                  color: 'violet'
                }
              ].map((p, i) => (
                <div key={i} className="flex gap-10 group reveal-trigger" id={`phi-prop-${i}`}>
                  <div className={`w-20 h-20 rounded-[32px] bg-slate-900 border border-slate-800 flex-shrink-0 flex items-center justify-center text-4xl shadow-2xl transition-all group-hover:scale-110 group-hover:bg-indigo-600/10 group-hover:border-indigo-500/30`}>
                    {p.icon}
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-3xl font-black text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{p.title}</h4>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative reveal-trigger" id="phi-visual">
            <div className="absolute -inset-10 bg-indigo-600/10 rounded-[80px] blur-[100px] animate-pulse"></div>
            <div className="relative bg-[#0b0e14] border border-slate-800 rounded-[64px] p-16 shadow-3xl backdrop-blur-3xl overflow-hidden group">
               <div className="space-y-8">
                 <div className="flex gap-4">
                    <div className="w-4 h-4 rounded-full bg-rose-500/20"></div>
                    <div className="w-4 h-4 rounded-full bg-amber-500/20"></div>
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20"></div>
                 </div>
                 <h4 className="text-4xl font-black text-white uppercase leading-tight">Neural Logic <br /> Integrity Audit</h4>
                 <p className="text-xl text-slate-400 font-medium">Every line of Python you write is audited against tier-1 industry standards. Not just syntax, but mathematical logic.</p>
                 <div className="p-8 bg-[#010208] border border-slate-800 rounded-[40px] font-mono text-sm space-y-4">
                    <div className="text-indigo-500 uppercase text-[10px] font-black tracking-[0.4em] mb-2">Analyzing Tensor Operations...</div>
                    <div className="text-slate-600">>>> weight_update = weight - (learning_rate * gradient)</div>
                    <div className="text-slate-600">>>> loss_convergence = np.linalg.norm(weight_update)</div>
                    <div className="h-1 bg-slate-900 rounded-full overflow-hidden mt-4">
                       <div className="h-full bg-indigo-500 w-[72%] shimmer"></div>
                    </div>
                    <div className="text-emerald-400 font-black uppercase text-[10px] pt-4">Gradient Stability Verified [OK]</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Roadmap - The Path to Mastery */}
      <section id="roadmap" className="w-full py-48 px-8 bg-[#020410] z-10 relative">
        <div className="max-w-7xl mx-auto space-y-32">
          <div className="text-center space-y-8 reveal-trigger" id="road-head">
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter text-white uppercase leading-none">The Path.</h2>
            <p className="text-2xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed uppercase tracking-widest">
              From Python primitives to global-scale neural architectures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {QUESTS.map((q, i) => (
              <div 
                key={q.id} 
                className={`group p-10 bg-[#070914] border border-slate-800/40 rounded-[48px] hover:border-indigo-500/30 transition-all hover:-translate-y-4 duration-500 shadow-2xl reveal-trigger ${visibleNodes.has(`road-node-${i}`) ? 'reveal-text' : 'opacity-0'}`} 
                id={`road-node-${i}`}
              >
                <div className="flex justify-between items-start mb-10">
                  <div className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">NODE {String(i + 1).padStart(2, '0')}</div>
                  <div className="w-10 h-10 rounded-2xl border border-slate-800 flex items-center justify-center text-[10px] text-indigo-500 font-black group-hover:bg-indigo-600 group-hover:text-white transition-all">{i+1}</div>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-indigo-400 transition-colors leading-tight uppercase tracking-tight">{q.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium mb-10 line-clamp-3">{q.description}</p>
                <div className="flex flex-wrap gap-2 pt-8 border-t border-slate-800/50">
                  {q.topics.slice(0, 2).map(t => (
                    <span key={t} className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[9px] font-black text-slate-600 uppercase tracking-widest">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Architecture - High Performance Stack */}
      <section id="architecture" className="w-full py-48 px-8 relative z-10 border-y border-slate-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] -z-10"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="relative reveal-trigger" id="stack-visual">
            <div className="bg-[#0b0e14] border border-slate-800 rounded-[64px] overflow-hidden shadow-3xl">
              <div className="bg-slate-900 px-10 py-6 border-b border-slate-800 flex justify-between items-center">
                 <div className="flex gap-8">
                    {['Tensor Logic', 'Data Ingestion', 'Inference'].map((t, idx) => (
                      <button 
                        key={t} 
                        onClick={() => setActiveTab(idx)}
                        className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all pb-1 border-b-2 ${activeTab === idx ? 'text-indigo-400 border-indigo-400' : 'text-slate-600 border-transparent hover:text-white'}`}
                      >
                        {t}
                      </button>
                    ))}
                 </div>
                 <span className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">v9.4.0</span>
              </div>
              <div className="p-12 font-mono text-lg space-y-2 bg-[#010208] min-h-[400px]">
                {activeTab === 0 && (
                  <div className="text-slate-400 leading-relaxed animate-in fade-in slide-in-from-left duration-500">
                    <div className="text-violet-400">import</div> numpy <span className="text-violet-400">as</span> np<br/>
                    <div className="text-indigo-500 mt-4"># Vectorized training step</div>
                    <div className="mt-2">weights -= lr * (np.dot(X.T, (np.dot(X, weights) - y)) / n_samples)</div>
                    <div className="mt-4">accuracy = np.mean(predictions == y_true)</div>
                  </div>
                )}
                {activeTab === 1 && (
                  <div className="text-slate-400 leading-relaxed animate-in fade-in slide-in-from-left duration-500">
                    <div className="text-violet-400">import</div> pandas <span className="text-violet-400">as</span> pd<br/>
                    <div className="text-indigo-500 mt-4"># High-fidelity data cleansing</div>
                    <div className="mt-2">df = pd.read_csv(<span className="text-emerald-400">'telemetry.csv'</span>)</div>
                    <div>df = df.dropna().apply(lambda x: (x - x.mean()) / x.std())</div>
                  </div>
                )}
                {activeTab === 2 && (
                  <div className="text-slate-400 leading-relaxed animate-in fade-in slide-in-from-left duration-500">
                    <div className="text-violet-400">from</div> flask <span className="text-violet-400">import</span> Flask, request<br/>
                    <div className="text-indigo-500 mt-4"># Production-grade inference API</div>
                    <div className="mt-2">@app.route(<span className="text-emerald-400">'/predict'</span>, methods=[<span className="text-emerald-400">'POST'</span>])</div>
                    <div><span className="text-violet-400">def</span> predict():</div>
                    <div className="pl-6">result = model.forward(request.json[<span className="text-emerald-400">'data'</span>])</div>
                    <div className="pl-6">return {<span className="text-emerald-400">'output'</span>: result}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-12">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none reveal-trigger" id="stack-title">
              The <br /> Architecture.
            </h2>
            <p className="text-2xl text-slate-500 font-medium leading-relaxed reveal-trigger" id="stack-desc">
              PyQuest is built on the industry-standard stack used by the world's leading research labs. We focus on the <span className="text-white">Applied Science</span> of machine learning.
            </p>
            <div className="grid grid-cols-2 gap-12 pt-8 reveal-trigger" id="stack-features">
               {[
                 { name: 'Vectorization', desc: 'Optimize matrix logic for high-performance training.' },
                 { name: 'Normalization', desc: 'Control gradient flow in deep neural networks.' },
                 { name: 'Optimization', desc: 'Master Adam, RMSProp, and SGD mechanics.' },
                 { name: 'Fidelity', desc: 'Production-ready code verified by AI logic audits.' }
               ].map(f => (
                 <div key={f.name} className="space-y-2">
                    <h5 className="text-xl font-black text-white uppercase tracking-tight">{f.name}</h5>
                    <p className="text-lg text-slate-600 font-medium">{f.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section: Aura AI Mentor */}
      <section id="ai-mentor" className="w-full py-48 px-8 bg-[#010208] z-10 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[150px] -z-10 animate-neural"></div>
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-24">
          <div className="space-y-12 reveal-trigger" id="aura-head">
            <div className="w-48 h-48 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[56px] mx-auto flex items-center justify-center text-8xl shadow-3xl shadow-indigo-600/30 animate-float">🤖</div>
            <div className="space-y-6">
              <h2 className="text-7xl md:text-[10rem] font-black tracking-tighter text-white uppercase leading-none">Aura AI.</h2>
              <p className="text-3xl text-slate-500 font-medium max-w-5xl mx-auto leading-relaxed uppercase tracking-widest">
                Automated Underwriting & Reasoning Agent
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left w-full">
            {[
              { 
                label: 'Logical Audit', 
                text: '"Your matrix multiplication implementation is technically correct, but consider swapping for a dot product here to minimize memory overhead."', 
                icon: '💬', color: 'indigo'
              },
              { 
                label: 'Career Strategist', 
                text: '"Based on your 100% completion rate on the Transformer modules, you are statistically ready for Senior LLM Engineering positions."', 
                icon: '🎯', color: 'emerald'
              },
              { 
                label: 'Socratic Hinting', 
                text: '"If you normalize your input data to have zero mean and unit variance, what happens to the convergence speed of your loss function?"', 
                icon: '💡', color: 'amber'
              }
            ].map((box, i) => (
              <div key={i} className={`p-16 bg-[#070914] rounded-[64px] border border-slate-800 space-y-10 hover:border-indigo-500/30 transition-all duration-1000 reveal-trigger shadow-3xl relative overflow-hidden group`} id={`aura-card-${i}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 bg-slate-900 rounded-[24px] flex items-center justify-center text-3xl shadow-2xl transition-transform group-hover:rotate-12">{box.icon}</div>
                  <span className={`text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em]`}>{box.label}</span>
                </div>
                <p className="text-3xl text-slate-200 font-medium italic leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">"{box.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Call to Action */}
      <section className="w-full py-64 px-8 text-center relative z-10 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative bg-white rounded-[100px] p-40 shadow-[0_50px_100px_-20px_rgba(255,255,255,0.1)] overflow-hidden group reveal-trigger" id="final-cta">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-800 transition-opacity duration-1000 opacity-0 group-hover:opacity-100"></div>
            <div className="absolute top-0 right-0 w-[1200px] h-[1200px] bg-white opacity-5 rounded-full blur-[220px] -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 space-y-16">
              <h2 className="text-7xl md:text-[11rem] font-black text-slate-950 tracking-tighter uppercase leading-[0.8] group-hover:text-white transition-colors duration-700">
                Begin <br /> Ascension.
              </h2>
              <p className="text-3xl text-slate-600 font-medium max-w-4xl mx-auto leading-relaxed group-hover:text-indigo-50 transition-colors duration-700">
                Join 10,000+ engineers architecting the future. Initialize your session and begin Node 01. No cost. No spectators. Just pure engineering.
              </p>
              <div className="pt-12">
                <button 
                  onClick={onInitialize}
                  className="px-28 py-12 bg-slate-950 text-white rounded-[48px] font-black text-5xl shadow-3xl hover:scale-[1.05] active:scale-95 transition-all uppercase tracking-tighter group-hover:bg-white group-hover:text-indigo-700 duration-700"
                >
                  LAUNCH PROTOCOL
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-48 bg-[#010208] relative z-10 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24 mb-32">
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white text-2xl">P</div>
                <span className="text-3xl font-black tracking-tighter uppercase">PyQuest</span>
              </div>
              <p className="text-xl text-slate-600 font-medium leading-relaxed">
                The world’s leading training ground for the next generation of Machine Learning architects. Pure Python. Zero Fluff.
              </p>
            </div>
            {[
              { title: 'Protocol', links: ['Curriculum', 'Aura AI', 'Terminal', 'Security'] },
              { title: 'Authority', links: ['GitHub', 'Discord', 'Docs', 'Credentials'] },
              { title: 'Legal', links: ['Ethics', 'Privacy', 'Security Audit', 'Terms'] }
            ].map(col => (
              <div key={col.title} className="space-y-8">
                 <h5 className="text-[12px] font-black text-indigo-400 uppercase tracking-[0.6em]">{col.title}</h5>
                 <ul className="space-y-4">
                    {col.links.map(link => (
                      <li key={link}>
                        <a href="#" className="text-xl text-slate-500 hover:text-white transition-colors font-medium">{link}</a>
                      </li>
                    ))}
                 </ul>
              </div>
            ))}
          </div>
          <div className="pt-24 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-12">
            <p className="text-[12px] font-black text-slate-800 uppercase tracking-[0.8em]">
              &copy; 2026 PYQUEST PLATFORMS INC. GLOBAL HQ. 9.4.0_STABLE
            </p>
            <div className="flex gap-12 text-slate-800">
               <div className="w-8 h-8 hover:text-white transition-colors cursor-pointer flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
               </div>
               <div className="w-8 h-8 hover:text-white transition-colors cursor-pointer flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
