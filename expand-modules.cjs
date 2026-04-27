const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'modules.json');
const raw = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, '');
const modules = JSON.parse(raw);

const defaultObjectives = (topic) => ([
  `Explain the core idea behind ${topic}.`,
  `Translate ${topic} into runnable Python code.`,
  `Debug common mistakes without getting stuck.`
]);

const defaultMistakes = (topic) => ([
  `Mixing up types while working with ${topic}.`,
  `Forgetting to handle edge cases in ${topic}.`,
  `Assuming the first solution is correct without testing.`
]);

const defaultDebugTips = (topic) => ([
  `Print intermediate values while building ${topic} logic.`,
  `Reduce the problem to the smallest reproducible example.`,
  `Verify assumptions step-by-step before optimizing.`
]);

const categorySnippets = {
  'Python Fundamentals': {
    drill: {
      instruction: 'Create a variable named status with the value "ready" and print it.',
      initialCode: '# Define status and print it\n',
      validation: 'status = "ready"\nprint(status)',
      hint: 'Define the variable, then print.'
    },
    debug: {
      instruction: 'Fix the bug: the variable is misspelled. Print "Mission Complete".',
      initialCode: 'message = "Mission Complete"\nprint(mesage)\n',
      validation: 'print(message)',
      hint: 'Variable names must match exactly.'
    },
    project: {
      instruction: 'Create a list called milestones with 3 strings and print its length.',
      initialCode: '# Build milestones list\n',
      validation: 'milestones = ["start", "build", "ship"]\nprint(len(milestones))',
      hint: 'Use len() on a list.'
    }
  },
  'Advanced Python': {
    drill: {
      instruction: 'Create a dictionary named config with keys "mode" and "retries".',
      initialCode: '# Build config dict\n',
      validation: 'config = {"mode": "safe", "retries": 3}',
      hint: 'Use curly braces with key: value pairs.'
    },
    debug: {
      instruction: 'Fix the function to return the value instead of printing it.',
      initialCode: 'def get_level(x):\n    print(x)\n\n',
      validation: 'def get_level(x):\n    return x',
      hint: 'Return instead of print.'
    },
    project: {
      instruction: 'Write a list comprehension that squares numbers 1 to 5.',
      initialCode: '# squares = [...]\n',
      validation: 'squares = [n**2 for n in range(1, 6)]',
      hint: 'Use range(1, 6).' 
    }
  },
  'Data & Algorithms': {
    drill: {
      instruction: 'Create a list of numbers and compute the sum using sum().',
      initialCode: '# Build list and sum it\n',
      validation: 'nums = [2, 4, 6, 8]\nresult = sum(nums)',
      hint: 'Use sum(list).' 
    },
    debug: {
      instruction: 'Fix the loop so it iterates all items in data.',
      initialCode: 'data = [3, 6, 9]\nfor i in range(len(data)-1):\n    print(data[i])\n',
      validation: 'for i in range(len(data)):\n    print(data[i])',
      hint: 'range should include the last index.'
    },
    project: {
      instruction: 'Create a sorted copy of scores in ascending order.',
      initialCode: 'scores = [88, 72, 94, 60]\n# Sort scores\n',
      validation: 'sorted_scores = sorted(scores)',
      hint: 'Use sorted(list).' 
    }
  },
  'Artificial Intelligence': {
    drill: {
      instruction: 'Compute a weighted sum with inputs [0.6, 0.4] and weights [0.8, 0.2].',
      initialCode: 'inputs = [0.6, 0.4]\nweights = [0.8, 0.2]\n# weighted_sum = ...\n',
      validation: 'weighted_sum = (inputs[0] * weights[0]) + (inputs[1] * weights[1])',
      hint: 'Multiply each input by its weight and add.'
    },
    debug: {
      instruction: 'Fix the activation: it should return 1 if x >= 0, else 0.',
      initialCode: 'x = -0.2\nif x > 0:\n    output = 1\nelse:\n    output = 1\n',
      validation: 'else:\n    output = 0',
      hint: 'The else branch must return 0.'
    },
    project: {
      instruction: 'Normalize the array values to 0-1 by dividing by 255.',
      initialCode: 'import numpy as np\narr = np.array([0, 128, 255])\n# Normalize\n',
      validation: 'normalized = arr / 255.0',
      hint: 'Divide by 255.0 to keep floats.'
    }
  },
  'Real-World Simulations': {
    drill: {
      instruction: 'Create an async function named handle_event that takes payload.',
      initialCode: '# Define async function\n',
      validation: 'async def handle_event(payload):',
      hint: 'Use async def.'
    },
    debug: {
      instruction: 'Fix the queue initialization to use asyncio.Queue().',
      initialCode: 'import asyncio\nqueue = asyncio.queue()\n',
      validation: 'queue = asyncio.Queue()',
      hint: 'Queue is capitalized.'
    },
    project: {
      instruction: 'Create a dictionary named metrics with keys "latency_ms" and "count".',
      initialCode: '# Build metrics\n',
      validation: 'metrics = {"latency_ms": 0, "count": 0}',
      hint: 'Use a dict literal.'
    }
  },
  'Web Development': {
    drill: {
      instruction: 'Send a GET request to https://pyquest.org and store it in response.',
      initialCode: 'import requests\n# Make request\n',
      validation: 'response = requests.get("https://pyquest.org")',
      hint: 'requests.get(url) returns a response.'
    },
    debug: {
      instruction: 'Fix the JSON parsing to use response.json().',
      initialCode: 'response = requests.get("https://pyquest.org")\ndata = response.json\n',
      validation: 'data = response.json()',
      hint: 'json is a function.'
    },
    project: {
      instruction: 'Check response status and print "OK" if it is 200.',
      initialCode: 'response = requests.get("https://pyquest.org")\n# Check status\n',
      validation: 'if response.status_code == 200:\n    print("OK")',
      hint: 'Use response.status_code.'
    }
  }
};

