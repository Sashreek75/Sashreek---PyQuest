
import React from 'react';
import { LessonSection } from '../types';

interface LessonContentProps {
  introduction: string;
  sections: LessonSection[];
  summary: string;
}

const LessonContent: React.FC<LessonContentProps> = ({ introduction, sections, summary }) => {
  return (
    <div className="space-y-12 text-slate-300 leading-relaxed font-jakarta pb-24">
      {/* Intro */}
      <section className="space-y-4">
        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.6em]">Introduction</span>
        <p className="text-xl md:text-2xl font-medium text-slate-200">
          {introduction}
        </p>
      </section>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.id} className="animate-in fade-in slide-in-from-bottom-2 duration-700">
          {section.type === 'heading' && (
            <h3 className="text-2xl md:text-3xl font-black text-white mt-12 mb-6 tracking-tight italic">
              {section.content}
            </h3>
          )}

          {section.type === 'text' && (
            <p className="text-lg text-slate-400 font-medium mb-6">
              {section.content}
            </p>
          )}

          {section.type === 'callout' && (
            <div className={`p-8 rounded-[40px] border-2 my-10 ${
              section.variant === 'pro-tip' 
                ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-100' 
                : section.variant === 'warning'
                ? 'bg-rose-600/10 border-rose-500/30 text-rose-100'
                : 'bg-emerald-600/10 border-emerald-500/30 text-emerald-100'
            }`}>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl">
                  {section.variant === 'pro-tip' ? '💡' : section.variant === 'warning' ? '⚠️' : '🧠'}
                </span>
                <span className="text-[11px] font-black uppercase tracking-widest">
                  {section.title || 'Note'}
                </span>
              </div>
              <p className="text-lg font-bold italic leading-snug">
                {section.content}
              </p>
            </div>
          )}

          {section.type === 'code-demo' && (
            <div className="bg-[#05070d] border border-white/5 rounded-[32px] overflow-hidden my-8">
              <div className="px-6 py-3 bg-white/5 border-b border-white/5 flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">{section.content}</span>
                <span className="text-[9px] font-black text-indigo-500 uppercase">Example</span>
              </div>
              <pre className="p-8 text-indigo-300 font-mono text-lg overflow-x-auto">
                <code>{section.snippet}</code>
              </pre>
            </div>
          )}
        </div>
      ))}

      {/* Summary */}
      <section className="p-10 bg-indigo-600/5 border border-white/5 rounded-[48px] space-y-4">
        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.6em]">Lesson Summary</span>
        <p className="text-lg text-slate-400 font-medium italic">
          {summary}
        </p>
      </section>
    </div>
  );
};

export default LessonContent;
