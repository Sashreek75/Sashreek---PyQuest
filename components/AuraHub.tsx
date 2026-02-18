
import React, { useState, useEffect, useRef } from 'react';
import { chatWithAura } from '../services/geminiService';
import { UserPersonalization } from '../types';

interface Message {
  id: string;
  role: 'user' | 'aura';
  text: string;
  timestamp: string;
}

interface AuraHubProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  context?: string;
  personalization?: UserPersonalization;
}

const AuraHub: React.FC<AuraHubProps> = ({ isOpen, onOpen, onClose, context, personalization }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'init-1',
      role: 'aura', 
      text: "👋 Neural link established! I am **Aura**, your lead mentor here. \n\nI've analyzed your professional trajectory toward becoming a **" + (personalization?.ambition || "Expert Architect") + "**. Ready to dive into some complex logic or need a strategic code review? Let's build something incredible! 🚀",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent, customMsg?: string) => {
    if (e) e.preventDefault();
    const msgToSend = customMsg || input;
    if (!msgToSend.trim() || isTyping) return;

    const userMsg: Message = { 
      id: Date.now().toString(),
      role: 'user', 
      text: msgToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setInput('');
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const auraResponse = await chatWithAura(msgToSend, context, personalization);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(),
        role: 'aura', 
        text: auraResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(),
        role: 'aura', 
        text: "Oops! My logic core had a brief hiccup. 🛠️ Could you try sending that again?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    { label: "Review My Logic 🔍", prompt: "Could you take a look at my current code and see if there are any performance bottlenecks or 'un-pythonic' patterns?" },
    { label: "Explain a Concept 🧠", prompt: "I'm having a bit of trouble visualizing backpropagation. Could you explain it using a really simple real-world analogy?" },
    { label: "Career Strategy 🗺️", prompt: "Based on my progress so far, what technical skill should I prioritize to reach my career goal faster?" },
    { label: "Optimize Tensors ⚡", prompt: "What are some best practices for optimizing tensor operations to reduce memory usage in production?" }
  ];

  if (!isOpen) {
    return (
      <button 
        onClick={onOpen}
        className="fixed bottom-10 right-10 z-[100] w-20 h-20 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white shadow-[0_20px_50px_rgba(79,70,229,0.4)] hover:scale-110 active:scale-95 transition-all group"
      >
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-[#010208] animate-pulse"></div>
        <svg className="w-10 h-10 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-[#010208] flex font-jakarta animate-in fade-in duration-500">
      <aside className="w-80 border-r border-white/5 bg-[#05070d] flex-col hidden lg:flex">
        <div className="p-10 border-b border-white/5">
           <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white italic">P</div>
              <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Oracle Terminal</span>
           </div>
           <button 
             onClick={() => setMessages([messages[0]])}
             className="w-full py-4 border border-white/5 bg-white/5 rounded-2xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3"
           >
             <span className="text-lg">+</span> Initialize New Thread
           </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scroll">
           <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] px-4 mb-6">Neural History</div>
           {[
             { title: "Big O Analysis - Matrix", active: true },
             { title: "Tensor Core Diagnostics", active: false },
             { title: "Gradient Flow Review", active: false },
             { title: "LLM Path Synthesis", active: false }
           ].map((thread, i) => (
             <button key={i} className={`w-full text-left p-4 rounded-2xl border transition-all ${thread.active ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-100' : 'border-transparent text-slate-500 hover:bg-white/5'}`}>
               <div className="text-xs font-bold truncate tracking-tight">{thread.title}</div>
               <div className="text-[9px] font-bold uppercase tracking-widest opacity-40 mt-1">Active_Session</div>
             </button>
           ))}
        </div>

        <div className="p-10 border-t border-white/5 space-y-6">
           <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Aura Online</span>
              </div>
              <div className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase italic tracking-tighter">Strategically synced to your goal.</div>
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_50%_10%,rgba(79,70,229,0.05)_0%,transparent_50%)]">
        <header className="h-24 border-b border-white/5 px-12 flex items-center justify-between bg-[#010208]/80 backdrop-blur-xl z-20">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Conversation with</span>
              <div className="h-px w-8 bg-slate-800"></div>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Aura Mentor</span>
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter mt-1 italic">Knowledge Exchange</h2>
          </div>

          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-rose-500 transition-all group"
          >
            <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-12 py-16 custom-scroll flex flex-col items-center">
          <div className="max-w-4xl w-full space-y-12">
            {messages.map((msg, idx) => (
              <div key={msg.id} className={`flex gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'aura' && (
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 flex-shrink-0 flex items-center justify-center text-white text-xl font-black italic shadow-xl">
                    A
                  </div>
                )}
                
                <div className={`flex flex-col space-y-3 ${msg.role === 'user' ? 'items-end' : 'max-w-3xl'}`}>
                  <div className={`px-10 py-7 rounded-[32px] text-lg leading-relaxed font-medium transition-all ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white shadow-2xl rounded-tr-lg' 
                      : 'bg-[#0b0e14] border border-white/5 text-slate-300 shadow-xl rounded-tl-lg'
                  }`}>
                    {msg.text.split('\n').map((line, i) => {
                      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                         return <li key={i} className="ml-4 mb-2 list-disc">{line.trim().substring(2)}</li>;
                      }
                      if (line.trim().startsWith('### ')) {
                         return <h3 key={i} className="text-white font-bold text-xl mb-4 mt-6">{line.trim().substring(4)}</h3>;
                      }
                      return (
                        <p key={i} className={line.startsWith('```') ? 'font-mono text-sm bg-black/40 p-4 rounded-xl my-4 text-emerald-400 border border-white/5' : 'mb-4'}>
                          {line}
                        </p>
                      );
                    })}
                  </div>
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-4 opacity-50">{msg.timestamp}</span>
                </div>

                {msg.role === 'user' && (
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center text-slate-500 text-lg font-bold">
                    U
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-8 animate-pulse">
                <div className="w-12 h-12 rounded-2xl bg-indigo-900/40 flex-shrink-0 flex items-center justify-center text-indigo-400/50 text-xl font-black italic">A</div>
                <div className="px-10 py-7 bg-[#0b0e14]/50 border border-white/5 rounded-[32px] rounded-tl-lg">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-12 border-t border-white/5 flex flex-col items-center bg-[#010208]/80 backdrop-blur-xl z-20">
          <div className="max-w-4xl w-full space-y-10">
            <div className="flex flex-wrap gap-3 justify-center">
              {suggestions.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(undefined, s.prompt)}
                  className="px-6 py-2.5 rounded-full border border-white/5 bg-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-white transition-all hover:-translate-y-1"
                >
                  {s.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSend} className="relative group">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Aura anything about ML, career, or code..."
                className="w-full bg-[#0b0e14] border border-white/10 rounded-[48px] px-12 py-9 text-xl text-white outline-none focus:border-indigo-600 focus:bg-black/40 transition-all pr-32 shadow-3xl"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-white text-black rounded-[32px] flex items-center justify-center font-black transition-all hover:scale-105 active:scale-95 disabled:opacity-20 shadow-2xl"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
            
            <div className="flex items-center justify-center gap-4 opacity-30">
               <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
               <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.6em]">Secure Mentor Handshake Protocol</span>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0,0,0,1); }
      `}</style>
    </div>
  );
};

export default AuraHub;
