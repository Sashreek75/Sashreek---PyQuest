import React, { useState } from 'react';
import { RoadmapData, RoadmapNode } from '../types';

interface CareerArchitectProps {
  data: RoadmapData;
}

const CareerArchitect: React.FC<CareerArchitectProps> = ({ data }) => {
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);

  const nodeWidth = 260;
  const nodeHeight = 110;
  
  const getX = (x: number) => 150 + (x / 100) * 700; // Map 0-100 to 150-850 within a 1000px coordinate system

  const connections = data.nodes.flatMap(node => 
    (node.dependencies || []).map(depId => {
      const parent = data.nodes.find(n => n.id === depId);
      if (parent) return { from: parent, to: node };
      return null;
    })
  ).filter(Boolean) as { from: RoadmapNode; to: RoadmapNode }[];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Mastered': return 'bg-[#f5c842] border-[#d97706] text-[#1a1714] hover:bg-[#d97706] hover:text-white';
      case 'Active': return 'bg-[#d97706] border-[#d97706] text-white shadow-[0_20px_50px_rgba(217,119,6,0.3)] hover:scale-110 active-node-pulse';
      default: return 'bg-white border-[#e8e3db] text-[#9a9088] opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all shadow-sm';
    }
  };

  const maxHeight = Math.max(...data.nodes.map(n => n.y)) + 400;

  return (
    <div className="relative w-full py-24 px-6 overflow-x-hidden animate-in fade-in duration-1000 bg-[#faf8f5]">
      <div className="max-w-4xl mx-auto mb-32 text-center space-y-8 relative z-10">
        <div className="absolute -left-20 top-0 rail-text opacity-10 pointer-events-none hidden lg:block">STRATEGIC_PATH</div>
        <div className="inline-block px-4 py-1 rounded-full bg-[#f5c842]/10 border border-[#f5c842]/20 text-[#d97706] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
          Your Learning Journey
        </div>
        <h2 className="text-6xl md:text-8xl font-serif font-black text-[#1a1714] tracking-tighter uppercase leading-none">{data.title}</h2>
        <p className="text-2xl text-[#6b6560] font-medium leading-relaxed max-w-3xl mx-auto">{data.summary}</p>
        <div className="pt-4 flex justify-center gap-12 text-[10px] font-black text-[#9a9088] uppercase tracking-widest">
           <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#f5c842] shadow-[0_0_10px_rgba(245,200,66,0.3)]"></div> Mastered</div>
           <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#d97706] animate-pulse shadow-[0_0_15px_rgba(217,119,6,0.4)]"></div> Current Focus</div>
           <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#e8e3db]"></div> Upcoming</div>
        </div>
      </div>

      <div className="relative w-full" style={{ height: maxHeight }}>
        <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-full">
          {/* SVG Connections */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox={`0 0 1000 ${maxHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="line-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d97706" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f5c842" stopOpacity="0.05" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {connections.map((conn, idx) => {
              const startX = getX(conn.from.x);
              const startY = conn.from.y + (nodeHeight / 2);
              const endX = getX(conn.to.x);
              const endY = conn.to.y + (nodeHeight / 2);

              return (
                <g key={idx}>
                  <path 
                    d={`M ${startX} ${startY} C ${startX} ${startY + 150}, ${endX} ${endY - 150}, ${endX} ${endY}`}
                    stroke="url(#line-grad)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="8 12"
                    className="animate-pulse opacity-40"
                  />
                  <circle r="3" fill="#d97706" filter="url(#glow)">
                    <animateMotion 
                      path={`M ${startX} ${startY} C ${startX} ${startY + 150}, ${endX} ${endY - 150}, ${endX} ${endY}`}
                      dur={`${3 + Math.random() * 2}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {data.nodes.map((node, i) => (
            <div 
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className={`absolute flex flex-col justify-center items-center p-6 border-2 rounded-[40px] cursor-pointer transition-all duration-700 group select-none ${getStatusStyles(node.status)}`}
              style={{ 
                  left: `${getX(node.x)}px`,
                  top: node.y,
                  width: nodeWidth,
                  height: nodeHeight,
                  transform: 'translateX(-50%)',
                  zIndex: node.status === 'Active' ? 50 : 10,
                  animationDelay: `${i * 0.1}s`
              }}
            >
              <div className="absolute -left-4 -top-4 text-4xl font-serif font-black text-[#1a1714] opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-1 group-hover:opacity-100 transition-opacity">{node.category}</div>
              <div className="font-black text-sm uppercase tracking-tight text-center leading-tight group-hover:scale-105 transition-transform">{node.title}</div>
              <div className="mt-2 text-[8px] font-black uppercase tracking-[0.2em] bg-black/5 px-3 py-1 rounded-full border border-black/5">
                {node.duration}
              </div>
              
              <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-white border-2 border-inherit flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform">
                  {node.status === 'Mastered' ? (
                      <svg className="w-5 h-5 text-[#d97706]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  ) : node.status === 'Active' ? (
                      <div className="w-3 h-3 bg-[#d97706] rounded-full animate-ping"></div>
                  ) : (
                      <svg className="w-4 h-4 text-[#e8e3db]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedNode && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12 bg-[#1a1714]/60 backdrop-blur-2xl animate-in fade-in duration-500">
          <div className="max-w-4xl w-full bg-white border border-[#e8e3db] rounded-[64px] p-12 md:p-20 shadow-2xl relative overflow-hidden group max-h-[90vh] overflow-y-auto custom-scroll">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#f5c842]/10 rounded-full blur-[150px] -z-10"></div>
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 rail-text opacity-5 pointer-events-none">NODE_DETAILS</div>
            
            <button 
                onClick={() => setSelectedNode(null)}
                className="absolute top-12 right-12 w-16 h-16 rounded-full bg-[#faf8f5] border border-[#e8e3db] flex items-center justify-center text-[#6b6560] hover:text-[#1a1714] transition-all active:scale-90 hover:rotate-90"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            <div className="space-y-16">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-1px bg-[#d97706] opacity-30"></div>
                  <div className="text-[12px] font-black text-[#d97706] uppercase tracking-[0.6em]">{selectedNode.category}</div>
                </div>
                <h3 className="text-6xl md:text-7xl font-serif font-black text-[#1a1714] tracking-tighter uppercase leading-none">{selectedNode.title}</h3>
                <div className="flex flex-wrap gap-3 pt-4">
                  {(selectedNode.tags || []).map(tag => (
                    <span key={tag} className="px-5 py-2 bg-[#faf8f5] rounded-2xl text-[10px] font-black text-[#6b6560] uppercase border border-[#e8e3db] tracking-widest hover:border-[#f5c842] transition-colors">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-10">
                  <div className="space-y-4">
                    <div className="text-[11px] font-black text-[#9a9088] uppercase tracking-widest">The Mission</div>
                    <p className="text-2xl text-[#4a4540] leading-relaxed font-medium italic">"{selectedNode.description}"</p>
                  </div>

                  {selectedNode.keySkills && selectedNode.keySkills.length > 0 && (
                    <div className="space-y-6">
                      <div className="text-[11px] font-black text-[#9a9088] uppercase tracking-widest">Key Skills & Tools</div>
                      <div className="flex flex-wrap gap-4">
                        {selectedNode.keySkills.map(skill => (
                          <div key={skill} className="flex items-center gap-3 bg-[#f5c842]/5 border border-[#f5c842]/20 px-4 py-3 rounded-2xl">
                            <div className="w-2 h-2 rounded-full bg-[#d97706]"></div>
                            <span className="text-sm font-bold text-[#1a1714] uppercase tracking-tight">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedNode.prerequisites && selectedNode.prerequisites.length > 0 && (
                    <div className="space-y-4">
                      <div className="text-[11px] font-black text-[#9a9088] uppercase tracking-widest">Foundational Prerequisites</div>
                      <div className="space-y-2">
                        {selectedNode.prerequisites.map(pre => (
                          <div key={pre} className="text-lg font-medium text-[#6b6560] flex items-center gap-4">
                            <span className="text-[#d97706]">◈</span> {pre}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-8">
                  <div className="p-10 bg-[#faf8f5] rounded-[48px] border border-[#e8e3db] relative overflow-hidden group/card">
                    <div className="absolute -right-4 -bottom-4 text-6xl font-serif font-black text-[#d97706] opacity-5 group-hover/card:scale-110 transition-transform">01</div>
                    <span className="text-[10px] font-black text-[#d97706] uppercase tracking-widest">Timeline</span>
                    <div className="text-4xl font-black text-[#1a1714] uppercase mt-2">{selectedNode.duration}</div>
                  </div>
                  
                  <div className="p-10 bg-[#faf8f5] rounded-[48px] border border-[#e8e3db] relative overflow-hidden group/card">
                    <div className="absolute -right-4 -bottom-4 text-6xl font-serif font-black text-[#d97706] opacity-5 group-hover/card:scale-110 transition-transform">02</div>
                    <span className="text-[10px] font-black text-[#d97706] uppercase tracking-widest">Status</span>
                    <div className="text-4xl font-black text-[#1a1714] uppercase mt-2">{selectedNode.status}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-10 pt-8 border-t border-[#e8e3db]">
                <div className="text-[11px] font-black text-[#9a9088] uppercase tracking-[0.5em]">Strategic Learning Resources</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(selectedNode.recommendedResources || []).map((res, i) => (
                    <div key={i} className="p-8 bg-[#faf8f5] rounded-[32px] text-xl font-bold text-[#4a4540] border border-[#e8e3db] flex items-center gap-8 hover:border-[#f5c842] hover:bg-white transition-all group/res">
                      <div className="w-12 h-12 rounded-2xl bg-[#f5c842]/10 flex items-center justify-center text-[#d97706] text-sm font-black group-hover/res:bg-[#d97706] group-hover/res:text-white transition-colors">{i+1}</div>
                      <span className="flex-1">{res}</span>
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
          0% { box-shadow: 0 0 20px rgba(217, 119, 6, 0.2); }
          50% { box-shadow: 0 0 50px rgba(217, 119, 6, 0.4); }
          100% { box-shadow: 0 0 20px rgba(217, 119, 6, 0.2); }
        }
        .active-node-pulse {
          animation: nodePulse 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default CareerArchitect;