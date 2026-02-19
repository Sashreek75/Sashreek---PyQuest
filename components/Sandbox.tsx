
import React, { useState, useEffect, useRef } from 'react';
import { auditSandboxCode, generateSandboxDataset } from '../services/geminiService';
import { SandboxAudit, SyntheticDataset, UserPersonalization } from '../types';
import LoadingOverlay from './LoadingOverlay';
import Visualizer from './Visualizer';

const CHALLENGES = [
  { id: 1, label: 'Sort Attack', difficulty: 'Novice', prompt: '# Challenge: Implement merge sort from scratch\n# Bonus: Add a step counter\n\ndef merge_sort(arr):\n    pass\n\nprint(merge_sort([5, 2, 8, 1, 9, 3]))' },
  { id: 2, label: 'Graph Maze', difficulty: 'Intermediate', prompt: '# Challenge: Implement BFS to find shortest path\n# in a 2D grid (0=open, 1=wall)\n\ndef bfs_shortest_path(grid, start, end):\n    pass\n\ngrid = [\n    [0,0,0,1,0],\n    [1,1,0,1,0],\n    [0,0,0,0,0],\n    [0,1,1,1,0],\n    [0,0,0,0,0]\n]\nprint(bfs_shortest_path(grid, (0,0), (4,4)))' },
  { id: 3, label: 'Neural Init', difficulty: 'Advanced', prompt: '# Challenge: Initialize and forward pass a mini MLP\n# Layers: [input=4, hidden=8, output=2]\n# Use Xavier init and sigmoid activation\n\nimport numpy as np\n\nclass MiniMLP:\n    def __init__(self, layer_sizes):\n        pass\n    \n    def forward(self, x):\n        pass\n\nmlp = MiniMLP([4, 8, 2])\nx = np.random.randn(4)\nprint(mlp.forward(x))' },
  { id: 4, label: 'Fibonacci Cache', difficulty: 'Novice', prompt: '# Challenge: Fibonacci with memoization\n# Compare recursive vs memoized performance\n\nimport time\n\ndef fib_memo(n, memo={}):\n    pass\n\ndef fib_naive(n):\n    pass\n\n# Time both for n=35\nprint(fib_memo(35))\nprint(fib_naive(35))' },
];

const MINI_PROJECTS = [
  { id: 1, label: 'Kalman Filter', icon: '📡', template: '# Mini Project: 1D Kalman Filter\nimport numpy as np\n\nclass KalmanFilter1D:\n    def __init__(self, process_variance, measurement_variance):\n        self.q = process_variance\n        self.r = measurement_variance\n        self.x = 0.0  # estimated state\n        self.p = 1.0  # estimation error covariance\n    \n    def update(self, measurement):\n        # Prediction step\n        # TODO: implement prediction\n        \n        # Update step\n        # TODO: implement Kalman gain and state update\n        pass\n\nkf = KalmanFilter1D(1e-5, 0.1**2)\nmeasurements = [0.39, 0.50, 0.48, 0.29, 0.25]\nfor z in measurements:\n    kf.update(z)\n    print(f"Measurement: {z:.3f} -> Estimate: {kf.x:.3f}")' },
  { id: 2, label: 'Gradient Descent', icon: '⛰️', template: '# Mini Project: Gradient Descent from scratch\nimport numpy as np\n\ndef cost_function(theta, X, y):\n    m = len(y)\n    predictions = X @ theta\n    cost = (1/(2*m)) * np.sum((predictions - y)**2)\n    return cost\n\ndef gradient_descent(X, y, theta, alpha, iterations):\n    m = len(y)\n    cost_history = []\n    \n    for i in range(iterations):\n        # TODO: compute gradient and update theta\n        pass\n    \n    return theta, cost_history\n\n# Generate synthetic linear data\nnp.random.seed(42)\nX = np.c_[np.ones(100), np.random.randn(100)]\ny = 3 + 2 * X[:,1] + np.random.randn(100) * 0.5\ntheta = np.zeros(2)\ntheta, history = gradient_descent(X, y, theta, 0.01, 1000)\nprint(f"Learned params: {theta}")' },
  { id: 3, label: 'Decision Tree', icon: '🌲', template: '# Mini Project: Decision Tree (single split)\nimport numpy as np\nfrom collections import Counter\n\nclass SimpleDecisionTree:\n    def __init__(self, max_depth=3):\n        self.max_depth = max_depth\n        self.tree = None\n    \n    def gini(self, y):\n        # TODO: compute Gini impurity\n        pass\n    \n    def best_split(self, X, y):\n        # TODO: find best feature and threshold\n        pass\n    \n    def fit(self, X, y):\n        self.tree = self._build(X, y, depth=0)\n    \n    def _build(self, X, y, depth):\n        # TODO: recursively build the tree\n        pass\n    \n    def predict(self, X):\n        pass\n\n# Test on XOR problem\nX = np.array([[0,0],[0,1],[1,0],[1,1]])\ny = np.array([0, 1, 1, 0])\ntree = SimpleDecisionTree()\ntree.fit(X, y)\nprint(tree.predict(X))' },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  Novice: '#22d3ee',
  Intermediate: '#f59e0b',
  Advanced: '#f43f5e',
};

