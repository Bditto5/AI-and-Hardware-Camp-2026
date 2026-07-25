import { useEffect, useMemo, useState } from "react";
import { campActivities, type ActivityCategory } from "../content/activities";

const COMPLETED_KEY = "react-camp-activity-progress-v1";
const ANSWERS_KEY = "react-camp-activity-answers-v1";

function loadCompleted(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(COMPLETED_KEY) ?? "[]") as unknown;
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function loadAnswers(): Record<string, string> {
  try {
    const value = JSON.parse(localStorage.getItem(ANSWERS_KEY) ?? "{}") as unknown;
    if (typeof value !== "object" || value === null || Array.isArray(value)) return {};
    const entries = Object.entries(value as Record<string, unknown>).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    );
    return Object.fromEntries(entries);
  } catch {
    return {};
  }
}

export interface PendingActivity {
  id: string;
  nonce: number;
}

interface ActivitiesPanelProps {
  onCoach: (prompt: string) => void;
  onBuild: () => void;
  /** Pre-expands this activity whenever it changes (by nonce), not just on first mount — ActivitiesPanel may already be mounted when a new selection arrives. Absent by default — no change to normal behavior. */
  initialActivityId?: PendingActivity;
}

export function ActivitiesPanel({ onCoach, onBuild, initialActivityId }: ActivitiesPanelProps) {
  const [filter, setFilter] = useState<"all" | ActivityCategory>("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(() => initialActivityId?.id ?? null);
  const [completed, setCompleted] = useState<string[]>(() => loadCompleted());
  const [answers, setAnswers] = useState<Record<string, string>>(() => loadAnswers());

  useEffect(() => {
    if (initialActivityId) setExpanded(initialActivityId.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialActivityId?.nonce]);

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return campActivities.filter((activity) => {
      if (filter !== "all" && activity.category !== filter) return false;
      if (!normalized) return true;
      return `${activity.title} ${activity.description} ${activity.difficulty}`.toLowerCase().includes(normalized);
    });
  }, [filter, query]);

  function toggleComplete(id: string) {
    const next = completed.includes(id) ? completed.filter((item) => item !== id) : [...completed, id];
    setCompleted(next);
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(next));
  }

  function updateAnswer(id: string, text: string) {
    const next = { ...answers, [id]: text };
    setAnswers(next);
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(next));
  }

  return (
    <div className="activities-page">
      <header className="activities-heading">
        <div><p className="camp-eyebrow">HANDS-ON PRACTICE</p><h1>Activities</h1><p>Complete the work, check the evidence, and teach it back.</p></div>
        <div className="activity-total"><strong>{completed.length}</strong><span>of {campActivities.length} complete</span></div>
      </header>
      <div className="activity-toolbar">
        <div className="activity-filters">
          {(["all", "hardware", "ai", "build"] as const).map((category) => <button key={category} className={filter === category ? "active" : ""} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category === "all" ? "All" : category === "ai" ? "AI" : category[0].toUpperCase() + category.slice(1)}</button>)}
        </div>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search activities" aria-label="Search activities" />
      </div>
      <div className="activity-list">
        {visible.map((activity) => {
          const isExpanded = expanded === activity.id;
          const isComplete = completed.includes(activity.id);
          return (
            <article key={activity.id} className={`native-activity ${isExpanded ? "expanded" : ""} ${isComplete ? "complete" : ""}`}>
              <button className="activity-summary" aria-expanded={isExpanded} aria-controls={`activity-details-${activity.id}`} onClick={() => setExpanded(isExpanded ? null : activity.id)}>
                <span className={`activity-category ${activity.category}`}>{activity.category === "hardware" ? "HW" : activity.category === "ai" ? "AI" : "CODE"}</span>
                <span className="activity-title"><strong>{activity.title}</strong><small>{activity.difficulty} · {activity.duration}</small></span>
                <span className="activity-state">{isComplete ? "Complete ✓" : isExpanded ? "Close" : "Open"}</span>
              </button>
              {isExpanded && (
                <div className="activity-details" id={`activity-details-${activity.id}`}>
                  <p className="activity-description">{activity.description}</p>
                  {activity.safety && <p className="activity-safety"><strong>Safety:</strong> {activity.safety}</p>}
                  <ol>{activity.steps.map((step) => <li key={step}>{step}</li>)}</ol>
                  <label className="activity-answer">
                    <span>Your answer / notes</span>
                    <textarea
                      value={answers[activity.id] ?? ""}
                      onChange={(event) => updateAnswer(activity.id, event.target.value)}
                      placeholder="Write your observations, recommendation, or notes for this activity here."
                      rows={4}
                    />
                  </label>
                  <div className="activity-actions">
                    {activity.category === "build" && <button className="camp-secondary" onClick={onBuild}>Open Build Lab</button>}
                    {activity.coachPrompt && <button className="camp-secondary" onClick={() => onCoach(activity.coachPrompt ?? "")}>Ask AI Coach</button>}
                    <button className="camp-primary" onClick={() => toggleComplete(activity.id)}>{isComplete ? "Mark incomplete" : "Mark complete"}</button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
      {visible.length === 0 && <p className="empty-activities">No activities match that search.</p>}
    </div>
  );
}
