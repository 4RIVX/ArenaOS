# ArenaOS — Intelligent Stadium Operating System

AI-powered stadium assistant for FIFA World Cup 2026, built on Google Gemini. Role-aware chat (fan / volunteer / staff / organizer) with SSE streaming and mock Lusail stadium data.

## Run & Operate

- `pnpm --filter @workspace/arena-os run dev` — run the frontend (port 22890, path `/`)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, path `/api`)
- `pnpm --filter @workspace/api-server run test` — run API server tests (Vitest)
- `pnpm --filter @workspace/arena-os run test` — run frontend tests (Vitest + RTL)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm exec eslint .` — lint all TypeScript files
- Required env: `DATABASE_URL` (Postgres), `GEMINI_API_KEY` (Google Gemini)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind CSS v4 + Wouter + Framer Motion
- Backend: Express 5 (ESM)
- DB: PostgreSQL + Drizzle ORM
- AI: Google Gemini 2.5 Flash (`@google/genai`)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Testing: Vitest + React Testing Library (frontend), Vitest + Supertest (backend)
- Linting: ESLint 9 flat config + typescript-eslint + eslint-plugin-react-hooks
- Build: esbuild (CJS bundle for API server)

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for all API contracts
- `lib/db/src/schema/` — Drizzle schema (conversations + messages tables)
- `lib/api-client-react/src/generated/` — generated React Query hooks
- `lib/api-zod/src/generated/` — generated Zod schemas
- `artifacts/arena-os/src/context/AppContext.tsx` — global app state (role, language, conversation)
- `artifacts/api-server/src/data/stadiumData.ts` — mock stadium data (gates, food courts, etc.)
- `artifacts/api-server/src/data/contextRetrieval.ts` — keyword-based context filtering for Gemini prompts
- `artifacts/api-server/src/routes/gemini/systemPrompt.ts` — role/feature/language-aware prompt builder

## Architecture decisions

- **SSE streaming** over WebSockets for Gemini responses — simpler, proxy-friendly, no keep-alive complexity
- **Structured context retrieval** (no RAG/embeddings) — keyword + feature matching injects only relevant mock data into prompts, keeping context small and demos explainable
- **Role-aware system prompts** — fan/volunteer/staff/organizer get different instruction sets; feature prompts (emergency, food, etc.) layer on top
- **Database-backed conversation history** — full message history persisted in Postgres per conversation; Gemini receives accumulated history on each message
- **No AI calls in the frontend** — all Gemini traffic goes through the Express backend; `GEMINI_API_KEY` is never exposed to the browser

## Product

ArenaOS provides a conversational interface over 9 stadium domains via SSE chat. Fans can get navigation help, crowd-level guidance, transport info, and emergency assistance. Staff and organizers get a command center with AI-generated KPI summaries and announcement drafting.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After any change to `lib/api-spec/openapi.yaml`, run `pnpm --filter @workspace/api-spec run codegen` before touching frontend or backend route code — generated types must be in sync
- `noUnusedLocals: true` and `strictFunctionTypes: true` are enabled in `tsconfig.base.json` — new code must not introduce unused variables
- Drizzle `push` modifies the dev DB in-place; production schema changes are handled by Replit's Publish flow automatically
- The `contextRetrieval.ts` file has no `console.log` calls in production — diagnostic labels are embedded in the `label` field of each `RetrievedContext` object instead

## Pointers

- See `README.md` for full project overview, feature matrix, and testing guide
- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
