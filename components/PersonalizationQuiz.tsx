
import React, { useState } from 'react';
import { UserPersonalization } from '../types';
import { generatePersonalizedProfile } from '../services/geminiService';
import LoadingOverlay from './LoadingOverlay';

interface PersonalizationQuizProps {
  onComplete: (personalization: UserPersonalization | null) => void;
}

const PersonalizationQuiz: React.FC<PersonalizationQuizProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    {
      id: 'motivation',
      title: "The Why",
      sub: "What draws you to the world of artificial intelligence?",
      options: [
        { id: 'magic', label: 'It feels like modern-day magic', icon: '🪄' },
        { id: 'tool', label: 'I want a powerful tool to solve real problems', icon: '🛠️' },
        { id: 'logic', label: 'I love the beauty of pure logic and math', icon: '🔢' },
        { id: 'future', label: 'I want to be part of the future of humanity', icon: '🚀' }
      ]
    },
    {
      id: 'impact',
      title: "The Mission",
      sub: "If you had a super-brain, where would you point it?",
      options: [
        { id: 'health', label: 'Curing diseases and improving human life', icon: '🏥' },
        { id: 'earth', label: 'Saving the planet and protecting ecosystems', icon: '🌍' },
        { id: 'media', label: 'Revolutionizing art, music, and digital media', icon: '🎭' },
        { id: 'economy', label: 'Helping people thrive and manage finances', icon: '💰' }
      ]
    },
    {
      id: 'creativity',
      title: "The Style",
      sub: "How do you naturally prefer to build things?",
      options: [
        { id: 'architect', label: 'I like planning every technical detail first', icon: '📐' },
        { id: 'artist', label: 'I like to play, experiment, and see what happens', icon: '🎨' },
        { id: 'pioneer', label: 'I want to go where no researcher has gone', icon: '🧭' },
        { id: 'optimizer', label: 'I want to make existing systems faster and perfect', icon: '💎' }
      ]
    },
    {
      id: 'resilience',
      title: "The Mindset",
      sub: "How do you honestly feel when things get difficult?",
      options: [
        { id: 'challenge', label: 'I love a good intellectual puzzle to solve', icon: '🧩' },
        { id: 'support', label: 'I prefer having a mentor or guide to help me', icon: '🤝' },
        { id: 'persistence', label: 'I keep going until it works, no matter what', icon: '🔥' },
        { id: 'efficiency', label: 'I look for the smartest, most efficient way out', icon: '💡' }
      ]
    },
    {
      id: 'social',
      title: "The Tribe",
      sub: "What is your ideal professional work environment?",
      options: [
        { id: 'monk', label: 'Deep, quiet focus working on my own', icon: '🧘' },
        { id: 'squad', label: 'Brainstorming with a small, elite team', icon: '👥' },
        { id: 'leader', label: 'Leading a group toward a massive common goal', icon: '📢' },
        { id: 'nomad', label: 'Working from anywhere in the world', icon: '🏖️' }
      ]
    },
    {
      id: 'horizon',
      title: "The Vision",
      sub: "Where do you truly want to be in 5 years?",
      options: [
        { id: 'freedom', label: 'Totally independent, creative, and free', icon: '🦅' },
        { id: 'mastery', label: 'A world-renowned technical expert in my field', icon: '🏆' },
        { id: 'impact', label: 'Knowing my code helped millions of people', icon: '🌟' },
        { id: 'wealth', label: 'Building a massive and successful technology firm', icon: '🏢' }
      ]
    },
    {
      id: 'foundation',
      title: "The Start",
      sub: "What is your current relationship with technology?",
      options: [
        { id: 'blank', label: 'A complete blank slate (Complete Beginner)', icon: '🌱' },
        { id: 'casual', label: 'I know some basics and play around occasionally', icon: '🎮' },
        { id: 'comfortable', label: 'I use technology to solve complex tasks already', icon: '💻' },
        { id: 'expert', label: 'I live and breathe technical challenges daily', icon: '⚡' }
      ]
    }
  ];

  const handleSelect = async (value: string) => {
    const currentStepId = steps[step].id;
    const newAnswers = { ...answers, [currentStepId]: value };
    setAnswers(newAnswers);

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setIsProcessing(true);
      try {
        const profile = await generatePersonalizedProfile(
          newAnswers.motivation + ", " + newAnswers.impact,
          newAnswers.horizon,
          newAnswers.foundation,
          newAnswers.creativity + ", " + newAnswers.social + ", " + newAnswers.resilience
        );
        onComplete(profile);
      } catch (err) {
        onComplete(null);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (isProcessing) return <LoadingOverlay message="Synthesizing Your Destiny" subMessage="Mapping your abstract goals to a professional curriculum..." />;

  const current = steps[step];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#010208] relative overflow-hidden px-12 py-20 font-jakarta">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-indigo-600/5 rounded-full blur-[240px] animate-neural"></div>
      </div>
      
      <div className="max-w-4xl w-full glass rounded-[64px] p-12 md:p-20 shadow-3xl relative z-10 flex flex-col items-center">
        <div className="mb-14 flex gap-2 justify-center">
           {steps.map((_, i) => (
             <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${step >= i ? 'w-10 bg-indigo-500 shadow-[0_0_12px_#4f46e5]' : 'w-4 bg-white/10'}`}></div>
           ))}
        </div>

        <div className="text-center space-y-4 mb-14 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.4em]">Neural Profiling — Node {step + 1}/{steps.length}</span>
          <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-none">{current.title}</h2>
          <p className="text-slate-400 font-medium text-lg max-w-lg mx-auto leading-relaxed">{current.sub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {current.options.map(opt => (
            <button 
              key={opt.id} 
              onClick={() => handleSelect(opt.label)}
              className="p-8 rounded-[32px] bg-white/[0.03] border border-white/5 text-white font-bold hover:border-indigo-500/30 hover:bg-white/[0.06] transition-all group flex items-center gap-8 relative overflow-hidden text-left"
            >
              <span className="text-4xl transition-transform group-hover:scale-110 duration-500">{opt.icon}</span>
              <span className="text-[13px] font-semibold text-slate-100 leading-snug flex-1">{opt.label}</span>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all text-white">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-6">
           <button 
             onClick={() => onComplete(null)}
             className="text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:text-indigo-400 transition-colors"
           >
             Continue without specialization
           </button>
           <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 animate-pulse"></div>
             <span className="text-[8px] font-bold text-slate-800 uppercase tracking-[0.3em]">Pathfinder Kernel V2.0 Active</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationQuiz;
