import {
  clearHistoryData,
  exportHistoryData,
  restoreHistoryData,
  type HistoryBackupData,
} from "./historyStore";

const PIN_KEY = "react-camp-teacher-pin-v1";
const SETTINGS_KEY = "react-camp-teacher-settings-v1";

const BACKUP_KEYS = [
  "react-camp-progress-v1",
  "react-camp-activity-progress-v1",
  "react-camp-game-scores-v1",
  "react-camp-code-projects-v1",
  "react-camp-active-code-project-v1",
  "react-camp-teacher-pin-v1",
  "react-camp-teacher-settings-v1",
  "educatorllm-personalization-v1",
  "anythingllm-settings-v1",
  "educatorllm-anythingllm-settings-v1",
] as const;

const PROGRESS_KEYS = [
  "react-camp-progress-v1",
  "react-camp-activity-progress-v1",
  "react-camp-game-scores-v1",
] as const;

const PROJECT_KEYS = ["react-camp-code-projects-v1", "react-camp-active-code-project-v1"] as const;

export interface TeacherSettings {
  aiEnabled: boolean;
  buildEnabled: boolean;
  showLegacyCamp: boolean;
}

export interface CampBackupBundle {
  format: "react-camp-backup";
  schemaVersion: 1;
  createdAt: string;
  appVersion: string;
  localStorage: Record<string, string>;
  history: HistoryBackupData;
}

export function loadTeacherSettings(): TeacherSettings {
  try {
    const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "{}") as Partial<TeacherSettings>;
    return {
      aiEnabled: parsed.aiEnabled !== false,
      buildEnabled: parsed.buildEnabled !== false,
      showLegacyCamp: parsed.showLegacyCamp !== false,
    };
  } catch {
    return { aiEnabled: true, buildEnabled: true, showLegacyCamp: true };
  }
}

export function saveTeacherSettings(settings: TeacherSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function verifyTeacherPin(pin: string): boolean {
  return pin === (localStorage.getItem(PIN_KEY) ?? "2026");
}

export function saveTeacherPin(pin: string): void {
  if (!/^\d{4,8}$/.test(pin)) throw new Error("Use a 4 to 8 digit access code.");
  localStorage.setItem(PIN_KEY, pin);
}

export async function createCampBackup(): Promise<CampBackupBundle> {
  const values: Record<string, string> = {};
  for (const key of BACKUP_KEYS) {
    const value = localStorage.getItem(key);
    if (value !== null) values[key] = value;
  }
  return {
    format: "react-camp-backup",
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    appVersion: "0.4.0",
    localStorage: values,
    history: await exportHistoryData(),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export function parseCampBackup(text: string): CampBackupBundle {
  const value = JSON.parse(text) as unknown;
  if (!isRecord(value) || value.format !== "react-camp-backup" || value.schemaVersion !== 1) {
    throw new Error("This is not a supported REACT Camp backup.");
  }
  if (!isRecord(value.localStorage) || !isRecord(value.history)) throw new Error("The backup is incomplete.");
  const history = value.history;
  for (const key of ["sessionSummaries", "sessionBodies", "projects", "savedFiles"]) {
    if (!Array.isArray(history[key])) throw new Error("The backup history is incomplete.");
  }
  return value as unknown as CampBackupBundle;
}

export async function restoreCampBackup(bundle: CampBackupBundle): Promise<void> {
  for (const key of BACKUP_KEYS) localStorage.removeItem(key);
  for (const key of BACKUP_KEYS) {
    const value = bundle.localStorage[key];
    if (typeof value === "string") localStorage.setItem(key, value);
  }
  await restoreHistoryData(bundle.history);
}

export function resetCampProgress(): void {
  for (const key of PROGRESS_KEYS) localStorage.removeItem(key);
}

export function resetCodeProjects(): void {
  for (const key of PROJECT_KEYS) localStorage.removeItem(key);
}

export async function resetAllCampData(): Promise<void> {
  for (const key of BACKUP_KEYS) localStorage.removeItem(key);
  await clearHistoryData();
}
