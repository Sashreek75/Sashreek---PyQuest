
import React, { useState } from 'react';
import { auditSandboxCode, generateSandboxDataset } from '../services/geminiService';
import { SandboxAudit, SyntheticDataset, UserPersonalization } from '../types';
import LoadingOverlay from './LoadingOverlay';
import Visualizer from './Visualizer';

interface SandboxProps {
  personalization?: UserPersonalization;
  onBack: () => void;
  onOpenAura: () => void;
}

const Sandbox: React.FC<SandboxProps> = ({ personalization, onBack, onOpenAura }) => {
  const [code, setCode] = useState(`# Enter any Python/ML code for a professional audit\nimport numpy as np\n\ndef neural_forward(x, w, b):\n    return np.dot(x, w) + b\n\n# Request an audit below`);
  const [audit, setAudit] = useState<SandboxAudit | null>(null);
  const [dataset, setDataset] = useState<SyntheticDataset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [datasetPrompt, setDatasetPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'Audit' | 'Data'>('Audit');

  const handleRequestAudit = async () => {
    setIsLoading(true);
    try {
      const result = await auditSandboxCode(code);
      setAudit(result);
      setActiveTab('Audit');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSynthesizeDataset = async () => {
    if (!datasetPrompt.trim()) return;
    setIsLoading(true);
    try {
      const result = await generateSandboxDataset(datasetPrompt, code);
      setDataset(result);
      setActiveTab('Data');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#010208] text-slate-200 font-jakarta animate-in fade-in duration-700 overflow-hidden flex flex-col">
      {isLoading && <LoadingOverlay message="Neural Kernel Processing" subMessage="Aura is analyzing your logical architecture..." />}
      
      <header className="h-20 border-b border-white/5 px-12 flex items-center justify-between bg-[#010208]/90 backdrop-blur-xl z-40">
        <div className="flex items-center gap-8">
          <button onClick={onBack} className="text-slate-500 hover:text-white transition-colors group flex items-center gap-3">
             <span className="group-hover:-translate-x-1 transition-transform">←</span>
             <span className="text-[10px] font-bold uppercase tracking-widest">Repository</span>
          </button>
          <div className="h-4 w-px bg-slate-800" />
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
            Academy / <span className="text-indigo-400 italic">Neural_Sandbox_v1.0</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={onOpenAura}
            className="px-6 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:bg-indigo-600/20 transition-all shadow-[0_0_20px_rgba(79,70,229,0.1)]"
          >
            Consult Aura
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1800px] w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
        {/* Code Editor Section */}
        <div className="lg:col-span-7 flex flex-col h-full space-y-6 overflow-hidden">
          <div className="flex-1 bg-[#0b0e14]/50 border border-white/5 rounded-[40px] overflow-hidden flex flex-col shadow-2xl relative">
            <div className="bg-[#05070d] px-10 py-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20"></div>
                </div>
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] ml-4">Sandbox_Kernel.py</span>
              </div>
            </div>
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 w-full p-12 bg-transparent text-indigo-100 font-mono text-lg focus:outline-none resize-none leading-relaxed code-font selection:bg-indigo-500/30"
            />
            <div className="p-8 bg-[#0b0e14] border-t border-white/5 flex justify-end gap-6">
               <button 
                 onClick={handleRequestAudit}
                 className="px-10 py-4 bg-white text-black rounded-2xl font-bold text-[11px] uppercase tracking-widest shadow-xl hover:bg-indigo-50 transition-all active:scale-95 italic"
               >
                 Request Audit
               </button>
            </div>
          </div>

          <div className="bg-[#0b0e14]/30 border border-white/5 rounded-[32px] p-6 shadow-xl">
            <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-4 ml-2">Synthetic Data Synthesizer</h4>
            <div className="flex gap-4">
              <input 
                value={datasetPrompt}
                onChange={(e) => setDatasetPrompt(e.target.value)}
                placeholder="Describe the test distribution (e.g. 100 samples of noisy sin wave...)"
                className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700"
              />
              <button 
                onClick={handleSynthesizeDataset}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-95"
              >
                Synthesize
              </button>
            </div>
          </div>
        </div>

        {/* Audit / Results Sidebar */}
        <div className="lg:col-span-5 flex flex-col h-full space-y-6 overflow-hidden">
          {/* Tab Switcher */}
          <div className="flex bg-[#0b0e14] p-1.5 rounded-2xl border border-white/5 shrink-0">
             <button 
               onClick={() => setActiveTab('Audit')}
               className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'Audit' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
             >
               Audit Log
             </button>
             <button 
               onClick={() => setActiveTab('Data')}
               className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'Data' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
             >
               Dataset Repo
             </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scroll space-y-6">
            {activeTab === 'Audit' ? (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                {audit ? (
                  <>
                    <div className="p-8 rounded-[40px] bg-[#0b0e14] border border-white/5 shadow-xl space-y-8">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                           <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Efficiency Status</span>
                           <div className="text-6xl font-extrabold text-white tracking-tighter italic">{audit.efficiencyScore}%</div>
                        </div>
                        <div className="px-5 py-2 rounded-xl bg-white/5 border border-white/10">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{audit.bigO}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="text-[10px] font-bold text-white uppercase tracking-widest opacity-40">Architectural Review</h5>
                        <p className="text-lg text-slate-300 leading-relaxed font-medium">"{audit.architecturalReview}"</p>
                      </div>

                      <div className="space-y-4">
                         <h5 className="text-[10px] font-bold text-white uppercase tracking-widest opacity-40">Optimizations Suggested</h5>
                         <ul className="space-y-3">
                           {audit.suggestedImprovements.map((imp, idx) => (
                             <li key={idx} className="text-sm text-slate-400 flex gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                               <span className="text-indigo-400 font-black">#</span>
                               {imp}
                             </li>
                           ))}
                         </ul>
                      </div>

                      <div className={`p-6 rounded-2xl border ${audit.isProductionReady ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'} text-[10px] font-bold uppercase tracking-widest text-center italic`}>
                        {audit.isProductionReady ? 'Production Optimized' : 'Architectural Audit Required'}
                      </div>
                    </div>

                    {audit.visualizationData && (
                      <div className="h-[350px] w-full bg-[#0b0e14] rounded-[40px] p-8 border border-white/5">
                        <Visualizer data={audit.visualizationData} />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-[400px] flex flex-col items-center justify-center p-20 text-center space-y-6 bg-[#0b0e14]/20 border border-dashed border-white/5 rounded-[40px]">
                    <div className="text-7xl grayscale opacity-20">🔎</div>
                    <div className="space-y-2">
                       <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Awaiting Neural Kernel</p>
                       <p className="text-xs text-slate-700 max-w-xs mx-auto">Author your logical primitives and request a neural audit to see performance benchmarks.</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 h-full">
                 {dataset ? (
                   <div className="p-8 rounded-[40px] bg-[#0b0e14] border border-white/5 shadow-xl space-y-8 flex flex-col h-full min-h-[500px]">
                     <div className="space-y-2">
                       <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Synthetic Manifest</span>
                       <h3 className="text-3xl font-bold text-white tracking-tight italic">{dataset.name}</h3>
                     </div>
                     
                     <div className="flex-1 bg-black/40 rounded-[32px] p-6 font-mono text-[11px] text-emerald-500/60 overflow-y-auto whitespace-pre custom-scroll border border-white/5">
                       {dataset.data}
                     </div>

                     <button 
                       onClick={() => {
                          const blob = new Blob([dataset.data], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `synthetic_data.${dataset.format}`;
                          a.click();
                       }}
                       className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-white/10 transition-all italic"
                     >
                       Download Artifact (.{dataset.format})
                     </button>
                   </div>
                 ) : (
                   <div className="h-[400px] flex flex-col items-center justify-center p-20 text-center space-y-6 bg-[#0b0e14]/20 border border-dashed border-white/5 rounded-[40px]">
                     <div className="text-7xl grayscale opacity-20">🗃️</div>
                     <div className="space-y-2">
                       <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Synthesizer Idle</p>
                       <p className="text-xs text-slate-700 max-w-xs mx-auto">Use the Synthesizer below to generate high-fidelity datasets for your sandbox kernels.</p>
                     </div>
                   </div>
                 )}
              </div>
            )}
          </div>
        </div>
      </main>
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Sandbox;
