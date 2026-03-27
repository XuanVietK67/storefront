# Canvas API Conventions

Rules for reading and mutating canvas state.

## Reads

- Always access canvas state via `useCanvas()` — never import refs directly from the module.
- Use `selectedEl` (the computed) to react to selection. Do not watch `selectedId` directly in panels.

## Mutations

- Call `saveUndo()` **before** every mutation that modifies `elements`.
- Use `updateEl(id, patch)` for partial field updates. Never spread-assign or mutate `elements.value[i]` in place from a component.
- After `removeEl`, verify `selectedId` is cleared when the removed element was selected (`useCanvas.ts:62-65`).

## Adding state

- New module-level refs belong in `src/composables/useCanvas.ts`, declared outside the exported function (singleton pattern).
- Do not add reactive state to components that should be shared — use the composable instead.

## Coordinate system

- All positions and sizes are in the logical coordinate space defined by `CANVAS_SIZE = { w: 280, h: 320 }`.
- Never store or compute positions in DOM pixels. Normalize all pointer deltas: `delta / (rect.width / CANVAS_SIZE.w)`.
