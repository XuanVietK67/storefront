# Code Style

Rules that apply to all code in this repository.

## Vue 3

- Use `<script setup>` with the Composition API. No Options API.
- Import composables at the top of `<script setup>`. Call `useCanvas()` directly in panels — do not prop-drill state.
- Keep template logic minimal — computed properties and methods belong in `<script setup>`.

## TypeScript

- All new interfaces go in `src/types/index.ts`.
- No implicit `any`. Annotate function parameters explicitly when inference is unclear.
- Use the `CanvasElement` discriminant union (`type: 'text' | 'sticker' | 'icon'`) — do not widen to a generic object.

## Tailwind CSS

- All styling via inline Tailwind classes or inline `style` attributes. No CSS modules, no `<style>` blocks.
- Responsive variants use Tailwind's `md:` prefix. Mobile-first.

## General

- No `console.log` left in committed code.
- Prefer explicit over clever — readable `v-if` chains over dynamic component tricks.
