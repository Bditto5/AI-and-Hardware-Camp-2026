# Phase 4 status

Version 0.4 adds classroom controls and portable local data protection.

## Teacher Hub

- PIN-gated access with first-use code `2026`
- local teacher access-code changes
- live counts for completed days, activities, AI chats, and Build Lab projects
- availability controls for AI Lab, Build Lab, and the preserved Full Camp link
- locked features route students to the Teacher Hub instead of opening

## Backup and restore

- one versioned JSON bundle
- lesson, activity, and game progress
- complete IndexedDB chat history, organizational folders, and saved attachments
- Build Lab projects and snapshots
- local personalization, model, and teacher settings
- strict format and required-array validation before restore
- backup date shown before replacement confirmation

## Selective reset

Teachers can reset progress, chats, Build Lab projects, or all camp records. Each
action requires confirmation and recommends creating a backup first.
