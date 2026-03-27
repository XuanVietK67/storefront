# /project:deploy

Build and validate the production bundle.

## Steps

1. Run `npm run build` — this runs the TypeScript check and Vite production build.
2. If the build fails, report the exact error. Do not attempt to patch type errors silently.
3. If the build succeeds, run `npm run preview` to serve the bundle locally for manual smoke-testing.
4. Confirm the personalizer canvas loads, tools are accessible on both desktop and mobile widths, and undo/redo works.
5. Report bundle output size from the Vite build summary.
