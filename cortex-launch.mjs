#!/usr/bin/env node
/**
 * Cortex AI — single-origin platform launcher.
 *
 * Runs the whole Cortex AI platform behind ONE public port by reusing the
 * OpenHands ingress reverse proxy (`app/scripts/ingress.mjs`):
 *
 *   public port (default 12001)
 *     ├── /app, /app/*          → OpenHands SPA (static-server :3001, base /app)
 *     ├── /api, /sockets,       → YOUR agent server (CORTEX_AGENT_SERVER_URL)
 *     │   /server_info, /alive,
 *     │   /health, /ready,
 *     │   /docs, /redoc, /openapi.json
 *     └── *  (default)          → Cortex AI landing page (Next.js :3000)
 *
 * The OpenHands SPA and the landing share an origin, so the SPA's injected
 * auth guard can read the landing's localStorage session — authenticated
 * users go straight into the platform at /app; anyone else is bounced to
 * /login.
 *
 * This is integration glue: it only orchestrates the existing OpenHands
 * ingress + static server and the landing Next.js server. It does not
 * reimplement any functionality.
 *
 * Usage:
 *   node cortex-launch.mjs
 *   CORTEX_AGENT_SERVER_URL=http://my-gpu-host:8000 node cortex-launch.mjs
 *   node cortex-launch.mjs --port 12001
 *
 * Env:
 *   CORTEX_PORT              public port (default 12001)
 *   CORTEX_AGENT_SERVER_URL  your agent server (default http://localhost:18000)
 *   CORTEX_LANDING_PORT      internal landing port (default 3000)
 *   CORTEX_SPA_PORT          internal SPA port (default 3001)
 */
import { spawn } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname);

const PORT = process.env.CORTEX_PORT || "12001";
const AGENT_SERVER_URL =
  process.env.CORTEX_AGENT_SERVER_URL || "http://localhost:18000";
const LANDING_PORT = process.env.CORTEX_LANDING_PORT || "3000";
const SPA_PORT = process.env.CORTEX_SPA_PORT || "3001";

const INGRESS = resolve(ROOT, "app", "scripts", "ingress.mjs");
const STATIC_SERVER = resolve(ROOT, "app", "scripts", "static-server.mjs");
const APP_BUILD = resolve(ROOT, "app", "build");
const LANDING_DIR = resolve(ROOT, "landing");

const children = [];

function cleanup() {
  for (const c of children) {
    try {
      if (!c.killed) c.kill("SIGTERM");
    } catch {}
  }
  process.exit(0);
}
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

function spawnLogged(name, command, args, opts = {}) {
  console.log(`[cortex] ${name}: ${command} ${args.join(" ")}`);
  const c = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"], ...opts });
  c.stdout?.on("data", (d) => process.stdout.write(`[${name}] ${d}`));
  c.stderr?.on("data", (d) => process.stderr.write(`[${name}] ${d}`));
  c.on("exit", (code) => {
    console.log(`[cortex] ${name} exited (code ${code})`);
  });
  children.push(c);
  return c;
}

async function main() {
  if (!process.env.CORTEX_SKIP_SPA) {
    // OpenHands SPA — serves build/ under /app, proxies API/sockets to the
    // user's agent server. (cortex-serve.mjs wraps static-server.mjs.)
    spawnLogged("spa", "node", [
      resolve(ROOT, "app", "scripts", "cortex-serve.mjs"),
      "--port",
      SPA_PORT,
    ]);
  }

  if (!process.env.CORTEX_SKIP_LANDING) {
    // Landing page (Next.js).
    spawnLogged(
      "landing",
      "npm",
      ["run", "dev"],
      { cwd: LANDING_DIR, env: { ...process.env, PORT: LANDING_PORT } },
    );
  }

  // Give the inner servers a moment to bind before the ingress starts routing.
  await delay(1500);

  const route = (prefix, url) => ["--route", `${prefix}=${url}`];

  // Ingress: route /app/* → SPA, API/websocket prefixes → agent server,
  // everything else → landing.
  const agentPrefixes = [
    "/api",
    "/sockets",
    "/server_info",
    "/alive",
    "/health",
    "/ready",
    "/docs",
    "/redoc",
    "/openapi.json",
  ];

  const ingressArgs = [
    "--port",
    String(PORT),
    ...route("/app", `http://localhost:${SPA_PORT}`),
    ...agentPrefixes.flatMap((p) => route(p, AGENT_SERVER_URL)),
    "--default",
    `http://localhost:${LANDING_PORT}`,
  ];

  spawnLogged("ingress", "node", [INGRESS, ...ingressArgs]);

  console.log(
    `\n[cortex] Cortex AI platform ready on port ${PORT}\n` +
      `  Landing:        /\n` +
      `  Platform (SPA): /app  (auth-gated → /login)\n` +
      `  Agent server:   ${AGENT_SERVER_URL}  (configure via CORTEX_AGENT_SERVER_URL)\n`,
  );
}

main().catch((err) => {
  console.error("[cortex] failed to start:", err);
  process.exit(1);
});
