import { useEffect, useMemo, useState } from "react";
import { ChatPanel } from "./components/ChatPanel";
import { HistoryPanel } from "./components/HistoryPanel";
import { SettingsPanel } from "./components/SettingsPanel";
import { checkConnection } from "./api/ollama";
import { initHistoryStore } from "./storage/historyStore";
import type { SessionSummary } from "./storage/types";
import type { Prompt } from "./prompts/schema";
import { dayOneSlides } from "./content/dayOne";
import {
  loadCampProgress,
  markDayComplete,
  saveLastSlide,
  type CampProgress,
} from "./storage/campProgressStore";

type View = "home" | "learn" | "ai" | "history" | "settings" | "legacy";

const CAMP_PROMPT: Prompt = {
  id: "react-camp-ai-coach",
  title: "REACT Camp AI Coach",
  description: "A local AI tutor for computer hardware, AI concepts, prompts, and beginner coding.",
  category: "engagement",
  template: "Ask me about computer hardware, local AI, prompt engineering, or a project you want to build.",
};

const CAMP_PREAMBLE = `You are the REACT Camp AI Coach for students ages 13–18.
Teach computer hardware, local AI, prompt engineering, and beginner HTML/CSS/JavaScript.
Be encouraging and accurate. Explain instead of merely giving answers. Use short steps and everyday analogies.
Never claim to have feelings or certainty you do not have. Remind students to verify important facts.
For hardware work, put safety first: unplug equipment, discharge static, avoid force, and ask an instructor when unsure.
The AI is running locally through Ollama on this computer.`;

