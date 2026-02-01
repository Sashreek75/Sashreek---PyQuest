
import React, { useState } from 'react';
import { RoadmapData, RoadmapNode } from '../types';

interface CareerArchitectProps {
  data: RoadmapData;
}

const CareerArchitect: React.FC<CareerArchitectProps> = ({ data }) => {
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);

  // Layout constants
  const nodeWidth = 220;
  const nodeHeight = 80;
  const padding = 100;
  
  // Find connections (dependencies)
  const connections = data.nodes.flatMap(node => 
    (node.dependencies || []).map(depId => {
      const parent = data.nodes.find(n => n.id === depId);
      if (parent) return { from: parent, to: node };
      return null;
    })
  ).filter(Boolean) as { from: RoadmapNode; to: RoadmapNode }[];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Mastered': return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400';
      case 'Active': return 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_30px_rgba(79,70,229,0.4)]';
      default: return 'bg-slate-900 border-slate-800 text-slate-500 opacity-60';
    }
  };

  return (
    <div className="relative w-full min-h-[800px] py-20 px-10 overflow-x-auto select-none animate-in fade-in duration-1000">
      <div className="max-w-4xl mx-auto mb-20 text-center space-y-6">
        <h2 className="text-6xl font-black text-white tracking-tighter uppercase">{data.title}</h2>
        <div className="flex items-center justify-center gap-4">
            <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-black uppercase tracking-widest">
                Target: {data.careerPath}
            </span>
        </div>
        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">{data.summary}</p>
      </div>

      <div className="relative mx-auto" style={{ height: Math.max(...data.nodes.map(n => n.y)) + 200 }}>
        {/* SVG Connections Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: '1000px' }}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155" />
            </marker>
          </defs>
          {connections.map((conn, idx) => {
            const startX = conn.from.x + nodeWidth / 2;
            const startY = conn.from.y + nodeHeight;
            const endX = conn.to.x + nodeWidth / 2;
            const endY = conn.to.y;

            const midY = startY + (endY - startY) / 2;

            return (
              <path 
                key={idx}
                d={`M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`}
                stroke="#334155"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrow)"
                className="transition-all duration-700"
              />
            );
          })}
        </svg>

        {/* Nodes Layer */}
        {data.nodes.map((node) => (
          <div 
            key={node.id}
            onClick={() => setSelectedNode(node)}
            className={`absolute flex flex-col justify-center items-center p-6 border-2 rounded-[24px] cursor-pointer transition-all duration-500 hover:scale-110 z-10 ${getStatusStyles(node.status)}`}
            style={{ 
                left: `calc(50% + ${node.x - 50}px * 4)`, // Centering logic with multiplier
                top: node.y,
                width: nodeWidth,
                height: nodeHeight
            }}
          >
            <div className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">{node.category}</div>
            <div className="font-black text-sm uppercase tracking-tighter text-center leading-tight">{node.title}</div>
            <div className="mt-2 text-[9px] font-black uppercase tracking-widest opacity-50">{node.duration}</div>
            
            {/* Status Indicator */}
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#010208] border border-inherit flex items-center justify-center shadow-xl">
                {node.status === 'Mastered' ? (
                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                ) : node.status === 'Active' ? (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                ) : (
                    <svg className="w-4 h-4 text-slate-700" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* Node Detail Modal */}
      {selectedNode && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-[#010208]/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="max-w-2xl w-full bg-slate-900 border border-white/5 rounded-[48px] p-16 shadow-3xl space-y-10 relative">
            <button 
                onClick={() => setSelectedNode(null)}
                className="absolute top-10 right-10 w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            <div className="space-y-4">
              <div className="text-xs font-black text-indigo-400 uppercase tracking-[0.5em]">{selectedNode.category}</div>
              <h3 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">{selectedNode.title}</h3>
              <div className="flex gap-4">
                {selectedNode.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-950 rounded-lg text-[10px] font-black text-slate-500 uppercase border border-white/5">{tag}</span>
                ))}
              </div>
            </div>

            <div className="space-y-6 text-xl text-slate-400 leading-relaxed font-medium">
              <p>{selectedNode.description}</p>
              <div className="p-6 bg-[#010208] rounded-[32px] border border-white/5">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Expected Effort</span>
                <div className="text-2xl font-black text-white mt-1">{selectedNode.duration}</div>
              </div>
            </div>

            <div className="space-y-6">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Recommended Resources</span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(selectedNode.recommendedResources || []).map((res, i) => (
                  <li key={i} className="p-4 bg-slate-950 rounded-2xl text-sm font-bold text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    {res}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerArchitect;
