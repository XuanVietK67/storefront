# Architectural Patterns

## 1. Module-level singleton composables (shared global state)

Refs in `useCanvas` and `useToast` are declared **outside** the exported function at module scope. This makes them true singletons — every component calling `useCanvas()` receives the same reactive refs.

- `src/composables/useCanvas.ts:11-15` — `elements`, `selectedId`, `canvasScale`, `curColor`, `curFont` are module-level refs.
- `src/composables/useToast.ts:3-5` — `message`, `visible`, and `timer` are module-level.

**Implication:** Do not restructure these as `reactive()` objects returned fresh per-call — that would break shared state.

## 2. Watch-based two-way panel sync

Panel components keep **local refs** for their controls and use `watch` to propagate changes to canvas state. They also watch `selectedEl` to pull in values when selection changes.

- `src/components/panels/TextPanel.vue:66-67` — watches `color` and `font` to write back to `curColor`/`curFont`.
- `src/components/panels/AdjustPanel.vue:41-51` — watches `selectedEl` to populate sliders; watches each slider to call `updateEl`.

**Implication:** Panels are not purely controlled components. Local state is intentional — it avoids binding sliders directly to canvas state, which would cause feedback loops during drag.

## 3. Event-up / composable-down communication

Canvas components emit events upward to the view for coordination, while all panels read/write canvas state directly via `useCanvas()`.

- `src/components/canvas/DraggableElement.vue:66-72` — emits `select`, `remove`, `move`, `resize`, `hint`.
- `src/views/PersonalizerView.vue:36-39` — `ProductCanvas` event handlers call `updateEl`, `removeEl`, etc. from `useCanvas`.
- `src/components/panels/LayersPanel.vue:60` — calls `selectEl`, `removeEl` directly without emitting.

## 4. Factory functions for drag/resize behavior

`useDrag.ts` exports factory functions (`makeDragHandlers`, `makeResizeHandlers`) that accept callbacks and return `{ onPointerDown }`. This decouples pointer logic from component state.

- `src/composables/useDrag.ts:6` and `53` — factory signatures.
- `src/components/canvas/DraggableElement.vue:76-85` — each element creates its own handler instances with element-specific callbacks.

Coordinate clamping uses `CANVAS_SIZE` (`src/constants/index.ts:32`) as the logical unit regardless of rendered size — `useDrag.ts:13-16` divides by the DOM scale factor to normalize.

## 5. Dual layout: desktop and mobile share identical state

`PersonalizerView` renders two entirely separate UI trees. The sidebar+right-panel tree (desktop) and the mobile toolbar+panels tree are independently hidden via `hidden md:flex` / `md:hidden`. Both read from the same `useCanvas` singleton.

- `src/views/PersonalizerView.vue:8-13` — desktop sidebar, hidden on mobile.
- `src/views/PersonalizerView.vue:67-73` — mobile toolbar and panels.

**Implication:** Adding a new tool requires updating both `Sidebar.vue` (desktop) and `MobileToolbar.vue`/`MobilePanels.vue` (mobile), plus `RightPanel.vue` and `TOOL_NAMES` in constants.

## 6. Tool key string system

Tools are identified by plain string keys (`'text'`, `'image'`, `'sticker'`, `'icon'`, `'adjust'`, `'layers'`). This key flows from `Sidebar` → `PersonalizerView` → `RightPanel` as `activeTool`, and separately drives `MobilePanels` as `activePanel`.

- `src/constants/index.ts:23-30` — `TOOL_NAMES` maps key → display name.
- `src/components/Sidebar.vue:42-50` — tool list definition.
- `src/components/RightPanel.vue:22-27` — `v-if`/`v-else-if` chain switches panels by key.

## 7. Undo/redo via deep-clone snapshots

`useHistory` stores full `CanvasElement[]` snapshots (via `JSON.parse(JSON.stringify(...))`) on two stacks. `saveUndo()` must be called manually before every mutation.

- `src/composables/useHistory.ts:8-10` — snapshot function.
- `src/composables/useCanvas.ts:31,42,52,63,82` — every mutation calls `saveUndo()` first.

**Implication:** Any new mutation function in `useCanvas` must call `saveUndo()` before modifying `elements`.
