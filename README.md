# Dev Toolbox

Dev Toolbox is a Next.js App Router application that collects small, browser-based developer utilities. It also serves as an autonomous-agent demo: each feature requirement can be traced from a visual reference and implementation through tests, a pull request, and a preview deployment.

## Included tools

- **JWT Decoder** - Decodes and inspects compact JSON Web Tokens in the browser; it does not verify signatures.
- **JSON Formatter** - Validates and pretty-prints JSON locally.
- **Unix Timestamp Converter** - Converts Unix timestamps to readable dates and dates back to epoch values.
- **UUID Generator** - Generates UUID v1, v4, and v7 values locally.
- **Base64 Encoder / Decoder** - Converts UTF-8 text between standard and URL-safe Base64 locally.
- **Lorem Ipsum / Mock Data Generator** - Generates deterministic placeholder text and synthetic mock records locally.
- **SQL Formatter** - Formats and syntax-checks PostgreSQL, MySQL, SQLite, SQL Server, and BigQuery locally.
- **Saved runs** - Successful tool runs can be stored in Supabase and viewed at `/history`.

The typed registry in `lib/tools.ts` is the source of truth for available tools and sidebar navigation. When adding a tool, update both the registry and the **Included tools** list above so this README remains accurate.

## Tech stack

- Next.js 15 and React 19
- TypeScript
- Supabase/Postgres for optional saved-run persistence
- Zod validation at the runs API boundary
- Vitest, Testing Library, ESLint, and Prettier
- Playwright for Chromium browser smoke tests

## Requirements and architecture

Feature requirements live in [`requirements/`](requirements/); their front matter records each feature's current design and implementation status. Read [ARCHITECTURE.md](ARCHITECTURE.md) before changing application code - it defines routing, feature ownership, client/server boundaries, persistence, security, and quality conventions.

The current requirements cover the home screen, JWT Decoder, JSON Formatter, Unix Timestamp Converter, UUID Generator, and a future local-only version that removes saved-run persistence.

## Architecture alignment

[ARCHITECTURE.md](ARCHITECTURE.md) is authoritative. The following summary is kept here to make the application boundaries easy to find:

| Area        | Ownership and boundary                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------------- |
| `/`         | `features/home` composed within the shared `AppShell`                                                               |
| `/tools/*`  | Thin server route pages with focused feature components; browser interaction stays in the smallest client component |
| `/history`  | Dynamic server page backed by the saved-run repository                                                              |
| `/api/runs` | Route handler that validates requests with Zod before server-only persistence                                       |

Route pages must not contain business logic, client fetches, or Supabase access. Keep pure tool behavior in `features/<tool>/`, reusable UI in `components/`, and server persistence in the runs feature. Add tools through `lib/tools.ts`, the matching feature folder, and a thin route beneath `app/(toolbox)/tools/`.

Saved runs use JSON-compatible client output, `POST /api/runs`, schema validation, the server-only repository, and the `tool_runs` migration. The `/history` page displays the 50 newest runs first.

## Local setup

Prerequisites: Node.js 22 or newer and npm. A Supabase project is required only when using saved-run persistence.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

On PowerShell, use `Copy-Item .env.example .env.local` in place of `cp` if necessary. Set these values in `.env.local` when persistence is enabled:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Apply the versioned migration in [`supabase/migrations/`](supabase/migrations/) to the target Supabase project before saving runs. For a linked project, the Supabase CLI command is typically:

