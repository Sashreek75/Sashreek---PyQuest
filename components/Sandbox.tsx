
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
    <div className="relative min-h-screen overflow-hidden bg-[#faf8f5] text-[#1a1714]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {isLoading && <LoadingOverlay message="Processing Logic" subMessage="Aura is analyzing your architectural decisions..." />}
      
      <div className="grid-bg absolute inset-0 pointer-events-none opacity-40" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        
        :root {
          --gold: #f5c842;
          --gold-dark: #d97706;
          --ink: #1a1714;
          --paper: #faf8f5;
          --border: #e8e3db;
          --text-dim: #6b6560;
        }

        .font-serif { font-family: 'DM Serif Display', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        .panel { background: #ffffff; border: 1px solid var(--border); border-radius: 24px; }
        .paper-shadow { box-shadow: 0 10px 30px rgba(0,0,0,0.03); }

        .btn-gold {
          background: var(--gold);
          color: var(--ink);
          transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(245, 200, 66, 0.2); }
        .btn-gold:active { transform: translateY(0) scale(0.98); }

        .code-textarea { 
          background: #ffffff; 
          color: #1a1714; 
          caret-color: var(--gold-dark); 
          line-height: 1.8; 
          tab-size: 4; 
          border: none;
        }
        .code-textarea::selection { background: rgba(245, 200, 66, 0.2); }

        .tab-active { 
          background: var(--gold); 
          color: var(--ink) !important; 
          box-shadow: 0 4px 12px rgba(245, 200, 66, 0.15);
        }

        .challenge-card { 
          cursor: pointer; 
          border: 1px solid var(--border); 
          background: #ffffff; 
          transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1); 
        }
        .challenge-card:hover { border-color: var(--gold); transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.02); }
        .challenge-card.active { border-color: var(--gold); background: #fdfcf9; }

        .metric-box { background: #faf8f5; border: 1px solid var(--border); padding: 16px; border-radius: 16px; }

        .line-number {
          color: #9a9088;
          user-select: none;
          text-align: right;
          padding-right: 20px;
          min-width: 50px;
          font-size: 11px;
          line-height: 1.8;
          font-family: 'JetBrains Mono', monospace;
        }

        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: #e8e3db; border-radius: 4px; }

        .rail-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          color: #9a9088;
        }

        .oversized-number {
          font-family: 'DM Serif Display', serif;
          font-size: 120px;
          line-height: 0.8;
          color: #1a1714;
          font-style: italic;
        }
      `}</style>

      {/* Header */}
      <header className="relative z-30 bg-white/80 backdrop-blur-xl border-b border-[#e8e3db]">
        <div className="max-w-screen-2xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button 
              onClick={onBack} 
              className="flex items-center gap-3 text-[#6b6560] hover:text-[#1a1714] transition-all group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Repository</span>
            </button>
            <div className="h-6 w-px bg-[#e8e3db]" />
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-[#9a9088] tracking-widest uppercase font-bold">PyQuest // Module</span>
              <span className="font-serif text-xl italic text-[#1a1714]">Neural Sandbox</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-[#faf8f5] border border-[#e8e3db] rounded-full">
              <div className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
              <span className="font-mono text-[10px] text-[#1a1714] tracking-widest font-bold">KERNEL_ACTIVE</span>
            </div>
            <button 
              onClick={onOpenAura} 
              className="bg-[#1a1714] text-white px-6 py-2.5 rounded-full font-mono text-[10px] tracking-widest font-bold hover:bg-[#333] transition-all shadow-lg"
            >
              ✦ CONSULT AURA
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="relative z-20 max-w-screen-2xl mx-auto p-8 grid gap-8" style={{ gridTemplateColumns: '1fr 480px', minHeight: 'calc(100vh - 80px)' }}>
        
        {/* Rail Text */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 rail-text opacity-20 hidden 2xl:block">
          NEURAL_SANDBOX_V1.0 // EXPERIMENTAL_BUILD
        </div>

        {/* LEFT: Code Editor */}
        <div className="flex flex-col gap-6 min-h-0 relative">
          <div className="panel paper-shadow flex flex-col overflow-hidden flex-1 min-h-0 bg-white">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-[#e8e3db] bg-[#faf8f5]">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#e8e3db]" />
                  <div className="w-3 h-3 rounded-full bg-[#e8e3db]" />
                  <div className="w-3 h-3 rounded-full bg-[#e8e3db]" />
                </div>
                <div className="h-4 w-px bg-[#e8e3db] mx-2" />
                <span className="font-mono text-[10px] text-[#d97706] tracking-widest font-bold italic">sandbox_kernel.py</span>
              </div>
              <div className="font-mono text-[10px] text-[#9a9088] tracking-widest">{lineCount} lines · Python 3.12</div>
            </div>

            {/* Editor Container */}
            <div className="flex-1 flex overflow-hidden">
              <div 
                ref={lineNumbersRef}
                className="flex flex-col pt-6 pb-6 shrink-0 overflow-hidden bg-[#faf8f5] border-r border-[#e8e3db] select-none"
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
                className="code-textarea flex-1 p-6 resize-none outline-none text-[15px] font-mono"
              />
            </div>

            {/* Footer */}
            <div className="px-8 py-6 shrink-0 flex items-center justify-between border-t border-[#e8e3db] bg-[#faf8f5]">
              <div className="font-mono text-[10px] text-[#9a9088] font-bold tracking-widest uppercase">
                {activeChallengeId ? '● Challenge Active' : activeProjectId ? '● Project Scaffold' : '○ Free Exploration'}
              </div>
              <button
                onClick={handleRequestAudit}
                className="btn-gold flex items-center gap-3 px-10 py-4 rounded-2xl font-mono font-bold text-xs tracking-[0.2em] shadow-md"
              >
                ⬡ AUDIT KERNEL
              </button>
            </div>
          </div>

          {/* Dataset Synthesizer */}
          <div className="panel paper-shadow p-6 shrink-0 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[10px] text-[#d97706] tracking-widest font-bold uppercase">⬡ Synthetic Generator</span>
            </div>
            <div className="flex gap-4">
              <input
                value={datasetPrompt}
                onChange={e => setDatasetPrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSynthesizeDataset()}
                placeholder="Describe a dataset (e.g., normal distribution, 500 samples)..."
                className="flex-1 rounded-2xl px-6 py-4 outline-none bg-[#faf8f5] border border-[#e8e3db] text-[#1a1714] font-mono text-xs focus:border-[#f5c842] transition-all"
              />
              <button
                onClick={handleSynthesizeDataset}
                className="px-8 rounded-2xl font-mono font-bold text-[10px] tracking-widest transition-all bg-[#1a1714] text-white hover:bg-[#333] active:scale-95 shadow-lg"
              >
                SYNTHESIZE →
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Sidebar */}
        <div className="flex flex-col gap-6 min-h-0">
          {/* Tabs */}
          <div className="panel paper-shadow p-2 grid grid-cols-4 gap-1 bg-white">
            {(['Audit', 'Data', 'Challenges', 'Projects'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 rounded-xl font-mono text-[9px] font-bold tracking-widest transition-all ${activeTab === tab ? 'tab-active' : 'text-[#9a9088] hover:text-[#1a1714]'}`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto sidebar-scroll space-y-6 pr-2">
            {activeTab === 'Audit' && (
              <div className="space-y-6">
                {audit ? (
                  <>
                    <div className="panel paper-shadow p-10 space-y-8 relative overflow-hidden group">
                      <div className="oversized-number absolute -right-6 -bottom-6 opacity-5 italic">88</div>
                      <div className="flex items-center justify-between relative z-10">
                        <div>
                          <p className="font-mono text-[10px] text-[#d97706] tracking-widest font-bold mb-3 uppercase">Efficiency Score</p>
                          <div className="font-serif italic text-7xl text-[#1a1714] leading-none">
                            {audit.efficiencyScore}<span className="text-3xl text-[#d97706]">%</span>
                          </div>
                        </div>
                        <div className="relative">
                          <svg width="100" height="100" viewBox="0 0 90 90">
                            <circle cx="45" cy="45" r="38" fill="none" stroke="#e8e3db" strokeWidth="4" />
                            <circle
                              cx="45" cy="45" r="38"
                              fill="none"
                              stroke="#f5c842"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeDasharray="238"
                              strokeDashoffset={238 - (238 * audit.efficiencyScore) / 100}
                              transform="rotate(-90 45 45)"
                              className="transition-all duration-1000"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center font-serif italic text-xl">
                            {audit.efficiencyScore >= 80 ? 'A+' : audit.efficiencyScore >= 60 ? 'B' : 'C'}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 relative z-10">
                        <div className="metric-box">
                          <p className="font-mono text-[9px] text-[#9a9088] uppercase tracking-widest font-bold">Complexity</p>
                          <p className="font-serif italic text-2xl mt-1 text-[#1a1714]">{audit.bigO}</p>
                        </div>
                        <div className="metric-box">
                          <p className="font-mono text-[9px] text-[#9a9088] uppercase tracking-widest font-bold">Integrity</p>
                          <p className={`font-serif italic text-2xl mt-1 ${audit.isProductionReady ? 'text-[#16a34a]' : 'text-[#f43f5e]'}`}>
                            {audit.isProductionReady ? 'Refined' : 'Erratic'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="panel paper-shadow p-8 space-y-4">
                      <p className="font-mono text-[10px] text-[#d97706] tracking-widest uppercase font-bold">Structural Review</p>
                      <p className="font-serif italic text-lg text-[#1a1714] leading-relaxed opacity-80">{audit.architecturalReview}</p>
                    </div>

                    <div className="space-y-4">
                      <p className="font-mono text-[10px] text-[#9a9088] tracking-widest uppercase font-bold px-2">Optimizations</p>
                      {audit.suggestedImprovements.map((imp, idx) => (
                        <div key={idx} className="flex gap-5 p-6 rounded-3xl bg-white border border-[#e8e3db] paper-shadow">
                          <span className="font-serif italic font-bold text-[#f5c842] text-2xl">0{idx + 1}</span>
                          <p className="text-sm text-[#6b6560] leading-relaxed font-medium">{imp}</p>
                        </div>
                      ))}
                    </div>

                    {audit.visualizationData && (
                      <div className="panel paper-shadow h-[320px] overflow-hidden bg-white">
                        <Visualizer data={audit.visualizationData} />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="panel paper-shadow p-20 text-center space-y-6 bg-white">
                    <div className="font-serif italic text-6xl opacity-10">⬡</div>
                    <p className="font-mono text-[10px] text-[#9a9088] tracking-widest uppercase font-bold">Aura is Idle. <br /> Audit kernel for analysis.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Data' && (
              <div className="space-y-6">
                {dataset ? (
                  <div className="panel paper-shadow p-8 space-y-6 bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-mono text-[10px] text-[#d97706] uppercase tracking-widest font-bold">Artifact Synthesized</p>
                        <h4 className="font-serif italic text-3xl text-[#1a1714] mt-2">{dataset.name}</h4>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(dataset.data)}
                        className="px-4 py-2 rounded-full border border-[#e8e3db] font-mono text-[10px] text-[#6b6560] hover:text-[#1a1714] hover:border-[#f5c842] transition-all"
                      >
                        COPY
                      </button>
                    </div>
                    <div className="bg-[#faf8f5] border border-[#e8e3db] p-6 rounded-2xl font-mono text-[11px] text-[#1a1714] leading-loose overflow-x-auto max-h-[400px] shadow-inner">
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
                      className="w-full py-4 rounded-2xl bg-[#1a1714] text-white font-mono font-bold text-[10px] tracking-widest hover:bg-[#333] transition-all shadow-lg"
                    >
                      DOWNLOAD_MANIFEST (.{dataset.format.toUpperCase()})
                    </button>
                  </div>
                ) : (
                  <div className="panel paper-shadow p-20 text-center space-y-6 bg-white">
                    <div className="font-serif italic text-6xl opacity-10">◈</div>
                    <p className="font-mono text-[10px] text-[#9a9088] tracking-widest uppercase font-bold">Describe a dataset <br /> to begin synthesis.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Challenges' && (
              <div className="space-y-4">
                {CHALLENGES.map(ch => (
                  <div
                    key={ch.id}
                    className={`challenge-card rounded-3xl p-6 ${activeChallengeId === ch.id ? 'active' : ''}`}
                    onClick={() => loadChallenge(ch)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-serif italic text-xl text-[#1a1714]">{ch.label}</span>
                      <span className="font-mono text-[9px] font-bold px-3 py-1 rounded-full border" style={{ borderColor: DIFFICULTY_COLORS[ch.difficulty], color: DIFFICULTY_COLORS[ch.difficulty] }}>
                        {ch.difficulty.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[10px] text-[#9a9088] tracking-widest font-bold uppercase">
                        {activeChallengeId === ch.id ? '● Active Drill' : '○ Load Proto'}
                      </p>
                      <span className="text-[#e8e3db] group-hover:text-[#f5c842] transition-colors">→</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Projects' && (
              <div className="space-y-4">
                {MINI_PROJECTS.map(proj => (
                  <div 
                    key={proj.id} 
                    className={`challenge-card rounded-3xl p-6 ${activeProjectId === proj.id ? 'active' : ''}`}
                    onClick={() => loadProject(proj)}
                  >
                    <div className="flex items-center gap-5 mb-3">
                      <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">{proj.icon}</span>
                      <span className="font-serif italic text-2xl text-[#1a1714]">{proj.label}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[10px] text-[#9a9088] tracking-widest font-bold uppercase italic">Scaffold Ready</p>
                      <span className="text-[#e8e3db] group-hover:text-[#f5c842] transition-colors">→</span>
                    </div>
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
