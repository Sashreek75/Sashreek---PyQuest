import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Trophy, BookOpen, Zap, Check, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '../../context/LearningContext';

const ModuleCard = ({ module, index, isRecommended = false }) => {
    const navigate = useNavigate();
    const { getModuleStatus } = useLearning();
    
    const status = getModuleStatus(module.id);
    if (!status) return null;

    const outcomes = (module.outcomes || []).slice(0, 2);
    
    const {
        isLocked,
        isCompleted,
        inProgress,
        completionPct,
        completedLessonsCount,
        totalLessonsCount,
        missingPrerequisites,
        statusClass
    } = status;

    const defaultPath = `/modules/${module.id}/lesson/${status.nextLessonId || 'intro'}`;

    const diffColors = {
        beginner: { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', glow: 'rgba(52,211,153,0.15)' },
        intermediate: { text: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', glow: 'rgba(251,191,36,0.15)' },
        advanced: { text: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20', glow: 'rgba(251,113,133,0.15)' }
    };
    const dc = diffColors[module.difficulty] || diffColors.beginner;

    const handleClick = () => {
        if (isLocked) return;
        navigate(defaultPath);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.06, 0.5), duration: 0.4 }}
            whileHover={!isLocked ? { scale: 1.02, y: -4 } : {}}
            className={`group relative ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'} ${isRecommended ? 'ring-2 ring-primary/50' : ''}`}
            onClick={handleClick}
        >
            {isRecommended && (
                <div className="absolute -top-3 left-4 z-20 bg-primary text-black text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg animate-bounce">
                    <Sparkles size={10} /> RECOMMENDED
                </div>
            )}

            {!isLocked && (
                <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                    style={{ background: `radial-gradient(ellipse at 50% 50%, ${dc.glow}, transparent 70%)` }}
                />
            )}

            <div className={`bg-[#0a0d14]/80 backdrop-blur-2xl rounded-2xl p-6 h-full border relative overflow-hidden flex flex-col transition-all duration-500 shadow-xl hover:shadow-[0_0_40px_rgba(0,0,0,0.5)] ${
                isLocked
                    ? 'border-white/5 opacity-50 grayscale'
                    : isCompleted
                    ? 'border-emerald-500/30'
                    : inProgress
                    ? 'border-primary/40'
                    : 'border-white/10 hover:border-primary/50'
            }`}>
                {!isLocked && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                )}

                <div className="flex justify-between items-start mb-5 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className={`size-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${dc.bg} border ${dc.border}`}>
                            {module.icon || '📘'}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-[0.2em] ${dc.bg} ${dc.text} border ${dc.border} inline-flex items-center w-max`}>
                                {module.difficulty}
                            </span>
                            {module.tier && (
                                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                                    {module.tier} tier
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                        {isLocked ? (
                            <div className="p-2 rounded-lg bg-white/5">
                                <Lock size={18} className="text-slate-600" />
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                                <Trophy size={12} />
                                <span className="text-xs font-black">{module.xp} XP</span>
                            </div>
                        )}
                    </div>
                </div>

                <h3 className={`text-lg font-bold mb-2 transition-colors line-clamp-1 ${
                    isCompleted ? 'text-emerald-400' : 'text-white group-hover:text-primary'
                }`}>
                    {module.title}
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-3">
                    {module.mission || module.description}
                </p>

                {isLocked && missingPrerequisites.length > 0 && (
                    <div className="mb-3 p-2.5 rounded-lg bg-black/40 border border-white/10">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                            Prerequisites Required
                        </p>
                        <p className="text-xs text-slate-500 mt-1 truncate">
                            {missingPrerequisites.join(', ')}
                        </p>
                    </div>
                )}

                {outcomes.length > 0 && (
                    <div className="mb-3 space-y-1.5">
                        {outcomes.map((outcome) => (
                            <div key={outcome} className="flex items-start gap-2 text-xs text-slate-400">
                                <Zap size={10} className="text-primary/60 mt-0.5 flex-shrink-0" />
                                <span className="line-clamp-1">{outcome}</span>
                            </div>
                        ))}
                    </div>
                )}

                {(inProgress || isCompleted) && (
                    <div className="mb-3">
                        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                            <span>{completedLessonsCount}/{totalLessonsCount} lessons</span>
                            <span className={isCompleted ? 'text-emerald-400' : 'text-primary'}>{completionPct}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${completionPct}%` }}
                                className={`h-full rounded-full transition-all duration-500 ${
                                    isCompleted ? 'bg-emerald-500' : 'bg-primary'
                                }`}
                            />
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <Clock size={12} />
                            <span>{module.estimatedTime || '20m'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <BookOpen size={12} />
                            <span>{totalLessonsCount} lessons</span>
                        </div>
                    </div>

                    <motion.div
                        whileHover={!isLocked ? { x: 4 } : {}}
                        className={`p-2 rounded-lg transition-all ${
                            isLocked
                                ? 'bg-white/5 text-slate-600'
                                : isCompleted
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : inProgress
                                ? 'bg-primary text-black'
                                : 'bg-primary/20 text-primary'
                        }`}
                    >
                        {isLocked ? <Lock size={16} /> : isCompleted ? <Check size={16} /> : <ArrowRight size={16} />}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default ModuleCard;
