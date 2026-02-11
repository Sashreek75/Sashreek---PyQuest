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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, speed: number}>>([]);
  const [cursorTrail, setCursorTrail] = useState<Array<{x: number, y: number, id: number}>>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate particles for background
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.1
    }));
    setParticles(newParticles);
  }, []);

  // Animated particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId: number;
    let particlePositions = particles.map(p => ({ ...p, currentY: p.y }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlePositions.forEach(p => {
        p.currentY = (p.currentY + p.speed * 0.05) % 100;
        
        const x = (p.x / 100) * canvas.width;
        const y = (p.currentY / 100) * canvas.height;
        
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${0.1 + Math.sin(Date.now() * 0.001 + p.id) * 0.1})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [particles]);

  // Enhanced scroll handling
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (window.scrollY > 100) {
        setShowOnboarding(false);
      }
    };
    
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Cursor trail effect
      setCursorTrail(prev => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: Date.now() }].slice(-10);
        return newTrail;
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMove);
    };
  }, []);

  // Intersection Observer for reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleNodes((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const targets = document.querySelectorAll('.reveal-trigger');
    targets.forEach((t) => observer.observe(t));

    return () => targets.forEach((t) => observer.unobserve(t));
  }, []);

  // Onboarding sequence
  useEffect(() => {
    if (!showOnboarding) return;
    
    const timer = setTimeout(() => {
      if (onboardingStep < 3) {
        setOnboardingStep(prev => prev + 1);
      } else {
        setShowOnboarding(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onboardingStep, showOnboarding]);

  // Auto-cycle code snippets
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCodeTab((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen bg-[#010208] text-white selection:bg-indigo-500/30 overflow-x-hidden relative">
      {/* Animated Canvas Background */}
      <canvas 
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />

      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Dynamic gradient following mouse */}
        <div 
          className="absolute inset-0 opacity-30 transition-opacity duration-700"
          style={{ 
            background: `radial-gradient(circle 800px at ${mousePos.x}px ${mousePos.y}px, rgba(79, 70, 229, 0.15) 0%, transparent 50%)`,
          }}
        />
        
        {/* Animated orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] md:w-[1200px] md:h-[1200px] bg-indigo-600/5 rounded-full blur-[120px] md:blur-[200px] animate-neural" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] md:w-[1000px] md:h-[1000px] bg-violet-600/5 rounded-full blur-[100px] md:blur-[180px] animate-neural-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-emerald-600/3 rounded-full blur-[150px] animate-neural-slow" />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] md:bg-[size:5rem_5rem] opacity-[0.03]" />
        
        {/* Scanline effect */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] opacity-10 animate-scanline" />
      </div>

      {/* Cursor trail effect (desktop only) */}
      <div className="hidden md:block fixed inset-0 pointer-events-none z-50">
        {cursorTrail.map((point, i) => (
          <div
            key={point.id}
            className="absolute w-2 h-2 bg-indigo-500 rounded-full"
            style={{
              left: point.x,
              top: point.y,
              opacity: (i + 1) / cursorTrail.length * 0.3,
              transform: `scale(${(i + 1) / cursorTrail.length})`,
              transition: 'all 0.3s ease-out'
            }}
          />
        ))}
      </div>

      {/* Onboarding Overlay */}
      {showOnboarding && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-center justify-center animate-fade-in">
          <div className="text-center space-y-8 px-6 max-w-2xl">
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-indigo-600/20 blur-3xl rounded-full animate-pulse" />
              <PythonIcon className="w-20 h-20 md:w-32 md:h-32 relative animate-float" />
            </div>
            
            <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              {onboardingStep >= 0 && (
                <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tight">
                  {onboardingStep === 0 && "Initializing Neural Core"}
                  {onboardingStep === 1 && "Loading Architecture"}
                  {onboardingStep === 2 && "Compiling Knowledge Graph"}
                  {onboardingStep === 3 && "System Ready"}
                </h2>
              )}
              
              {onboardingStep >= 1 && (
                <p className="text-lg md:text-2xl text-indigo-300">
                  {onboardingStep === 1 && "Establishing protocol connections..."}
                  {onboardingStep === 2 && "Indexing 16 training nodes..."}
                  {onboardingStep === 3 && "Welcome to PyQuest"}
                </p>
              )}
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-md mx-auto h-1 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out"
                style={{ width: `${(onboardingStep + 1) * 25}%` }}
              />
            </div>

            {onboardingStep === 3 && (
              <button
                onClick={() => setShowOnboarding(false)}
                className="mt-8 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-indigo-50 transition-all active:scale-95 animate-bounce-in"
              >
                Enter Platform
              </button>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Navigation */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        scrollY > 60 
          ? 'bg-[#010208]/95 backdrop-blur-2xl border-b border-white/5 py-3 md:py-4 shadow-2xl shadow-indigo-950/50' 
          : 'py-4 md:py-8'
      }`}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 md:gap-4 group cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-indigo-600/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-xl md:text-2xl text-white shadow-2xl transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110">
                P
              </div>
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase text-white group-hover:text-indigo-400 transition-colors duration-300">
              PyQuest
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-14 text-[10px] xl:text-[11px] font-black uppercase tracking-[0.3em] xl:tracking-[0.5em] text-slate-500">
            {['Philosophy', 'Roadmap', 'Architecture', 'Launch'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '-')}`} 
                className="hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-indigo-500 transition-all group-hover:w-full" />
              </a>
            ))}
            <button 
              onClick={onInitialize}
              className="px-6 xl:px-10 py-2 xl:py-3 bg-white text-black rounded-full font-black text-[11px] xl:text-[12px] hover:bg-indigo-50 transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
            >
              START NOW
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 group"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-[#010208]/98 backdrop-blur-2xl border-b border-white/5 animate-slide-down">
            <div className="px-6 py-8 space-y-6">
              {['Philosophy', 'Roadmap', 'Architecture', 'Launch'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="block text-lg font-black text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button 
                onClick={() => {
                  onInitialize();
                  setMobileMenuOpen(false);
                }}
                className="w-full px-8 py-4 bg-white text-black rounded-full font-black text-base hover:bg-indigo-50 transition-all active:scale-95"
              >
                INITIALIZE TRAINING
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 md:px-10 z-10 pt-24 md:pt-20"
      >
        <div className="max-w-7xl w-full text-center space-y-8 md:space-y-14">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-3 md:gap-5 px-4 md:px-8 py-2 md:py-3 rounded-full glass border border-white/10 shadow-2xl reveal-trigger animate-fade-in-up" 
            id="hero-badge"
            style={{ animationDelay: '0.2s' }}
          >
            <PythonIcon className="w-5 h-5 md:w-6 md:h-6 animate-pulse-slow" />
            <div className="h-4 md:h-5 w-px bg-slate-800" />
            <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-indigo-400">
              Pure Python ML
            </span>
          </div>

          {/* Main Heading */}
          <div 
            className="space-y-4 md:space-y-6 reveal-trigger animate-fade-in-up" 
            id="hero-title"
            style={{ animationDelay: '0.4s' }}
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[11rem] font-black text-white tracking-tighter leading-[0.85] uppercase">
              Build the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-400 to-emerald-400 drop-shadow-2xl animate-gradient">
                Algorithm.
              </span>
            </h1>
          </div>

          {/* Subheading */}
          <p 
            className="text-base sm:text-xl md:text-3xl lg:text-4xl text-slate-400 max-w-5xl mx-auto leading-tight font-medium reveal-trigger animate-fade-in-up px-4" 
            id="hero-sub"
            style={{ animationDelay: '0.6s' }}
          >
            Passive consumption is for spectators. <br />
            <span className="text-white">Become a Technical Architect.</span> <br className="hidden md:block" /> 
            Master AI through 16 nodes built for the top 1%.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center pt-6 md:pt-10 reveal-trigger animate-fade-in-up px-4" 
            id="hero-cta"
            style={{ animationDelay: '0.8s' }}
          >
            <button 
              onClick={onInitialize}
              className="group relative px-8 sm:px-12 md:px-20 py-5 md:py-10 bg-white text-slate-950 rounded-3xl md:rounded-[40px] font-black text-xl md:text-4xl shadow-2xl transition-all hover:scale-[1.05] active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex items-center gap-3 md:gap-6 group-hover:text-white transition-colors">
                <span>START TRAINING</span>
                <svg className="w-6 h-6 md:w-10 md:h-10 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
            
            <button 
              onClick={() => document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 sm:px-12 md:px-20 py-5 md:py-10 bg-slate-900/40 border-2 border-slate-800 text-white rounded-3xl md:rounded-[40px] font-black text-xl md:text-4xl backdrop-blur-md hover:bg-slate-800 hover:border-indigo-500/50 transition-all active:scale-95 shadow-2xl"
            >
              EXPLORE NODES
            </button>
          </div>

          {/* Floating stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto pt-12 md:pt-20 animate-fade-in-up" style={{ animationDelay: '1s' }}>
            {[
              { value: '16', label: 'Nodes' },
              { value: '10K+', label: 'Engineers' },
              { value: '100%', label: 'Python' }
            ].map((stat, i) => (
              <div key={i} className="p-4 md:p-8 rounded-2xl md:rounded-3xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm hover:border-indigo-500/30 transition-all group">
                <div className="text-2xl md:text-5xl font-black text-white mb-1 md:mb-2 group-hover:text-indigo-400 transition-colors">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 md:bottom-16 left-1/2 -translate-x-1/2 animate-bounce-slow">
          <div className="w-6 h-10 md:w-8 md:h-12 rounded-full border-2 border-slate-700 flex items-start justify-center p-2">
            <div className="w-1.5 h-2 md:w-2 md:h-3 bg-indigo-500 rounded-full animate-scroll" />
          </div>
        </div>
      </section>

      {/* Code Preview Section - NEW */}
      <section className="w-full py-20 md:py-40 px-4 md:px-10 relative z-10 bg-gradient-to-b from-transparent via-[#020410]/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-20 reveal-trigger animate-fade-in-up" id="code-header">
            <h3 className="text-3xl md:text-6xl font-black text-white uppercase mb-4 md:mb-6">
              Production-Grade <span className="text-indigo-400">Code</span>
            </h3>
            <p className="text-base md:text-2xl text-slate-500 font-medium">
              Write neural networks from scratch with pure Python
            </p>
          </div>

          <div className="reveal-trigger animate-fade-in-up" id="code-showcase" style={{ animationDelay: '0.2s' }}>
            {/* Tab Selector */}
            <div className="flex gap-2 md:gap-4 mb-4 md:mb-6 overflow-x-auto pb-2">
              {codeSnippets.map((snippet, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCodeTab(i)}
                  className={`px-4 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl font-bold text-xs md:text-base whitespace-nowrap transition-all ${
                    activeCodeTab === i
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/50'
                      : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {snippet.title}
                </button>
              ))}
            </div>

            {/* Code Display */}
            <div className="relative bg-[#0a0e1a] border border-slate-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
              {/* Window controls */}
              <div className="flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 bg-[#05070d] border-b border-slate-800">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-rose-500/50" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-amber-500/50" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-emerald-500/50" />
                <span className="ml-4 text-xs md:text-sm text-slate-600 font-mono">
                  {codeSnippets[activeCodeTab].title.toLowerCase().replace(' ', '_')}.py
                </span>
              </div>

              {/* Code content */}
              <div className="p-4 md:p-8 font-mono text-xs md:text-base overflow-x-auto">
                <pre className="text-slate-300 leading-relaxed">
                  {codeSnippets[activeCodeTab].code}
                </pre>
              </div>

              {/* Animated cursor */}
              <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 w-2 h-4 md:w-3 md:h-6 bg-indigo-500 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="w-full py-20 md:py-60 px-4 md:px-10 relative z-10 overflow-hidden bg-[#020410]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-40 items-center">
          {/* Text Content */}
          <div className="space-y-10 md:space-y-16 reveal-trigger animate-fade-in-up" id="phi-text">
            <h2 className="text-5xl md:text-7xl lg:text-[9rem] font-black tracking-tighter text-white uppercase leading-[0.8]">
              The <br /> Dividend.
            </h2>
            
            <div className="space-y-10 md:space-y-20">
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
                <div key={i} className="flex gap-6 md:gap-12 group" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-[40px] bg-slate-900 border border-slate-800 flex-shrink-0 flex items-center justify-center text-3xl md:text-5xl shadow-2xl transition-all group-hover:scale-110 group-hover:bg-indigo-600/10 group-hover:border-indigo-500/50 duration-500">
                    {item.icon}
                  </div>
                  <div className="space-y-2 md:space-y-4">
                    <h4 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-base md:text-2xl text-slate-500 font-medium leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Card */}
          <div className="relative reveal-trigger animate-fade-in-up" id="phi-visual" style={{ animationDelay: '0.3s' }}>
            <div className="absolute -inset-8 md:-inset-16 bg-indigo-600/10 rounded-full blur-[100px] md:blur-[150px] animate-pulse-slow" />
            <div className="relative bg-[#0b0e14] border border-slate-800 rounded-3xl md:rounded-[80px] p-8 md:p-20 shadow-2xl backdrop-blur-3xl overflow-hidden group hover:border-indigo-500/30 transition-all duration-500">
              <div className="space-y-6 md:space-y-12">
                {/* Window controls */}
                <div className="flex gap-2 md:gap-4">
                  <div className="w-2.5 h-2.5 md:w-4 md:h-4 rounded-full bg-rose-500/30" />
                  <div className="w-2.5 h-2.5 md:w-4 md:h-4 rounded-full bg-amber-500/30" />
                  <div className="w-2.5 h-2.5 md:w-4 md:h-4 rounded-full bg-emerald-500/30" />
                </div>
                
                <h4 className="text-3xl md:text-5xl font-black text-white uppercase leading-tight">
                  Neural Logic <br /> Integrity Audit
                </h4>
                
                <p className="text-base md:text-2xl text-slate-400 font-medium">
                  Every line of Python you write is audited in real-time by Aura, our proprietary evaluation kernel.
                </p>
                
                {/* Code Terminal */}
                <div className="p-4 md:p-10 bg-[#010208] border border-slate-800 rounded-2xl md:rounded-[48px] font-mono text-sm md:text-xl space-y-4 md:space-y-6 hover:border-indigo-500/30 transition-all">
                  <div className="flex justify-between items-center text-indigo-500 text-xs md:text-sm">
                    <span>ANALYZING_GRADIENTS</span>
                    <span className="animate-pulse">STABLE...</span>
                  </div>
                  <div className="text-slate-600">{'>>>'} weight_update = weight - (lr * gradient)</div>
                  <div className="text-slate-600">{'>>>'} convergence = np.linalg.norm(weight_update)</div>
                  <div className="h-1 md:h-1.5 bg-slate-900 rounded-full overflow-hidden mt-4 md:mt-6">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 w-[78%] animate-shimmer" />
                  </div>
                  <div className="text-emerald-400 font-black uppercase text-[10px] md:text-xs pt-2 md:pt-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-400 rounded-full animate-pulse" />
                    Logic Verified: Convergence Detected [OK]
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="w-full py-20 md:py-60 px-4 md:px-10 relative z-10 border-y border-slate-900 bg-[#010208]">
        <div className="max-w-[1440px] mx-auto space-y-20 md:space-y-40">
          {/* Header */}
          <div className="text-center space-y-6 md:space-y-10 reveal-trigger animate-fade-in-up" id="road-header">
            <h2 className="text-5xl md:text-8xl lg:text-[11rem] font-black tracking-tighter text-white uppercase leading-none">
              The Path.
            </h2>
            <p className="text-base md:text-2xl lg:text-3xl text-slate-500 font-medium max-w-5xl mx-auto leading-relaxed uppercase tracking-[0.2em] md:tracking-[0.3em] px-4">
              16 high-fidelity nodes from Python primitives to self-attention mechanisms.
            </p>
          </div>

          {/* Quest Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
            {QUESTS.map((q, i) => (
              <div 
                key={q.id} 
                className={`group p-6 md:p-12 bg-[#070914] border border-slate-800/40 rounded-3xl md:rounded-[64px] hover:border-indigo-500/40 transition-all hover:-translate-y-3 md:hover:-translate-y-6 duration-700 shadow-2xl reveal-trigger cursor-pointer ${
                  visibleNodes.has(`node-${i}`) ? 'reveal-text' : 'opacity-0'
                }`} 
                id={`node-${i}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-6 md:mb-12">
                  <div className="text-[10px] md:text-[12px] font-black text-slate-700 uppercase tracking-[0.4em] md:tracking-[0.6em]">
                    NODE {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-[20px] border border-slate-800 flex items-center justify-center text-xs md:text-[12px] text-indigo-500 font-black group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {i+1}
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl md:text-3xl font-black text-white mb-4 md:mb-6 group-hover:text-indigo-400 transition-colors leading-tight uppercase tracking-tight">
                  {q.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm md:text-xl text-slate-500 leading-relaxed font-medium mb-6 md:mb-12 line-clamp-3">
                  {q.description}
                </p>
                
                {/* Topics */}
                <div className="flex flex-wrap gap-2 md:gap-3 pt-6 md:pt-10 border-t border-slate-800/50">
                  {q.topics.slice(0, 2).map(t => (
                    <span 
                      key={t} 
                      className="px-3 md:px-4 py-1.5 md:py-2 bg-slate-950 border border-slate-800 rounded-lg md:rounded-xl text-[9px] md:text-[11px] font-black text-slate-600 uppercase tracking-wider hover:border-indigo-500/30 hover:text-indigo-500 transition-all"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Hover indicator */}
                <div className="mt-6 md:mt-8 flex items-center gap-2 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs md:text-sm font-bold">Explore Node</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - NEW */}
      <section className="w-full py-20 md:py-40 px-4 md:px-10 relative z-10 bg-gradient-to-b from-[#010208] via-indigo-950/5 to-[#010208]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            {[
              { number: '10,000+', label: 'Active Engineers', icon: '👥' },
              { number: '16', label: 'Training Nodes', icon: '🎯' },
              { number: '100%', label: 'Python Native', icon: '🐍' },
              { number: '24/7', label: 'Support Access', icon: '💬' }
            ].map((stat, i) => (
              <div 
                key={i}
                className="p-6 md:p-10 rounded-2xl md:rounded-3xl bg-slate-900/20 border border-slate-800/50 backdrop-blur-sm text-center group hover:border-indigo-500/50 hover:bg-slate-900/40 transition-all reveal-trigger animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-3xl md:text-5xl mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-5xl font-black text-white mb-2 md:mb-3 group-hover:text-indigo-400 transition-colors">
                  {stat.number}
                </div>
                <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="launch" className="w-full py-20 md:py-80 px-4 md:px-10 text-center relative z-10 overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          <div className="relative bg-white rounded-[60px] md:rounded-[120px] p-12 md:p-60 shadow-[0_40px_120px_-20px_rgba(255,255,255,0.15)] overflow-hidden group reveal-trigger animate-fade-in-up" id="final-cta">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-700 to-indigo-800 transition-opacity duration-1000 opacity-0 group-hover:opacity-100" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] md:w-[1400px] md:h-[1400px] bg-white opacity-5 rounded-full blur-[200px] md:blur-[250px] -translate-y-1/2 translate-x-1/2 animate-pulse-slow" />
            
            <div className="relative z-10 space-y-12 md:space-y-24">
              <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-[14rem] font-black text-slate-950 tracking-tighter uppercase leading-[0.7] group-hover:text-white transition-colors duration-700">
                Begin <br /> Ascension.
              </h2>
              
              <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl text-slate-600 font-medium max-w-5xl mx-auto leading-[1.3] group-hover:text-indigo-50 transition-colors duration-700 px-4">
                Join 10,000+ engineers architecting the future. Initialize your session and begin Node 01. No cost. No spectators. Just pure engineering.
              </p>
              
              <div className="pt-8 md:pt-16 flex flex-col sm:flex-row gap-6 md:gap-8 justify-center items-center">
                <button 
                  onClick={onInitialize}
                  className="w-full sm:w-auto px-12 sm:px-20 md:px-36 py-6 sm:py-10 md:py-16 bg-slate-950 text-white rounded-[40px] md:rounded-[60px] font-black text-2xl sm:text-4xl md:text-6xl shadow-2xl hover:scale-[1.05] active:scale-95 transition-all uppercase tracking-tighter group-hover:bg-white group-hover:text-indigo-700 duration-700"
                >
                  LAUNCH PROTOCOL
                </button>
                
                <div className="text-sm md:text-base text-slate-600 group-hover:text-white/80 transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="font-bold">Free Forever</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-12 pt-8 md:pt-16 opacity-60 group-hover:opacity-100 transition-opacity">
                {['No Credit Card', '16 Free Nodes', 'Instant Access'].map((badge) => (
                  <div key={badge} className="flex items-center gap-2 text-slate-700 group-hover:text-white transition-colors">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs md:text-sm font-bold uppercase tracking-wider">{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-16 md:py-60 bg-[#010208] relative z-10 border-t border-slate-900">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-32 mb-16 md:mb-40">
            {/* Brand */}
            <div className="space-y-6 md:space-y-12">
              <div className="flex items-center gap-3 md:gap-5">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-600 rounded-2xl md:rounded-3xl flex items-center justify-center font-black text-white text-2xl md:text-3xl">
                  P
                </div>
                <span className="text-2xl md:text-4xl font-black tracking-tighter uppercase">PyQuest</span>
              </div>
              <p className="text-base md:text-2xl text-slate-600 font-medium leading-relaxed max-w-sm">
                The world's leading technical training ground for the next generation of Machine Learning architects. Pure Python. Zero Fluff.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4 md:space-y-6">
              <h4 className="text-base md:text-xl font-black text-white uppercase tracking-wider">Platform</h4>
              <nav className="flex flex-col gap-3 md:gap-4">
                {['Roadmap', 'Philosophy', 'Architecture', 'Pricing'].map(link => (
                  <a 
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    className="text-sm md:text-lg text-slate-500 hover:text-white transition-colors font-medium"
                  >
                    {link}
                  </a>
                ))}
              </nav>
            </div>

            {/* Resources */}
            <div className="space-y-4 md:space-y-6">
              <h4 className="text-base md:text-xl font-black text-white uppercase tracking-wider">Resources</h4>
              <nav className="flex flex-col gap-3 md:gap-4">
                {['Documentation', 'Community', 'Blog', 'Support'].map(link => (
                  <a 
                    key={link}
                    href="#"
                    className="text-sm md:text-lg text-slate-500 hover:text-white transition-colors font-medium"
                  >
                    {link}
                  </a>
                ))}
              </nav>
            </div>

            {/* Social */}
            <div className="space-y-4 md:space-y-6">
              <h4 className="text-base md:text-xl font-black text-white uppercase tracking-wider">Connect</h4>
              <div className="flex gap-4">
                {['Twitter', 'GitHub', 'Discord'].map(social => (
                  <a 
                    key={social}
                    href="#"
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:border-indigo-500/50 hover:bg-slate-800 transition-all"
                  >
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-12 md:pt-32 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-16">
            <p className="text-[11px] md:text-[14px] font-black text-slate-800 uppercase tracking-[0.5em] md:tracking-[0.9em] text-center md:text-left">
              &copy; 2026 PYQUEST PLATFORMS INC.
            </p>
            <div className="flex gap-6 md:gap-8 text-xs md:text-sm text-slate-700 font-medium">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Enhanced CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }

        .shadow-3xl {
          box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.7);
        }

        @keyframes revealText {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .reveal-text {
          opacity: 0;
          transform: translateY(40px);
          animation: revealText 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        @keyframes neural-drift {
          0%, 100% { opacity: 0.2; transform: scale(1) translate(0, 0); }
          50% { opacity: 0.4; transform: scale(1.1) translate(20px, -20px); }
        }

        .animate-neural {
          animation: neural-drift 20s ease-in-out infinite;
        }

        .animate-neural-delayed {
          animation: neural-drift 25s ease-in-out infinite;
          animation-delay: 5s;
        }

        .animate-neural-slow {
          animation: neural-drift 30s ease-in-out infinite;
          animation-delay: 10s;
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        .animate-scanline {
          animation: scanline 8s linear infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        @keyframes scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(8px); }
        }

        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .glass {
          background: rgba(15, 23, 42, 0.3);
          backdrop-filter: blur(20px);
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .animate-neural,
          .animate-neural-delayed,
          .animate-neural-slow {
            animation-duration: 15s;
          }
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #010208;
        }

        ::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      ` }} />
    </div>
  );
};

export default LandingPage;
