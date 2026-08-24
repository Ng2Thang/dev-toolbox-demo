# Dev Toolbox team introduction

Presentation source for the repository onboarding deck. Open
[`dev-toolbox-team-introduction.html`](dev-toolbox-team-introduction.html) in a browser, then use
the arrow keys, spacebar, or on-screen controls to navigate.

The visual deck includes an original hero illustration in `assets/codex-toolbox-hero.png`,
progressive visual reveals, and a reduced-motion fallback. The illustration was generated with
the built-in OpenAI image-generation workflow for this repository; it contains no text or logos.

## Slide outline

---

# Dev Toolbox

## The team introduction

Small browser-based developer utilities, built through a traceable Codex workflow.

---

# What we are building

- JWT Decoder, JSON Formatter, Unix Timestamp Converter, and UUID Generator
- Browser-first tool behavior; optional saved-run persistence in Supabase
- A practical demonstration of an autonomous, reviewable delivery process

---

# Codex in this repository

Codex is the coding agent used to take scoped work from requirement to reviewable delivery.
It reads repository instructions, inspects code, can use approved tools, implements changes,
runs checks, and prepares delivery evidence. People remain responsible for scope, approvals, and
review.

Official product context: <https://developers.openai.com/>.

---

# Skills turn repeatable work into workflows

Skills are task-specific instruction packages. This repository includes workflows for:

- New-feature delivery (`build-dev-tool-feature`)
- Stitch design generation and design-system management
- Focused feature tests and Playwright E2E coverage
- Implementing approved Stitch screens and validating manual previews

---

# Rules make the workflow safe and consistent

| Source | Purpose |
| --- | --- |
| `AGENTS.md` | Delivery contract: inspect, plan, implement, test, PR, preview |
| `ARCHITECTURE.md` | Route ownership, client/server boundaries, persistence, security |
| `.codex/rules/` | Local execution and pull-request constraints |
| `requirements/` | Feature scope, status, acceptance criteria, design approval |
| `docs/FEATURE_STATUS.md` | Compact handoff and milestone index |

---

# A feature delivery loop

```text
Requirement → architecture review → plan → Stitch design → explicit UI approval
    → implementation → tests and npm run check → PR → Vercel Preview validation
```

No production deployment belongs in this loop. A schema change requires a new immutable
Supabase migration; secrets never belong in client code or commits.

---

# Application architecture

```text
Browser tool UI → feature-owned browser logic
                     ↓ optional saved run
                 POST /api/runs
                     ↓
        Zod validation → server-only repository → Supabase/Postgres
```

Thin route pages compose feature components. `lib/tools.ts` is the canonical tool and navigation
registry.

---

# Repository map

```text
app/                App Router pages, layouts, API routes
components/         Shared shell and tool presentation
features/           Feature logic, client components, unit/component tests
lib/                Shared helpers and typed tool registry
requirements/       Scope, acceptance criteria, approval state
supabase/migrations/ Immutable database history
e2e/                Playwright journeys and fixtures
docs/               Status, task logs, onboarding, reports
.stitch/            Reviewed visual-design evidence
```

---

# Git timeline: August 19–24, 2026

- Repository foundation, quality gates, requirements, and agent workflows established
- JWT delivery evidence and manual-preview controls added
- Unix Timestamp Converter delivered in PR #8
- UUID Generator delivered in PR #9
- Playwright E2E coverage added and merged in PR #10

Git history is evidence of delivery; requirements and feature status are the source of current
scope and state.

---

# Current work at a glance

| State | Work |
| --- | --- |
| Delivered | Unix Timestamp Converter; UUID Generator |
| Implementing | JWT Decoder; JSON Formatter; this onboarding deck |
| Design review/draft | Toolbox Home; local-only toolbox |

See `docs/FEATURE_STATUS.md` for current owners, blockers, and delivery evidence.

---

# Your first contribution

1. Read `README.md`, `AGENTS.md`, and `ARCHITECTURE.md`.
2. Choose one requirement and check its status and UI-approval state.
3. Run `npm ci`, configure `.env.local` only if saved runs are needed, then use `npm run dev`.
4. Follow the relevant skill, preserve feature boundaries, and run `npm run check`.
5. Review the diff for secrets and scope, then deliver through a pull request and preview.

---

# Questions to bring to the team

- Which requirements are ready for review or implementation?
- Who owns product approval and Vercel preview access?
- Is persistence required for the work, or can it remain browser-local?
- What is the smallest useful first change?

---

# Thank you

Start with the requirement, keep the work traceable, and make every change easy to review.
