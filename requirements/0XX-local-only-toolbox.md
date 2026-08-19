---
id: REQ-0XX
status: design-draft
route: /
stitch_project: Dev Toolbox
stitch_screen_id:
stitch_screen_title:
ui_approved_at:
---

# REQ-0XX - Local-only Dev Toolbox

## Goal

Let developers use every Dev Toolbox utility without Supabase, saved-run history, or any persistent backend dependency.

## Inputs

- The existing browser-local inputs for each developer utility.

## Outputs

- The existing tool results, copy actions, and local validation feedback.

## Main actions

- Run, format, convert, generate, clear, copy, and swap tool results where supported.
- Browse the available local-only developer utilities from the shared shell.

## Validation

- Preserve each tool's current browser-local validation and error states.
- Do not send tool data to a server or external persistence service.

## Data

- Local-only. Remove Supabase, saved-run persistence, the runs API, and history from active application behavior.

## Acceptance criteria

1. The shared UI contains no Saved Runs navigation, save controls, history route, or history-related copy.
2. All developer utilities remain usable with local validation and browser-local processing only.
3. The project has no Supabase runtime dependencies, application environment variables, or active integration checks.
4. The updated application follows the approved Stitch reference and passes its quality checks.

## Non-goals

- Replacing saved runs with browser storage, adding user accounts, or adding a different persistence provider.
- Changing the behavior of individual developer utilities beyond removing their save-to-history behavior.
