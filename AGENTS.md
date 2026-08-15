# Cortex AI — Agent memory

## Repository
- GitHub repo: `oumarcheck865-png/cortex-ai` (private, default branch `main`)
- Working dir: `/workspace/project` (the cortex-ai repo itself)
- Monorepo: `app/` (OpenHands runtime, rebranded), `landing/` (Next.js SaaS template, rebranded), `docs/`, `.github/`
- Bootstrap PR: https://github.com/oumarcheck865-png/cortex-ai/pull/1 (branch `feat/cortex-platform-bootstrap`)
- Rebrand test-fix PR: https://github.com/oumarcheck865-png/cortex-ai/pull/3 (branch `fix/rebrand-test-regressions`, merged) — completed the rebrand in test assertions (app title → "Cortex AI", package name → `@cortex-ai/app`) and added the `app` CI job (Vitest suite).
- Platform integration PR: https://github.com/oumarcheck865-png/cortex-ai/pull/2 (branch `feat/cortex-platform-integration`) — full OpenHands runtime under `/app`, single-origin launcher, auth guard, BYO-model. Rebased onto main + CI deduped.

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
- `.github/workflows/ci.yml` has 3 jobs: `landing` (clean `.next` → tsc → next build), `app` (install → make-i18n → typecheck → full Vitest suite 566 files / 4580 tests → Cortex SPA build `VITE_BASE_PATH=/app` → auth-guard injection → verify `cortex-ai.session` + "Cortex AI"), `security` (gitleaks, `continue-on-error`).
- Workflow triggers `push` only on `[main]` (feature branches covered by `pull_request`) + a `concurrency` group cancels superseded runs — this avoids the duplicate-run flake where one of two identical app jobs occasionally failed while the other passed.
- Local full app-test run: `cd app && npm run make-i18n && npx vitest run` (~7 min). After a rebrand that touches `package.json` name or `APP_TITLE`, also update: `app/src/hooks/use-app-title.test.tsx`, `app/__tests__/services/telemetry.test.ts` (package_name), `app/__tests__/package-library.test.ts` (package name) — and `app/package-lock.json` (run `npm install` to sync the lockfile's `name` field).

## OpenHands app (`app/`)
- Rebranding applied ONLY to user-facing identity (translation.json 1023 strings, root.tsx, use-app-title, logos, favicon, package.json name `@cortex-ai/app`, README).
- Code identifiers (`isOpenHands`, `OpenHandsLogo`, env vars, `openhands.dev` docs links, OpenHands Cloud refs) deliberately preserved.
- Logo assets: `app/src/assets/branding/cortex-logo.svg`, `cortex-logo-white.svg` (new).

## Project conventions
- Commits use `feat(scope):`, `chore:` prefixes; include `Co-authored-by: openhands <openhands@all-hands.dev>`.
- Rebranding rule: never break functionality; only change user-facing identity; preserve code identifiers and upstream paths so the runtime stays upgradeable.
