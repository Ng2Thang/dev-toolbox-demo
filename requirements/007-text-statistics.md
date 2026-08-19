---
id: REQ-007
status: design-review
route: /tools/text-statistics
stitch_project: Dev Toolbox
stitch_screen_id: 654e8c82900141f39590c02abb4b9c17
stitch_screen_title: Text Statistics
ui_approved_at:
---

# REQ-007 - Text Statistics

## Goal

Provide immediate, local statistics that help developers inspect a block of text.

## Inputs

- Text entered or pasted into the workspace.

## Outputs

- Counts for characters, characters excluding whitespace, words, lines, and reading-time estimate when supported.

## Main actions

- Analyze as the text changes, clear input, copy selected metrics, and save a successful run.

## Validation

- Treat an empty input as a useful zero-count state rather than an error.
- Define word and line counting behavior consistently for whitespace and trailing newlines.

## Data

- Browser-local analysis; successful runs may use the existing saved-run API.

## Acceptance criteria

1. Metrics update consistently as the user edits text and are correct for empty, whitespace-only, and multi-line input.
2. The UI distinguishes the initial/empty state from a populated analysis state.
3. The screen preserves the approved Stitch card hierarchy and no text is sent to an external analysis service.

## Non-goals

- Grammar correction, language detection, content moderation, or cloud text storage.
