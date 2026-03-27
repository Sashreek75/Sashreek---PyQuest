import React, { useState, useEffect, useRef } from 'react';

const LOGS = [
  "CURATING NEW CONCEPTS...",
  "MAPPING KNOWLEDGE PATHS...",
  "REFINING PYTHON SKILLS...",
  "EXPLORING DATA STRUCTURES...",
  "GROWING THE DIGITAL BRAIN...",
  "SYNCING LEARNING PROGRESS...",
  "READY TO LEARN."
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
    <div className="bg-[#ffffff] border border-[#e8e3db] rounded-[32px] p-6 h-full flex flex-col font-mono shadow-sm overflow-hidden group relative">
      <div className="absolute -right-4 top-1/2 -translate-y-1/2 rail-text opacity-10 pointer-events-none">REALTIME_FEED</div>
      <div className="absolute -left-6 -bottom-6 text-8xl font-serif font-black text-[#f5c842] opacity-5 pointer-events-none select-none">01</div>
      <div className="flex items-center justify-between mb-4 border-b border-[#e8e3db] pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#d97706] animate-pulse"></div>
          <span className="text-[10px] font-black text-[#9a9088] uppercase tracking-widest">Live Learning Feed</span>
        </div>
        <span className="text-[9px] font-black text-[#6b6560] uppercase tracking-widest">Stream: Active</span>
      </div>
      <div ref={feedRef} className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide custom-scroll">
        {messages.map((m, i) => (
          <div key={i} className={`text-[10px] ${i === messages.length - 1 ? 'text-[#d97706]' : 'text-[#9a9088]'} transition-colors duration-500`}>
            {m}
          </div>
        ))}
        <div className="w-1.5 h-3 bg-[#d97706]/30 animate-pulse inline-block ml-1"></div>
      </div>
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 0px; }
      `}</style>
    </div>
  );
};

export default AuraFeed;