
import React from 'react';
import { Quest, Difficulty } from '../types';

interface QuestCardProps {
  quest: Quest;
  isCompleted: boolean;
  onSelect: (quest: Quest) => void;
}

const getDifficultyColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case 'Beginner': return 'text-emerald-400 bg-emerald-400/10';
    case 'Intermediate': return 'text-amber-400 bg-amber-400/10';
    case 'Advanced': return 'text-rose-400 bg-rose-400/10';
    default: return 'text-slate-400 bg-slate-400/10';
  }
};

const QuestCard: React.FC<QuestCardProps> = ({ quest, isCompleted, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(quest)}
      className={`relative group cursor-pointer p-6 rounded-2xl border transition-all duration-300 ${
        isCompleted 
          ? 'bg-slate-800/40 border-emerald-500/30' 
          : 'bg-slate-800/80 border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getDifficultyColor(quest.difficulty)}`}>
          {quest.difficulty}
        </span>
        {isCompleted && (
          <div className="bg-emerald-500/20 text-emerald-400 p-1 rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
        {quest.title}
      </h3>
      <p className="text-slate-400 text-sm line-clamp-2 mb-4">
        {quest.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {quest.topics.slice(0, 3).map(topic => (
          <span key={topic} className="text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded">
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
};

export default QuestCard;
