
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type QuestCategory = 'Python Basics' | 'Intermediate Python' | 'Data Science' | 'Machine Learning' | 'Advanced AI' | 'Neural Architectures';

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
}

// Added password field to solve property existence errors in components/Auth.tsx
export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  createdAt: string;
  interests: string;
  goal: string;
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
  skillPoints: Record<string, number>;
}

export interface Progress {
  userId: string;
  completedQuests: string[];
  passedQuizzes: string[];
  experience: number;
  careerGoal?: string;
  currentStreak: number;
  lastActiveDate?: string;
  achievements: Achievement[];
}

export interface CodeEvaluation {
  status: 'success' | 'partial' | 'error';
  feedback: string;
  metrics?: {
    accuracy?: number;
    loss?: number;
    precision?: number;
    recall?: number;
  };
  visualizationData?: any[];
  mentorAdvice?: string;
}
