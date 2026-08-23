---
id: REQ-003
status: implementing
route: /tools/json
stitch_project: Dev Toolbox
stitch_screen_id: 63710ae7475446a88940dd6d9a3f8180
stitch_screen_title: JSON Formatter - Refined
ui_approved_at: 2026-08-20
---

# REQ-003 - JSON Formatter

## Goal

Format and validate JSON so developers can quickly inspect or copy structured data.

## Inputs

- Raw JSON text.
- Formatting preference such as indentation when exposed by the UI.

## Outputs

- Pretty-printed JSON.
- A parse error with useful location context for invalid input.

## Main actions

- Format, clear, copy output, and save a successful run.

## Validation

- Reject empty and syntactically invalid JSON.
- Preserve valid JSON primitives, arrays, and objects.

## Data

- Browser-local formatting; successful runs may use the existing saved-run API.

## Acceptance criteria

1. Valid JSON is formatted deterministically and can be copied.
2. Invalid JSON retains the input and shows a clear error state.
3. The route uses the shared shell and the approved Stitch input/output workspace.

## Non-goals

- JSON Schema validation, remote fetching, or mutation of external data.
