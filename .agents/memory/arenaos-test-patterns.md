---
name: ArenaOS test patterns
description: Patterns and gotchas for the arena-os Vitest + RTL test suite
---

## framer-motion must be mocked in jsdom tests

Pages using framer-motion (Landing, Dashboard) fail in jsdom. Mock with a Proxy:
```ts
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_target, tag: string) =>
      ({ children, ...rest }: any) => React.createElement(tag, rest, children),
  }),
  AnimatePresence: ({ children }) => children,
}));
```
Place vi.mock() BEFORE the import of the page component in the test file.

## vi.restoreAllMocks() strips vi.fn() implementations

vi.restoreAllMocks() in afterEach() removes the implementation from vi.fn() mocks set up in setup.ts (e.g. matchMedia). Causes "Cannot read properties of undefined (reading 'addEventListener')".

**Fix:** In use-mobile tests, call a local mockMatchMedia() helper before each test to re-apply the implementation.

## import.meta cast in setup.ts

To assign to import.meta.env in the test setup file, cast through unknown first:
```ts
(import.meta as unknown as Record<string, unknown>).env = { BASE_URL: '/', ... };
```

## feature-card.tsx had unused imports

Original zip had unused lucide icon imports and unused cn import in feature-card.tsx. Removed — noUnusedLocals: true was flagging them as TS errors.

## expect.anything() does not match undefined

In RTL/vitest, expect.anything() does NOT match null or undefined. Use explicit values.

## useChat test: console.error in stderr is expected

The "recovers gracefully when fetch throws" test produces console.error("Chat stream error") in stderr. This is intentional — the hook logs before resetting state. Not a test failure.
