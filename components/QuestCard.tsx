
import React from 'react';
import { Quest, Difficulty } from '../types';

interface QuestCardProps {
  quest: Quest;
  isCompleted: boolean;
  onSelect: (quest: Quest) => void;
}

const getDifficultyColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case 'Beginner': return 'text-[#16a34a] bg-[#16a34a]/5 border-[#16a34a]/10';
    case 'Intermediate': return 'text-[#d97706] bg-[#d97706]/5 border-[#d97706]/10';
    case 'Advanced': return 'text-[#b91c1c] bg-[#b91c1c]/5 border-[#b91c1c]/10';
    default: return 'text-[#6b6560] bg-[#6b6560]/5 border-[#6b6560]/10';
  }
};

const QuestCard: React.FC<QuestCardProps> = ({ quest, isCompleted, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(quest)}
      className={`relative group cursor-pointer p-8 rounded-[40px] border transition-all duration-500 ${
        isCompleted 
          ? 'bg-white border-[#16a34a]/20 shadow-sm opacity-80 hover:opacity-100' 
          : 'bg-white border-[#e8e3db] hover:border-[#f5c842] hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      <div className="flex justify-between items-start mb-8">
        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border ${getDifficultyColor(quest.difficulty)}`}>
          {quest.difficulty}
        </span>
        {isCompleted && (
          <div className="bg-[#16a34a]/10 text-[#16a34a] p-2 rounded-full border border-[#16a34a]/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      <h3 className="text-3xl font-serif font-black tracking-tighter text-[#1a1714] mb-4 group-hover:text-[#d97706] transition-colors italic leading-none">
        {quest.title}
      </h3>
      <p className="text-[#6b6560] text-base font-medium line-clamp-2 mb-8 leading-relaxed">
        {quest.description}
      </p>

      <div className="flex flex-wrap gap-2 pt-4 border-t border-[#faf8f5]">
        {quest.topics.slice(0, 3).map(topic => (
          <span key={topic} className="text-[9px] uppercase tracking-widest font-black text-[#9a9088] bg-[#faf8f5] border border-[#e8e3db] px-3 py-1.5 rounded-xl">
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
};

export default QuestCard;
