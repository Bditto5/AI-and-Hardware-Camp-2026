export interface CampProgress {
  schemaVersion: 1;
  completedDays: number[];
  lastSlideByDay: Record<number, number>;
  updatedAt: number;
}

const STORAGE_KEY = "react-camp-progress-v1";

function emptyProgress(): CampProgress {
  return { schemaVersion: 1, completedDays: [], lastSlideByDay: {}, updatedAt: Date.now() };
}

export function loadCampProgress(): CampProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<CampProgress>;
    return {
      schemaVersion: 1,
      completedDays: Array.isArray(parsed.completedDays) ? parsed.completedDays.filter(Number.isInteger) : [],
      lastSlideByDay: parsed.lastSlideByDay && typeof parsed.lastSlideByDay === "object" ? parsed.lastSlideByDay : {},
      updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : Date.now(),
    };
  } catch {
    return emptyProgress();
  }
}

function save(progress: CampProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...progress, updatedAt: Date.now() }));
}

export function saveLastSlide(day: number, slideIndex: number): void {
  const progress = loadCampProgress();
  save({ ...progress, lastSlideByDay: { ...progress.lastSlideByDay, [day]: slideIndex } });
}

export function markDayComplete(day: number): void {
  const progress = loadCampProgress();
  if (!progress.completedDays.includes(day)) progress.completedDays.push(day);
  save({ ...progress, completedDays: [...progress.completedDays].sort((a, b) => a - b) });
}

export function getNextIncompleteDay(progress: CampProgress, totalDays = 5): number {
  for (let day = 1; day <= totalDays; day += 1) {
    if (!progress.completedDays.includes(day)) return day;
  }
  return totalDays;
}
