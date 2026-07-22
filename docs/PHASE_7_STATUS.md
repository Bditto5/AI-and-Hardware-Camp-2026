# Phase 7 status

Version 0.7 improves classroom accessibility and narrow-window behavior without
changing saved camp data.

## Keyboard and screen-reader support

- skip directly to the current main view
- visible focus rings on buttons, links, form controls, and editor actions
- focus moves to the new view after navigation
- current navigation, lesson day, slide, filter, game, and presenter states are announced
- quiz results, connection failures, hints, and project messages use live status semantics
- lesson keyboard instructions are available to assistive technology
- dashboard cards no longer require pointer-only interaction

## Visual and responsive support

- reduced-motion preferences disable nonessential animation and transitions
- Windows forced-colors mode preserves borders and selected-state visibility
- top navigation becomes horizontally scrollable in a narrow window
- lesson day navigation becomes a horizontal strip
- Build Lab editor, preview, snapshots, and coach stack without clipping
- activity, game, code review, and chat controls reflow for smaller widths

The Tauri desktop window still opens at its classroom-friendly size, while the
interface now remains usable when resized or viewed through browser zoom.
