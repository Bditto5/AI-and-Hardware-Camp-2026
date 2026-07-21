export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface BugChallenge {
  title: string;
  description: string;
  bad: string;
  fixed: string;
  hint: string;
}

export const hardwareQuiz: QuizQuestion[] = [
  { question: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Power Unit", "Core Processing Utility", "Central Power Unit"], answer: 0, explanation: "The CPU executes general-purpose program instructions." },
  { question: "What does volatile mean when describing RAM?", options: ["It is extremely fast", "Its data disappears when power is removed", "It uses a spinning disk", "It cannot be upgraded"], answer: 1, explanation: "RAM needs power to retain its active data." },
  { question: "Which option is normally the fastest internal storage?", options: ["Hard disk drive", "SATA SSD", "NVMe SSD", "DVD"], answer: 2, explanation: "NVMe storage communicates over fast PCIe lanes." },
  { question: "What is the motherboard's main job?", options: ["Store files", "Connect and coordinate components", "Cool the CPU", "Generate graphics"], answer: 1, explanation: "The motherboard provides sockets, slots, power paths, and communication links." },
  { question: "What does PSU stand for?", options: ["Power Supply Unit", "Processor Speed Unit", "Parallel Storage Utility", "Processing System Unit"], answer: 0, explanation: "The power supply converts wall power into regulated power used by the computer." },
  { question: "What is VRAM?", options: ["Virtual operating-system memory", "Memory used by the graphics processor", "A type of hard drive", "The motherboard firmware"], answer: 1, explanation: "VRAM holds data the GPU needs, including model data during accelerated local AI." },
  { question: "Why is thermal material placed between a CPU and cooler?", options: ["To glue them together", "To fill tiny air gaps and transfer heat", "To power the fan", "To prevent static"], answer: 1, explanation: "Thermal material improves contact so heat can move into the cooler." },
  { question: "What does POST mean?", options: ["Power-On Self-Test", "Processor Output Status Test", "Primary Operating System Test", "Peripheral Output Signal Test"], answer: 0, explanation: "POST checks basic hardware when the computer starts." },
  { question: "Which modern slot normally holds a desktop graphics card?", options: ["SATA", "PCI Express", "DIMM", "USB"], answer: 1, explanation: "Desktop GPUs normally use a PCI Express x16-sized slot." },
  { question: "What is dual-channel memory?", options: ["Two unrelated RAM types", "Matched memory operating across paired channels", "Two operating systems", "Two mirrored hard drives"], answer: 1, explanation: "Correctly paired modules can increase available memory bandwidth." },
];

export const aiQuiz: QuizQuestion[] = [
  { question: "What is inference?", options: ["Training from scratch", "Using a trained model for a new request", "Downloading a model", "Testing a power supply"], answer: 1, explanation: "Ollama performs inference with an already-trained model." },
  { question: "What is a model parameter?", options: ["Only an app setting", "A numerical value learned during training", "A GPU cable", "A prompt heading"], answer: 1, explanation: "Learned parameters shape the model's predictions." },
  { question: "What does a 3B model name usually indicate?", options: ["About 3 bytes", "About 3 billion parameters", "Three GPUs required", "Three training examples"], answer: 1, explanation: "B is commonly used as shorthand for billions of parameters." },
  { question: "What is an AI hallucination?", options: ["A slow answer", "A confident answer containing invented or false information", "A stopped model", "An encrypted response"], answer: 1, explanation: "Model outputs must be checked because plausible wording is not proof of accuracy." },
  { question: "What is prompt engineering?", options: ["Building a GPU", "Designing clear inputs to improve useful outputs", "Training every model", "Installing RAM"], answer: 1, explanation: "Good prompts communicate context, task, format, and constraints." },
  { question: "Which prompt gives the best learning context?", options: ["Make a game", "I am a beginner. Help me add one score counter to this HTML quiz and explain each change.", "Code please", "Do everything"], answer: 1, explanation: "It states the learner level, existing project, specific task, and desired explanation." },
  { question: "What does local AI mean in this camp?", options: ["AI about local news", "A model running on this computer", "A model that never uses memory", "A model trained by the student"], answer: 1, explanation: "Ollama runs the text model on the camp computer instead of a cloud API." },
  { question: "Why are GPUs useful for many AI calculations?", options: ["They always have a higher clock speed", "They perform many similar operations in parallel", "They replace storage", "They need no power"], answer: 1, explanation: "Neural-network math contains many operations that can be computed simultaneously." },
  { question: "What is training data?", options: ["Examples used while teaching a model", "Only the current prompt", "RAM reserved for Ollama", "A list of installed programs"], answer: 0, explanation: "Training examples influence the patterns and limitations a model learns." },
  { question: "Why should important AI answers be verified?", options: ["AI cannot produce text", "Fluent answers can still be wrong or incomplete", "Local models always use the internet", "Verification makes the GPU faster"], answer: 1, explanation: "Language models predict plausible text and do not guarantee factual correctness." },
];

export const bugChallenges: BugChallenge[] = [
  { title: "Missing punctuation", description: "The Python function definition cannot run.", bad: "def greet(name\n    print('Hello ' + name)\n\ngreet('World')", fixed: "def greet(name):\n    print('Hello ' + name)\n\ngreet('World')", hint: "Check the closing parenthesis and the punctuation after a Python function definition." },
  { title: "Mismatched quotes", description: "The JavaScript string starts and ends differently.", bad: "let message = 'Hello World\";\nconsole.log(message);", fixed: "let message = 'Hello World';\nconsole.log(message);", hint: "A string must end with the same kind of quote that started it." },
  { title: "Off by one", description: "The loop should print 1 through 5.", bad: "for (let i = 0; i < 5; i++) {\n  console.log(i);\n}", fixed: "for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}", hint: "Inspect both the starting value and the condition that stops the loop." },
  { title: "Missing closing tag", description: "The unordered HTML list is incomplete.", bad: "<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>", fixed: "<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ul>", hint: "Every container element needs a matching closing tag." },
  { title: "Wrong variable name", description: "The calculation succeeds, but the log references something else.", bad: "function addNumbers(a, b) {\n  return a + b;\n}\nlet result = addNumbers(3, 4);\nconsole.log(sum);", fixed: "function addNumbers(a, b) {\n  return a + b;\n}\nlet result = addNumbers(3, 4);\nconsole.log(result);", hint: "Compare the variable that receives the answer with the variable being logged." },
];

