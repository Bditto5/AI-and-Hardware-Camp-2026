import { useMemo, useState } from "react";
import { campActivities, type ActivityCategory } from "../content/activities";

const COMPLETED_KEY = "react-camp-activity-progress-v1";

function loadCompleted(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(COMPLETED_KEY) ?? "[]") as unknown;
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

interface ActivitiesPanelProps {
  onCoach: (prompt: string) => void;
  onBuild: () => void;
}

export function ActivitiesPanel({ onCoach, onBuild }: ActivitiesPanelProps) {
  const [filter, setFilter] = useState<"all" | ActivityCategory>("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => loadCompleted());

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
