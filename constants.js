// Application Constants - centralized configuration
// This eliminates magic strings and makes refactoring easier

// LocalStorage Keys
export const STORAGE_KEYS = {
    USER: 'pyquest_user',
    PROGRESS: 'pyquest_progress',
    BADGES: 'pyquest_badges',
    ONBOARDING: 'pyquest_onboarding',
    ACTIVE_GOAL: 'pyquest_active_goal',
    ORACLE_KEY: 'PYQUEST_ORACLE_KEY'
};

// Badge IDs
export const BADGE_IDS = {
    MASTERY: 'badge-mastery',
    FIRST_LESSON: 'badge-first-lesson',
    QUIZ_MASTER: 'badge-quiz-master',
    CHALLENGE_COMPLETE: 'badge-challenge-complete'
};

// Module IDs
export const MODULE_IDS = {
    PYTHON_BASICS: 'python-basics-1',
    PYTHON_DATA_STRUCTURES: 'python-data-structures',
    PYTHON_CONTROL_FLOW: 'python-control-flow',
    PYTHON_FUNCTIONS: 'python-functions',
    PYTHON_OOP: 'python-oop-basics',
    PYTHON_EXCEPTIONS: 'python-exceptions-io',
    PYTHON_ALGORITHMS: 'python-algorithms',
    PYTHON_FUNCTIONAL: 'python-functional',
    PYTHON_ASYNC: 'python-async',
    PYTHON_DATA_SCIENCE: 'python-data-science',
    PYTHON_APIS: 'python-apis-data',
    PYTHON_AI_LLMS: 'python-ai-llms',
    PYTHON_AUTOMATION: 'python-automation',
    PYTHON_CAPSTONE: 'python-capstone'
};

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    DASHBOARD: '/dashboard',
    ONBOARDING: '/onboarding',
    MODULES: '/modules',
    LESSON: (moduleId, lessonId) => `/modules/${moduleId}/lesson/${lessonId}`,
    PROFILE: '/profile',
    CHALLENGES: '/challenges',
    CODESPACE: (challengeId) => `/codespace/${challengeId}`,
    LEADERBOARD: '/leaderboard',
    ROADMAP: '/roadmap',
    CIRCUIT: '/circuit'
};

// Quiz/Challenge Thresholds
export const THRESHOLDS = {
    QUIZ_PASS: 75,
    CHALLENGE_PASS: 75,
    ERROR_RELOAD_THRESHOLD: 3
};

// XP Values
export const XP_VALUES = {
    LESSON_COMPLETION: 50,
    QUIZ_BONUS: 100,
    CHALLENGE_EASY: 250,
    CHALLENGE_MEDIUM: 350,
    CHALLENGE_HARD: 500,
    MISTAKE_SCAN: 10
};

// Time Constants
export const TIME_CONSTANTS = {
    ONE_DAY_MS: 86400000,
    STREAK_CHECK_INTERVAL_MS: 86400000,
    CHAT_HISTORY_LIMIT: 100
};

// Difficulty Levels
export const DIFFICULTY = {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced'
};

// Tier Levels
export const TIERS = {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced'
};

// Lesson Types
export const LESSON_TYPES = {
    GUIDED_CODE: 'guided-code',
    QUIZ: 'quiz',
    CODE: 'code',
    CODEX: 'codex'
};

// UI Size Constants
export const UI_SIZES = {
    PROGRESS_BAR_SM: 'sm',
    PROGRESS_BAR_MD: 'md',
    PROGRESS_BAR_LG: 'lg'
};

// Color Constants
export const COLORS = {
    PRIMARY: 'primary',
    SUCCESS: 'success',
    WARNING: 'warning',
    DANGER: 'danger'
};

// API Configuration
export const API_CONFIG = {
    GEMINI_MODEL: 'gemini-1.5-flash',
    REQUEST_TIMEOUT_MS: 30000,
    MAX_RETRIES: 3
};

// File Upload Limits
export const FILE_LIMITS = {
    AVATAR_MAX_SIZE: 2 * 1024 * 1024, // 2MB
    AVATAR_ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

// Challenge Generation
export const CHALLENGE_LIMITS = {
    MAX_HISTORY: 20,
    GENERATE_DELAY_MS: 800
};
