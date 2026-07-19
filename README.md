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

## Challenge Requirements Coverage

This section maps each Prompt Wars Challenge 4 requirement to the specific file(s) and mechanism that implement it.

### 1. Navigation

**Requirement:** Help attendees find seats, gates, facilities, and routes inside the stadium.

| Layer | File | What it does |
|---|---|---|
| UI entry point | `artifacts/arena-os/src/pages/dashboard.tsx` | "Navigation" feature card (`id: 'navigation'`); clicking it pre-fills the chat with "How do I get to my seat from Gate A?" |
| Context selection | `artifacts/api-server/src/data/contextRetrieval.ts` | `featureIs(feature, 'navigation')` or keyword match (`gate`, `entrance`, `exit`, `seat`, `section`, `where`, `direction`, …) — injects gate crowd levels + stadium layout into the prompt |
| Mock data | `artifacts/api-server/src/data/stadiumData.ts` | `gates` array (5 gates: position, crowdLevel `low`/`medium`/`high`, `openStatus`) |
| Frontend data | `artifacts/arena-os/src/data/gates.ts` | Client-side gate reference used by suggestion chips |
| AI behaviour | `artifacts/api-server/src/routes/gemini/systemPrompt.ts` | `ROLE_INSTRUCTIONS.fan/volunteer/staff` — role-appropriate navigation language (action-oriented for fans, operational for staff) |

---

### 2. Crowd Management

**Requirement:** Monitor and communicate crowd density to optimise gate flow and safety.

| Layer | File | What it does |
|---|---|---|
| UI entry point | `artifacts/arena-os/src/pages/dashboard.tsx` | "Crowd Intel" feature card (`id: 'crowd'`); prompt "Which gate is least crowded right now?" |
| Context selection | `artifacts/api-server/src/data/contextRetrieval.ts` | Navigation and emergency branches both inject gate `crowdLevel` data; the AI ranks gates by density in its response |
| Mock data | `artifacts/api-server/src/data/stadiumData.ts` | `gates` — each gate carries `crowdLevel: 'low' \| 'medium' \| 'high'` and `openStatus: boolean` |
| Organizer KPI | `artifacts/arena-os/src/pages/organizer.tsx` | "Crowd Density" metric card (87%, amber status) is one of 8 KPIs fed into the AI Operational Summary |
| AI behaviour | `artifacts/api-server/src/routes/gemini/systemPrompt.ts` | `ROLE_INSTRUCTIONS.organizer` — "Strategic crowd flow and capacity management … recommend activating Gate E overflow" |

---

### 3. Accessibility

**Requirement:** Provide barrier-free routing and assistance information for attendees with mobility or sensory needs.

| Layer | File | What it does |
|---|---|---|
| UI entry point | `artifacts/arena-os/src/pages/dashboard.tsx` | "Accessibility" feature card (`id: 'accessibility'`); prompt "Show me accessible routes and wheelchair-friendly facilities" |
| Context selection | `artifacts/api-server/src/data/contextRetrieval.ts` | `featureIs(feature, 'accessibility')` or keyword match (`wheelchair`, `lift`, `ramp`, `disabled`, `visual`, `hearing`, …) — injects full `accessibilityFeatures` list, filtering to operational-only count |
| Mock data | `artifacts/api-server/src/data/stadiumData.ts` | `accessibilityFeatures` (8 entries: elevators, accessible restrooms, wheelchair routes, assistance desks — each with `isOperational` flag) |
| Frontend data | `artifacts/arena-os/src/data/accessibility.ts` | Client-side accessibility reference |
| AI behaviour | `artifacts/api-server/src/routes/gemini/systemPrompt.ts` | `FEATURE_INSTRUCTIONS.accessibility` — instructs AI to check elevator operational status before recommending it, prefer ramp/wheelchair-route data, direct to nearest staffed assistance desk |

---

### 4. Transportation

**Requirement:** Surface real-time transport options (metro, bus, taxi, shuttle) and recommend the best route out of the stadium.

| Layer | File | What it does |
|---|---|---|
| UI entry point | `artifacts/arena-os/src/pages/dashboard.tsx` | "Transport" feature card (`id: 'transport'`); prompt "What is the fastest way to leave the stadium?" |
| Context selection | `artifacts/api-server/src/data/contextRetrieval.ts` | `featureIs(feature, 'transport')` or keyword match (`metro`, `bus`, `taxi`, `shuttle`, `train`, `ride`, …) — injects all `transportOptions` sorted by wait time, flagging delayed/cancelled services |
| Mock data | `artifacts/api-server/src/data/stadiumData.ts` | `transportOptions` (6 entries: 2 metro lines, 2 buses, 2 taxi/ride-share — each with `waitTime`, `status: 'on-time' \| 'delayed' \| 'cancelled'`, `destination`) |
| Frontend data | `artifacts/arena-os/src/data/transport.ts` | Client-side transport reference |
| AI behaviour | `artifacts/api-server/src/routes/gemini/systemPrompt.ts` | `FEATURE_INSTRUCTIONS.transport` — instructs AI to compare all options by wait time, recommend one with reasoning, explicitly flag delayed/cancelled services, include walking time estimate |

---

### 5. Sustainability

**Requirement:** Guide attendees to recycling points, water refill stations, and green exit options; quantify environmental benefit.

