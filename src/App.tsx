import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ChatPanel } from "./components/ChatPanel";
import { HistoryPanel } from "./components/HistoryPanel";
import { SettingsPanel } from "./components/SettingsPanel";
import { GamesPanel } from "./components/GamesPanel";
import { ActivitiesPanel, type PendingActivity } from "./components/ActivitiesPanel";
import { BuildArea, type PendingBuildTab } from "./components/BuildArea";
import { TeacherPanel } from "./components/TeacherPanel";
import { NavMenu } from "./components/NavMenu";
import { checkConnection } from "./api/ollama";
import { initHistoryStore } from "./storage/historyStore";
import type { SessionSummary } from "./storage/types";
import type { Prompt } from "./prompts/schema";
import { campDays } from "./content/campDays";
import { campActivities } from "./content/activities";
import {
  getNextIncompleteDay,
  loadCampProgress,
  markDayComplete,
  saveLastSlide,
  type CampProgress,
} from "./storage/campProgressStore";
import { loadTeacherSettings, type TeacherSettings } from "./storage/teacherStore";

type View = "home" | "learn" | "activities" | "build" | "games" | "history" | "teacher" | "settings" | "legacy";

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

const FOLLOW_COACH_PROMPT: Prompt = {
  id: "react-camp-follow-coach",
  title: "REACT Camp Follow Along Coach",
  description: "A local coach for the Follow Along guided lessons.",
  category: "engagement",
  template: "Describe where you are in the lesson and what you want help with.",
};

const FOLLOW_PREAMBLE = `${CAMP_PREAMBLE}
You are now the Follow Along build coach. Answer in plain language, short sentences, no jargon without a definition. Give runnable HTML/CSS/JavaScript only — no network requests, no external files, no browser storage. End with one sentence the student can say out loud to explain what the code does.`;

const COACH_SPLIT_KEY = "react-camp-coach-split-v1";
const COACH_SPLIT_MIN = 25;
const COACH_SPLIT_MAX = 75;

