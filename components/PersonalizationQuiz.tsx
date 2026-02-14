
import React, { useState } from 'react';
import { UserPersonalization } from '../types';
import { generatePersonalizedProfile } from '../services/geminiService';
import LoadingOverlay from './LoadingOverlay';

interface PersonalizationQuizProps {
  onComplete: (personalization: UserPersonalization) => void;
}

const PersonalizationQuiz: React.FC<PersonalizationQuizProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [field, setField] = useState('');
  const [ambition, setAmbition] = useState('');
  const [proficiency, setProficiency] = useState('');
  const [focus, setFocus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fields = ['FinTech', 'BioTech', 'Robotics', 'Web Scale', 'Research', 'Creative Arts'];
  const ambitions = ['Lead Architect', 'Quant Researcher', 'Founder', 'Applied Engineer', 'Indie Creator'];
  const proficiencies = ['Novice (Learning Syntax)', 'Intermediate (Building Apps)', 'Advanced (Optimizing Models)'];
  const focuses = ['Natural Language Processing', 'Computer Vision', 'Reinforcement Learning', 'Generative AI', 'Predictive Analytics'];

  const handleFinalize = async () => {
    setIsProcessing(true);
    try {
      const profile = await generatePersonalizedProfile(field, ambition, proficiency, focus);
      onComplete(profile);
    } catch (err) {
      console.error(err);
      // Fallback in case of error
      onComplete({
        field, ambition, proficiency, focus,
        aiDirective: "Master Python fundamentals to accelerate neural development.",
        summary: "Your path is unique. We will focus on core architectural patterns."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="space-y-4 text-center">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em]">Stage 01</span>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Primary Domain.</h2>
              <p className="text-slate-500 font-medium">Which industry will your algorithms disrupt?</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {fields.map(f => (
                <button 
                  key={f} 
                  onClick={() => { setField(f); setStep(1); }}
                  className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 text-white font-bold hover:border-indigo-500/50 hover:bg-indigo-600/10 transition-all text-sm uppercase tracking-widest"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="space-y-4 text-center">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em]">Stage 02</span>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Ultimate Rank.</h2>
              <p className="text-slate-500 font-medium">What is your desired end-state profile?</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {ambitions.map(a => (
                <button 
                  key={a} 
                  onClick={() => { setAmbition(a); setStep(2); }}
                  className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 text-white font-bold hover:border-indigo-500/50 hover:bg-indigo-600/10 transition-all text-sm uppercase tracking-widest"
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="space-y-4 text-center">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em]">Stage 03</span>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Current Base.</h2>
              <p className="text-slate-500 font-medium">Be honest with your logical prerequisites.</p>
            </div>
            <div className="space-y-4">
              {proficiencies.map(p => (
                <button 
                  key={p} 
                  onClick={() => { setProficiency(p); setStep(3); }}
                  className="w-full p-6 rounded-3xl bg-slate-900/50 border border-white/5 text-white font-bold hover:border-indigo-500/50 hover:bg-indigo-600/10 transition-all text-sm uppercase tracking-widest"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="space-y-4 text-center">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em]">Stage 04</span>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Neural Focus.</h2>
              <p className="text-slate-500 font-medium">Select your primary architecture interest.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {focuses.map(f => (
                <button 
                  key={f} 
                  onClick={() => { setFocus(f); handleFinalize(); }}
                  className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 text-white font-bold hover:border-indigo-500/50 hover:bg-indigo-600/10 transition-all text-sm uppercase tracking-widest"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isProcessing) return <LoadingOverlay message="Synthesizing Neural Directive" subMessage="Calibrating Academy Nodes to Your Ambition" />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#010208] relative overflow-hidden px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] animate-neural"></div>
      </div>
      
      <div className="max-w-2xl w-full bg-[#0b0e14] border border-white/5 rounded-[64px] p-12 md:p-20 shadow-3xl relative z-10">
        <div className="mb-12 flex justify-center">
           <div className="flex gap-2">
             {[0, 1, 2, 3].map(i => (
               <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-indigo-500' : 'w-4 bg-slate-800'}`}></div>
             ))}
           </div>
        </div>
        {renderStep()}
        <div className="mt-12 text-center">
          <span className="text-[8px] font-black text-slate-800 uppercase tracking-[0.6em]">Neural Alignment Protocol v9.5.1</span>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationQuiz;
