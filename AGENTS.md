# Cortex AI — Agent memory

## Repository
- GitHub repo: `oumarcheck865-png/cortex-ai` (private, default branch `main`)
- Working dir: `/workspace/project` (the cortex-ai repo itself)
- Monorepo: `app/` (OpenHands runtime, rebranded), `landing/` (Next.js SaaS template, rebranded), `docs/`, `.github/`
- Bootstrap PR: https://github.com/oumarcheck865-png/cortex-ai/pull/1 (branch `feat/cortex-platform-bootstrap`)
- Rebrand test-fix PR: https://github.com/oumarcheck865-png/cortex-ai/pull/3 (branch `fix/rebrand-test-regressions`, merged) — completed the rebrand in test assertions (app title → "Cortex AI", package name → `@cortex-ai/app`) and added the `app` CI job (Vitest suite).

## Auth token quirks (IMPORTANT)
- The `GITHUB_TOKEN` env var is a `ghu_` OAuth/App token (40 chars) with **no classic OAuth scopes** (`x-oauth-scopes:` header empty).
- It CAN push to `cortex-ai` via git (remote URL embeds the token), but the **REST API `/repos/oumarcheck865-png/cortex-ai` returns 404**, and `gh` CLI + `default_create_pr` tool fail with 404/GraphQL errors on the private repo.
- **Solution**: use the `github_1_*` MCP tools (e.g. `github_1_create_pull_request`) — they use a different auth path and successfully created PR #1. For PR/repo operations on private repos here, prefer `github_1_*` tools over `curl`/`gh`/`default_create_pr`.

## Landing app (Next.js 16, Turbopack)
- Build: `cd landing && npm run build` (passes; routes: `/`, `/login`, `/signup`, `/app`)
- Dev: `PORT=12001 npm run dev` (host: https://work-2-rrmkyaetptsehlpt.prod-runtime.all-hands.dev/)
- `next lint` is broken in Next 16 (`Invalid project directory ... lint`); use `npx tsc --noEmit` + `npm run build` for verification instead.
- Auth: `landing/lib/auth.tsx` — `AuthProvider`/`useAuth()`, localStorage-backed, backend-ready.

## CI
- `.github/workflows/ci.yml` has 3 jobs: `landing` (tsc + next build), `app` (make-i18n + typecheck + `npm test` = full Vitest suite, 566 files / 4580 tests, ~13 min on CI), `security` (gitleaks, `continue-on-error`).
- Local full app-test run: `cd app && npm run make-i18n && npx vitest run` (~7 min). After a rebrand that touches `package.json` name or `APP_TITLE`, also update: `app/src/hooks/use-app-title.test.tsx`, `app/__tests__/services/telemetry.test.ts` (package_name), `app/__tests__/package-library.test.ts` (package name) — and `app/package-lock.json` (run `npm install` to sync the lockfile's `name` field).

## OpenHands app (`app/`)
- Rebranding applied ONLY to user-facing identity (translation.json ~246 OpenHands mentions → Cortex AI; theme labels → Cortex-Neo/Neutral/DeepSea; root.tsx, use-app-title, logos, favicon, package.json name `@cortex-ai/app`, README).
- Code identifiers (`OpenHandsEvent` types, `@openhands/*` package imports, localStorage keys like `openhands-agent-server-config`, env vars, repo paths, API identifiers) deliberately preserved — renaming them breaks functionality.
- Logo assets: `app/src/assets/branding/cortex-logo.svg`, `cortex-logo-white.svg`.

## Platform integration (phase 2) — how the full OpenHands app is embedded
- The OpenHands Agent Canvas is a React Router v7 SPA (Vite). It natively supports sub-path mounting via `VITE_BASE_PATH`.
- **Build**: `cd app && npm run cortex:build` = `VITE_BASE_PATH=/app VITE_MOCK_API=false npm run build:app && node scripts/cortex-postbuild.mjs`. Output: `app/build/` (index.html + assets, all paths prefixed `/app`, basename `/app`).
- **Serve**: `app/scripts/cortex-serve.mjs` wraps `app/scripts/static-server.mjs` (OpenHands' own static server) with Cortex defaults: base path `/app`, proxies `/api`,`/sockets`,`/server_info`,`/alive`,`/health`,`/ready`,`/docs`,`/redoc`,`/openapi.json` → `CORTEX_AGENT_SERVER_URL` (default http://localhost:18000).
- **Auth guard**: `app/scripts/cortex-postbuild.mjs` injects a script into `build/index.html` that reads `localStorage["cortex-ai.session"]` and redirects to `/login` if missing. Works because the SPA is served same-origin as the landing via the ingress.
- **Single-origin launcher**: `cortex-launch.mjs` (repo root) runs 3 processes behind ONE public port via OpenHands `app/scripts/ingress.mjs`:
  - `/app`,`/app/*` → SPA (static-server :3001, base /app)
  - `/api`,`/sockets`,`/server_info`,… → agent server (CORTEX_AGENT_SERVER_URL)
  - `*` default → landing (Next.js :3000)
  - Public port = CORTEX_PORT (default 12001). Env: CORTEX_PORT, CORTEX_AGENT_SERVER_URL, CORTEX_LANDING_PORT, CORTEX_SPA_PORT, CORTEX_SKIP_LANDING, CORTEX_SKIP_SPA.
- The OpenHands SPA's API client falls back to `window.location.origin` for its base URL (see `app/src/api/agent-server-config.ts` `getAgentServerBaseUrl`), so same-origin serving means `/api` etc. hit the ingress → agent server. No embedded keys.
- The landing's `app/app/` placeholder page was REMOVED — `/app` is now served entirely by the real OpenHands SPA via the ingress.
- npm install note: `app/node_modules` sometimes ships WITHOUT `.bin/` (incomplete install). Running `npm install --no-audit --no-fund` in `app/` restores `.bin/react-router` so `build:app` works.
- Verify routes (all should be HTTP 200 via ingress on 12001): `/`, `/login`, `/signup`, `/app`, `/app/conversations`, `/app/settings`, `/app/settings/llm`, `/app/skills`, `/app/mcp`, `/app/customize`, `/app/automations`, `/app/launch`.

## Project conventions
- Commits use `feat(scope):`, `chore:` prefixes; include `Co-authored-by: openhands <openhands@all-hands.dev>`.
- Rebranding rule: never break functionality; only change user-facing identity; preserve code identifiers and upstream paths so the runtime stays upgradeable.
