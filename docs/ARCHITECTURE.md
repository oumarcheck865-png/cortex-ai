# Cortex AI — Architecture

## Overview

Cortex AI is a monorepo with two main packages:

```
cortex-ai/
├── app/      # Cortex AI web application (OpenHands runtime, rebranded)
├── landing/  # Premium SaaS landing page + auth (Next.js)
├── docs/     # Technical documentation
└── .github/  # CI/CD + security workflows
```

### `landing/` — Next.js SaaS front door

- **Stack**: Next.js 16 (App Router, Turbopack), Tailwind v4, Framer Motion, shadcn/ui, next-themes.
- **Routes**:
  - `/` — premium landing page (hero, partners, features, testimonials, stats, pricing, FAQ, footer)
  - `/login` — Connexion
  - `/signup` — Inscription
  - `/app` — protected application entry (post-auth)
- **Auth**: `landing/lib/auth.tsx` provides `AuthProvider` / `useAuth()`. It is a clean, backend-ready
  layer. Today it persists a session to `localStorage` so the UI is fully functional without a server.
  To go live, replace the bodies of `signIn` / `signUp` / `signOut` with calls to your backend
  (e.g. `POST /api/auth/login`). No other code depends on the storage mechanism.

### `app/` — OpenHands runtime (rebranded Cortex AI)

The full OpenHands Agent Canvas, rebranded. Capabilities preserved verbatim:

- Conversational AI interface, conversation management & history
- Autonomous agents, task creation & action execution
- File management, terminal, code execution, results preview
- System events, real-time WebSocket communication
- MCP, Skills, workflows
- Settings, agent configuration, available tools

Rebranding was applied **only to user-facing identity**, never to code identifiers:
- `translation.json`: 1023 user-facing strings rebranded (product name → Cortex AI)
- `root.tsx` meta title + `use-app-title` APP_TITLE → Cortex AI
- Logo assets + favicon → Cortex AI
- `package.json` name → `@cortex-ai/app`
- README rewritten as Cortex AI

Code identifiers (`isOpenHands`, `OpenHandsLogo`, env vars, repo paths, `openhands.dev` docs links,
OpenHands Cloud product references) were deliberately preserved to keep the runtime intact and
upgradeable from upstream.

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
