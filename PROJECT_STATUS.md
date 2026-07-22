# Project status — REACT Camp AI + Hardware

Last updated: 2026-07-21 while preparing v0.5.0.

## Repository

https://github.com/Bditto5/AI-and-Hardware-Camp-2026

## Product

A Windows desktop application for a five-day computer hardware and local AI camp
for students ages 13–18. The program uses React 19, TypeScript, Vite, Tauri v2,
Rust, IndexedDB, and a locally running Ollama model.

## Completed native features

- five camp days with 42 lesson slides and durable progress
- Hardware Quiz, AI Quiz, and Bug Hunt with best scores
- twelve hardware, AI, and coding activities
- local Ollama AI Coach with buffered streaming and idle-based timeout
- persistent, searchable, resumable chat history
- reusable text, PDF, and DOCX attachments
- Build Lab with HTML/CSS/JavaScript, safe preview, autosave, starter templates,
  snapshots, standalone HTML export, portable project import/export, and duplication
- PIN-gated Teacher Hub with feature availability, complete backup/restore, and
  selective reset
- full-screen lesson presenter mode with keyboard navigation
- permanent GitHub Actions Windows build and release workflows

## Local source layout

The canonical working tree for Codex is `work/repo`. Versioned source packages are
written to `outputs`. The repository does not rely on a working local Git CLI;
GitHub publishing has been performed through authenticated GitHub tools and the
GitHub web interface.

## Current verification path

1. Run the local syntax checker in `work/run-node.bat`.
2. Publish a temporary source ZIP and importer workflow.
3. GitHub Actions runs `npm ci`, lint, TypeScript typecheck, and the Tauri Windows
   installer build.
4. Remove the temporary importer after a successful run.

## Next useful milestones

- real installed-app acceptance test with Ollama and restart/resume
- structured AI code suggestions with review-before-apply
- accessibility and responsive-layout audit
- tagged Windows release with checksums
- optional image backend that never blocks normal camp use