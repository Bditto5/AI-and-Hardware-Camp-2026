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
    body: "Draw it on paper. Label anything you recognize. There are no wrong answers—yet.",
    icon: "✏️",
    tone: "green",
  },
  {
    id: "history",
    title: "A short history",
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
    id: "components",
    title: "Meet the components",
    heading: "What is in every computer?",
    tone: "purple",
    cards: [
      { icon: "🧠", title: "CPU", text: "Fast general-purpose processing and decisions." },
      { icon: "🎮", title: "GPU", text: "Many calculations in parallel—great for AI." },
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
    id: "what-is-ai",
    title: "What is AI?",
    heading: "Patterns, predictions, and a lot of math",
    body: "A language model does not think like a person. It uses learned numerical patterns to predict useful next pieces of text.",
    icon: "🤖",
    tone: "green",
  },
  {
    id: "ai-history",
    title: "AI milestones",
    heading: "The ideas grew as data and compute grew",
    tone: "light",
    bullets: [
      "1950 — Alan Turing asks whether machines can think.",
      "1956 — the term artificial intelligence is introduced.",
      "1997 — IBM Deep Blue defeats the chess world champion.",
      "2012 — deep learning accelerates rapidly.",
      "2020s — useful language and image models become widely available.",
    ],
  },
  {
    id: "is-isnt",
    title: "What AI is—and is not",
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
    id: "daily-ai",
    title: "AI around you",
    heading: "You already use pattern-recognition systems",
    tone: "pink",
    cards: [
      { icon: "📱", title: "Autocomplete", text: "Predicts likely next words." },
      { icon: "😀", title: "Face ID", text: "Matches visual patterns." },
      { icon: "📺", title: "Recommendations", text: "Predicts what may interest you." },
      { icon: "📧", title: "Spam filters", text: "Classifies suspicious messages." },
    ],
  },
  {
    id: "first-chat",
    title: "Your first local chat",
    heading: "Ask the REACT Camp AI Coach",
    body: "Open AI Lab and try: “What does a CPU do? Explain it with an analogy for a beginner.” The answer is generated on this computer through Ollama.",
    icon: "💬",
    tone: "green",
  },
];
