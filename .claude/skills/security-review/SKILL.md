# Skill: security-review

Perform a security review of the CustomMaker frontend codebase.

## Trigger

Invoked when the user asks for a security review, audit, or vulnerability check.

## Steps

1. Check `src/composables/useCanvas.ts` for unsafe element mutations that could be exploited via prototype pollution.
2. Search for any `innerHTML`, `v-html`, or `eval` usage — these are XSS vectors in a Vue app.
3. Check `src/views/PersonalizerView.vue` for keyboard event handlers that process external input without sanitization.
4. Check any `CartOrder` or design save/load logic for unsafe `JSON.parse` on untrusted input.
5. Verify no secrets, API keys, or tokens are hardcoded in `src/constants/index.ts` or any `.env`-adjacent files.
6. Check that `CLAUDE.local.md` and `.env` files are in `.gitignore`.
7. Report findings by severity: Critical, High, Medium, Low, Info.

## Output format

```
## Security Review

### Critical
- <finding>

### High
- <finding>

### Medium / Low / Info
- <finding>
```
