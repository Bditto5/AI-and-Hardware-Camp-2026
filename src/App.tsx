import { useEffect, useMemo, useRef, useState } from "react";
import { ChatPanel } from "./components/ChatPanel";
import { HistoryPanel } from "./components/HistoryPanel";
import { SettingsPanel } from "./components/SettingsPanel";
import { GamesPanel } from "./components/GamesPanel";
import { ActivitiesPanel } from "./components/ActivitiesPanel";
import { BuildLab } from "./components/BuildLab";
import { TeacherPanel } from "./components/TeacherPanel";
import { checkConnection } from "./api/ollama";
import { initHistoryStore } from "./storage/historyStore";
import type { SessionSummary } from "./storage/types";
import type { Prompt } from "./prompts/schema";
import { campDays } from "./content/campDays";
import {
  getNextIncompleteDay,
  loadCampProgress,
  markDayComplete,
  saveLastSlide,
  type CampProgress,
} from "./storage/campProgressStore";
import { loadTeacherSettings, type TeacherSettings } from "./storage/teacherStore";

type View = "home" | "learn" | "activities" | "build" | "games" | "ai" | "history" | "teacher" | "settings" | "legacy";

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

const CODE_COACH_PROMPT: Prompt = {
  id: "react-camp-code-coach",
  title: "REACT Camp Code Coach",
  description: "A local coach for student HTML, CSS, and JavaScript projects.",
  category: "engagement",
  template: "Describe what you expected, what happened, and the smallest change you want to make.",
};

const ACTIVITY_COACH_PROMPT: Prompt = {
  id: "react-camp-activity-coach",
  title: "REACT Camp Activity Coach",
  description: "Hints and teach-back questions for camp activities.",
  category: "engagement",
  template: "Tell me which activity you are doing and where you are stuck.",
};

const CODE_COACH_PREAMBLE = `${CAMP_PREAMBLE}
You are now the code coach. Prefer diagnosis, questions, and one small testable change at a time.
Do not claim to run the code. Never provide code that accesses the network, local files, browser storage, popups, or the host application.`;

