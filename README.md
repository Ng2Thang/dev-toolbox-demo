# Dev Toolbox — Autonomous Agent Demo

A small Next.js + Supabase webapp structured specifically to demo an autonomous coding agent going from **requirement → UI → multi-file implementation → database migration → checks → pull request → Vercel preview**.

## Core demo

Use `requirements/001-saved-tool-runs.md`.

The requirement forces changes through multiple layers:

- JWT tool UI
- client interaction/state
- server API route
- Zod validation
- Supabase/Postgres migration
- environment variables
- history page
- CI/build
- GitHub PR
- Vercel preview

## Architecture

```text
Google Stitch MCP
      ↓ UI intent
Next.js App Router
      ↓
API Routes ─────────→ Supabase/Postgres
      ↓
GitHub PR / CI
      ↓
Vercel Preview
```

## Repository map

```text
app/                    Next.js pages and API routes
components/             shared UI
lib/                    domain/server helpers
requirements/           specs given to the agent
supabase/migrations/     versioned database changes
.agents/skills/          repository-scoped feature workflow skills
.codex/skills/           existing Stitch workflow skills
.github/workflows/       CI quality gate
docs/                    demo explanation
scripts/demo-task.md     one prompt for the live demo
AGENTS.md                repository-level agent contract
```

## Local setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Set:

```env
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

`SUPABASE_SERVICE_ROLE_KEY` is read only by server-side code and must never be exposed
through a client component or `NEXT_PUBLIC_*` variable. The JWT Decoder saves successful
decodes through `/api/runs`; `/history` displays the 50 newest saved runs.

## Connection doctor

Run the connection doctor before an agent workflow to check its integrations:

```bash
npm run doctor
```

It verifies that Google Stitch is enabled in the local Codex MCP registry, probes Supabase with
the credentials in `.env.local` (without displaying them), and checks the GitHub remote/CLI and
Vercel project link/CLI. It exits non-zero unless every integration is confirmed. Use
`npm run doctor:offline` to validate local configuration without making the Supabase network
request, or append `-- --json` for machine-readable output.

For local Supabase development, initialize/start Supabase and apply migrations using the Supabase CLI according to your environment.

## Live demo command/prompt

Give the agent the contents of `scripts/demo-task.md` and do not provide implementation details.

## Recommended production policy

- Agent may create feature branches and PRs.
- Agent may apply migrations to a dedicated preview/staging Supabase project.
- Agent may inspect Vercel Preview deployments.
- Production migration/deployment should require a branch protection/environment approval unless the demo specifically intends fully autonomous production release.
