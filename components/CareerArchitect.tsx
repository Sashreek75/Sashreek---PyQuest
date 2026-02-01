import React, { useState } from 'react';
import { RoadmapData, RoadmapNode } from '../types';

interface CareerArchitectProps {
  data: RoadmapData;
}

const CareerArchitect: React.FC<CareerArchitectProps> = ({ data }) => {
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);

  const nodeWidth = 240;
  const nodeHeight = 90;
  
  const connections = data.nodes.flatMap(node => 
    (node.dependencies || []).map(depId => {
      const parent = data.nodes.find(n => n.id === depId);
      if (parent) return { from: parent, to: node };
      return null;
    })
  ).filter(Boolean) as { from: RoadmapNode; to: RoadmapNode }[];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Mastered': return 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20';
      case 'Active': return 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_60px_rgba(79,70,229,0.5)] hover:scale-110 active-node-pulse';
      default: return 'bg-slate-900 border-slate-800 text-slate-500 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all';
    }
  };

  return (
    <div className="relative w-full py-24 px-6 overflow-x-hidden animate-in fade-in duration-1000">
      <div className="max-w-4xl mx-auto mb-32 text-center space-y-8">
        <div className="inline-block px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
          Strategic Career Architect
        </div>
        <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none crt-flicker">{data.title}</h2>
        <p className="text-2xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto">{data.summary}</p>
        <div className="pt-4 flex justify-center gap-12 text-[10px] font-black text-slate-600 uppercase tracking-widest">
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Mastered</div>
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div> Active Evolution</div>
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-800"></div> Locked Protocol</div>
        </div>
      </div>

      <div className="relative w-full" style={{ height: Math.max(...data.nodes.map(n => n.y)) + 300 }}>
        <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-full">
          {/* SVG Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            <defs>
              <linearGradient id="line-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {connections.map((conn, idx) => {
              const startX = (conn.from.x / 100) * 1000;
              const startY = conn.from.y + (nodeHeight / 2);
              const endX = (conn.to.x / 100) * 1000;
              const endY = conn.to.y + (nodeHeight / 2);

              return (
                <path 
                  key={idx}
                  d={`M ${startX} ${startY} C ${startX} ${startY + 100}, ${endX} ${endY - 100}, ${endX} ${endY}`}
                  stroke="url(#line-grad)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4 6"
                  className="animate-pulse"
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {data.nodes.map((node) => (
            <div 
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className={`absolute flex flex-col justify-center items-center p-6 border-2 rounded-[32px] cursor-pointer transition-all duration-500 group select-none ${getStatusStyles(node.status)}`}
              style={{ 
                  left: `calc(${(node.x / 100) * 1000}px - ${nodeWidth / 2}px)`,
                  top: node.y,
                  width: nodeWidth,
                  height: nodeHeight,
                  zIndex: node.status === 'Active' ? 50 : 10
              }}
            >
              <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50 mb-1 group-hover:opacity-100">{node.category}</div>
              <div className="font-black text-sm uppercase tracking-tight text-center leading-tight">{node.title}</div>
              <div className="mt-2 text-[9px] font-black uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full">
                {node.duration}
              </div>
              
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#010208] border-2 border-inherit flex items-center justify-center shadow-2xl">
                  {node.status === 'Mastered' ? (
                      <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  ) : node.status === 'Active' ? (
                      <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></div>
                  ) : (
                      <svg className="w-3 h-3 text-slate-700" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedNode && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12 bg-[#010208]/90 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="max-w-3xl w-full bg-[#0b0e14] border border-white/5 rounded-[60px] p-12 md:p-20 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -z-10"></div>
            
            <button 
                onClick={() => setSelectedNode(null)}
                className="absolute top-12 right-12 w-14 h-14 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all active:scale-95"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            <div className="space-y-12">
              <div className="space-y-4">
                <div className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em]">{selectedNode.category}</div>
                <h3 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">{selectedNode.title}</h3>
                <div className="flex flex-wrap gap-4 pt-4">
                  {(selectedNode.tags || []).map(tag => (
                    <span key={tag} className="px-4 py-1.5 bg-white/5 rounded-xl text-[10px] font-black text-slate-400 uppercase border border-white/5 tracking-widest">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <p className="text-2xl text-slate-400 leading-relaxed font-medium">{selectedNode.description}</p>
                <div className="grid grid-cols-2 gap-8">
                  <div className="p-8 bg-[#010208] rounded-[40px] border border-white/5">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Time Allotment</span>
                    <div className="text-3xl font-black text-white uppercase">{selectedNode.duration}</div>
                  </div>
                  <div className="p-8 bg-[#010208] rounded-[40px] border border-white/5">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Protocol Status</span>
                    <div className="text-3xl font-black text-white uppercase">{selectedNode.status}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="text-[11px] font-black text-slate-600 uppercase tracking-[0.5em]">Recommended Research Resources</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {(selectedNode.recommendedResources || []).map((res, i) => (
                    <div key={i} className="p-6 bg-slate-900/50 rounded-3xl text-lg font-bold text-slate-300 border border-white/5 flex items-center gap-6 hover:border-indigo-500/30 transition-colors">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xs">{i+1}</div>
                      {res}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes nodePulse {
          0% { box-shadow: 0 0 20px rgba(79, 70, 229, 0.4); }
          50% { box-shadow: 0 0 60px rgba(79, 70, 229, 0.6); }
          100% { box-shadow: 0 0 20px rgba(79, 70, 229, 0.4); }
        }
        .active-node-pulse {
          animation: nodePulse 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default CareerArchitect;