function App() {
  const [view, setView] = useState<View>("home");
  const [progress, setProgress] = useState<CampProgress>(() => loadCampProgress());
  const [selectedDay, setSelectedDay] = useState(() => getNextIncompleteDay(loadCampProgress(), campDays.length));
  const [slideIndex, setSlideIndex] = useState(() => {
    const loaded = loadCampProgress();
    const day = getNextIncompleteDay(loaded, campDays.length);
    return loaded.lastSlideByDay[day] ?? 0;
  });
  const [resumeSessionId, setResumeSessionId] = useState<string | undefined>();
  const [historyReady, setHistoryReady] = useState(false);
  const [ollamaState, setOllamaState] = useState<"checking" | "ready" | "error">("checking");
  const [ollamaMessage, setOllamaMessage] = useState("Checking local AI…");
  const [aiPrompt, setAiPrompt] = useState<Prompt>(CAMP_PROMPT);
  const [aiInitialMessage, setAiInitialMessage] = useState<string | undefined>();
  const [aiLaunchId, setAiLaunchId] = useState("general");
  const [teacherSettings, setTeacherSettings] = useState<TeacherSettings>(() => loadTeacherSettings());
  const [presenterMode, setPresenterMode] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const isInitialView = useRef(true);

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

  useEffect(() => {
    if (isInitialView.current) {
      isInitialView.current = false;
      return;
    }
    window.requestAnimationFrame(() => mainContentRef.current?.focus());
  }, [view]);

  const currentDay = campDays[selectedDay - 1];
  const currentSlide = currentDay?.slides[slideIndex];
  const currentDayDone = progress.completedDays.includes(selectedDay);
  const nextIncompleteDay = getNextIncompleteDay(progress, campDays.length);
  const completionPercent = Math.min(
    100,
    progress.completedDays.length * 20 +
      (currentDayDone || !currentDay ? 0 : Math.round(((slideIndex + 1) / currentDay.slides.length) * 20)),
  );

  useEffect(() => {
    if (view !== "learn" || !currentDay) return;
    function moveSlide(delta: number) {
      const bounded = Math.max(0, Math.min(currentDay.slides.length - 1, slideIndex + delta));
      setSlideIndex(bounded);
      saveLastSlide(selectedDay, bounded);
      setProgress(loadCampProgress());
    }
    function handleLessonKeys(event: KeyboardEvent) {
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        moveSlide(1);
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        moveSlide(-1);
      }
      if (event.key === "Escape" && presenterMode) {
        setPresenterMode(false);
        if (document.fullscreenElement) void document.exitFullscreen();
      }
    }
    window.addEventListener("keydown", handleLessonKeys);
    return () => window.removeEventListener("keydown", handleLessonKeys);
  }, [currentDay, presenterMode, selectedDay, slideIndex, view]);

  const slideDots = useMemo(
    () => currentDay?.slides.map((slide, index) => ({ id: slide.id, active: index === slideIndex, visited: index <= slideIndex })) ?? [],
    [currentDay, slideIndex],
  );

  function navigate(next: View) {
    if (next !== "learn" && presenterMode) {
      setPresenterMode(false);
      if (document.fullscreenElement) void document.exitFullscreen();
    }
    if ((next === "ai" && !teacherSettings.aiEnabled) || (next === "build" && !teacherSettings.buildEnabled)) {
      setView("teacher");
      return;
    }
    if (next !== "ai") setResumeSessionId(undefined);
    setView(next);
  }

  function togglePresenterMode() {
    const next = !presenterMode;
    setPresenterMode(next);
    if (next && !document.fullscreenElement) void document.documentElement.requestFullscreen().catch(() => undefined);
    if (!next && document.fullscreenElement) void document.exitFullscreen();
  }

  function openGeneralAI() {
    setAiPrompt(CAMP_PROMPT);
    setAiInitialMessage(undefined);
    setAiLaunchId(`general-${Date.now()}`);
    navigate("ai");
  }

  function openActivityCoach(message: string) {
    setAiPrompt(ACTIVITY_COACH_PROMPT);
    setAiInitialMessage(message);
    setAiLaunchId(`activity-${Date.now()}`);
    navigate("ai");
  }

  function openCodeCoach(message: string) {
    setAiPrompt(CODE_COACH_PROMPT);
    setAiInitialMessage(message);
    setAiLaunchId(`code-${Date.now()}`);
    navigate("ai");
  }

  function goToSlide(nextIndex: number) {
    if (!currentDay) return;
    const bounded = Math.max(0, Math.min(currentDay.slides.length - 1, nextIndex));
    setSlideIndex(bounded);
    saveLastSlide(selectedDay, bounded);
    setProgress(loadCampProgress());
  }

  function selectDay(day: number) {
    const nextDay = campDays.find((item) => item.number === day);
    if (!nextDay) return;
    const savedIndex = loadCampProgress().lastSlideByDay[day] ?? 0;
    setSelectedDay(day);
    setSlideIndex(Math.min(savedIndex, nextDay.slides.length - 1));
  }

  function completeCurrentDay() {
    markDayComplete(selectedDay);
    setProgress(loadCampProgress());
  }

  function resumeSession(summary: SessionSummary) {
    if (summary.type !== "chat") return;
    if (!teacherSettings.aiEnabled) {
      setView("teacher");
      return;
    }
    setResumeSessionId(summary.id);
    setAiPrompt(CAMP_PROMPT);
    setAiInitialMessage(undefined);
    setView("ai");
  }

  return (
    <div className="camp-app">
      <a className="skip-link" href="#camp-main-content">Skip to main content</a>
      <header className="camp-topbar">
        <button className="camp-brand" onClick={() => navigate("home")}>
          <span className="camp-bolt">⚡</span>
          <span><strong>REACT Camp</strong><small>AI + Hardware</small></span>
        </button>
        <nav aria-label="Main navigation">
          <button className={view === "home" ? "active" : ""} aria-current={view === "home" ? "page" : undefined} onClick={() => navigate("home")}>Home</button>
          <button className={view === "learn" ? "active" : ""} aria-current={view === "learn" ? "page" : undefined} onClick={() => navigate("learn")}>Learn</button>
          <button className={view === "activities" ? "active" : ""} aria-current={view === "activities" ? "page" : undefined} onClick={() => navigate("activities")}>Activities</button>
          <button className={view === "build" ? "active" : ""} aria-current={view === "build" ? "page" : undefined} onClick={() => navigate("build")}>Build</button>
          <button className={view === "games" ? "active" : ""} aria-current={view === "games" ? "page" : undefined} onClick={() => navigate("games")}>Games</button>
          <button className={view === "ai" ? "active" : ""} aria-current={view === "ai" ? "page" : undefined} onClick={openGeneralAI}>AI Lab</button>
          <button className={view === "history" ? "active" : ""} aria-current={view === "history" ? "page" : undefined} onClick={() => navigate("history")}>History</button>
          <button className={view === "teacher" ? "active" : ""} aria-current={view === "teacher" ? "page" : undefined} onClick={() => navigate("teacher")}>Teacher</button>
          <button className={view === "settings" ? "active" : ""} onClick={() => navigate("settings")} aria-label="Settings">⚙</button>
        </nav>
        <div className={`ollama-pill ollama-${ollamaState}`} title={ollamaMessage} role="status" aria-live="polite">
          <span /> {ollamaState === "ready" ? "AI ready" : ollamaState === "checking" ? "Checking AI" : "AI setup"}
        </div>
      </header>

      <div id="camp-main-content" ref={mainContentRef} tabIndex={-1}>

      {view === "home" && (
        <main className="camp-page camp-home">
          <section className="camp-hero">
            <div>
              <p className="camp-eyebrow">BUILD IT. UNDERSTAND IT. TEACH IT BACK.</p>
              <h1>Open the machine.<br /><span>Run the intelligence.</span></h1>
              <p>Five days of hands-on hardware, local AI, prompt engineering, and student-built projects—running privately on this computer.</p>
              <div className="hero-actions">
                <button className="camp-primary" onClick={() => { selectDay(nextIncompleteDay); navigate("learn"); }}>
                  {progress.completedDays.length === campDays.length ? "Review the camp" : `Continue Day ${nextIncompleteDay}`} →
                </button>
                <button className="camp-secondary" onClick={openGeneralAI}>Ask the AI Coach</button>
              </div>
            </div>
            <div className="hardware-orbit" aria-hidden="true">
              <div className="orbit-core">AI</div><span className="part cpu">CPU</span><span className="part gpu">GPU</span><span className="part ram">RAM</span><span className="part ssd">SSD</span>
            </div>
          </section>

          <section className="status-strip">
            <div><strong>{completionPercent}%</strong><span>Camp progress</span></div>
            <div><strong>{progress.completedDays.length} / {campDays.length}</strong><span>Days completed</span></div>
            <div><strong>Local</strong><span>Private Ollama AI</span></div>
            <div className={`status-message ${ollamaState}`}>{ollamaMessage}</div>
          </section>

          <section className="camp-grid">
            <article className="feature-card green">
              <span>05</span><h2>Complete learning arc</h2><p>All five days are available with saved slide and day progress.</p><button onClick={() => navigate("learn")}>Open lessons →</button>
            </article>
            <article className="feature-card purple">
              <span>AI</span><h2>AI Lab</h2><p>Ask questions, improve prompts, attach a document, and keep every conversation.</p><button onClick={openGeneralAI}>Open AI Lab →</button>
            </article>
            <article className="feature-card pink">
              <span>03</span><h2>Camp Games</h2><p>Hardware quiz, AI quiz, and a five-part debugging challenge with saved best scores.</p><button onClick={() => navigate("games")}>Play games →</button>
            </article>
          </section>
          {teacherSettings.showLegacyCamp && <button className="legacy-callout" onClick={() => navigate("legacy")}><strong>Need the original camp?</strong><span>Open the preserved Full Camp with its remaining legacy modules.</span><b>Open Full Camp →</b></button>}
        </main>
      )}

      {view === "learn" && currentSlide && (
        <main className={`camp-page lesson-layout ${presenterMode ? "presenter-mode" : ""}`}>
          <aside className="lesson-sidebar">
            <p className="camp-eyebrow">FIVE-DAY ARC</p>
            {campDays.map((day) => (
              <button
                key={day.number}
                className={`${selectedDay === day.number ? "active" : ""} ${progress.completedDays.includes(day.number) ? "complete" : ""}`}
                aria-current={selectedDay === day.number ? "step" : undefined}
                onClick={() => selectDay(day.number)}
              >
                <span>DAY {day.number}</span>{day.title}
                <small>{progress.completedDays.includes(day.number) ? "Complete ✓" : day.subtitle}</small>
              </button>
            ))}
          </aside>
          <section className="lesson-stage">
            <p className="visually-hidden">Use Left Arrow or Page Up for the previous slide. Use Right Arrow or Page Down for the next slide.</p>
            <header>
              <div><p className="camp-eyebrow">DAY {currentDay.number} · {currentDay.title.toUpperCase()}</p><h1>{currentSlide.title}</h1></div>
              <div className="lesson-header-actions"><strong>{slideIndex + 1} / {currentDay.slides.length}</strong><button className="camp-secondary presenter-toggle" aria-pressed={presenterMode} onClick={togglePresenterMode}>{presenterMode ? "Exit presenter" : "Presenter mode"}</button></div>
            </header>
            <div className={`lesson-slide tone-${currentSlide.tone}`} aria-live="polite" aria-atomic="true">
              {currentSlide.icon && <div className="slide-icon">{currentSlide.icon}</div>}
              {currentSlide.kicker && <p className="slide-kicker">{currentSlide.kicker}</p>}
              <h2>{currentSlide.heading}</h2>
              {currentSlide.body && <p className="slide-body">{currentSlide.body}</p>}
              {currentSlide.bullets && <ul>{currentSlide.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
              {currentSlide.cards && <div className="component-grid">{currentSlide.cards.map((card) => <article key={card.title}><span>{card.icon}</span><h3>{card.title}</h3><p>{card.text}</p></article>)}</div>}
            </div>
            <footer className="lesson-controls">
              <button className="camp-secondary" onClick={() => goToSlide(slideIndex - 1)} disabled={slideIndex === 0}>← Previous</button>
              <div className="slide-dots">{slideDots.map((dot, index) => <button key={dot.id} className={`${dot.active ? "active" : ""} ${dot.visited ? "visited" : ""}`} aria-current={dot.active ? "step" : undefined} onClick={() => goToSlide(index)} aria-label={`Go to slide ${index + 1}`} />)}</div>
              {slideIndex < currentDay.slides.length - 1 ? (
                <button className="camp-primary" onClick={() => goToSlide(slideIndex + 1)}>Next →</button>
              ) : (
                <button className="camp-primary" onClick={completeCurrentDay}>{currentDayDone ? "Day complete ✓" : `Mark Day ${selectedDay} complete`}</button>
              )}
            </footer>
          </section>
        </main>
      )}

      {view === "ai" && (
        <main className="camp-page embedded-feature">
          <ChatPanel
            key={resumeSessionId ?? aiLaunchId}
            prompt={aiPrompt}
            onBack={() => navigate("home")}
            surface="assistant"
            initialMessage={resumeSessionId ? undefined : aiInitialMessage}
            messagePreamble={aiPrompt.id === CODE_COACH_PROMPT.id ? CODE_COACH_PREAMBLE : CAMP_PREAMBLE}
            resumeSessionId={resumeSessionId}
          />
        </main>
      )}

      {view === "games" && <main className="camp-page"><GamesPanel /></main>}

      {view === "activities" && <main className="camp-page"><ActivitiesPanel onCoach={openActivityCoach} onBuild={() => navigate("build")} /></main>}

      {view === "build" && <main className="camp-page"><BuildLab onAskCoach={openCodeCoach} /></main>}

      {view === "history" && (
        <main className="camp-page embedded-feature">
          {historyReady ? <HistoryPanel onBack={() => navigate("home")} onResumeSession={resumeSession} /> : <p className="loading-card">Loading local history…</p>}
        </main>
      )}

      {view === "teacher" && <main className="camp-page"><TeacherPanel onSettingsChanged={setTeacherSettings} /></main>}

      {view === "settings" && <main className="camp-page embedded-feature"><SettingsPanel onDone={() => navigate("home")} /></main>}

      {view === "legacy" && (
        <main className="legacy-shell">
          <div className="legacy-banner"><strong>Full interactive camp</strong><span>The complete curriculum, activities, games, and Build Lab remain available while each module is migrated into the desktop shell.</span></div>
          <iframe title="Complete REACT Camp curriculum" src="/legacy/curriculum.html" sandbox="allow-scripts allow-forms allow-downloads" />
        </main>
      )}
      </div>
    </div>
  );
}

export default App;
