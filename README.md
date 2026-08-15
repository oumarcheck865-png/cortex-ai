# Cortex AI

**Cortex AI** — an autonomous AI agent platform built on the OpenHands runtime, paired with a premium SaaS landing page and a complete web application.

> Self-hostable. Model-agnostic. Bring your own LLM, your own GPU, your own APIs.

[![CI](https://github.com/oumarcheck865-png/cortex-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/oumarcheck865-png/cortex-ai/actions/workflows/ci.yml)

## Repository structure

```
cortex-ai/
├── app/              # Cortex AI platform (full OpenHands runtime, rebranded)
├── landing/          # Premium SaaS landing page (Next.js + Tailwind + shadcn/ui)
├── cortex-launch.mjs # Single-origin platform launcher (ingress + SPA + landing)
├── docs/             # Technical documentation
└── .github/          # CI/CD, security workflows
```

### `app/` — Cortex AI platform

The full OpenHands Agent Canvas runtime, rebranded as **Cortex AI**. Nothing was removed or
reimplemented — the entire runtime is reused as-is and mounted under `/app`. It ships with:

- Conversational AI interface, conversation management & history
- Autonomous agents, task creation & action execution
- File management, terminal, code execution, results preview
- System events, real-time WebSocket communication
- MCP, Skills, workflows
- Settings, agent configuration, available tools

Cortex-specific glue (no runtime code is modified):

- `app/scripts/cortex-postbuild.mjs` — injects a same-origin auth guard into the
  built `index.html` so unauthenticated users are bounced to `/login`.
- `app/scripts/cortex-serve.mjs` — wraps the OpenHands `static-server.mjs`,
  serving the SPA under base path `/app` and proxying `/api`, `/sockets`, … to
  your agent server (`CORTEX_AGENT_SERVER_URL`).
- `npm run cortex:build` / `npm run cortex:serve` — build and serve the platform.

### `landing/` — Cortex AI landing page

A premium SaaS landing page (Next.js, Tailwind v4, Framer Motion, shadcn/ui) evolved from the
[saas-landing-template](https://github.com/gonzalochale/saas-landing-template). Branded for Cortex AI
with login / sign-up entry points. After authentication the user is routed straight into the full
platform at `/app`.

## Getting started

### Prerequisites

- Node.js >= 20
- A package manager (npm / pnpm)
- An OpenHands-compatible agent server **or** your own LLM endpoint (see [Bring your own model](docs/ARCHITECTURE.md))

### Run the whole platform (one command)

`cortex-launch.mjs` runs the landing page, the Cortex AI SPA, and the OpenHands ingress reverse
proxy behind a single public port, so the landing and the platform share one origin (the SPA's
auth guard can read the landing's session):

```bash
cd app && npm install && npm run cortex:build   # build the platform SPA (base path /app)
cd landing && npm install                         # landing deps
cd .. && node cortex-launch.mjs                   # http://localhost:12001
```

Then open `http://localhost:12001/` — sign in (or sign up) and you land directly in the Cortex AI
platform at `/app`.

Point the platform at **your own** agent server / model:

```bash
CORTEX_AGENT_SERVER_URL=http://my-gpu-host:8000 node cortex-launch.mjs
```

### Run pieces individually

```bash
# Landing page only
cd landing && npm install && npm run dev          # http://localhost:3000

# Cortex AI platform SPA only (served under /app)
cd app && npm install && npm run cortex:build && npm run cortex:serve  # http://localhost:3001/app
```

## Bring your own model

Cortex AI is built to be **independent of any mandatory cloud provider**. There are no embedded API
keys or proprietary cloud connections. You configure your own:

- LLM provider / model (OpenAI-compatible, Anthropic, local, etc.)
- Agent server
- GPU resources
- Custom APIs

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md).

## Acknowledgements

Cortex AI is built on top of two open-source foundations:

- [OpenHands](https://github.com/All-Hands-AI/OpenHands) — the agent runtime & web app
- [saas-landing-template](https://github.com/gonzalochale/saas-landing-template) — the landing page design

## License

See `app/LICENSE` and `landing/license.txt`.
