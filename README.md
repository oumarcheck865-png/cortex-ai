# Cortex AI

**Cortex AI** — an autonomous AI agent platform built on the OpenHands runtime, paired with a premium SaaS landing page and a complete web application.

> Self-hostable. Model-agnostic. Bring your own LLM, your own GPU, your own APIs.

[![CI](https://github.com/oumarcheck865-png/cortex-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/oumarcheck865-png/cortex-ai/actions/workflows/ci.yml)

## Repository structure

```
cortex-ai/
├── app/          # Cortex AI web application (OpenHands runtime, rebranded)
├── landing/      # Premium SaaS landing page (Next.js + Tailwind + shadcn/ui)
├── docs/         # Technical documentation
└── .github/      # CI/CD, security workflows
```

### `app/` — Cortex AI web application

The full OpenHands Agent Canvas runtime, rebranded as **Cortex AI**. It ships with:

- Conversational AI interface, conversation management & history
- Autonomous agents, task creation & action execution
- File management, terminal, code execution, results preview
- System events, real-time WebSocket communication
- MCP, Skills, workflows
- Settings, agent configuration, available tools

### `landing/` — Cortex AI landing page

A premium SaaS landing page (Next.js, Tailwind v4, Framer Motion, shadcn/ui) evolved from the
[saas-landing-template](https://github.com/gonzalochale/saas-landing-template). Branded for Cortex AI
with login / sign-up entry points that route into the application.

## Getting started

### Prerequisites

- Node.js >= 20
- A package manager (npm / pnpm)
- An OpenHands-compatible agent server **or** your own LLM endpoint (see [Bring your own model](docs/ARCHITECTURE.md))

### Run the landing page

```bash
cd landing
pnpm install      # or: npm install
pnpm dev          # http://localhost:3000
```

### Run the Cortex AI app

```bash
cd app
npm install
npm run dev       # http://localhost:3001 (see app README for ports)
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
