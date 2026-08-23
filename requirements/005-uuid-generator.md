---
id: REQ-005
status: delivered
route: /tools/uuid
stitch_project: Dev Toolbox
stitch_screen_id: 9526f5b6ba6b472f9d123d8a242389ca
stitch_screen_title: UUID Generator
ui_approved_at: 2026-08-23
---

# REQ-005 - UUID Generator

## Goal

Generate standards-compliant UUID v1, v4, and v7 values locally for developers to copy into their work.

## Inputs

- UUID version: v1, v4, or v7, defaulting to v4.
- Quantity of UUIDs to generate, defaulting to one.

## Outputs

- A copyable list of generated UUIDs.
- Per-UUID and bulk-copy affordances.
- A clear explanation when generation cannot be completed.

## Main actions

- Generate UUIDs, copy an individual UUID, copy all UUIDs, clear the list, and regenerate values.

## Validation

- Require quantity to be a whole number within a safe UI limit.
- Explain when the required browser cryptography capability is unavailable.
- Generate valid UUID v1, v4, or v7 values for the selected version.

## Data

- Browser-local UUID generation only; no persistence, saved-run integration, or database migration.

## Acceptance criteria

1. A user can generate the selected quantity of valid UUID v1, v4, or v7 values locally and copy one or all results.
2. Invalid quantity input preserves the current results and shows an actionable validation error.
3. The route uses the shared toolbox shell and reflects the approved Stitch empty, success, and error states.
4. The client feature does not require server data, external APIs, or a schema migration.

## Non-goals

- UUID validation, parsing, conversion, namespace-based UUID creation, or remote UUID services.
- Saved-run history or any new persistent storage.

## Delivery evidence

- Approved Stitch screen: `9526f5b6ba6b472f9d123d8a242389ca` (Dev Toolbox, `/tools/uuid`).
- Full `npm run check` passed: formatting, lint, strict typecheck, 75 Vitest tests, and production build.
- Local commit: pending amended SHA after delivery-evidence update.
- Remaining delivery step: explicit authorization is required to push to the configured GitHub remote, open the pull request, and validate a Vercel Preview.
