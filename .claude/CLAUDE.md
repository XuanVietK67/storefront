# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CustomMaker is a single-page bag personalizer. Users place text, stickers, and icons onto a product canvas, adjust their properties, and add to cart.

## Tech Stack

- **Vue 3** (Composition API, `<script setup>`) + **TypeScript**
- **Vite** — build and dev server
- **Tailwind CSS v3** — utility-first styling with custom design tokens; no CSS modules, all styling is inline Tailwind or inline `style` attributes
- **@ownego/polaris-vue** — UI component library (listed as dependency, minimal direct use)

## Key Directories

| Path                     | Purpose                                                                  |
| ------------------------ | ------------------------------------------------------------------------ |
| `src/views/`             | Single route view (`PersonalizerView.vue`) — root layout                 |
| `src/components/canvas/` | Canvas rendering: bag SVG, draggable elements                            |
| `src/components/panels/` | Tool panels: Text, Image, Sticker, Icon, Adjust, Layers                  |
| `src/components/ui/`     | Reusable primitives: ColorStrip, FontChips, SliderRow, EmojiGrid         |
| `src/composables/`       | Shared state and logic: `useCanvas`, `useHistory`, `useToast`, `useDrag` |
| `src/types/index.ts`     | All shared TypeScript interfaces (`CanvasElement`, `SidebarItem`, etc.)  |
| `src/constants/index.ts` | Static data: STICKERS, ICONS, FONTS, COLORS, CANVAS_SIZE, TOOL_NAMES     |

## Build & Dev Commands

```bash
npm run dev       # Vite dev server with HMR
npm run build     # TypeScript check + production build
npm run preview   # Serve production build locally
```

No test runner is configured.

## Path Alias

`@` resolves to `src/` — configured in `vite.config.js:8`.

## Adding New Features / Fixing Bugs

**IMPORTANT**: When you work on a new feature, create a new git branch first. Then work on changes in that branch for the reminder of the session.

When fixing bugs, only work on the `fixBug` branch.

If using `feat-current`, continue developing the new feature on the current branch.

### Adding a new tool/panel

1. Add the tool entry to the `tools` array in `src/components/Sidebar.vue:42` (desktop) and mirror it in `src/components/MobileToolbar.vue` (mobile).
2. Register the display name in `TOOL_NAMES` at `src/constants/index.ts:23`.
3. Create the panel component in `src/components/panels/` — call `useCanvas()` directly for state access.
4. Mount it in both `src/components/RightPanel.vue:22` (desktop, `v-if` chain) and `src/components/MobilePanels.vue` (mobile).

### Adding a new canvas element type

1. Extend the `CanvasElement` type union at `src/types/index.ts:3` (`type: 'text' | 'sticker' | 'icon' | ...`).
2. Add an `add<Type>()` function in `src/composables/useCanvas.ts` — call `saveUndo()` before pushing to `elements`.
3. Add a render branch in `src/components/canvas/DraggableElement.vue:29` (`v-else-if` block).

### Mutating canvas state

- Always call `saveUndo()` before modifying `elements` so undo/redo stays consistent (`src/composables/useHistory.ts`).
- Use `updateEl(id, patch)` for partial updates — never mutate `elements` directly in a component.
- After any removal, clear `selectedId` if it matches the removed element (see `src/composables/useCanvas.ts:62-65`).

### Bug fixes

- Canvas state bugs → start at `src/composables/useCanvas.ts`.
- Drag/resize misbehaviour → `src/composables/useDrag.ts`; coordinate clamping uses `CANVAS_SIZE` as the logical unit (`src/constants/index.ts:32`).
- Panel not reflecting selection → check the `watch(selectedEl, ...)` block in the relevant panel component.
- Mobile/desktop layout discrepancy → both trees share the same `useCanvas` singleton but are rendered independently; check both `RightPanel.vue` and `MobilePanels.vue`.

## Additional Documentation

- `docs/architectural_patterns.md` — state management approach, component communication patterns, dual layout strategy, and other conventions that recur across the codebase.
