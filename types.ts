
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quest {
  id: string;
  title: string;
  category: 'Python Basics' | 'Intermediate Python' | 'Data Science' | 'Machine Learning' | 'Advanced AI';
  difficulty: Difficulty;
  description: string;
  objective: string;
  startingCode: string;
  solutionHint: string;
  topics: string[];
  quiz?: QuizQuestion[];
}

export interface UserStats {
  level: number;
  xp: number;
  questsCompleted: number;
  accuracy: number;
  streak: number;
  badges: string[];
}

export interface Progress {
  completedQuests: string[];
  currentQuestId: string | null;
  experience: number;
  careerGoal?: string;
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
}
