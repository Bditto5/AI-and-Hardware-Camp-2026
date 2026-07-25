export interface CampSlide {
  id: string;
  title: string;
  heading: string;
  kicker?: string;
  body?: string;
  bullets?: string[];
  icon?: string;
  tone: "green" | "purple" | "pink" | "light";
  cards?: Array<{ icon: string; title: string; text: string }>;
}

export const dayOneSlides: CampSlide[] = [
  {
    id: "hook",
    title: "The question",
    heading: "What do you think is inside a computer?",
    kicker: "OPENING CHALLENGE",
    body: "Draw it on paper. Label anything you recognize. There are no wrong answers yet. Today we open the mystery box and connect hardware to AI.",
    icon: "✏️",
    tone: "green",
  },
  {
    id: "ai-warmup-human-or-machine",
    title: "Go over: human or machine?",
    heading: "Can you spot the AI?",
    kicker: "TEAM VOTE",
    body: "Look at two short responses to the same question. Vote: human, AI, or not enough evidence. Then explain which clues you used and which clues were weak.",
    icon: "?",
    tone: "purple",
  },
  {
    id: "camp-map-day-one",
    title: "Go over: the camp map",
    heading: "Hardware + AI + ethics",
    tone: "light",
    cards: [
      { icon: "PC", title: "Open it", text: "Identify the physical parts that make computing possible." },
      { icon: "AI", title: "Run it", text: "Use a local AI model and learn what it can and cannot do." },
      { icon: "?", title: "Question it", text: "Ask who is helped, who is harmed, and what should be checked." },
    ],
  },
  {
    id: "history",
    title: "History of computers",
    heading: "From 30 tons to three pounds",
    bullets: [
      "1940s — ENIAC filled a room and weighed about 30 tons.",
      "1970s — computers entered homes and classrooms.",
      "1990s — the internet connected machines worldwide.",
      "Today — the same basic components run games, apps, and local AI.",
    ],
    tone: "light",
  },
  {
    id: "ai-history-turing",
    title: "History of AI: the question",
    heading: "Can machines act intelligent?",
    tone: "green",
    bullets: [
      "1950 — Alan Turing proposes a test based on conversation.",
      "The big idea: judge behavior by the answers a machine gives.",
      "This does not prove a machine thinks like a person.",
      "It does start a useful question: what counts as intelligent behavior?",
    ],
  },
  {
    id: "ai-history-name",
    title: "History of AI: the name",
    heading: "A field gets a name",
    tone: "purple",
    bullets: [
      "1956 — researchers use the term artificial intelligence.",
      "Early AI focused on rules, logic, games, and problem solving.",
      "Progress rose and fell as computers, data, and expectations changed.",
      "Many old ideas became practical only after hardware improved.",
    ],
  },
  {
    id: "what-is-ai",
    title: "What is AI?",
    heading: "Patterns, predictions, and a lot of math",
    body: "A language model does not think like a person. It uses learned numerical patterns to predict useful next pieces of text.",
    icon: "🤖",
    tone: "green",
  },
  {
    id: "where-is-ai-day-one",
    title: "Where is AI?",
    heading: "You already meet pattern-recognition systems",
    tone: "pink",
    cards: [
      { icon: "📱", title: "Autocomplete", text: "Predicts likely next words." },
      { icon: "😀", title: "Face unlock", text: "Matches visual patterns." },
      { icon: "📺", title: "Recommendations", text: "Predicts what may interest you." },
      { icon: "📧", title: "Spam filters", text: "Classifies suspicious messages." },
    ],
  },
  {
    id: "why-ai-day-one",
    title: "Why use AI?",
    heading: "Use it when patterns are too big to sort by hand",
    tone: "light",
    bullets: [
      "AI can help summarize, classify, brainstorm, translate, and generate examples.",
      "AI is useful when there is a lot of data or many possible answers.",
      "AI is risky when people treat guesses as facts.",
      "The goal is not to trust AI blindly. The goal is to use it thoughtfully.",
    ],
  },
  {
    id: "components",
    title: "Meet the components",
    heading: "What is in every computer?",
    tone: "purple",
    cards: [
      { icon: "🧠", title: "CPU", text: "Fast general-purpose processing and decisions." },
      { icon: "🎮", title: "GPU", text: "Many calculations in parallel. Great for graphics and AI." },
      { icon: "📋", title: "RAM", text: "The temporary workspace used while programs run." },
      { icon: "💾", title: "Storage", text: "Keeps files and programs after power is off." },
      { icon: "⚡", title: "PSU", text: "Converts wall power for computer components." },
      { icon: "🏗️", title: "Motherboard", text: "Connects every part so they can communicate." },
    ],
  },
  {
    id: "safety",
    title: "Safety first",
    heading: "Before you touch anything",
    icon: "⚠️",
    tone: "pink",
    bullets: [
      "Confirm the machine is shut down and unplugged.",
      "Touch the metal case frame before components to discharge static.",
      "Watch for sharp case edges.",
      "Never force a connector or component.",
      "Stop and ask an instructor whenever you are unsure.",
    ],
  },
  {
    id: "is-isnt",
    title: "What AI is and is not",
    heading: "Useful tool, not magic",
    tone: "purple",
    bullets: [
      "AI can explain, summarize, brainstorm, classify, and generate examples.",
      "AI can be confidently wrong. Important answers must be checked.",
      "AI has no feelings, intentions, or human understanding.",
      "Better context and clearer prompts usually produce better results.",
    ],
  },
  {
    id: "first-chat",
    title: "Hands-on: first local chat",
    heading: "Ask the REACT Camp AI Coach",
    body: "Open AI Lab and try: 'What does a CPU do? Explain it with an analogy for a beginner.' Then ask one follow-up question that uses the word because.",
    icon: "💬",
    tone: "green",
  },
  {
    id: "hardware-to-ai-flow",
    title: "Connect the system",
    heading: "How a prompt becomes an answer",
    tone: "light",
    cards: [
      { icon: "1", title: "Input", text: "You type a prompt using the keyboard." },
      { icon: "2", title: "Load", text: "Storage supplies the model while RAM holds active data." },
      { icon: "3", title: "Compute", text: "The CPU and sometimes GPU perform the calculations." },
      { icon: "4", title: "Output", text: "The app displays predicted text for you to evaluate." },
    ],
  },
  {
    id: "ethics-trust-day-one",
    title: "Ethics question 1",
    heading: "When should we trust an AI answer?",
    kicker: "THINK-PAIR-SHARE",
    tone: "pink",
    bullets: [
      "What kinds of answers are low-risk enough to try?",
      "What kinds of answers must be verified by a person or source?",
      "What clues show that an answer might be made up?",
    ],
  },
  {
    id: "ethics-credit-day-one",
    title: "Ethics question 2",
    heading: "What counts as your own work?",
    tone: "purple",
    body: "If AI helps with ideas, grammar, code, or images, how should a student explain that help? Write one honest sentence you could add to a project reflection.",
    icon: "CITE",
  },
  {
    id: "ethics-privacy-day-one",
    title: "Ethics question 3",
    heading: "What should never go into a prompt?",
    tone: "light",
    bullets: [
      "Do not enter passwords, private addresses, private student information, or secrets.",
      "Use fake sample data when practicing.",
      "Ask: would I be comfortable if this prompt appeared on a classroom screen?",
      "Local AI helps, but privacy habits still matter.",
    ],
  },
  {
    id: "teach-back-one",
    title: "Teach it back",
    heading: "One sentence, three ideas",
    kicker: "EXIT TICKET",
    body: "Complete this sentence: AI runs on hardware, learns from patterns, and should be used responsibly because ____.",
    tone: "green",
  },
];
