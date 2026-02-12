
import React, { useState, useEffect, useRef } from 'react';
import { chatWithAura } from '../services/geminiService';

interface Message {
  role: 'user' | 'aura';
  text: string;
}

interface AuraHubProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
}

const AuraHub: React.FC<AuraHubProps> = ({ isOpen, onClose, context }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'aura', text: "Hello, Architect. I am Aura. How can I assist your technical evolution today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const auraResponse = await chatWithAura(userMsg, context);
      setMessages(prev => [...prev, { role: 'aura', text: auraResponse }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'aura', text: "Signal lost. Check your API uplink." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return (
    <button 
      onClick={onClose}
      className="fixed bottom-10 right-10 w-20 h-20 bg-indigo-600 rounded-[24px] flex items-center justify-center text-white shadow-3xl hover:scale-110 active:scale-95 transition-all z-[400] group"
    >
      <div className="absolute -inset-2 bg-indigo-600/20 blur-xl rounded-full animate-pulse group-hover:bg-indigo-600/40"></div>
      <svg className="w-10 h-10 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
      <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-[#010208] animate-pulse"></div>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[450] flex items-end justify-end p-6 md:p-10 pointer-events-none">
      <div className="w-full max-w-md h-[700px] bg-[#0b0e14]/90 backdrop-blur-3xl border border-white/5 rounded-[48px] shadow-3xl flex flex-col pointer-events-auto animate-in slide-in-from-bottom-10 duration-500">
        <header className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-lg crt-flicker">A</div>
            <div>
              <div className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Aura Core</div>
              <div className="text-[8px] font-bold text-emerald-500 uppercase mt-1">Uplink Stable</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white shadow-xl rounded-tr-none' 
                  : 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/5 p-5 rounded-3xl rounded-tl-none border border-white/5 flex gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-8 border-t border-white/5 bg-black/20">
          <div className="relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Aura about ML or Python..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all pr-14"
            />
            <button 
              type="submit"
              disabled={isTyping}
              className="absolute right-2 top-2 w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center hover:bg-indigo-50 transition-all active:scale-95 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 10l7-7m0 0l7 7m-7-7v18" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          <div className="text-center mt-4">
             <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.3em]">Quantum Encrypted Tunnel</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuraHub;
