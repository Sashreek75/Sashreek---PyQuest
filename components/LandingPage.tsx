
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
    
    // Intersection Observer for staggered fade-in animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const targets = document.querySelectorAll('.reveal-trigger');
    targets.forEach((el) => observer.observe(el));
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMove);
      observer.disconnect();
    };
  }, []);

  const isVisible = (id: string) => visibleElements.has(id);

  const PythonIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C10.7 2 9.5 2.1 8.4 2.3C5.9 2.7 4.6 4 4.2 6.5C3.8 9 3.8 10.5 4.2 13C4.6 15.5 5.9 16.8 8.4 17.2C9.5 17.4 10.7 17.5 12 17.5H12.1C13.4 17.5 14.6 17.4 15.7 17.2C18.2 16.8 19.5 15.5 19.9 13C20.3 10.5 20.3 9 19.9 6.5C19.5 4 18.2 2.7 15.7 2.3C14.6 2.1 13.4 2 12.1 2H12Z" fill="white" />
      <path d="M12.1 22C13.4 22 14.6 21.9 15.7 21.7C18.2 21.3 19.5 20 19.9 17.5C20.3 15 20.3 13.5 19.9 11C19.5 8.5 18.2 7.2 15.7 6.8C14.6 6.6 13.4 6.5 12.1 6.5H12C10.7 6.5 9.5 6.6 8.4 6.8C5.9 7.2 4.6 8.5 4.2 11C3.8 13.5 3.8 15 4.2 17.5C4.6 20 5.9 21.3 8.4 21.7C9.5 21.9 10.7 22 12 22H12.1Z" fill="white" fillOpacity="0.4" />
    </svg>
  );

  const architectureNodes = [
    { title: "Vector Primitives", desc: "Crafting optimized math kernels for high-speed tensor operations.", icon: "⚡", status: "Core" },
    { title: "Recursive Logic", desc: "Architecting differentiable skip-connections and flow-control.", icon: "🔗", status: "Applied" },
    { title: "Attention Kernels", desc: "Building multi-head mechanism projections from ground zero.", icon: "✨", status: "Advanced" },
    { title: "Industrial Ingress", desc: "Design high-throughput async data pipelines for industrial inference.", icon: "🚢", status: "Master" }
  ];

  return (
    <div className="min-h-screen bg-[#010208] text-white selection:bg-indigo-500/40 overflow-x-hidden relative">
      {/* Background Layer with smooth drifting effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-40 transition-opacity duration-1000"
          style={{ 
            background: `radial-gradient(circle 800px at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.08) 0%, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] md:bg-[size:8rem_8rem] opacity-[0.05]" />
        
        {/* Large Soft Glowing Orbs */}
        <div className="absolute top-[-15%] left-[-15%] w-[1500px] h-[1500px] bg-indigo-600/[0.05] rounded-full blur-[200px] animate-soft-drift" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[1200px] h-[1200px] bg-purple-600/[0.04] rounded-full blur-[180px] animate-soft-drift-delayed" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${scrollY > 50 ? 'bg-black/80 backdrop-blur-2xl py-6 shadow-2xl border-b border-white/5' : 'py-10'}`}>
        <div className="max-w-[1700px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl transition-transform group-hover:scale-110">P</div>
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase">PyQuest</span>
          </div>

          <div className="hidden lg:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">
            {['Architecture', 'Audit', 'Pathfinder'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full"></span>
              </a>
            ))}
            <button 
              onClick={onInitialize}
              className="px-10 py-4 bg-indigo-600 text-white rounded-full font-black text-[11px] hover:bg-white hover:text-black transition-all active:scale-95 shadow-xl"
            >
              LAUNCH ACADEMY
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 md:px-12 z-10 pt-24 text-center">
        <div className={`max-w-7xl w-full space-y-12 transition-all duration-1000 ${isVisible('hero-content') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} reveal-trigger`} id="hero-content">
          <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-slate-900/40 backdrop-blur-3xl border border-white/10 shadow-2xl">
            <PythonIcon className="w-6 h-6" />
            <div className="h-5 w-px bg-slate-800" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400">Applied Neural Intelligence</span>
          </div>

          <h1 className="text-6xl md:text-9xl lg:text-[11rem] font-black text-white tracking-tighter leading-[0.8] uppercase">
            Assemble<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-400 to-pink-500">Your Dream.</span>
          </h1>

          <p className="text-xl md:text-3xl text-slate-400 max-w-4xl mx-auto leading-relaxed font-bold uppercase tracking-tight">
            Elevate your engineering status. <br className="hidden md:block" />
            <span className="text-white">Master industrial-grade Python engineering</span> through {QUESTS.length} deep technical benchmarks.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center pt-8">
            <button 
              onClick={onInitialize} 
              className="px-16 py-8 bg-white text-black rounded-[32px] font-black text-2xl shadow-[0_30px_60px_-15px_rgba(255,255,255,0.2)] transition-all hover:scale-[1.05] active:scale-95 hover:bg-indigo-50 uppercase tracking-tighter"
            >
              START TRAINING
            </button>
            <button 
              onClick={() => document.getElementById('architecture')?.scrollIntoView({behavior:'smooth'})}
              className="px-16 py-8 bg-slate-900/40 border border-slate-700 text-white rounded-[32px] font-black text-2xl backdrop-blur-3xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl uppercase tracking-tighter"
            >
              The Repository
            </button>
          </div>
        </div>
      </section>

      {/* Architecture Grid */}
      <section id="architecture" className="w-full py-64 px-6 md:px-12 relative z-10 bg-gradient-to-b from-transparent to-[#020410]/80">
        <div className="max-w-[1600px] mx-auto space-y-32">
          <div className={`text-center space-y-8 transition-all duration-1000 ${isVisible('arch-title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} reveal-trigger`} id="arch-title">
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-white uppercase leading-none">The Architecture.</h2>
            <p className="text-lg md:text-2xl text-slate-500 font-bold max-w-4xl mx-auto uppercase tracking-[0.4em] leading-relaxed">
              Proprietary evolution nodes optimized for industrial machine intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {architectureNodes.map((node, i) => (
              <div 
                key={i} 
                id={`arch-card-${i}`}
                className={`group p-12 bg-slate-900/40 border border-white/5 rounded-[56px] transition-all duration-1000 hover:border-indigo-500/40 shadow-3xl hover:-translate-y-4 reveal-trigger ${isVisible(`arch-card-${i}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="flex justify-between items-start mb-16">
                  <div className="text-5xl group-hover:scale-125 transition-all duration-500">{node.icon}</div>
                  <div className="px-5 py-2 bg-indigo-500/10 text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest">{node.status}</div>
                </div>
                <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter leading-none">{node.title}</h3>
                <p className="text-lg text-slate-500 leading-relaxed font-bold mb-12 uppercase tracking-tight">{node.desc}</p>
                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-0 group-hover:w-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audit Showcase Section */}
      <section id="audit" className="w-full py-64 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className={`space-y-16 transition-all duration-1000 ${isVisible('audit-text') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'} reveal-trigger`} id="audit-text">
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-white uppercase leading-[0.8]">Neural <br /> Audit.</h2>
            <p className="text-2xl text-slate-400 leading-relaxed font-bold uppercase tracking-tight">
              Validate structural mathematical integrity. Every kernel authored on PyQuest is audited by <span className="text-indigo-400">Aura</span> in real-time.
            </p>
            <div className="space-y-12">
              {[
                { title: 'Jacobian Integrity Scan', desc: 'Real-time gradient flow stability check for all logical kernels.' },
                { title: 'Vectorized Efficiency Audit', desc: 'Identifies non-performant Python loops for kernel optimization.' }
              ].map((usp, idx) => (
                <div key={idx} className="flex gap-8 group">
                  <div className="w-16 h-16 bg-white text-black rounded-3xl flex-shrink-0 flex items-center justify-center text-3xl font-black shadow-2xl transition-transform group-hover:scale-110">✓</div>
                  <div className="space-y-3">
                     <h4 className="text-2xl font-black text-white uppercase tracking-tight">{usp.title}</h4>
                     <p className="text-lg text-slate-500 font-bold uppercase tracking-widest opacity-60 leading-relaxed">{usp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`relative transition-all duration-1000 ${isVisible('audit-visual') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} reveal-trigger`} id="audit-visual">
            <div className="absolute -inset-24 bg-indigo-600/10 rounded-full blur-[150px] animate-pulse" />
            <div className="relative bg-[#0b0e14]/80 border border-white/10 rounded-[64px] p-16 shadow-3xl backdrop-blur-3xl overflow-hidden group hover:border-indigo-500/30 transition-all duration-700">
               <div className="space-y-12">
                 <div className="flex gap-4">
                    <div className="w-4 h-4 rounded-full bg-rose-500/40 animate-pulse"></div>
                    <div className="w-4 h-4 rounded-full bg-emerald-500/40 animate-pulse delay-75"></div>
                 </div>
                 <h4 className="text-3xl font-black text-white uppercase tracking-tighter">Audit Protocol v9.5.3</h4>
                 <div className="p-10 bg-[#010208] border border-white/5 rounded-[40px] font-mono text-lg space-y-6 relative overflow-hidden">
                    <div className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.5em] mb-2">KERNEL_ACTIVE</div>
                    <div className="text-slate-600">{'>>>'} def backprop(self, error):</div>
                    <div className="text-slate-300">{'    '} return error * self.act_grad(self.z)</div>
                    <div className="mt-10 p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[32px] animate-in fade-in duration-1000">
                      <div className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-2">Verdict: Sound</div>
                      <p className="text-sm text-emerald-200/80 leading-relaxed uppercase font-bold tracking-widest">Jacobian product verified. Memory stride aligned with tensor layout.</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pathfinder Section */}
      <section id="pathfinder" className="w-full py-64 px-6 md:px-12 relative z-10 bg-[#020410]">
        <div className="max-w-[1600px] mx-auto text-center space-y-48">
          <div className={`space-y-14 transition-all duration-1000 ${isVisible('path-head') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} reveal-trigger`} id="path-head">
            <h2 className="text-6xl md:text-[11rem] font-black tracking-tighter text-white uppercase leading-none">The Pathfinder.</h2>
            <p className="text-2xl text-slate-500 font-bold max-w-5xl mx-auto uppercase tracking-widest leading-relaxed">
              Define your objective and PyQuest synthesizes your tech-tree in real-time.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
             {['Quant Researcher', 'Neural Architect', 'Inference Lead', 'Robotics Architect'].map((role, i) => (
               <div 
                 key={i} 
                 id={`path-card-${i}`}
                 className={`p-16 bg-[#0b0e14]/80 border border-white/5 rounded-[64px] hover:bg-white hover:text-black transition-all cursor-pointer group shadow-3xl hover:-translate-y-6 reveal-trigger ${isVisible(`path-card-${i}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                 style={{ transitionDelay: `${i * 100}ms` }}
               >
                 <div className="text-slate-700 group-hover:text-black/40 text-[11px] font-black uppercase tracking-[0.6em] mb-10">Target Profile</div>
                 <div className="text-4xl font-black text-white group-hover:text-black uppercase tracking-tighter">{role}</div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="w-full py-80 px-6 md:px-12 text-center relative z-10">
        <div className={`max-w-[1600px] mx-auto transition-all duration-1000 ${isVisible('final-cta') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} reveal-trigger`} id="final-cta">
          <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[80px] md:rounded-[120px] p-24 md:p-64 shadow-[0_40px_100px_-20px_rgba(79,102,241,0.4)] overflow-hidden group">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-1000"></div>
            <div className="relative z-10 space-y-20">
              <h2 className="text-6xl md:text-[12rem] font-black text-white tracking-tighter uppercase leading-[0.7]">
                Initialize <br /> Now.
              </h2>
              <p className="text-2xl md:text-3xl text-indigo-100 font-bold max-w-5xl mx-auto leading-relaxed uppercase tracking-widest">
                Join 10,000+ technical architects engineering the future of intelligence. Pure Python. Zero fluff.
              </p>
              <div className="pt-24">
                <button 
                  onClick={onInitialize}
                  className="px-24 py-12 bg-white text-indigo-700 rounded-[48px] font-black text-4xl shadow-3xl hover:scale-[1.05] active:scale-95 transition-all uppercase tracking-tighter"
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
          <div className="flex flex-col items-center gap-12">
            <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center font-black text-5xl shadow-2xl">P</div>
            <p className="text-[12px] font-black text-slate-800 uppercase tracking-[1em]">
              &copy; 2026 PYQUEST PLATFORMS INC. STABLE_VIRTUAL_ENV_REBUILT
            </p>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes soft-drift {
          0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.05; }
          50% { transform: scale(1.1) translate(40px, -40px); opacity: 0.08; }
        }
        .animate-soft-drift { animation: soft-drift 20s ease-in-out infinite; }
        .animate-soft-drift-delayed { animation: soft-drift 25s ease-in-out infinite; animation-delay: -5s; }
        
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0,0,0,0.8); }

        .reveal-trigger { 
          transition: all 1s cubic-bezier(0.19, 1, 0.22, 1); 
        }
      ` }} />
    </div>
  );
};

export default LandingPage;