| Layer | File | What it does |
|---|---|---|
| UI entry point | `artifacts/arena-os/src/pages/dashboard.tsx` | "Sustainability" feature card (`id: 'sustain'`); prompt "Where is the nearest recycling bin?" |
| Context selection | `artifacts/api-server/src/data/contextRetrieval.ts` | `featureIs(feature, 'sustain', 'sustainability')` or keyword match (`water`, `refill`, `recycle`, `green`, `eco`, `co2`, …) — injects `sustainabilityPoints` filtered to operational stations |
| Mock data | `artifacts/api-server/src/data/stadiumData.ts` | `sustainabilityPoints` (6 entries: 3 water refill stations, 3 recycling hubs — each with `isOperational`, `categories` of accepted waste) |
| Frontend data | `artifacts/arena-os/src/data/sustainability.ts` | Client-side sustainability reference |
| AI behaviour | `artifacts/api-server/src/routes/gemini/systemPrompt.ts` | `FEATURE_INSTRUCTIONS.sustain` — instructs AI to always append an estimated CO₂ saving line (e.g. "Using the metro instead of a car saves approx. 2.1kg CO₂"); handles water, recycling, and green-exit sub-intents |
| Organizer KPI | `artifacts/arena-os/src/pages/organizer.tsx` | "Waste Collection" metric (73% bin capacity) included in the 8-KPI payload fed to the AI Operational Summary |

---

### 6. Multilingual Assistance

**Requirement:** Respond to attendees in their preferred language; support the linguistic diversity of a global World Cup audience.

| Layer | File | What it does |
|---|---|---|
| UI entry point | `artifacts/arena-os/src/pages/dashboard.tsx` | "Translate" feature card (`id: 'translate'`); prompt "Help me in my language" |
| Language selector | `artifacts/arena-os/src/components/layout/topbar.tsx` | Dropdown to choose Spanish, French, Arabic, Hindi, Tamil, or English — stored in `AppContext` |
| State management | `artifacts/arena-os/src/context/AppContext.tsx` | `selectedLanguage` state; passed to every chat request as the `language` query parameter |
| Prompt enforcement | `artifacts/api-server/src/routes/gemini/systemPrompt.ts` | `LANGUAGE_NAMES` map + `languageInstructions` block: when language ≠ English, the system prompt instructs Gemini to "Respond ENTIRELY in [language]. Do not use English in your response." The AI still understands input in either language. |
| Supported languages | `artifacts/api-server/src/routes/gemini/systemPrompt.ts` | Spanish (Español), French (Français), Arabic (العربية), Hindi (हिन्दी), Tamil (தமிழ்) |
| API wiring | `artifacts/api-server/src/routes/gemini/index.ts` | `selectedLanguage` extracted from query string, forwarded to `buildSystemPrompt` |

---

### 7. Operational Intelligence

**Requirement:** Give event organisers an AI-synthesised view of stadium operations — metrics, anomalies, and prioritised actions.

| Layer | File | What it does |
|---|---|---|
| UI | `artifacts/arena-os/src/pages/organizer.tsx` | Dedicated Organizer Command Center page (role-gated); displays 8 live KPI metric cards; "AI Operational Summary" section with a "Regenerate" button |
| KPI metrics | `artifacts/arena-os/src/pages/organizer.tsx` | 8 mock KPIs fed to the AI: Crowd Density (87%), Security Alerts (3), Medical Incidents (1), Transport Delays (2), Food Queue Avg (14 min), Active Volunteers (342), Power Grid (98%), Waste Collection (73%) |
| API endpoint | `artifacts/api-server/src/routes/gemini/organizer.ts` | `POST /api/gemini/organizer/summary` — receives the metrics payload, calls Gemini with an organizer-specific system prompt, returns `{ summary, recommendations[] }` |
| Announcement endpoint | `artifacts/api-server/src/routes/gemini/organizer.ts` | `POST /api/gemini/organizer/announcement` — generates a professional public stadium announcement from a text prompt; used by organizers to draft PA-ready copy |
| AI client hook | `lib/api-client-react` (generated by Orval) | `useGenerateOrganizerSummary`, `useGenerateAnnouncement` — TanStack Query mutations wired to the organizer endpoints |
| AI behaviour | `artifacts/api-server/src/routes/gemini/systemPrompt.ts` | `ROLE_INSTRUCTIONS.organizer` — "Strategic crowd flow … incident escalation … cross-service operational summaries … decision-support framing … executive-level language, data-driven responses" |

---

### 8. Real-Time Decision Support

**Requirement:** Stream AI responses in real time so operators and fans get answers without waiting for full generation; support urgent, time-sensitive decisions.

| Layer | File | What it does |
|---|---|---|
| SSE streaming | `artifacts/api-server/src/routes/gemini/index.ts` | `POST /api/gemini/chat/:convId/stream` — calls `ai.models.generateContentStream(...)` and forwards each chunk as `data: {"content":"..."}` Server-Sent Events; the connection stays open until `done: true` |
| Client stream consumer | `artifacts/arena-os/src/hooks/useChat.ts` | `useChat` hook reads the SSE stream via `fetch` + `ReadableStream`, appends tokens to `streamingContent` state in real time; falls back to error state on network failure |
| Emergency escalation | `artifacts/api-server/src/routes/gemini/systemPrompt.ts` | `FEATURE_INSTRUCTIONS.emergency` — instructs AI to lead with a single immediate action, give nearest emergency point with exact location, and always end with "If this is a life-threatening emergency, call 999 immediately" |
| Role-differentiated urgency | `artifacts/api-server/src/routes/gemini/systemPrompt.ts` | `ROLE_INSTRUCTIONS` — fan gets simple, calm guidance; volunteer gets escalation protocol; staff gets operational brevity; organizer gets command-level decision framing |
| Multi-turn context | `artifacts/api-server/src/routes/gemini/index.ts` | Full conversation history loaded from PostgreSQL (`lib/db` — `conversations` + `messages` tables) and passed to Gemini as `contents[]` — decisions can build on prior turns |
| Conversation persistence | `lib/db/src/schema.ts` | Drizzle ORM schema for `conversations` and `messages`; every user message and assistant response is stored; supports resuming a conversation across sessions |

---

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
