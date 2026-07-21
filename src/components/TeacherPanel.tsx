import { useEffect, useState, type ChangeEvent } from "react";
import { listSessionSummaries } from "../storage/historyStore";
import { loadCampProgress } from "../storage/campProgressStore";
import { loadProjects } from "../storage/projectStore";
import {
  createCampBackup,
  loadTeacherSettings,
  parseCampBackup,
  resetAllCampData,
  resetCampProgress,
  resetCodeProjects,
  restoreCampBackup,
  saveTeacherPin,
  saveTeacherSettings,
  verifyTeacherPin,
  type TeacherSettings,
} from "../storage/teacherStore";

interface TeacherStats {
  days: number;
  chats: number;
  builds: number;
  activities: number;
}

function activityCount(): number {
  try {
    const value = JSON.parse(localStorage.getItem("react-camp-activity-progress-v1") ?? "[]") as unknown;
    return Array.isArray(value) ? value.length : 0;
  } catch {
    return 0;
  }
}

export function TeacherPanel({ onSettingsChanged }: { onSettingsChanged: (settings: TeacherSettings) => void }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [settings, setSettings] = useState(() => loadTeacherSettings());
  const [message, setMessage] = useState("Enter the teacher access code. The first-use code is 2026.");
  const [stats, setStats] = useState<TeacherStats>({ days: 0, chats: 0, builds: 0, activities: 0 });

  useEffect(() => {
    if (!unlocked) return;
    void listSessionSummaries().then((sessions) => {
      setStats({
        days: loadCampProgress().completedDays.length,
        chats: sessions.filter((item) => item.type === "chat").length,
        builds: loadProjects().length,
        activities: activityCount(),
      });
    });
  }, [unlocked, message]);

  function unlock() {
    if (verifyTeacherPin(pin)) {
      setUnlocked(true);
      setPin("");
      setMessage("Teacher tools unlocked on this computer.");
    } else {
      setMessage("That access code was not recognized.");
    }
  }

  function updateSettings(patch: Partial<TeacherSettings>) {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveTeacherSettings(next);
    onSettingsChanged(next);
    setMessage("Camp availability updated.");
  }

  async function downloadBackup() {
    const bundle = await createCampBackup();
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `react-camp-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Backup downloaded. Store it somewhere safe.");
  }

  async function importBackup(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const bundle = parseCampBackup(await file.text());
      if (!window.confirm(`Restore backup from ${new Date(bundle.createdAt).toLocaleString()}? Current camp data will be replaced.`)) return;
      await restoreCampBackup(bundle);
      setMessage("Backup restored. Reloading the camp now.");
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The backup could not be restored.");
    }
  }

  async function runReset(kind: "progress" | "history" | "projects" | "all") {
    const labels = { progress: "lesson, activity, and game progress", history: "AI chat history", projects: "Build Lab projects", all: "all camp data and teacher settings" };
    if (!window.confirm(`Reset ${labels[kind]}? This cannot be undone without a backup.`)) return;
    if (kind === "progress") resetCampProgress();
    if (kind === "projects") resetCodeProjects();
    if (kind === "history") {
      const { clearHistoryData } = await import("../storage/historyStore");
      await clearHistoryData();
    }
    if (kind === "all") await resetAllCampData();
    setMessage(`${labels[kind]} reset. Reloading the camp now.`);
    window.location.reload();
  }

  if (!unlocked) {
    return (
      <section className="teacher-lock">
        <span className="teacher-lock-icon">TEACHER</span>
        <h1>Teacher Hub</h1>
        <p>Manage student access, backups, and local camp records.</p>
        <label>Access code<input value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, ""))} onKeyDown={(event) => { if (event.key === "Enter") unlock(); }} inputMode="numeric" type="password" /></label>
        <button className="camp-primary" onClick={unlock}>Unlock Teacher Hub</button>
        <small>{message}</small>
      </section>
    );
  }

  return (
    <div className="teacher-hub">
      <header className="feature-header">
        <div><p className="camp-eyebrow">LOCAL CLASSROOM CONTROLS</p><h1>Teacher Hub</h1><p>Control what students can open and protect their work with one backup.</p></div>
        <button className="camp-secondary" onClick={() => setUnlocked(false)}>Lock hub</button>
      </header>

      <section className="teacher-stats">
        <article><strong>{stats.days}/5</strong><span>Days complete</span></article>
        <article><strong>{stats.activities}/12</strong><span>Activities complete</span></article>
        <article><strong>{stats.chats}</strong><span>Saved AI chats</span></article>
        <article><strong>{stats.builds}</strong><span>Build projects</span></article>
      </section>

      <p className="teacher-message" role="status">{message}</p>

      <div className="teacher-grid">
        <section className="teacher-card">
          <h2>Student availability</h2>
          <label className="teacher-toggle"><span><strong>AI Lab</strong><small>Allow students to open the local Ollama coach.</small></span><input type="checkbox" checked={settings.aiEnabled} onChange={(event) => updateSettings({ aiEnabled: event.target.checked })} /></label>
          <label className="teacher-toggle"><span><strong>Build Lab</strong><small>Allow students to edit and preview code projects.</small></span><input type="checkbox" checked={settings.buildEnabled} onChange={(event) => updateSettings({ buildEnabled: event.target.checked })} /></label>
          <label className="teacher-toggle"><span><strong>Original Full Camp</strong><small>Show the preserved legacy camp link on Home.</small></span><input type="checkbox" checked={settings.showLegacyCamp} onChange={(event) => updateSettings({ showLegacyCamp: event.target.checked })} /></label>
        </section>

        <section className="teacher-card">
          <h2>Backup and restore</h2>
          <p>Backups include lessons, activities, scores, chats, attachments, projects, snapshots, and local settings.</p>
          <div className="teacher-actions"><button className="camp-primary" onClick={() => void downloadBackup()}>Download backup</button><label className="camp-secondary file-button">Restore backup<input type="file" accept="application/json,.json" onChange={(event) => void importBackup(event)} /></label></div>
        </section>

        <section className="teacher-card">
          <h2>Teacher access code</h2>
          <p>Use 4 to 8 digits. This classroom convenience lock is stored only on this computer.</p>
          <div className="pin-change"><input value={newPin} onChange={(event) => setNewPin(event.target.value.replace(/\D/g, ""))} placeholder="New access code" inputMode="numeric" type="password" /><button className="camp-secondary" onClick={() => { try { saveTeacherPin(newPin); setNewPin(""); setMessage("Teacher access code updated."); } catch (error) { setMessage(error instanceof Error ? error.message : "Access code not changed."); } }}>Change code</button></div>
        </section>

        <section className="teacher-card danger-card">
          <h2>Selective reset</h2>
          <p>Download a backup first. Each reset affects only this Windows account.</p>
          <div className="reset-grid"><button onClick={() => void runReset("progress")}>Reset progress</button><button onClick={() => void runReset("history")}>Reset chats</button><button onClick={() => void runReset("projects")}>Reset builds</button><button className="danger" onClick={() => void runReset("all")}>Reset everything</button></div>
        </section>
      </div>
    </div>
  );
}
