# Changelog

## 0.5.0 — Presenter mode and portable Build Lab projects

- Added full-screen lesson presenter mode with enlarged classroom typography.
- Added Arrow, Page Up, Page Down, and Escape keyboard controls for lesson presentation.
- Added one-click Build Lab project duplication, including recovery snapshots.
- Added validated portable project JSON export and import.
- Added confirmation before project deletion and protected snapshot restore.
- Added an automatic `Before restore` recovery snapshot whenever older code is restored.
- Added individual snapshot deletion and clear project-action status messages.

## 0.4.0 — Teacher controls, backup, and restore

- Added a PIN-gated Teacher Hub with first-use access code `2026`.
- Added live totals for completed days, activities, saved AI chats, and Build Lab projects.
- Added teacher availability switches for AI Lab, Build Lab, and the original Full Camp link.
- Added a versioned JSON backup containing camp progress, scores, chat history, attachments, projects, snapshots, and local settings.
- Added validated restore with backup-date preview and explicit replacement confirmation.
- Added selective resets for progress, chats, Build Lab projects, or all local camp data.
- Added teacher access-code changes stored only on the current computer.

## 0.3.0 — Native activities and Build Lab

- Added twelve searchable, filterable camp activities with locally saved completion state.
- Added safety callouts, step-by-step instructions, activity coaching prompts, and Build Lab shortcuts.
- Added named HTML/CSS/JavaScript projects with 500 ms local autosave.
- Added three starter projects: Profile Card, Mini Quiz, and Branching Story.
- Added a sandboxed live preview with network, navigation, form, object, and host access blocked.
- Added manual recovery snapshots, one-file HTML export, and project switching.
- Added a local Ollama code-coach path that receives the current code but cannot modify it automatically.

## 0.2.0 — Five-day curriculum and native games

- Migrated all five camp days into structured React lessons with 42 total slides.
- Enabled every day in the lesson navigator with independent slide resume and completion tracking.
- Added native Hardware Quiz and AI Quiz experiences with explanations and saved best scores.
- Added a five-part Bug Hunt with progressive hints and corrected-code comparisons.
- Updated the dashboard to continue the next incomplete day automatically.

## 0.1.0 — Initial Windows vertical slice

- Started the REACT Camp Windows application from the proven Local Ed Tauri/React/Ollama foundation.
- Added the camp dashboard, navigation, Day 1 curriculum, lesson progress, and AI status.
- Added durable local AI chat and resumable history.
- Added a 30-minute Ollama model keep-alive and a five-minute stream idle allowance for slow school hardware.
- Preserved the complete original static camp under Full Camp while migration continues.
- Renamed Windows packaging and GitHub Actions artifacts for REACT Camp.
