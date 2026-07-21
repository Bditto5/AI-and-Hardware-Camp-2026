# Phase 3 status

Version 0.3 migrates Activities and the Build Lab into the native React desktop
shell.

## Activities

- twelve hardware, AI, and build activities
- category filters and text search
- safety callouts and structured steps
- locally saved completion state
- direct activity-coach and Build Lab actions

## Build Lab

- named HTML, CSS, and JavaScript projects
- 500 ms trailing local autosave
- Profile Card, Mini Quiz, and Branching Story templates
- live preview in an iframe with `sandbox="allow-scripts"`
- restrictive preview CSP that blocks network, forms, objects, navigation bases,
  and access to the desktop host
- Run and Stop Preview controls
- up to ten manual recovery snapshots per project
- standalone HTML export
- local Ollama code coach with current-project context

The code coach can explain and suggest changes, but it cannot silently replace
student code. Students review and apply changes themselves.
