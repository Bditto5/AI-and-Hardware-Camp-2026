import { dayOneSlides, type CampSlide } from "./dayOne";

export interface CampDay {
  number: number;
  title: string;
  subtitle: string;
  slides: CampSlide[];
}

const dayTwoSlides: CampSlide[] = [
  {
    id: "component-quick-fire",
    title: "Component quick fire",
    heading: "Name that component",
    kicker: "TEAM CHALLENGE",
    body: "Your instructor shows five parts. Teams get 30 seconds to name each part and explain one job it performs.",
    icon: "?",
    tone: "green",
  },
  {
    id: "cpu",
    title: "CPU: the generalist",
    heading: "A few powerful workers",
    tone: "light",
    bullets: [
      "CPU means Central Processing Unit.",
      "Modern CPUs contain several powerful cores that handle complex instructions.",
      "They are excellent at decisions, branching logic, and running programs.",
      "Think of a CPU as a small team of experts who can solve many different problems.",
    ],
  },
  {
    id: "gpu",
    title: "GPU: parallel muscle",
    heading: "Thousands of smaller workers",
    tone: "purple",
    bullets: [
      "GPU means Graphics Processing Unit.",
      "A GPU performs many similar calculations at the same time.",
      "Rendering pixels and running neural networks both rely heavily on matrix math.",
      "Think of a GPU as thousands of specialists working in parallel.",
    ],
  },
  {
    id: "cpu-vs-gpu",
    title: "CPU versus GPU",
    heading: "Choose the right kind of worker",
    tone: "pink",
    cards: [
      { icon: "CPU", title: "Flexible", text: "Handles complex, changing instructions and operating-system work." },
      { icon: "GPU", title: "Parallel", text: "Repeats lots of similar math operations simultaneously." },
      { icon: "AI", title: "Together", text: "The CPU runs the app while the GPU can accelerate model calculations." },
    ],
  },
  {
    id: "training-inference",
    title: "Training and inference",
    heading: "Learning first, answering later",
    tone: "green",
    bullets: [
      "Training shows a model many examples and adjusts numerical weights when predictions are wrong.",
      "Training large models can require many GPUs, lots of energy, and weeks of work.",
      "Inference uses the finished model to answer a new request.",
      "REACT Camp uses inference: the model was trained elsewhere and runs locally through Ollama.",
    ],
  },
  {
    id: "parameters",
    title: "What is in a model file?",
    heading: "Billions of learned numbers",
    tone: "light",
    body: "A parameter is a learned numerical value. A 3B model has roughly three billion parameters. Quantization stores those values more compactly so useful models can run on ordinary computers.",
    icon: "3B",
  },
  {
    id: "model-fit",
    title: "Will the model fit?",
    heading: "Memory sets the practical limit",
    tone: "purple",
    bullets: [
      "The model and its working context must fit in available RAM or VRAM.",
      "Smaller models start faster and are safer on donated or older laptops.",
      "Larger context windows consume more memory even when the model file is unchanged.",
      "The best camp model is the one that responds reliably on the actual hardware.",
    ],
  },
  {
    id: "code-debug",
    title: "Debug with the AI Coach",
    heading: "Explain before you fix",
    tone: "pink",
    body: "Ask the AI Coach to find the mistakes in this Python idea: def greet(name) print('Hello ' + name). Request an explanation, a corrected version, and one test case.",
    icon: "</>",
  },
  {
    id: "teach-back-two",
    title: "Teach it back",
    heading: "Why can a GPU help run AI?",
    kicker: "EXIT TICKET",
    body: "Explain the answer to a partner without using the word faster. Include the idea of parallel work and one limitation of local hardware.",
    tone: "green",
  },
];

