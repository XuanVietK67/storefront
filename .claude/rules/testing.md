# Testing

No automated test runner is configured in this project.

## Manual verification checklist

After any canvas mutation change:
- [ ] Add an element → undo → redo: element returns correctly.
- [ ] Remove an element: `selectedId` is cleared, no orphan reference in panel.
- [ ] Drag and resize work at multiple viewport widths (mobile + desktop).

After any panel change:
- [ ] Panel populates correctly when a matching element is selected.
- [ ] Panel writes back to canvas state on change (verify via visual update on canvas).
- [ ] Deselecting clears panel controls.

After any tool/sidebar change:
- [ ] Tool appears and is clickable on desktop (sidebar) and mobile (bottom toolbar).
- [ ] Correct panel renders on tool activation in both layouts.

## Build as type-check

Run `npm run build` as a substitute type-check before committing. Fix all TypeScript errors before pushing.
