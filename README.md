# REACT Camp — AI + Hardware

A Windows desktop program for a five-day hands-on camp teaching students ages 13–18 how computer hardware and local AI work together.

The application runs its AI through [Ollama](https://ollama.com/) on the same computer. After Ollama and a model are installed, ordinary camp use is offline and prompts remain on the machine.

## Current build: v0.6 safe AI-assisted building

- Native Windows shell built with Tauri v2.
- REACT Camp dashboard and visual identity.
- All five camp days with 42 structured lesson slides and durable per-day progress.
- Native Hardware Quiz, AI Quiz, and Bug Hunt with explanations and saved best scores.
- Twelve native hardware, AI, and build activities with filters, safety notes, steps, and completion tracking.
- Native Build Lab with named HTML/CSS/JavaScript projects, local autosave, safe preview, starter templates, snapshots, and HTML export.
- Portable Build Lab project import/export, project duplication, protected snapshot restore, and snapshot cleanup.
- Structured local-AI code suggestions with side-by-side review, per-file selection, safe preview, and recovery snapshot before apply.
- Full-screen lesson presenter mode with large classroom type and keyboard navigation.
- PIN-gated Teacher Hub with live progress, activity, chat, and project totals.
- Teacher controls for AI Lab, Build Lab, and the preserved Full Camp link.
- Validated JSON backup and restore for progress, scores, chats, attachments, projects, snapshots, and settings.
- Selective reset for progress, chats, projects, or all local camp data.
- Local Ollama code coach with both full-chat help and explicit review-before-apply changes.
- Local Ollama AI Coach.
- Persistent chat history through IndexedDB.
- Search, pin, rename, group, resume, and delete history.
- Reusable text/PDF/DOCX attachment library inherited from the Local Ed foundation.
- Ollama model selection and download settings.
- Buffered Rust streaming bridge with an activity-based idle timeout and `keep_alive` model reuse.
- Complete original curriculum, activities, games, and Build Lab available under **Full Camp** during migration.
- Windows CI builds NSIS and MSI installers.

## Architecture

- **Desktop:** Tauri v2 + Rust
- **Interface:** React 19 + TypeScript + Vite
- **Local model runtime:** Ollama
- **Persistence:** IndexedDB using `idb`
- **License:** Apache 2.0

The desktop and storage foundation is adapted from [Local Ed AI by DittoEd](https://github.com/mrditto/Local-Ed-AI-by-DittoEd-), also maintained by Bradley Ditto.

## Development prerequisites

1. Node.js LTS
2. Rust toolchain
3. Microsoft C++ Build Tools with Desktop development with C++
4. Microsoft Edge WebView2
5. Ollama

## Run for development

```powershell
npm install
npm run tauri dev
```

## Quality checks

```powershell
npm run typecheck
npm run lint
npm run build
```

## Build Windows installers

```powershell
npm run tauri build
```

Installer output is written under `src-tauri/target/release/bundle/`.

## Roadmap

See [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md). The Windows shell, local AI, persistence, five-day curriculum, games, activities, Build Lab, and release pipeline are now native. The preserved Full Camp remains available for comparison and remaining teacher controls.

## Privacy

Chats, progress, projects, and extracted attachments are saved locally. This build has no telemetry, analytics, or cloud AI fallback.
