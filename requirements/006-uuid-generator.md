---
id: REQ-006
status: design-review
route: /tools/uuid
stitch_project: Dev Toolbox
stitch_screen_id: c7e00880fd964ed5baa7ad0f6533ada6
stitch_screen_title: UUID Generator
ui_approved_at:
---

# REQ-006 - UUID Generator

## Goal

Generate one or more standards-compliant version 4 UUIDs for developer workflows.

## Inputs

- Requested quantity of UUIDs within the UI-supported range.

## Outputs

- A newline-separated list of random UUID v4 values.

## Main actions

- Generate, regenerate, copy an individual or complete result, and save a successful run.

## Validation

- Require an integer quantity inside the supported safe range.
- Use browser cryptographic randomness when available and explain when it is unavailable.

## Data

- Browser-local generation; successful runs may use the existing saved-run API.

## Acceptance criteria

1. Every generated value matches UUID v4 structure and is unique within a generated batch.
2. Invalid quantity input shows a clear validation message and produces no UUIDs.
3. The approved Stitch UI provides useful initial and success states with copy support.

## Non-goals

- UUID versions other than v4, persistence of UUID inventories, or server-side generation.
