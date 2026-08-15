#!/usr/bin/env node
/**
 * Cortex AI — post-build step for the OpenHands SPA.
 *
 * The OpenHands Agent Canvas is built (react-router build) with
 * `VITE_BASE_PATH=/app` so the whole SPA mounts under `/app/*`. This script
 * runs after that build and does two things, WITHOUT touching any runtime
 * code or functionality:
 *
 *   1. Injects a tiny client-side auth guard into `build/index.html`. Because
 *      the SPA is served from the same origin as the Cortex AI landing page
 *      (via the ingress reverse proxy), it can read the landing's auth session
 *      from localStorage. If there is no `cortex-ai.session`, the browser is
 *      redirected to `/login` — i.e. unauthenticated users cannot open the
 *      platform. This mirrors the auth gate the landing's `/app` placeholder
 *      used to provide, but for the real SPA.
 *
 *   2. Leaves everything else (assets, locales, manifest, the React Router
 *      bootstrap, Cortex branding already baked by the build) untouched.
 *
 * This is integration glue only — it does not reimplement or replace any
 * OpenHands functionality.
 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const indexPath = resolve(__dirname, "..", "build", "index.html");

const AUTH_GUARD = `
<script>
// Cortex AI auth guard — redirect to /login if no landing session is present.
// Same-origin (served behind the Cortex ingress), so the landing's
// localStorage session is readable here.
(function(){
  try {
    var raw = window.localStorage.getItem('cortex-ai.session');
    if (!raw) { window.location.replace('/login'); return; }
    var s = JSON.parse(raw);
    if (!s || !s.token || !s.user) { window.location.replace('/login'); }
  } catch (e) { window.location.replace('/login'); }
})();
</script>`;

async function main() {
  let html = await readFile(indexPath, "utf8");

  if (html.includes("cortex-ai.session")) {
    // Already injected (idempotent).
    return;
  }

  // Inject right after <head> so it runs before the SPA boots.
  if (html.includes("<head>")) {
    html = html.replace("<head>", `<head>${AUTH_GUARD}`);
  } else if (html.includes("<head ")) {
    html = html.replace(/<head /, `<head ${AUTH_GUARD.slice(0, -1)} `);
  } else {
    // Fallback: prepend.
    html = AUTH_GUARD + html;
  }

  await writeFile(indexPath, html, "utf8");
  console.log("cortex-postbuild: injected Cortex AI auth guard into build/index.html");
}

main().catch((err) => {
  console.error("cortex-postbuild: failed:", err);
  process.exit(1);
});
