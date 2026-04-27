import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Box, Code2, Cpu, Globe, Lock, Shield, Share2 } from 'lucide-react';
import Card from '../ui/Card';

const SkillNode = ({ icon: Icon, title, status, x, y, delay }) => {
    const statusColors = {
        mastered: 'text-primary border-primary bg-primary/20 shadow-[0_0_20px_rgba(255,215,0,0.3)]',
        unlocked: 'text-white border-white/20 bg-white/5 hover:border-primary/50 transition-all cursor-pointer',
        locked: 'text-slate-600 border-white/5 bg-transparent opacity-40'
    };

    return (
        <motion.div
            style={{ left: `${x}%`, top: `${y}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, type: "spring" }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 p-3 rounded-xl border-2 z-10 ${statusColors[status]}`}
        >
            <Icon size={20} />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-slate-400">
                {title}
            </div>
        </motion.div>
    );
};

const SkillTree = () => {
    const nodes = [
        { id: 1, icon: Code2, title: 'Primitives', status: 'mastered', x: 50, y: 15, delay: 0.1 },
        { id: 2, icon: Box, title: 'Structures', status: 'mastered', x: 30, y: 40, delay: 0.2 },
        { id: 3, icon: Cpu, title: 'Logic', status: 'mastered', x: 70, y: 40, delay: 0.3 },
        { id: 4, icon: GitBranch, title: 'Algorithms', status: 'unlocked', x: 20, y: 70, delay: 0.4 },
        { id: 5, icon: Globe, title: 'Systems', status: 'unlocked', x: 40, y: 70, delay: 0.5 },
        { id: 6, icon: Lock, title: 'Security', status: 'locked', x: 60, y: 70, delay: 0.6 },
        { id: 7, icon: Shield, title: 'Reliability', status: 'locked', x: 80, y: 70, delay: 0.7 }
    ];

    const connections = [
        { from: 0, to: 1 }, { from: 0, to: 2 },
        { from: 1, to: 3 }, { from: 1, to: 4 },
        { from: 2, to: 5 }, { from: 2, to: 6 }
    ];

    return (
        <Card className="p-8 h-[400px] relative overflow-hidden bg-gradient-to-br from-black/60 to-primary/5 border-primary/20">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                        <Share2 size={18} />
                    </div>
                    <div>
                        <h3 className="font-black text-white uppercase tracking-tighter">Neural Network</h3>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Growth Connectivity</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs font-mono text-primary">Mastery: 42%</p>
                </div>
            </div>

            <div className="absolute inset-0 top-20">
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <defs>
                        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                    {connections.map((conn, i) => {
                        const fromNode = nodes[conn.from];
                        const toNode = nodes[conn.to];
                        return (
                            <motion.line
                                key={i}
                                x1={`${fromNode.x}%`}
                                y1={`${fromNode.y - 15}%`}
                                x2={`${toNode.x}%`}
                                y2={`${toNode.y - 15}%`}
                                stroke="url(#lineGrad)"
                                strokeWidth="2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                            />
                        );
                    })}
                </svg>

                {nodes.map(node => (
                    <SkillNode key={node.id} {...node} />
                ))}
            </div>

            {/* Atmosphere Decor */}
            <div className="absolute -bottom-10 -right-10 size-40 bg-primary/10 rounded-full blur-3xl" />
        </Card>
    );
};

export default SkillTree;
