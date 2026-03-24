# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # Production build
npm run preview   # Preview production build
```

No test runner is configured.

## Architecture

This is a Vue 3 + Vite product personalizer app ("CustomMaker") — a single-page tool where users decorate a bag canvas with text, stickers, icons, and images, then add to cart.

### State management — module-level singletons in composables

`useCanvas` (`src/composables/useCanvas.ts`) is the central store. Its refs (`elements`, `selectedId`, `canvasScale`, `curColor`, `curFont`) are declared at module scope, so all components share the same instance. Every mutation goes through this composable — components never mutate canvas state directly.

`useHistory` manages undo/redo as two stacks of deep-cloned `CanvasElement[]` snapshots. Call `saveUndo()` before any destructive operation; pass `restoreElements` and `showToast` callbacks to `doUndo`/`doRedo`.

`useToast` and `useDrag` follow the same singleton pattern.

### Layout — desktop vs mobile split

`PersonalizerView` is the root layout. It renders two separate UI trees that share the same canvas state:

- **Desktop (md+):** `Sidebar` (left, tool selector) + `ProductCanvas` (center) + `RightPanel` (right, active tool panel)
- **Mobile:** `MobileToolbar` (bottom icon bar) + `MobilePanels` (slide-up sheet) + `MobileCta` (add-to-cart)

Canvas dimensions are recalculated on resize via `updateCanvasSize()` with explicit breakpoint thresholds.

### Canvas rendering

`ProductCanvas` wraps `BagSvg` (the bag artwork) and a `DraggableElement` per canvas item. The inner div is CSS-scaled by `canvasScale` for zoom. Drag/resize interactions are handled by factory functions in `useDrag.ts` — `makeDragHandlers` and `makeResizeHandlers` — which clamp coordinates to `CANVAS_SIZE` (`280×320`, the logical canvas unit).

### Panel system

`RightPanel` (desktop) and `MobilePanels` (mobile) conditionally render one of six panels based on `activeTool`/`activePanel`: `TextPanel`, `ImagePanel`, `StickerPanel`, `IconPanel`, `AdjustPanel`, `LayersPanel`. All panels call into `useCanvas` directly.

### Path alias

`@` resolves to `src/` (configured in `vite.config.js`).

### Styling

Tailwind CSS with custom design tokens (colors like `text-fore`, `text-faint`, `bg-surface2`, `border-line`), custom font classes (`font-syne`, `font-dm`), and a dark warm-brown theme. No CSS modules — all styling is inline Tailwind or inline `style` attributes.
