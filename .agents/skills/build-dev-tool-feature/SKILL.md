---
name: build-dev-tool-feature
description: Guide a new Dev Toolbox feature from a short idea through a structured requirement, Google Stitch screen generation and revision, explicit user UI approval, implementation, database changes when needed, tests, pull request, and Vercel preview. Use when the user asks to add, create, design, or build a new developer tool or product feature in this repository. Do not use for small bug fixes, explanation-only requests, or a visual-only tweak to an existing approved screen.
---

# Build Dev Tool Feature

Turn a feature idea into a delivered Dev Toolbox change. Keep the user interaction simple and
stop once, at the UI approval gate, before implementation.

## 1. Collect the feature brief

Read `AGENTS.md` and `ARCHITECTURE.md`, inspect the repository, then read
`references/feature-form.md`.

Present the compact form in chat. Fill obvious defaults from existing project conventions and
ask the user only for missing product decisions. Do not ask for implementation details that can
be inferred from the repository.

After the user confirms the brief:

1. Select the next available requirement ID from `requirements/`.
2. Create `requirements/<id>-<feature-slug>.md` using the reference template.
3. Set its status to `design-draft`.
4. Record a concise plan in `docs/task-log.md`.

## 2. Generate and iterate in Stitch

Use the configured Google Stitch MCP. Resolve the current Dev Toolbox project rather than
hard-coding an account-specific project ID.

Generate one focused screen from the confirmed requirement. Include the existing app shell,
route, inputs, output, primary actions, validation, and useful empty/error/success states in the
Stitch prompt. Match the established Dev Toolbox visual system.

Record the Stitch project title, screen ID, screen title, and route in the requirement, then set
the status to `design-review`.

Support both revision paths:

- When the user describes a UI change, update or regenerate the target Stitch screen through
  MCP, retrieve it again, and summarize the change.
- When the user edits directly in Google Stitch, retrieve the latest target screen after they
  say to refresh or review it.

Always inspect the current Stitch screen after a revision. Do not implement application code
while the requirement status is `design-draft` or `design-review`.

## 3. Enforce the approval gate

Wait for an explicit user statement such as `Approve UI`, `UI approved`, or `Approve and build`.
Ordinary feedback or silence is not approval.

On approval:

1. Retrieve and inspect the latest Stitch screen once more.
2. Update its identifiers in the requirement.
3. Set the requirement status to `design-approved` and record the approval date.
4. Continue directly into implementation in the same task; do not ask for step-by-step coding
   instructions.

If the target screen changes after approval but before implementation finishes, return the
requirement to `design-review` and obtain approval again.

## 4. Implement the approved feature

Read `references/delivery-checklist.md`. Treat the approved requirement and latest Stitch screen
as the contract.

Implement only the layers the feature needs:

1. Add the thin App Router page and feature module.
2. Register every new Dev Toolbox tool in `lib/tools.ts`. Append it to preserve first-added, first-displayed order; the registry drives both Home **Popular tools** and the AppShell sidebar.
3. Keep pure transformation logic separate from the client component.
4. Use the existing saved-run API when the feature only needs run history.
5. Add Zod validation, a server-only repository, and API handling for new server data.
6. Create a new Supabase migration for new schema; never edit an applied migration.
7. After all required implementation layers are in place, invoke `$feature-test-generation` with
   the current requirement, approved Stitch reference, and implementation. It owns the focused
   tiered feature suite, including applicable domain, component, and route coverage.
8. Invoke `$playwright-e2e-testing` with the current requirement and implementation. It owns
   Level 1–3 browser coverage for observable user journeys and must not duplicate unit coverage.
9. Preserve the client/server and security boundaries in `ARCHITECTURE.md`.

Set the requirement status to `implementing` when code work begins.

## 5. Verify

Before formatting, run `$feature-test-generation` when the feature's tests have not already been
generated in this implementation pass. Treat its tiered traceability matrix and generated test
files as part of the delivery contract.

Formatting is mandatory for every implemented requirement, but it must be scoped to the feature's
changed files. Build an explicit path list from the feature folder, its route page, its tests, and
only shared files deliberately changed for that requirement (for example `lib/tools.ts` or
`app/globals.css`). Run `npx prettier --write <paths>`, then `npx prettier --check <paths>`, before
running `npm run check`. Do not use the repository-wide `npm run format` command for a focused
feature unless the user explicitly asks for a full-repository format.
Run `npm run test:e2e` to exercise the primary browser journey and relevant error states with
Playwright. Review any failure screenshots and traces. Fix failures and rerun until green or a
real external blocker remains. Review the complete diff for secrets, temporary files, unrelated
changes, requirement coverage, and migration safety.

## 6. Deliver

Create a feature branch and commit, then run `npm run test:report` against that committed `HEAD`.
Include its full-project result, tested commit SHA, and report paths in the `## Test Report`
section of the pull-request template before opening a GitHub pull request and validating the Vercel
Preview when those connections are available.

After the pull request is created or updated, add one PR conversation comment with a compact report
summary: tested commit SHA, passed/failed/skipped totals, the Markdown and JSON report paths, and
concise failures or a passing result. Use a normal PR comment (for example, `gh pr comment`), not a
line-level review comment.

Before opening the pull request, read `.github/pull_request_template.md` and use its structure,
completing every applicable field with evidence from the requirement and verification. Do not replace
it with an ad-hoc PR body. If the template is unavailable, report that delivery blocker. Never
promote to production as part of this skill.
Set the requirement status to `delivered` only when the required checks pass and the requested
delivery evidence exists. Otherwise leave the accurate status and report the blocker.

Return:

- requirement path and final status
- Stitch project, screen, and route
- acceptance-criteria evidence
- changed areas and migration impact
- test/build results
- pull request and preview URL
- remaining blockers or risks

## Safety rules

- Never expose or commit credentials.
- Never put `SUPABASE_SERVICE_ROLE_KEY` in client code.
- Never apply a production migration or production deployment without separate explicit
  authorization.
- Never claim that the UI was approved, tests passed, a PR exists, or a preview is healthy
  without direct evidence.
