import React, { useState, useMemo, useEffect } from 'react';
import { Progress, QuestCategory } from '../types';
import { QUESTS } from '../constants';
import DigitalBrain from './DigitalBrain';

interface KnowledgeGraphProps {
  progress: Progress;
  onBack: () => void;
  onSelectCategory: (category: QuestCategory) => void;
}

interface GraphNode {
  id: QuestCategory;
  x: number;
  y: number;
  label: string;
  shortLabel: string;
  icon: string;
  connections: QuestCategory[];
  tier: number;
  description: string;
}

const NODES: GraphNode[] = [
  { 
    id: 'Python Foundations', 
    x: 50, y: 65, 
    label: 'Python Foundations', 
    shortLabel: 'Core',
    icon: '🐍', 
    connections: ['Mathematical Logic', 'Data Engineering'],
    tier: 1,
    description: 'The syntactic backbone of AI development'
  },
  { 
    id: 'Mathematical Logic', 
    x: 28, y: 50, 
    label: 'Mathematical Logic', 
    shortLabel: 'Logic',
    icon: '🔢', 
    connections: ['Classical ML'],
    tier: 2,
    description: 'Statistical foundations and computational thinking'
  },
  { 
    id: 'Data Engineering', 
    x: 72, y: 50, 
    label: 'Data Engineering', 
    shortLabel: 'Data',
    icon: '🗄️', 
    connections: ['Classical ML'],
    tier: 2,
    description: 'Information architecture and pipeline design'
  },
  { 
    id: 'Classical ML', 
    x: 50, y: 38, 
    label: 'Classical ML', 
    shortLabel: 'ML Core',
    icon: '🌳', 
    connections: ['Deep Learning'],
    tier: 3,
    description: 'Traditional algorithms and decision systems'
  },
  { 
    id: 'Deep Learning', 
    x: 50, y: 25, 
    label: 'Deep Learning', 
    shortLabel: 'Neural',
    icon: '🧠', 
    connections: ['Neural Architectures', 'LLM & Transformers'],
    tier: 4,
    description: 'Multi-layer perceptual networks'
  },
  { 
    id: 'Neural Architectures', 
    x: 32, y: 12, 
    label: 'Neural Architectures', 
    shortLabel: 'Arch',
    icon: '🕸️', 
    connections: ['MLOps & Deployment'],
    tier: 5,
    description: 'Advanced topological designs (CNN, RNN, GAN)'
  },
  { 
    id: 'LLM & Transformers', 
    x: 68, y: 12, 
    label: 'LLM & Transformers', 
    shortLabel: 'LLM',
    icon: '✨', 
    connections: ['MLOps & Deployment'],
    tier: 5,
    description: 'Attention mechanisms and language models'
  },
  { 
    id: 'MLOps & Deployment', 
    x: 50, y: 0, 
    label: 'MLOps & Deployment', 
    shortLabel: 'Ops',
    icon: '🚀', 
    connections: [],
    tier: 6,
    description: 'Production systems and industrial scaling'
  },
];

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ progress, onBack, onSelectCategory }) => {
  const [hoveredNode, setHoveredNode] = useState<QuestCategory | null>(null);
  const [selectedNode, setSelectedNode] = useState<QuestCategory | null>(null);
  const [neuralPulses, setNeuralPulses] = useState<Array<{ id: number; from: GraphNode; to: GraphNode; progress: number }>>([]);
  const [viewMode, setViewMode] = useState<'standard' | 'neural'>('standard');

  const stats = useMemo(() => {
    const categoryStats: Record<string, { total: number; completed: number; percent: number }> = {};
    NODES.forEach(node => {
      const catQuests = QUESTS.filter(q => q.category === node.id);
      const compQuests = catQuests.filter(q => progress.completedQuests.includes(q.id));
      categoryStats[node.id] = {
        total: catQuests.length,
        completed: compQuests.length,
        percent: catQuests.length > 0 ? (compQuests.length / catQuests.length) * 100 : 0
      };
    });
    return categoryStats;
  }, [progress.completedQuests]);

  const totalProgress = useMemo(() => {
    const total = Object.values(stats).reduce((acc, s) => acc + s.total, 0);
    const completed = Object.values(stats).reduce((acc, s) => acc + s.completed, 0);
    return total > 0 ? (completed / total) * 100 : 0;
  }, [stats]);

  const isNodeAccessible = (node: GraphNode) => {
    if (node.id === 'Python Foundations') return true;
    const prerequisites = NODES.filter(n => n.connections.includes(node.id));
    return prerequisites.some(prereq => stats[prereq.id].percent === 100);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      NODES.forEach(node => {
        node.connections.forEach(connId => {
          const target = NODES.find(n => n.id === connId);
          if (!target) return;
          const isMastered = stats[node.id].percent === 100;
          if (isMastered || (stats[node.id].percent > 0 && Math.random() > 0.7)) {
            setNeuralPulses(prev => [...prev, {
              id: Date.now() + Math.random(),
              from: node,
              to: target,
              progress: 0
            }]);
          }
        });
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [stats]);

  useEffect(() => {
    const animFrame = setInterval(() => {
      setNeuralPulses(prev => 
        prev
          .map(p => ({ ...p, progress: p.progress + 0.02 }))
          .filter(p => p.progress <= 1)
      );
    }, 30);
    return () => clearInterval(animFrame);
  }, []);

  const handleNodeClick = (e: React.MouseEvent, nodeId: QuestCategory) => {
    e.stopPropagation();
    setSelectedNode(prev => prev === nodeId ? null : nodeId);
  };

  const activePath = useMemo(() => {
    const targetId = selectedNode || hoveredNode;
    if (!targetId) return [];
    const node = NODES.find(n => n.id === targetId);
    if (!node) return [];
    
    const path = [node];
    let current = node;
    while (current) {
      const parent = NODES.find(n => n.connections.includes(current!.id));
      if (parent) {
        path.unshift(parent);
        current = parent;
      } else { break; }
    }
    return path;
  }, [hoveredNode, selectedNode]);

  return (
    <div 
      className="fixed inset-0 z-[500] bg-[#010208] flex flex-col font-jakarta overflow-hidden"
      onClick={() => setSelectedNode(null)}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1800px] h-[1800px] bg-gradient-radial from-indigo-600/10 via-purple-600/5 to-transparent rounded-full blur-[200px] animate-pulse-slow"></div>
        <div className="absolute inset-0 flex items-center justify-center z-0" style={{ opacity: viewMode === 'neural' ? 0.5 : 0.25 }}>
           <div className="w-full h-full scale-150 blur-[1px]">
              <DigitalBrain progress={progress} isBackground />
           </div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]"></div>
      </div>

      <header className="h-24 border-b border-white/10 px-8 md:px-12 flex items-center justify-between bg-[#010208]/95 backdrop-blur-3xl z-50 relative">
        <div className="flex items-center gap-6 md:gap-8">
          <button onClick={onBack} className="text-slate-500 hover:text-white transition-all group flex items-center gap-3">
             <span className="group-hover:-translate-x-1 transition-transform font-black text-xl">←</span>
             <span className="text-[10px] font-bold uppercase tracking-widest italic hidden sm:inline">Back</span>
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic leading-none flex items-center gap-3">
              Neural Blueprint
              <span className="text-indigo-400 text-xs font-black px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">ACTIVE</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-8">
           <div className="text-right">
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Mastery</div>
              <div className="text-2xl md:text-3xl font-black text-white italic leading-none">{totalProgress.toFixed(1)}%</div>
           </div>
           <button
             onClick={(e) => { e.stopPropagation(); setViewMode(viewMode === 'standard' ? 'neural' : 'standard'); }}
             className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all"
           >
             {viewMode === 'standard' ? 'Neural Mode' : 'Standard Mode'}
           </button>
        </div>
      </header>

      <main className="flex-1 relative perspective-[2000px] overflow-hidden z-10">
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'rotateX(20deg)', transformStyle: 'preserve-3d' }}>
          <svg className="w-full h-full max-w-[1400px] max-h-[1400px] overflow-visible" viewBox="0 0 100 80" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="node-glow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <radialGradient id="node-mastered-gradient"><stop offset="0%" stopColor="#10b981" stopOpacity="0.6"/><stop offset="100%" stopColor="#059669" stopOpacity="0.2"/></radialGradient>
              <radialGradient id="node-active-gradient"><stop offset="0%" stopColor="#818cf8" stopOpacity="0.4"/><stop offset="100%" stopColor="#4338ca" stopOpacity="0.1"/></radialGradient>
            </defs>

            {/* Connections */}
            <g>
              {NODES.map(node => node.connections.map(connId => {
                const target = NODES.find(n => n.id === connId);
                if (!target) return null;
                const isMastered = stats[node.id].percent === 100 && stats[target.id].percent === 100;
                const isInPath = activePath.includes(node) && activePath.includes(target);
                return (
                  <g key={`${node.id}-${connId}`}>
                    <path
                      d={`M ${node.x} ${node.y} Q ${(node.x + target.x) / 2} ${(node.y + target.y) / 2 - 5}, ${target.x} ${target.y}`}
                      stroke={isMastered ? 'url(#node-mastered-gradient)' : (isInPath ? '#4f46e5' : '#1e1b4b')}
                      strokeWidth={isInPath ? "0.6" : "0.2"}
                      fill="none"
                      className="transition-all duration-500"
                      strokeDasharray={isMastered ? "none" : "2 4"}
                    />
                    {neuralPulses.filter(p => p.from.id === node.id && p.to.id === connId).map(pulse => (
                      <circle key={pulse.id} cx={node.x + (target.x - node.x) * pulse.progress} cy={node.y + (target.y - node.y) * pulse.progress - 3 * Math.sin(pulse.progress * Math.PI)} r="0.5" fill={isMastered ? '#10b981' : '#818cf8'} opacity={0.8} filter="url(#node-glow)"/>
                    ))}
                  </g>
                );
              }))}
            </g>

            {/* Nodes */}
            <g>
              {NODES.map(node => {
                const nodeStats = stats[node.id];
                const isMastered = nodeStats.percent === 100;
                const isSelected = selectedNode === node.id;
                const isHovered = hoveredNode === node.id;
                const isAccessible = isNodeAccessible(node);
                return (
                  <g 
                    key={node.id} 
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={(e) => handleNodeClick(e, node.id)}
                    style={{ transform: (isHovered || isSelected) ? 'scale(1.2)' : 'scale(1)', transformOrigin: `${node.x}% ${node.y}%`, transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                  >
                    {/* Targeting Reticle */}
                    {isSelected && (
                      <g className="animate-reticle-spin">
                        <circle cx={node.x} cy={node.y} r="10" fill="none" stroke="#4f46e5" strokeWidth="0.5" strokeDasharray="2 10" />
                        <circle cx={node.x} cy={node.y} r="8" fill="none" stroke="#ec4899" strokeWidth="0.2" strokeDasharray="1 5" />
                      </g>
                    )}
                    
                    <circle cx={node.x} cy={node.y} r={isHovered || isSelected ? 8 : 6} fill={isMastered ? 'url(#node-mastered-gradient)' : 'url(#node-active-gradient)'} opacity={(isHovered || isSelected) ? 0.8 : 0.4} />
                    <circle cx={node.x} cy={node.y} r="4" className={`transition-all ${isSelected ? 'fill-indigo-600 stroke-white' : (isMastered ? 'fill-emerald-500/20 stroke-emerald-400' : 'fill-slate-900 stroke-slate-700')}`} strokeWidth={isSelected ? 1.5 : 0.8} opacity={isAccessible ? 1 : 0.4} />
                    <text x={node.x} y={node.y + 1.2} fontSize="2.2" textAnchor="middle" className="pointer-events-none select-none" fill={isSelected ? 'white' : 'inherit'}>{node.icon}</text>
                    <text x={node.x} y={node.y + 7} fontSize="1.4" textAnchor="middle" className={`font-black uppercase tracking-widest ${isSelected ? 'fill-indigo-400' : 'fill-slate-500'}`}>{node.shortLabel}</text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Panel */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 pointer-events-none z-50">
          {selectedNode ? (
            <div className="bg-[#0b0e14]/98 backdrop-blur-3xl border border-white/20 rounded-[48px] p-8 md:p-12 shadow-2xl animate-panel-in pointer-events-auto relative overflow-hidden">
              <button onClick={(e) => { e.stopPropagation(); setSelectedNode(null); }} className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-colors">×</button>
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{NODES.find(n => n.id === selectedNode)?.icon}</span>
                    <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">{selectedNode}</h3>
                  </div>
                  <p className="text-sm text-slate-400 font-medium max-w-md">{NODES.find(n => n.id === selectedNode)?.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-black text-white italic leading-none">{Math.round(stats[selectedNode].percent)}%</div>
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Domain Synced</div>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); if (isNodeAccessible(NODES.find(n => n.id === selectedNode)!)) onSelectCategory(selectedNode!); }}
                className={`w-full py-5 rounded-[32px] font-black text-xs uppercase tracking-widest transition-all italic ${isNodeAccessible(NODES.find(n => n.id === selectedNode)!) ? 'bg-indigo-600 text-white hover:scale-[1.02] shadow-xl' : 'bg-slate-900 text-slate-600 cursor-not-allowed'}`}
              >
                {isNodeAccessible(NODES.find(n => n.id === selectedNode)!) ? 'Initialize Training →' : '🔒 Locked - Complete Foundations'}
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4 opacity-40 mb-8 animate-fade-in">
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.8em]">Click a Domain Node to Inspect</div>
               <div className="flex justify-center gap-2">
                  {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" style={{ animationDelay: `${i*0.2}s` }}></div>)}
               </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes pulse-slow { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
        .animate-pulse-slow { animation: pulse-slow 8s infinite; }
        @keyframes reticle-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-reticle-spin { animation: reticle-spin 10s linear infinite; transform-origin: center; }
        @keyframes panel-in { from { transform: translateY(2rem) translateX(-50%) scale(0.95); opacity: 0; } to { transform: translateY(0) translateX(-50%) scale(1); opacity: 1; } }
        .animate-panel-in { animation: panel-in 0.4s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 0.4; } }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .perspective-\[2000px\] { perspective: 2000px; }
        .bg-gradient-radial { background: radial-gradient(var(--tw-gradient-stops)); }
      `}</style>
    </div>
  );
};

export default KnowledgeGraph;