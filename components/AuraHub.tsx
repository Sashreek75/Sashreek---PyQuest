
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
      text: "👋 Hello! I am **Aura**, your mentor here. \n\nI've been looking at your journey toward becoming a **" + (personalization?.ambition || "Python Expert") + "**. Ready to dive into some code or need to talk through a concept? I'm here to help! 🚀",
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
        text: "Oops! I had a brief hiccup. 🛠️ Could you try sending that again?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    { label: "Review My Code 🔍", prompt: "Could you take a look at my current code and see if there are any ways to make it more readable or efficient?" },
    { label: "Explain a Concept 🧠", prompt: "I'm having a bit of trouble understanding how loops work. Could you explain it using a simple real-world analogy?" },
    { label: "Learning Strategy 🗺️", prompt: "Based on my progress, what should I focus on next to reach my goals?" },
    { label: "Python Tips ⚡", prompt: "What are some common Python best practices I should know as a beginner?" }
  ];

  if (!isOpen) {
    return (
      <button 
        onClick={onOpen}
        className="fixed bottom-10 right-10 z-[100] w-20 h-20 bg-[#f5c842] rounded-[32px] flex items-center justify-center text-[#1a1714] shadow-[0_20px_50px_rgba(245,200,66,0.3)] hover:scale-110 active:scale-95 transition-all group"
      >
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#d97706] rounded-full border-4 border-[#faf8f5] animate-pulse"></div>
        <svg className="w-10 h-10 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-[#faf8f5] flex font-sans animate-in fade-in duration-500">
      <aside className="w-80 border-r border-[#e8e3db] bg-[#ffffff] flex-col hidden lg:flex">
        <div className="p-10 border-b border-[#e8e3db]">
           <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 bg-[#f5c842] rounded-xl flex items-center justify-center font-black text-[#1a1714] italic">A</div>
              <span className="text-[11px] font-black text-[#1a1714] uppercase tracking-[0.3em]">Learning Terminal</span>
           </div>
           <button 
             onClick={() => setMessages([messages[0]])}
             className="w-full py-4 border border-[#e8e3db] bg-[#faf8f5] rounded-2xl text-[10px] font-bold text-[#6b6560] uppercase tracking-widest hover:bg-[#e8e3db] hover:text-[#1a1714] transition-all flex items-center justify-center gap-3"
           >
             <span className="text-lg">+</span> New Conversation
           </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scroll">
           <div className="text-[9px] font-black text-[#9a9088] uppercase tracking-[0.4em] px-4 mb-6">Learning History</div>
           {[
             { title: "Python Basics - Variables", active: true },
             { title: "Loops and Logic", active: false },
             { title: "Data Structures Intro", active: false },
             { title: "Project Planning", active: false }
           ].map((thread, i) => (
             <button key={i} className={`w-full text-left p-4 rounded-2xl border transition-all ${thread.active ? 'bg-[#f5c842]/10 border-[#f5c842]/20 text-[#d97706]' : 'border-transparent text-[#6b6560] hover:bg-[#faf8f5]'}`}>
               <div className="text-xs font-bold truncate tracking-tight">{thread.title}</div>
               <div className="text-[9px] font-bold uppercase tracking-widest opacity-40 mt-1">Active Session</div>
             </button>
           ))}
        </div>

        <div className="p-10 border-t border-[#e8e3db] space-y-6">
           <div className="p-6 bg-[#f5c842]/5 border border-[#f5c842]/10 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 bg-[#d97706] rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black text-[#d97706] uppercase tracking-widest">Aura Online</span>
              </div>
              <div className="text-[10px] font-bold text-[#6b6560] leading-relaxed uppercase italic tracking-tighter">Ready to help you grow.</div>
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_50%_10%,rgba(245,200,66,0.05)_0%,transparent_50%)]">
        <header className="h-24 border-b border-[#e8e3db] px-12 flex items-center justify-between bg-[#ffffff]/80 backdrop-blur-xl z-20">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-[#9a9088] uppercase tracking-widest">Conversation with</span>
              <div className="h-px w-8 bg-[#e8e3db]"></div>
              <span className="text-[10px] font-black text-[#d97706] uppercase tracking-widest">Aura Mentor</span>
            </div>
            <h2 className="text-xl font-black text-[#1a1714] uppercase tracking-tighter mt-1 italic">Mentorship Session</h2>
          </div>

          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-[#faf8f5] border border-[#e8e3db] flex items-center justify-center text-[#6b6560] hover:text-[#1a1714] hover:bg-[#e8e3db] transition-all group"
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
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f5c842] to-[#d97706] flex-shrink-0 flex items-center justify-center text-[#1a1714] text-xl font-black italic shadow-md">
                    A
                  </div>
                )}
                
                <div className={`flex flex-col space-y-3 ${msg.role === 'user' ? 'items-end' : 'max-w-3xl'}`}>
                  <div className={`px-10 py-7 rounded-[32px] text-lg leading-relaxed font-medium transition-all ${
                    msg.role === 'user' 
                      ? 'bg-[#1a1714] text-white shadow-lg rounded-tr-lg' 
                      : 'bg-[#ffffff] border border-[#e8e3db] text-[#4a4540] shadow-sm rounded-tl-lg'
                  }`}>
                    {msg.text.split('\n').map((line, i) => {
                      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                         return <li key={i} className="ml-4 mb-2 list-disc">{line.trim().substring(2)}</li>;
                      }
                      if (line.trim().startsWith('### ')) {
                         return <h3 key={i} className="text-[#1a1714] font-bold text-xl mb-4 mt-6">{line.trim().substring(4)}</h3>;
                      }
                      return (
                        <p key={i} className={line.startsWith('```') ? 'font-mono text-sm bg-[#faf8f5] p-4 rounded-xl my-4 text-[#d97706] border border-[#e8e3db]' : 'mb-4'}>
                          {line}
                        </p>
                      );
                    })}
                  </div>
                  <span className="text-[9px] font-black text-[#9a9088] uppercase tracking-widest px-4 opacity-50">{msg.timestamp}</span>
                </div>

                {msg.role === 'user' && (
                  <div className="w-12 h-12 rounded-2xl bg-[#ffffff] border border-[#e8e3db] flex-shrink-0 flex items-center justify-center text-[#6b6560] text-lg font-bold">
                    U
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-8 animate-pulse">
                <div className="w-12 h-12 rounded-2xl bg-[#f5c842]/20 flex-shrink-0 flex items-center justify-center text-[#d97706]/50 text-xl font-black italic">A</div>
                <div className="px-10 py-7 bg-[#ffffff] border border-[#e8e3db] rounded-[32px] rounded-tl-lg">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-[#f5c842] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#f5c842] rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-[#f5c842] rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-12 border-t border-[#e8e3db] flex flex-col items-center bg-[#ffffff]/80 backdrop-blur-xl z-20">
          <div className="max-w-4xl w-full space-y-10">
            <div className="flex flex-wrap gap-3 justify-center">
              {suggestions.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(undefined, s.prompt)}
                  className="px-6 py-2.5 rounded-full border border-[#e8e3db] bg-[#faf8f5] text-[10px] font-bold text-[#6b6560] uppercase tracking-widest hover:border-[#f5c842] hover:bg-[#f5c842]/10 hover:text-[#1a1714] transition-all hover:-translate-y-1"
                >
                  {s.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSend} className="relative group">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Aura anything about Python, learning, or code..."
                className="w-full bg-[#ffffff] border border-[#e8e3db] rounded-[48px] px-12 py-9 text-xl text-[#1a1714] outline-none focus:border-[#f5c842] focus:bg-[#faf8f5] transition-all pr-32 shadow-sm"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-[#1a1714] text-white rounded-[32px] flex items-center justify-center font-black transition-all hover:scale-105 active:scale-95 disabled:opacity-20 shadow-md"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
            
            <div className="flex items-center justify-center gap-4 opacity-30">
               <div className="w-1 h-1 bg-[#f5c842] rounded-full"></div>
               <span className="text-[9px] font-black text-[#6b6560] uppercase tracking-[0.6em]">Secure Mentorship Protocol</span>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AuraHub;
