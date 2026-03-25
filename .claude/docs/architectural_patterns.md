# Architectural Patterns

Patterns that recur across multiple files in the codebase. Check these before adding state, panels, canvas interactions, or new element types.

---

## 1. Module-level singleton composables (shared global state)

Refs in `useCanvas` and `useToast` are declared **outside** the exported function at module scope. Every component calling `useCanvas()` receives the same reactive refs — true singletons.

- `src/composables/useCanvas.ts:11-15` — `elements`, `selectedId`, `canvasScale`, `curColor`, `curFont` are module-level refs.
- `src/composables/useToast.ts:3-5` — `message`, `visible`, `timer` are module-level.

**Implication:** Do not restructure these as `reactive()` objects returned fresh per-call — that would break shared state.

---

## 2. Watch-based two-way panel sync

Panel components keep **local refs** for their controls and use `watch` to propagate changes to canvas state. They also watch `selectedEl` to pull in values when selection changes.

- `src/components/panels/TextPanel.vue:66-96` — watches `selectedEl` to populate color/font; watches local refs to write back via `updateEl`.
- `src/components/panels/AdjustPanel.vue:41-52` — watches `selectedEl` to populate sliders; watches each slider to call `updateEl`.
- `src/components/MobilePanels.vue:147-156` — mobile equivalents of the same sync pattern.

**Implication:** Panels are not purely controlled components. Local state is intentional — it avoids binding sliders directly to canvas state, which would cause feedback loops during drag.

---

## 3. Event-up / composable-down communication

Canvas components emit events upward to the view for coordination. All panels read/write canvas state directly via `useCanvas()` without emitting.

- `src/components/canvas/DraggableElement.vue:71-77` — emits `select`, `remove`, `move`, `resize`, `hint`.
- `src/views/PersonalizerView.vue:36-39` — `ProductCanvas` event handlers delegate to `updateEl`, `removeEl`, etc.
- `src/components/panels/LayersPanel.vue:60` — calls `selectEl`, `removeEl` directly without emitting.

**Implication:** Canvas layer is "dumb" (pure event emission); business logic stays in composables and views. Panels bypass this and call composables directly.

---

## 4. Factory functions for drag/resize behavior

`useDrag.ts` exports factory functions (`makeDragHandlers`, `makeResizeHandlers`) that accept callbacks and return `{ onPointerDown }`. This decouples pointer logic from component state.

- `src/composables/useDrag.ts:6` and `:53` — factory signatures.
- `src/components/canvas/DraggableElement.vue:81-90` — each element creates its own handler instances with element-specific callbacks.

Coordinate clamping uses `CANVAS_SIZE` (`src/constants/index.ts`) as the logical unit. `useDrag.ts:13-16` divides pointer delta by the DOM scale factor (`getBoundingClientRect().width / CANVAS_SIZE.w`) to normalize rendered-to-logical coordinates.

---

## 5. Dual layout: desktop and mobile share identical state

`PersonalizerView` renders two separate UI trees. The sidebar + right-panel tree (desktop) and the mobile toolbar + panels tree are independently shown/hidden via Tailwind `hidden md:flex` / `md:hidden`. Both read from the same `useCanvas` singleton.

- `src/views/PersonalizerView.vue:8-13` — desktop sidebar, hidden on mobile.
- `src/views/PersonalizerView.vue:67-73` — mobile toolbar and panels.

**Implication:** Adding a tool requires updating `Sidebar.vue` + `RightPanel.vue` (desktop) **and** `MobileToolbar.vue` + `MobilePanels.vue` (mobile), plus `TOOL_NAMES` in constants.

---

## 6. Tool key string system

Tools are identified by plain string keys (`'text'`, `'image'`, `'sticker'`, `'icon'`, `'adjust'`, `'layers'`). The key flows `Sidebar` → `PersonalizerView` → `RightPanel` as `activeTool`, and separately drives `MobilePanels` as `activePanel`.

- `src/constants/index.ts` — `TOOL_NAMES` maps key → display name.
- `src/components/Sidebar.vue:42-50` — tool list definition.
- `src/components/RightPanel.vue:22-27` — `v-if`/`v-else-if` chain switches panels by key.
- `src/components/MobileToolbar.vue:25-31` — mobile equivalent using `panelId` convention (`'mp-text'`, `'mp-image'`, …).

---

## 7. Undo/redo via deep-clone snapshots

`useHistory` stores full `CanvasElement[]` snapshots (via `JSON.parse(JSON.stringify(...))`) on two stacks. `saveUndo()` must be called manually **before** every mutation.

- `src/composables/useHistory.ts:8-10` — snapshot function.
- `src/composables/useCanvas.ts:30,41,51,61,82` — every mutation calls `saveUndo()` first.

Keyboard shortcuts (`Ctrl+Z` / `Cmd+Z`, `Ctrl+Y` / `Cmd+Shift+Z`) handled at `src/views/PersonalizerView.vue:134-143`.

**Implication:** Any new mutation function in `useCanvas` must call `saveUndo()` before modifying `elements`.

---

## 8. Canvas element type discriminant union

All canvas elements share a single `CanvasElement` interface with a `type` discriminant. Rendering and mutations branch on this field.

- `src/types/index.ts:1-14` — `type: 'text' | 'sticker' | 'icon'` union with shared fields (`id`, `x`, `y`, `scale`, `rotation`, `opacity`, `color`, `fontFamily`, `content`).
- `src/components/canvas/DraggableElement.vue:29-48` — `v-if`/`v-else-if` chain renders by type.

Adding a new element type requires extending the union, adding an `add<Type>()` function in `useCanvas.ts`, and adding a render branch in `DraggableElement.vue`.

---

## 9. Selection synchronization via computed + cleanup on removal

`selectedEl` is a computed derived from `selectedId`, always in sync with `elements`.

- `src/composables/useCanvas.ts:16-18` — `selectedEl = computed(() => elements.value.find(e => e.id === selectedId.value) ?? null)`.
- `src/composables/useCanvas.ts:62-65` — `removeEl` clears `selectedId` when the removed element was selected, preventing orphaned references.

Panels watch `selectedEl` (not `selectedId`) to react to both selection changes and property updates.

---

## 10. Responsive canvas with logical coordinate normalization

Canvas render size varies by viewport; drag/resize logic works in a fixed logical coordinate space.

- `src/views/PersonalizerView.vue:123-131` — `updateCanvasSize()` sets rendered `cvW`/`cvH` across six breakpoints (200px–396px wide).
- `src/constants/index.ts` — `CANVAS_SIZE = { w: 280, h: 320 }` is the fixed logical unit.
- `src/composables/useDrag.ts:13-16` — all pointer deltas divided by `rect.width / CANVAS_SIZE.w` before being applied, so elements move the same logical distance regardless of zoom.

**Implication:** New drag/transform logic must use the same normalization; never use raw DOM pixel values as canvas coordinates.
