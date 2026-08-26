# Dev Toolbox requirement format

Use this structure for a new feature requirement. Match minor stylistic details to existing files in
`requirements/` when they differ from this template.

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

# REQ-000 - Feature name

## Goal

One sentence describing the outcome for the developer, not the implementation.

## Inputs

- Each value the user enters or selects, including meaningful defaults and constraints.

## Outputs

- Each visible, copyable, or downloadable result.
- User-facing feedback that is part of the result.

## Main actions

- Primary action, secondary actions, and useful recovery actions.

## Validation

- Rejected input, boundary behavior, and actionable error expectations.
- State-preservation or recovery behavior when it matters.

## Data

- State whether processing is browser-local, uses existing saved runs, or needs new persistence.
- State external-service and migration expectations when relevant.

## Acceptance criteria

1. A testable primary success behavior with an observable result.
2. A testable invalid or boundary behavior with observable recovery.
3. A testable UI-state or shared-shell expectation when UI is in scope.
4. A testable data, security, or external-dependency boundary.

## Non-goals

- Closely related behavior intentionally excluded from this requirement.
```

## Writing rules

- Keep `Goal` singular and user-focused.
- Distinguish inputs from actions: a mode selector is an input; selecting Convert is an action.
- Name output formats and copy/download behavior explicitly.
- Describe errors by what the user can understand or do next, not internal exception types.
- Include defaults or numeric limits only when supplied by the user, established by the repository,
  or necessary to keep the tool safe and usable.
- Use deterministic language: `displays`, `rejects`, `preserves`, and `does not send` are stronger
  than `should handle` or `works correctly`.
- Avoid visual pixel specifications before Stitch review.
- Avoid test implementation, component names, libraries, and database table design unless they are
  architectural constraints rather than implementation choices.

## Acceptance-criteria checklist

Before presenting the draft, verify that every criterion:

1. Has one principal behavior.
2. Can be demonstrated or asserted without interpreting vague words such as “easy” or “properly.”
3. Identifies the triggering condition and observable result.
4. Does not repeat another criterion or expand beyond the stated goal.

Also verify the set covers the main journey, error recovery, relevant UI states, and the declared
data boundary. Add more than four criteria only when the feature has additional independently
important behavior.
