# ArenaOS — Intelligent Stadium Operating System

**FIFA World Cup 2026 | Lusail International Stadium**

ArenaOS is a full-stack AI-powered stadium assistant built for FIFA World Cup 2026. It provides role-aware, context-grounded conversational AI across 9 operational domains — from navigation and emergency response to food queues and sustainability — all running on mock simulation data.

> All operational data in this project is **simulated for demonstration purposes**. No live stadium feeds are connected.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS v4 (dark glassmorphism theme) |
| Routing | Wouter |
| Animations | Framer Motion |
| Server state | TanStack Query v5 |
| Backend | Express 5 + Node.js (ESM) |
| Database | PostgreSQL via Drizzle ORM |
| AI | Google Gemini 2.5 Flash (via `@google/genai`) |
| API spec | OpenAPI 3.1 → generated TS client (Orval) |
| Monorepo | pnpm workspaces |
| Testing | Vitest + React Testing Library (frontend), Vitest + Supertest (backend) |
| Linting | ESLint 9 (flat config) + typescript-eslint + eslint-plugin-react-hooks |

---

## Features

### Chat-driven AI (SSE streaming)

| Feature | What the AI does |
|---|---|
| **Navigation** | Routes fans to seats/gates using live crowd levels |
| **Crowd Intelligence** | Compares all 5 gates and recommends least-congested entry |
| **Emergency Assistant** | Surfaces nearest first-aid, fire assembly, or evacuation route |
| **Accessibility** | Generates barrier-free routes (elevators, ramps, assistance desks) |
| **Lost & Found** | Guides a structured multi-turn flow → formal incident report |
| **Transportation Advisor** | Compares metro/bus/taxi wait times, flags delays |
| **Sustainability Coach** | Recommends refill stations, recycling hubs, green exits with CO₂ estimates |
| **Food Finder** | Filters courts by dietary need and queue time |
| **Multilingual Support** | Responds in Spanish, French, Arabic, Hindi, or Tamil |

### Organizer Command Center

- **AI Operational Summary** — Gemini synthesises 8 mock KPIs into an executive brief + 3 prioritised action recommendations
- **Announcement Generator** — Produces professional stadium announcements in multiple languages

---

## Project Structure

```
artifacts/
  arena-os/          # React + Vite frontend
    src/
      pages/         # Landing, Role, Dashboard, Chat, Organizer, NotFound
      components/    # chat/, layout/, organizer/ UI components
      hooks/         # useChat (SSE streaming), useIsMobile
      context/       # AppContext (role, language, conversation state)
      __tests__/     # Vitest + React Testing Library test suite
  api-server/        # Express 5 backend
    src/
      routes/gemini/ # Chat streaming, organizer endpoints, system prompt builder
      data/          # Server-side mock stadium data + context retrieval
      __tests__/     # Vitest + Supertest test suite (3 test files)
lib/
  db/                # Drizzle ORM schema (conversations, messages tables)
  api-spec/          # openapi.yaml → codegen source of truth
  api-client-react/  # Generated TanStack Query hooks (Orval)
  api-zod/           # Generated Zod validation schemas (Orval)
  integrations-gemini-ai/  # Shared Gemini AI client wrapper
```

---

## Development

### Prerequisites

- Node.js 24
- pnpm

### Install

```bash
pnpm install
```

### Environment Variables

| Variable | Required by | Description |
|---|---|---|
| `DATABASE_URL` | `lib/db`, `api-server` | PostgreSQL connection string |
| `GEMINI_API_KEY` | `api-server` | Google Gemini API key |
| `PORT` | All services | Port (assigned by workflow) |
| `BASE_PATH` | `arena-os` | URL base path (assigned by workflow) |

### Run

```bash
# API server (port 8080, path /api)
pnpm --filter @workspace/api-server run dev

# Frontend (port 22890, path /)
pnpm --filter @workspace/arena-os run dev
```

### Database schema

```bash
pnpm --filter @workspace/db run push
```

### Regenerate API client after spec changes

```bash
pnpm --filter @workspace/api-spec run codegen
```

### Lint

```bash
pnpm exec eslint .
```

### Typecheck

```bash
pnpm run typecheck
```

---

## Testing

### Backend (API server)

```bash
pnpm --filter @workspace/api-server run test
```

3 test files covering:
- Context retrieval logic (keyword + feature-based selection)
- Route validation (400/404/503 guard logic)
- System prompt builder (role, feature, language, context injection)

### Frontend (arena-os)

```bash
pnpm --filter @workspace/arena-os run test
```

Tests cover:
- `useChat` hook (streaming state machine, null guard, error recovery)
- `useIsMobile` hook (mobile/desktop breakpoint detection)
- Core components: `ChatInput`, `MessageBubble`, `FeatureCard`, `Topbar`
- All pages: Landing, RoleSelection, Dashboard, OrganizerDashboard, NotFound

---

## Security Notes

- `GEMINI_API_KEY` is read only in the Express server process via `process.env`
- The key is **never** bundled into the frontend Vite build
- All AI calls go through the backend — the browser never contacts Gemini directly
- The frontend communicates with the backend via `/api/*` routes proxied through Replit's gateway
- No hardcoded credentials anywhere in the codebase — verified before any public push

---

## Simulation Mode

The amber **Simulation Mode** badge visible in the top bar on every page indicates that all data — crowd levels, queue times, transport status, incident counts — is mock static data defined in `src/data/` and `artifacts/api-server/src/data/`. No live stadium APIs are connected. The system is architected to swap in real data sources without changing the AI layer.
