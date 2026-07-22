# Phase 6 status

Version 0.6 adds a safe bridge between the local Ollama coach and Build Lab code.

## Reviewable suggestions

- the coach returns a structured suggestion instead of editing the project directly
- malformed or explanation-only responses cannot be applied
- students compare current and proposed HTML, CSS, or JavaScript side by side
- each changed file can be selected or excluded independently
- selected changes can be rendered in the existing sandboxed preview before apply

## Recovery and student control

- applying a suggestion always creates a `Before AI suggestion` snapshot first
- discarding restores the normal preview and leaves the project unchanged
- full AI Lab chat remains available for longer explanations
- the coach prompt prohibits network access, external assets, local files, storage,
  popups, downloads, and navigation

The student remains responsible for testing and explaining every applied change.