const lessonTemplates = (module) => {
  const category = module.category || 'Python Fundamentals';
  const snippets = categorySnippets[category] || categorySnippets['Python Fundamentals'];
  const topic = module.title;
  return [
    {
      id: `${module.id}-concept-drill`,
      title: `Concept Drill: ${topic}`,
      type: 'guided-code',
      content: `A rapid drill to reinforce the core ideas behind ${topic}. These steps are short, precise, and designed for instant feedback loops.`,
      objectives: defaultObjectives(topic),
      commonMistakes: defaultMistakes(topic),
      debugTips: defaultDebugTips(topic),
      steps: [
        { ...snippets.drill },
        {
          instruction: `Explain in one print statement why ${topic} matters for real projects.`,
          initialCode: '# Add a single print statement\n',
          validation: 'print("It helps me build real systems.")',
          hint: 'Print a short reason.'
        },
        {
          instruction: 'Create a variable named checkpoint with value 1 and print it.',
          initialCode: '# Define checkpoint\n',
          validation: 'checkpoint = 1\nprint(checkpoint)',
          hint: 'Assign then print.'
        },
        {
          instruction: 'Add a comment that explains what this step is doing.',
          initialCode: '# Add a comment below\n',
          validation: '# This step documents intent'
        }
      ]
    },
    {
      id: `${module.id}-debug-lab`,
      title: `Debug Lab: ${topic}`,
      type: 'guided-code',
      content: `You will practice spotting mistakes that show up in real code reviews. Each fix builds your debugging intuition for ${topic}.`,
      objectives: [
        'Recognize faulty assumptions quickly',
        'Repair broken code with minimal changes',
        'Validate fixes with a clean output'
      ],
      commonMistakes: defaultMistakes(topic),
      debugTips: defaultDebugTips(topic),
      steps: [
        { ...snippets.debug },
        {
          instruction: 'Fix the indentation so the message prints only when ready is True.',
          initialCode: 'ready = True\nif ready:\nprint("Go")\n',
          validation: 'if ready:\n    print("Go")',
          hint: 'Indentation defines the block.'
        },
        {
          instruction: 'Replace the placeholder with a safe default value of 0.',
          initialCode: 'score = None\n# Set score safely\n',
          validation: 'score = 0',
          hint: 'Use a simple integer.'
        },
        {
          instruction: 'Fix the string quotes to make valid Python.',
          initialCode: 'print("Quest complete!)\n',
          validation: 'print("Quest complete!")',
          hint: 'Close the quote.'
        }
      ]
    },
    {
      id: `${module.id}-mini-project`,
      title: `Mini Project: ${topic}`,
      type: 'guided-code',
      content: `A compact project that applies ${topic} to a realistic scenario. You will build in small increments and verify each milestone.`,
      objectives: [
        'Plan a minimal solution',
        'Implement and verify each milestone',
        'Document outcomes and next steps'
      ],
      commonMistakes: [
        'Skipping validation and assuming success',
        'Mixing concerns instead of isolating steps',
        'Forgetting to name variables clearly'
      ],
      debugTips: [
        'Run the smallest version of the program first',
        'Add one feature at a time',
        'Print checkpoints after each milestone'
      ],
      steps: [
        { ...snippets.project },
        {
          instruction: 'Create a variable named report with value "ok" and print it.',
          initialCode: '# Set report\n',
          validation: 'report = "ok"\nprint(report)',
          hint: 'Assign then print.'
        },
        {
          instruction: 'Create a list named steps with three milestones and print the first item.',
          initialCode: '# Build steps list\n',
          validation: 'steps = ["plan", "build", "verify"]\nprint(steps[0])',
          hint: 'Use index 0.'
        },
        {
          instruction: 'Add a final print that says "Project complete".',
          initialCode: '# Final status\n',
          validation: 'print("Project complete")',
          hint: 'Print the exact phrase.'
        }
      ]
    }
  ];
};

