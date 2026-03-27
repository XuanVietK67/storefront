# /project:fix-issue

Diagnose and fix a reported bug in CustomMaker.

## Usage

/project:fix-issue <symptom or issue description>

## Steps

1. Map the symptom to a starting file using the bug fix table in `CLAUDE.md`.
2. Read the relevant composable or component — do not guess before reading.
3. Identify the root cause. Check:
   - Was `saveUndo()` omitted before a mutation?
   - Is `selectedId` being cleared after element removal?
   - Are mobile and desktop both updated (both trees share the same `useCanvas` singleton)?
   - Are drag coordinates being normalized using `CANVAS_SIZE`?
4. Create a `fixBug/<short-name>` branch before making any changes.
5. Apply the minimal fix. Do not refactor surrounding code.
6. Run `npm run build` to confirm no type errors.
7. Summarize the root cause and the change made.
