# Skill: deploy

Build and validate the CustomMaker production bundle.

## Trigger

Invoked when the user asks to deploy, build for production, or check the production bundle.

## Steps

1. Run `npm run build`.
   - On failure: report the exact TypeScript or Vite error. Do not auto-fix without user confirmation.
   - On success: capture the bundle output summary (file sizes).
2. Run `npm run preview` to serve the production build locally.
3. Report:
   - Build status (pass/fail)
   - Any warnings emitted during build
   - Output bundle sizes from the Vite summary
4. Do not push or deploy to any remote environment unless the user explicitly asks.

## Notes

- `npm run build` runs `vue-tsc && vite build` — TypeScript errors will fail the build.
- The dev server (`npm run dev`) is not a substitute for a production build check.
