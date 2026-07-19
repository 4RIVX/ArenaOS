---
name: ArenaOS architecture decisions
description: Key constraints and gotchas found during ArenaOS implementation
---

## Express handler return pattern

`noImplicitReturns: true` was already set in tsconfig.base.json. Express route handlers with mixed early returns must use:
```ts
res.status(400).json({ error: '...' });
return;
```
NOT `return res.status(400).json(...)` — that creates a mixed void/Response return type triggering TS7030.

**Why:** TypeScript TS7030 fires when some code paths return a value (Response) and some return void.

**How to apply:** All new Express route handlers should use the split pattern. Applies to all files in artifacts/api-server/src/routes/.

## TS strictness flags

Both `noUnusedLocals: true` and `strictFunctionTypes: true` are enabled in tsconfig.base.json. New code must not introduce unused imports or variables. Underscore prefix (`_`) silences unused parameters but NOT unused locals — locals must be removed entirely.

## sustainabilityPoints not used in organizer routes

The stadiumData export includes sustainabilityPoints but it is NOT used in organizer.ts — remove from imports if not needed.
