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
| `src/i18n/index.ts` | vue-i18n instance, `setLocale()`, `LOCALES` array, locale persistence |
| `src/i18n/locales/` | One file per locale: `en.ts`, `vi.ts`, `ja.ts`, `zh.ts`, `ko.ts` |

## Build & Dev Commands

```bash
npm run dev      # Vite dev server with HMR
npm run build    # TypeScript check + production build
npm run preview  # Serve production build locally
```

No test runner is configured.

## Branching Rules

- **New features(prompt start by feat)** — create a new git branch first feat/name of feature; work there for the session.
- **Bug fixes** — work on the `fixBug/name of bug` branch only.

## Adding a New Tool/Panel

1. Add entry to `tools` computed array in `src/components/Sidebar.vue` (desktop) and mirror in `src/components/MobileToolbar.vue`. Labels must use `t('tools.<key>')` — not hardcoded strings.
2. Add the key → display name to **all five locale files** in `src/i18n/locales/` under the `tools` namespace.
3. Create panel in `src/components/panels/` — call `useCanvas()` directly for state. Every user-visible string in the panel must use `t()`.
4. Mount in `src/components/RightPanel.vue` (desktop `v-if` chain) and `src/components/MobilePanels.vue`.
5. Add any panel-specific translation keys to all locale files.

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
| Language switch doesn't update a label | The label is in a static array — convert to `computed(() => [...])` using `t()` |
| Missing translation key (shows raw key) | Key absent from one or more `src/i18n/locales/*.ts` files — add to all five |

## i18n (Multi-language)

The app supports EN, VI, JA, ZH, KO via vue-i18n v9 (`legacy: false`).

**Rules — always follow these when writing or editing any component:**

- Never hardcode user-visible strings. Every label, placeholder, button text, toast message, and hint must use `t('namespace.key')`.
- In components: `import { useI18n } from 'vue-i18n'` → `const { t } = useI18n()`.
- In composables (no component context): import the `i18n` instance from `src/i18n/index.ts` → `i18n.global.t('key')`.
- Static label arrays (`tools`, `filter presets`, etc.) that use `t()` **must** be wrapped in `computed()`, otherwise locale changes won't update them.
- When adding any new string, add the key to **all five** locale files simultaneously.

**Locale file structure:** keys are grouped by namespace — `nav`, `tools`, `panel`, `camera`, `textEdit`, `canvas`, `toast`, `lang`. Add new keys under the closest matching namespace.

**Locale persistence:** `setLocale(code)` in `src/i18n/index.ts` updates the active locale and saves to `localStorage` under `custommaker_locale`.

## Additional Documentation

- `.claude/docs/architectural_patterns.md` — singleton composables, watch-based panel sync, event-up/composable-down communication, dual layout strategy, undo/redo, vue-i18n reactivity, and other patterns that recur across the codebase. **Check this when adding state, panels, canvas interactions, or translated strings.**
- `.claude/rules/i18n.md` — full i18n rules and the checklist to follow for every feature/fix.
