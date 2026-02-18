
import React, { useState, useEffect, useRef } from 'react';

interface LandingPageProps {
  onInitialize: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onInitialize }) => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const [bootStatus, setBootStatus] = useState<'INIT' | 'BREACH' | 'SYNC' | 'READY'>('INIT');
  const [activeTerm, setActiveTerm] = useState('0x00');

  const technicalTerms = [
    'PYTHON_CORE_SYNC', 'UI_WORKSPACE_READY', 'NEURAL_LINK_STABLE', 'AI_LOGIC_ACTIVE',
    'MATH_KERNELS_OK', 'ARCHITECT_MODE_ON', 'AURA_MENTOR_V3', 'UPLINK_COMPLETE'
  ];

  useEffect(() => {
    const runBoot = async () => {
      setBootStatus('BREACH');
      await new Promise(r => setTimeout(r, 400));
      
      setBootStatus('SYNC');
      let i = 0;
      const interval = setInterval(() => {
        setActiveTerm(technicalTerms[i % technicalTerms.length]);
        i++;
        if (i > 10) {
          clearInterval(interval);
          setBootStatus('READY');
        }
      }, 80);
    };
    runBoot();

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
            setVisibleElements((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.reveal-trigger').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [bootStatus]);

  const PythonIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C10.7 2 9.5 2.1 8.4 2.3C5.9 2.7 4.6 4 4.2 6.5C3.8 9 3.8 10.5 4.2 13C4.6 15.5 5.9 16.8 8.4 17.2C9.5 17.4 10.7 17.5 12 17.5H12.1C13.4 17.5 14.6 17.4 15.7 17.2C18.2 16.8 19.5 15.5 19.9 13C20.3 10.5 20.3 9 19.9 6.5C19.5 4 18.2 2.7 15.7 2.3C14.6 2.1 13.4 2 12.1 2H12Z" fill="white" />
      <path d="M12.1 22C13.4 22 14.6 21.9 15.7 21.7C18.2 21.3 19.5 20 19.9 17.5C20.3 15 20.3 13.5 19.9 11C19.5 8.5 18.2 7.2 15.7 6.8C14.6 6.6 13.4 6.5 12.1 6.5H12C10.7 6.5 9.5 6.6 8.4 6.8C5.9 7.2 4.6 8.5 4.2 11C3.8 13.5 3.8 15 4.2 17.5C4.6 20 5.9 21.3 8.4 21.7C9.5 21.9 10.7 22 12 22H12.1Z" fill="white" fillOpacity="0.4" />
    </svg>
  );

  const curriculumNodes = [
    { title: "Python Mastery", desc: "Master the logic that every AI engineer uses to build complex models.", icon: "🐍", status: "Foundations" },
    { title: "Smart Data Flow", desc: "Learn to process massive datasets to feed and train your intelligence engines.", icon: "📊", status: "Applied" },
    { title: "AI Decision Models", desc: "Build neural networks and the tech behind modern AI tools like ChatGPT.", icon: "✨", status: "Advanced" },
    { title: "Professional Launch", desc: "Deploy your models to the real world and build production-ready apps.", icon: "🚀", status: "Zenith" }
  ];

  if (bootStatus !== 'READY') {
    return (
      <div className="fixed inset-0 z-[2000] bg-black flex flex-col items-center justify-center overflow-hidden">
        <div className="relative z-10 flex flex-col items-center gap-12 text-center">
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 bg-white/5 border border-white/20 rounded-[32px] animate-[spin_3s_linear_infinite]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-7xl font-black italic tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">P</span>
            </div>
          </div>
          <div className="space-y-4">
             <div className="text-[11px] font-black text-white/40 uppercase tracking-[1em] ml-[1em] animate-pulse">Initializing Academy</div>
             <div className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">{activeTerm}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010208] text-white selection:bg-indigo-500/40 overflow-x-hidden relative animate-in zoom-in fade-in duration-1000">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            background: `radial-gradient(circle 1000px at ${mousePos.x}px ${mousePos.y}px, rgba(79, 70, 229, 0.15) 0%, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-[0.05]" />
        <div className="absolute top-[-20%] left-[-10%] w-[1600px] h-[1600px] bg-indigo-600/[0.04] rounded-full blur-[200px] animate-neural" />
      </div>

      <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${scrollY > 60 ? 'bg-black/95 backdrop-blur-3xl border-b border-white/5 py-5 shadow-2xl shadow-indigo-500/10' : 'py-12'}`}>
        <div className="max-w-[1700px] mx-auto px-12 flex items-center justify-between">
          <div className="flex items-center gap-6 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center font-black text-3xl shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-transform group-hover:scale-110 italic">P</div>
            <span className="text-2xl font-black tracking-tighter uppercase group-hover:text-indigo-400 transition-colors">PyQuest</span>
          </div>
          <div className="hidden lg:flex items-center gap-16 text-[11px] font-black uppercase tracking-[0.5em] text-slate-500">
            {['Curriculum', 'AI Mentoring', 'Career Strategy'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="hover:text-white transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full"></span>
              </a>
            ))}
            <button onClick={onInitialize} className="px-12 py-4 bg-white text-black rounded-full font-black text-[12px] hover:bg-indigo-50 transition-all active:scale-95 shadow-2xl">GET STARTED</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-12 z-10 pt-24">
        <div className="max-w-7xl w-full text-center space-y-16">
          <div className={`inline-flex items-center gap-6 px-10 py-4 rounded-full glass border border-white/10 shadow-3xl transition-all duration-1000 delay-100 ${visibleElements.has('hero-badge') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} reveal-trigger`} id="hero-badge">
            <PythonIcon className="w-8 h-8" />
            <div className="h-6 w-px bg-slate-800" />
            <span className="text-[13px] font-black uppercase tracking-[0.6em] text-indigo-400">Your Path to AI Mastery</span>
          </div>

          <div className={`space-y-12 transition-all duration-1000 delay-300 ${visibleElements.has('hero-title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} reveal-trigger`} id="hero-title">
            <h1 className="text-7xl md:text-9xl lg:text-[13rem] font-black text-white tracking-[0.02em] leading-[0.8] uppercase italic">
              Build the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-400 to-emerald-400 drop-shadow-2xl">Future.</span>
            </h1>
          </div>

          <p className={`text-2xl md:text-4xl text-slate-400 max-w-6xl mx-auto leading-tight font-medium transition-all duration-1000 delay-500 ${visibleElements.has('hero-sub') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} reveal-trigger`} id="hero-sub">
            Master the Python skills used by top AI companies. <br />
            <span className="text-white italic">Learn by building real-world projects</span> with personalized AI coaching.
          </p>

          <div className={`flex flex-col sm:flex-row gap-12 justify-center pt-12 transition-all duration-1000 delay-700 ${visibleElements.has('hero-cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} reveal-trigger`} id="hero-cta">
            <button onClick={onInitialize} className="group relative px-24 py-12 bg-white text-slate-950 rounded-[48px] font-black text-5xl shadow-[0_40px_100px_-20px_rgba(255,255,255,0.2)] transition-all hover:scale-[1.05] active:scale-95 overflow-hidden">
              <div className="relative z-10 flex items-center gap-8">
                <span>START LEARNING</span>
                <svg className="w-12 h-12 group-hover:translate-x-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </button>
            <button onClick={() => document.getElementById('curriculum')?.scrollIntoView({behavior:'smooth'})} className="px-24 py-12 bg-slate-900/40 border-2 border-slate-800 text-white rounded-[48px] font-black text-5xl backdrop-blur-3xl hover:bg-slate-800 hover:border-indigo-500/50 transition-all active:scale-95 shadow-2xl uppercase tracking-tighter italic">View Curriculum</button>
          </div>
        </div>
      </section>

      <section id="curriculum" className="w-full py-72 px-12 relative z-10 bg-[#010208]">
        <div className="max-w-[1600px] mx-auto space-y-64">
          <div className={`text-center space-y-14 transition-all duration-1000 ${visibleElements.has('cur-head') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} reveal-trigger`} id="cur-head">
            <h2 className="text-7xl md:text-[10rem] font-black tracking-tighter text-white uppercase leading-none italic">The Path.</h2>
            <p className="text-2xl lg:text-3xl text-slate-500 font-medium max-w-6xl mx-auto leading-relaxed uppercase tracking-[0.4em]">
              From Python basics to building production AI models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {curriculumNodes.map((c, i) => (
              <div key={i} className={`group p-16 bg-[#070914] border border-slate-800/40 rounded-[72px] hover:border-white/20 transition-all duration-700 shadow-3xl reveal-trigger ${visibleElements.has(`benchmark-${i}`) ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-20'}`} id={`benchmark-${i}`} style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="flex justify-between items-start mb-20">
                  <div className="text-6xl group-hover:scale-125 group-hover:rotate-[15deg] transition-all duration-500">{c.icon}</div>
                  <div className="px-5 py-2 bg-indigo-500/10 text-indigo-400 rounded-xl text-[11px] font-black uppercase tracking-widest border border-indigo-500/20">{c.status}</div>
                </div>
                <h3 className="text-4xl font-black text-white mb-8 uppercase tracking-tighter group-hover:text-indigo-400 transition-colors leading-none italic">{c.title}</h3>
                <p className="text-xl text-slate-500 leading-relaxed font-medium mb-16">{c.desc}</p>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-0 group-hover:w-full transition-all duration-1000 ease-out shadow-[0_0_15px_#fff]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ai-mentoring" className="w-full py-72 px-12 relative z-10 overflow-hidden bg-gradient-to-b from-transparent via-indigo-950/[0.05] to-transparent">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-48 items-center">
          <div className={`space-y-24 transition-all duration-1000 ${visibleElements.has('audit-text') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-32'} reveal-trigger`} id="audit-text">
            <h2 className="text-8xl lg:text-[11rem] font-black tracking-tighter text-white uppercase leading-[0.7] italic">AI Pair <br /> Mentor.</h2>
            <p className="text-3xl text-slate-400 leading-relaxed font-medium">
              Get real-time feedback from <span className="text-white italic">Aura</span>—our high-value AI mentor that coaches you toward professional software quality.
            </p>
            <div className="space-y-16">
              {[
                { title: 'Logic Accuracy Checks', desc: 'Real-time validation to ensure your code is mathematically sound and bug-free.' },
                { title: 'Performance Coaching', desc: 'Aura helps you optimize slow code into high-speed, professional operations.' },
                { title: 'Socratic Guidance', desc: 'Learn the "Why" behind AI, helping you grow from a coder into an architect.' }
              ].map((usp, idx) => (
                <div key={idx} className="flex gap-12 group">
                  <div className="w-16 h-16 bg-white text-black rounded-3xl flex items-center justify-center text-3xl font-black transition-transform group-hover:rotate-[15deg] shadow-xl italic">✓</div>
                  <div className="space-y-3">
                     <h4 className="text-3xl font-black text-white uppercase tracking-tight italic">{usp.title}</h4>
                     <p className="text-xl text-slate-500 font-medium leading-relaxed">{usp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`relative transition-all duration-1000 ${visibleElements.has('audit-visual') ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-75 translate-x-32'} reveal-trigger`} id="audit-visual">
            <div className="absolute -inset-24 bg-indigo-600/10 rounded-full blur-[200px] animate-pulse" />
            <div className="relative bg-[#0b0e14] border border-white/10 rounded-[80px] p-24 shadow-3xl backdrop-blur-3xl overflow-hidden group hover:border-indigo-500/30 transition-all duration-700">
               <div className="space-y-16">
                 <div className="flex gap-4">
                    <div className="w-5 h-5 rounded-full bg-rose-500/40"></div>
                    <div className="w-5 h-5 rounded-full bg-emerald-500/40"></div>
                 </div>
                 <h4 className="text-5xl font-black text-white uppercase tracking-tighter italic">Aura Review Feed</h4>
                 <div className="p-14 bg-[#010208] border border-white/5 rounded-[64px] font-mono text-2xl space-y-10 relative overflow-hidden">
                    <div className="text-indigo-500 text-xs font-black uppercase tracking-[0.5em] mb-4">SYSTEM_SYNCING</div>
                    <div className="text-slate-600">{'>>>'} # Building neural connections...</div>
                    <div className="text-slate-300">{'    '} return np.dot(x, w) + b</div>
                    <div className="mt-14 p-10 bg-emerald-500/10 border border-emerald-500/20 rounded-[40px] animate-in slide-in-from-top-4">
                      <div className="text-emerald-400 text-xs font-black uppercase tracking-widest mb-4">Aura Mentoring 💡</div>
                      <p className="text-lg text-emerald-200/80 leading-relaxed italic">"Great logic! This vector operation is much faster than a standard loop. You're thinking like an AI engineer."</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full py-56 bg-[#010208] relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-12 text-center space-y-32">
          <div className="flex flex-col items-center gap-12">
            <div className="w-24 h-24 bg-white text-black rounded-3xl flex items-center justify-center font-black text-5xl italic shadow-2xl">P</div>
            <p className="text-[14px] font-black text-slate-800 uppercase tracking-[1em]">
              &copy; 2026 PYQUEST ACADEMY — THE FUTURE OF AI ENGINEERING
            </p>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes neural-drift {
          0%, 100% { opacity: 0.2; transform: scale(1) translate(0, 0); }
          50% { opacity: 0.4; transform: scale(1.1) translate(30px, -30px); }
        }
        .animate-neural { animation: neural-drift 20s ease-in-out infinite; }
        .glass { background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(48px); }
        .shadow-3xl { box-shadow: 0 60px 140px -20px rgba(0,0,0,0.9); }
        .reveal-trigger { transition: all 1.2s cubic-bezier(0.19, 1, 0.22, 1); }
      ` }} />
    </div>
  );
};

export default LandingPage;
