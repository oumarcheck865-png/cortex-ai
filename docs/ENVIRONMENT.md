# Cortex AI — Environment configuration

Cortex AI has **no mandatory cloud dependency** and **no embedded API keys**.
Every secret is provided by you. Copy `.env.example` to `.env` and fill in the
values for your infrastructure.

## LLM / Model (bring your own model)

Cortex AI is model-agnostic. Point it at any OpenAI-compatible endpoint, your
own provider, or a local model server.

| Variable                 | Description                                            | Example                       |
| ------------------------ | ------------------------------------------------------ | ----------------------------- |
| `CORTEX_LLM_BASE_URL`    | Base URL of your LLM endpoint                          | `http://localhost:11434/v1`   |
| `CORTEX_LLM_API_KEY`     | API key (leave empty for local / no-auth endpoints)    | _your key_                    |
| `CORTEX_LLM_MODEL`       | Default model name                                     | `cortex-default`              |
| `CORTEX_LLM_LARGE_MODEL` | Optional stronger model for planning / reasoning       | `cortex-large`                |

## Agent server (your own server / GPU)

| Variable                      | Description                                  | Example                     |
| ----------------------------- | -------------------------------------------- | --------------------------- |
| `CORTEX_AGENT_SERVER_URL`     | Where the agent server runs                  | `http://localhost:8000`     |
| `CORTEX_AGENT_SERVER_API_KEY`  | Set if your agent server requires auth       | _your key_                  |

## Auth backend

The landing app ships a client-side `AuthProvider` ready to call a backend.
Wire it to your auth service:

| Variable                   | Description                                  | Example                              |
| -------------------------- | -------------------------------------------- | ------------------------------------ |
| `CORTEX_AUTH_API_BASE_URL` | Your auth API base                           | `http://localhost:3000/api/auth`     |
| `CORTEX_AUTH_JWT_SECRET`   | Secret for signing sessions                  | _generate a strong secret_           |

## Optional integrations (all OFF by default)

| Variable                  | Description                                  | Default |
| ------------------------- | -------------------------------------------- | ------- |
| `CORTEX_ENABLE_TELEMETRY` | Enable opt-in telemetry                      | `false` |
| `CORTEX_GITHUB_TOKEN`     | Only if you use GitHub automations           | _empty_ |
| `CORTEX_SLACK_BOT_TOKEN`  | Only if you use Slack automations            | _empty_ |

## Landing app (Next.js)

| Variable                       | Description                | Example                        |
| ------------------------------ | -------------------------- | ------------------------------ |
| `NEXT_PUBLIC_CORTEX_APP_URL`   | URL of the app entry       | `http://localhost:3000/app`    |
