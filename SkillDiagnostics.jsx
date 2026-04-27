import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain, Zap, Target, Star } from 'lucide-react';
import Card from '../ui/Card';

const SkillBar = ({ label, value, color, icon: Icon, delay }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-md ${color.bg} ${color.text}`}>
                    <Icon size={14} />
                </div>
                <span className="text-sm font-semibold text-slate-300 uppercase tracking-tighter">{label}</span>
            </div>
            <span className={`text-sm font-bold ${color.text}`}>{value}%</span>
        </div>
        <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}
                className={`h-full rounded-full ${color.gradient} shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
            />
            {/* Glossy Overlay */}
            <div className="absolute inset-x-0 top-0 h-[40%] bg-white/10" />
        </div>
    </div>
);

const SkillDiagnostics = ({ skills = [] }) => {
    // Default skills if none provided
    const displaySkills = skills.length > 0 ? skills : [
        { 
            label: "Algorithmic Rigor", 
            value: 68, 
            icon: Target, 
            color: { 
                bg: "bg-blue-500/20", 
                text: "text-blue-400", 
                gradient: "bg-gradient-to-r from-blue-600 to-cyan-400" 
            } 
        },
        { 
            label: "AI Systems Architecture", 
            value: 42, 
            icon: Brain, 
            color: { 
                bg: "bg-purple-500/20", 
                text: "text-purple-400", 
                gradient: "bg-gradient-to-r from-purple-600 to-pink-400" 
            } 
        },
        { 
            label: "Creative Execution", 
            value: 85, 
            icon: Zap, 
            color: { 
                bg: "bg-amber-500/20", 
                text: "text-amber-400", 
                gradient: "bg-gradient-to-r from-amber-600 to-yellow-400" 
            } 
        },
        { 
            label: "High-Agency Ownership", 
            value: 74, 
            icon: Shield, 
            color: { 
                bg: "bg-emerald-500/20", 
                text: "text-emerald-400", 
                gradient: "bg-gradient-to-r from-emerald-600 to-teal-400" 
            } 
        }
    ];

    // Prevent NaN if displaySkills is empty
    const overallScore = displaySkills.length > 0 
        ? Math.round(displaySkills.reduce((acc, s) => acc + s.value, 0) / displaySkills.length)
        : 0;

    return (
        <Card className="p-6 bg-[#0a0f1e]/80 border-white/10 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 -tr-10 w-32 h-32 bg-primary/5 rounded-full blur-[60px]" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <Star className="text-primary fill-primary/20" size={20} />
                        Intellectual Growth Diagnostic
                    </h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Real-time Capability Mapping</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-white">{overallScore}</span>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Aggregate PR</span>
                </div>
            </div>

            <div className="space-y-6 relative z-10">
                {displaySkills.map((skill, index) => (
                    <SkillBar 
                        key={skill.label} 
                        {...skill} 
                        delay={0.2 + index * 0.1} 
                    />
                ))}
            </div>

            {/* Assessment Note */}
            <div className="mt-8 p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-400 italic">
                "Growth is not the accumulation of info, but the expansion of capability. Push into the unknowns."
            </div>

            {/* Animated Scanning Line */}
            <motion.div 
                className="absolute left-0 right-0 h-px bg-primary/20 z-0"
                animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
        </Card>
    );
};

export default SkillDiagnostics;
