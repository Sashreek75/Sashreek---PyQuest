
import { Quest, Achievement } from './types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_step', title: 'Hello World', description: 'Initialized your first session in PyQuest.', icon: '🚀' },
  { id: 'streak_3', title: 'Triple Threat', description: 'Maintained a 3-day learning streak.', icon: '🔥' },
  { id: 'math_wizard', title: 'NumPy Ninja', description: 'Solved your first matrix-based quest.', icon: '🥷' },
  { id: 'ai_architect', title: 'Neural Architect', description: 'Built a multi-layer neural network from scratch.', icon: '🧠' }
];

export const QUESTS: Quest[] = [
  {
    id: 'py-1',
    title: 'The Alchemy of Types',
    category: 'Python Basics',
    difficulty: 'Beginner',
    description: 'Data is the lifeblood of AI. Master the fundamental primitives.',
    longDescription: 'In this module, we transition from simple strings to complex numeric types. Understanding how Python handles memory and precision is critical when preparing tensors for deep learning models. We will explore the nuances of integer versus float representations and f-string interpolation for model logging.',
    objective: 'Create an intelligent profile system that calculates a user\'s biological age in seconds and formats it as a scientific string for audit logging.',
    startingCode: `name = "Researcher"\nage_years = 20\n# TODO: Calculate age in seconds (approx 365.25 days/year to account for leap years)\nage_seconds = 0\nprint(f"Subject: {name} | Lifecycle: {age_seconds}s")`,
    solutionHint: 'Multiply age_years by 365.25 * 24 * 60 * 60 and round the result.',
    topics: ['Variables', 'Integers', 'Scientific Strings', 'Precision'],
    estimatedMinutes: 10,
    xpReward: 250,
    quiz: [
      { 
        question: 'What character starts a comment in Python?', 
        options: ['//', '/*', '#', '--'], 
        correctAnswer: 2,
        explanation: 'The hash symbol (#) is used for single-line comments in Python.'
      },
      {
        question: 'How do you convert a string "10" to an integer?',
        options: ['to_int("10")', 'int("10")', 'Integer.parse("10")', 'cast<int>("10")'],
        correctAnswer: 1,
        explanation: 'The built-in int() function performs type conversion to integers.'
      }
    ]
  },
  {
    id: 'py-2',
    title: 'Logic Gates: The Sentinel',
    category: 'Python Basics',
    difficulty: 'Beginner',
    description: 'Machines only "think" through decisions. Master boolean flow control.',
    longDescription: 'Conditional logic is the precursor to decision trees. In this module, we implement a multi-condition security gate. You will learn to use "and", "or", and "not" operators to control the execution path of your program based on real-time input flags.',
    objective: 'Write a security sentinel script that permits entry only if the subject has a valid clearance ID AND is above age 18.',
    startingCode: `clearance = True\nage = 25\n# TODO: Implement the gate logic using conditional statements\naccess_granted = False`,
    solutionHint: 'Use an if-else statement: "if clearance and age >= 18: access_granted = True".',
    topics: ['Conditionals', 'Compound Logic', 'Boolean Flags'],
    estimatedMinutes: 15,
    xpReward: 300,
    quiz: [
      { 
        question: 'Which operator checks if two values are equal?', 
        options: ['=', '==', '===', 'eq'], 
        correctAnswer: 1,
        explanation: '== is the equality operator; = is for assignment.'
      }
    ]
  },
  {
    id: 'ds-9',
    title: 'The NumPy Array Matrix',
    category: 'Data Science',
    difficulty: 'Intermediate',
    description: 'Vanilla Python is too slow for AI. Harness the power of vectorized operations.',
    longDescription: 'NumPy (Numerical Python) is the foundation of the Python ML stack. By moving operations from Python loops to C-level vectorized calls, we achieve massive speedups. This quest introduces ndarrays, shape manipulation, and broadcasting.',
    objective: 'Create a 5x5 matrix of zeros and change the central value to 1.0 to simulate an activation peak.',
    startingCode: `import numpy as np\n# TODO: Create a 5x5 array of zeros using np.zeros\n# and set the element at index [2,2] to 1.0\nmatrix = None`,
    solutionHint: 'mat = np.zeros((5,5)); mat[2,2] = 1.0',
    topics: ['NumPy', 'Matrix Manipulation', 'Vectorization'],
    estimatedMinutes: 20,
    xpReward: 450,
    quiz: [
      { 
        question: 'What is the standard import alias for NumPy?', 
        options: ['ny', 'num', 'np', 'npy'], 
        correctAnswer: 2,
        explanation: 'Convention dictates using "import numpy as np" for brevity and readability.'
      }
    ]
  },
  {
    id: 'ml-15',
    title: 'Neural Architecture: Activation Layers',
    category: 'Advanced AI',
    difficulty: 'Advanced',
    description: 'Understand how layers of neurons process information via non-linear mapping.',
    longDescription: 'Deep learning relies on non-linearity. Without activation functions like ReLU, a neural network is just a series of linear transformations, which could be collapsed into a single layer. Here, we build the mathematical skeleton of a hidden neuron.',
    objective: 'Implement the mathematical logic of a single hidden layer with a ReLU (Rectified Linear Unit) activation function.',
    startingCode: `import numpy as np\ndef relu(x): \n    # TODO: Implement max(0, x)\n    pass\n\n# Inputs, Weight, Bias\nx = 1.5\nw = 0.8\nb = -0.2\n\n# TODO: Calculate layer output: relu(x * w + b)\noutput = 0`,
    solutionHint: 'y = relu(input * weight + bias)',
    topics: ['Activation Functions', 'Neural Layers', 'ReLU', 'Forward Pass'],
    estimatedMinutes: 30,
    xpReward: 600,
    quiz: [
      { 
        question: 'What does ReLU stand for?', 
        options: ['Reduced Linear Unit', 'Rectified Linear Unit', 'Real Linear Unit', 'Regular Linear Unit'], 
        correctAnswer: 1,
        explanation: 'Rectified Linear Unit is the standard activation function for many deep learning architectures.'
      }
    ]
  }
];
