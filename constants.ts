
import { Quest, Achievement } from './types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_step', title: 'Hello World', description: 'Initialized your first session in PyQuest.', icon: '🚀', rarity: 'Common' },
  { id: 'streak_3', title: 'Triple Threat', description: 'Maintained a 3-day learning streak.', icon: '🔥', rarity: 'Common' },
  { id: 'math_wizard', title: 'NumPy Ninja', description: 'Solved your first matrix-based quest.', icon: '🥷', rarity: 'Rare' },
  { id: 'ai_architect', title: 'Neural Architect', description: 'Built a multi-layer neural network from scratch.', icon: '🧠', rarity: 'Epic' },
  { id: 'transformer_master', title: 'Attention Seeker', description: 'Implemented the Attention mechanism.', icon: '✨', rarity: 'Legendary' }
];

export const QUESTS: Quest[] = [
  {
    id: 'py-1',
    title: 'The Alchemy of Types',
    category: 'Python Foundations',
    difficulty: 'Beginner',
    description: 'Data is the lifeblood of AI. Master the fundamental primitives.',
    lesson: {
      introduction: "To build a house, you need to understand your materials: wood, brick, and glass. In Python, your materials are Types. Every piece of data your AI will ever process is stored in a specific container that determines what it can do.",
      sections: [
        { id: 'types-1', type: 'heading', content: 'The Basic Primitives' },
        { id: 'types-2', type: 'text', content: "Python handles most of this 'material selection' for you, but as an engineer, you need to be precise. The two most important numeric types you'll use are Integers and Floats." },
        { id: 'types-tip-1', type: 'callout', variant: 'pro-tip', title: 'Senior Architect Insight', content: "In Machine Learning, we almost exclusively use Floats. Neural networks calculate 'weights' which are rarely whole numbers. Precision is key!" },
        { id: 'types-demo-1', type: 'code-demo', content: "Basic f-string syntax", snippet: "accuracy = 0.98\nprint(f\"Model Accuracy: {accuracy}\")" }
      ],
      summary: "You now understand that Integers are for counting and Floats are for measuring."
    },
    objective: 'Calculate age in seconds (365.25 days/year) and format it as an f-string.',
    startingCode: `name = "Researcher"\nage_years = 20\n# TODO: Calculate age in seconds\nage_seconds = 0\nprint(f"Subject: {name} | Lifecycle: {age_seconds}s")`,
    solutionHint: 'Multiply age_years by 365.25 * 24 * 60 * 60.',
    topics: ['Variables', 'Integers', 'f-strings'],
    estimatedMinutes: 10,
    xpReward: 250,
    quiz: [{ question: 'Python is interpreted.', options: ['True', 'False'], correctAnswer: 0, explanation: 'Python code is executed line by line.' }],
    technicalPrerequisites: []
  },
  {
    id: 'py-2',
    title: 'Logic Gates: The Sentinel',
    category: 'Python Foundations',
    difficulty: 'Beginner',
    description: 'Machines only "think" through decisions. Master boolean flow control.',
    lesson: {
      introduction: "An AI model is essentially a massive web of 'Yes' and 'No' decisions. To control these decisions, we use Boolean Logic and Conditionals.",
      sections: [
        { id: 'logic-1', type: 'heading', content: 'Conditionals (If/Else)' },
        { id: 'logic-2', type: 'text', content: "Think of an 'if' statement as a gateway. If the condition is True, the code inside the gateway runs." },
        { id: 'logic-demo-1', type: 'code-demo', content: "Checking model performance", snippet: "accuracy = 0.95\nif accuracy > 0.90:\n    print(\"Deploying!\")" }
      ],
      summary: "Boolean logic is the binary foundation of all computing."
    },
    objective: 'Write a security script that grants access only if clearance is True and age is 18+.',
    startingCode: `clearance = True\nage = 25\n# TODO: Check conditions\naccess_granted = False`,
    solutionHint: 'Use: if clearance and age >= 18:',
    topics: ['Conditionals', 'Boolean Logic'],
    estimatedMinutes: 15,
    xpReward: 300,
    quiz: [{ question: 'Which checks for equality?', options: ['=', '=='], correctAnswer: 1, explanation: '== is the equality operator.' }],
    technicalPrerequisites: ['py-1']
  },
  {
    id: 'py-3',
    title: 'Iterative Flow: The Training Loop',
    category: 'Python Foundations',
    difficulty: 'Beginner',
    description: 'Models learn by repeating tasks millions of times. Master loops.',
    lesson: {
      introduction: "In Machine Learning, we don't just do something once. We repeat it until the model gets better. This repetition is powered by Loops.",
      sections: [
        { id: 'loop-1', type: 'heading', content: 'The For Loop' },
        { id: 'loop-2', type: 'text', content: "A 'for' loop iterates over a collection (like a list of images). For every item, it runs the code inside." },
        { id: 'loop-tip-1', type: 'callout', variant: 'info', title: 'The Epoch', content: "In training, one full loop through your entire dataset is called an 'Epoch'. Models often need hundreds of epochs to learn!" },
        { id: 'loop-demo-1', type: 'code-demo', content: "Iterating through epochs", snippet: "for epoch in range(3):\n    print(f\"Current Epoch: {epoch}\")" }
      ],
      summary: "Loops are the heartbeat of the training process."
    },
    objective: 'Write a loop that prints "Step X" for steps 1 through 5.',
    startingCode: `# TODO: Create a loop that iterates from 1 to 5\nfor i in range(1, 6):\n    pass`,
    solutionHint: 'Use print(f"Step {i}") inside the loop.',
    topics: ['Loops', 'Iteration', 'Range'],
    estimatedMinutes: 12,
    xpReward: 275,
    quiz: [{ question: 'What does range(5) produce?', options: ['0 to 5', '1 to 5', '0 to 4'], correctAnswer: 2, explanation: 'range(n) goes from 0 up to n-1.' }],
    technicalPrerequisites: ['py-2']
  },
  {
    id: 'py-4',
    title: 'Modular Logic: Atomic Units',
    category: 'Python Foundations',
    difficulty: 'Beginner',
    description: 'Clean code is modular. Learn to wrap logic into reusable functions.',
    lesson: {
      introduction: "Functions are the fundamental building blocks of software. They allow you to define a logic once and use it everywhere.",
      sections: [
        { id: 'func-1', type: 'heading', content: 'Defining a Function' },
        { id: 'func-2', type: 'text', content: "Use the 'def' keyword to create a function. Functions can take inputs (parameters) and return outputs." },
        { id: 'func-demo-1', type: 'code-demo', content: "Loss calculation function", snippet: "def calculate_loss(target, prediction):\n    return target - prediction" }
      ],
      summary: "Functions keep your architecture clean and maintainable."
    },
    objective: 'Create a function named "is_accurate" that returns True if a score is above 0.90.',
    startingCode: `def is_accurate(score):\n    # TODO: Implement check\n    return False`,
    solutionHint: 'Return score > 0.90',
    topics: ['Functions', 'Parameters', 'Return'],
    estimatedMinutes: 15,
    xpReward: 325,
    quiz: [{ question: 'Functions are defined with:', options: ['func', 'def', 'function'], correctAnswer: 1, explanation: 'def is used to define functions in Python.' }],
    technicalPrerequisites: ['py-3']
  },
  {
    id: 'math-1',
    title: 'Linear Projections: Vectors',
    category: 'Mathematical Logic',
    difficulty: 'Intermediate',
    description: 'Everything is a list of numbers. Learn the math of dimensions.',
    lesson: {
      introduction: "AI doesn't see images; it sees coordinates. A single image is just a massive list of numbers representing pixel colors. We call this a Vector.",
      sections: [
        { id: 'vec-1', type: 'heading', content: 'Dimensions' },
        { id: 'vec-2', type: 'text', content: "A 2D vector is a point on a map. A 3D vector is a point in a room. AI vectors often have thousands of dimensions!" },
        { id: 'vec-tip-1', type: 'callout', variant: 'warning', title: 'Dimension Mismatch', content: "You cannot add a 3D vector to a 2D vector. In the AI world, this is a fatal runtime error!" }
      ],
      summary: "Vectors are the coordinates of thought in a machine."
    },
    objective: 'Calculate the total magnitude of a simple 2D vector [3, 4] using the Pythagorean formula.',
    startingCode: `v = [3, 4]\n# TODO: Calculate sqrt(3^2 + 4^2)\nmagnitude = 0\nprint(magnitude)`,
    solutionHint: 'magnitude = (v[0]**2 + v[1]**2)**0.5',
    topics: ['Vectors', 'Magnitude', 'Calculations'],
    estimatedMinutes: 20,
    xpReward: 400,
    quiz: [{ question: 'What is a 1D array of numbers called?', options: ['Scalar', 'Vector', 'Matrix'], correctAnswer: 1, explanation: 'A vector is a 1D sequence of numbers.' }],
    technicalPrerequisites: ['py-4']
  },
  {
    id: 'math-2',
    title: 'Gradient Foundations: Slopes',
    category: 'Mathematical Logic',
    difficulty: 'Intermediate',
    description: 'The math of learning. Understand how machines find the valley of truth.',
    lesson: {
      introduction: "Machines learn by sliding down a 'gradient'. Imagine you're on a hill in the fog—you find the bottom by feeling which way is down. That's Calculus.",
      sections: [
        { id: 'calc-1', type: 'heading', content: 'The Derivative' },
        { id: 'calc-2', type: 'text', content: "A derivative tells you the slope at a single point. If the slope is positive, going 'right' goes up. If it's negative, going 'right' goes down." }
      ],
      summary: "Derivatives tell the AI which way to change its weights to get smarter."
    },
    objective: 'Calculate the slope of y = x^2 at x = 3. (Hint: the derivative is 2x).',
    startingCode: `x = 3\n# TODO: Calculate the slope 2*x\nslope = 0`,
    solutionHint: 'slope = 2 * x',
    topics: ['Calculus', 'Derivatives', 'Optimization'],
    estimatedMinutes: 25,
    xpReward: 450,
    quiz: [{ question: 'What represents the direction of steepest ascent?', options: ['The Mean', 'The Gradient', 'The Variance'], correctAnswer: 1, explanation: 'The gradient points uphill.' }],
    technicalPrerequisites: ['math-1']
  },
  {
    id: 'de-1',
    title: 'The Tensor Tamer',
    category: 'Data Engineering',
    difficulty: 'Intermediate',
    description: 'Python lists are slow. Meet NumPy: the engine of AI computing.',
    lesson: {
      introduction: "Imagine trying to count a million beans one by one. It's slow. Now imagine having a machine that counts a thousand at a time. That's NumPy.",
      sections: [
        { id: 'np-1', type: 'heading', content: 'What is an Array?' },
        { id: 'np-2', type: 'text', content: "A NumPy Array lives in a special part of memory where every item is the same size. This allows your computer to blast through it using vectorized operations." },
        { id: 'np-demo-1', type: 'code-demo', content: "NumPy Speed", snippet: "import numpy as np\narr = np.array([1, 2, 3])\nprint(arr * 2) # [2, 4, 6]" }
      ],
      summary: "NumPy is the foundation for almost every AI library in existence."
    },
    objective: 'Create a 1D NumPy array of values from 0 to 9 and calculate the mean.',
    startingCode: `import numpy as np\n# TODO: Create array [0..9]\ndata = np.array([])\nmean_val = 0`,
    solutionHint: 'Use np.arange(10) and np.mean(data).',
    topics: ['NumPy', 'Arrays', 'Statistics'],
    estimatedMinutes: 20,
    xpReward: 450,
    quiz: [{ question: 'NumPy arrays are faster than lists.', options: ['True', 'False'], correctAnswer: 0, explanation: 'Vectorization provides significant speedups.' }],
    technicalPrerequisites: ['py-4']
  },
  {
    id: 'de-2',
    title: 'Tabular Mastery: DataFrames',
    category: 'Data Engineering',
    difficulty: 'Intermediate',
    description: 'Master Pandas. The library that makes data science feel like magic.',
    lesson: {
      introduction: "Pandas is 'Excel for Python'. It allows you to load spreadsheets, clean messy data, and analyze trends with single lines of code.",
      sections: [
        { id: 'pd-1', type: 'heading', content: 'The DataFrame' },
        { id: 'pd-2', type: 'text', content: "A DataFrame is a table. It has columns (features) and rows (samples). You can filter it, group it, and summarize it." }
      ],
      summary: "Pandas is the primary tool for data preprocessing in professional AI pipelines."
    },
    objective: 'Create a DataFrame with a "salary" column and calculate the average salary.',
    startingCode: `import pandas as pd\ndf = pd.DataFrame({"salary": [50000, 60000, 70000]})\n# TODO: Calculate average\navg_salary = 0`,
    solutionHint: 'avg_salary = df["salary"].mean()',
    topics: ['Pandas', 'DataFrames', 'Data Cleaning'],
    estimatedMinutes: 25,
    xpReward: 500,
    quiz: [{ question: 'What is a column in a DataFrame called?', options: ['List', 'Series', 'Array'], correctAnswer: 1, explanation: 'A single column in Pandas is a Series.' }],
    technicalPrerequisites: ['de-1']
  },
  {
    id: 'cml-1',
    title: 'Predictive Lines: Regression',
    category: 'Classical ML',
    difficulty: 'Intermediate',
    description: 'The hello world of ML. Predict a number based on historical trends.',
    lesson: {
      introduction: "Linear Regression is about finding the 'Best Fit Line'. If you know how size relates to house price, you can predict the price of a house you've never seen.",
      sections: [
        { id: 'reg-1', type: 'heading', content: 'The Slope-Intercept' },
        { id: 'reg-2', type: 'text', content: "Regression finds the 'm' and 'b' in y = mx + b. 'm' is the weight, and 'b' is the bias." }
      ],
      summary: "Regression is the bedrock of forecasting."
    },
    objective: 'Calculate a prediction using y = 2x + 10 for x = 5.',
    startingCode: `x = 5\nm = 2\nb = 10\n# TODO: Calculate y\nprediction = 0`,
    solutionHint: 'prediction = m * x + b',
    topics: ['Regression', 'Supervised Learning', 'Modeling'],
    estimatedMinutes: 20,
    xpReward: 550,
    quiz: [{ question: 'Regression predicts _____ values.', options: ['Categorical', 'Continuous', 'Binary'], correctAnswer: 1, explanation: 'Regression is for predicting numbers, not categories.' }],
    technicalPrerequisites: ['math-2']
  },
  {
    id: 'cml-2',
    title: 'Forest Logic: Decision Trees',
    category: 'Classical ML',
    difficulty: 'Intermediate',
    description: 'Models that think like humans. A series of nested questions.',
    lesson: {
      introduction: "A Decision Tree is basically a complex 'Flow Chart'. Is it raining? Yes. Do you have an umbrella? No. Result: Get wet.",
      sections: [
        { id: 'tree-1', type: 'heading', content: 'Gini Impurity' },
        { id: 'tree-2', type: 'text', content: "Trees decide which questions to ask based on which question splits the data into the 'purest' groups." }
      ],
      summary: "Decision Trees are highly interpretable—you can see exactly why they made a choice."
    },
    objective: 'Implement a mock "Tree Node" that returns "Cat" if features[0] > 0.5 and "Dog" otherwise.',
    startingCode: `features = [0.8]\n# TODO: Implement if/else tree\nprediction = ""`,
    solutionHint: 'if features[0] > 0.5: prediction = "Cat"',
    topics: ['Trees', 'Ensembles', 'Classification'],
    estimatedMinutes: 25,
    xpReward: 575,
    quiz: [{ question: 'A group of trees is called a:', options: ['Jungle', 'Orchard', 'Random Forest'], correctAnswer: 2, explanation: 'Ensembles of trees are Random Forests.' }],
    technicalPrerequisites: ['cml-1']
  },
  {
    id: 'dl-1',
    title: 'The Neural Spark',
    category: 'Deep Learning',
    difficulty: 'Intermediate',
    description: 'Understand the building block of intelligence: The Neuron.',
    lesson: {
      introduction: "A Neural Network is just a collection of digital 'neurons'. Each neuron takes inputs, does some simple math, and decides if it should 'fire' a signal.",
      sections: [
        { id: 'nn-1', type: 'heading', content: 'Activation Functions' },
        { id: 'nn-2', type: 'text', content: "An Activation Function is like a dimmer switch. ReLU is the most famous one: it turns negative signals into zero." },
        { id: 'nn-demo-1', type: 'code-demo', content: "The ReLU Logic", snippet: "def relu(x):\n    return max(0, x)" }
      ],
      summary: "Neurons process signals. Activation functions shape them."
    },
    objective: 'Implement ReLU and use it to process [-2.5, 4.0, 0.0].',
    startingCode: `inputs = [-2.5, 4.0, 0.0]\n# TODO: Process inputs\noutputs = []`,
    solutionHint: 'outputs = [max(0, x) for x in inputs]',
    topics: ['Deep Learning', 'Activation Functions', 'ReLU'],
    estimatedMinutes: 25,
    xpReward: 550,
    quiz: [{ question: 'ReLU makes negative numbers:', options: ['Positive', 'Zero', 'Double'], correctAnswer: 1, explanation: 'ReLU filters out negative signals.' }],
    technicalPrerequisites: ['math-2']
  },
  {
    id: 'dl-2',
    title: 'Image Recognition: CNNs',
    category: 'Deep Learning',
    difficulty: 'Intermediate',
    description: 'How computers "see". Master the Convolution operation.',
    lesson: {
      introduction: "To see an edge, you look for a sharp change in color. Computers use 'Filters' (tiny math grids) to find these edges. This is called a Convolution.",
      sections: [
        { id: 'cnn-1', type: 'heading', content: 'Feature Maps' },
        { id: 'cnn-2', type: 'text', content: "A CNN passes a filter over an image to create a 'Feature Map' that highlights edges, then shapes, then objects." }
      ],
      summary: "Convolutions allow AI to recognize patterns regardless of where they are in an image."
    },
    objective: 'Calculate the total sum of a 2x2 section of an image multiplied by a 2x2 "filter" [[1, 0], [0, 1]].',
    startingCode: `img_patch = [[10, 20], [30, 40]]\nfilt = [[1, 0], [0, 1]]\n# TODO: Multiply and sum\nresult = 0`,
    solutionHint: 'result = (10*1) + (20*0) + (30*0) + (40*1)',
    topics: ['Computer Vision', 'CNNs', 'Filters'],
    estimatedMinutes: 30,
    xpReward: 650,
    quiz: [{ question: 'CNNs are best for:', options: ['Text', 'Audio', 'Images'], correctAnswer: 2, explanation: 'CNNs excel at spatial pattern recognition.' }],
    technicalPrerequisites: ['dl-1']
  },
  {
    id: 'arch-1',
    title: 'Architecture Design: Layers',
    category: 'Neural Architectures',
    difficulty: 'Advanced',
    description: 'Assemble your network. Learn to stack layers into deep pipelines.',
    lesson: {
      introduction: "One neuron is weak. A thousand layers are strong. Stacking layers allows models to build 'hierarchies of knowledge'.",
      sections: [
        { id: 'arch-1', type: 'heading', content: 'The Hidden Layer' },
        { id: 'arch-2', type: 'text', content: "Hidden layers extract increasingly abstract features. The first layer sees lines; the last layer sees faces." }
      ],
      summary: "Deep Learning is simply many simple layers working in concert."
    },
    objective: 'Calculate the output of a 2-layer network. Layer 1: x*2. Layer 2: layer1_out + 5. Input x = 10.',
    startingCode: `x = 10\n# TODO: Pass through layers\nout = 0`,
    solutionHint: 'l1 = x * 2; out = l1 + 5',
    topics: ['Architectures', 'Layers', 'Pipelines'],
    estimatedMinutes: 30,
    xpReward: 700,
    quiz: [{ question: 'Layers between input and output are:', options: ['Ghost layers', 'Middle layers', 'Hidden layers'], correctAnswer: 2, explanation: 'They are called hidden because we only see inputs/outputs.' }],
    technicalPrerequisites: ['dl-2']
  },
  {
    id: 'trans-1',
    title: 'Attention: The Focus Mechanism',
    category: 'LLM & Transformers',
    difficulty: 'Advanced',
    description: 'The secret behind ChatGPT. Learn how models focus on specific words.',
    lesson: {
      introduction: "When you read a sentence, you don't look at every word with equal importance. Attention is the math that allows models to build these connections.",
      sections: [
        { id: 'att-1', type: 'heading', content: 'Queries, Keys, and Values' },
        { id: 'att-2', type: 'text', content: "Query is the word you're looking for. Key is the word you're matching against. Value is the meaning." }
      ],
      summary: "Attention is the engine of modern LLMs."
    },
    objective: 'Simulate a softmax score for [2.0, 1.0]. Normalized probs should sum to 1.',
    startingCode: `import math\nscores = [2.0, 1.0]\n# TODO: Calculate exp(x) / sum(exp(all))\nprobs = []`,
    solutionHint: 'e = [math.exp(s) for s in scores]; probs = [x/sum(e) for x in e]',
    topics: ['Transformers', 'Attention', 'Softmax'],
    estimatedMinutes: 40,
    xpReward: 850,
    quiz: [{ question: 'What ensures attention weights sum to 1?', options: ['ReLU', 'Sigmoid', 'Softmax'], correctAnswer: 2, explanation: 'Softmax creates probability distributions.' }],
    technicalPrerequisites: ['arch-1']
  },
  {
    id: 'trans-2',
    title: 'The Art of Embeddings',
    category: 'LLM & Transformers',
    difficulty: 'Intermediate',
    description: 'Turning words into numbers. Master semantic vector mapping.',
    lesson: {
      introduction: "How does 'King' - 'Man' + 'Woman' = 'Queen'? Embeddings map words into a multi-dimensional space where distance means similarity.",
      sections: [
        { id: 'emb-1', type: 'heading', content: 'Semantic Similarity' },
        { id: 'emb-2', type: 'text', content: "Words that appear in similar contexts (like 'Pizza' and 'Burger') are pushed closer together in the embedding space." }
      ],
      summary: "Embeddings turn language into geometry."
    },
    objective: 'Define a dictionary embedding where "AI" maps to [0.9, 0.1] and "Bio" to [0.1, 0.9].',
    startingCode: `embeddings = {}\n# TODO: Map "AI" and "Bio" to vectors`,
    solutionHint: 'embeddings = {"AI": [0.9, 0.1], "Bio": [0.1, 0.9]}',
    topics: ['Embeddings', 'NLP', 'Semantics'],
    estimatedMinutes: 30,
    xpReward: 600,
    quiz: [{ question: 'Embeddings turn words into:', options: ['Strings', 'Vectors', 'Bools'], correctAnswer: 1, explanation: 'Embeddings are numerical vector representations.' }],
    technicalPrerequisites: ['math-1']
  },
  {
    id: 'ops-1',
    title: 'Production Ingress',
    category: 'MLOps & Deployment',
    difficulty: 'Advanced',
    description: 'Code is useless if it stays on your laptop. Deploy it to the world.',
    lesson: {
      introduction: "You've built a model. Now what? You need to wrap it in a Web API so apps can use it.",
      sections: [
        { id: 'ops-1', type: 'heading', content: 'The Prediction Endpoint' },
        { id: 'ops-tip-1', type: 'callout', variant: 'pro-tip', title: 'Latency', content: "FastAPI is the industry standard for high-performance ML deployments." }
      ],
      summary: "MLOps is the bridge between experiment and product."
    },
    objective: 'Design a mock API response dictionary with "status" and "label".',
    startingCode: `def get_response(score):\n    # TODO: Return dict with "status": "success"\n    return {}`,
    solutionHint: 'return {"status": "success", "label": "Cat" if score > 0.5 else "Dog"}',
    topics: ['MLOps', 'APIs', 'Deployment'],
    estimatedMinutes: 30,
    xpReward: 700,
    quiz: [{ question: 'Common API data format:', options: ['CSV', 'JSON', 'XML'], correctAnswer: 1, explanation: 'JSON is the standard for web APIs.' }],
    technicalPrerequisites: ['py-4']
  }
];
