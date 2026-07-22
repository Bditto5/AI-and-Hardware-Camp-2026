import { useState } from "react";
import { aiQuiz, bugChallenges, hardwareQuiz, type QuizQuestion } from "../content/games";

type Game = "hardware" | "ai" | "bugs";

interface ScoreRecord {
  hardware: number;
  ai: number;
  bugs: number;
}

const SCORE_KEY = "react-camp-game-scores-v1";

function loadScores(): ScoreRecord {
  try {
    const parsed = JSON.parse(localStorage.getItem(SCORE_KEY) ?? "{}") as Partial<ScoreRecord>;
    return { hardware: parsed.hardware ?? 0, ai: parsed.ai ?? 0, bugs: parsed.bugs ?? 0 };
  } catch {
    return { hardware: 0, ai: 0, bugs: 0 };
  }
}

function saveBest(game: Game, score: number): ScoreRecord {
  const current = loadScores();
  const next = { ...current, [game]: Math.max(current[game], score) };
  localStorage.setItem(SCORE_KEY, JSON.stringify(next));
  return next;
}

function QuizGame({ title, questions, scoreKey, onScores }: { title: string; questions: QuizQuestion[]; scoreKey: "hardware" | "ai"; onScores: (scores: ScoreRecord) => void }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const question = questions[index];

  function answer(option: number) {
    if (selected !== null || !question) return;
    setSelected(option);
    if (option === question.answer) setScore((value) => value + 1);
  }

  function next() {
    if (index >= questions.length - 1) {
      onScores(saveBest(scoreKey, score));
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <section className="game-finish">
        <p className="camp-eyebrow">QUIZ COMPLETE</p>
        <h2>{title}</h2>
        <strong>{score} / {questions.length}</strong>
        <p>{score >= 8 ? "Excellent teach-back knowledge." : "Review the explanations and try again."}</p>
        <button className="camp-primary" onClick={restart}>Play again</button>
      </section>
    );
  }

  if (!question) return null;
  return (
    <section className="quiz-card">
      <header><div><p className="camp-eyebrow">{title}</p><h2>{question.question}</h2></div><strong>{index + 1} / {questions.length}</strong></header>
      <div className="quiz-options">
        {question.options.map((option, optionIndex) => {
          const status = selected === null ? "" : optionIndex === question.answer ? "correct" : optionIndex === selected ? "wrong" : "muted";
          return <button key={option} className={status} onClick={() => answer(optionIndex)} disabled={selected !== null}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</button>;
        })}
      </div>
      {selected !== null && <div className={`quiz-feedback ${selected === question.answer ? "correct" : "wrong"}`} role="status" aria-live="polite"><strong>{selected === question.answer ? "Correct" : "Not quite"}</strong><p>{question.explanation}</p><button className="camp-primary" onClick={next}>{index === questions.length - 1 ? "See score" : "Next question"}</button></div>}
    </section>
  );
}

function BugHunt({ onScores }: { onScores: (scores: ScoreRecord) => void }) {
  const [index, setIndex] = useState(0);
  const [hint, setHint] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const challenge = bugChallenges[index];

  function next() {
    const completed = index + 1;
    onScores(saveBest("bugs", completed));
    setIndex((value) => (value + 1) % bugChallenges.length);
    setHint(false);
    setRevealed(false);
  }

  if (!challenge) return null;
  return (
    <section className="bug-card">
      <header><div><p className="camp-eyebrow">BUG HUNT {index + 1} / {bugChallenges.length}</p><h2>{challenge.title}</h2><p>{challenge.description}</p></div></header>
      <div className="code-compare">
        <div><strong>{revealed ? "Original" : "Find the bug"}</strong><pre>{challenge.bad}</pre></div>
        {revealed && <div className="fixed"><strong>One correction</strong><pre>{challenge.fixed}</pre></div>}
      </div>
      {hint && !revealed && <p className="bug-hint" role="status"><strong>Hint:</strong> {challenge.hint}</p>}
      <div className="game-actions">
        {!revealed && <button className="camp-secondary" onClick={() => setHint(true)}>Show hint</button>}
        {!revealed ? <button className="camp-primary" onClick={() => setRevealed(true)}>Reveal correction</button> : <button className="camp-primary" onClick={next}>Next bug</button>}
      </div>
    </section>
  );
}

export function GamesPanel() {
  const [game, setGame] = useState<Game>("hardware");
  const [scores, setScores] = useState<ScoreRecord>(() => loadScores());
  return (
    <div className="games-page">
      <header className="games-heading"><div><p className="camp-eyebrow">PRACTICE + RETRY</p><h1>Camp Games</h1><p>Check your understanding and learn from every answer.</p></div><div className="score-summary"><span>Best hardware <strong>{scores.hardware}/10</strong></span><span>Best AI <strong>{scores.ai}/10</strong></span><span>Bugs completed <strong>{scores.bugs}/5</strong></span></div></header>
      <nav className="game-tabs" aria-label="Choose a camp game">
        <button aria-pressed={game === "hardware"} className={game === "hardware" ? "active" : ""} onClick={() => setGame("hardware")}>Hardware Quiz</button>
        <button aria-pressed={game === "ai"} className={game === "ai" ? "active" : ""} onClick={() => setGame("ai")}>AI Quiz</button>
        <button aria-pressed={game === "bugs"} className={game === "bugs" ? "active" : ""} onClick={() => setGame("bugs")}>Bug Hunt</button>
      </nav>
      {game === "hardware" && <QuizGame key="hardware" title="Hardware Quiz" questions={hardwareQuiz} scoreKey="hardware" onScores={setScores} />}
      {game === "ai" && <QuizGame key="ai" title="AI Quiz" questions={aiQuiz} scoreKey="ai" onScores={setScores} />}
      {game === "bugs" && <BugHunt onScores={setScores} />}
    </div>
  );
}
