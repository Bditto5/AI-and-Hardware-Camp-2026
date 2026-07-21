import { useEffect, useMemo, useState } from "react";
import { buildTemplates } from "../content/buildTemplates";
import {
  buildPreviewDocument,
  createProjectFromTemplate,
  ensureProjects,
  getActiveProjectId,
  saveProjects,
  setActiveProjectId,
  withSnapshot,
  type CodeProject,
  type CodeSnapshot,
} from "../storage/projectStore";

type EditorTab = "html" | "css" | "javascript";

interface BuildLabProps {
  onAskCoach: (message: string) => void;
}

function pickInitialProject(projects: CodeProject[]): CodeProject {
  const activeId = getActiveProjectId();
  return projects.find((project) => project.id === activeId) ?? projects[0] ?? createProjectFromTemplate();
}

function safeFileName(name: string): string {
  return name.trim().replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "") || "react-camp-project";
}

export function BuildLab({ onAskCoach }: BuildLabProps) {
  const initialProjects = useMemo(() => ensureProjects(), []);
  const [projects, setProjects] = useState<CodeProject[]>(initialProjects);
  const [project, setProject] = useState<CodeProject>(() => pickInitialProject(initialProjects));
  const [tab, setTab] = useState<EditorTab>("html");
  const [preview, setPreview] = useState(() => buildPreviewDocument(pickInitialProject(initialProjects)));
  const [saveState, setSaveState] = useState<"saved" | "saving">("saved");
  const [snapshotName, setSnapshotName] = useState("");
  const [coachQuestion, setCoachQuestion] = useState("Help me improve this project. First explain one issue or opportunity, then give one small change to try.");

  useEffect(() => {
    setSaveState("saving");
    const timer = window.setTimeout(() => {
      const savedProject = { ...project, updatedAt: Date.now() };
      setProjects((current) => {
        const next = current.map((item) => item.id === savedProject.id ? savedProject : item);
        saveProjects(next);
        return next;
      });
      setSaveState("saved");
    }, 500);
    return () => window.clearTimeout(timer);
  }, [project]);

  function selectProject(id: string) {
    const selected = projects.find((item) => item.id === id);
    if (!selected) return;
    setActiveProjectId(id);
    setProject(selected);
    setPreview(buildPreviewDocument(selected));
  }

  function createProject(templateId: string) {
    const created = createProjectFromTemplate(templateId);
    const next = [...projects, created];
    setProjects(next);
    saveProjects(next);
    setActiveProjectId(created.id);
    setProject(created);
    setPreview(buildPreviewDocument(created));
  }

  function deleteProject() {
    const remaining = projects.filter((item) => item.id !== project.id);
    const next = remaining.length > 0 ? remaining : [createProjectFromTemplate()];
    saveProjects(next);
    setProjects(next);
    setProject(next[0]);
    setActiveProjectId(next[0].id);
    setPreview(buildPreviewDocument(next[0]));
  }

  function updateCode(value: string) {
    setProject((current) => ({ ...current, [tab]: value }));
  }

  function runPreview() {
    setPreview(buildPreviewDocument(project));
  }

  function createSnapshot() {
    const next = withSnapshot(project, snapshotName);
    setProject(next);
    setSnapshotName("");
  }

  function restoreSnapshot(snapshot: CodeSnapshot) {
    setProject((current) => ({ ...current, html: snapshot.html, css: snapshot.css, javascript: snapshot.javascript, updatedAt: Date.now() }));
    setPreview(buildPreviewDocument(snapshot));
  }

  function exportProject() {
    const documentText = buildPreviewDocument(project);
    const blob = new Blob([documentText], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${safeFileName(project.name)}.html`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function askCoach() {
    const message = `${coachQuestion.trim()}\n\nProject: ${project.name}\n\nHTML:\n\`\`\`html\n${project.html}\n\`\`\`\n\nCSS:\n\`\`\`css\n${project.css}\n\`\`\`\n\nJavaScript:\n\`\`\`javascript\n${project.javascript}\n\`\`\``;
    onAskCoach(message.slice(0, 24_000));
  }

  const editorValue = project[tab];

  return (
    <div className="build-lab-page">
      <header className="build-heading">
        <div><p className="camp-eyebrow">CREATE + TEST + EXPLAIN</p><h1>Build Lab</h1></div>
        <div className="build-project-controls">
          <select value={project.id} onChange={(event) => selectProject(event.target.value)} aria-label="Current code project">
            {projects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <input value={project.name} onChange={(event) => setProject((current) => ({ ...current, name: event.target.value }))} aria-label="Project name" />
          <span className={`autosave-state ${saveState}`}>{saveState === "saved" ? "Saved locally" : "Saving…"}</span>
        </div>
      </header>

      <div className="template-strip">
        <span>New from template:</span>
        {buildTemplates.map((template) => <button key={template.id} onClick={() => createProject(template.id)} title={template.description}>{template.title}</button>)}
        <button className="danger-link" onClick={deleteProject}>Delete current</button>
      </div>

      <div className="build-workspace">
        <section className="editor-panel">
          <nav className="editor-tabs" aria-label="Code editor tabs">
            {(["html", "css", "javascript"] as const).map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item === "javascript" ? "JavaScript" : item.toUpperCase()}</button>)}
          </nav>
          <textarea value={editorValue} onChange={(event) => updateCode(event.target.value)} spellCheck={false} aria-label={`${tab} editor`} />
          <footer>
            <button className="camp-primary" onClick={runPreview}>Run preview</button>
            <button className="camp-secondary" onClick={() => setPreview("")}>Stop preview</button>
            <button className="camp-secondary" onClick={exportProject}>Export HTML</button>
          </footer>
        </section>
        <section className="preview-panel">
          <header><strong>Safe preview</strong><span>Scripts allowed · network blocked</span></header>
          {preview ? <iframe title="Student project preview" srcDoc={preview} sandbox="allow-scripts" /> : <div className="preview-stopped">Preview stopped. Your code is still saved.</div>}
        </section>
      </div>

      <div className="build-tools-row">
        <section className="snapshot-panel">
          <header><div><h2>Snapshots</h2><p>Keep up to ten recovery points.</p></div><div><input value={snapshotName} onChange={(event) => setSnapshotName(event.target.value)} placeholder="Snapshot name" /><button className="camp-secondary" onClick={createSnapshot}>Save snapshot</button></div></header>
          <div className="snapshot-list">
            {project.snapshots.length === 0 ? <span>No snapshots yet.</span> : [...project.snapshots].reverse().map((snapshot) => <button key={snapshot.id} onClick={() => restoreSnapshot(snapshot)}><strong>{snapshot.name}</strong><small>{new Date(snapshot.createdAt).toLocaleString()}</small></button>)}
          </div>
        </section>
        <section className="code-coach-panel">
          <h2>Local AI code coach</h2>
          <p>The coach receives the current HTML, CSS, and JavaScript when you ask. It cannot change your project automatically.</p>
          <textarea value={coachQuestion} onChange={(event) => setCoachQuestion(event.target.value)} aria-label="Question for code coach" />
          <button className="camp-primary" onClick={askCoach} disabled={!coachQuestion.trim()}>Ask with current code</button>
        </section>
      </div>
    </div>
  );
}