function loadCoachSplitPercent(): number {
  const raw = Number(localStorage.getItem(COACH_SPLIT_KEY));
  if (!Number.isFinite(raw)) return 50;
  return Math.min(COACH_SPLIT_MAX, Math.max(COACH_SPLIT_MIN, raw));
}

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
  const [pendingActivityId, setPendingActivityId] = useState<PendingActivity | undefined>();
  const [pendingBuildTab, setPendingBuildTab] = useState<PendingBuildTab | undefined>();
  const [coachOpen, setCoachOpen] = useState(false);
  const [coachFullScreen, setCoachFullScreen] = useState(true);
  const [coachMinimized, setCoachMinimized] = useState(false);
  const [coachSplitPercent, setCoachSplitPercent] = useState(() => loadCoachSplitPercent());
  const mainContentRef = useRef<HTMLDivElement>(null);
  const isInitialView = useRef(true);

  const ollamaReadyRef = useRef(false);

  function runOllamaCheck() {
    setOllamaState((current) => (current === "ready" ? current : "checking"));
    void checkConnection().then((result) => {
      if (result.ok) {
        ollamaReadyRef.current = true;
        setOllamaState("ready");
        setOllamaMessage("Ollama and the selected model are ready");
      } else {
        setOllamaState("error");
        setOllamaMessage(result.message);
      }
    });
  }

  useEffect(() => {
    void initHistoryStore().then(() => setHistoryReady(true));
    runOllamaCheck();
    // Ollama is frequently still starting up (fresh install, just logged in) when the app
    // first opens — keep retrying in the background instead of leaving a stale error banner
    // that only a full app restart would clear.
    const retryTimer = window.setInterval(() => {
      if (!ollamaReadyRef.current) runOllamaCheck();
    }, 5_000);
    return () => window.clearInterval(retryTimer);
  }, []);

  useEffect(() => {
    if (isInitialView.current) {
      isInitialView.current = false;
      return;
    }
    window.requestAnimationFrame(() => {
      mainContentRef.current?.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    });
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
    if (next === "build" && !teacherSettings.buildEnabled) {
      setView("teacher");
      return;
    }
    // Switching sections should never leave the new section hidden behind a full-screen coach —
    // drop back to split so both are visible, without closing the conversation.
    if (coachOpen && coachFullScreen) setCoachFullScreen(false);
    setView(next);
  }

  function togglePresenterMode() {
    const next = !presenterMode;
    setPresenterMode(next);
    if (next && !document.fullscreenElement) void document.documentElement.requestFullscreen().catch(() => undefined);
    if (!next && document.fullscreenElement) void document.exitFullscreen();
  }

  function openCoachPanel(prompt: Prompt, message: string | undefined, launchId: string, fullScreen: boolean) {
    if (!teacherSettings.aiEnabled) {
      setView("teacher");
      return;
    }
    setResumeSessionId(undefined);
    setAiPrompt(prompt);
    setAiInitialMessage(message);
    setAiLaunchId(launchId);
    setCoachFullScreen(fullScreen);
    setCoachMinimized(false);
    setCoachOpen(true);
  }

  function closeCoach() {
    setCoachOpen(false);
    setCoachMinimized(false);
  }

  function toggleCoachFullScreen() {
    setCoachFullScreen((current) => !current);
  }

  function minimizeCoach() {
    setCoachMinimized(true);
  }

  function restoreCoach() {
    setCoachMinimized(false);
  }

  function applyDividerPercent(clientX: number) {
    const container = mainContentRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    if (rect.width === 0) return;
    const rawPercent = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.min(COACH_SPLIT_MAX, Math.max(COACH_SPLIT_MIN, rawPercent));
    setCoachSplitPercent(clamped);
  }

  function startDividerDrag(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault();
    const handleMove = (moveEvent: PointerEvent) => applyDividerPercent(moveEvent.clientX);
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      setCoachSplitPercent((current) => {
        localStorage.setItem(COACH_SPLIT_KEY, String(current));
        return current;
      });
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }

  function nudgeDividerByKeyboard(event: ReactKeyboardEvent<HTMLDivElement>) {
    let delta = 0;
    if (event.key === "ArrowLeft") delta = -2;
    else if (event.key === "ArrowRight") delta = 2;
    else return;
    event.preventDefault();
    setCoachSplitPercent((current) => {
      const next = Math.min(COACH_SPLIT_MAX, Math.max(COACH_SPLIT_MIN, current + delta));
      localStorage.setItem(COACH_SPLIT_KEY, String(next));
      return next;
    });
  }

  function openGeneralAI() {
    openCoachPanel(CAMP_PROMPT, undefined, `general-${Date.now()}`, true);
  }

  function openActivityCoach(message: string) {
    openCoachPanel(ACTIVITY_COACH_PROMPT, message, `activity-${Date.now()}`, false);
  }

  function openCodeCoach(message: string) {
    openCoachPanel(CODE_COACH_PROMPT, message, `code-${Date.now()}`, false);
  }

  function openFollowCoach(message: string) {
    openCoachPanel(FOLLOW_COACH_PROMPT, message, `follow-${Date.now()}`, false);
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

  function openDay(day: number) {
    selectDay(day);
    navigate("learn");
  }

  function openActivity(id: string) {
    setPendingActivityId({ id, nonce: Date.now() });
    navigate("activities");
  }

  function openBuildTab(tab: "lab" | "follow") {
    setPendingBuildTab({ tab, nonce: Date.now() });
    navigate("build");
  }

  function openActivitiesOverview() {
    setPendingActivityId(undefined);
    navigate("activities");
  }

  function openBuildOverview() {
    setPendingBuildTab(undefined);
    navigate("build");
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
    setCoachFullScreen(true);
    setCoachMinimized(false);
    setCoachOpen(true);
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
          <NavMenu
            label="Learn"
            active={view === "learn"}
            overviewLabel={progress.completedDays.length === campDays.length ? "Review the camp" : `Continue Day ${nextIncompleteDay}`}
            onOverviewSelect={() => openDay(nextIncompleteDay)}
            items={campDays.map((day) => ({
              key: String(day.number),
              label: `Day ${day.number}: ${day.title}`,
              meta: progress.completedDays.includes(day.number) ? "Complete ✓" : day.subtitle,
              onSelect: () => openDay(day.number),
            }))}
          />
          <NavMenu
            label="Activities"
            active={view === "activities"}
            overviewLabel="Open all activities"
            onOverviewSelect={openActivitiesOverview}
            items={campActivities.map((activity) => ({
              key: activity.id,
              label: activity.title,
              meta: `${activity.difficulty} · ${activity.duration}`,
              onSelect: () => openActivity(activity.id),
            }))}
          />
          <NavMenu
            label="Build"
            active={view === "build"}
            overviewLabel="Open Build"
            onOverviewSelect={openBuildOverview}
            items={[
              { key: "lab", label: "Build Lab", meta: "Code editor, safe preview, snapshots", onSelect: () => openBuildTab("lab") },
              { key: "follow", label: "Follow Along", meta: "Guided outside AI lessons", onSelect: () => openBuildTab("follow") },
            ]}
          />
          <button className={view === "games" ? "active" : ""} aria-current={view === "games" ? "page" : undefined} onClick={() => navigate("games")}>Games</button>
          <button className={coachOpen ? "active" : ""} aria-current={coachOpen ? "page" : undefined} onClick={openGeneralAI}>AI Lab</button>
          <button className={view === "history" ? "active" : ""} aria-current={view === "history" ? "page" : undefined} onClick={() => navigate("history")}>History</button>
          <button className={view === "teacher" ? "active" : ""} aria-current={view === "teacher" ? "page" : undefined} onClick={() => navigate("teacher")}>Teacher</button>
          <button className={view === "settings" ? "active" : ""} onClick={() => navigate("settings")} aria-label="Settings">⚙</button>
        </nav>
        <button
          className={`ollama-pill ollama-${ollamaState}`}
          onClick={runOllamaCheck}
          title={ollamaState === "error" ? `${ollamaMessage} Click to check again.` : ollamaMessage}
          aria-live="polite"
        >
          <span /> {ollamaState === "ready" ? "AI ready" : ollamaState === "checking" ? "Checking AI" : "AI setup — retry"}
        </button>
      </header>

      <div id="camp-main-content" ref={mainContentRef} tabIndex={-1} className={coachOpen ? "has-coach" : ""}>
      <div
        className={`camp-view-pane ${coachOpen && coachFullScreen && !coachMinimized ? "camp-view-pane-hidden" : ""}`}
        style={coachOpen && !coachFullScreen && !coachMinimized ? { flexBasis: `${coachSplitPercent}%` } : undefined}
      >

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

          <section className="camp-section">
            <div className="camp-section-header">
              <div><p className="camp-eyebrow">FIVE-DAY ARC</p><h2>Jump to any day</h2></div>
            </div>
            <div className="camp-days-grid">
              {campDays.map((day) => {
                const isDone = progress.completedDays.includes(day.number);
                return (
                  <button key={day.number} className={`camp-day-card ${isDone ? "complete" : ""}`} onClick={() => openDay(day.number)}>
                    <span className="camp-day-card-label">DAY {day.number}</span>
                    <strong>{day.title}</strong>
                    <small>{isDone ? "Complete ✓" : day.subtitle}</small>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="camp-section">
            <div className="camp-section-header">
              <div><p className="camp-eyebrow">HANDS-ON PRACTICE</p><h2>Jump to any activity</h2></div>
              <button className="camp-secondary" onClick={openActivitiesOverview}>See all →</button>
            </div>
            <div className="camp-activities-grid">
              {campActivities.map((activity) => (
                <button key={activity.id} className="camp-activity-card" onClick={() => openActivity(activity.id)}>
                  <span className={`activity-category ${activity.category}`}>{activity.category === "hardware" ? "HW" : activity.category === "ai" ? "AI" : "CODE"}</span>
                  <span className="camp-activity-card-text"><strong>{activity.title}</strong><small>{activity.difficulty} · {activity.duration}</small></span>
                </button>
              ))}
            </div>
          </section>

          <section className="camp-section">
            <div className="camp-section-header">
              <div><p className="camp-eyebrow">CREATE + TEST + EXPLAIN</p><h2>Build</h2></div>
            </div>
            <div className="camp-grid camp-grid-2">
              <article className="feature-card purple">
                <span>{"</>"}</span><h2>Build Lab</h2><p>Edit HTML, CSS, and JavaScript with a safe live preview, snapshots, and starter templates.</p><button onClick={() => openBuildTab("lab")}>Open Build Lab →</button>
              </article>
              <article className="feature-card green">
                <span>▶</span><h2>Follow Along</h2><p>A guided, offline, step-by-step walkthrough of eight outside AI lessons.</p><button onClick={() => openBuildTab("follow")}>Open Follow Along →</button>
              </article>
            </div>
          </section>

          <section className="camp-grid camp-grid-2">
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

      {view === "games" && <main className="camp-page"><GamesPanel /></main>}

      {view === "activities" && <main className="camp-page"><ActivitiesPanel onCoach={openActivityCoach} onBuild={openBuildOverview} initialActivityId={pendingActivityId} /></main>}

      {view === "build" && <main className="camp-page"><BuildArea onAskCoach={openCodeCoach} onAskFollowCoach={openFollowCoach} initialTab={pendingBuildTab} /></main>}

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

      {coachOpen && !coachFullScreen && !coachMinimized && (
        <div
          className="camp-coach-divider"
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize AI Coach panel"
          aria-valuenow={Math.round(coachSplitPercent)}
          aria-valuemin={COACH_SPLIT_MIN}
          aria-valuemax={COACH_SPLIT_MAX}
          tabIndex={0}
          onPointerDown={startDividerDrag}
          onKeyDown={nudgeDividerByKeyboard}
        />
      )}

      {coachOpen && (
        <div
          className={`camp-coach-pane embedded-feature ${coachFullScreen ? "full-screen" : "split"} ${coachMinimized ? "minimized" : ""}`}
          role="complementary"
          aria-label="AI Coach"
          aria-hidden={coachMinimized}
          style={!coachFullScreen && !coachMinimized ? { flexBasis: `${100 - coachSplitPercent}%` } : undefined}
        >
          <div className="camp-coach-toolbar">
            <button className="camp-coach-minimize" onClick={minimizeCoach}>
              ↘ Hide coach
            </button>
            <button className="camp-coach-toggle" onClick={toggleCoachFullScreen} aria-pressed={coachFullScreen}>
              {coachFullScreen ? "⤢ Split view" : "⛶ Full screen"}
            </button>
          </div>
          <ChatPanel
            key={resumeSessionId ?? aiLaunchId}
            prompt={aiPrompt}
            onBack={closeCoach}
            surface="assistant"
            initialMessage={resumeSessionId ? undefined : aiInitialMessage}
            messagePreamble={
              aiPrompt.id === CODE_COACH_PROMPT.id
                ? CODE_COACH_PREAMBLE
                : aiPrompt.id === FOLLOW_COACH_PROMPT.id
                  ? FOLLOW_PREAMBLE
                  : CAMP_PREAMBLE
            }
            resumeSessionId={resumeSessionId}
          />
        </div>
      )}
      </div>

      {coachOpen && coachMinimized && (
        <button className="camp-coach-reopen" onClick={restoreCoach}>
          💬 AI Coach
        </button>
      )}
    </div>
  );
}

export default App;