const dayThreeSlides: CampSlide[] = [
  {
    id: "ram-storage-vote",
    title: "RAM or storage?",
    heading: "Same thing or totally different?",
    kicker: "VOTE, THEN DEFEND IT",
    body: "RAM and storage both hold data, but they solve different problems. Write one prediction before revealing the answer.",
    icon: "RAM",
    tone: "green",
  },
  {
    id: "ram-workspace",
    title: "RAM: the workspace",
    heading: "The desk you are using right now",
    tone: "purple",
    bullets: [
      "Open programs and active data live in RAM.",
      "RAM is volatile: its contents disappear when power is removed.",
      "More RAM lets the computer keep more active work available.",
      "A local AI model must fit in memory while it is running.",
    ],
  },
  {
    id: "ram-compatibility",
    title: "Compatibility matters",
    heading: "Never force a memory module",
    tone: "pink",
    bullets: [
      "DDR generations have different electrical designs and notch positions.",
      "Check the motherboard manual before selecting an upgrade.",
      "Use matching modules in the recommended slots for dual-channel operation.",
      "Press evenly until the retaining clips lock; stop if alignment is wrong.",
    ],
  },
  {
    id: "storage-types",
    title: "Storage: keep it after shutdown",
    heading: "HDD, SATA SSD, and NVMe",
    tone: "light",
    cards: [
      { icon: "HDD", title: "Hard drive", text: "Mechanical, inexpensive capacity, and the slowest option." },
      { icon: "SSD", title: "SATA SSD", text: "Flash storage with a large speed improvement over an HDD." },
      { icon: "M.2", title: "NVMe SSD", text: "Compact storage connected through fast PCIe lanes." },
    ],
  },
  {
    id: "upgrade-plan",
    title: "Plan an upgrade",
    heading: "Evidence before parts",
    tone: "green",
    bullets: [
      "Identify the motherboard and computer model.",
      "Record the current RAM type, capacity, and occupied slots.",
      "Check storage connectors, physical clearance, and power needs.",
      "Compare the upgrade cost with the performance problem it should solve.",
      "Ask an instructor to confirm compatibility before installation.",
    ],
  },
  {
    id: "prompt-anatomy",
    title: "Prompt engineering",
    heading: "Role + context + task + format + constraints",
    tone: "purple",
    cards: [
      { icon: "1", title: "Role", text: "Who should the AI act like?" },
      { icon: "2", title: "Context", text: "What does it need to know?" },
      { icon: "3", title: "Task", text: "What should it accomplish?" },
      { icon: "4", title: "Format", text: "How should the answer be organized?" },
      { icon: "5", title: "Limits", text: "What level, length, or rules matter?" },
    ],
  },
  {
    id: "prompt-comparison",
    title: "Run the comparison",
    heading: "Specific context changes the answer",
    tone: "pink",
    bullets: [
      "Basic: How do I make a quiz game?",
      "Better: Help me make a five-question HTML and JavaScript quiz. I am a beginner.",
      "Best: I already have a questions array. Write only the function that displays one question, records an answer, and explains each line with a comment.",
      "Send all three in AI Lab and compare usefulness, assumptions, and length.",
    ],
  },
  {
    id: "upgrade-teach-back",
    title: "Teach it back",
    heading: "Recommend one upgrade",
    kicker: "EXIT TICKET",
    body: "Choose a slow computer scenario. Recommend RAM, storage, or neither, and support the recommendation with two pieces of evidence.",
    tone: "green",
  },
];

const dayFourSlides: CampSlide[] = [
  {
    id: "reassembly-memory",
    title: "Reassembly challenge",
    heading: "List the safe order from memory",
    kicker: "60 SECONDS",
    body: "Work as a group. Include the CPU cooler, RAM, storage, GPU, front-panel connectors, power cables, fans, and a final inspection.",
    icon: "10",
    tone: "green",
  },
  {
    id: "reassembly-order",
    title: "A practical order",
    heading: "Install, connect, inspect",
    tone: "light",
    bullets: [
      "Seat the CPU correctly, then install thermal material and the cooler as directed.",
      "Install RAM and storage while the motherboard area is easy to reach.",
      "Install the GPU and any required expansion cards.",
      "Connect front-panel, motherboard, CPU, GPU, storage, and fan cables.",
      "Inspect for loose screws, blocked fans, or partially seated connectors before power-on.",
    ],
  },
  {
    id: "front-panel",
    title: "The tiny connectors",
    heading: "Read the motherboard diagram",
    tone: "purple",
    bullets: [
      "PWR SW connects the case power button.",
      "RESET SW connects the reset button when present.",
      "POWER LED and HDD LED are polarity-sensitive indicator lights.",
      "Look for labels such as F_PANEL or JFP1 in the motherboard manual.",
      "If the machine will not start, recheck the power switch pins and main power connectors first.",
    ],
  },
  {
    id: "post",
    title: "First power-on",
    heading: "POST is the first checkpoint",
    tone: "pink",
    body: "POST means Power-On Self-Test. Watch and listen for fans, display output, status lights, or diagnostic beeps. If something is wrong, shut down and change only one thing at a time.",
    icon: "POST",
  },
  {
    id: "diffusion",
    title: "How image models work",
    heading: "From noise toward a prompt",
    tone: "green",
    bullets: [
      "A diffusion image model begins with random visual noise.",
      "Repeated steps estimate and remove noise while following text guidance.",
      "More steps can improve detail but also require more computation.",
      "Image generation is a separate optional local service; Ollama remains the text-model runtime.",
    ],
  },
  {
    id: "image-prompt",
    title: "Describe an image",
    heading: "Subject + style + mood + composition",
    tone: "purple",
    body: "Example: A friendly robot repairing a desktop computer, colorful digital illustration, warm workshop lighting, centered composition, clear tools and components.",
    icon: "ART",
  },
  {
    id: "project-sprint",
    title: "Project sprint",
    heading: "Build, test, explain",
    tone: "pink",
    bullets: [
      "Choose one small outcome that can be demonstrated today.",
      "Make one change at a time and test after every change.",
      "Use the AI Coach for hints and explanations, not invisible copy-and-paste work.",
      "Save a working version before trying a risky improvement.",
      "Prepare to explain one decision you made without AI.",
    ],
  },
  {
    id: "power-on-exit",
    title: "Teach it back",
    heading: "Troubleshoot a no-power computer",
    kicker: "EXIT TICKET",
    body: "Give a safe three-step diagnostic plan. Your plan must start with observation and must change only one variable at a time.",
    tone: "green",
  },
];

