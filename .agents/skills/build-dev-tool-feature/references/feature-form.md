# Feature brief form

Present this compact form in chat. Pre-fill reasonable answers from the repository and let the
user correct them.

```markdown
## New Dev Toolbox feature

Feature name:
User outcome: What should this tool help the user do?
Inputs: What does the user enter or select?
Outputs: What should the tool show, copy, download, or save?
Main actions: What are the primary buttons or interactions?
Validation: Which inputs should be rejected or explained?
Data: Process locally, save to existing run history, or store new persistent data?
Navigation: Preferred route and category, or let Codex suggest them.
Design notes: Optional examples, references, or layout preferences.
```

Require clear answers for feature name, user outcome, inputs, and outputs. Infer navigation from
the existing tool registry when possible. Default to local processing and no new database unless
the requested behavior requires persistence.

Save the confirmed brief with this structure:

```markdown
---
id: REQ-000
status: design-draft
route: /tools/example
stitch_project: Dev Toolbox
stitch_screen_id:
stitch_screen_title:
ui_approved_at:
---

# REQ-000 — Feature name

## Goal

One user-focused outcome.

## Inputs

- Input and constraints

## Outputs

- Visible or downloadable result

## Main actions

- User interaction

## Validation

- Invalid and boundary behavior

## Data

- Local-only, existing saved runs, or new persistence

## Acceptance criteria

1. Testable behavior.
2. Testable UI state.
3. Quality or security expectation.

## Non-goals

- Explicit exclusions, if any
```
