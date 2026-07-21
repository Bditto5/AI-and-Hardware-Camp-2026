export type ActivityCategory = "hardware" | "ai" | "build";

export interface CampActivity {
  id: string;
  title: string;
  category: ActivityCategory;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  description: string;
  safety?: string;
  steps: string[];
  coachPrompt?: string;
}

export const campActivities: CampActivity[] = [
  {
    id: "component-hunt",
    title: "Component Scavenger Hunt",
    category: "hardware",
    difficulty: "Beginner",
    duration: "30–45 min",
    description: "Open a decommissioned computer and identify the parts that make a local AI machine possible.",
    safety: "Instructor confirms the machine is unplugged. Touch the metal case before components and watch for sharp edges.",
    steps: [
      "Remove the side panel using the instructor-approved method.",
      "Locate the motherboard, CPU cooler, RAM, storage, power supply, fans, and any graphics card.",
      "Record one observation about the size, shape, connector, or label on each part.",
      "Sketch how power and data appear to move through the machine.",
      "Teach one component to a partner in thirty seconds.",
    ],
    coachPrompt: "I am doing a computer component scavenger hunt. Quiz me on CPU, GPU, RAM, storage, motherboard, and power supply one question at a time.",
  },
  {
    id: "ram-inspection",
    title: "RAM Compatibility Lab",
    category: "hardware",
    difficulty: "Intermediate",
    duration: "35 min",
    description: "Inspect a memory module, research its specifications, and decide whether a proposed upgrade is compatible.",
    safety: "Do not remove or install memory until the instructor confirms power is disconnected and demonstrates the retaining clips.",
    steps: [
      "Record the computer and motherboard model.",
      "Read the RAM label and note DDR generation, capacity, and speed.",
      "Compare the notch position with another RAM generation if samples are available.",
      "Use the motherboard documentation to find supported memory and recommended paired slots.",
      "Write an evidence-based upgrade recommendation.",
    ],
    coachPrompt: "Help me evaluate a RAM upgrade. Ask me for the motherboard model, current RAM label, available slots, and the evidence I found before recommending anything.",
  },
  {
    id: "storage-race",
    title: "Storage Speed Investigation",
    category: "hardware",
    difficulty: "Beginner",
    duration: "25 min",
    description: "Compare HDD, SATA SSD, and NVMe designs and predict how each affects model loading.",
    steps: [
      "Identify each storage device by shape and connector.",
      "List whether it contains moving parts and how it connects to the motherboard.",
      "Rank the devices by expected speed and explain the ranking.",
      "Predict which upgrade would most improve a computer that starts slowly but has enough RAM.",
      "Check the prediction using trustworthy specifications or an instructor demonstration.",
    ],
  },
  {
    id: "post-troubleshooting",
    title: "POST Troubleshooting Map",
    category: "hardware",
    difficulty: "Advanced",
    duration: "40 min",
    description: "Create a safe decision tree for a reassembled computer that does not display an image.",
    safety: "Power down and disconnect power before reseating any internal component. Change only one variable between tests.",
    steps: [
      "Start with observable evidence: fans, lights, display, beeps, and diagnostic LEDs.",
      "Create separate branches for no power, power with no display, and repeated restart.",
      "Include external checks before internal checks.",
      "Add safe checks for RAM seating, GPU seating, and required power connectors.",
      "Have another team follow the map and identify ambiguous instructions.",
    ],
    coachPrompt: "Review my computer POST troubleshooting plan. Focus on safety, evidence, and changing one variable at a time. Ask questions instead of guessing the failed part.",
  },
  {
    id: "first-local-chat",
    title: "Meet Your Local AI",
    category: "ai",
    difficulty: "Beginner",
    duration: "20 min",
    description: "Compare what the local model says with what you observed inside a real computer.",
    steps: [
      "Ask for a simple explanation of one component you physically observed.",
      "Ask the same question using a detailed technical format.",
      "Identify one claim that could be checked using a label, manual, or trusted source.",
      "Ask the model to explain its uncertainty.",
      "Write one strength and one limitation of the answer.",
    ],
    coachPrompt: "Explain what a CPU, GPU, RAM, and storage each do. Use one connected workshop analogy, then give me two facts I should verify.",
  },
  {
    id: "prompt-three-levels",
    title: "Prompt Engineering: Three Levels",
    category: "ai",
    difficulty: "Beginner",
    duration: "30 min",
    description: "Ask the same question three ways and measure how context changes the response.",
    steps: [
      "Choose a computer, AI, or coding topic.",
      "Send only the topic as the basic prompt.",
      "Add your skill level and desired answer format.",
      "Add a role, context, exact task, format, and constraints.",
      "Compare assumptions, usefulness, accuracy, and length across the responses.",
    ],
    coachPrompt: "Be my prompt coach. Help me improve one prompt using role, context, task, format, and constraints. Do not answer the underlying task until the prompt is improved.",
  },
  {
    id: "hallucination-check",
    title: "Hallucination Detective",
    category: "ai",
    difficulty: "Intermediate",
    duration: "35 min",
    description: "Practice separating fluent wording from trustworthy evidence.",
    steps: [
      "Ask the model for five factual claims about a hardware topic.",
      "Mark every claim that contains a number, date, compatibility statement, or safety instruction.",
      "Verify at least three claims using product documentation or another primary source.",
      "Correct any unsupported claim and record the evidence.",
      "Rewrite the original prompt to request uncertainty and sources more clearly.",
    ],
  },
  {
    id: "ethics-roundtable",
    title: "AI Ethics Roundtable",
    category: "ai",
    difficulty: "Intermediate",
    duration: "45 min",
    description: "Use stakeholders and evidence to discuss bias, privacy, creative ownership, or changing jobs.",
    steps: [
      "Choose one scenario and list everyone affected.",
      "Identify possible benefits, harms, and missing information.",
      "Assign team members different stakeholder perspectives.",
      "Propose one rule, safeguard, or audit and describe how it would be tested.",
      "Present the strongest argument against your own proposal.",
    ],
  },
  {
    id: "profile-card",
    title: "Build a Profile Card",
    category: "build",
    difficulty: "Beginner",
    duration: "30 min",
    description: "Create a personal card while learning the relationship between HTML structure and CSS presentation.",
    steps: [
      "Start from the Profile Card template in Build Lab.",
      "Change the heading, description, skills, and colors.",
      "Add one new HTML element and style it with a class.",
      "Run the preview after every small change.",
      "Take a snapshot when the first working version is complete.",
    ],
    coachPrompt: "Coach me through improving a beginner HTML/CSS profile card. Ask what I want to change, give one small step at a time, and explain why it works.",
  },
  {
    id: "quiz-builder",
    title: "Build a Quiz",
    category: "build",
    difficulty: "Intermediate",
    duration: "60 min",
    description: "Extend a working JavaScript quiz with original questions, scoring, and feedback.",
    steps: [
      "Open the Quiz template and run it before changing anything.",
      "Trace where questions, answer choices, and the correct answer are stored.",
      "Replace the sample content with at least five original questions.",
      "Add feedback for correct and incorrect answers.",
      "Test the first, middle, and last question before taking a snapshot.",
    ],
    coachPrompt: "Help me debug a beginner HTML/CSS/JavaScript quiz. First ask what I expected, what happened, and what the browser displayed. Prefer hints over replacing all my code.",
  },
  {
    id: "interactive-story",
    title: "Interactive Story",
    category: "build",
    difficulty: "Intermediate",
    duration: "60 min",
    description: "Use buttons and JavaScript state to create a small branching story.",
    steps: [
      "Plan three scenes and two decisions on paper.",
      "Store the current scene in a JavaScript variable.",
      "Update the story text and choices when a button is pressed.",
      "Include at least two different endings.",
      "Ask a partner to test every path and record one confusing moment.",
    ],
  },
  {
    id: "demo-prep",
    title: "Project Demo Rehearsal",
    category: "build",
    difficulty: "Beginner",
    duration: "25 min",
    description: "Prepare a clear three-minute demonstration that explains both the result and the learning.",
    steps: [
      "State the problem or idea in one sentence.",
      "Demonstrate the main interaction without explaining every line.",
      "Show one code decision you understand well.",
      "Explain where AI helped and how you checked or changed its suggestion.",
      "Name one next improvement and invite one audience question.",
    ],
  },
];

