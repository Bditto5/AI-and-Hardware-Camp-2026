# Changelog

## 2.5.1 — Ollama connection fixes

- REACT Camp now automatically retries connecting to Ollama every 5 seconds instead of checking only once when the app opens. On many classroom laptops Ollama is still finishing its own startup at the moment the app launches, which previously left a permanent "Can't reach Ollama" banner until the app was fully closed and reopened. The "AI setup"/"AI ready" pill in the top bar is also now a button you can click to retry immediately.
- Fixed the Connection Settings page (and the History page's search/filter controls) still using the app's old light color theme in several places, making the "Ollama address" field, the model download buttons, and the tier cards render with very low contrast (near-invisible text) against their backgrounds. This was likely the underlying cause of "the models can't be clicked to load" reports — the controls worked, but were extremely hard to see or trust.
- Updated application and backup metadata versions to 2.5.1.

## 2.5.0 — REACT brand colors

- Recolored the app's primary accent from purple to a forest green matching the REACT organization's actual logo (buttons, navigation, links, focus states, the logo mark, and the home page's hero glow), and shifted secondary muted text from a blue-gray to a neutral gray. Content-variety colors (lesson slide tones, activity category tags, feature card icons) are unchanged, since those exist for visual variety rather than as the app's brand identity.
- Updated application and backup metadata versions to 2.5.0.

## 2.4.1 — AI Coach fixes

- Added a "Hide coach" button so Build Lab (or any other screen) can go back to full width while the AI Coach conversation stays open in the background, with a floating "AI Coach" button to bring it back — previously the only way back to full width was closing the coach entirely.
- Fixed the Tone and Length dropdowns in the AI Coach rendering with invisible white-on-white text.
- Simplified the Build Lab "Local AI code coach" panel to a single "Ask AI Coach" prompt helper. The previous "Get reviewable change" flow depended on the local model returning strict JSON and frequently failed with "the coach did not return a reviewable code suggestion" on smaller classroom models; questions now always go to the full AI Coach chat instead.
- Updated application and backup metadata versions to 2.4.1.

## 2.4.0 — Resizable AI Coach and Activity answers

- The AI Coach split view now has a draggable divider between the coach and the rest of the app, so you can freely resize the split instead of a fixed 50/50 layout. The size you choose is remembered next time you open the coach.
- Activities now has a "Your answer / notes" box under each activity's steps so students can record their observations, recommendations, and reflections instead of only marking an activity complete. Answers are saved locally, included in Teacher Hub backups, and cleared by "Reset progress" alongside activity completion.
- Updated application and backup metadata versions to 2.4.0.

## 2.3.2 — CPU fix for overlapping AI generations

- Fixed a bug where opening the AI Lab chat and also using the Build Lab code coach or the IEP assistant "Draft with AI" at the same time could run two local AI generations at once, pinning every CPU core and making the whole computer (including other apps like the browser) unresponsive until they finished. Only one AI generation now runs at a time app-wide.
- Updated application and backup metadata versions to 2.3.2.

## 2.3.0 — Split-screen AI Coach

- The AI Coach now opens as a panel that splits the screen with whatever you're doing (Follow Along, Build Lab, Activities) instead of navigating away from it, with a Full screen / Split view toggle in the panel's corner.
- The AI Lab nav item and resuming a saved chat from History default to full screen; every contextual "Ask the AI Coach" action defaults to split.
- Switching to a different section while the coach is full screen now drops it back to split automatically, instead of hiding the new section behind it.
- Fixed nav-dropdown selections (like switching Build Lab and Follow Along, or jumping to a different activity) silently doing nothing when already on that section.
- Added a small rendering fix for the top nav bar to prevent a Windows rendering glitch after a screen change.
- Updated application and backup metadata versions to 2.3.0.

## 2.2.1 — Navigation and Ask AI fixes

- Fixed the local AI coach header (Back/title/New chat) rendering hidden and unclickable behind the top nav bar after navigating from Build Lab's "Open full chat" or the AI Lab nav item.
- Added real "Open Scratch" / "Open Teachable Machine" / "Open MakeCode" / "Open Arduino Web Editor" links to the Follow Along lessons that reference those tools.
- Added dropdown menus to the Learn, Activities, and Build nav items listing every day, every activity, and both Build tabs, one click from anywhere.
- Expanded Home with browsable Day, Activity, and Build sections in place of the single generic "Complete learning arc" card.
- Updated application and backup metadata versions to 2.2.1.

## 2.2.0 — Follow Along release

- Added a "Follow Along" tab to Build, alongside the existing Build Lab editor.
- Added a guided, offline, one-step-at-a-time walkthrough of eight outside AI lessons across three tracks: Chatbots, Face Detection, and Machine Learning.
- Added copy-ready prompts on every step for the existing local AI Coach, including a per-step bug-report prompt.
- Added a hand-off from Follow Along into a fresh Build Lab project for the lesson that builds a web page.
- Added local progress tracking for Follow Along lessons and steps, included in Teacher Hub backups, resets, and the live progress stats.
- Updated application and backup metadata versions to 2.2.0.

## 2.1.1 — REACT icon release

- Replaced the previous combined-symbol application icon with the green REACT wordmark and robot hand.
- Regenerated the Windows shortcut, Start menu, Store, installer, and application icon assets.
- Updated application and backup metadata versions to 2.1.1.

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
