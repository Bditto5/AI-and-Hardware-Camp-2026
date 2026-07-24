import { followLessons } from "../content/followLessons";

export interface FollowProgress {
  schemaVersion: 1;
  completedSteps: Record<string, string[]>;
  finishedLessons: string[];
  lastLessonId: string | null;
  lastStepByLesson: Record<string, string>;
  updatedAt: number;
}

const STORAGE_KEY = "react-camp-follow-v1";

function emptyProgress(): FollowProgress {
  return {
    schemaVersion: 1,
    completedSteps: {},
    finishedLessons: [],
    lastLessonId: null,
    lastStepByLesson: {},
    updatedAt: Date.now(),
  };
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isStringRecordOfArrays(value: unknown): value is Record<string, string[]> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.values(value).every(isStringArray);
}

function isStringRecord(value: unknown): value is Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.values(value).every((item) => typeof item === "string");
}

export function loadFollowProgress(): FollowProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<FollowProgress>;
    return {
      schemaVersion: 1,
      completedSteps: isStringRecordOfArrays(parsed.completedSteps) ? parsed.completedSteps : {},
      finishedLessons: isStringArray(parsed.finishedLessons) ? parsed.finishedLessons : [],
      lastLessonId: typeof parsed.lastLessonId === "string" ? parsed.lastLessonId : null,
      lastStepByLesson: isStringRecord(parsed.lastStepByLesson) ? parsed.lastStepByLesson : {},
      updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : Date.now(),
    };
  } catch {
    return emptyProgress();
  }
}

function save(progress: FollowProgress): FollowProgress {
  const next = { ...progress, updatedAt: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function toggleStep(lessonId: string, stepId: string): FollowProgress {
  const progress = loadFollowProgress();
  const current = progress.completedSteps[lessonId] ?? [];
  const isDone = current.includes(stepId);
  const nextForLesson = isDone ? current.filter((id) => id !== stepId) : [...current, stepId];
  return save({
    ...progress,
    completedSteps: { ...progress.completedSteps, [lessonId]: nextForLesson },
    lastLessonId: lessonId,
    lastStepByLesson: { ...progress.lastStepByLesson, [lessonId]: stepId },
  });
}

export function markLessonFinished(lessonId: string): FollowProgress {
  const progress = loadFollowProgress();
  if (progress.finishedLessons.includes(lessonId)) return progress;
  return save({ ...progress, finishedLessons: [...progress.finishedLessons, lessonId] });
}

export function nextIncompleteStep(lessonId: string): string | null {
  const lesson = followLessons.find((item) => item.id === lessonId);
  if (!lesson) return null;
  const progress = loadFollowProgress();
  const done = progress.completedSteps[lessonId] ?? [];
  const next = lesson.steps.find((step) => !done.includes(step.id));
  return next?.id ?? lesson.steps[lesson.steps.length - 1]?.id ?? null;
}

export function resetFollowProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
