
import React, { useState, useEffect } from 'react';
import { QUESTS } from '../constants';

interface LandingPageProps {
  onInitialize: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onInitialize }) => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMove);
    
    // Simple intersection observer for fading animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const targets = document.querySelectorAll('.fade-trigger');
    targets.forEach((el) => observer.observe(el));
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMove);
      observer.disconnect();
    };
  }, []);

  const PythonIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C10.7 2 9.5 2.1 8.4 2.3C5.9 2.7 4.6 4 4.2 6.5C3.8 9 3.8 10.5 4.2 13C4.6 15.5 5.9 16.8 8.4 17.2C9.5 17.4 10.7 17.5 12 17.5H12.1C13.4 17.5 14.6 17.4 15.7 17.2C18.2 16.8 19.5 15.5 19.9 13C20.3 10.5 20.3 9 19.9 6.5C19.5 4 18.2 2.7 15.7 2.3C14.6 2.1 13.4 2 12.1 2H12Z" fill="url(#py-grad-top)" />
      <path d="M12.1 22C13.4 22 14.6 21.9 15.7 21.7C18.2 21.3 19.5 20 19.9 17.5C20.3 15 20.3 13.5 19.9 11C19.5 8.5 18.2 7.2 15.7 6.8C14.6 6.6 13.4 6.5 12.1 6.5H12C10.7 6.5 9.5 6.6 8.4 6.8C5.9 7.2 4.6 8.5 4.2 11C3.8 13.5 3.8 15 4.2 17.5C4.6 20 5.9 21.3 8.4 21.7C9.5 21.9 10.7 22 12 22H12.1Z" fill="url(#py-grad-bot)" />
      <defs>
        <linearGradient id="py-grad-top" x1="4" y1="2" x2="20" y2="17.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="py-grad-bot" x1="4" y1="6.5" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );

  const architectureNodes = [
    { title: "Vector Primitives", desc: "Optimized math kernels for high-speed tensor operations.", icon: "⚡", status: "Core" },
    { title: "Recursive Logic", desc: "Differentiable skip-connections and modular flow-control.", icon: "🔗", status: "Applied" },
    { title: "Attention Kernels", desc: "Multi-head mechanism projections built from ground zero.", icon: "✨", status: "Advanced" },
    { title: "Industrial Ingress", desc: "Async data pipelines designed for industrial-scale inference.", icon: "🚢", status: "Master" }
  ];

  const isVisible = (id: string) => visibleElements.has(id);

  return (
    <div className="min-h-screen bg-[#010208] text-white selection:bg-indigo-500/40 overflow-x-hidden relative">
      {/* Background Layer with vibrant drift and mouse effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-40 transition-opacity duration-1000"
          style={{ 
            background: `radial-gradient(circle 800px at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.1) 0%, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] md:bg-[size:8rem_8rem] opacity-[0.05]" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-indigo-600/[0.08] rounded-full blur-[150px] animate-neural-drift" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-purple-600/[0.06] rounded-full blur-[120px] animate-neural-drift-delayed" />
        
        {/* Subtle Scanlines */}
        <div className="absolute inset-0 bg-[rgba(1,2,8,0.2)] mix-blend-multiply" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-1000 ${scrollY > 50 ? 'bg-black/80 backdrop-blur-2xl py-6 shadow-2xl border-b border-white/5' : 'py-12'}`}>
        <div className="max-w-[1700px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-5 group cursor-pointer animate-fade-in" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-[0_0_30px_rgba(79,102,241,0.4)] transition-transform group-hover:scale-110">P</div>
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase">PyQuest</span>
          </div>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 animate-fade-in delay-200">
            {['Architecture', 'Audit', 'Pathfinder'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full"></span>
              </a>
            ))}
            <button 
              onClick={onInitialize}
              className="px-8 py-3 bg-white text-black rounded-full font-black text-[11px] hover:bg-indigo-50 transition-all active:scale-95 shadow-xl"
            >
              LAUNCH
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Heavy Fading */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 md:px-12 z-10 pt-24 text-center">
        <div className={`max-w-7xl w-full space-y-12 transition-all duration-1000 delay-200 ${isVisible('hero-content') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} fade-trigger`} id="hero-content">
          <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-slate-900/40 backdrop-blur-3xl border border-white/10 shadow-2xl">
            <PythonIcon className="w-6 h-6" />
            <div className="h-5 w-px bg-slate-800" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400">APPLIED NEURAL INTELLIGENCE</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-white tracking-tighter leading-[0.85] uppercase italic">
            Build <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-400 to-pink-500">Your Dream.</span>
          </h1>

          <p className="text-xl md:text-3xl text-slate-400 max-w-4xl mx-auto leading-relaxed font-medium">
            Elevate your engineering. <br className="hidden md:block" />
            <span className="text-white">Master industrial-grade Python</span> through {QUESTS.length} deep benchmark challenges.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center pt-8">
            <button 
              onClick={onInitialize} 
              className="px-16 py-8 bg-indigo-600 text-white rounded-[32px] font-black text-2xl shadow-[0_30px_60px_-15px_rgba(79,102,241,0.5)] transition-all hover:scale-[1.05] active:scale-95 hover:bg-indigo-500"
            >
              START TRAINING
            </button>
            <button 
              onClick={() => document.getElementById('architecture')?.scrollIntoView({behavior:'smooth'})}
              className="px-16 py-8 bg-slate-900/40 border border-slate-700 text-white rounded-[32px] font-black text-2xl backdrop-blur-3xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl uppercase italic tracking-tighter"
            >
              The Repository
            </button>
          </div>
        </div>
      </section>

      {/* Architecture Grid with Staggered Fading */}
      <section id="architecture" className="w-full py-48 px-6 md:px-12 relative z-10 bg-gradient-to-b from-transparent to-[#020410]/50">
        <div className="max-w-[1600px] mx-auto space-y-32">
          <div className={`text-center space-y-6 transition-all duration-1000 ${isVisible('arch-title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} fade-trigger`} id="arch-title">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic">The Architecture.</h2>
            <p className="text-lg md:text-2xl text-slate-500 font-medium max-w-4xl mx-auto uppercase tracking-[0.4em]">
              Deep-dive technical evolution from math kernels to large-scale transformers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {architectureNodes.map((node, i) => (
              <div 
                key={i} 
                id={`arch-card-${i}`}
                className={`group p-12 bg-slate-900/40 border border-white/5 rounded-[56px] transition-all duration-1000 hover:border-indigo-500/40 shadow-3xl hover:-translate-y-4 fade-trigger ${isVisible(`arch-card-${i}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="flex justify-between items-start mb-16">
                  <div className="text-5xl group-hover:scale-125 transition-all duration-500">{node.icon}</div>
                  <div className="px-5 py-2 bg-indigo-500/10 text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest">{node.status}</div>
                </div>
                <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter italic">{node.title}</h3>
                <p className="text-lg text-slate-500 leading-relaxed font-medium mb-12">{node.desc}</p>
                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-0 group-hover:w-full transition-all duration-1000 ease-out" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audit Showcase Section */}
      <section id="audit" className="w-full py-48 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className={`space-y-16 transition-all duration-1000 ${isVisible('audit-text') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'} fade-trigger`} id="audit-text">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-[0.8]">Neural <br /> Audit.</h2>
            <p className="text-2xl text-slate-400 leading-relaxed font-medium">
              Validate structural mathematical integrity. Every kernel is audited by <span className="text-indigo-400">Aura</span> in real-time.
            </p>
            <div className="space-y-10">
              {[
                { title: 'Jacobian Integrity Scan', desc: 'Real-time gradient flow stability check for all logical kernels.' },
                { title: 'Vectorized Efficiency Audit', desc: 'Identifies non-performant Python loops for kernel optimization.' }
              ].map((usp, idx) => (
                <div key={idx} className="flex gap-8 group">
                  <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl font-black shadow-lg italic">✓</div>
                  <div className="space-y-2">
                     <h4 className="text-2xl font-black text-white uppercase tracking-tight italic">{usp.title}</h4>
                     <p className="text-lg text-slate-500 font-medium leading-relaxed">{usp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`relative transition-all duration-1000 ${isVisible('audit-visual') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} fade-trigger`} id="audit-visual">
            <div className="absolute -inset-24 bg-indigo-600/10 rounded-full blur-[150px] animate-pulse" />
            <div className="relative bg-[#0b0e14]/80 border border-white/10 rounded-[64px] p-16 shadow-3xl backdrop-blur-3xl overflow-hidden group hover:border-indigo-500/30 transition-all duration-700">
               <div className="space-y-12">
                 <div className="flex gap-4">
                    <div className="w-4 h-4 rounded-full bg-rose-500/40 animate-pulse"></div>
                    <div className="w-4 h-4 rounded-full bg-emerald-500/40 animate-pulse delay-75"></div>
                 </div>
                 <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Audit Protocol v9.5.3</h4>
                 <div className="p-10 bg-[#010208] border border-white/5 rounded-[40px] font-mono text-lg space-y-6 relative overflow-hidden">
                    <div className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.5em] mb-2">KERNEL_ACTIVE</div>
                    <div className="text-slate-600">{'>>>'} def backprop(self, error):</div>
                    <div className="text-slate-300">{'    '} return error * self.act_grad(self.z)</div>
                    <div className="mt-10 p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[32px] animate-in fade-in duration-1000">
                      <div className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-2">Verdict: Sound</div>
                      <p className="text-sm text-emerald-200/80">Jacobian product verified. Memory stride aligned with tensor layout.</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pathfinder Section */}
      <section id="pathfinder" className="w-full py-48 px-6 md:px-12 relative z-10 bg-[#020410]/80">
        <div className="max-w-[1600px] mx-auto text-center space-y-32">
          <div className={`space-y-10 transition-all duration-1000 ${isVisible('path-head') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} fade-trigger`} id="path-head">
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-white uppercase italic">Pathfinder.</h2>
            <p className="text-xl md:text-3xl text-slate-500 font-medium max-w-5xl mx-auto uppercase tracking-widest leading-relaxed">
              Synthesize your specialized tech-tree in real-time.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
             {['Quant Researcher', 'Neural Architect', 'Inference Lead', 'Robotics Architect'].map((role, i) => (
               <div 
                 key={i} 
                 id={`path-card-${i}`}
                 className={`p-12 bg-slate-900/40 border border-white/5 rounded-[48px] transition-all duration-1000 hover:bg-white hover:text-black cursor-pointer shadow-3xl hover:-translate-y-6 fade-trigger ${isVisible(`path-card-${i}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                 style={{ transitionDelay: `${i * 100}ms` }}
               >
                 <div className="text-slate-600 group-hover:text-black/40 text-[10px] font-black uppercase tracking-[0.6em] mb-8">Target Profile</div>
                 <div className="text-3xl font-black text-white group-hover:text-black uppercase tracking-tighter italic">{role}</div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action - Massive Fading */}
      <section className="w-full py-60 px-6 md:px-12 text-center relative z-10">
        <div className={`max-w-[1600px] mx-auto transition-all duration-1000 ${isVisible('final-cta') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} fade-trigger`} id="final-cta">
          <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[80px] md:rounded-[120px] p-24 md:p-64 shadow-[0_40px_100px_-20px_rgba(79,102,241,0.4)] overflow-hidden group">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-1000"></div>
            <div className="relative z-10 space-y-16">
              <h2 className="text-6xl md:text-[12rem] font-black text-white tracking-tighter uppercase italic leading-[0.7]">
                Initialize <br /> Now.
              </h2>
              <p className="text-2xl text-indigo-100 font-medium max-w-4xl mx-auto leading-relaxed">
                Join 10,000+ technical architects engineering the future of intelligence. Pure Python. Zero fluff.
              </p>
              <div className="pt-12">
                <button 
                  onClick={onInitialize}
                  className="px-24 py-12 bg-white text-indigo-700 rounded-[48px] font-black text-4xl shadow-3xl hover:scale-[1.05] active:scale-95 transition-all uppercase tracking-tighter italic"
                >
                  Enter Academy
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-40 bg-[#010208] relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center space-y-16">
          <div className="flex flex-col items-center gap-8">
            <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center font-black text-4xl italic shadow-2xl">P</div>
            <p className="text-[12px] font-black text-slate-800 uppercase tracking-[1em]">
              &copy; 2026 PYQUEST PLATFORMS INC. STABLE_VIRTUAL_ENV
            </p>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes neural-drift {
          0%, 100% { transform: scale(1) translate(0, 0) rotate(0deg); opacity: 0.08; }
          33% { transform: scale(1.1) translate(40px, -40px) rotate(1deg); opacity: 0.12; }
          66% { transform: scale(0.95) translate(-30px, 20px) rotate(-1deg); opacity: 0.1; }
        }
        .animate-neural-drift { animation: neural-drift 30s ease-in-out infinite; }
        .animate-neural-drift-delayed { animation: neural-drift 35s ease-in-out infinite; animation-delay: -5s; }
        
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0,0,0,0.8); }

        /* Animation Classes */
        .animate-fade-in {
          animation: fade-in 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .delay-200 { animation-delay: 0.2s; }
      ` }} />
    </div>
  );
};

export default LandingPage;
