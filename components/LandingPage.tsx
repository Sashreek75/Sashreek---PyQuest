import React, { useState, useEffect } from 'react';
import { QUESTS } from '../constants';

interface LandingPageProps {
  onInitialize: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onInitialize }) => {
  const [scrollY, setScrollY] = useState(0);
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    );

    // Slight delay so elements are mounted
    setTimeout(() => {
      const targets = document.querySelectorAll('.reveal');
      targets.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const isVisible = (id: string) => visibleElements.has(id);

  const tracks = [
    {
      emoji: '🧮',
      title: 'The Foundations',
      desc: 'Get solid with the Python building blocks that everything else depends on — lists, loops, functions, and how to think like a programmer.',
      tag: 'Beginner',
      color: '#f0fdf4',
      accent: '#16a34a',
    },
    {
      emoji: '🔁',
      title: 'Logic & Flow',
      desc: 'Write code that makes decisions, repeats itself smartly, and handles the unexpected. The stuff that makes programs feel alive.',
      tag: 'Intermediate',
      color: '#fffbeb',
      accent: '#d97706',
    },
    {
      emoji: '🧠',
      title: 'How AI Thinks',
      desc: "Demystify machine learning — build real models from scratch and finally understand what's happening under the hood.",
      tag: 'Advanced',
      color: '#eff6ff',
      accent: '#2563eb',
    },
    {
      emoji: '🚀',
      title: 'Ship Real Things',
      desc: 'Take your skills into the wild. Build data pipelines, APIs, and tools you can actually put on your résumé.',
      tag: 'Mastery',
      color: '#fdf4ff',
      accent: '#9333ea',
    },
  ];

  const testimonials = [
    { quote: 'I went from copy-pasting Stack Overflow to actually understanding what I\'m writing. Game changer.', name: 'Priya S.', role: 'Data Analyst' },
    { quote: 'The quests feel like solving puzzles — I didn\'t even realize I was learning until I looked back at how far I\'d come.', name: 'Marcus T.', role: 'Software Engineer' },
    { quote: 'Finally a Python course that respects my time and explains the why, not just the what.', name: 'Yuki N.', role: 'ML Researcher' },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1714] overflow-x-hidden font-sans selection:bg-[#f5c842]/30 grid-bg">
      {/* ── Nav ── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrollY > 40 ? 'bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#e8e3db] shadow-sm py-4' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-transform group-hover:scale-110 bg-[#f5c842]">🐍</div>
            <span className="font-serif text-2xl tracking-tight text-[#1a1714]">PyQuest</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {['Tracks', 'How it Works', 'Stories'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-[10px] font-bold text-[#9a9088] hover:text-[#1a1714] transition-colors uppercase tracking-[0.3em]">
                {item}
              </a>
            ))}
            <button
              onClick={onInitialize}
              className="px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-[#1a1714] transition-all hover:opacity-90 active:scale-95 bg-[#f5c842] shadow-lg shadow-[#f5c842]/20"
            >
              Start for free →
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-0 rail-text h-full flex items-center justify-center pl-8 opacity-10 select-none pointer-events-none">
          LEARN PYTHON — THE WAY IT CLICKS — SYSTEM STATUS: READY
        </div>
        <div className="absolute top-0 right-0 rail-text h-full flex items-center justify-center pr-8 opacity-10 select-none rotate-180 pointer-events-none">
          JOIN 10,000+ ARCHITECTS — BUILD REAL THINGS — PYQUEST ACADEMY
        </div>

        {/* Soft background blobs */}
        <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] rounded-full opacity-10 blur-[120px] pointer-events-none bg-[#f5c842] animate-pulse" />
        <div className="absolute bottom-[15%] right-[5%] w-[500px] h-[500px] rounded-full opacity-5 blur-[100px] pointer-events-none bg-[#16a34a]" />

        <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div id="hero-content" className={`reveal lg:col-span-7 space-y-12 transition-all duration-1000 ${isVisible('hero-content') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full text-[10px] font-bold bg-[#f5c842]/10 text-[#d97706] border border-[#f5c842]/20 uppercase tracking-[0.3em]">
              <span className="animate-bounce">🐍</span> {QUESTS.length} Hands-on Challenges
            </div>

            <h1 className="font-serif text-8xl md:text-9xl lg:text-[10rem] leading-[0.85] tracking-tighter text-[#1a1714]">
              Learn Python <br />
              <span className="italic text-[#d97706]">the way it clicks.</span>
            </h1>

            <p className="text-xl md:text-2xl text-[#6b6560] max-w-2xl leading-tight font-medium">
              PyQuest turns abstract programming concepts into satisfying quests. Write real code, get instant feedback, and build confidence one challenge at a time.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <button
                onClick={onInitialize}
                className="px-12 py-5 rounded-[32px] text-xl font-bold text-[#1a1714] transition-all hover:scale-[1.03] active:scale-[0.97] bg-[#f5c842] shadow-2xl shadow-[#f5c842]/30"
              >
                Start your first quest →
              </button>
              <button
                onClick={() => document.getElementById('tracks')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-12 py-5 rounded-[32px] text-xl font-bold text-[#6b6560] border border-[#e8e3db] bg-white hover:border-[#f5c842] transition-all shadow-sm"
              >
                See the path
              </button>
            </div>

            <div className="pt-12 flex items-center gap-10 text-sm text-[#9a9088]">
              <div className="flex -space-x-4">
                {['🧑‍💻','👩‍🔬','👨‍💼','👩‍🎨'].map((e, i) => (
                  <div key={i} className="w-12 h-12 rounded-full bg-white border-4 border-[#faf8f5] flex items-center justify-center text-xl shadow-md">{e}</div>
                ))}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#1a1714] text-lg">10,000+ Learners</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Growing every day</span>
              </div>
            </div>
          </div>

          <div id="hero-illustration" className={`reveal lg:col-span-5 relative transition-all duration-1000 delay-300 ${isVisible('hero-illustration') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div className="relative group">
              <div className="absolute -inset-8 bg-[#f5c842]/5 rounded-[64px] blur-3xl group-hover:bg-[#f5c842]/10 transition-all" />
              <div className="relative bg-white rounded-[48px] border border-[#e8e3db] shadow-2xl overflow-hidden paper-shadow">
                <div className="flex items-center gap-2 px-10 py-6 border-b border-[#f0ebe4] bg-[#faf8f5]">
                  <div className="w-3 h-3 rounded-full bg-[#fc6058]" />
                  <div className="w-3 h-3 rounded-full bg-[#fec02f]" />
                  <div className="w-3 h-3 rounded-full bg-[#2aca44]" />
                  <span className="ml-6 text-[10px] text-[#9a9088] font-mono uppercase tracking-[0.4em]">quest_01.py</span>
                </div>
                <div className="p-12 font-mono text-lg leading-relaxed text-left">
                  <div><span className="text-[#9333ea]">def</span> <span className="text-[#2563eb]">greet</span><span className="text-[#6b6560]">(name):</span></div>
                  <div className="ml-10"><span className="text-[#9333ea]">return</span> <span className="text-[#16a34a]">f"Welcome to PyQuest, </span><span className="text-[#d97706]">{"{"}</span><span className="text-[#16a34a]">name</span><span className="text-[#d97706]">{"}"}</span><span className="text-[#16a34a]">!"</span></div>
                  <div className="mt-8"><span className="text-[#9333ea]">print</span><span className="text-[#6b6560]">(</span><span className="text-[#2563eb]">greet</span><span className="text-[#6b6560]">(</span><span className="text-[#16a34a]">"you"</span><span className="text-[#6b6560]">))</span></div>
                  <div className="mt-12 px-8 py-5 rounded-3xl font-bold bg-[#f0fdf4] text-[#16a34a] border border-[#16a34a]/10 shadow-sm animate-pulse">
                    ✓ &nbsp;Welcome to PyQuest, you!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tracks ── */}
      <section id="tracks" className="py-48 px-6 bg-white border-y border-[#e8e3db] relative overflow-hidden">
        <div className="oversized-number absolute top-12 right-12 opacity-5">02</div>
        <div className="max-w-7xl mx-auto">
          <div id="tracks-head" className={`reveal grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32 transition-all duration-700 ${isVisible('tracks-head') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="space-y-6">
              <p className="text-[10px] font-bold text-[#9a9088] uppercase tracking-[0.4em]">Learning Tracks</p>
              <h2 className="font-serif text-7xl md:text-8xl leading-[0.9] tracking-tighter text-[#1a1714]">
                Four tracks, one <br />
                <span className="italic text-[#d97706]">clear path.</span>
              </h2>
            </div>
            <div className="flex items-end">
              <p className="text-2xl text-[#6b6560] max-w-lg leading-tight font-medium">
                Start anywhere that fits your level. Each track builds on the last, but you're never locked in. Explore the full spectrum of Python engineering.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#e8e3db] rounded-[64px] overflow-hidden shadow-2xl">
            {tracks.map((track, i) => (
              <div
                key={i}
                id={`track-${i}`}
                className={`reveal group p-14 border-[#e8e3db] cursor-pointer transition-all duration-700 hover:bg-[#faf8f5] relative overflow-hidden ${i < 3 ? 'md:border-r' : ''} ${i < 2 ? 'border-b md:border-b-0' : ''} ${isVisible(`track-${i}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#f5c842]/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="flex items-start justify-between mb-12 relative z-10">
                  <span className="text-6xl group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">{track.emoji}</span>
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border" style={{ borderColor: track.accent + '30', color: track.accent, background: track.accent + '08' }}>
                    {track.tag}
                  </span>
                </div>
                <h3 className="font-serif text-4xl tracking-tight mb-6 text-[#1a1714] relative z-10 italic">
                  {track.title}
                </h3>
                <p className="text-[#6b6560] leading-snug font-medium text-base relative z-10">{track.desc}</p>
                <div className="mt-16 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] relative z-10" style={{ color: track.accent }}>
                  Explore Track <span className="transition-transform group-hover:translate-x-3 inline-block">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section id="how-it-works" className="py-48 px-6 bg-[#faf8f5] relative overflow-hidden">
        <div className="oversized-number absolute bottom-12 left-12 opacity-5">03</div>
        <div className="max-w-7xl mx-auto">
          <div id="how-head" className={`reveal text-center mb-40 transition-all duration-700 ${isVisible('how-head') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-[10px] font-bold text-[#9a9088] uppercase tracking-[0.4em] mb-8">The Methodology</p>
            <h2 className="font-serif text-8xl md:text-[10rem] leading-[0.85] tracking-tighter text-[#1a1714]">
              No lectures. <br />
              <span className="italic text-[#d97706]">Just quests.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[
              { id: 'step-1', num: '01', icon: '🎯', title: 'Pick a challenge', desc: 'Choose a quest that matches where you are. Each one has a clear goal and a real coding problem to solve.' },
              { id: 'step-2', num: '02', icon: '⌨️', title: 'Write your solution', desc: 'Code directly in the browser. No installs, no fussing with environments — just you and Python.' },
              { id: 'step-3', num: '03', icon: '✨', title: 'Get smart feedback', desc: 'Aura, your AI guide, reviews your code and explains what\'s working and what could be better. Instantly.' },
            ].map((step, i) => (
              <div
                key={i}
                id={step.id}
                className={`reveal relative transition-all duration-700 ${isVisible(step.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="oversized-number absolute -top-20 -left-12 opacity-[0.04] pointer-events-none select-none">
                  {step.num}
                </div>
                <div className="text-6xl mb-10 animate-float" style={{ animationDelay: `${i * 0.5}s` }}>{step.icon}</div>
                <h3 className="text-3xl font-serif tracking-tight mb-6 text-[#1a1714] italic">{step.title}</h3>
                <p className="text-xl text-[#6b6560] leading-tight font-medium">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Feature callout */}
          <div
            id="feature-card"
            className={`reveal mt-48 p-16 md:p-32 bg-white rounded-[80px] border border-[#e8e3db] grid grid-cols-1 lg:grid-cols-2 gap-24 items-center transition-all duration-700 shadow-2xl relative overflow-hidden ${isVisible('feature-card') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="absolute top-0 left-0 w-full h-full grid-bg opacity-30 pointer-events-none"></div>
            <div className="space-y-10 relative z-10">
              <div className="inline-block px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] bg-[#eff6ff] text-[#2563eb] border border-[#2563eb]/10">AI-powered mentorship</div>
              <h3 className="font-serif text-6xl md:text-7xl leading-[0.9] tracking-tighter text-[#1a1714]">
                Meet Aura, your <br />
                <span className="italic text-[#f5c842]">personal guide.</span>
              </h3>
              <p className="text-2xl text-[#6b6560] leading-tight font-medium">
                Aura reads your code the way a thoughtful mentor would — explaining <em>why</em> something doesn't work, not just flagging that it's wrong.
              </p>
              <div className="space-y-6 pt-6">
                {['Explains errors in plain English', 'Suggests improvements without rewriting', 'Adapts to your level as you grow'].map((f) => (
                  <div key={f} className="flex items-center gap-5 text-base font-bold text-[#1a1714]">
                    <div className="w-8 h-8 rounded-full bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center text-sm shadow-sm">✓</div>
                    {f}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="absolute -inset-16 bg-[#f5c842]/10 rounded-full blur-3xl" />
              <div className="relative bg-[#faf8f5] rounded-[48px] p-12 border border-[#f0ebe4] font-mono text-base space-y-8 shadow-inner paper-shadow">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.4em] text-[#9a9088]">
                  <span>Aura's Analysis</span>
                  <div className="flex items-center gap-2 text-[#f5c842]">
                    <div className="w-2 h-2 rounded-full bg-[#f5c842] animate-pulse"></div>
                    Active
                  </div>
                </div>
                <div className="text-[#6b6560] flex items-start gap-4">
                  <span className="text-2xl">⚠️</span> 
                  <span className="font-bold">Line 3: your loop runs one time too many</span>
                </div>
                <div className="p-8 bg-white rounded-3xl border border-[#e8e3db] text-[#6b6560] leading-relaxed text-base shadow-sm italic">
                  "The issue is using <code className="text-[#9333ea] font-bold">{"<="}</code> instead of <code className="text-[#9333ea] font-bold">{"<"}</code>. Since list indices start at 0, going up to <code className="text-[#9333ea] font-bold">len(items)</code> will go one step past the end."
                </div>
                <div className="flex items-center gap-4 text-sm text-[#16a34a] font-bold pt-4">
                  <div className="w-3 h-3 rounded-full bg-[#16a34a] animate-pulse" />
                  <span>Fixed! Tests passing.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="stories" className="py-48 px-6 bg-white relative overflow-hidden">
        <div className="oversized-number absolute top-12 left-12 opacity-5">04</div>
        <div className="max-w-7xl mx-auto">
          <div id="stories-head" className={`reveal text-center mb-32 transition-all duration-700 ${isVisible('stories-head') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-[10px] font-bold text-[#9a9088] uppercase tracking-[0.4em] mb-8">Real Stories</p>
            <h2 className="font-serif text-8xl md:text-9xl leading-[0.85] tracking-tighter text-[#1a1714]">
              From "I don't get it" <br />
              to <span className="italic text-[#d97706]">"I built that."</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {testimonials.map((t, i) => (
              <div
                key={i}
                id={`testimonial-${i}`}
                className={`reveal p-14 bg-[#faf8f5] rounded-[64px] border border-[#f0ebe4] transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 ${isVisible(`testimonial-${i}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="font-serif text-8xl text-[#f5c842] mb-10 leading-none opacity-50">“</div>
                <p className="text-2xl text-[#3a3530] leading-tight font-medium italic mb-12">"{t.quote}"</p>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-[#e8e3db] flex items-center justify-center text-2xl shadow-sm">👤</div>
                  <div>
                    <div className="font-bold text-[#1a1714] text-xl">{t.name}</div>
                    <div className="text-[10px] font-bold text-[#9a9088] uppercase tracking-[0.3em]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-56 px-6 bg-[#faf8f5] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#f5c842]/10 rounded-full blur-[150px]" />
        </div>
        
        <div id="final-cta" className={`reveal relative max-w-5xl mx-auto text-center space-y-16 transition-all duration-700 ${isVisible('final-cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-8xl animate-float">🐍</div>
          <h2 className="font-serif text-8xl md:text-[11rem] leading-[0.8] tracking-tighter text-[#1a1714]">
            Ready to write <br />
            <span className="italic text-[#d97706]">your first quest?</span>
          </h2>
          <p className="text-3xl text-[#6b6560] max-w-2xl mx-auto leading-tight font-medium">
            It's free to start. No credit card, no installation, no prior experience needed. Just you and the code.
          </p>
          <div className="flex flex-col items-center gap-8">
            <button
              onClick={onInitialize}
              className="px-20 py-8 rounded-[40px] text-3xl font-bold text-[#1a1714] transition-all hover:scale-[1.04] active:scale-[0.97] bg-[#f5c842] shadow-2xl shadow-[#f5c842]/40"
            >
              Start for free →
            </button>
            <p className="text-[10px] font-bold text-[#b0a89e] uppercase tracking-[0.4em]">Joined by 10,000+ learners · No setup required</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-32 border-t border-[#e8e3db] bg-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0 rail-text opacity-5 pr-12 pb-12 pointer-events-none">PYQUEST ACADEMY — EST. 2026</div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
          <div className="flex items-center gap-5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 bg-[#f5c842] shadow-sm">🐍</div>
            <span className="font-serif text-3xl tracking-tight">PyQuest</span>
          </div>
          
          <div className="flex gap-16 text-[10px] font-bold uppercase tracking-[0.4em] text-[#9a9088]">
            {['Privacy', 'Terms', 'Contact'].map(item => (
              <a key={item} href="#" className="hover:text-[#1a1714] transition-colors">{item}</a>
            ))}
          </div>
          
          <p className="text-base font-medium text-[#b0a89e]">© 2026 PyQuest — Learn Python, for real.</p>
        </div>
      </footer>
    </div>

  );
};

export default LandingPage;