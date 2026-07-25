import { useEffect, useRef, useState } from "react";
import { followLessons } from "../content/followLessons";
import { followTracks } from "../content/followTracks";
import type { FollowTrackId } from "../content/followTracks";
import {
  loadFollowProgress,
  markLessonFinished,
  nextIncompleteStep,
  toggleStep as toggleStepInStore,
  type FollowProgress,
} from "../storage/followProgressStore";
import { FollowLessonRail } from "./FollowLessonRail";
import { FollowStepPanel } from "./FollowStepPanel";

interface FollowAlongProps {
  onAskCoach: (message: string) => void;
  onOpenBuildLab: (templateId?: string, projectName?: string) => void;
}

const NARROW_QUERY = "(max-width: 900px)";

function useIsNarrow(): boolean {
  const [isNarrow, setIsNarrow] = useState(() => (typeof window !== "undefined" ? window.matchMedia(NARROW_QUERY).matches : false));

  useEffect(() => {
    const media = window.matchMedia(NARROW_QUERY);
    const handleChange = () => setIsNarrow(media.matches);
    handleChange();
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return isNarrow;
}

function pickInitialLessonId(progress: FollowProgress): string {
  if (progress.lastLessonId && followLessons.some((lesson) => lesson.id === progress.lastLessonId)) {
    return progress.lastLessonId;
  }
  return followLessons[0].id;
}

export function FollowAlong({ onAskCoach, onOpenBuildLab }: FollowAlongProps) {
  const [progress, setProgress] = useState<FollowProgress>(() => loadFollowProgress());
  const [lessonId, setLessonId] = useState<string>(() => pickInitialLessonId(progress));
  const [stepId, setStepId] = useState<string>(() => nextIncompleteStep(lessonId) ?? followLessons[0].steps[0].id);
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState<"all" | FollowTrackId>("all");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);
  const isNarrow = useIsNarrow();

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const lesson = followLessons.find((item) => item.id === lessonId) ?? followLessons[0];
  const doneStepIds = progress.completedSteps[lesson.id] ?? [];

  function selectLesson(id: string) {
    setLessonId(id);
    setStepId(nextIncompleteStep(id) ?? followLessons.find((item) => item.id === id)?.steps[0]?.id ?? "");
  }

  function selectStep(id: string) {
    setStepId(id);
  }

  function handleToggleStep(targetStepId: string) {
    const nextProgress = toggleStepInStore(lesson.id, targetStepId);
    setProgress(nextProgress);
    const allDone = lesson.steps.every((step) => nextProgress.completedSteps[lesson.id]?.includes(step.id));
    if (allDone) setProgress(markLessonFinished(lesson.id));
  }

  function handleCopy(key: string) {
    if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
    setCopiedKey(key);
    copyTimeoutRef.current = window.setTimeout(() => setCopiedKey(null), 1600);
  }

  return (
    <div className="follow-along">
      <FollowLessonRail
        lessons={followLessons}
        tracks={followTracks}
        query={query}
        onQueryChange={setQuery}
        track={track}
        onTrackChange={setTrack}
        selectedLessonId={lesson.id}
        onSelectLesson={selectLesson}
        progress={progress}
      />

      <section className="follow-content">
        <header className="follow-lesson-header">
          <p className="camp-eyebrow">{lesson.duration} · GUIDED, OFFLINE</p>
          <h1>{lesson.title}</h1>
          <p className="follow-lesson-summary">{lesson.summary}</p>

          <div className="follow-lesson-meta">
            <div>
              <h3>What you'll be able to do</h3>
              <ul>
                {lesson.objectives.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Before you start</h3>
              <ul>
                {lesson.setup.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {lesson.templateId && (
            <button className="camp-primary follow-open-build-lab" onClick={() => onOpenBuildLab(lesson.templateId, lesson.title)}>
              Open in Build Lab →
            </button>
          )}

          {lesson.tools && lesson.tools.length > 0 && (
            <div className="follow-lesson-tools">
              {lesson.tools.map((tool) => (
                <a key={tool.url} className="camp-secondary follow-tool-link" href={tool.url} target="_blank" rel="noreferrer">
                  Open {tool.name} ↗
                </a>
              ))}
            </div>
          )}

          <p className="follow-lesson-source">
            Adapted from{" "}
            <a href={lesson.source.url} target="_blank" rel="noreferrer">
              {lesson.source.name}
            </a>
            .
          </p>
        </header>

        <FollowStepPanel
          lesson={lesson}
          activeStepId={stepId}
          doneStepIds={doneStepIds}
          onSelectStep={selectStep}
          onToggleStep={handleToggleStep}
          copiedKey={copiedKey}
          onCopy={handleCopy}
          onAskCoach={onAskCoach}
          stacked={isNarrow}
        />
      </section>
    </div>
  );
}
