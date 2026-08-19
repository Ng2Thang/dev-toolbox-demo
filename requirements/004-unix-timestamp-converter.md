---
id: REQ-004
status: design-review
route: /tools/timestamp
stitch_project: Dev Toolbox
stitch_screen_id: 4f93fcfe8fad4d84920ad5f28b339946
stitch_screen_title: Unix Timestamp Converter
ui_approved_at:
---

# REQ-004 - Unix Timestamp Converter

## Goal

Convert Unix epoch timestamps into readable dates and convert selected dates back to epoch values.

## Inputs

- A numeric Unix timestamp in seconds or milliseconds.
- A date and time for reverse conversion when that mode is selected.

## Outputs

- Human-readable local and UTC date-time representations.
- The converted epoch value and a validation error for invalid dates or timestamps.

## Main actions

- Convert, switch conversion direction, use the current time, copy a result, and save a successful run.

## Validation

- Require finite numeric timestamp values and valid calendar dates.
- Clearly distinguish seconds from milliseconds.

## Data

- Browser-local conversion; successful runs may use the existing saved-run API.

## Acceptance criteria

1. Valid seconds and milliseconds inputs show an unambiguous UTC and local representation.
2. Reverse conversion returns a numeric epoch and invalid input shows an actionable error.
3. The screen provides the approved Stitch empty, success, and error states.

## Non-goals

- Time-zone database management or recurring date scheduling.
