# PyQuest: The Neural Learning Engine for Python Mastery

> **Build production-quality Python skills through a rigorous, gated learning system with AI mentorship.**

![PyQuest](https://img.shields.io/badge/Python-Mastery-blue?style=flat-square) ![Status](https://img.shields.io/badge/Status-Active-green?style=flat-square) ![License](https://img.shields.io/badge/License-MIT-brightgreen?style=flat-square)

---

## 🎯 What is PyQuest?

PyQuest is a **tier-based learning platform** for Python engineers who want to master the language and build real systems. Unlike gamified tutorial sites, PyQuest:

- 🔒 **Forces logical progression** through strict tier gating (can't skip fundamentals)
- 🧠 **Provides AI mentorship** that analyzes your code for production-grade quality
- 🏆 **Proves competence** through a hard-to-earn mastery badge
- 🛠️ **Teaches systems thinking** (algorithms, design patterns, async, ML, production architecture)
- 📊 **Uses real data** (no fake leaderboards or inflated metrics)

**Target audience:** Serious learners who want to be genuinely good at Python and build things that work at scale.

---

## ⚡ Key Features

### 1. **Three-Tier Learning Path**
```
TIER I: Foundation (1,050 XP, 6-8 hours)
├── Python First Steps
├── Master Data Structures
├── Control Flow Mastery
├── Functions & Scoping
└── Object-Oriented Design 101
         ↓ (gates)
TIER II: Systems (2,400 XP, 20-25 hours)
├── Algorithm Design & Analysis
├── Advanced OOP & Design Patterns
├── Async & Concurrency
└── Data Science: Pandas, NumPy, Scikit-Learn
         ↓ (gates)
TIER III: Mastery (3,700 XP, 30-40 hours)
├── Deep Learning with PyTorch
├── LLMs & Transformers
└── Production Systems Architecture
         ↓ (gates)
TIER IV: Capstone (2,000 XP, 5-6 hours)
└── Real-World Engineering Simulator

Total: 60-80 hours to MASTER OF PYQUEST
```

### 2. **The Oracle (Pythia) - AI Mentorship**
- 🔍 **Neural Code Profiler**: Analyzes your code for Big O, optimization, and enterprise patterns
- 📊 **Career Guidance**: Generates custom learning roadmaps to your goals
- 🎓 **Senior Rewrites**: Shows how production engineers would solve it
- 💾 **Neural Codex**: Builds personalized learning documents

### 3. **Challenge System**
50+ challenges across 5 categories:
- Data Processing (250-400 XP)
- Algorithm Design (300-500 XP) with Big O analysis
- Object Design (250-500 XP) with design patterns
- Real-World Systems (300-500 XP) with async/concurrency
- Mathematical Computing (300-500 XP) with optimization

### 4. **Badge Progression**
12-badge system leading to **⚡ MASTER OF PYQUEST ⚡**:
- Entry: badge-novice, badge-streak-3
- Foundation: badge-foundation (gates Tier II)
- Intermediate: badge-intermediate-master (gates Tier III)
- Advanced: badge-advanced-master (gates Capstone)
- Challenge: badge-architect, badge-challenge-elite
- **Ultimate**: MASTER OF PYQUEST (requires ALL of the above + 20,000 XP)

### 5. **Production-Ready Curriculum**
Learn real skills employers need:
- Big O notation and algorithm optimization
- Design patterns (Factory, Observer, Strategy, Decorator)
- Async/multiprocessing for concurrent systems
- ML/Data science with pandas, NumPy, scikit-learn
- Deep learning with PyTorch
- LLMs and transformer fine-tuning
- Production systems architecture

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Python 3.8+ (for backend if needed)
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pyquest.git
cd PyQuest

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add:
# VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

---

## 📋 Project Structure

```
PyQuest/
├── src/
│   ├── components/          # React components
│   │   ├── auth/           # Authentication UI
│   │   ├── dashboard/      # Dashboard widgets
│   │   ├── gamification/   # Progress bars, badges, streaks
│   │   ├── learning/       # Module and lesson components
│   │   └── ui/             # Shared UI components
│   ├── pages/              # Full page routes
│   ├── context/            # React context (Auth, Learning, User)
│   ├── data/               # JSON data (modules, badges, challenges)
│   ├── utils/              # Utility functions (AI, code runner, profiler)
│   ├── App.jsx             # Main app with error boundary
│   └── main.jsx            # Entry point
├── public/                 # Static assets
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
└── README.md               # This file
```

---

## 🎓 How It Works

### 1. **Sign Up & Onboarding**
- Create account
- Choose learning goal (build AI models, become data scientist, etc.)
- Get personalized learning path

### 2. **Tier I: Foundation**
- Start with Python basics (printing, variables, types)
- Progress through data structures, control flow, functions, OOP
- Complete quizzes (75%+ required to pass)
- Earn badge-foundation to unlock Tier II

### 3. **Tier II: Systems**
- Learn algorithms and complexity analysis
- Master design patterns and advanced OOP
- Understand async/concurrency
- Get hands-on with data science libraries
- Earn badge-intermediate-master to unlock Tier III

### 4. **Tier III: Mastery**
- Deep learning with PyTorch
- LLMs and transformers
- Production system architecture
- Earn badge-advanced-master to unlock Capstone

### 5. **Tier IV: Capstone**
- Real-world engineering simulator
- Design a system from scratch
- Implement it fully
- Test and optimize
- Ship production code
- Earn badge-capstone-triumph

### 6. **Ultimate Achievement**
- Earn **⚡ MASTER OF PYQUEST ⚡** by completing requirements:
  - All 3 tier master badges
  - Capstone triumph badge
  - Challenge elite badge (25+ challenges solved)
  - 20,000+ XP total

---

## 🧠 AI Features

### Neural Code Profiler
```javascript
// The Oracle analyzes your code:
// Input: Python code
// Output: {
//   "bigO": "Time: O(n log n) / Space: O(n)",
//   "enterpriseRating": "Production-Grade",
//   "analysis": "Excellent use of sorting algorithms...",
//   "seniorRewrite": "# More Pythonic version...",
//   "rewriteExplanation": "..."
// }
```

### Career Roadmap Generator
Generates career trajectories with:
- Phase-by-phase progression
- Specific technologies to learn
- Real-world project ideas
- Hiring insights from top companies

---

## 🔧 Technologies Used

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool

### Backend/Services
- **Gemini API** - AI mentorship (code profiling, career guidance)
- **LocalStorage** - Persistent user data
- **JSON** - Data storage

### Development
- **Node.js** - Runtime
- **npm** - Package manager
- **PostCSS** - CSS processing

---

## 📊 Data Structure

### Modules
```json
{
  "id": "python-basics-1",
  "title": "Python First Steps",
  "tier": "beginner",
  "xp": 150,
  "prerequisites": [],
  "lessons": [
    {
      "id": "lesson-1-1",
      "title": "Your First Program",
      "type": "guided-code",
      "steps": [...]
    }
  ]
}
```

### Progress Tracking
```json
{
  "module-id": {
    "completedLessons": ["lesson-1-1", "lesson-1-2"],
    "quizScore": 85,
    "isCompleted": true
  }
}
```

### Badges
```json
{
  "id": "badge-foundation",
  "name": "Foundation Master",
  "description": "Completed all beginner modules",
  "icon": "star"
}
```

---

## 🐛 Bug Fixes & Improvements

Recent updates (April 2026):
- ✅ Fixed critical navigation bug in ModuleCard
- ✅ Added comprehensive lesson data to modules
- ✅ Fixed JSON parsing errors with try-catch blocks
- ✅ Added error boundaries for crash handling
- ✅ Fixed auth validation (email/password checks)
- ✅ Removed XSS vulnerability in Oracle responses
- ✅ Added file size validation for avatar uploads
- ✅ Fixed useEffect dependency issues
- ✅ Improved data integrity (removed fake leaderboard data)

See [CODE_AUDIT_REPORT.md](./CODE_AUDIT_REPORT.md) for detailed bug analysis.

---

## 📈 Roadmap

- [ ] Implement proper authentication with database
- [ ] Add real code execution environment (CodeSandbox/PyScript)
- [ ] Build community discussions/forums
- [ ] Implement real-time multiplayer challenges
- [ ] Add video lessons and screencasts
- [ ] Create premium tier with personalized mentoring
- [ ] Build hiring marketplace for graduates
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 📧 Support

For questions or issues:
- 📧 Email: support@pyquest.dev
- 🐛 Report bugs: [GitHub Issues](https://github.com/yourusername/pyquest/issues)
- 💬 Ask questions: [GitHub Discussions](https://github.com/yourusername/pyquest/discussions)

---

## 🎉 Acknowledgments

- Built with React, Tailwind CSS, and Framer Motion
- AI analysis powered by Google Gemini API
- Inspired by rigorous learning systems and production engineering practices

---

**Ready to master Python? [Start Learning](http://localhost:5173) 🚀**
