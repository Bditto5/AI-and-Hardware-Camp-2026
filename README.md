# REACT Camp — AI + Hardware

A Windows desktop program for a five-day hands-on camp teaching students ages 13–18 how computer hardware and local AI work together.

The application runs its AI through [Ollama](https://ollama.com/) on the same computer. After Ollama and a model are installed, ordinary camp use is offline and prompts remain on the machine.

## Current build: v0.1 vertical slice

- Native Windows shell built with Tauri v2.
- REACT Camp dashboard and visual identity.
- Day 1 lesson with nine interactive slides and durable progress.
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

See [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md). The current vertical slice proves the shell, local AI, persistence, curriculum rendering, and Windows release pipeline before all remaining camp modules are converted from the preserved legacy files.

## Privacy

Chats, progress, projects, and extracted attachments are saved locally. This build has no telemetry, analytics, or cloud AI fallback.

