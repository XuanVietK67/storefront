# /project:review

Review the current working changes for correctness, consistency with project conventions, and potential bugs.

## Steps

1. Run `git diff` to see all unstaged changes, and `git diff --staged` for staged ones.
2. For each changed file:
   - Check that canvas mutations call `saveUndo()` before modifying `elements`.
   - Check that components use `updateEl(id, patch)` — never mutate `elements` directly.
   - Check that new tools are registered in both desktop (`Sidebar.vue`, `RightPanel.vue`) and mobile (`MobileToolbar.vue`, `MobilePanels.vue`).
   - Check that new element types extend the `CanvasElement` union in `src/types/index.ts` and add a render branch in `DraggableElement.vue`.
   - Verify no raw DOM pixel values are used as canvas coordinates — all drag/resize deltas must be normalized via `CANVAS_SIZE`.
3. Flag any TypeScript type errors or implicit `any` usages.
4. Report issues grouped by file with line references.
