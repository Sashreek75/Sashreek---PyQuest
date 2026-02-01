import React, { useState, useEffect, useRef } from 'react';

const LOGS = [
  "INITIALIZING NEURAL KERNEL...",
  "AUDITING SYNAPTIC WEIGHTS...",
  "DETECTING LOGICAL ANOMALIES...",
  "OPTIMIZING GRADIENT FLOW...",
  "SCANNING CAREER TRAJECTORY...",
  "ALIGNING TENSOR OBJECTIVES...",
  "READY FOR INFERENCE."
];

const AuraFeed: React.FC = () => {
  const [messages, setMessages] = useState<string[]>(["SYSTEM READY."]);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomLog = LOGS[Math.floor(Math.random() * LOGS.length)];
      setMessages(prev => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${randomLog}`]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-[#050810]/80 backdrop-blur-xl border border-white/5 rounded-[32px] p-6 h-full flex flex-col font-mono shadow-2xl overflow-hidden group">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Aura Feed</span>
        </div>
        <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest">Stream: Active</span>
      </div>
      <div ref={feedRef} className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide custom-scroll">
        {messages.map((m, i) => (
          <div key={i} className={`text-[10px] ${i === messages.length - 1 ? 'text-indigo-400' : 'text-slate-600'} transition-colors duration-500`}>
            {m}
          </div>
        ))}
        <div className="w-1.5 h-3 bg-indigo-500/50 animate-pulse inline-block ml-1"></div>
      </div>
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 0px; }
      `}</style>
    </div>
  );
};

export default AuraFeed;