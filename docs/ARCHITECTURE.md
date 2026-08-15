# Cortex AI — Architecture

## Overview

Cortex AI is a monorepo with two main packages, unified behind a single public port by the
OpenHands ingress reverse proxy:

```
cortex-ai/
├── app/              # Cortex AI platform (full OpenHands runtime, rebranded)
├── landing/          # Premium SaaS landing page + auth (Next.js)
├── cortex-launch.mjs # Single-origin platform launcher (ingress + SPA + landing)
├── docs/             # Technical documentation
└── .github/          # CI/CD + security workflows
```

### Single-origin platform topology

`cortex-launch.mjs` reuses the OpenHands `ingress.mjs` reverse proxy as the single public entry
point so the landing page and the platform share one origin. All three processes run together:

```
public port (default 12001) — ingress.mjs
  ├── /app, /app/*        → OpenHands SPA  (static-server :3001, base path /app)
  ├── /api, /sockets,     → YOUR agent server (CORTEX_AGENT_SERVER_URL)
  │   /server_info, /alive, /health, /ready, /docs, /redoc, /openapi.json
  └── *  (default)        → Landing page (Next.js :3000)
```

Because the SPA is served from the same origin as the landing page, the SPA's injected auth guard
can read the landing's `localStorage` session — authenticated users go straight into the platform at
`/app`; anyone else is redirected to `/login`.

### `landing/` — Next.js SaaS front door

- **Stack**: Next.js 16 (App Router, Turbopack), Tailwind v4, Framer Motion, shadcn/ui, next-themes.
- **Routes**:
  - `/` — premium landing page (hero, partners, features, testimonials, stats, pricing, FAQ, footer)
  - `/login` — Connexion
  - `/signup` — Inscription
- **Auth**: `landing/lib/auth.tsx` provides `AuthProvider` / `useAuth()`. It is a clean,
  backend-ready layer. Today it persists a session to `localStorage` so the UI is fully functional
  without a server. To go live, replace the bodies of `signIn` / `signUp` / `signOut` with calls to
  your backend (e.g. `POST /api/auth/login`). No other code depends on the storage mechanism.
  After sign-in / sign-up, users are routed to `/app`, which the ingress serves as the full Cortex AI
  platform SPA.

### `app/` — Cortex AI platform (OpenHands runtime, rebranded)

The full OpenHands Agent Canvas runtime, reused verbatim and mounted under `/app` (the runtime's
native `VITE_BASE_PATH` support). Nothing was removed or reimplemented. Capabilities:

- Conversational AI interface, conversation management & history
- Autonomous agents, task creation & action execution
- File management, terminal, code execution, results preview
- System events, real-time WebSocket communication
- MCP, Skills, workflows
- Settings, agent configuration, available tools

Cortex integration glue (no runtime code is modified):

- `app/scripts/cortex-postbuild.mjs` — runs after `build:app`; injects a same-origin auth guard
  into `build/index.html` (redirects to `/login` when no `cortex-ai.session` is present).
- `app/scripts/cortex-serve.mjs` — wraps the OpenHands `static-server.mjs`, serving the SPA under
  base path `/app` and reverse-proxying `/api`, `/sockets`, `/server_info`, … to your agent server
  (`CORTEX_AGENT_SERVER_URL`, default `http://localhost:18000`).
- `npm run cortex:build` / `npm run cortex:serve` — build and serve the platform.

Rebranding was applied **only to user-facing identity**, never to code identifiers:
- `translation.json`: user-facing strings rebranded (product name → Cortex AI; theme labels →
  Cortex-Neo / Cortex-Neutral / Cortex-DeepSea; model labels → Cortex AI …)
- `root.tsx` meta title + `use-app-title` APP_TITLE → Cortex AI
- Logo assets + favicon → Cortex AI
- `package.json` name → `@cortex-ai/app`
- README rewritten as Cortex AI

Code identifiers (`OpenHandsEvent` types, `@openhands/*` package imports, localStorage keys like
`openhands-agent-server-config`, env vars, repo paths, API identifiers) were deliberately preserved
to keep the runtime intact and upgradeable from upstream.

## Independent AI architecture (bring your own model)

Cortex AI removes any **mandatory** dependency on an external cloud service:

- No embedded API keys.
- No proprietary cloud connections required to run.
- No required telemetry (opt-in only, fully disableable).

You connect your own:

| Resource          | How                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------- |
| LLM / model       | Any OpenAI-compatible endpoint, Anthropic, Mistral, or a local model (vLLM, Ollama)   |
| Agent server      | Your own host / port (local, Docker, VM, your infrastructure)                         |
| GPU resources     | Point the agent server at your own compute                                            |
| Custom APIs       | Via MCP servers and Skills                                                            |

See [`ENVIRONMENT.md`](./ENVIRONMENT.md) for the configuration variables.

