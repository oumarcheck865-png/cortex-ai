#!/usr/bin/env node
/**
 * Cortex AI — SPA launcher.
 *
 * Thin wrapper around the OpenHands `scripts/static-server.mjs` that bakes in
 * the Cortex AI defaults:
 *   - serves the prebuilt OpenHands SPA (`build/`) under base path `/app`
 *   - reverse-proxies the agent-server API / WebSocket / health endpoints to
 *     YOUR agent server, configured via `CORTEX_AGENT_SERVER_URL`
 *     (default: http://localhost:18000)
 *
 * The OpenHands SPA's API client falls back to `window.location.origin` for
 * its base URL, so when this server (or the Cortex ingress in front of it) is
 * the origin, `/api`, `/sockets`, `/server_info`, etc. are proxied to your
 * agent server. No embedded keys, no mandatory cloud.
 *
 * Usage:
 *   node scripts/cortex-serve.mjs
 *   CORTEX_AGENT_SERVER_URL=http://my-gpu-host:8000 node scripts/cortex-serve.mjs
 *   node scripts/cortex-serve.mjs --port 3001
 *
 * This is integration glue — it does not modify or reimplement any OpenHands
 * functionality; it only configures the existing static server.
 */
import { spawn } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const AGENT_SERVER_URL =
  process.env.CORTEX_AGENT_SERVER_URL || "http://localhost:18000";

// OpenHands agent-server prefixes that the SPA calls against window.location.origin.
const PROXIED_PREFIXES = [
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

// Allow callers to override the port via --port <n>. Everything else is
// forwarded verbatim (e.g. --session-api-key, --auth-required).
const userArgs = process.argv.slice(2);
let port = "3001";
for (let i = 0; i < userArgs.length; i++) {
  if (userArgs[i] === "--port" || userArgs[i] === "-p") {
    port = userArgs[i + 1];
    userArgs.splice(i, 2);
    break;
  }
}

const args = [
  resolve(__dirname, "static-server.mjs"),
  "--dir",
  resolve(__dirname, "..", "build"),
  "--base-path",
  "/app",
  "--port",
  port,
  ...userArgs,
  ...PROXIED_PREFIXES.flatMap((prefix) => ["--route", `${prefix}=${AGENT_SERVER_URL}`]),
];

const child = spawn("node", args, { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 0));
