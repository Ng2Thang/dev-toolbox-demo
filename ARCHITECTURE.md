# Dev Toolbox architecture

## Purpose

Dev Toolbox is a Next.js App Router application that provides browser-based developer utilities.
It is also an autonomous-agent demo: a requirement should be traceable through UI, validation,
server access, database migration, tests, CI, pull request, and preview deployment.

## System overview

```text
Google Stitch (visual reference)
             |
             v
Next.js App Router routes and layouts
             |
             +--> client feature components --> browser-only utility logic
             |
             +--> route handlers / server components
                         |
                         v
                  Zod validation + server-only repository
                         |
                         v
                  Supabase / Postgres
```

## Directory map

```text
app/
  (toolbox)/             Public toolbox routes sharing the AppShell layout
  api/runs/              Saved-run HTTP API
  globals.css            Global design tokens and shared visual styles

components/
  layout/                Shared application chrome
  tool/                  Reusable tool-page presentation primitives

features/
  <tool>/                A utility's client component and pure domain helpers
  runs/                  Saved-run schema, types, and server-only repository
  home/                  Home-screen composition

lib/
  jwt.ts                 Shared JWT parsing logic
  supabase-server.ts     Server-only Supabase client factory
  tools.ts               Typed tool and navigation registry

test/                    Shared Vitest setup
supabase/migrations/     Immutable, ordered database migrations
requirements/            Product requirements given to agents
docs/                    Demo context and task log
.agents/skills/           Repository-scoped Codex feature workflows
```

## Route model

`app/(toolbox)/layout.tsx` owns the shared `AppShell`; pages within that route group must not
wrap themselves in another shell. The group does not affect URLs.

| URL                                                                                                | Owner                      | Rendering boundary                         |
| -------------------------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------ |
| `/`                                                                                                | `features/home`            | Server composition                         |
| `/tools/*`                                                                                         | matching feature folder    | Server page + interactive client component |
| `/history`                                                                                         | `features/runs` repository | Dynamic server page                        |
| `/api/runs`                                                                                        | `features/runs`            | Route handler                              |
| Add a tool by updating `lib/tools.ts`, creating a focused `features/<tool>/` folder, and adding    |
| its thin route page beneath `app/(toolbox)/tools/`. `lib/tools.ts` is the canonical tool registry: |
| each registered tool must appear on Home under **Popular tools** and in the AppShell sidebar. Keep |
| the registry in insertion order (first added, first displayed); do not duplicate tool lists in     |
| individual screens or layout components.                                                           |

## Feature conventions

Each feature owns its behavior. Prefer this shape when it applies:

```text
features/<feature>/
  <feature>.ts                 Pure domain logic; no React or network calls
  <feature>.client.tsx         State, browser APIs, and user interaction
  <feature>.test.ts            Unit tests for pure logic
  <feature>.client.test.tsx    Component tests for observable behavior
```

- Keep route pages thin: compose a page header and feature component only.
- Use Server Components by default. Add `'use client'` only to the smallest component that needs
  React state, events, or browser APIs.
- Put reusable presentation components in `components/`; do not create a generic component until
  at least two features need the same abstraction.
- Use the `@/` import alias for application modules.
- Do not put business logic, fetch calls, or Supabase access in a route page.
- Do not reintroduce a catch-all component for unrelated tools.

## Saved-run data flow

1. A client tool sends a JSON-compatible run to `POST /api/runs`.
2. `createToolRunSchema` validates `tool`, `input`, and recursive JSON `output`; invalid input
   returns HTTP 400 before any database call.
3. `run.repository.ts` performs persistence and reads using the server-only Supabase client.
4. `/history` calls the same repository and renders the latest 50 runs, newest first.

The `tool_runs` table is created by
`supabase/migrations/202608170001_create_tool_runs.sql`. Never edit that applied migration;
create a new timestamped migration for every schema change.

## Security boundaries

- `SUPABASE_SERVICE_ROLE_KEY` is server-only. It may be read only by server modules such as
  `lib/supabase-server.ts` and must never appear in client components or `NEXT_PUBLIC_*` variables.
- Validate every external request at the server boundary with Zod before persistence.
- Do not commit `.env*`, API keys, access tokens, temporary MCP configuration, or generated local
  configuration files. Use local ignored configuration and rotate a credential if it is exposed.
- Keep client feature output JSON-compatible when it will be stored as a saved run.

## Stitch workflow

Use Google Stitch only when a requested change affects a screen. Inspect the intended Stitch
screen before implementation, then adapt its presentation into the existing route and feature
boundaries. Keep Stitch-derived markup separate from client behavior and server data access so a
future screen sync does not overwrite application logic.

## Quality gate

Run these commands after relevant changes:

```bash
npm run format       # apply formatting
npm run lint         # ESLint + Next.js rules; warnings fail
npm run typecheck    # strict TypeScript
npm run test         # Vitest unit, component, and route tests
npm run test:e2e     # Playwright browser tests
npm run check        # format check + lint + typecheck + test + production build
```

CI runs `npm run check` on pull requests and pushes to `main`. Add or update tests whenever a
feature changes observable behavior, validation, or data access. CI then runs the Chromium
Playwright smoke suite. Browser tests should exercise critical user journeys with deterministic
mocked network responses; real persistence integration belongs in a dedicated test environment.

## Agent change checklist

1. Read the relevant requirement and this document.
2. Record a concise plan in `docs/task-log.md`.
3. Preserve route, client/server, and feature ownership boundaries.
4. Add a new migration for schema changes; never modify an applied migration.
5. Run `npm run check`, review the diff for secrets and accidental files, then commit on a feature
   branch and validate its preview deployment.
