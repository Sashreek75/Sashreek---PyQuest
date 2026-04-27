import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Brain, Database, LineChart, ShieldCheck } from 'lucide-react';
import Card from '../ui/Card';

const PathItem = ({ id, title, icon: Icon, description, isActive, onClick, color }) => (
    <motion.div
        whileHover={{ scale: 1.02, x: 5 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onClick(id)}
        className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
            isActive 
                ? `${color.border} ${color.bg} shadow-[0_0_30px_${color.glow}]` 
                : 'border-white/5 bg-white/5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:border-white/20'
        }`}
    >
        <div className="flex gap-4 relative z-10">
            <div className={`p-3 h-fit rounded-xl ${isActive ? `${color.iconBg} ${color.iconText}` : 'bg-white/10 text-slate-400'}`}>
                <Icon size={24} strokeWidth={2.5} />
            </div>
            <div className="space-y-1">
                <h4 className={`font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>{title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">{description}</p>
            </div>
        </div>

        {/* Selected Indicator */}
        {isActive && (
            <motion.div 
                layoutId="indicator"
                className="absolute right-4 top-4"
            >
                <div className={`size-2 rounded-full ${color.iconBg} animate-pulse shadow-[0_0_10px_currentColor]`} />
            </motion.div>
        )}

        {/* Backdrop Glow */}
        <div className={`absolute -right-10 -bottom-10 size-32 blur-[60px] opacity-20 ${color.iconBg}`} />
    </motion.div>
);

const PathAccelerator = ({ selectedPathId, onSelectPath }) => {
    const paths = [
        {
            id: 'ai-research',
            title: 'AI & Research',
            icon: Brain,
            description: 'Master the math and architectures behind modern LLMs and vision systems.',
            color: {
                border: 'border-purple-500/50',
                bg: 'bg-purple-500/10',
                glow: 'rgba(168,85,247,0.2)',
                iconBg: 'bg-purple-500',
                iconText: 'text-white'
            }
        },
        {
            id: 'competitive-math',
            title: 'Competitive Growth',
            icon: LineChart,
            description: 'Advanced data structures and algorithmic rigor for high-performance builders.',
            color: {
                border: 'border-blue-500/50',
                bg: 'bg-blue-500/10',
                glow: 'rgba(59,130,246,0.2)',
                iconBg: 'bg-blue-500',
                iconText: 'text-white'
            }
        },
        {
            id: 'high-agency-dev',
            title: 'System Architecture',
            icon: ShieldCheck,
            description: 'Build industrial-scale tools. From high-frequency trading to medical data systems.',
            color: {
                border: 'border-emerald-500/50',
                bg: 'bg-emerald-500/10',
                glow: 'rgba(16,185,129,0.2)',
                iconBg: 'bg-emerald-500',
                iconText: 'text-white'
            }
        }
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                    <Database size={14} className="text-primary" />
                    Path Accelerator
                </h3>
                <span className="text-[10px] text-muted-foreground uppercase">Adaptive Guidance</span>
            </div>
            
            <div className="flex flex-col gap-3">
                {paths.map((path) => (
                    <PathItem
                        key={path.id}
                        {...path}
                        isActive={selectedPathId === path.id}
                        onClick={onSelectPath}
                    />
                ))}
            </div>
        </div>
    );
};

export default PathAccelerator;
