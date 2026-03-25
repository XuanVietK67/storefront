# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project Overview

CustomMaker is a single-page bag personalizer. Users place text, stickers, and icons onto a product canvas, adjust their properties, and add to cart.

## Tech Stack

- **Vue 3** (Composition API, `<script setup>`) + **TypeScript 5.4**
- **Vite 5** — build and dev server; `@` resolves to `src/` (`vite.config.js:8`)
- **Tailwind CSS v3** — all styling is inline Tailwind classes or inline `style` attributes; no CSS modules
- **@ownego/polaris-vue** — listed as dependency, minimal direct use

## Key Directories

| Path | Purpose |
| --- | --- |
| `src/views/PersonalizerView.vue` | Root layout — mounts desktop + mobile trees, keyboard shortcuts |
| `src/components/canvas/` | `ProductCanvas.vue` (scaling), `DraggableElement.vue` (render + drag), `BagSvg.vue` |
| `src/components/panels/` | Tool panels: Text, Image, Sticker, Icon, Adjust, Layers |
| `src/components/ui/` | Reusable primitives: ColorStrip, FontPicker, SliderRow, EmojiGrid |
| `src/composables/` | Singleton state: `useCanvas`, `useHistory`, `useToast`, `useDrag` |
| `src/types/index.ts` | All shared TypeScript interfaces (`CanvasElement`, `SidebarItem`, …) |
| `src/constants/index.ts` | Static data: STICKERS, ICONS, FONTS, COLORS, CANVAS_SIZE, TOOL_NAMES |

## Build & Dev Commands

```bash
npm run dev      # Vite dev server with HMR
npm run build    # TypeScript check + production build
npm run preview  # Serve production build locally
```

No test runner is configured.

## Branching Rules

- **New features** — create a new git branch first; work there for the session.
- **Bug fixes** — work on the `fixBug` branch only.

## Adding a New Tool/Panel

1. Add entry to `tools` array in `src/components/Sidebar.vue:42` (desktop) and mirror in `src/components/MobileToolbar.vue`.
2. Register display name in `TOOL_NAMES` at `src/constants/index.ts`.
3. Create panel in `src/components/panels/` — call `useCanvas()` directly for state.
4. Mount in `src/components/RightPanel.vue:22` (desktop `v-if` chain) and `src/components/MobilePanels.vue`.

## Adding a New Canvas Element Type

1. Extend type union at `src/types/index.ts:3`.
2. Add `add<Type>()` in `src/composables/useCanvas.ts` — call `saveUndo()` before pushing to `elements`.
3. Add render branch (`v-else-if`) in `src/components/canvas/DraggableElement.vue:29`.

## Mutating Canvas State

- Call `saveUndo()` **before** every mutation (`src/composables/useHistory.ts`).
- Use `updateEl(id, patch)` for partial updates — never mutate `elements` directly in components.
- After removal, clear `selectedId` when it matches the removed element (`src/composables/useCanvas.ts:62-65`).

## Bug Fix Starting Points

| Symptom | Start here |
| --- | --- |
| Canvas state wrong | `src/composables/useCanvas.ts` |
| Drag/resize off | `src/composables/useDrag.ts` — coordinate clamping uses `CANVAS_SIZE` as logical unit |
| Panel not reflecting selection | `watch(selectedEl, …)` in the relevant panel component |
| Mobile/desktop discrepancy | Both trees share same `useCanvas` singleton; check `RightPanel.vue` and `MobilePanels.vue` |

## Additional Documentation

- `.claude/docs/architectural_patterns.md` — singleton composables, watch-based panel sync, event-up/composable-down communication, dual layout strategy, undo/redo, and other patterns that recur across the codebase. **Check this when adding state, panels, or canvas interactions.**
