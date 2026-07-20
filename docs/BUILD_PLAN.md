# REACT Camp Windows App — Build and Reuse Plan

**Target repository:** [Bditto5/AI-and-Hardware-Camp-2026](https://github.com/Bditto5/AI-and-Hardware-Camp-2026)  
**Primary reference implementation:** [mrditto/Local-Ed-AI-by-DittoEd-](https://github.com/mrditto/Local-Ed-AI-by-DittoEd-)  
**Target:** A Windows desktop program that runs local AI through Ollama, works offline after setup, preserves all camp interactivity, and reliably saves chats, prompts, code projects, and student progress.

## 1. Recommended decision

Build REACT Camp as a **Tauri v2 + React + TypeScript + Vite** application by using Local Ed AI as the starting architecture and migrating the existing camp content into React components.

Do **not** simply wrap the existing HTML files in a desktop window. That would preserve current weaknesses: duplicated Ollama code, memory-only chat, fragile streamed-response parsing, separate configuration screens, limited autosave, and a manual `.bat` startup flow.

The safest route is:

1. Copy the proven desktop/Ollama/storage/release foundation from Local Ed.
2. Replace its educator-facing screens with the REACT Camp navigation and curriculum.
3. Convert the current static camp content into structured data and React components.
4. Route every AI feature through one shared Ollama service and every saved item through one versioned storage layer.
5. Keep the current HTML files under `legacy/` until the React replacement passes feature-parity tests.

## 2. What already exists in REACT Camp

The current three HTML applications contain valuable working content that should be migrated, not rewritten from memory.

### `curriculum.html`

- 5-day curriculum with **41 lesson slides**.
- **21 activities** across hardware, AI, building, Scratch, and machine learning.
- Three interactive games: hardware quiz, AI quiz, and bug hunt.
- Presenter/read modes and day-completion tracking.
- Build Lab with HTML, CSS, and JavaScript editors, live preview, seven starter activities, and an Ollama coding tutor.
- Student name, teacher controls, progress tracking, and JSON progress import/export.

### `ai-helper.html`

- General chat with beginner/intermediate/advanced skill levels.
- Quick prompts and a camp-specific system prompt.
- Code explanation and repair tools.
- Optional Stable Diffusion image-generation interface.
- Ollama/model/server settings.

### `setup.html`

- Ollama status check and student-friendly setup instructions.

### Problems to correct during migration

- Chat history exists only in memory and is lost on close.
- The current NDJSON reader parses each network chunk independently; a JSON line split across chunks can be lost. Local Ed's buffered Rust stream solves this.
- Ollama logic is duplicated in the AI Helper and Build Lab.
- The Build Lab AI can duplicate the current user message when composing context.
- Progress is split across several `localStorage` keys and requires manual export for portability.
- The current preview iframe enables both scripts and same-origin access; the desktop version should use a stricter sandbox.
- The image-generation backend is unrelated to Ollama and must remain an optional capability, not a required part of first-run setup.
- The browser setup page and `.bat` flow should be replaced by in-app health checks, installer launch, and streamed model-download progress.

## 3. Reuse from Local Ed AI

The supplied Local Ed checkout is the best template because it already solves the same Windows, Ollama, local-storage, and release problems under Apache 2.0.

| Local Ed component | Reuse decision | REACT Camp adaptation |
|---|---|---|
| `src-tauri/` scaffold and plugins | Reuse directly | Rename product, identifier, icons, and window defaults. |
| `src-tauri/src/lib.rs` Ollama proxy | Reuse and extend | Keep buffered NDJSON streaming; add cancellation and request-state events. |
| `src/api/ollama.ts` | Reuse and extend | One client for AI Chat, Code Tutor, activity assistants, and model management. |
| Idle-based stream timeout | Reuse | No total generation deadline; active streams continue indefinitely. |
| Ollama installer/model download flow in `App.tsx` | Reuse | Apply camp wording and hardware-tier recommendations. |
| `src/data/modelTiers.ts` | Reuse | Keep light/recommended/enhanced tiers and add a short benchmark check. |
| `src/hooks/useChat.ts` | Reuse and generalize | Support system presets, stop/regenerate, partial responses, and session types. |
| `messagesRef` persistence fix | Reuse exactly in principle | Prevent prompt-only saves caused by React state batching. |
| `src/storage/historyStore.ts` | Reuse as the storage foundation | Add prompt, progress, game result, and code-project stores. |
| `src/storage/types.ts` | Reuse and expand | Add versioned camp-specific records. |
| `HistoryPanel.tsx` | Reuse and restyle | Filter Chat, Code Tutor, Build Lab, and Activity Coach sessions. |
| `extractText.ts` and saved-file library | Reuse | Allow students to attach text, Markdown, PDF, or DOCX where appropriate. |
| Settings/personalization patterns | Reuse | Skill level, response length, selected model, teacher options, and accessibility. |
| GitHub Actions build/release workflows | Reuse | Build Windows NSIS/MSI artifacts with REACT Camp naming. |

Local Ed v0.4.1 already uses React 19, Tauri v2, `idb`, `react-markdown`, file-extraction libraries, and native Tauri plugins. The project status also records the key real-world fix: an **idle timeout that resets on every streamed line**, rather than a fixed wall-clock limit.

## 4. Other open-source templates worth using selectively

Copying from another project requires preserving its copyright and license notice. Add every copied project to `THIRD_PARTY_NOTICES.md` and record the source file and commit.

| Project | License | Useful ideas/code | Recommendation |
|---|---|---|---|
| [MedGm/Ollie](https://github.com/MedGm/Ollie) | MIT | Tauri/Rust Ollama provider abstraction, model management, SQLite sessions, system monitoring, vision/file UX | Strong reference. Port small, reviewed pieces only; do not replace the simpler Local Ed core. |
| [Tim-Butterfield/ollama-chat-tauri](https://github.com/Tim-Butterfield/ollama-chat-tauri) | MIT | Small React/Tauri/SQLite example, session rename/delete, model selector | Reference for tests and data behavior; its README describes it as lightly tested, so it should not be the base. |
| [NextChat](https://github.com/ChatGPTNextWeb/NextChat) | MIT | Reusable prompt/persona “masks,” message selection, and text/JSON/image export UX | Borrow the prompt-template and export interaction patterns, not the full Next.js stack. |
| [OpenPawz](https://github.com/OpenPawz/openpawz) | MIT | Ollama auto-detection, model setup, provider isolation, and native model commands | Reference for robust model lifecycle; too large and agent-focused to adopt wholesale. |
| [AnythingLLM](https://github.com/Mintplex-Labs/anything-llm) | MIT | Workspace/thread concepts, document ingestion, streaming, and local-first UX | Use as a design reference for later document/RAG features; do not add it as a runtime dependency. |
| [Chatbox](https://github.com/chatboxai/chatbox) | GPL-3.0 | Mature chat UX | Study behavior only. Do not copy GPL code into the planned Apache-2.0 application unless the whole licensing strategy changes. |

The project should remain Apache 2.0. MIT code can be included with attribution; GPL/AGPL code should not be copied.

## 5. Target user experience

### Main navigation

1. **Home** — continue today’s lesson, recent projects, Ollama status.
2. **Learn** — five days, slide navigation, read/presenter modes, completion.
3. **Activities** — searchable/filterable activity cards with progress.
4. **Games** — hardware quiz, AI quiz, bug hunt, scores and retries.
5. **Build Lab** — HTML/CSS/JS editor, sandboxed preview, AI coding coach, saved projects.
6. **AI Lab** — general chat, prompt coach, code helper, and optional image lab.
7. **History** — saved chats, prompts, code sessions, search, pin, rename, export, delete.
8. **Teacher** — PIN-gated presentation, activity availability, AI settings, reset/export tools.

### Unified AI behavior

Every AI surface uses the same underlying chat engine but supplies a different preset:

- `camp-general`: friendly AI and hardware tutor.
- `prompt-coach`: teaches students how to improve prompts without doing all the thinking for them.
- `code-coach`: explains, debugs, and proposes HTML/CSS/JS changes.
- `activity-coach`: provides hints tied to a selected activity.
- `teacher-assistant`: helps the facilitator prepare examples and explanations.

The selected preset, hidden system context, skill level, model settings, and exact outgoing user context must be saved with the session so resumed chats behave the same way.

## 6. Ollama reliability design

Ollama's chat API streams newline-delimited JSON. Streaming should be the only path for normal chat because it lowers perceived latency and allows long answers to remain responsive.

### Timeout policy

- Health checks: 5 seconds.
- Initial connection/model-load wait: configurable, default 5 minutes.
- Active generation: **no fixed total timeout**.
- Stream idle timeout: 120 seconds without any new data; reset on every chunk/line.
- Model pull: no fixed total deadline; fail only after a long idle period or explicit error.
- Set `keep_alive: "30m"` during camp use to reduce repeated cold model loads.

This meets the “no Ollama timeouts” requirement in the useful sense: a slow but active generation is never killed. A truly stalled connection still returns control to the student instead of hanging forever.

### Required stream state machine

`queued → connecting → loading-model → streaming → completed | stopped | interrupted | failed`

Requirements:

- Buffer partial NDJSON lines across arbitrary network chunk boundaries.
- Correlate every Rust event with a unique request ID.
- Preserve a partial assistant answer if Ollama stops mid-generation.
- Provide a visible **Stop** button.
- Add a Rust cancellation command and remove cancelled requests from memory.
- Disable duplicate sends while a surface is already generating.
- On low-memory machines, permit only one active generation across the app; queue or clearly block a second request.
- Classify errors: Ollama absent, model missing, model loading, idle timeout, stopped by user, malformed response, and unknown model error.
- Support regenerate and continue-from-partial without duplicating conversation context.

### Model tiers

- **Light:** `llama3.2:1b` (~1.3 GB) for older/8 GB machines.
- **Standard:** `llama3.2:3b` (~2.0 GB) or `phi4-mini:latest` (~2.5 GB), selected after a real benchmark on camp hardware.
- **Enhanced:** an 8B-class model only for machines that pass memory/performance checks.

Do not use the advertised 128K model context by default. Start at a practical 4K–8K context on donated hardware, retain the full transcript in history, and send only the context window needed for the next turn. This avoids memory pressure while preserving the complete saved record.

## 7. Persistence and data model

Use Local Ed's IndexedDB summary/body split for the first Windows release. It is already implemented and avoids introducing a second database technology. Add one-click backup and restore so data is not trapped in WebView storage.

### Stores

| Store | Purpose |
|---|---|
| `sessionSummaries` | Fast history list: title, type, updated time, preview, pin, project. |
| `sessionBodies` | Full visible transcript plus exact outgoing context and preset metadata. |
| `promptTemplates` | Built-in and student-saved prompts, variables, category, favorite status. |
| `codeProjects` | HTML/CSS/JS, preview settings, activity source, autosave timestamp. |
| `codeSnapshots` | Named/manual versions and limited automatic recovery snapshots. |
| `studentProfiles` | Local display name, skill level, accessibility preferences. |
| `campProgress` | Day/slide/activity completion and game attempts/scores. |
| `projects` | Organizational folders for chats and builds. |
| `savedFiles` | Reusable extracted text attachments. |
| `appSettings` | Ollama URL/model, keep-alive, teacher settings, optional image backend. |

### Storage rules

- Every schema has a numeric version and tested migrations.
- Chat is saved after the user message, after every assistant chunk on a trailing debounce, and once more at completion/error/stop.
- Code and progress autosave after a 300–750 ms trailing debounce.
- App close flushes pending saves where possible.
- History saves the partial answer if a generation is interrupted.
- Backup exports a validated JSON bundle; restore previews the owner/date/counts before applying.
- A corrupt record is isolated and reported instead of preventing app startup.
- Teacher reset offers separate choices: progress only, chats only, projects only, or everything.

## 8. Build Lab design

- Convert the three textareas into controlled React editor components. Start with the existing textarea behavior for feature parity, then add CodeMirror 6 after the storage and AI paths are stable.
- Save each build as a named `CodeProject`.
- Provide Run, Stop Preview, Undo, snapshot, duplicate, export ZIP, and restore.
- Render in an iframe with `sandbox="allow-scripts"` only. Do not combine `allow-scripts` with `allow-same-origin`.
- Inject a restrictive preview CSP that denies network, navigation, popups, downloads, and access to the host app.
- Keep code execution entirely inside the preview iframe; never execute student code in Rust or the Windows shell.
- Have the code coach return clearly labeled HTML/CSS/JS blocks.
- Show a review diff before an AI suggestion replaces student code.
- Preserve the student's original code automatically before applying an AI change.
- Eliminate the duplicated-message bug by letting the shared chat service append the user turn exactly once.

## 9. Optional image generation

Ollama is the text/model runtime; the existing image tab calls a Stable Diffusion-compatible API. Therefore:

- Image Lab is optional and hidden by default.
- Detect the configured image server independently from Ollama.
- Keep the existing prompt/style/size UI after migration.
- Do not block camp setup if no image server exists.
- Save image prompts and metadata to history; save generated image files only after an explicit user choice.
- Add educator-configurable safe negative prompts and clearly state that local image models can still generate unexpected material.

## 10. Proposed repository structure

```text
AI-and-Hardware-Camp-2026/
├── .github/workflows/
│   ├── build.yml
│   └── release.yml
├── docs/
│   ├── BUILD_PLAN.md
│   ├── TEST_MATRIX.md
│   └── THIRD_PARTY_NOTICES.md
├── legacy/
│   ├── curriculum.html
│   ├── ai-helper.html
│   └── setup.html
├── src-tauri/
│   ├── src/
│   │   ├── lib.rs
│   │   ├── ollama_stream.rs
│   │   ├── ollama_models.rs
│   │   └── request_manager.rs
│   └── tauri.conf.json
├── src/
│   ├── api/ollama.ts
│   ├── app/
│   ├── components/
│   ├── features/
│   │   ├── learn/
│   │   ├── activities/
│   │   ├── games/
│   │   ├── build-lab/
│   │   ├── ai-lab/
│   │   ├── history/
│   │   └── teacher/
│   ├── content/
│   │   ├── days.ts
│   │   ├── activities.ts
│   │   ├── games.ts
│   │   └── promptPresets.ts
│   ├── hooks/useChat.ts
│   ├── storage/
│   └── styles/
├── package.json
├── LICENSE
└── THIRD_PARTY_NOTICES.md
```

## 11. Phased implementation plan

### Phase 0 — Freeze and baseline

- Preserve the three current HTML files under `legacy/`.
- Record screenshots and a feature checklist for every tab/control.
- Run Local Ed's typecheck, lint, and web build from the supplied checkout.
- Verify the known `useChat` persistence fix with a real Ollama response.

**Done when:** legacy behavior is documented and the reusable Local Ed base passes its existing checks.

### Phase 1 — Desktop foundation

- Import the Local Ed React/Tauri project into the camp repository.
- Rename package, app identifier, window title, icons, README, and workflows.
- Remove educator-specific features but keep the Ollama, storage, settings, file, and release infrastructure.
- Add the REACT Camp application shell and route/state model.

**Done when:** a Windows development window and web preview open to the camp shell; CI builds the frontend.

### Phase 2 — Curriculum feature parity

- Convert all 41 slides, 21 activities, three games, and starter projects into typed data.
- Implement Learn, Activities, Games, profile, presenter mode, teacher controls, and progress.
- Add migration/import for existing progress JSON.

**Done when:** every existing curriculum interaction works without Ollama.

### Phase 3 — Unified Ollama engine

- Port Local Ed's Rust streaming bridge and TypeScript client.
- Add cancellation, state events, keep-alive, one-request scheduling, and partial-answer recovery.
- Add model detection, model selection, streamed pulls, and in-app setup.
- Connect AI Lab, Code Helper, Build Lab, and activity hints to the same service.

**Done when:** all AI surfaces stream through one engine and an active five-minute generation is not timed out.

### Phase 4 — History, prompts, and projects

- Extend Local Ed storage schemas.
- Autosave/resume chats with exact hidden context.
- Save custom prompts, favorites, code projects, progress, scores, and snapshots.
- Add search, pin, rename, group, export, backup, restore, and selective reset.

**Done when:** closing/reopening the installed app restores completed and interrupted sessions exactly.

### Phase 5 — Full Build Lab

- Port the current editor and starter projects.
- Tighten the iframe sandbox and preview CSP.
- Add snapshots, diff-before-apply, export, recovery, and AI code insertion.
- Add CodeMirror only after core parity is green.

**Done when:** a student can build, save, close, resume, export, and recover a project without losing code.

### Phase 6 — Optional capabilities and polish

- Optional image backend.
- File attachments and document text extraction.
- Accessibility, keyboard navigation, responsive layouts, and presenter QA.
- Hardware benchmark and recommended-model tuning.

**Done when:** optional backends fail closed and never prevent ordinary camp use.

### Phase 7 — Windows packaging and release

- Build an NSIS `.exe` first; add MSI after the NSIS path is stable.
- Test install, upgrade, uninstall, app-data retention, and offline launch.
- Run signed/unsigned warning copy through final review.
- Tag a release; GitHub Actions creates a draft with the installer and checksums.

**Done when:** a clean Windows machine can install, set up Ollama/model, complete a lesson, chat, save history, restart, and resume without developer tools.

## 12. Required test matrix

### Automated

- TypeScript typecheck, ESLint, and production build.
- Storage CRUD and schema-migration tests.
- Stream parser tests with JSON lines split at every possible byte boundary.
- Chat persistence regression test for the React batched-state bug.
- Context-building test proving each user message is sent once.
- Stop/regenerate/continue state tests.
- Backup validation and corrupt-record recovery tests.
- Curriculum data counts and unique-ID tests.
- Code preview sanitizer/sandbox configuration tests.

### Real Ollama integration

- Ollama stopped at launch.
- Ollama starts after the app.
- No model installed.
- Cold model load on CPU-only hardware.
- Active response longer than five minutes.
- Two AI tabs attempt to generate at once.
- Ollama is stopped mid-response.
- Model pull loses/reconnects network.
- Restart app and resume the exact prior context.
- `keep_alive` prevents unnecessary reload during a lesson.

### Windows/hardware

- 8 GB RAM, CPU-only, Light model.
- 16 GB RAM, integrated graphics, Standard model.
- 16+ GB with supported GPU, Standard/Enhanced comparison.
- Windows 10 and Windows 11.
- Fresh install, upgrade over older version, uninstall/reinstall.
- Fully offline after Ollama and the selected model are installed.

### Acceptance journey

1. Install the app.
2. Let the app detect/install Ollama.
3. Pull a recommended model with visible progress.
4. Complete Day 1 slides and an activity.
5. Ask AI a question and stop/regenerate once.
6. Build a small project with the code coach.
7. Close the program during a second chat response.
8. Reopen and verify progress, code, complete chat history, and partial response.
9. Export a backup, reset locally, restore the backup, and verify all records.

## 13. First build milestone

The first implementation milestone should be a **vertical slice**, not all screens at once:

- Windows Tauri shell.
- Day 1 lesson.
- One activity and one quiz.
- Unified Ollama setup and one streamed chat.
- Idle timeout/no total timeout behavior.
- Durable history and progress.
- One saved Build Lab project.
- Windows CI artifact.

Once this slice survives install/restart/offline tests, repeat the same proven patterns for the remaining curriculum.

## 14. Source references

- [Local Ed README and architecture](https://github.com/mrditto/Local-Ed-AI-by-DittoEd-)
- [Local Ed Ollama client](https://github.com/mrditto/Local-Ed-AI-by-DittoEd-/blob/master/src/api/ollama.ts)
- [Local Ed history store](https://github.com/mrditto/Local-Ed-AI-by-DittoEd-/blob/master/src/storage/historyStore.ts)
- [Local Ed React chat hook](https://github.com/mrditto/Local-Ed-AI-by-DittoEd-/blob/master/src/hooks/useChat.ts)
- [Local Ed Rust streaming bridge](https://github.com/mrditto/Local-Ed-AI-by-DittoEd-/blob/master/src-tauri/src/lib.rs)
- [Ollama chat API](https://docs.ollama.com/api/chat)
- [Ollama streaming format](https://docs.ollama.com/api/streaming)
- [Tauri Windows prerequisites](https://v2.tauri.app/start/prerequisites/)
- [Tauri Windows installers](https://v2.tauri.app/distribute/windows-installer/)
- [Ollama `llama3.2` model page](https://ollama.com/library/llama3.2)
- [Ollama `phi4-mini` model page](https://ollama.com/library/phi4-mini)

