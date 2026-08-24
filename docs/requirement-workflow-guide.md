# Dev Toolbox Requirement Workflow Guide

This guide describes the path from a feature idea to a delivered Dev Toolbox requirement.

## Choose the right skill

| Task                                                     | Skill                    |
| -------------------------------------------------------- | ------------------------ |
| New user-facing tool or product feature                  | `build-dev-tool-feature` |
| Sync one or more existing Stitch screens into the app    | `stitch-screen-sync`     |
| Refine one route to match a Stitch screenshot            | `stitch-screen-improve`  |
| Generate browser E2E coverage for an implemented feature | `playwright-e2e-testing` |

Use `build-dev-tool-feature` for a new tool. Use the Stitch skills when visual work is driven by
an existing Stitch screen.

## Requirement statuses

```text
design-draft -> design-review -> design-approved -> implementing -> delivered
```

| Status            | Meaning                                                                                      |
| ----------------- | -------------------------------------------------------------------------------------------- |
| `design-draft`    | The feature brief and requirement are being prepared.                                        |
| `design-review`   | A Stitch design exists and is awaiting feedback or explicit approval. Do not implement code. |
| `design-approved` | The user explicitly approved the latest UI.                                                  |
| `implementing`    | Application code, tests, and required data layers are being changed.                         |
| `delivered`       | Checks and delivery evidence, including PR/preview when available, are complete.             |

If a Stitch screen changes after approval, return to `design-review` and request approval again.

## 1. Create a requirement

1. Collect the feature name, user outcome, inputs, outputs, actions, validation, data needs,
   preferred route, and design notes.
2. Find the next available ID in `requirements/`.
3. Create `requirements/<id>-<feature-slug>.md` and set `status: design-draft`.
4. Record a concise plan in `docs/task-log.md`.

Use this frontmatter:

```yaml
---
id: REQ-009
status: design-draft
route: /tools/example
stitch_project: Dev Toolbox
stitch_screen_id:
stitch_screen_title:
ui_approved_at:
---
```

The body must include Goal, Inputs, Outputs, Main actions, Validation, Data, Acceptance criteria,
and Non-goals.

## 2. Design in Stitch

Resolve the Dev Toolbox project by listing projects; never hard-code a project ID. Generate a
focused screen containing the shared shell, route intent, inputs, output, actions, validation,
and empty/error/success states. Inspect the generated screen, record its ID/title in the
requirement, then set the status to `design-review`.

Use an explicit phrase such as `Approve UI`, `UI approved`, or `Approve and build`. Feedback or
silence is not approval.

## 3. Implement an approved screen

After approval, retrieve the latest Stitch screen, set `ui_approved_at`, then set the requirement
to `design-approved` and `implementing` when code changes start.

Follow the feature-first structure:

```text
app/(toolbox)/tools/<tool>/page.tsx       Thin route page
features/<tool>/<tool>.ts                 Pure logic
features/<tool>/<tool>.client.tsx         Browser interaction
features/<tool>/<tool>.test.ts            Unit tests
```

Update `lib/tools.ts` for discoverable tools. Do not copy Stitch HTML wholesale; use the screenshot
as the visual source of truth and preserve app architecture.

## 4. Data and security

- Prefer local browser processing for utilities.
- Reuse Saved Runs when appropriate.
- Validate new server inputs with Zod.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
- Add a new timestamped migration for schema changes; never edit an applied migration.
- Never commit `.env*`, tokens, credentials, or temporary generated configuration.

## 5. Scoped formatting and checks

Formatting is mandatory, but only for changed feature-related files: the route, feature folder,
tests, and intentionally edited shared files such as `lib/tools.ts` or `app/globals.css`.

```bash
npx prettier --write <feature-related-paths>
npx prettier --check <feature-related-paths>
npm run check
npm run test:e2e
```

Do not use repository-wide formatting for a focused feature unless explicitly requested. Review
the diff for secrets, accidental files, unrelated changes, and requirement coverage.

## 6. Deliver

After unit/component/API and Playwright E2E tests pass, create a branch and pull request when
available, and validate the Vercel Preview.
Mark a requirement `delivered` only when required checks and delivery evidence exist. Production
deployment and production migration require separate explicit authorization.

## Final report

Report the requirement path/status, Stitch project/screen/route, acceptance-criteria evidence,
changed files, migration impact, checks, PR/preview URL, and remaining risks or blockers.
