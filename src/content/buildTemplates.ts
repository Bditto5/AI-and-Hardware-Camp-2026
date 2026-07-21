export interface BuildTemplate {
  id: string;
  title: string;
  description: string;
  html: string;
  css: string;
  javascript: string;
}

export const buildTemplates: BuildTemplate[] = [
  {
    id: "profile-card",
    title: "Profile Card",
    description: "HTML structure and CSS styling",
    html: `<main class="card">
  <div class="avatar">RC</div>
  <h1>Your Name</h1>
  <p>Hardware explorer and local AI builder.</p>
  <div class="skills">
    <span>HTML</span><span>Hardware</span><span>AI</span>
  </div>
  <button id="hello">Say hello</button>
</main>`,
    css: `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: system-ui, sans-serif;
  background: linear-gradient(135deg, #12172a, #2f2564);
  color: white;
}
.card {
  width: min(360px, calc(100% - 48px));
  padding: 32px;
  text-align: center;
  border: 1px solid #ffffff33;
  border-radius: 22px;
  background: #ffffff12;
  box-shadow: 0 24px 70px #0006;
}
.avatar {
  width: 82px; height: 82px; margin: auto;
  display: grid; place-items: center;
  border-radius: 50%; background: #766cff;
  font-size: 1.6rem; font-weight: 900;
}
.skills { display: flex; justify-content: center; gap: 8px; margin: 22px 0; }
.skills span { padding: 6px 10px; border-radius: 99px; background: #40d17b22; color: #81efa8; }
button { padding: 10px 16px; border: 0; border-radius: 9px; background: #ff6e9e; color: white; font-weight: 800; }`,
    javascript: `document.querySelector('#hello').addEventListener('click', () => {
  alert('Hello from REACT Camp!');
});`,
  },
  {
    id: "quiz",
    title: "Mini Quiz",
    description: "Arrays, events, state, and feedback",
    html: `<main class="quiz">
  <p class="label">REACT CAMP QUICK QUIZ</p>
  <h1 id="question"></h1>
  <div id="answers"></div>
  <p id="feedback"></p>
  <p id="score"></p>
</main>`,
    css: `body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0c1020; color: white; font-family: system-ui, sans-serif; }
.quiz { width: min(620px, calc(100% - 48px)); padding: 34px; border-radius: 20px; background: #192039; border: 1px solid #344162; }
.label { color: #40d17b; font-size: .75rem; font-weight: 900; letter-spacing: .15em; }
#answers { display: grid; gap: 10px; }
button { padding: 13px; text-align: left; border: 1px solid #46557d; border-radius: 10px; background: #11162a; color: white; font-weight: 700; }
button:hover { border-color: #766cff; }
#feedback { min-height: 24px; color: #ffc857; }`,
    javascript: `const questions = [
  { q: 'Which component is temporary workspace?', choices: ['SSD', 'RAM', 'PSU'], answer: 1 },
  { q: 'What runs the local text model?', choices: ['Ollama', 'A printer', 'BIOS'], answer: 0 },
  { q: 'What should you do before touching internal parts?', choices: ['Unplug the computer', 'Force the connector', 'Start a game'], answer: 0 }
];
let index = 0;
let points = 0;
const question = document.querySelector('#question');
const answers = document.querySelector('#answers');
const feedback = document.querySelector('#feedback');
const score = document.querySelector('#score');

function showQuestion() {
  const item = questions[index];
  question.textContent = item.q;
  answers.innerHTML = '';
  item.choices.forEach((choice, choiceIndex) => {
    const button = document.createElement('button');
    button.textContent = choice;
    button.addEventListener('click', () => answer(choiceIndex));
    answers.appendChild(button);
  });
  score.textContent = 'Score: ' + points;
}

function answer(choiceIndex) {
  if (choiceIndex === questions[index].answer) {
    points += 1;
    feedback.textContent = 'Correct!';
  } else {
    feedback.textContent = 'Not quite. Keep testing your understanding.';
  }
  index += 1;
  if (index < questions.length) setTimeout(showQuestion, 500);
  else {
    question.textContent = 'Finished!';
    answers.innerHTML = '';
    score.textContent = 'Final score: ' + points + ' / ' + questions.length;
  }
}

showQuestion();`,
  },
  {
    id: "story",
    title: "Branching Story",
    description: "Buttons, functions, and changing page content",
    html: `<main class="story">
  <p class="chapter">HARDWARE RESCUE</p>
  <h1 id="title">The computer will not start.</h1>
  <p id="text">You see no lights or fans. What do you check first?</p>
  <div id="choices"></div>
</main>`,
    css: `body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: radial-gradient(circle at top, #30276b, #0b0e16 60%); color: white; font-family: Georgia, serif; }
.story { width: min(680px, calc(100% - 50px)); padding: 42px; border-radius: 18px; background: #111726ee; border: 1px solid #514a89; }
.chapter { color: #ff84aa; font: 900 .74rem system-ui; letter-spacing: .2em; }
#text { min-height: 70px; color: #b9c1dd; font-size: 1.12rem; line-height: 1.65; }
#choices { display: flex; flex-wrap: wrap; gap: 10px; }
button { padding: 12px 15px; border: 1px solid #766cff; border-radius: 9px; background: #211b4e; color: white; font-weight: 800; }`,
    javascript: `const title = document.querySelector('#title');
const text = document.querySelector('#text');
const choices = document.querySelector('#choices');

function showScene(scene) {
  title.textContent = scene.title;
  text.textContent = scene.text;
  choices.innerHTML = '';
  scene.choices.forEach(choice => {
    const button = document.createElement('button');
    button.textContent = choice.label;
    button.addEventListener('click', choice.action);
    choices.appendChild(button);
  });
}

const start = {
  title: 'The computer will not start.',
  text: 'You see no lights or fans. What do you check first?',
  choices: [
    { label: 'Check external power', action: () => showScene(win) },
    { label: 'Remove the CPU while powered', action: () => showScene(unsafe) }
  ]
};
const win = { title: 'Good evidence first!', text: 'The power strip was off. You fixed the problem safely.', choices: [{ label: 'Restart', action: () => showScene(start) }] };
const unsafe = { title: 'Stop!', text: 'Internal work requires shutdown, unplugging, static precautions, and instructor approval.', choices: [{ label: 'Try a safe choice', action: () => showScene(start) }] };
showScene(start);`,
  },
];

