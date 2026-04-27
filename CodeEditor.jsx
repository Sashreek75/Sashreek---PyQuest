import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
    Play, RotateCcw, Lightbulb, X, Check, 
    Zap, Shield, Target, Award, Brain, 
    ArrowRight, Activity, Cpu, Code2
} from 'lucide-react';
import Button from '../ui/Button';
import { runPythonCode } from '../../utils/codeRunner';
import { evaluateCodeWithAI } from '../../utils/aiAssistant';
import { motion, AnimatePresence } from 'framer-motion';

const CodeEditor = ({ initialCode, onRun, onChange, instruction = 'Solve this problem' }) => {
    const [code, setCode] = useState(initialCode || '');
    const [output, setOutput] = useState('');
    const [isError, setIsError] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [evaluation, setEvaluation] = useState(null);
    const [showEvaluation, setShowEvaluation] = useState(false);
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
    };

    const handleRun = async () => {
        setIsRunning(true);
        setOutput('');
        setIsError(false);
        try {
            const result = await runPythonCode(code);
            if (result.error) {
                setOutput((result.output && result.output !== '(No output)' ? result.output + '\n' : '') + result.error);
            } else {
                setOutput(result.output);
            }
            setIsError(!!result.error);
            if (onRun) onRun(result);
        } catch (err) {
            setOutput(err.message);
            setIsError(true);
        } finally {
            setIsRunning(false);
        }
    };

    const handleEvaluate = async () => {
        if (!code.trim()) return;
        setIsEvaluating(true);
        try {
            const result = await evaluateCodeWithAI(code, instruction, 'python');
            setEvaluation(result);
            setShowEvaluation(true);
        } catch (err) {
            console.error('Evaluation error:', err);
        } finally {
            setIsEvaluating(false);
        }
    };

    return (
        <div className="flex flex-col h-full rounded-3xl overflow-hidden border border-white/5 bg-[#0a0d14] shadow-2xl relative">
            {/* Editor Toolbar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-md border-b border-white/5 gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1.5 grayscale opacity-50 group-hover:grayscale-0 transition-all">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                        <Code2 size={12} className="text-primary" />
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">main.py</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
                    <Button variant="ghost" size="sm" onClick={() => setCode(initialCode || '')} className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white flex-1 md:flex-none">
                        <RotateCcw size={12} className="mr-2" /> Reset
                    </Button>
                    <Button size="sm" onClick={handleEvaluate} disabled={isEvaluating || !code} className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500 hover:text-black flex-1 md:flex-none">
                        <Brain size={12} className="mr-2" />
                        {isEvaluating ? 'Checking...' : 'Get Feedback'}
                    </Button>
                    <Button size="sm" onClick={handleRun} disabled={isRunning} className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 flex-auto md:flex-none">
                        <Play size={12} className="mr-2 fill-current" />
                        {isRunning ? 'Running...' : 'Run Code'}
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row h-[600px] md:h-auto min-h-0">
                <div className="flex-1 min-h-0 border-r border-white/5 relative">
                    <div className="absolute top-0 right-0 p-4 z-10 opacity-10 pointer-events-none">
                        <Cpu size={120} className="text-primary" />
                    </div>
                    <Editor
                        height="100%"
                        defaultLanguage="python"
                        theme="vs-dark"
                        value={code}
                        onChange={(v) => { setCode(v); if (onChange) onChange(v); }}
                        onMount={handleEditorDidMount}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: 'on',
                            renderLineHighlight: 'all',
                            fontFamily: "'JetBrains Mono', monospace",
                            scrollBeyondLastLine: false,
                            padding: { top: 20, bottom: 20 },
                            backgroundColor: '#0a0d14'
                        }}
                    />
                </div>

                {/* Console */}
                <div className="w-full md:w-[35%] bg-black/60 flex flex-col border-t md:border-t-0 md:border-l border-white/5">
                    <div className="px-6 py-4 bg-black/40 border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Output Terminal
                    </div>
                    <div className="flex-1 p-6 font-mono text-sm overflow-auto custom-scrollbar">
                        {output ? (
                            <pre className={`whitespace-pre-wrap ${isError ? "text-rose-400" : "text-emerald-400"}`}>
                                {output}
                            </pre>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-20">
                                <Activity size={32} />
                                <p className="text-[10px] font-black uppercase tracking-widest leading-none">Run your code to see output</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Evaluation Modal */}
            <AnimatePresence>
                {showEvaluation && evaluation && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-start md:items-center justify-center z-[2000] p-4 md:p-6 overflow-y-auto" onClick={() => setShowEvaluation(false)}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#0a0d14] border border-white/10 rounded-2xl md:rounded-[2.5rem] max-w-4xl w-full flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] my-8" onClick={(e) => e.stopPropagation()}>
                            {/* Modal Header */}
                            <div className="p-4 md:p-8 border-b border-white/5 bg-gradient-to-r from-sky-500/10 to-transparent flex items-start md:items-center justify-between">
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                                    <div className="size-12 md:size-16 shrink-0 bg-sky-500/20 rounded-2xl flex items-center justify-center border border-sky-500/30">
                                        <Award size={24} className="text-sky-400 md:size-[32px]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Code Review</h3>
                                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Score:</span>
                                            <span className="px-2 py-0.5 bg-sky-500 text-black text-[10px] font-black rounded">{evaluation.overallScore}/100</span>
                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">• Source: {evaluation.source === 'real-api' ? 'AI Powered' : 'Offline Mode'}</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setShowEvaluation(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-500"><X size={24}/></button>
                            </div>

                            <div className="p-4 md:p-8 space-y-6 md:space-y-8">
                                {/* Scores Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {[
                                        { label: 'Correctness', score: evaluation.correctness.score, icon: Shield, color: 'text-indigo-400' },
                                        { label: 'Efficiency', score: evaluation.efficiency.score, icon: Zap, color: 'text-amber-400' },
                                        { label: 'Code Style', score: evaluation.style.score, icon: Activity, color: 'text-emerald-400' },
                                        { label: 'Maintainability', score: evaluation.maintainability.score, icon: Target, color: 'text-rose-400' },
                                        { label: 'Edge Cases', score: evaluation.edgeCases.score, icon: Brain, color: 'text-purple-400' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-white/3 border border-white/5 rounded-2xl p-4 text-center space-y-2">
                                            <item.icon size={16} className={`mx-auto ${item.color}`} />
                                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-600">{item.label}</p>
                                            <p className={`text-xl font-black ${item.score >= 8 ? 'text-white' : 'text-slate-400'}`}>{item.score}/10</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 md:gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2"><Check size={12}/> Strengths</h4>
                                        <div className="space-y-2">
                                            {evaluation.strengths.map((s, i) => (
                                                <div key={i} className="flex items-center gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-xs text-emerald-100/70">
                                                    <span className="size-1 rounded-full bg-emerald-500 shrink-0" /> {s}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2"><Target size={12}/> Suggestions</h4>
                                        <div className="space-y-2">
                                            {evaluation.improvements.map((s, i) => (
                                                <div key={i} className="flex items-start gap-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-xs text-amber-100/70">
                                                    <span className="size-1 rounded-full bg-amber-500 shrink-0 mt-1.5" /> <span className="flex-1">{s}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Refactored Code */}
                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-bold text-sky-400 uppercase tracking-widest flex gap-2"><Cpu size={12}/> Improved Version</h4>
                                        <span className="text-[10px] font-mono text-slate-600 uppercase">{evaluation.efficiency.bigO}</span>
                                    </div>
                                    <div className="group relative">
                                        <pre className="p-4 md:p-6 bg-black rounded-xl md:rounded-3xl border border-white/5 font-mono text-xs text-sky-300 leading-relaxed overflow-x-auto">
                                            {evaluation.refactoredCode}
                                        </pre>
                                    </div>
                                    <p className="text-xs text-slate-500 italic leading-relaxed border-l-2 border-white/5 pl-4">{evaluation.efficiency.comment}</p>
                                </div>

                                {/* Learning Guidance */}
                                <div className="p-4 md:p-6 bg-sky-500/5 border border-sky-500/10 rounded-xl md:rounded-3xl space-y-2 text-left">
                                    <h5 className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Next steps</h5>
                                    <p className="text-sm text-slate-300 leading-relaxed font-light">{evaluation.learningPath}</p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 md:p-8 border-t border-white/5 bg-black/40 flex flex-col md:flex-row gap-4">
                                <Button onClick={() => setShowEvaluation(false)} variant="ghost" className="w-full md:flex-1 h-12 md:h-14 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white">
                                    Close
                                </Button>
                                <Button onClick={() => { setCode(evaluation.refactoredCode); setShowEvaluation(false); }} className="w-full md:flex-[2] h-12 md:h-14 bg-sky-500 text-black font-bold uppercase tracking-widest text-xs shadow-lg shadow-sky-500/20">
                                    Apply Improved Code <ArrowRight size={16} className="ml-2"/>
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CodeEditor;
