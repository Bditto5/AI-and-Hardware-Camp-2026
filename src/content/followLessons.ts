import type { FollowTrackId } from "./followTracks";

export interface FollowPrompt {
  text: string;
  note?: string;
}

export interface FollowStep {
  id: string;
  label: string;
  title: string;
  why: string;
  actions: string[];
  prompt?: FollowPrompt;
  shot?: string;
  shotCaption?: string;
  target?: "html" | "css" | "javascript";
}

export interface FollowLesson {
  id: string;
  track: FollowTrackId;
  title: string;
  summary: string;
  duration: string;
  video?: string;
  objectives: string[];
  setup: string[];
  steps: FollowStep[];
  success: string[];
  extensions: string[];
  templateId?: string;
  source: { name: string; url: string };
}

const CARDBOARD_SOURCE = {
  name: "Cardboard Robots — AI in the Classroom",
  url: "https://cardboard.lofirobot.com/courses/ai-in-the-classroom/",
};

export const followLessons: FollowLesson[] = [
  {
    id: "chatbot-basics",
    track: "chatbots",
    title: "Basic lessons with a chatbot",
    summary: "Learn what a chatbot is, how it predicts words, and how to talk to it clearly.",
    duration: "22:15",
    video: "/lesson-media/chatbot-basics/video.mp4",
    objectives: [
      "Explain in your own words what a chatbot does.",
      "Write a clear question that gets a useful answer.",
      "Spot when a chatbot answer might be wrong.",
    ],
    setup: [
      "Open the AI Coach on this computer.",
      "Have a notebook or a text file ready for notes.",
    ],
    steps: [
      {
        id: "step-1",
        label: "1",
        title: "Meet your chatbot",
        why: "A chatbot guesses the next best word based on patterns it learned. Knowing that helps you use it well.",
        actions: [
          "Open the AI Coach.",
          "Ask it: \"What are you and how do you decide what to say?\"",
          "Read the answer out loud to a partner.",
        ],
        prompt: {
          text: "What are you and how do you decide what to say next?",
          note: "There is no wrong question here — you are just getting to know the tool.",
        },
        shot: "/lesson-media/chatbot-basics/step-1.png",
        shotCaption: "A first message to the AI Coach asking what it is.",
      },
      {
        id: "step-2",
        label: "2",
        title: "Ask a vague question",
        why: "Vague questions get vague answers. Seeing that in action makes the next step click.",
        actions: [
          "Ask the AI Coach something short and vague, like \"tell me about computers.\"",
          "Notice how general the answer feels.",
        ],
        prompt: {
          text: "Tell me about computers.",
        },
      },
      {
        id: "step-3",
        label: "3",
        title: "Ask a clear question",
        why: "Adding your goal, your level, and what you already know narrows the answer to something useful.",
        actions: [
          "Rewrite your question with a goal, your grade level, and one thing you already know.",
          "Send it and compare the two answers.",
        ],
        prompt: {
          text: "I'm a middle school student. I know a computer has a CPU and RAM. Explain what a GPU does, in two short paragraphs.",
        },
      },
      {
        id: "step-4",
        label: "4",
        title: "Check the answer",
        why: "Chatbots can sound confident and still be wrong. Checking builds a healthy habit.",
        actions: [
          "Pick one fact from the last answer.",
          "Ask the AI Coach how confident it is and what could be wrong.",
          "Decide if you would trust that fact without checking elsewhere.",
        ],
        prompt: {
          text: "How confident are you in that last answer, and what part of it is most likely to be wrong?",
        },
      },
      {
        id: "step-5",
        label: "5",
        title: "Write your own rule",
        why: "Turning what you noticed into a rule helps it stick for every lesson after this one.",
        actions: [
          "Write one sentence: \"When I ask a chatbot something, I will always ___.\"",
          "Share your rule with a partner.",
        ],
      },
    ],
    success: [
      "You can explain what a chatbot is doing when it answers you.",
      "You wrote at least one clear, specific question.",
      "You have a personal rule for checking chatbot answers.",
    ],
    extensions: [
      "Ask the AI Coach to quiz you on today's vocabulary.",
      "Try the same question with different amounts of detail and compare all three answers.",
    ],
    source: CARDBOARD_SOURCE,
  },
  {
    id: "chatbot-webpage",
    track: "chatbots",
    title: "Make a web page with the AI helper",
    summary: "Use the AI Coach to help you build a simple profile page in Build Lab, one small piece at a time.",
    duration: "12:31",
    video: "/lesson-media/chatbot-webpage/video.mp4",
    objectives: [
      "Open a starter project in Build Lab.",
      "Ask the AI Coach for one small change at a time.",
      "Explain what your HTML, CSS, and JavaScript each do.",
    ],
    setup: [
      "This lesson opens the Profile Card starter template for you in Build Lab.",
      "Keep this tab open so you can copy prompts as you go.",
    ],
    steps: [
      {
        id: "step-1",
        label: "1",
        title: "Open your starter page",
        why: "Starting from a working page means you can focus on one change instead of building everything from scratch.",
        actions: [
          "Click \"Open in Build Lab\" below.",
          "Click \"Run preview\" to see the page.",
          "Find the HTML, CSS, and JavaScript tabs.",
        ],
        target: "html",
      },
      {
        id: "step-2",
        label: "2",
        title: "Ask for one change",
        why: "One small, testable change is easier to understand and undo than five changes at once.",
        actions: [
          "Copy the prompt below.",
          "Paste it into the AI Coach, but change the name and skills to your own.",
          "Read the answer before touching any code.",
        ],
        prompt: {
          text: "I have a profile card web page with HTML, CSS, and JavaScript. I want to change the name to mine and add one new skill tag. What is the smallest change I can make?",
          note: "Swap in your real name and skill before you send it.",
        },
      },
      {
        id: "step-3",
        label: "3",
        title: "Make the change yourself",
        why: "Typing the change yourself, instead of pasting a whole file, is how you actually learn HTML.",
        actions: [
          "Go to the HTML tab in Build Lab.",
          "Find your name and one skill tag.",
          "Type the change the AI Coach suggested.",
          "Click \"Run preview\" again.",
        ],
        target: "html",
      },
      {
        id: "step-4",
        label: "4",
        title: "Style it your way",
        why: "CSS controls color, spacing, and shape — small edits here make the page feel like yours.",
        actions: [
          "Go to the CSS tab.",
          "Ask the AI Coach for one color idea that fits your personality.",
          "Change one color value to match.",
          "Run the preview and compare before and after.",
        ],
        prompt: {
          text: "My profile card uses a purple color scheme. Suggest one accent color that would feel bold, and tell me exactly which line to change.",
        },
        target: "css",
      },
      {
        id: "step-5",
        label: "5",
        title: "Explain your button",
        why: "Being able to explain a few lines of JavaScript out loud is stronger proof of learning than copying code.",
        actions: [
          "Go to the JavaScript tab.",
          "Find the button click code.",
          "Ask the AI Coach to explain it in one sentence.",
          "Say that sentence out loud in your own words.",
        ],
        prompt: {
          text: "Explain what this JavaScript button code does, in one plain-language sentence a classmate could repeat back.",
        },
        target: "javascript",
      },
    ],
    success: [
      "Your profile card shows your name and at least one new skill.",
      "You changed one CSS color on purpose and can say why.",
      "You can explain the button's JavaScript in one sentence.",
    ],
    extensions: [
      "Add a second button that changes the page's background color.",
      "Ask the AI Coach for one accessibility tip and try it.",
    ],
    templateId: "profile-card",
    source: CARDBOARD_SOURCE,
  },
  {
    id: "chatbot-learn-to-code",
    track: "chatbots",
    title: "Use a chatbot to learn to code",
    summary: "Practice asking a chatbot to teach instead of just answer, using it like a patient tutor.",
    duration: "06:18",
    video: "/lesson-media/chatbot-learn-to-code/video.mp4",
    objectives: [
      "Ask a chatbot to teach a concept step by step.",
      "Use a chatbot to explain an error message.",
      "Practice a short coding exercise the chatbot suggests.",
    ],
    setup: ["Open the AI Coach.", "Have a Build Lab project open in another tab if you want to try the exercise."],
    steps: [
      {
        id: "step-1",
        label: "1",
        title: "Ask to be taught, not told",
        why: "A tutor-style prompt gets you an explanation with steps, not just a finished answer.",
        actions: [
          "Copy the prompt below.",
          "Send it to the AI Coach.",
          "Read each step before moving on.",
        ],
        prompt: {
          text: "Teach me what a variable is in JavaScript, step by step, like I have never coded before. Use one everyday example.",
        },
      },
      {
        id: "step-2",
        label: "2",
        title: "Ask for a tiny exercise",
        why: "Practicing right after learning helps the idea stick.",
        actions: [
          "Ask the AI Coach for one tiny practice exercise about variables.",
          "Try to solve it on paper or in your head before checking the answer.",
        ],
        prompt: {
          text: "Give me one tiny practice exercise about JavaScript variables, with the answer hidden until I ask for it.",
        },
      },
      {
        id: "step-3",
        label: "3",
        title: "Decode an error message",
        why: "Error messages look scary, but a chatbot can translate them into plain language.",
        actions: [
          "Open a Build Lab project.",
          "Break one line on purpose (like removing a closing bracket).",
          "Copy any error you see, or describe what stopped working.",
          "Ask the AI Coach what it means.",
        ],
        prompt: {
          text: "My code stopped working after I changed one line. Here is what I expected, what happened, and my code.",
          note: "Fill in the three blanks with your real project details before sending.",
        },
      },
      {
        id: "step-4",
        label: "4",
        title: "Fix it yourself",
        why: "Typing the fix yourself, after understanding the explanation, is the part that actually teaches you.",
        actions: [
          "Undo your on-purpose break.",
          "In your own words, tell a partner what the error meant.",
        ],
      },
    ],
    success: [
      "You can explain what a variable is without reading it off a screen.",
      "You solved one small practice exercise.",
      "You translated an error message into plain language.",
    ],
    extensions: [
      "Ask the AI Coach to teach you one more coding term the same way.",
      "Try breaking a different line and repeating steps 3 and 4.",
    ],
    source: CARDBOARD_SOURCE,
  },
  {
    id: "chatbot-microbit-arduino",
    track: "chatbots",
    title: "Program a BBC micro:bit or Arduino",
    summary: "Use the AI Coach as a hardware helper while you plan and explain a micro:bit or Arduino program.",
    duration: "09:04",
    video: "/lesson-media/chatbot-microbit-arduino/video.mp4",
    objectives: [
      "Describe what you want your board to do in plain language.",
      "Ask for a step-by-step plan before writing any code.",
      "Explain each block or line once your program works.",
    ],
    setup: [
      "Have your micro:bit or Arduino and its normal programming app or website ready.",
      "This lesson does not run hardware code here — it helps you plan and explain it.",
    ],
    steps: [
      {
        id: "step-1",
        label: "1",
        title: "Describe the goal",
        why: "A clear goal sentence keeps your program focused and easier to plan.",
        actions: [
          "Decide one thing you want your board to do, like \"blink an LED when a button is pressed.\"",
          "Write that goal in one sentence.",
        ],
      },
      {
        id: "step-2",
        label: "2",
        title: "Ask for a plan first",
        why: "Planning before coding catches mistakes early and matches how real engineers work.",
        actions: [
          "Copy the prompt below and fill in your goal.",
          "Send it to the AI Coach.",
          "Read the plan and check it makes sense on your board.",
        ],
        prompt: {
          text: "I have a BBC micro:bit (or Arduino). I want it to: [your goal]. Give me a step-by-step plan of the blocks or code I need, in order, with a one-line reason for each step.",
        },
      },
      {
        id: "step-3",
        label: "3",
        title: "Build it one step at a time",
        why: "Testing after each step makes problems easy to find, because you know exactly what just changed.",
        actions: [
          "Build the first step in your programming app.",
          "Test it on the board before adding the next step.",
          "Repeat for each step in the plan.",
        ],
      },
      {
        id: "step-4",
        label: "4",
        title: "Ask about a stuck spot",
        why: "Describing exactly what happened gets a much more useful answer than \"it doesn't work.\"",
        actions: [
          "If a step does not work, describe what you expected, what happened, and what block or line you just added.",
          "Ask the AI Coach what might be wrong.",
        ],
        prompt: {
          text: "My micro:bit (or Arduino) does not work. Here is what I expected, what happened, and my code.",
          note: "Fill in the three blanks with your real project details before sending.",
        },
      },
      {
        id: "step-5",
        label: "5",
        title: "Explain it back",
        why: "Teaching it back to someone else is the strongest sign you actually understand your program.",
        actions: [
          "Show your working program to a partner.",
          "Explain each block or line in your own words.",
        ],
      },
    ],
    success: [
      "You wrote a one-sentence goal before coding.",
      "You built your program one tested step at a time.",
      "You can explain every block or line in your finished program.",
    ],
    extensions: [
      "Add a second input, like a second button or a sensor.",
      "Ask the AI Coach for one safety reminder for your specific board.",
    ],
    source: CARDBOARD_SOURCE,
  },
  {
    id: "face-detection-scratch",
    track: "face",
    title: "Face detection in Scratch",
    summary: "Explore how a Scratch project can find a face on camera, and ask the AI Coach to explain the idea behind it.",
    duration: "11:38",
    video: "/lesson-media/face-detection-scratch/video.mp4",
    objectives: [
      "Explain in plain language how face detection works.",
      "Set up a face-detection extension in Scratch.",
      "Use one detected value, like face position, in a project.",
    ],
    setup: [
      "Open Scratch (scratch.mit.edu or your offline copy) in another tab.",
      "Allow camera access only if your teacher has approved it for this lesson.",
    ],
    steps: [
      {
        id: "step-1",
        label: "1",
        title: "Ask what face detection is",
        why: "Understanding the idea before the tool keeps you from just clicking blocks blindly.",
        actions: [
          "Copy the prompt below.",
          "Send it to the AI Coach.",
          "Summarize the answer in one sentence for a partner.",
        ],
        prompt: {
          text: "Explain how face detection works in simple terms, like I am new to AI. What is it actually looking for in a video image?",
        },
      },
      {
        id: "step-2",
        label: "2",
        title: "Add the extension",
        why: "Scratch's face-sensing blocks only appear once the matching extension is added.",
        actions: [
          "In Scratch, click the extensions button in the bottom-left corner.",
          "Choose the face sensing (or teachable machine) extension.",
          "Allow camera permission when your browser asks.",
        ],
        shot: "/lesson-media/face-detection-scratch/step-2.png",
        shotCaption: "The Scratch extensions menu with the face-sensing extension highlighted.",
      },
      {
        id: "step-3",
        label: "3",
        title: "Watch the values change",
        why: "Seeing numbers update live shows you that the computer is truly tracking your face, not guessing.",
        actions: [
          "Drag out a block that reports face position (like x or y position of your nose).",
          "Click it and move your face around.",
          "Watch the reported number change.",
        ],
      },
      {
        id: "step-4",
        label: "4",
        title: "Use the value in a script",
        why: "Connecting a detected value to a sprite's behavior is what turns detection into an interactive project.",
        actions: [
          "Snap a face-position block into a \"go to x / y\" block on a sprite.",
          "Add this to a forever loop so it keeps updating.",
          "Move your face and watch the sprite follow.",
        ],
      },
      {
        id: "step-5",
        label: "5",
        title: "Ask why it sometimes struggles",
        why: "Knowing the limits of face detection is part of understanding the technology honestly.",
        actions: [
          "Ask the AI Coach why face detection might fail in bad lighting or at an angle.",
          "Test that idea by dimming the light or turning your head.",
        ],
        prompt: {
          text: "Why might face detection stop working well in low light or when a face is turned to the side?",
        },
      },
    ],
    success: [
      "You can explain face detection in your own words.",
      "You added the face-sensing extension and saw live values.",
      "You made a sprite react to your face position.",
    ],
    extensions: [
      "Make a sprite grow or shrink based on how close your face is.",
      "Add a costume change when a certain face position is reached.",
    ],
    source: CARDBOARD_SOURCE,
  },
  {
    id: "face-controlled-games",
    track: "face",
    title: "Face-controlled games in Scratch",
    summary: "Turn face-tracking values into a simple, playable game where your face is the controller.",
    duration: "11:53",
    video: "/lesson-media/face-controlled-games/video.mp4",
    objectives: [
      "Reuse a face-detection value to control a game sprite.",
      "Add scoring or a win condition.",
      "Explain how the game turns face movement into game actions.",
    ],
    setup: [
      "Open Scratch with the face-sensing extension already added (see the previous lesson).",
      "Have a simple sprite ready, like a ball or a basket.",
    ],
    steps: [
      {
        id: "step-1",
        label: "1",
        title: "Plan the control scheme",
        why: "Deciding what face movement means before you build keeps the game simple and playable.",
        actions: [
          "Decide one face movement, like moving your head left or right.",
          "Decide what that should move on screen.",
          "Write your plan as one sentence.",
        ],
      },
      {
        id: "step-2",
        label: "2",
        title: "Ask for the block plan",
        why: "A short plan of blocks in order is easier to build than guessing which block goes first.",
        actions: [
          "Copy the prompt below and fill in your control scheme.",
          "Send it to the AI Coach.",
        ],
        prompt: {
          text: "In Scratch, I want to move a sprite left and right using my face position from the face-sensing extension. What blocks do I need, in order?",
        },
      },
      {
        id: "step-3",
        label: "3",
        title: "Build the movement",
        why: "Testing the movement alone, before adding a goal, makes bugs easier to spot.",
        actions: [
          "Build the blocks from the plan on your player sprite.",
          "Test moving your face and watch the sprite move.",
          "Adjust the sensitivity if the movement feels too fast or slow.",
        ],
      },
      {
        id: "step-4",
        label: "4",
        title: "Add a goal",
        why: "A goal (catching, dodging, or scoring) is what turns a demo into a game.",
        actions: [
          "Add a second sprite to catch, dodge, or collect.",
          "Add a score variable that changes on a successful touch.",
        ],
      },
      {
        id: "step-5",
        label: "5",
        title: "Playtest and explain",
        why: "Watching someone else play reveals confusing parts you cannot see yourself.",
        actions: [
          "Have a partner play your game.",
          "Ask them what was confusing.",
          "Explain how their face movement became a game action.",
        ],
      },
    ],
    success: [
      "Your sprite moves in response to your face.",
      "Your game has a working score or goal.",
      "You can explain the path from face movement to on-screen action.",
    ],
    extensions: [
      "Add a second player controlled by keyboard for a two-way race.",
      "Add sound effects when the score changes.",
    ],
    source: CARDBOARD_SOURCE,
  },
  {
    id: "teachable-machine-train",
    track: "ml",
    title: "Train a model with Teachable Machine",
    summary: "Collect your own examples and train a simple image or pose model with Google's Teachable Machine.",
    duration: "10:49",
    video: "/lesson-media/teachable-machine-train/video.mp4",
    objectives: [
      "Explain what \"training\" means for a machine learning model.",
      "Collect balanced example classes for a model.",
      "Train and test a model's accuracy.",
    ],
    setup: [
      "Open Teachable Machine in another tab (your teacher will provide the link or offline copy).",
      "Have your camera ready.",
    ],
    steps: [
      {
        id: "step-1",
        label: "1",
        title: "Ask what training means",
        why: "Knowing that a model learns from examples, not rules you write, changes how you think about it.",
        actions: [
          "Copy the prompt below.",
          "Send it to the AI Coach.",
          "Explain the answer to a partner in one sentence.",
        ],
        prompt: {
          text: "In simple terms, what does it mean to \"train\" a machine learning model? What is it actually learning from?",
        },
      },
      {
        id: "step-2",
        label: "2",
        title: "Pick two classes",
        why: "Starting small with two clear, different classes makes your first model easier to test and trust.",
        actions: [
          "Open Teachable Machine and start a new Image Project.",
          "Name Class 1 and Class 2 with two clearly different things (like \"thumbs up\" and \"open hand\").",
        ],
        shot: "/lesson-media/teachable-machine-train/step-2.png",
        shotCaption: "Teachable Machine with two named classes ready for samples.",
      },
      {
        id: "step-3",
        label: "3",
        title: "Collect balanced samples",
        why: "A model trained on lopsided data (lots of one class, few of another) learns a lopsided guess.",
        actions: [
          "Hold the webcam button for Class 1 and capture at least 30 samples, moving slightly each time.",
          "Do the same for Class 2 with roughly the same number of samples.",
        ],
      },
      {
        id: "step-4",
        label: "4",
        title: "Train and test",
        why: "Testing live, right after training, is the fastest way to catch a confused model.",
        actions: [
          "Click \"Train Model.\"",
          "Once training finishes, test it live with your webcam.",
          "Try a pose or object you did not use as a sample and see what happens.",
        ],
      },
      {
        id: "step-5",
        label: "5",
        title: "Ask why it got confused",
        why: "A chatbot can suggest likely reasons a model mixes up two classes, which points you toward a fix.",
        actions: [
          "If the model confuses the two classes, describe what happened to the AI Coach.",
          "Ask for one reason it might be happening.",
        ],
        prompt: {
          text: "My Teachable Machine model sometimes mixes up two classes that look different to me. What are common reasons a model gets confused like this?",
        },
      },
      {
        id: "step-6",
        label: "6",
        title: "Improve one thing",
        why: "Fixing the single most likely cause is faster and more instructive than starting completely over.",
        actions: [
          "Add more samples for the weaker class, or add samples with different lighting or angles.",
          "Retrain and test again.",
        ],
      },
    ],
    success: [
      "You collected balanced samples for two classes.",
      "You trained a model and tested it live.",
      "You can explain one reason a model might confuse two classes.",
    ],
    extensions: [
      "Add a third class and retrain.",
      "Export your model and note its name for the next lesson.",
    ],
    source: CARDBOARD_SOURCE,
  },
  {
    id: "teachable-machine-scratch",
    track: "ml",
    title: "Use your model inside Scratch",
    summary: "Connect the model you trained in Teachable Machine to a Scratch project so it can react live.",
    duration: "05:18",
    video: "/lesson-media/teachable-machine-scratch/video.mp4",
    objectives: [
      "Connect a trained Teachable Machine model to Scratch.",
      "Trigger a sprite action from a model's live prediction.",
      "Explain the full path from webcam to sprite action.",
    ],
    setup: [
      "Finish the previous lesson so you have a trained model ready.",
      "Open Scratch with the Teachable Machine extension available.",
    ],
    steps: [
      {
        id: "step-1",
        label: "1",
        title: "Connect your model",
        why: "Scratch needs your model's link or files before it can use your training.",
        actions: [
          "In Scratch, add the Teachable Machine extension.",
          "Paste in your model's link or upload its files as your teacher shows.",
        ],
        shot: "/lesson-media/teachable-machine-scratch/step-1.png",
        shotCaption: "The Teachable Machine extension block waiting for a model link.",
      },
      {
        id: "step-2",
        label: "2",
        title: "Read the live prediction",
        why: "Watching the class name update live confirms the connection actually works before you build on it.",
        actions: [
          "Drag out the block that reports the current predicted class.",
          "Click it and try both of your trained poses or objects.",
          "Watch the class name change live.",
        ],
      },
      {
        id: "step-3",
        label: "3",
        title: "Plan the reaction",
        why: "Deciding the sprite's reaction first keeps your \"if\" blocks simple and testable.",
        actions: [
          "Decide what should happen when Class 1 is detected, and what should happen for Class 2.",
          "Write your plan as one sentence per class.",
        ],
      },
      {
        id: "step-4",
        label: "4",
        title: "Build the if-blocks",
        why: "One if-block per class, checked in a forever loop, is the simplest way to react to live predictions.",
        actions: [
          "Copy the prompt below and fill in your two class names and reactions.",
          "Use the AI Coach's plan to build \"if class is ___, then ___\" blocks in a forever loop.",
        ],
        prompt: {
          text: "In Scratch, I have a Teachable Machine block that reports a class name. I want: if the class is [class 1], do [reaction 1]; if the class is [class 2], do [reaction 2]. What blocks do I need, in order?",
        },
      },
      {
        id: "step-5",
        label: "5",
        title: "Test and explain",
        why: "Explaining the full chain out loud proves you understand the system, not just that it works.",
        actions: [
          "Test both poses or objects and confirm each triggers the right reaction.",
          "Explain the path out loud: webcam, to model, to Scratch, to sprite.",
        ],
      },
    ],
    success: [
      "Your model is connected and reporting live in Scratch.",
      "Each class triggers its own sprite reaction.",
      "You can explain the full webcam-to-sprite path.",
    ],
    extensions: [
      "Add a third class from your model with its own reaction.",
      "Add a score that goes up each time a specific class is detected.",
    ],
    source: CARDBOARD_SOURCE,
  },
];
