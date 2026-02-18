import React, { useMemo, useEffect, useState } from 'react';
import { Progress, UserStats } from '../types';

interface DigitalBrainProps {
  progress: Progress;
  stats?: UserStats;
  isBackground?: boolean;
}

const DigitalBrain: React.FC<DigitalBrainProps> = ({ progress, stats, isBackground = false }) => {
  const [pulseNodes, setPulseNodes] = useState<Array<{ x: number; y: number; id: number }>>([]);
  
  const growth = useMemo(() => {
    const base = (progress.experience / 15000) + (progress.completedQuests.length / 20);
    return Math.min(1, base);
  }, [progress]);

  // Calculate brain expansion based on learning
  const brainScale = useMemo(() => {
    return 1 + (growth * 0.3); // Brain grows up to 30% larger
  }, [growth]);

  // Number of active neural pathways
  const activePathways = useMemo(() => {
    return Math.min(15, Math.floor(growth * 20));
  }, [growth]);

  // Simulate new synaptic connections forming
  useEffect(() => {
    if (isBackground) return;
    
    const interval = setInterval(() => {
      const newNode = {
        x: 30 + Math.random() * 40,
        y: 25 + Math.random() * 50,
        id: Date.now() + Math.random()
      };
      
      setPulseNodes(prev => {
        const updated = [...prev, newNode];
        return updated.slice(-8); // Keep last 8 nodes
      });
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [isBackground, growth]);

  // Enhanced neural tracks with growth-based activation
  const neuralTracks = useMemo(() => {
    const tracks = [
      { d: "M50 20 Q 30 20, 20 40 T 30 70", color: "#f472b6", delay: "0s", active: growth > 0.1 },
      { d: "M50 20 Q 70 20, 80 40 T 70 70", color: "#60a5fa", delay: "1.5s", active: growth > 0.2 },
      { d: "M50 15 Q 50 40, 30 50 T 20 80", color: "#fbbf24", delay: "3s", active: growth > 0.3 },
      { d: "M50 15 Q 50 40, 70 50 T 80 80", color: "#4f46e5", delay: "0.5s", active: growth > 0.15 },
      { d: "M35 30 Q 50 30, 65 30", color: "#a78bfa", delay: "2.2s", active: growth > 0.4 },
      { d: "M25 55 Q 50 55, 75 55", color: "#34d399", delay: "1.1s", active: growth > 0.25 },
      { d: "M50 20 V 85", color: "#ffffff", delay: "4s", active: true }, // Neural Stem always active
      { d: "M40 35 Q 50 45, 60 35", color: "#06b6d4", delay: "3.5s", active: growth > 0.5 },
      { d: "M30 65 Q 50 70, 70 65", color: "#ec4899", delay: "2.8s", active: growth > 0.6 },
      { d: "M25 45 L 50 50 L 75 45", color: "#f59e0b", delay: "1.8s", active: growth > 0.45 },
      { d: "M35 75 Q 50 80, 65 75", color: "#8b5cf6", delay: "4.2s", active: growth > 0.7 },
      { d: "M22 30 Q 35 25, 50 28", color: "#10b981", delay: "3.2s", active: growth > 0.35 },
      { d: "M78 30 Q 65 25, 50 28", color: "#3b82f6", delay: "2.5s", active: growth > 0.55 },
      { d: "M50 20 Q 40 50, 35 85", color: "#d946ef", delay: "5s", active: growth > 0.65 },
      { d: "M50 20 Q 60 50, 65 85", color: "#14b8a6", delay: "4.5s", active: growth > 0.75 }
    ];
    
    return tracks.filter(t => t.active);
  }, [growth]);

  // Cortical regions that light up based on activity
  const corticalRegions = useMemo(() => [
    { cx: 35, cy: 35, label: "Logic", color: "#4f46e5", intensity: growth > 0.2 ? 0.3 : 0.1 },
    { cx: 65, cy: 35, label: "Memory", color: "#ec4899", intensity: growth > 0.3 ? 0.3 : 0.1 },
    { cx: 50, cy: 50, label: "Processing", color: "#f59e0b", intensity: growth > 0.4 ? 0.4 : 0.1 },
    { cx: 30, cy: 65, label: "Analysis", color: "#10b981", intensity: growth > 0.5 ? 0.3 : 0.1 },
    { cx: 70, cy: 65, label: "Synthesis", color: "#06b6d4", intensity: growth > 0.6 ? 0.3 : 0.1 }
  ], [growth]);

  return (
    <div className={`brain-core-container ${isBackground ? 'background-mode' : 'interactive-mode'}`}>
      <div className="brain-viewport" style={{ transform: `scale(${brainScale})` }}>
        <svg viewBox="0 0 100 120" className="brain-anatomy-svg">
          <defs>
            {/* Enhanced neural bloom effect */}
            <filter id="neural-bloom" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Intense glow for active regions */}
            <filter id="region-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            {/* Dynamic gradient based on growth */}
            <radialGradient id="lobe-gradient" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.2 + growth * 0.3} />
              <stop offset="50%" stopColor="#ec4899" stopOpacity={0.15 + growth * 0.2} />
              <stop offset="100%" stopColor="#010208" stopOpacity="0.05" />
            </radialGradient>

            {/* Pulsing gradient for active learning */}
            <radialGradient id="pulse-gradient">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8">
                <animate attributeName="stop-opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background energy field */}
          <g className="energy-field" opacity={growth * 0.3}>
            <circle cx="50" cy="50" r="45" fill="url(#pulse-gradient)" filter="blur(15px)" />
          </g>

          {/* Neural Stem / Spinal Connection */}
          <g className="neural-stem" filter="url(#neural-bloom)">
            <path 
              d="M50 85 Q 50 105, 52 115" 
              stroke="rgba(79, 70, 229, 0.4)" 
              strokeWidth="1.5" 
              fill="none"
              style={{ strokeDasharray: '10', strokeDashoffset: '0' }}
            >
              <animate attributeName="stroke-dashoffset" from="0" to="20" dur="2s" repeatCount="indefinite" />
            </path>
            <path d="M50 85 Q 50 105, 48 115" stroke="rgba(79, 70, 229, 0.2)" strokeWidth="0.8" fill="none" />
            <circle cx="50" cy="115" r="1.5" fill="#4f46e5" className="animate-pulse" />
            <circle cx="50" cy="90" r="1" fill="#a78bfa" opacity="0.6">
              <animate attributeName="r" values="1;2;1" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Anatomical Lobe Outlines (Cortex) - grows with knowledge */}
          <g className="cortical-structure" filter="url(#neural-bloom)">
            <path 
              className="cortex-outline"
              d="M50 15 
                 C 20 15, 10 35, 12 65 
                 C 15 85, 45 90, 50 85 
                 C 55 90, 85 85, 88 65 
                 C 90 35, 80 15, 50 15 Z" 
              fill="url(#lobe-gradient)"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
              opacity={0.6 + growth * 0.4}
            />
            
            {/* Enhanced Internal Cortical Folds */}
            <g className="folds" opacity={0.3 + growth * 0.5}>
              <path d="M50 15 V 85" className="fissure primary" strokeWidth="0.4" />
              <path d="M30 25 Q 40 35, 50 30" className="fissure" />
              <path d="M70 25 Q 60 35, 50 30" className="fissure" />
              <path d="M20 50 Q 40 45, 50 55" className="fissure" />
              <path d="M80 50 Q 60 45, 50 55" className="fissure" />
              <path d="M35 75 Q 45 70, 50 78" className="fissure" />
              <path d="M65 75 Q 55 70, 50 78" className="fissure" />
              <path d="M25 38 Q 37 33, 45 38" className="fissure secondary" strokeWidth="0.25" />
              <path d="M75 38 Q 63 33, 55 38" className="fissure secondary" strokeWidth="0.25" />
            </g>
          </g>

          {/* Cortical Regions - brain areas that activate */}
          <g className="cortical-regions" filter="url(#region-glow)">
            {corticalRegions.map((region, i) => (
              <g key={i} opacity={region.intensity}>
                <circle 
                  cx={region.cx} 
                  cy={region.cy} 
                  r={4 + growth * 3} 
                  fill={region.color} 
                  opacity={region.intensity}
                >
                  <animate 
                    attributeName="r" 
                    values={`${4 + growth * 3};${6 + growth * 3};${4 + growth * 3}`} 
                    dur={`${3 + i * 0.5}s`} 
                    repeatCount="indefinite" 
                  />
                </circle>
                {!isBackground && (
                  <text 
                    x={region.cx} 
                    y={region.cy + 12} 
                    textAnchor="middle" 
                    className="region-label"
                    fill={region.color}
                    fontSize="3"
                    fontWeight="bold"
                    opacity={growth > 0.5 ? 0.6 : 0.3}
                  >
                    {region.label}
                  </text>
                )}
              </g>
            ))}
          </g>

          {/* Active Synaptic Pathways */}
          <g className="synaptic-flow" filter="url(#neural-bloom)">
            {neuralTracks.map((track, i) => (
              <g key={i}>
                {/* Base track */}
                <path 
                  d={track.d} 
                  className="synapse-track" 
                  stroke={track.color} 
                  opacity="0.15" 
                  fill="none" 
                  strokeWidth="0.3"
                />
                {/* Animated pulse */}
                <path 
                  d={track.d} 
                  className="synapse-pulse" 
                  stroke={track.color} 
                  fill="none" 
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  style={{ 
                    animationDelay: track.delay,
                    strokeDasharray: "3, 100",
                    opacity: 0.3 + (growth * 0.7)
                  }}
                />
              </g>
            ))}
          </g>

          {/* Dynamic pulse nodes - represent new learning */}
          <g className="pulse-nodes" filter="url(#region-glow)">
            {pulseNodes.map(node => (
              <circle
                key={node.id}
                cx={node.x}
                cy={node.y}
                r="1"
                fill="#fbbf24"
                className="learning-pulse"
              >
                <animate attributeName="r" values="1;3;0" dur="2s" />
                <animate attributeName="opacity" values="1;0.5;0" dur="2s" />
              </circle>
            ))}
          </g>

          {/* Growth Indicators (hemisphere glows) */}
          <circle cx="35" cy="40" r={8 + growth * 15} fill="#f472b6" opacity={0.03 + growth * 0.12} filter="blur(10px)" />
          <circle cx="65" cy="40" r={8 + growth * 12} fill="#60a5fa" opacity={0.03 + growth * 0.12} filter="blur(10px)" />
          <circle cx="50" cy="65" r={8 + growth * 18} fill="#fbbf24" opacity={0.03 + growth * 0.15} filter="blur(12px)" />

          {/* Synaptic connection nodes */}
          {!isBackground && activePathways > 5 && (
            <g className="connection-nodes" opacity={growth * 0.8}>
              {Array.from({ length: Math.min(12, activePathways) }).map((_, i) => {
                const angle = (i / activePathways) * Math.PI * 2;
                const radius = 25 + (i % 3) * 8;
                const cx = 50 + Math.cos(angle) * radius;
                const cy = 50 + Math.sin(angle) * radius;
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="0.5"
                    fill="#ffffff"
                    opacity="0.4"
                  >
                    <animate 
                      attributeName="opacity" 
                      values="0.2;0.6;0.2" 
                      dur={`${2 + (i * 0.3)}s`} 
                      repeatCount="indefinite" 
                    />
                  </circle>
                );
              })}
            </g>
          )}

          {/* Information flow particles */}
          {!isBackground && growth > 0.3 && (
            <g className="info-particles">
              {Array.from({ length: 5 }).map((_, i) => (
                <circle
                  key={i}
                  r="0.4"
                  fill="#a78bfa"
                  opacity="0.6"
                >
                  <animateMotion
                    path={neuralTracks[i % neuralTracks.length]?.d}
                    dur={`${4 + i}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
            </g>
          )}
        </svg>

        {/* Growth stage indicator */}
        {!isBackground && (
          <div className="growth-indicator">
            <div className="growth-stage">
              {growth < 0.2 && "Forming..."}
              {growth >= 0.2 && growth < 0.5 && "Developing..."}
              {growth >= 0.5 && growth < 0.8 && "Expanding..."}
              {growth >= 0.8 && "Optimized"}
            </div>
            <div className="growth-metrics">
              <span>{activePathways} pathways</span>
              <span className="separator">•</span>
              <span>{Math.floor(growth * 100)}% mature</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .brain-core-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1500px;
          position: relative;
        }

        .background-mode { 
          opacity: 0.15; 
          transform: scale(1.8); 
          pointer-events: none;
          filter: blur(2px);
        }
        
        .interactive-mode { 
          transform: scale(1); 
          transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1); 
        }

        .brain-viewport {
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: brain-hover 15s ease-in-out infinite;
          transition: transform 2s cubic-bezier(0.23, 1, 0.32, 1);
          position: relative;
        }

        .brain-anatomy-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
          filter: drop-shadow(0 0 40px rgba(79, 70, 229, 0.15));
        }

        .cortex-outline {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: draw-cortex 8s ease-out forwards;
          transition: all 1s ease-in-out;
        }

        .fissure {
          fill: none;
          stroke: rgba(255, 255, 255, 0.1);
          stroke-width: 0.3;
          stroke-linecap: round;
          stroke-dasharray: 2, 3;
          animation: fissure-flow 6s linear infinite;
        }

        .fissure.primary {
          stroke: rgba(255, 255, 255, 0.15);
          stroke-width: 0.5;
        }

        .fissure.secondary {
          opacity: 0.5;
        }

        .synapse-pulse {
          stroke-linecap: round;
          animation: synapse-fire 5s linear infinite;
          filter: drop-shadow(0 0 2px currentColor);
        }

        .region-label {
          font-family: 'Inter', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          animation: label-pulse 3s ease-in-out infinite;
        }

        .growth-indicator {
          position: absolute;
          bottom: -60px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          font-family: 'JetBrains Mono', monospace;
        }

        .growth-stage {
          font-size: 14px;
          font-weight: 900;
          color: rgba(99, 102, 241, 0.8);
          text-transform: uppercase;
          letter-spacing: 0.3em;
          animation: stage-glow 2s ease-in-out infinite;
        }

        .growth-metrics {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 8px;
          display: flex;
          gap: 8px;
          justify-content: center;
          font-weight: 700;
        }

        .separator {
          opacity: 0.3;
        }

        @keyframes brain-hover {
          0%, 100% { 
            transform: rotateY(-8deg) rotateX(12deg) translateY(0); 
          }
          50% { 
            transform: rotateY(12deg) rotateX(8deg) translateY(-30px); 
          }
        }

        @keyframes draw-cortex {
          to { 
            stroke-dashoffset: 0; 
            stroke: rgba(255, 255, 255, 0.2); 
          }
        }

        @keyframes synapse-fire {
          0% { stroke-dashoffset: 0; opacity: 0.3; }
          50% { opacity: 0.8; }
          100% { stroke-dashoffset: -100; opacity: 0.3; }
        }

        @keyframes fissure-flow {
          to { stroke-dashoffset: -10; }
        }

        @keyframes label-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }

        @keyframes stage-glow {
          0%, 100% { 
            text-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
            opacity: 0.8;
          }
          50% { 
            text-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
            opacity: 1;
          }
        }

        /* Hover effects */
        .interactive-mode:hover .brain-viewport {
          transform: scale(1.05);
          animation-play-state: paused;
        }

        .interactive-mode:hover .cortex-outline {
          stroke: rgba(255, 255, 255, 0.3);
        }

        .interactive-mode:hover .synapse-pulse {
          animation-duration: 3s;
          stroke-width: 1.2;
        }

        /* Energy field animation */
        .energy-field {
          animation: energy-rotate 20s linear infinite;
        }

        @keyframes energy-rotate {
          from { transform: rotate(0deg); transform-origin: center; }
          to { transform: rotate(360deg); transform-origin: center; }
        }

        /* Learning pulse effect */
        .learning-pulse {
          pointer-events: none;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .brain-viewport {
            animation: brain-hover-mobile 12s ease-in-out infinite;
          }

          @keyframes brain-hover-mobile {
            0%, 100% { 
              transform: rotateY(-5deg) rotateX(8deg) translateY(0); 
            }
            50% { 
              transform: rotateY(8deg) rotateX(5deg) translateY(-15px); 
            }
          }

          .growth-indicator {
            bottom: -50px;
          }

          .growth-stage {
            font-size: 11px;
          }

          .growth-metrics {
            font-size: 9px;
          }
        }

        /* Ambient particles in background */
        .brain-viewport::before {
          content: '';
          position: absolute;
          inset: -20%;
          background: 
            radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.03) 0%, transparent 50%);
          animation: ambient-shift 15s ease-in-out infinite alternate;
          pointer-events: none;
          z-index: -1;
        }

        @keyframes ambient-shift {
          from { transform: translate(-10px, -10px) scale(1); }
          to { transform: translate(10px, 10px) scale(1.1); }
        }

        /* Enhanced glow on high growth */
        .brain-anatomy-svg {
          transition: filter 2s ease-in-out;
        }

        .interactive-mode:hover .brain-anatomy-svg {
          filter: drop-shadow(0 0 60px rgba(79, 70, 229, 0.25));
        }
      `}</style>
    </div>
  );
};

export default DigitalBrain;