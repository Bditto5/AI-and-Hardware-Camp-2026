import { buildTemplates } from "../content/buildTemplates";

export interface CodeSnapshot {
  id: string;
  name: string;
  createdAt: number;
  html: string;
  css: string;
  javascript: string;
}

export interface CodeProject {
  id: string;
  name: string;
  templateId: string;
  html: string;
  css: string;
  javascript: string;
  createdAt: number;
  updatedAt: number;
  snapshots: CodeSnapshot[];
}

const PROJECTS_KEY = "react-camp-code-projects-v1";
const ACTIVE_KEY = "react-camp-active-code-project-v1";

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isSnapshot(value: unknown): value is CodeSnapshot {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CodeSnapshot>;
  return typeof item.id === "string" && typeof item.name === "string" && typeof item.createdAt === "number" &&
    typeof item.html === "string" && typeof item.css === "string" && typeof item.javascript === "string";
}

export function isCodeProject(value: unknown): value is CodeProject {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CodeProject>;
  return typeof item.id === "string" && typeof item.name === "string" && typeof item.templateId === "string" &&
    typeof item.html === "string" && typeof item.css === "string" && typeof item.javascript === "string" &&
    typeof item.createdAt === "number" && typeof item.updatedAt === "number" && Array.isArray(item.snapshots) &&
    item.snapshots.every(isSnapshot);
}

export function createProjectFromTemplate(templateId = buildTemplates[0]?.id ?? "blank", name?: string): CodeProject {
  const template = buildTemplates.find((item) => item.id === templateId);
  const now = Date.now();
  return {
    id: newId("project"),
    name: name ?? template?.title ?? "Untitled Project",
    templateId,
    html: template?.html ?? "<h1>Hello, REACT Camp!</h1>",
    css: template?.css ?? "body { font-family: system-ui; }",
    javascript: template?.javascript ?? "",
    createdAt: now,
    updatedAt: now,
    snapshots: [],
  };
}

export function loadProjects(): CodeProject[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(PROJECTS_KEY) ?? "[]") as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCodeProject);
  } catch {
    return [];
  }
}

export function ensureProjects(): CodeProject[] {
  const projects = loadProjects();
  if (projects.length > 0) return projects;
  const starter = createProjectFromTemplate();
  saveProjects([starter]);
  setActiveProjectId(starter.id);
  return [starter];
}

export function saveProjects(projects: CodeProject[]): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function getActiveProjectId(): string | null {
  return localStorage.getItem(ACTIVE_KEY);
}

export function setActiveProjectId(id: string): void {
  localStorage.setItem(ACTIVE_KEY, id);
}

export function withSnapshot(project: CodeProject, name: string): CodeProject {
  const snapshot: CodeSnapshot = {
    id: newId("snapshot"),
    name: name.trim() || `Snapshot ${project.snapshots.length + 1}`,
    createdAt: Date.now(),
    html: project.html,
    css: project.css,
    javascript: project.javascript,
  };
  return { ...project, snapshots: [...project.snapshots, snapshot].slice(-10), updatedAt: Date.now() };
}

export function duplicateProject(project: CodeProject): CodeProject {
  const now = Date.now();
  return {
    ...project,
    id: newId("project"),
    name: `${project.name} Copy`,
    createdAt: now,
    updatedAt: now,
    snapshots: project.snapshots.map((snapshot) => ({ ...snapshot, id: newId("snapshot") })),
  };
}

export function parseProjectFile(text: string): CodeProject {
  const parsed = JSON.parse(text) as unknown;
  const candidate = parsed && typeof parsed === "object" && "project" in parsed
    ? (parsed as { project: unknown }).project
    : parsed;
  if (!isCodeProject(candidate)) throw new Error("This is not a supported REACT Camp project file.");
  const now = Date.now();
  return {
    ...candidate,
    id: newId("project"),
    name: `${candidate.name} (Imported)`,
    createdAt: now,
    updatedAt: now,
    snapshots: candidate.snapshots.slice(-10).map((snapshot) => ({ ...snapshot, id: newId("snapshot") })),
  };
}

export function buildPreviewDocument(project: Pick<CodeProject, "html" | "css" | "javascript">): string {
  const safeScript = project.javascript.replace(/<\/script/gi, "<\\/script");
  return `<!doctype html>
<html><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src 'none'; media-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>${project.css}</style></head><body>${project.html}<script>${safeScript}</script></body></html>`;
}
