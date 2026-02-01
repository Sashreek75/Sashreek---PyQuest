
import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizOverlayProps {
  questions: QuizQuestion[];
  onComplete: (passed: boolean) => void;
  onClose: () => void;
}

const QuizOverlay: React.FC<QuizOverlayProps> = ({ questions, onComplete, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isWrong, setIsWrong] = useState(false);

  const current = questions[currentIdx];

  const handleNext = () => {
    if (selected === current.correctAnswer) {
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx(currentIdx + 1);
        setSelected(null);
        setIsWrong(false);
      } else {
        onComplete(true);
      }
    } else {
      setIsWrong(true);
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
      <div className={`max-w-md w-full bg-slate-900 border-2 rounded-3xl p-8 shadow-2xl transition-transform ${isWrong ? 'animate-bounce' : ''} ${isWrong ? 'border-rose-500' : 'border-indigo-500/50'}`}>
        <div className="flex justify-between items-center mb-8">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Module Knowledge Check</span>
          <span className="text-slate-500 text-xs font-bold">{currentIdx + 1} / {questions.length}</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-6 leading-tight">{current.question}</h3>

        <div className="space-y-3">
          {current.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setSelected(idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium ${
                selected === idx 
                  ? 'border-indigo-500 bg-indigo-500/20 text-white' 
                  : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-600'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 text-slate-500 font-bold hover:text-white transition-colors">Abort</button>
          <button 
            disabled={selected === null}
            onClick={handleNext}
            className="flex-1 py-3 bg-indigo-600 rounded-xl text-white font-black shadow-lg shadow-indigo-600/30 disabled:opacity-50"
          >
            {currentIdx + 1 === questions.length ? 'Finish Module' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizOverlay;
