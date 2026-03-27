
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
    title: 'Getting Started with Data',
    category: 'Python Foundations',
    difficulty: 'Beginner',
    description: 'Every program starts with data. Learn how Python handles numbers and text.',
    lesson: {
      introduction: "Think of Python like a very organized assistant. To help you, it needs to know what kind of 'stuff' you're giving it. Is it a whole number? A decimal? A piece of text? In programming, we call these 'Types'. Understanding them is the first step to building anything, from a simple calculator to a complex AI.",
      sections: [
        { id: 'types-1', type: 'heading', content: 'Numbers in Python' },
        { id: 'types-2', type: 'text', content: "Python mainly uses two types of numbers: Integers (whole numbers like 5 or -10) and Floats (decimal numbers like 3.14 or 0.98). While they might look similar, Python treats them differently behind the scenes to save memory and stay fast." },
        { id: 'types-tip-1', type: 'callout', variant: 'info', title: 'Why this matters', content: "In the world of AI, we use Floats almost all the time. When an AI 'learns', it makes tiny adjustments to its internal settings—adjustments so small that whole numbers just aren't precise enough." },
        { id: 'types-demo-1', type: 'code-demo', content: "Printing with f-strings", snippet: "accuracy = 0.98\n# f-strings let you easily mix text and variables\nprint(f\"The model is {accuracy * 100}% accurate!\")" }
      ],
      summary: "You've learned that Integers are for counting and Floats are for precise measurements. You also saw how f-strings make it easy to display information."
    },
    objective: 'Calculate how many seconds are in a year (assuming 365.25 days) and print it using an f-string.',
    startingCode: `name = "Explorer"\nage_years = 1\n# TODO: Calculate seconds in a year\n# Hint: days * hours * minutes * seconds\nseconds_in_year = 0\nprint(f"Hello {name}, there are {seconds_in_year} seconds in a year!")`,
    solutionHint: 'Multiply 365.25 * 24 * 60 * 60.',
    topics: ['Variables', 'Numbers', 'f-strings'],
    estimatedMinutes: 10,
    xpReward: 250,
    quiz: [{ question: 'Which type would you use for a percentage like 85.5%?', options: ['Integer', 'Float'], correctAnswer: 1, explanation: 'Floats are used for decimal numbers.' }],
    technicalPrerequisites: []
  },
  {
    id: 'py-2',
    title: 'Making Decisions',
    category: 'Python Foundations',
    difficulty: 'Beginner',
    description: 'Teach your code how to make choices based on different conditions.',
    lesson: {
      introduction: "A smart program needs to react to different situations. Should it send an alert? Should it grant access? We use 'Conditionals' to give our code this decision-making power.",
      sections: [
        { id: 'logic-1', type: 'heading', content: 'The "If" Statement' },
        { id: 'logic-2', type: 'text', content: "The 'if' statement is like a fork in the road. If a condition is met (True), the code takes one path. If not, it can take another path using 'else'." },
        { id: 'logic-demo-1', type: 'code-demo', content: "A simple check", snippet: "score = 85\nif score >= 80:\n    print(\"Great job! You passed.\")\nelse:\n    print(\"Keep practicing, you'll get it next time!\")" }
      ],
      summary: "Conditionals allow your program to be dynamic and responsive rather than just following a fixed list of steps."
    },
    objective: 'Create a simple check that prints "Access Granted" if a user is 18 or older and has a valid ID.',
    startingCode: `has_id = True\nage = 20\n# TODO: Write an if statement to check age and ID\n# If both are true, print "Access Granted"`,
    solutionHint: 'Use: if has_id and age >= 18:',
    topics: ['Conditionals', 'Logic'],
    estimatedMinutes: 15,
    xpReward: 300,
    quiz: [{ question: 'What symbol do we use to check if two values are equal?', options: ['=', '=='], correctAnswer: 1, explanation: 'In Python, == checks for equality, while = assigns a value.' }],
    technicalPrerequisites: ['py-1']
  },
  {
    id: 'py-3',
    title: 'The Power of Repetition',
    category: 'Python Foundations',
    difficulty: 'Beginner',
    description: 'Learn how to automate repetitive tasks using loops.',
    lesson: {
      introduction: "Computers are great at doing the same thing over and over without getting bored. We call this 'Iteration', and it's how AI models process millions of data points to learn patterns.",
      sections: [
        { id: 'loop-1', type: 'heading', content: 'For Loops' },
        { id: 'loop-2', type: 'text', content: "A 'for' loop lets you run a block of code for every item in a list or a range of numbers. It's the most common way to automate repetitive work." },
        { id: 'loop-tip-1', type: 'callout', variant: 'info', title: 'Real-world use', content: "When training an AI, we loop through the entire dataset many times. Each full pass is called an 'Epoch'. The more epochs, the more the AI can refine its understanding." },
        { id: 'loop-demo-1', type: 'code-demo', content: "Counting steps", snippet: "for step in range(1, 4):\n    print(f\"Processing step {step}...\")" }
      ],
      summary: "Loops save you from writing the same code multiple times and are essential for handling large amounts of data."
    },
    objective: 'Write a loop that counts from 1 to 5 and prints "Training session X" for each number.',
    startingCode: `# TODO: Create a loop from 1 to 5\n# Print "Training session 1", "Training session 2", etc.`,
    solutionHint: 'Use range(1, 6) and an f-string.',
    topics: ['Loops', 'Automation'],
    estimatedMinutes: 12,
    xpReward: 275,
    quiz: [{ question: 'If you want to run a loop 10 times, what range would you use?', options: ['range(10)', 'range(1, 10)', 'range(11)'], correctAnswer: 0, explanation: 'range(10) generates numbers from 0 to 9, which is 10 items total.' }],
    technicalPrerequisites: ['py-2']
  },
  {
    id: 'py-4',
    title: 'Reusable Code with Functions',
    category: 'Python Foundations',
    difficulty: 'Beginner',
    description: 'Stop repeating yourself. Learn how to wrap your logic into reusable blocks.',
    lesson: {
      introduction: "Imagine if you had to explain how to make a sandwich every single time you wanted one. It would be exhausting! Instead, you just say 'make a sandwich'. In Python, we do the same thing with Functions. We define a set of instructions once, give it a name, and then just call that name whenever we need it.",
      sections: [
        { id: 'func-1', type: 'heading', content: 'Defining Your First Function' },
        { id: 'func-2', type: 'text', content: "To create a function, we use the 'def' keyword followed by a name and parentheses. Any code indented under that line belongs to the function. You can also send information into a function (parameters) and get a result back (return)." },
        { id: 'func-demo-1', type: 'code-demo', content: "A simple greeting", snippet: "def greet(name):\n    return f\"Hello, {name}! Welcome to the team.\"\n\nmessage = greet(\"Alice\")\nprint(message)" }
      ],
      summary: "Functions are the secret to writing clean, organized, and professional code. They make your programs much easier to read and maintain."
    },
    objective: 'Create a function named "calculate_percentage" that takes a score and a total, and returns the percentage (score/total * 100).',
    startingCode: `def calculate_percentage(score, total):\n    # TODO: Calculate and return the percentage\n    return 0\n\n# Test it out\nprint(calculate_percentage(80, 100))`,
    solutionHint: 'Return (score / total) * 100',
    topics: ['Functions', 'Parameters', 'Return'],
    estimatedMinutes: 15,
    xpReward: 325,
    quiz: [{ question: 'What keyword is used to start a function definition?', options: ['func', 'def', 'function'], correctAnswer: 1, explanation: 'def stands for "define".' }],
    technicalPrerequisites: ['py-3']
  },
  {
    id: 'math-1',
    title: 'Thinking in Dimensions',
    category: 'Mathematical Logic',
    difficulty: 'Intermediate',
    description: 'AI sees the world through numbers. Learn how we represent data as vectors.',
    lesson: {
      introduction: "When you look at a photo of a cat, you see fur and whiskers. An AI sees a massive grid of numbers. Each number represents the brightness or color of a single pixel. To process this, we group these numbers into 'Vectors'.",
      sections: [
        { id: 'vec-1', type: 'heading', content: 'What is a Vector?' },
        { id: 'vec-2', type: 'text', content: "A vector is just a list of numbers that represents a point in space. A 2D vector [x, y] is a point on a flat map. A 3D vector [x, y, z] is a point in a room. AI models often work with vectors that have thousands of dimensions!" },
        { id: 'vec-tip-1', type: 'callout', variant: 'warning', title: 'A common mistake', content: "You can only perform math on vectors that have the same number of dimensions. Trying to add a 2D vector to a 3D vector is like trying to add apples to spaceships—it just doesn't work!" }
      ],
      summary: "Vectors are the language of AI. They allow us to turn abstract concepts like images, sounds, and words into math that a computer can understand."
    },
    objective: 'Find the distance from the origin [0, 0] to a point [3, 4] using the Pythagorean theorem (a² + b² = c²).',
    startingCode: `point = [3, 4]\n# TODO: Calculate the square root of (3^2 + 4^2)\n# Hint: You can use **0.5 for square root\ndistance = 0\nprint(f"The distance is {distance}")`,
    solutionHint: 'distance = (point[0]**2 + point[1]**2)**0.5',
    topics: ['Vectors', 'Math', 'Geometry'],
    estimatedMinutes: 20,
    xpReward: 400,
    quiz: [{ question: 'What do we call a 1D list of numbers in AI math?', options: ['Scalar', 'Vector', 'Matrix'], correctAnswer: 1, explanation: 'A vector is a one-dimensional array of numbers.' }],
    technicalPrerequisites: ['py-4']
  },
  {
    id: 'math-2',
    title: 'Finding the Best Path: Slopes',
    category: 'Mathematical Logic',
    difficulty: 'Intermediate',
    description: 'How do machines learn from their mistakes? It all starts with a slope.',
    lesson: {
      introduction: "Imagine you're standing on a foggy mountain and you want to find the valley below. You can't see the bottom, but you can feel the ground under your feet. If the ground slopes down to the left, you step left. This is exactly how AI 'learns'—it feels the slope of its errors and moves toward the bottom where the errors are smallest. We call this 'Gradient Descent'.",
      sections: [
        { id: 'calc-1', type: 'heading', content: 'The Power of the Derivative' },
        { id: 'calc-2', type: 'text', content: "A 'Derivative' is just a fancy word for the slope of a curve at a specific point. If the derivative is positive, the hill goes up. If it's negative, the hill goes down. By constantly checking this slope, an AI can figure out exactly how to change its settings to get better at its task." },
        { id: 'calc-tip-1', type: 'callout', variant: 'info', title: 'Why it matters', content: "Every time ChatGPT or a self-driving car gets 'smarter', it's because it used derivatives to find a slightly better path toward the truth." }
      ],
      summary: "Calculus isn't just about abstract formulas; it's the engine that allows machines to improve themselves through experience."
    },
    objective: 'Calculate the slope of the curve y = x² at the point where x = 3. (The derivative of x² is 2x).',
    startingCode: `x = 3\n# TODO: Calculate the slope using the formula 2 * x\nslope = 0\nprint(f"The slope at x={x} is {slope}")`,
    solutionHint: 'slope = 2 * x',
    topics: ['Calculus', 'Derivatives', 'Optimization'],
    estimatedMinutes: 25,
    xpReward: 450,
    quiz: [{ question: 'What do we call the direction that points toward the steepest ascent?', options: ['The Mean', 'The Gradient', 'The Variance'], correctAnswer: 1, explanation: 'The gradient points "uphill". To learn, AI moves in the opposite direction (downhill).' }],
    technicalPrerequisites: ['math-1']
  },
  {
    id: 'de-1',
    title: 'The Speed of NumPy',
    category: 'Data Engineering',
    difficulty: 'Intermediate',
    description: 'Python lists are great, but for AI, we need something faster. Enter NumPy.',
    lesson: {
      introduction: "Imagine you have a million boxes to move. You could move them one by one (like a standard Python list), or you could use a giant conveyor belt that moves a thousand at once. NumPy is that conveyor belt. It's the engine that powers almost all AI research because it's incredibly fast at handling large amounts of numbers.",
      sections: [
        { id: 'np-1', type: 'heading', content: 'What is a NumPy Array?' },
        { id: 'np-2', type: 'text', content: "A NumPy array is like a list, but it's much more efficient. Because every item in the array is the same type (like all integers or all floats), your computer can process them all at once using something called 'Vectorization'. This can make your code hundreds of times faster!" },
        { id: 'np-demo-1', type: 'code-demo', content: "NumPy in Action", snippet: "import numpy as np\n# Create an array and multiply every item by 2 instantly\nprices = np.array([10, 20, 30])\ndiscounted = prices * 0.9\nprint(discounted)" }
      ],
      summary: "NumPy is the foundation of the AI world. Without it, training modern models would take years instead of days."
    },
    objective: 'Create a NumPy array with the numbers 10, 20, 30, 40, 50 and calculate their average (mean).',
    startingCode: `import numpy as np\n# TODO: Create the array and calculate the mean\ndata = np.array([])\naverage = 0\nprint(f"The average is {average}")`,
    solutionHint: 'data = np.array([10, 20, 30, 40, 50]); average = np.mean(data)',
    topics: ['NumPy', 'Arrays', 'Performance'],
    estimatedMinutes: 20,
    xpReward: 450,
    quiz: [{ question: 'Why is NumPy faster than standard Python lists for math?', options: ['It uses better colors', 'It uses Vectorization', 'It has a cooler name'], correctAnswer: 1, explanation: 'Vectorization allows the computer to perform the same operation on many items simultaneously.' }],
    technicalPrerequisites: ['py-4']
  },
  {
    id: 'de-2',
    title: 'Data Science with Pandas',
    category: 'Data Engineering',
    difficulty: 'Intermediate',
    description: 'Master Pandas, the library that makes data science feel like magic.',
    lesson: {
      introduction: "If NumPy is a conveyor belt for numbers, Pandas is 'Excel for Python'. It allows you to load massive spreadsheets, clean up messy data, and find trends with just a few lines of code. It's the primary tool used by data scientists to prepare data for AI models.",
      sections: [
        { id: 'pd-1', type: 'heading', content: 'The DataFrame' },
        { id: 'pd-2', type: 'text', content: "A DataFrame is essentially a table, like a sheet in Excel. It has columns (which we call 'Features') and rows (which we call 'Samples'). You can easily filter, group, and summarize these tables to gain insights." },
        { id: 'pd-tip-1', type: 'callout', variant: 'pro-tip', title: 'Data Cleaning', content: "Real-world data is often messy—it has missing values or typos. Pandas has built-in tools to find and fix these errors automatically." }
      ],
      summary: "Pandas turns raw, messy data into clean, structured information that an AI can actually learn from."
    },
    objective: 'Create a DataFrame with a "salary" column containing [50000, 60000, 70000] and calculate the average salary.',
    startingCode: `import pandas as pd\n# TODO: Create the DataFrame and calculate the mean\ndf = pd.DataFrame({})\navg_salary = 0\nprint(f"The average salary is {avg_salary}")`,
    solutionHint: 'df = pd.DataFrame({"salary": [50000, 60000, 70000]}); avg_salary = df["salary"].mean()',
    topics: ['Pandas', 'DataFrames', 'Data Cleaning'],
    estimatedMinutes: 25,
    xpReward: 500,
    quiz: [{ question: 'What is a single column in a Pandas DataFrame called?', options: ['List', 'Series', 'Array'], correctAnswer: 1, explanation: 'A single column is a "Series", while the whole table is a "DataFrame".' }],
    technicalPrerequisites: ['de-1']
  },
  {
    id: 'cml-1',
    title: 'Predicting Trends: Regression',
    category: 'Classical ML',
    difficulty: 'Intermediate',
    description: 'The "Hello World" of Machine Learning. Predict a number based on historical trends.',
    lesson: {
      introduction: "Linear Regression is like finding the 'Best Fit Line' through a cloud of data points. If you know how the size of a house relates to its price, you can draw a line that predicts the price of a house you've never seen before. It's the simplest and most common form of predictive modeling.",
      sections: [
        { id: 'reg-1', type: 'heading', content: 'The Math of a Line' },
        { id: 'reg-2', type: 'text', content: "Regression tries to find the best values for 'm' (the weight) and 'b' (the bias) in the classic equation: y = mx + b. In AI terms, 'x' is your input (like house size) and 'y' is your prediction (like price)." },
        { id: 'reg-demo-1', type: 'code-demo', content: "A simple prediction", snippet: "# y = 2x + 10\ndef predict(x):\n    return 2 * x + 10\n\nprint(predict(5)) # Output: 20" }
      ],
      summary: "Regression is the bedrock of forecasting. It's used everywhere, from predicting stock prices to estimating how much battery life your phone has left."
    },
    objective: 'Calculate a prediction using the formula y = 3x + 5 for an input of x = 10.',
    startingCode: `x = 10\nm = 3\nb = 5\n# TODO: Calculate the prediction\nprediction = 0\nprint(f"The prediction for x={x} is {prediction}")`,
    solutionHint: 'prediction = m * x + b',
    topics: ['Regression', 'Supervised Learning', 'Modeling'],
    estimatedMinutes: 20,
    xpReward: 550,
    quiz: [{ question: 'What kind of values does Linear Regression predict?', options: ['Categories (Cat/Dog)', 'Continuous Numbers (Price/Temp)', 'Binary (Yes/No)'], correctAnswer: 1, explanation: 'Regression is for predicting numbers on a continuous scale.' }],
    technicalPrerequisites: ['math-2']
  },
  {
    id: 'cml-2',
    title: 'Smart Choices: Decision Trees',
    category: 'Classical ML',
    difficulty: 'Intermediate',
    description: 'Models that think like humans. A series of nested questions.',
    lesson: {
      introduction: "A Decision Tree is basically a complex flow chart. It asks a series of 'Yes/No' questions to arrive at a conclusion. For example: 'Is it raining?' -> 'Yes' -> 'Do you have an umbrella?' -> 'No' -> 'Result: You will get wet'. It's one of the most intuitive ways to understand how an AI makes a choice.",
      sections: [
        { id: 'tree-1', type: 'heading', content: 'How Trees Learn' },
        { id: 'tree-2', type: 'text', content: "A tree decides which questions to ask by looking for the 'purest' split. It wants to ask questions that separate the data into clear groups (like 'all cats' vs 'all dogs') as quickly as possible." },
        { id: 'tree-tip-1', type: 'callout', variant: 'info', title: 'Interpretability', content: "Unlike 'Black Box' models that are hard to explain, you can look at a Decision Tree and see exactly why it made a specific decision. This makes them very popular in fields like medicine and finance." }
      ],
      summary: "Decision Trees are powerful because they are easy to understand and can handle both numbers and categories."
    },
    objective: 'Implement a simple "Tree Node" that returns "High Risk" if a score is above 0.7 and "Low Risk" otherwise.',
    startingCode: `score = 0.85\n# TODO: Implement the if/else logic\nprediction = ""\nprint(f"The risk level is: {prediction}")`,
    solutionHint: 'if score > 0.7: prediction = "High Risk"; else: prediction = "Low Risk"',
    topics: ['Trees', 'Classification', 'Logic'],
    estimatedMinutes: 25,
    xpReward: 575,
    quiz: [{ question: 'What do we call a group of many Decision Trees working together?', options: ['A Jungle', 'An Orchard', 'A Random Forest'], correctAnswer: 2, explanation: 'A Random Forest combines the predictions of many trees to get a more accurate result.' }],
    technicalPrerequisites: ['cml-1']
  },
  {
    id: 'dl-1',
    title: 'The Spark of Intelligence: Neurons',
    category: 'Deep Learning',
    difficulty: 'Intermediate',
    description: 'Understand the building block of AI: The Neuron.',
    lesson: {
      introduction: "A Neural Network is inspired by the human brain. It's made of millions of digital 'neurons'. Each one is very simple: it takes some inputs, does a bit of math, and decides if it should 'fire' a signal to the next neuron. When you combine millions of these, you get something that can recognize faces or translate languages.",
      sections: [
        { id: 'nn-1', type: 'heading', content: 'Activation Functions' },
        { id: 'nn-2', type: 'text', content: "Think of an 'Activation Function' like a dimmer switch. It decides how much signal a neuron should pass on. The most famous one is called 'ReLU'. It's very simple: if the signal is negative, it turns it to zero. If it's positive, it lets it through unchanged." },
        { id: 'nn-demo-1', type: 'code-demo', content: "The ReLU Switch", snippet: "def relu(x):\n    # If x is less than 0, return 0. Otherwise, return x.\n    return max(0, x)\n\nprint(relu(-5)) # Output: 0\nprint(relu(10)) # Output: 10" }
      ],
      summary: "Neurons are the atoms of intelligence. By stacking them together, we can build models that learn complex patterns from data."
    },
    objective: 'Implement the ReLU function and use it to process a list of inputs: [-2.5, 4.0, 0.0].',
    startingCode: `inputs = [-2.5, 4.0, 0.0]\n# TODO: Apply ReLU to each input\noutputs = []\nprint(f"The processed signals are: {outputs}")`,
    solutionHint: 'outputs = [max(0, x) for x in inputs]',
    topics: ['Deep Learning', 'Activation Functions', 'ReLU'],
    estimatedMinutes: 25,
    xpReward: 550,
    quiz: [{ question: 'What does the ReLU activation function do to negative numbers?', options: ['Makes them positive', 'Turns them to zero', 'Doubles them'], correctAnswer: 1, explanation: 'ReLU filters out negative signals, which helps the network focus on the most important information.' }],
    technicalPrerequisites: ['math-2']
  },
  {
    id: 'dl-2',
    title: 'How Computers See: CNNs',
    category: 'Deep Learning',
    difficulty: 'Intermediate',
    description: 'How does an AI recognize a cat? Master the Convolution operation.',
    lesson: {
      introduction: "To a computer, an image is just a grid of numbers. To recognize a cat, it needs to find edges, then shapes, then whiskers. It does this using 'Filters'—tiny grids of math that slide over the image looking for specific patterns. This process is called a 'Convolution'.",
      sections: [
        { id: 'cnn-1', type: 'heading', content: 'Feature Maps' },
        { id: 'cnn-2', type: 'text', content: "As a filter slides over an image, it creates a 'Feature Map'. The first layers might find simple lines, but deeper layers combine those lines into complex objects like eyes or wheels." },
        { id: 'cnn-tip-1', type: 'callout', variant: 'info', title: 'Spatial Invariance', content: "The magic of CNNs is that they can find a cat whether it's in the top-left corner or the bottom-right. The filter 'scans' the whole image to find the pattern anywhere." }
      ],
      summary: "Convolutions are the reason AI can now recognize objects in photos better than humans in some cases."
    },
    objective: 'Calculate the result of a 2x2 image patch [[10, 20], [30, 40]] multiplied by a simple "Edge Filter" [[1, 0], [0, 1]]. (Multiply each corresponding spot and sum them up).',
    startingCode: `patch = [[10, 20], [30, 40]]\nfilt = [[1, 0], [0, 1]]\n# TODO: Multiply and sum\nresult = 0\nprint(f"The convolution result is: {result}")`,
    solutionHint: 'result = (10*1) + (20*0) + (30*0) + (40*1)',
    topics: ['Computer Vision', 'CNNs', 'Filters'],
    estimatedMinutes: 30,
    xpReward: 650,
    quiz: [{ question: 'What is the primary tool used by CNNs to find patterns in images?', options: ['Lenses', 'Filters', 'Mirrors'], correctAnswer: 1, explanation: 'Filters are small mathematical grids that slide over the image to detect features.' }],
    technicalPrerequisites: ['dl-1']
  },
  {
    id: 'arch-1',
    title: 'Building Brains: Neural Layers',
    category: 'Neural Architectures',
    difficulty: 'Advanced',
    description: 'Assemble your network. Learn how to stack layers into deep pipelines.',
    lesson: {
      introduction: "One neuron is simple, but a thousand layers of neurons are incredibly powerful. By stacking layers, we allow models to build a 'hierarchy of knowledge'. The first layer sees simple lines, the middle layers see shapes, and the final layers see complex concepts like 'loyalty' or 'happiness'.",
      sections: [
        { id: 'arch-1', type: 'heading', content: 'The Hidden Layer' },
        { id: 'arch-2', type: 'text', content: "We call the layers between the input and output 'Hidden Layers'. They are where the real magic happens. Each layer takes the information from the previous one and refines it, making it more abstract and meaningful." }
      ],
      summary: "Deep Learning is simply the art of stacking many simple layers together to solve incredibly complex problems."
    },
    objective: 'Calculate the output of a 2-layer network. Layer 1 multiplies the input by 2. Layer 2 adds 5 to that result. If the input is 10, what is the final output?',
    startingCode: `input_val = 10\n# TODO: Pass the input through both layers\nfinal_output = 0\nprint(f"The final output is: {final_output}")`,
    solutionHint: 'layer1 = input_val * 2; final_output = layer1 + 5',
    topics: ['Architectures', 'Layers', 'Deep Learning'],
    estimatedMinutes: 30,
    xpReward: 700,
    quiz: [{ question: 'What do we call the layers that sit between the input and output?', options: ['Ghost layers', 'Middle layers', 'Hidden layers'], correctAnswer: 2, explanation: 'They are "hidden" because we only directly see the inputs we give and the outputs we get.' }],
    technicalPrerequisites: ['dl-2']
  },
  {
    id: 'trans-1',
    title: 'The Secret of LLMs: Attention',
    category: 'LLM & Transformers',
    difficulty: 'Advanced',
    description: 'The technology behind ChatGPT. Learn how models focus on what matters.',
    lesson: {
      introduction: "When you read a sentence, you don't look at every word with equal importance. In the sentence 'The cat sat on the mat', your brain focuses on 'cat', 'sat', and 'mat' to understand the meaning. 'Attention' is the mathematical trick that allows AI models to do the same thing.",
      sections: [
        { id: 'att-1', type: 'heading', content: 'Focusing on Context' },
        { id: 'att-2', type: 'text', content: "The Attention mechanism allows a model to look at every word in a sentence and decide which other words are most relevant to it. This is how ChatGPT understands that 'it' in 'The robot picked up the ball and put it in the box' refers to the ball, not the robot." }
      ],
      summary: "Attention is the engine of modern AI. It allows models to handle massive amounts of information while staying focused on the most important details."
    },
    objective: 'Simulate a "Softmax" score for two words with raw scores [2.0, 1.0]. (Softmax turns scores into percentages that sum to 100%).',
    startingCode: `import math\nscores = [2.0, 1.0]\n# TODO: Calculate exp(x) / sum(exp(all))\n# Hint: math.exp(x) gives e^x\nprobs = []\nprint(f"The probabilities are: {probs}")`,
    solutionHint: 'exps = [math.exp(s) for s in scores]; probs = [e/sum(exps) for e in exps]',
    topics: ['Transformers', 'Attention', 'Softmax'],
    estimatedMinutes: 40,
    xpReward: 850,
    quiz: [{ question: 'What does the Attention mechanism allow a model to do?', options: ['Read faster', 'Focus on relevant words', 'Save battery'], correctAnswer: 1, explanation: 'Attention helps the model understand context by focusing on the most important parts of the input.' }],
    technicalPrerequisites: ['arch-1']
  },
  {
    id: 'trans-2',
    title: 'Words as Geometry: Embeddings',
    category: 'LLM & Transformers',
    difficulty: 'Intermediate',
    description: 'Turning words into numbers. Master semantic vector mapping.',
    lesson: {
      introduction: "How does a computer know that 'King' and 'Queen' are related? It turns them into coordinates in a massive multi-dimensional space. In this space, words with similar meanings (like 'Pizza' and 'Burger') are placed close together. We call these coordinates 'Embeddings'.",
      sections: [
        { id: 'emb-1', type: 'heading', content: 'Semantic Similarity' },
        { id: 'emb-2', type: 'text', content: "Embeddings allow us to do 'Word Math'. A famous example is: King - Man + Woman = Queen. By treating words as points in space, we can use geometry to understand language." }
      ],
      summary: "Embeddings are the bridge between human language and machine math. They turn abstract concepts into something a computer can calculate."
    },
    objective: 'Create a simple "Embedding Dictionary" where the word "AI" is represented by the list [0.9, 0.1] and "Bio" is represented by [0.1, 0.9].',
    startingCode: `embeddings = {}\n# TODO: Map the words to their vectors\n\nprint(f"The embedding for AI is: {embeddings.get('AI')}")`,
    solutionHint: 'embeddings = {"AI": [0.9, 0.1], "Bio": [0.1, 0.9]}',
    topics: ['Embeddings', 'NLP', 'Semantics'],
    estimatedMinutes: 30,
    xpReward: 600,
    quiz: [{ question: 'What do Embeddings turn words into?', options: ['Strings', 'Vectors (Lists of numbers)', 'Bools'], correctAnswer: 1, explanation: 'Embeddings represent words as numerical vectors in a high-dimensional space.' }],
    technicalPrerequisites: ['math-1']
  },
  {
    id: 'ops-1',
    title: 'Bringing AI to Life: Deployment',
    category: 'MLOps & Deployment',
    difficulty: 'Advanced',
    description: 'Code is only useful if people can use it. Learn how to deploy your models.',
    lesson: {
      introduction: "You've built an amazing model on your laptop. Now what? To let the world use it, you need to turn it into a 'Web API'. This allows other apps (like a mobile app or a website) to send data to your model and get a prediction back in real-time.",
      sections: [
        { id: 'ops-1', type: 'heading', content: 'The Prediction Endpoint' },
        { id: 'ops-tip-1', type: 'callout', variant: 'pro-tip', title: 'Speed Matters', content: "When someone uses your AI app, they don't want to wait 10 seconds for a result. Professional engineers use tools like 'FastAPI' to make their AI responses lightning fast." }
      ],
      summary: "MLOps is the bridge between a science experiment and a real-world product. It's how we make AI reliable, fast, and accessible to everyone."
    },
    objective: 'Design a simple API response that returns a "success" status and a "prediction" of "Cat" if a score is above 0.5.',
    startingCode: `def get_api_response(score):\n    # TODO: Return a dictionary with "status" and "prediction"\n    return {}\n\nprint(get_api_response(0.8))`,
    solutionHint: 'return {"status": "success", "prediction": "Cat" if score > 0.5 else "Dog"}',
    topics: ['MLOps', 'APIs', 'Deployment'],
    estimatedMinutes: 30,
    xpReward: 700,
    quiz: [{ question: 'What is the standard format for sending data between a web app and an AI model?', options: ['CSV', 'JSON', 'XML'], correctAnswer: 1, explanation: 'JSON is the universal language of the web and is used by almost all AI APIs.' }],
    technicalPrerequisites: ['py-4']
  }
];
