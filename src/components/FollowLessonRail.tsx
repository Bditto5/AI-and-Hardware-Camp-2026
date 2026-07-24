import type { FollowLesson } from "../content/followLessons";
import type { FollowTrack, FollowTrackId } from "../content/followTracks";
import type { FollowProgress } from "../storage/followProgressStore";

interface FollowLessonRailProps {
  lessons: FollowLesson[];
  tracks: FollowTrack[];
  query: string;
  onQueryChange: (value: string) => void;
  track: "all" | FollowTrackId;
  onTrackChange: (value: "all" | FollowTrackId) => void;
  selectedLessonId: string;
  onSelectLesson: (id: string) => void;
  progress: FollowProgress;
}

function trackLabel(tracks: FollowTrack[], id: FollowTrackId): string {
  return tracks.find((item) => item.id === id)?.label ?? id;
}

export function FollowLessonRail({
  lessons,
  tracks,
  query,
  onQueryChange,
  track,
  onTrackChange,
  selectedLessonId,
  onSelectLesson,
  progress,
}: FollowLessonRailProps) {
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = lessons.filter((lesson) => {
    if (track !== "all" && lesson.track !== track) return false;
    if (!normalizedQuery) return true;
    const haystack = `${lesson.title} ${trackLabel(tracks, lesson.track)}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  return (
    <aside className="follow-lesson-rail">
      <p className="camp-eyebrow">FOLLOW ALONG</p>
      <input
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search lessons…"
        aria-label="Search lessons"
        className="follow-lesson-search"
      />
      <div className="follow-track-filters" role="group" aria-label="Filter by track">
        <button className={track === "all" ? "active" : ""} onClick={() => onTrackChange("all")}>
          All
        </button>
        {tracks.map((item) => (
          <button key={item.id} className={track === item.id ? "active" : ""} onClick={() => onTrackChange(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="follow-lesson-list">
        {filtered.length === 0 && <p className="follow-lesson-empty">No lessons match your search yet.</p>}
        {filtered.map((lesson) => {
          const isDone = progress.finishedLessons.includes(lesson.id);
          return (
            <button
              key={lesson.id}
              className={`follow-lesson-item ${selectedLessonId === lesson.id ? "active" : ""}`}
              aria-current={selectedLessonId === lesson.id ? "page" : undefined}
              onClick={() => onSelectLesson(lesson.id)}
            >
              <span className={`follow-lesson-dot ${isDone ? "done" : ""}`} aria-hidden="true" />
              <span className="follow-lesson-item-text">
                <strong>{lesson.title}</strong>
                <small>
                  {trackLabel(tracks, lesson.track)} · {lesson.duration}
                </small>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