// Define SandboxProps to fix the "Cannot find name 'SandboxProps'" error
interface SandboxProps {
  personalization?: UserPersonalization;
  onBack: () => void;
  onOpenAura: () => void;
}

const Sandbox: React.FC<SandboxProps> = ({ personalization, onBack, onOpenAura }) => {
  const [code, setCode] = useState(`# Welcome to the Neural Sandbox\n# Experiment, explore, and build freely.\n\nimport numpy as np\n\ndef neural_forward(x, w, b):\n    """Single-layer forward pass"""\n    return np.dot(x, w) + b\n\n# Try something:\nx = np.array([1.0, 2.0, 3.0])\nw = np.random.randn(3, 4)\nb = np.zeros(4)\noutput = neural_forward(x, w, b)\nprint("Output shape:", output.shape)\nprint("Values:", output)`);
  
  const [audit, setAudit] = useState<SandboxAudit | null>(null);
  const [dataset, setDataset] = useState<SyntheticDataset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [datasetPrompt, setDatasetPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'Audit' | 'Data' | 'Challenges' | 'Projects'>('Audit');
  const [activeChallengeId, setActiveChallengeId] = useState<number | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [glitchActive, setGlitchActive] = useState(false);
  const [scanlinePos, setScanlinePos] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const [lineCount, setLineCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Particle canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    
    let nodes: {x: number; y: number; vx: number; vy: number}[] = [];
    
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initNodes();
    };

    const initNodes = () => {
      nodes = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        nodes.forEach((other, j) => {
          if (i >= j) return;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });

        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99,102,241,0.25)';
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Scanline animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanlinePos(prev => (prev + 1.2) % 100);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Sync scroll between textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Code stats
  useEffect(() => {
    const lines = code.split('\n').length;
    const chars = code.replace(/\s/g, '').length;
    setLineCount(lines);
    setCharCount(chars);
  }, [code]);

  const triggerGlitch = () => {
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 600);
  };

  const handleRequestAudit = async () => {
    triggerGlitch();
    setIsLoading(true);
    
    let contextStr = "Free coding session.";
    if (activeChallengeId) {
      const challenge = CHALLENGES.find(c => c.id === activeChallengeId);
      contextStr = `Challenge: ${challenge?.label}. Prompt: ${challenge?.prompt}`;
    } else if (activeProjectId) {
      const project = MINI_PROJECTS.find(p => p.id === activeProjectId);
      contextStr = `Mini-Project: ${project?.label}. Objective: Build out the scaffold.`;
    }

    try {
      const result = await auditSandboxCode(code, contextStr);
      setAudit(result);
      setActiveTab('Audit');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSynthesizeDataset = async () => {
    if (!datasetPrompt.trim()) return;
    setIsLoading(true);
    try {
      const result = await generateSandboxDataset(datasetPrompt, code);
      setDataset(result);
      setActiveTab('Data');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChallenge = (challenge: typeof CHALLENGES[0]) => {
    setCode(challenge.prompt);
    setActiveChallengeId(challenge.id);
    setActiveProjectId(null);
    triggerGlitch();
  };

  const loadProject = (project: typeof MINI_PROJECTS[0]) => {
    setCode(project.template);
    setActiveProjectId(project.id);
    setActiveChallengeId(null);
    triggerGlitch();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: '#04050d', fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      {isLoading && <LoadingOverlay message="Neural Kernel Processing" subMessage="Aura is analyzing your logical architecture..." />}
      
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.6 }} />

      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `linear-gradient(to bottom, transparent ${scanlinePos - 1}%, rgba(99,102,241,0.03) ${scanlinePos}%, transparent ${scanlinePos + 1}%)`,
        }}
      />

      <div className="absolute inset-0 pointer-events-none z-10" style={{
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(2,3,12,0.7) 100%)'
      }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700;800&family=Syne:wght@400;500;600;700;800;900&display=swap');
        
        :root {
          --indigo: #6366f1;
          --cyan: #22d3ee;
          --rose: #f43f5e;
          --amber: #f59e0b;
          --green: #10b981;
          --bg: #04050d;
          --surface: rgba(10,12,28,0.8);
          --border: rgba(99,102,241,0.12);
        }

        .syne { font-family: 'Syne', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }

        .glitch-text { animation: glitch 0.6s steps(2, end); }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 1px); }
          40% { transform: translate(2px, -1px); }
          60% { transform: translate(-1px, 2px); }
          80% { transform: translate(1px, -2px); }
          100% { transform: translate(0); }
        }

        .panel { background: var(--surface); border: 1px solid var(--border); backdrop-filter: blur(20px); }
        .panel-glow { box-shadow: 0 0 0 1px rgba(99,102,241,0.08), 0 4px 40px rgba(0,0,0,0.6); }

        .btn-audit {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(79, 70, 229, 0.2);
        }
        .btn-audit:hover { box-shadow: 0 0 30px rgba(99,102,241,0.5); transform: translateY(-1px); }
        .btn-audit:active { transform: translateY(0) scale(0.98); }

        .code-textarea { background: transparent; color: #a5b4fc; caret-color: #6366f1; line-height: 1.8; tab-size: 4; }
        .code-textarea::selection { background: rgba(99,102,241,0.3); }

        .tab-active { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.4) !important; color: #a5b4fc !important; }

        .challenge-card { cursor: pointer; border: 1px solid rgba(99,102,241,0.1); background: rgba(10,12,28,0.6); transition: all 0.2s; }
        .challenge-card:hover { border-color: rgba(99,102,241,0.35); transform: translateY(-2px); }
        .challenge-card.active { border-color: rgba(99,102,241,0.6); background: rgba(99,102,241,0.08); }

        .metric-box { background: rgba(10,12,28,0.8); border: 1px solid rgba(99,102,241,0.1); padding: 12px 16px; border-radius: 12px; }

        .pulse-dot { animation: pulse 2s infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .line-number {
          color: rgba(99,102,241,0.25);
          user-select: none;
          text-align: right;
          padding-right: 16px;
          min-width: 44px;
          font-size: 11px;
          line-height: 1.8;
        }

        .sidebar-scroll::-webkit-scrollbar { width: 3px; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.15); border-radius: 4px; }
      `}</style>

      {/* Header */}
      <header className="relative z-30 bg-[#04050d]/90 backdrop-blur-2xl border-b border-indigo-500/10">
        <div className="max-w-screen-2xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBack} 
              aria-label="Return to Repository"
              className="flex items-center gap-2 text-slate-500 hover:text-white transition-all group"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform text-sm">←</span>
              <span className="mono text-[10px] uppercase tracking-widest">Repository</span>
            </button>
            <div className="h-4 w-px bg-indigo-500/15" />
            <span className="mono text-[10px] text-slate-600 tracking-[0.2em]">
              PyQuest / <span className="text-indigo-400">Neural_Sandbox</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="pulse-dot w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="mono text-[10px] text-emerald-500/70 tracking-widest">LIVE_KERNEL</span>
            </div>
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded px-3 py-1 text-[10px] text-slate-500 mono">{lineCount} ln</div>
            <button 
              onClick={onOpenAura} 
              aria-label="Consult Aura AI"
              className="bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 px-5 py-2 rounded-xl mono text-[10px] tracking-widest hover:bg-indigo-600/25 transition-all"
            >
              ✦ CONSULT AURA
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="relative z-20 max-w-screen-2xl mx-auto p-6 grid gap-5" style={{ gridTemplateColumns: '1fr 460px', minHeight: 'calc(100vh - 64px)' }}>

        {/* LEFT: Code Editor */}
        <div className="flex flex-col gap-4 min-h-0">
          <div className="panel panel-glow rounded-2xl flex flex-col overflow-hidden flex-1 min-h-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-5 py-3 shrink-0 border-b border-indigo-500/10 bg-[#060814]/80">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <div className="h-3 w-px bg-indigo-500/15 mx-2" />
                <span className="mono text-[10px] text-indigo-400/60 tracking-widest">sandbox_kernel.py</span>
              </div>
              <div className="mono text-[9px] text-slate-700 tracking-widest">Python 3.12 · UTF-8</div>
            </div>

            {/* Editor Container */}
            <div className="flex-1 flex overflow-hidden">
              <div 
                ref={lineNumbersRef}
                className="flex flex-col pt-5 pb-5 shrink-0 overflow-hidden bg-black/30 border-r border-indigo-500/5 select-none"
              >
                {code.split('\n').map((_, i) => (
                  <div key={i} className="line-number">{i + 1}</div>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                value={code}
                onChange={e => setCode(e.target.value)}
                onScroll={handleScroll}
                spellCheck={false}
                aria-label="Python Code Editor"
                className={`code-textarea flex-1 p-5 resize-none outline-none text-sm font-mono ${glitchActive ? 'glitch-text' : ''}`}
              />
            </div>

            {/* Footer */}
            <div className="px-5 py-4 shrink-0 flex items-center justify-between border-t border-indigo-500/10 bg-[#060814]/60">
              <div className="mono text-[10px] text-slate-700">
                {activeChallengeId ? 'CHALLENGE_ACTIVE' : activeProjectId ? 'PROJECT_SCAFFOLD' : 'FREE_EXPLORATION'}
              </div>
              <button
                onClick={handleRequestAudit}
                className="btn-audit flex items-center gap-3 px-10 py-3.5 rounded-xl text-white mono font-bold text-xs tracking-[0.2em]"
              >
                ⬡ AUDIT KERNEL
              </button>
            </div>
          </div>

          {/* Dataset Synthesizer */}
          <div className="panel panel-glow rounded-2xl p-5 shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <span className="mono text-[10px] text-cyan-400 tracking-widest">⬡ SYNTHETIC_GENERATOR</span>
            </div>
            <div className="flex gap-3">
              <input
                value={datasetPrompt}
                onChange={e => setDatasetPrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSynthesizeDataset()}
                placeholder="Describe: Normal distribution, 500 samples, mean=0, std=1..."
                className="flex-1 rounded-xl px-5 py-3.5 outline-none bg-black/80 border border-indigo-500/20 text-[#c7d2fe] mono text-xs focus:border-cyan-500/40 transition-all"
              />
              <button
                onClick={handleSynthesizeDataset}
                className="px-8 rounded-xl mono font-bold text-[10px] tracking-widest transition-all bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 active:scale-95"
              >
                SYNTHESIZE →
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Sidebar */}
        <div className="flex flex-col gap-4 min-h-0">
          {/* Tabs */}
          <div className="panel panel-glow rounded-2xl p-1.5 grid grid-cols-4 gap-1">
            {(['Audit', 'Data', 'Challenges', 'Projects'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2.5 rounded-xl mono text-[9px] tracking-widest transition-all ${activeTab === tab ? 'tab-active' : 'text-slate-600 hover:text-slate-400'}`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto sidebar-scroll space-y-4">
            {activeTab === 'Audit' && (
              <div className="fade-in space-y-4">
                {audit ? (
                  <>
                    <div className="panel panel-glow rounded-2xl p-8 space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="mono text-[9px] text-indigo-400/60 tracking-widest mb-2">EFFICIENCY_SCORE</p>
                          <div className="syne font-black text-6xl text-white leading-none">
                            {audit.efficiencyScore}<span className="text-3xl text-indigo-500">%</span>
                          </div>
                        </div>
                        <svg width="80" height="80" viewBox="0 0 90 90">
                          <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="6" />
                          <circle
                            cx="45" cy="45" r="36"
                            fill="none"
                            stroke={audit.efficiencyScore >= 80 ? '#10b981' : audit.efficiencyScore >= 50 ? '#f59e0b' : '#f43f5e'}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray="226"
                            strokeDashoffset={226 - (226 * audit.efficiencyScore) / 100}
                            transform="rotate(-90 45 45)"
                            className="transition-all duration-1000"
                          />
                        </svg>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="metric-box">
                          <p className="mono text-[8px] text-slate-500 uppercase tracking-widest">Big-O</p>
                          <p className="mono font-bold mt-1 text-indigo-300">{audit.bigO}</p>
                        </div>
                        <div className="metric-box">
                          <p className="mono text-[8px] text-slate-500 uppercase tracking-widest">Integrity</p>
                          <p className={`mono font-bold mt-1 ${audit.isProductionReady ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {audit.isProductionReady ? 'SOUND' : 'ERRATIC'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="panel panel-glow rounded-2xl p-6 space-y-3">
                      <p className="mono text-[9px] text-indigo-400/50 tracking-widest uppercase">Structural Review</p>
                      <p className="syne text-slate-400 text-sm leading-relaxed">{audit.architecturalReview}</p>
                    </div>

                    <div className="panel panel-glow rounded-2xl p-6 space-y-4">
                      <p className="mono text-[9px] text-indigo-400/50 tracking-widest uppercase">Optimizations</p>
                      {audit.suggestedImprovements.map((imp, idx) => (
                        <div key={idx} className="flex gap-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                          <span className="mono font-bold text-indigo-500 text-xs">#{idx + 1}</span>
                          <p className="syne text-xs text-slate-400 leading-normal">{imp}</p>
                        </div>
                      ))}
                    </div>

                    {audit.visualizationData && (
                      <div className="panel panel-glow rounded-2xl h-[280px] overflow-hidden">
                        <Visualizer data={audit.visualizationData} />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="panel rounded-2xl p-16 text-center space-y-6">
                    <div className="text-5xl opacity-10">⬡</div>
                    <p className="mono text-[10px] text-slate-600 tracking-widest uppercase">Aura is Idle. Audit kernel for analysis.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Data' && (
              <div className="fade-in space-y-4">
                {dataset ? (
                  <div className="panel panel-glow rounded-2xl p-6 space-y-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="mono text-[9px] text-cyan-400/60 uppercase">Artifact Synthesized</p>
                        <h4 className="syne font-bold text-xl text-white mt-1">{dataset.name}</h4>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(dataset.data)}
                        className="text-[10px] mono text-slate-500 hover:text-white"
                      >
                        [COPY]
                      </button>
                    </div>
                    <div className="bg-black/90 border border-cyan-500/10 p-5 rounded-xl font-mono text-[10px] text-cyan-500/40 leading-loose overflow-x-auto max-h-[400px]">
                      {dataset.data}
                    </div>
                    <button
                      onClick={() => {
                        const blob = new Blob([dataset.data], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${dataset.name.toLowerCase().replace(/\s/g, '_')}.${dataset.format}`;
                        a.click();
                      }}
                      className="w-full py-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mono text-[10px] tracking-widest hover:bg-cyan-500/15"
                    >
                      DOWNLOAD_MANIFEST (.{dataset.format.toUpperCase()})
                    </button>
                  </div>
                ) : (
                  <div className="panel rounded-2xl p-16 text-center space-y-6">
                    <div className="text-5xl opacity-10">◈</div>
                    <p className="mono text-[10px] text-slate-600 tracking-widest uppercase">Describe a dataset below to begin.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Challenges' && (
              <div className="fade-in space-y-3">
                {CHALLENGES.map(ch => (
                  <div
                    key={ch.id}
                    className={`challenge-card rounded-xl p-5 ${activeChallengeId === ch.id ? 'active' : ''}`}
                    onClick={() => loadChallenge(ch)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="mono font-bold text-sm text-white">{ch.label}</span>
                      <span className="mono text-[8px] px-2 py-0.5 rounded-md" style={{ color: DIFFICULTY_COLORS[ch.difficulty], background: `${DIFFICULTY_COLORS[ch.difficulty]}15` }}>
                        {ch.difficulty.toUpperCase()}
                      </span>
                    </div>
                    <p className="mono text-[10px] text-slate-500 tracking-widest">
                      {activeChallengeId === ch.id ? '● ACTIVE_DRILL' : '○ LOAD_PROTO'}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Projects' && (
              <div className="fade-in space-y-3">
                {MINI_PROJECTS.map(proj => (
                  <div 
                    key={proj.id} 
                    className={`challenge-card rounded-xl p-5 ${activeProjectId === proj.id ? 'active' : ''}`}
                    onClick={() => loadProject(proj)}
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-2xl">{proj.icon}</span>
                      <span className="syne font-bold text-white">{proj.label}</span>
                    </div>
                    <p className="mono text-[9px] text-slate-500 tracking-widest">SCAFFOLD_READY</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sandbox;
