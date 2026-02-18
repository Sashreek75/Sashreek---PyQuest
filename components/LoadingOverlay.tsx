import React from 'react';

interface LoadingOverlayProps {
  message: string;
  subMessage?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message, subMessage }) => {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#010208]/95 backdrop-blur-2xl">
      <div className="text-center space-y-12 max-w-lg w-full px-10 animate-in zoom-in duration-500">
        <div className="relative w-40 h-40 mx-auto">
          {/* Neural Mesh Animation */}
          <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
          <div className="absolute inset-4 border-4 border-violet-500/30 rounded-full animate-[spin_7s_linear_infinite_reverse]"></div>
          <div className="absolute inset-8 border-4 border-emerald-500/20 rounded-full animate-[spin_15s_linear_infinite]"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center font-black text-black text-2xl shadow-[0_0_50px_rgba(255,255,255,0.3)] animate-pulse">
              P
            </div>
          </div>

          {/* Floating Data Bits */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-violet-400 rounded-full animate-ping delay-700"></div>
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-1 bg-emerald-400 rounded-full animate-ping delay-300"></div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none animate-pulse">
            {message}
          </h2>
          {subMessage && (
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em]">
              {subMessage}
            </p>
          )}
        </div>

        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 w-[60%] animate-[shimmer_2s_infinite_linear]"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-left font-mono text-[8px] text-slate-700 space-y-1">
            <div>&gt; CALL_AURA_KERNEL</div>
            <div>&gt; AUTH_SECURE_LINK</div>
            <div>&gt; STATUS: OK</div>
          </div>
          <div className="text-right font-mono text-[8px] text-slate-700 space-y-1">
            <div>BUFFERING_TENSORS...</div>
            <div>LATENCY: 42MS</div>
            <div>NODES: ACTIVE</div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;