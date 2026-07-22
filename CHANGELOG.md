# Changelog

## 2.0.0 — Classroom deployment release

- Added a one-click classroom setup package for repeatable Windows laptop deployment.
- Added guided installation and verification for REACT Camp, Ollama, and the lightweight `llama3.2:1b` model.
- Added an optional reusable Ollama installer path for USB drives and school file shares.
- Added native Stop support for local AI responses while preserving partial generated text.
- Added debounced partial-response persistence and serialized history writes for interruption recovery.
- Aligned fresh-install app settings with the model installed by the classroom setup package.
- Added CI validation and release packaging for the classroom deployment ZIP.
- Updated backup metadata and Windows package versions to 2.0.0.

## 0.7.0 — Accessibility and responsive classroom QA

- Added a skip-to-content link and automatic main-content focus after navigation.
- Added current-page, current-day, current-slide, expanded-state, and pressed-state semantics.
- Added highly visible keyboard focus across interactive controls.
- Added screen-reader announcements for Ollama status, quiz feedback, activity details, chat errors, and Build Lab feedback.
- Removed nested and pointer-only interactions from dashboard cards and AI suggestion selectors.
- Added reduced-motion behavior and Windows forced-colors support.
- Added responsive navigation, lesson, Build Lab, activity, game, and chat layouts for narrower windows.
- Added hidden lesson keyboard instructions for Left/Right Arrow and Page Up/Page Down controls.

## 0.6.0 — Safe AI code suggestions

- Added direct, structured Build Lab suggestions from the local Ollama code coach.
- Added side-by-side current and proposed code review for HTML, CSS, and JavaScript.
- Added per-file selection so students decide exactly which proposed files to apply.
- Added safe preview of selected AI changes without modifying saved project code.
- Added strict parsing that prevents malformed coach responses from changing a project.
- Added an automatic `Before AI suggestion` recovery snapshot before applying any AI change.
- Preserved the full-chat path for explanations and longer coaching conversations.

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
