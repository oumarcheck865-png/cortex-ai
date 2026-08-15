# Cortex AI — Agent memory

## Repository
- GitHub repo: `oumarcheck865-png/cortex-ai` (private, default branch `main`)
- Working dir: `/workspace/project` (the cortex-ai repo itself)
- Monorepo: `app/` (OpenHands runtime, rebranded), `landing/` (Next.js SaaS template, rebranded), `docs/`, `.github/`
- Bootstrap PR: https://github.com/oumarcheck865-png/cortex-ai/pull/1 (branch `feat/cortex-platform-bootstrap`)

## Auth token quirks (IMPORTANT)
- The `GITHUB_TOKEN` env var is a `ghu_` OAuth/App token (40 chars) with **no classic OAuth scopes** (`x-oauth-scopes:` header empty).
- It CAN push to `cortex-ai` via git (remote URL embeds the token), but the **REST API `/repos/oumarcheck865-png/cortex-ai` returns 404**, and `gh` CLI + `default_create_pr` tool fail with 404/GraphQL errors on the private repo.
- **Solution**: use the `github_1_*` MCP tools (e.g. `github_1_create_pull_request`) — they use a different auth path and successfully created PR #1. For PR/repo operations on private repos here, prefer `github_1_*` tools over `curl`/`gh`/`default_create_pr`.

## Landing app (Next.js 16, Turbopack)
- Build: `cd landing && npm run build` (passes; routes: `/`, `/login`, `/signup`, `/app`)
- Dev: `PORT=12001 npm run dev` (host: https://work-2-rrmkyaetptsehlpt.prod-runtime.all-hands.dev/)
- `next lint` is broken in Next 16 (`Invalid project directory ... lint`); use `npx tsc --noEmit` + `npm run build` for verification instead.
- Auth: `landing/lib/auth.tsx` — `AuthProvider`/`useAuth()`, localStorage-backed, backend-ready.

## OpenHands app (`app/`)
- Rebranding applied ONLY to user-facing identity (translation.json 1023 strings, root.tsx, use-app-title, logos, favicon, package.json name `@cortex-ai/app`, README).
- Code identifiers (`isOpenHands`, `OpenHandsLogo`, env vars, `openhands.dev` docs links, OpenHands Cloud refs) deliberately preserved.
- Logo assets: `app/src/assets/branding/cortex-logo.svg`, `cortex-logo-white.svg` (new).

## Project conventions
- Commits use `feat(scope):`, `chore:` prefixes; include `Co-authored-by: openhands <openhands@all-hands.dev>`.
- Rebranding rule: never break functionality; only change user-facing identity; preserve code identifiers and upstream paths so the runtime stays upgradeable.