const dayFiveSlides: CampSlide[] = [
  {
    id: "ethics-opening",
    title: "AI ethics",
    heading: "Power creates responsibility",
    tone: "purple",
    body: "Ethics asks what we should do, who may be helped or harmed, and who is responsible. The goal is not one perfect answer; it is a reasoned answer that considers evidence and people.",
    icon: "?",
  },
  {
    id: "hiring-bias",
    title: "Scenario: hiring data",
    heading: "Can an algorithm repeat unfair history?",
    tone: "pink",
    body: "A company trains a hiring model on ten years of past decisions. The model begins favoring the same schools and demographic groups found in that history.",
    bullets: [
      "Who is responsible for checking the result?",
      "Can the model be fixed without examining the underlying data and process?",
      "What evidence would a fair audit require?",
    ],
  },
  {
    id: "privacy",
    title: "Scenario: phone data",
    heading: "What does informed consent mean?",
    tone: "light",
    body: "Phones and apps can collect location, searches, usage patterns, contacts, photos, and device information to personalize services.",
    bullets: [
      "Is a long terms-of-service screen meaningful consent?",
      "What data is necessary for the feature and what data is merely valuable to collect?",
      "What controls should every user receive?",
    ],
  },
  {
    id: "creative-ownership",
    title: "Scenario: creative work",
    heading: "Training data, credit, and ownership",
    tone: "green",
    body: "Generative models may learn from large collections that include copyrighted work. New outputs can resemble styles, patterns, and material found in those collections.",
    bullets: [
      "What should creators be told or allowed to choose?",
      "Who should receive credit or payment?",
      "How would you label AI-assisted work honestly?",
    ],
  },
  {
    id: "jobs",
    title: "Scenario: changing jobs",
    heading: "Automation replaces tasks and creates tasks",
    tone: "purple",
    bullets: [
      "Which parts of a job require trust, judgment, responsibility, or human relationships?",
      "Which repetitive tasks might be automated first?",
      "What new skills become valuable when AI tools are common?",
      "How can organizations share benefits without ignoring displaced workers?",
    ],
  },
  {
    id: "demo-format",
    title: "Demo format",
    heading: "Show the work, not just the result",
    tone: "pink",
    bullets: [
      "What does the project do? Demonstrate it live when possible.",
      "How did you build it, and where did AI help?",
      "What decision or improvement are you proud of?",
      "What problem remains, and what would you add next?",
      "Audience response: one thing I liked and one question I have.",
    ],
  },
  {
    id: "next-path",
    title: "Choose a next path",
    heading: "Keep building after camp",
    tone: "light",
    cards: [
      { icon: "</>", title: "Coding", text: "Build another web project and keep it in a Git repository." },
      { icon: "PC", title: "Hardware", text: "Practice compatibility research, repair, and CompTIA A+ skills." },
      { icon: "AI", title: "Artificial intelligence", text: "Compare models, study evaluation, and build responsible local tools." },
      { icon: "+", title: "All three", text: "Try robotics, hackathons, maker spaces, or a community technology project." },
    ],
  },
  {
    id: "final-reflection",
    title: "You built understanding",
    heading: "Open it. Upgrade it. Run it. Explain it.",
    kicker: "FINAL REFLECTION",
    body: "In five days you investigated computer hardware, ran local AI, improved prompts, troubleshot systems, built a project, and considered responsible use. Write the next thing you want to learn and the first action you will take.",
    icon: "5",
    tone: "green",
  },
];

export const campDays: CampDay[] = [
  { number: 1, title: "Open It Up", subtitle: "Hardware foundations and local AI", slides: dayOneSlides },
  { number: 2, title: "The Brains", subtitle: "CPU, GPU, training, and inference", slides: dayTwoSlides },
  { number: 3, title: "Upgrade Lab", subtitle: "Memory, storage, and better prompts", slides: dayThreeSlides },
  { number: 4, title: "Power On", subtitle: "Reassembly, troubleshooting, and building", slides: dayFourSlides },
  { number: 5, title: "Demo Day", subtitle: "AI ethics, presentation, and next steps", slides: dayFiveSlides },
];