```bash
npx supabase db push
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Do not expose it in client components, browser variables, commits, or documentation.

Install the Chromium browser once after dependencies are installed:

```bash
npx playwright install chromium
```

The E2E suite mocks ordinary saved-run API calls, so it does not write to Supabase. Reserve real
persistence tests for a dedicated test environment.

## Commands

```bash
npm run dev             # Start the development server
npm run format          # Apply Prettier formatting
npm run lint            # Run ESLint
npm run typecheck       # Run TypeScript checks
npm run test            # Run the Vitest suite
npm run test:e2e        # Run the Playwright Chromium E2E suite
npm run test:e2e:ui     # Run E2E tests with the Playwright UI
npm run test:report     # Generate timestamped test reports in docs/test-reports/
npm run build           # Create a production build
npm run check           # Run formatting, linting, types, tests, and build
```

Run `npm run doctor` before an end-to-end agent workflow to check Stitch, Supabase, GitHub, and Vercel integration. Use `npm run doctor:offline` to validate local configuration without the Supabase network probe, or add `-- --json` for machine-readable output.

## Vercel deployment

Vercel is configured to recognize this repository as a Next.js app, use Node.js 22, run
`npm run build`, and create Git deployments for pushed branches. After importing the GitHub
repository into Vercel, configure these environment variables for both Preview and Production
environments:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Keep the service-role key server-side in Vercel's environment settings; never add it to
`NEXT_PUBLIC_*` variables, `vercel.json`, or the repository. Vercel will use `main` as the
production branch unless the project setting is changed; other pushed branches receive previews.

## Repository map

```text
app/                    App Router pages, layouts, and API routes
components/             Shared layout and tool presentation components
features/               Feature-owned logic, client components, and tests
lib/                    Shared helpers and the typed tool registry
requirements/           Product requirements and UI-approval state
supabase/migrations/    Immutable, ordered database migrations
test/                   Shared test setup
e2e/                    Feature-owned Playwright specs, fixtures, and helpers
docs/                   Architecture, feature status, task log, and reports
scripts/                Project diagnostics and test-report utilities
DESIGN.md               Canonical application design-system guidance
.stitch/                Stitch metadata and reviewed HTML/PNG design evidence
.agents/skills/         Repository-scoped workflows
.codex/skills/          Repository-scoped feature and test workflows
.codex/rules/           Repository-scoped Codex rules
.github/workflows/      Continuous-integration workflows
```

## Skills and agent workflow

This repository includes instruction packages (skills) under `.agents/skills/` and `.codex/skills/` so agents can follow its delivery conventions consistently.

### Delivery skills

- `build-dev-tool-feature` - The default end-to-end workflow for a new Dev Toolbox feature: requirement, Stitch design, explicit UI approval, implementation, tests, pull request, and Vercel Preview.
- `stitch-screen-to-feature` - Implements an existing approved Stitch screen as a Dev Toolbox route while preserving the repository architecture and design system.
- `feature-test-generation` - Produces focused, evidence-based three-level feature tests from the requirement, approved UI, and implementation.
- `playwright-e2e-testing` - Produces feature-owned Level 1–3 Playwright browser coverage without duplicating unit or route tests.
- `manual-vercel-deploy` - Validates an explicitly requested Vercel Preview; it never promotes production.

### Design support skills

- `enhance-prompt`, `stitch::generate-design`, and `stitch::manage-design-system` help prepare, generate, and maintain Google Stitch designs.
- `design-md` and `taste-design` synthesize and maintain `DESIGN.md` design-system guidance.
- `site-md` creates a Stitch Build Loop project constitution when that artifact is needed.

`react-vite-dashboard` is a separate Vite-dashboard scaffold skill; do not use it to modify this Next.js application.

### Working with an agent

Give the agent the relevant file from `requirements/` and ask it to take ownership of the change. The agent must read [AGENTS.md](AGENTS.md) and [ARCHITECTURE.md](ARCHITECTURE.md), log its plan in `docs/task-log.md`, and keep the matching requirement and [feature status](docs/FEATURE_STATUS.md) current.

For screen changes, the agent creates or inspects the Google Stitch design and stops at design review. Implementation begins only after an explicit approval such as `Approve UI` or `Approve and build`. Once approved, the agent implements the required layers, runs `npm run check`, reviews the diff for secrets, opens a pull request, and validates the Vercel Preview. Production deployment is never part of this workflow.

## Delivery workflow

For a new Dev Toolbox feature, follow [AGENTS.md](AGENTS.md): read its requirement and the architecture, log a plan, obtain explicit UI approval for Stitch-backed screen changes, implement the required layers, run `npm run check`, review the diff for secrets, then open a pull request and validate its Vercel Preview. Production deployment is out of scope for this workflow.

## Security

- Never commit `.env*` files, credentials, or generated local configuration.
- Keep Supabase service-role access in server-only modules.
- Validate incoming saved-run payloads before persistence.
- Create a new migration for every schema change; never edit an applied migration.