function App() {
  const [view, setView] = useState<View>("home");
  const [progress, setProgress] = useState<CampProgress>(() => loadCampProgress());
  const [slideIndex, setSlideIndex] = useState(() => loadCampProgress().lastSlideByDay[1] ?? 0);
  const [resumeSessionId, setResumeSessionId] = useState<string | undefined>();
  const [historyReady, setHistoryReady] = useState(false);
  const [ollamaState, setOllamaState] = useState<"checking" | "ready" | "error">("checking");
  const [ollamaMessage, setOllamaMessage] = useState("Checking local AI…");

  useEffect(() => {
    void initHistoryStore().then(() => setHistoryReady(true));
    void checkConnection().then((result) => {
      if (result.ok) {
        setOllamaState("ready");
        setOllamaMessage("Ollama and the selected model are ready");
      } else {
        setOllamaState("error");
        setOllamaMessage(result.message);
      }
    });
  }, []);

  const currentSlide = dayOneSlides[slideIndex];
  const dayOneDone = progress.completedDays.includes(1);
  const completionPercent = dayOneDone ? 20 : Math.round(((slideIndex + 1) / dayOneSlides.length) * 20);

  const slideDots = useMemo(
    () => dayOneSlides.map((slide, index) => ({ id: slide.id, active: index === slideIndex, visited: index <= slideIndex })),
    [slideIndex],
  );

  function navigate(next: View) {
    if (next !== "ai") setResumeSessionId(undefined);
    setView(next);
  }

  function goToSlide(nextIndex: number) {
    const bounded = Math.max(0, Math.min(dayOneSlides.length - 1, nextIndex));
    setSlideIndex(bounded);
    saveLastSlide(1, bounded);
    setProgress(loadCampProgress());
  }

  function completeDayOne() {
    markDayComplete(1);
    setProgress(loadCampProgress());
  }

  function resumeSession(summary: SessionSummary) {
    if (summary.type !== "chat") return;
    setResumeSessionId(summary.id);
    setView("ai");
  }

  return (
    <div className="camp-app">
      <header className="camp-topbar">
        <button className="camp-brand" onClick={() => navigate("home")}>
          <span className="camp-bolt">⚡</span>
          <span><strong>REACT Camp</strong><small>AI + Hardware</small></span>
        </button>
        <nav aria-label="Main navigation">
          <button className={view === "home" ? "active" : ""} onClick={() => navigate("home")}>Home</button>
          <button className={view === "learn" ? "active" : ""} onClick={() => navigate("learn")}>Learn</button>
          <button className={view === "ai" ? "active" : ""} onClick={() => navigate("ai")}>AI Lab</button>
          <button className={view === "history" ? "active" : ""} onClick={() => navigate("history")}>History</button>
          <button className={view === "legacy" ? "active" : ""} onClick={() => navigate("legacy")}>Full Camp</button>
          <button className={view === "settings" ? "active" : ""} onClick={() => navigate("settings")} aria-label="Settings">⚙</button>
        </nav>
        <div className={`ollama-pill ollama-${ollamaState}`} title={ollamaMessage}>
          <span /> {ollamaState === "ready" ? "AI ready" : ollamaState === "checking" ? "Checking AI" : "AI setup"}
        </div>
      </header>

      {view === "home" && (
        <main className="camp-page camp-home">
          <section className="camp-hero">
            <div>
              <p className="camp-eyebrow">BUILD IT. UNDERSTAND IT. TEACH IT BACK.</p>
              <h1>Open the machine.<br /><span>Run the intelligence.</span></h1>
              <p>Five days of hands-on hardware, local AI, prompt engineering, and student-built projects—running privately on this computer.</p>
              <div className="hero-actions">
                <button className="camp-primary" onClick={() => navigate("learn")}>{dayOneDone ? "Review Day 1" : "Continue Day 1"} →</button>
                <button className="camp-secondary" onClick={() => navigate("ai")}>Ask the AI Coach</button>
              </div>
            </div>
            <div className="hardware-orbit" aria-hidden="true">
              <div className="orbit-core">AI</div><span className="part cpu">CPU</span><span className="part gpu">GPU</span><span className="part ram">RAM</span><span className="part ssd">SSD</span>
            </div>
          </section>

          <section className="status-strip">
            <div><strong>{completionPercent}%</strong><span>Camp progress</span></div>
            <div><strong>{dayOneDone ? "1 / 5" : "0 / 5"}</strong><span>Days completed</span></div>
            <div><strong>Local</strong><span>Private Ollama AI</span></div>
            <div className={`status-message ${ollamaState}`}>{ollamaMessage}</div>
          </section>

          <section className="camp-grid">
            <article className="feature-card green" onClick={() => navigate("learn")}>
              <span>01</span><h2>Open It Up</h2><p>Computer components, safety, and your first local AI conversation.</p><button>Start lesson →</button>
            </article>
            <article className="feature-card purple" onClick={() => navigate("ai")}>
              <span>AI</span><h2>AI Lab</h2><p>Ask questions, improve prompts, attach a document, and keep every conversation.</p><button>Open AI Lab →</button>
            </article>
            <article className="feature-card pink" onClick={() => navigate("legacy")}>
              <span>21</span><h2>Activities + Build Lab</h2><p>Use the complete interactive camp while its modules move into the Windows shell.</p><button>Open full camp →</button>
            </article>
          </section>
        </main>
      )}

      {view === "learn" && currentSlide && (
        <main className="camp-page lesson-layout">
          <aside className="lesson-sidebar">
            <p className="camp-eyebrow">FIVE-DAY ARC</p>
            {["Open It Up", "The Brains", "Upgrade Lab", "Power On", "Demo Day"].map((title, index) => (
              <button key={title} className={index === 0 ? "active" : ""} disabled={index > 0}>
                <span>DAY {index + 1}</span>{title}{index > 0 && <small>Migration next</small>}
              </button>
            ))}
          </aside>
          <section className="lesson-stage">
            <header>
              <div><p className="camp-eyebrow">DAY 1 · OPEN IT UP</p><h1>{currentSlide.title}</h1></div>
              <strong>{slideIndex + 1} / {dayOneSlides.length}</strong>
            </header>
            <div className={`lesson-slide tone-${currentSlide.tone}`}>
              {currentSlide.icon && <div className="slide-icon">{currentSlide.icon}</div>}
              {currentSlide.kicker && <p className="slide-kicker">{currentSlide.kicker}</p>}
              <h2>{currentSlide.heading}</h2>
              {currentSlide.body && <p className="slide-body">{currentSlide.body}</p>}
              {currentSlide.bullets && <ul>{currentSlide.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
              {currentSlide.cards && <div className="component-grid">{currentSlide.cards.map((card) => <article key={card.title}><span>{card.icon}</span><h3>{card.title}</h3><p>{card.text}</p></article>)}</div>}
            </div>
            <footer className="lesson-controls">
              <button className="camp-secondary" onClick={() => goToSlide(slideIndex - 1)} disabled={slideIndex === 0}>← Previous</button>
              <div className="slide-dots">{slideDots.map((dot, index) => <button key={dot.id} className={`${dot.active ? "active" : ""} ${dot.visited ? "visited" : ""}`} onClick={() => goToSlide(index)} aria-label={`Go to slide ${index + 1}`} />)}</div>
              {slideIndex < dayOneSlides.length - 1 ? (
                <button className="camp-primary" onClick={() => goToSlide(slideIndex + 1)}>Next →</button>
              ) : (
                <button className="camp-primary" onClick={completeDayOne}>{dayOneDone ? "Day complete ✓" : "Mark Day 1 complete"}</button>
              )}
            </footer>
          </section>
        </main>
      )}

      {view === "ai" && (
        <main className="camp-page embedded-feature">
          <ChatPanel
            key={resumeSessionId ?? "new-camp-chat"}
            prompt={CAMP_PROMPT}
            onBack={() => navigate("home")}
            surface="assistant"
            messagePreamble={CAMP_PREAMBLE}
            resumeSessionId={resumeSessionId}
          />
        </main>
      )}

      {view === "history" && (
        <main className="camp-page embedded-feature">
          {historyReady ? <HistoryPanel onBack={() => navigate("home")} onResumeSession={resumeSession} /> : <p className="loading-card">Loading local history…</p>}
        </main>
      )}

      {view === "settings" && <main className="camp-page embedded-feature"><SettingsPanel onDone={() => navigate("home")} /></main>}

      {view === "legacy" && (
        <main className="legacy-shell">
          <div className="legacy-banner"><strong>Full interactive camp</strong><span>The complete curriculum, activities, games, and Build Lab remain available while each module is migrated into the desktop shell.</span></div>
          <iframe title="Complete REACT Camp curriculum" src="/legacy/curriculum.html" sandbox="allow-scripts allow-forms allow-downloads" />
        </main>
      )}
    </div>
  );
}

export default App;