const ensureLessonFields = (lesson, moduleTitle) => {
  if (!lesson.objectives) lesson.objectives = defaultObjectives(moduleTitle);
  if (!lesson.commonMistakes) lesson.commonMistakes = defaultMistakes(moduleTitle);
  if (!lesson.debugTips) lesson.debugTips = defaultDebugTips(moduleTitle);
  if (!lesson.reading) {
    lesson.reading = [
      'Skim the lesson once before coding.',
      'Underline any unknown words.',
      'Summarize the idea in one sentence.'
    ];
  }
  if (!lesson.checklist) {
    lesson.checklist = [
      'I can explain the goal in my own words.',
      'I can run a minimal example that works.',
      'I can fix a broken version of this code.'
    ];
  }
  return lesson;
};

modules.forEach((module) => {
  module.overview = module.overview || `This quest develops real, usable skill in ${module.title}. You will move from concept to code to application with clear milestones.`;
  module.whyItMatters = module.whyItMatters || `If you can complete ${module.title}, you can apply the same reasoning to real-world problems and larger systems.`;
  module.prereqs = module.prereqs || ['Comfort with basic Python syntax', 'Willingness to debug iteratively'];
  module.tooling = module.tooling || ['Python 3.x', 'A code editor', 'Patience for iteration'];
  module.realWorld = module.realWorld || [
    `Used in professional workflows that rely on ${module.title}.`,
    'Transforms abstract concepts into practical leverage.'
  ];

  module.lessons = module.lessons.map((lesson) => ensureLessonFields(lesson, module.title));

  const existingIds = new Set(module.lessons.map((l) => l.id));
  const newLessons = lessonTemplates(module).filter((l) => !existingIds.has(l.id));
  module.lessons.push(...newLessons.map((lesson) => ensureLessonFields(lesson, module.title)));
});

fs.writeFileSync(filePath, JSON.stringify(modules, null, 2) + '\n');
console.log('Expanded modules:', modules.length);
