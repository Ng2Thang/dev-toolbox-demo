---
id: REQ-005
status: design-review
route: /tools/concat
stitch_project: Dev Toolbox
stitch_screen_id: 0fec624a87ed49649f586fb6997c580e
stitch_screen_title: Concatenate String
ui_approved_at:
---

# REQ-005 - Concatenate String

## Goal

Combine a set of line-separated values into one string using a developer-selected separator.

## Inputs

- Line-separated source values.
- A separator and optional trimming or empty-line handling options.

## Outputs

- The concatenated string and count of included values.

## Main actions

- Concatenate, clear, copy output, and save a successful run.

## Validation

- Require at least one non-empty value after applying the selected empty-line rule.
- Preserve the separator exactly as entered.

## Data

- Local-only transformation; successful runs may use the existing saved-run API.

## Acceptance criteria

1. The tool joins input lines in order with the selected separator.
2. Empty or whitespace-only input produces a clear validation state instead of an ambiguous result.
3. Copy and saved-run actions are available only for a successful result.

## Non-goals

- CSV parsing, file uploads, or automatic delimiter detection.
