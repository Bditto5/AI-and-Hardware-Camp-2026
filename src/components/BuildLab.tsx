import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { sendChat } from "../api/ollama";
import { buildTemplates } from "../content/buildTemplates";
import {
  buildPreviewDocument,
  createProjectFromTemplate,
  duplicateProject,
  ensureProjects,
  getActiveProjectId,
  saveProjects,
  setActiveProjectId,
  withSnapshot,
  parseProjectFile,
  type CodeProject,
  type CodeSnapshot,
} from "../storage/projectStore";
import {
  applyCodeSuggestion,
  changedSuggestionTargets,
  parseCodeSuggestion,
  type CodeSuggestion,
  type CodeSuggestionTarget,
} from "../utils/codeSuggestion";

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
  const [projectMessage, setProjectMessage] = useState("");
  const [coachState, setCoachState] = useState<"idle" | "asking" | "ready" | "error">("idle");
  const [coachError, setCoachError] = useState("");
  const [suggestion, setSuggestion] = useState<CodeSuggestion | null>(null);
  const [suggestionTargets, setSuggestionTargets] = useState<CodeSuggestionTarget[]>([]);
  const [reviewTab, setReviewTab] = useState<CodeSuggestionTarget>("html");

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
    if (!window.confirm(`Delete "${project.name}"? Export it first if you may need it later.`)) return;
    const remaining = projects.filter((item) => item.id !== project.id);
    const next = remaining.length > 0 ? remaining : [createProjectFromTemplate()];
    saveProjects(next);
    setProjects(next);
    setProject(next[0]);
    setActiveProjectId(next[0].id);
    setPreview(buildPreviewDocument(next[0]));
  }

  function duplicateCurrentProject() {
    const created = duplicateProject(project);
    const next = [...projects, created];
    setProjects(next);
    saveProjects(next);
    setActiveProjectId(created.id);
    setProject(created);
    setPreview(buildPreviewDocument(created));
    setProjectMessage("Project duplicated with its recovery snapshots.");
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
    if (!window.confirm(`Restore "${snapshot.name}"? A recovery snapshot of the current code will be created first.`)) return;
    const protectedProject = withSnapshot(project, "Before restore");
    setProject({ ...protectedProject, html: snapshot.html, css: snapshot.css, javascript: snapshot.javascript, updatedAt: Date.now() });
    setPreview(buildPreviewDocument(snapshot));
    setProjectMessage("Snapshot restored. The previous code is saved as Before restore.");
  }


  function deleteSnapshot(snapshotId: string) {
    setProject((current) => ({ ...current, snapshots: current.snapshots.filter((item) => item.id !== snapshotId), updatedAt: Date.now() }));
    setProjectMessage("Snapshot removed.");
  }

  function exportProject() {
    const documentText = buildPreviewDocument(project);
    const blob = new Blob([documentText], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${safeFileName(project.name)}.html`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportProjectFile() {
    const payload = JSON.stringify({ format: "react-camp-project", schemaVersion: 1, exportedAt: new Date().toISOString(), project }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${safeFileName(project.name)}.react-camp.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setProjectMessage("Portable project file downloaded.");
  }

  async function importProjectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const imported = parseProjectFile(await file.text());
      const next = [...projects, imported];
      setProjects(next);
      saveProjects(next);
      setActiveProjectId(imported.id);
      setProject(imported);
      setPreview(buildPreviewDocument(imported));
      setProjectMessage(`Imported ${imported.name}.`);
    } catch (error) {
      setProjectMessage(error instanceof Error ? error.message : "The project could not be imported.");
    }
  }

  function askCoach() {
    const message = `${coachQuestion.trim()}\n\nProject: ${project.name}\n\nHTML:\n\`\`\`html\n${project.html}\n\`\`\`\n\nCSS:\n\`\`\`css\n${project.css}\n\`\`\`\n\nJavaScript:\n\`\`\`javascript\n${project.javascript}\n\`\`\``;
    onAskCoach(message.slice(0, 24_000));
  }

  async function requestCodeSuggestion() {
    const question = coachQuestion.trim();
    if (!question || coachState === "asking") return;
    setCoachState("asking");
    setCoachError("");
    setSuggestion(null);
    setSuggestionTargets([]);

    const instruction = `You are a safe beginner HTML/CSS/JavaScript code coach for students ages 13-18.
Review the project below and make one small, testable improvement that answers the student's request.
Do not add network requests, external assets, local file access, browser storage, popups, downloads, or navigation.
Return ONLY one valid JSON object. Do not put it in a Markdown code fence.
Use this exact shape:
{"summary":"short title","explanation":"what changed and why","html":"complete replacement HTML or omit","css":"complete replacement CSS or omit","javascript":"complete replacement JavaScript or omit"}
Include only files that need to change, but each included value must contain the complete replacement file.

Student request: ${question}

Project name: ${project.name}

HTML:
${project.html}

CSS:
${project.css}

JavaScript:
${project.javascript}`;

    const result = await sendChat([{ role: "user", content: instruction.slice(0, 24_000) }]);
    if (!result.ok) {
      setCoachState("error");
      setCoachError(result.message);
      return;
    }

    try {
      const parsed = parseCodeSuggestion(result.value);
      const changed = changedSuggestionTargets(project, parsed);
      if (changed.length === 0) throw new Error("The coach did not propose a code change. Try a more specific request.");
      setSuggestion(parsed);
      setSuggestionTargets(changed);
      setReviewTab(changed[0]);
      setCoachState("ready");
    } catch (error) {
      setCoachState("error");
      setCoachError(error instanceof Error ? error.message : "The suggestion could not be reviewed safely.");
    }
  }

  function toggleSuggestionTarget(target: CodeSuggestionTarget) {
    setSuggestionTargets((current) => current.includes(target)
      ? current.filter((item) => item !== target)
      : [...current, target]);
  }

  function previewSuggestion() {
    if (!suggestion) return;
    const proposed = applyCodeSuggestion(project, suggestion, suggestionTargets);
    setPreview(buildPreviewDocument(proposed));
    setProjectMessage("Showing the selected AI changes in the safe preview. Your saved code has not changed.");
  }

  function applySuggestion() {
    if (!suggestion || suggestionTargets.length === 0) return;
    const protectedProject = withSnapshot(project, "Before AI suggestion");
    const next = applyCodeSuggestion(protectedProject, suggestion, suggestionTargets);
    setProject(next);
    setPreview(buildPreviewDocument(next));
    setSuggestion(null);
    setSuggestionTargets([]);
    setCoachState("idle");
    setProjectMessage("AI suggestion applied. Your previous code is saved as Before AI suggestion.");
  }

  function discardSuggestion() {
    setSuggestion(null);
    setSuggestionTargets([]);
    setCoachState("idle");
    setCoachError("");
    setPreview(buildPreviewDocument(project));
    setProjectMessage("AI suggestion discarded. Your project was not changed.");
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
        <button onClick={duplicateCurrentProject}>Duplicate current</button>
        <button onClick={exportProjectFile}>Export project</button>
        <label className="build-import-button">Import project<input type="file" accept="application/json,.json" onChange={(event) => void importProjectFile(event)} /></label>
        <button className="danger-link" onClick={deleteProject}>Delete current</button>
      </div>
      {projectMessage && <p className="build-project-message" role="status">{projectMessage}</p>}

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
            {project.snapshots.length === 0 ? <span>No snapshots yet.</span> : [...project.snapshots].reverse().map((snapshot) => <div className="snapshot-entry" key={snapshot.id}><button onClick={() => restoreSnapshot(snapshot)}><strong>{snapshot.name}</strong><small>{new Date(snapshot.createdAt).toLocaleString()}</small></button><button className="snapshot-delete" onClick={() => deleteSnapshot(snapshot.id)} aria-label={`Delete snapshot ${snapshot.name}`}>×</button></div>)}
          </div>
        </section>
        <section className="code-coach-panel">
          <h2>Local AI code coach</h2>
          <p>Ask for a reviewable change, preview it safely, then choose which files to apply. Nothing changes automatically.</p>
          <textarea value={coachQuestion} onChange={(event) => setCoachQuestion(event.target.value)} aria-label="Question for code coach" />
          <div className="code-coach-actions">
            <button className="camp-primary" onClick={() => void requestCodeSuggestion()} disabled={!coachQuestion.trim() || coachState === "asking"}>{coachState === "asking" ? "Reviewing locallyâ€¦" : "Get reviewable change"}</button>
            <button className="camp-secondary" onClick={askCoach} disabled={!coachQuestion.trim() || coachState === "asking"}>Open full chat</button>
          </div>
          {coachError && <p className="code-coach-error" role="alert">{coachError}</p>}
        </section>
      </div>

      {suggestion && (
        <section className="code-suggestion-panel" aria-label="AI code suggestion review">
          <header>
            <div><p className="camp-eyebrow">REVIEW BEFORE APPLY</p><h2>{suggestion.summary}</h2><p>{suggestion.explanation}</p></div>
            <div className="code-suggestion-actions">
              <button className="camp-secondary" onClick={previewSuggestion} disabled={suggestionTargets.length === 0}>Preview selected</button>
              <button className="camp-primary" onClick={applySuggestion} disabled={suggestionTargets.length === 0}>Apply selected</button>
              <button className="danger-link" onClick={discardSuggestion}>Discard</button>
            </div>
          </header>
          <div className="code-suggestion-files">
            {changedSuggestionTargets(project, suggestion).map((target) => (
              <label key={target} className={reviewTab === target ? "active" : ""}>
                <input type="checkbox" checked={suggestionTargets.includes(target)} onChange={() => toggleSuggestionTarget(target)} />
                <button type="button" onClick={() => setReviewTab(target)}>{target === "javascript" ? "JavaScript" : target.toUpperCase()}</button>
              </label>
            ))}
          </div>
          <div className="code-suggestion-compare">
            <label><span>Current {reviewTab}</span><textarea readOnly value={project[reviewTab]} /></label>
            <label><span>Proposed {reviewTab}</span><textarea readOnly value={suggestion[reviewTab] ?? project[reviewTab]} /></label>
          </div>
          <p className="code-suggestion-safety">Applying creates a “Before AI suggestion” recovery snapshot first. Always test the result and be ready to explain what changed.</p>
        </section>
      )}
    </div>
  );
}
