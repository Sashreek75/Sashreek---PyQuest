
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type QuestCategory = 
  | 'Python Foundations' 
  | 'Mathematical Logic' 
  | 'Data Engineering' 
  | 'Classical ML' 
  | 'Deep Learning' 
  | 'Neural Architectures'
  | 'LLM & Transformers'
  | 'MLOps & Deployment';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  unlockedAt?: string;
}

export interface Quest {
  id: string;
  title: string;
  category: QuestCategory;
  difficulty: Difficulty;
  description: string;
  longDescription: string;
  objective: string;
  startingCode: string;
  solutionHint: string;
  topics: string[];
  estimatedMinutes: number;
  xpReward: number;
  quiz: QuizQuestion[];
  technicalPrerequisites: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  createdAt: string;
  interests: string;
  goal: string;
  avatarSeed: string;
  provider: 'google' | 'github' | 'email';
}

export interface SkillNode {
  name: string;
  level: number;
  xp: number;
  color: string;
}

export interface UserStats {
  level: number;
  xp: number;
  questsCompleted: number;
  accuracy: number;
  streak: number;
  badges: string[];
  rank: string;
  totalHours: number;
  skillMatrix: SkillNode[];
  globalPercentile: number;
}

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: 'Mastered' | 'Active' | 'Locked';
  category: string;
  tags: string[];
  dependencies: string[];
  recommendedResources: string[];
  x: number;
  y: number;
}

export interface RoadmapData {
  title: string;
  careerPath: string;
  summary: string;
  nodes: RoadmapNode[];
}

export interface Progress {
  userId: string;
  completedQuests: string[];
  passedQuizzes: string[];
  experience: number;
  careerGoal?: string;
  roadmapData?: RoadmapData;
  currentStreak: number;
  lastActiveDate?: string;
  achievements: Achievement[];
  dailyLoginCount: number;
}

export interface CodeEvaluation {
  status: 'success' | 'partial' | 'error';
  feedback: string;
  technicalDetails: string;
  metrics?: {
    accuracy?: number;
    loss?: number;
    precision?: number;
    recall?: number;
    f1_score?: number;
  };
  visualizationData?: any[];
  mentorAdvice?: string;
  suggestedResources: string[];
}
