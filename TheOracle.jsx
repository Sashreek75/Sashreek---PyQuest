import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, MessageSquare, X, Send, User, Brain, Shield, Rocket,
    Settings, Terminal, ExternalLink, RefreshCw, Key
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Mermaid from './Mermaid';
import Card from './Card';
import Button from './Button';
import { askTheOracle } from '../../utils/aiAssistant';
import StorageManager from '../../utils/storageManager';
import { STORAGE_KEYS } from '../../constants';

const hasBuiltInKey = () => !!import.meta.env.VITE_GEMINI_API_KEY;

const TheOracle = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [apiKeyInput, setApiKeyInput] = useState(StorageManager.getItem(STORAGE_KEYS.ORACLE_KEY) || '');
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState([
        { role: 'oracle', content: "Hi! I'm **Pythia**, your AI Systems Co-Pilot. \n\nI can help you with:\n- ⚙️ System design & architecture\n- 🤖 Agent workflows & debugging\n- 🗺️ Engineering roadmap advice\n- 📚 Finding the right modules\n\nWhat are we building today?" }
    ]);
    const scrollRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history, isTyping]);

    const handleSaveKey = () => {
        StorageManager.setItem(STORAGE_KEYS.ORACLE_KEY, apiKeyInput);
        setShowSettings(false);
    };

    const handleSend = async () => {
        const query = message.trim();
        if (!query) return;
        
        // 1. Gather Neural Context (Implicit Workspace Awareness)
        const activeGoal = StorageManager.getItem(STORAGE_KEYS.ACTIVE_GOAL);
        
        // Try to detect lesson context from URL
        const pathParts = window.location.pathname.split('/');
        const lessonContext = {
            lessonTitle: document.title.replace(' | PyQuest', ''),
            careerGoal: activeGoal,
            currentCode: localStorage.getItem('pyquest_last_code') || '', // Standardize this key
            lessonObjectives: [] // Could be expanded by cross-referencing pathParts
        };

        const userMsg = { role: 'user', content: query };
        setHistory(prev => {
            const updated = [...prev, userMsg];
            return updated.length > 100 ? updated.slice(-100) : updated;
        });
        setMessage('');
        setIsTyping(true);

        try {
            const response = await askTheOracle(query, history, lessonContext);
            setHistory(prev => {
                const updated = [...prev, { role: 'oracle', content: response }];
                return updated.length > 100 ? updated.slice(-100) : updated;
            });
        } catch (error) {
            setHistory(prev => {
                const updated = [...prev, { role: 'oracle', content: "Neural Core Synchronization Failed. Re-initializing link..." }];
                return updated.length > 100 ? updated.slice(-100) : updated;
            });
        } finally {
            setIsTyping(false);
        }
    };

    const handleQuickAction = (label) => {
        setMessage(label);
    };


    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="w-[420px] max-h-[650px] h-[85vh] flex flex-col bg-[#000d1a]/80 backdrop-blur-3xl rounded-[3rem] border border-primary/20 shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-white/5 flex items-center justify-between relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-black border border-primary/30 text-primary shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                                    <Sparkles size={24} className="animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="font-black text-white text-xl tracking-tighter uppercase leading-none mb-1">Pythia</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="size-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">AI Systems Co-Pilot</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setShowSettings(!showSettings)}
                                    className={`size-10 rounded-full flex items-center justify-center transition-all ${showSettings ? 'bg-primary text-black' : 'hover:bg-white/5 text-slate-400'}`}
                                >
                                    <Settings size={20} />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="size-10 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* History or Settings */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide relative">
                            <AnimatePresence>
                                {showSettings ? (
                                    <motion.div
                                        key="settings"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="h-full flex flex-col items-center justify-center text-center space-y-6 p-4"
                                    >
                                        <div className={`size-16 rounded-full flex items-center justify-center border ${hasBuiltInKey() ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                                            {hasBuiltInKey() ? <Shield size={32} /> : <Key size={32} />}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg mb-2">Pythia Settings</h4>
                                            {hasBuiltInKey() ? (
                                                <div className="space-y-2">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                                        <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">AI Connected</span>
                                                    </div>
                                                    <p className="text-slate-400 text-sm">Pythia is fully powered. Ask me anything about system design or AI workflows!</p>
                                                </div>
                                            ) : (
                                                <p className="text-slate-400 text-sm">Add a Gemini API key to enable AI-powered responses.</p>
                                            )}
                                        </div>
                                        <div className="w-full space-y-2">
                                            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold text-left">{hasBuiltInKey() ? 'Custom API Key (Optional Override)' : 'API Key'}</p>
                                            <input 
                                                type="password"
                                                value={apiKeyInput}
                                                onChange={(e) => setApiKeyInput(e.target.value)}
                                                placeholder={hasBuiltInKey() ? 'Leave empty to use built-in key...' : 'Paste your API key here...'}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all"
                                            />
                                        </div>
                                        <div className="flex gap-3 w-full">
                                            <Button 
                                                variant="outline" 
                                                className="flex-1 border-white/10 text-white" 
                                                onClick={() => setShowSettings(false)}
                                            >
                                                Back
                                            </Button>
                                            <Button 
                                                className="flex-1 bg-primary text-black"
                                                onClick={handleSaveKey}
                                            >
                                                {apiKeyInput ? 'Save Key' : 'Clear Override'}
                                            </Button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    history.map((msg, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: msg.role === 'oracle' ? -20 : 20, y: 10 }}
                                            animate={{ opacity: 1, x: 0, y: 0 }}
                                            className={`flex items-start gap-4 ${msg.role === 'oracle' ? 'justify-start' : 'justify-end'}`}
                                        >
                                            {msg.role === 'oracle' && (
                                                <div className="size-10 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-1 shadow-lg">
                                                    <Brain size={20} />
                                                </div>
                                            )}
                                            <div className={`p-6 rounded-[2.5rem] max-w-[90%] text-sm leading-relaxed relative prose prose-invert prose-p:my-1 prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 ${
                                                msg.role === 'oracle' 
                                                    ? 'bg-white/5 text-slate-100 border border-white/10 rounded-tl-none shadow-2xl' 
                                                    : 'bg-primary text-black font-medium rounded-tr-none shadow-[0_15px_40px_rgba(255,215,0,0.25)]'
                                            }`}>
                                                {msg.role === 'oracle' ? (
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            code({ node, inline, className, children, ...props }) {
                                                                const match = /language-(\w+)/.exec(className || '');
                                                                if (match && match[1] === 'mermaid') {
                                                                    return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                                                                }
                                                                return !inline ? (
                                                                    <div className="relative group/code my-2">
                                                                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                                                                            <span className="text-[10px] text-slate-500 font-mono">{match ? match[1] : 'code'}</span>
                                                                        </div>
                                                                        <code className={`${className} block overflow-x-auto p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-xs`} {...props}>
                                                                            {children}
                                                                        </code>
                                                                    </div>
                                                                ) : (
                                                                    <code className="px-1.5 py-0.5 rounded bg-white/10 text-primary font-mono text-xs" {...props}>
                                                                        {children}
                                                                    </code>
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                ) : (
                                                    <div className="whitespace-pre-wrap">{msg.content}</div>
                                                )}
                                            </div>
                                            {msg.role === 'user' && (
                                                <div className="size-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white flex-shrink-0 mt-1">
                                                    <User size={20} />
                                                </div>
                                            )}
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                            
                            {isTyping && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-3 p-5 rounded-[2rem] rounded-tl-none bg-white/5 border border-white/10 w-24"
                                >
                                    <span className="dot animate-bounce size-1.5 bg-primary rounded-full" />
                                    <span className="dot animate-bounce size-1.5 bg-primary rounded-full delay-100" />
                                    <span className="dot animate-bounce size-1.5 bg-primary rounded-full delay-200" />
                                </motion.div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-7 bg-black/50 border-t border-white/5 backdrop-blur-xl">
                            <div className="relative group">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                                    placeholder="Ask Pythia about systems, architecture, or code..."
                                    className="w-full bg-black/40 border border-white/10 rounded-3xl pl-5 pr-14 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all resize-none h-16 shadow-inner"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!message.trim() || isTyping}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 size-11 rounded-2xl bg-primary text-black flex items-center justify-center hover:bg-yellow-400 disabled:opacity-50 disabled:grayscale transition-all shadow-lg active:scale-95"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                            <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                <QuickAction label="How do I get XP?" icon={RefreshCw} onClick={() => handleQuickAction("How do I earn XP in PyQuest?")} />
                                <QuickAction label="Review Architecture" icon={Terminal} onClick={() => handleQuickAction("Please review this code architecture and give me feedback on its design and efficiency:\n\n```python\n# Paste your code here\n\n```")} />
                                <QuickAction label="Show Challenges" icon={Rocket} onClick={() => handleQuickAction("Show me the available challenges.")} />
                                <QuickAction label="Learning Path" icon={Brain} onClick={() => handleQuickAction("What modules should I focus on next?")} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Float Trigger */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="group size-20 rounded-[2.5rem] bg-gradient-to-br from-primary via-amber-500 to-amber-600 text-black flex items-center justify-center shadow-[0_20px_50px_rgba(255,215,0,0.4)] hover:shadow-[0_20px_60px_rgba(255,215,0,0.6)] transition-all relative z-[101] overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                {isOpen ? <X size={32} /> : <Sparkles size={32} className="animate-pulse" />}
                
                {/* Visual Ping */}
                {!isOpen && (
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -top-1 -right-1 size-6 bg-red-500 rounded-full border-4 border-[#000d1a] z-10"
                    />
                )}
            </motion.button>
        </div>
    );
};

const QuickAction = ({ label, icon: Icon, onClick }) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 hover:bg-primary/20 border border-white/5 hover:border-primary/40 text-[10px] text-slate-400 hover:text-primary uppercase tracking-widest font-black transition-all whitespace-nowrap"
    >
        <Icon size={14} />
        {label}
    </button>
);

export default TheOracle;
