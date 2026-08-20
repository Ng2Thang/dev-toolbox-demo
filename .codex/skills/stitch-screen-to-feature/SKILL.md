---
name: stitch-screen-to-feature
description: Inspect a Google Stitch screen ID, inventory its UI and states, then implement it as a new Dev Toolbox feature using this repository's architecture and DESIGN.md. Use when an existing Stitch screen is the source for a new route or tool; not for designing from scratch or a visual-only tweak.
---

# Stitch Screen to Feature

Turn one existing Stitch screen into a repository-native Dev Toolbox feature. The screen is the
visual contract, `DESIGN.md` the theme contract, and the requirement plus `ARCHITECTURE.md` the
behavior and ownership contracts.

## Resolve inputs and context

Require a screen ID. Accept an optional project ID, route, and feature name. When only a screen ID
is given in this repository, use Dev Toolbox project `16366908838244426917`; verify the title of
any different supplied project.

Read `AGENTS.md`, `ARCHITECTURE.md`, `DESIGN.md`, the matching requirement when present, and
impacted route, feature, component, registry, API, and test files. Preserve unrelated worktree
changes.

## Inspect before code

Retrieve the current screen through Google Stitch MCP, including screenshot and available metadata
or markup. Visually inspect the screenshot. Treat generated markup as structural and asset evidence,
not code to paste into the app.

Before application edits, produce the audit in
[`references/screen-audit.md`](references/screen-audit.md). Count visible instances, not component
types. Report repeated-item counts separately and label hidden, cropped, ambiguous, or inferred
details. Cover regions; navigation; headings; fields; actions; cards; rows; tabs; badges; semantic
icons; messages; shown or missing states; interactions; data flow; reusable repo components; and
DESIGN.md mappings.

If the screenshot is unavailable or too incomplete to establish its primary hierarchy, stop and
report the missing evidence. Never invent counts.

## Map into Dev Toolbox

Create a screen-to-code map before editing:

- thin page at `app/(toolbox)/tools/<slug>/page.tsx`
- feature-owned domain logic, smallest client boundary, and tests under `features/<slug>/`
- `lib/tools.ts` registration for a toolbox utility
- matching primitives from `components/tool/` or `components/layout/`
- API, Zod, server repository, saved-run, and migration impact when required

Reuse an abstraction only when it already expresses the same pattern. Use Server Components by
default, `'use client'` only at the interactive boundary, `@/` imports, JSON-compatible saved-run
output, and a new migration for each schema change. Keep Stitch presentation separate from domain
behavior and server access.

Map colors, typography, spacing, radii, borders, and technical text to `DESIGN.md` and existing
`app/globals.css` tokens. If Stitch differs, preserve its layout and hierarchy while choosing the
closest design token and recording material mismatches. Do not create a parallel theme.

Write a concise implementation plan to `docs/task-log.md`.

## Approval gate

A new feature remains subject to the repository approval gate. The exact latest screen must have
explicit user UI approval in its requirement or current conversation; a screen ID is not approval.

Without approval, return the audit and proposed code map, request approval, and stop before
application code edits. If the screen changed after approval, return it to design review. After
approval, record the project ID, screen ID, route, approval date, and accurate requirement status.

## Implement and deliver

Implement all layers required by the approved requirement. Test transformation and validation
behavior plus observable interactions or route boundaries. Add important missing states when the
feature requires them, labeling them as inferred rather than Stitch-observed.

## Verify visual fidelity

Before calling the feature visually complete, read
[`references/visual-fidelity-review.md`](references/visual-fidelity-review.md). Render the
implemented route at the Stitch screenshot's exact viewport. Compare the reference and
implementation side-by-side or with an overlay, then correct mismatches in this order: page and
region geometry; alignment; spacing; typography; colors, borders, and surfaces; then small
controls, icons, labels, and dividers.

Reconcile the implementation against the pre-code screen audit: every audited visible instance must
be present with the expected position and state, or be listed in the intentional-deviation register
with a concrete reason. Check every available Stitch viewport; when only desktop exists, also
inspect the narrow responsive layout required by `DESIGN.md`. Repeat the comparison after material
visual corrections. Do not report visual fidelity as complete while an observed mismatch remains
unresolved or undocumented.

Format only intentionally changed paths with Prettier, run `npm run check`, and fix failures until
green or externally blocked. Review the diff for coverage, fidelity, accidental files, secrets,
client/server violations, and migration safety.

Create a feature branch and pull request and validate the Vercel Preview when connections exist.
Never deploy to production.

Report the screen identity and viewport, audit and counts, screen-to-code map, DESIGN.md mapping,
visual comparison result and intentional deviations, requirement status, changed layers, schema
impact, checks, PR, preview, and blockers. Never claim counts, approval, visual fidelity, checks,
PRs, or preview health without direct evidence.
