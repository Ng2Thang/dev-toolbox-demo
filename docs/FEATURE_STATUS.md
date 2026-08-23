# Feature Status

This file is the repository-local index for active Dev Toolbox requirements. It is a concise
planning and handoff aid; the requirement file remains the source of truth for scope and
acceptance criteria.

## Working agreement

- Update the matching file in `requirements/` whenever a feature changes status.
- Update this index only when a feature reaches a milestone, changes owner, or becomes blocked.
- Use a dedicated branch and pull request for feature work. Put live discussion, assignments, and
  review activity in the pull request or the team's issue tracker to avoid concurrent edits here.
- Do not mark a feature `delivered` until the requirement's checks and delivery evidence are
  complete.

## Status vocabulary

| Status            | Meaning                                              | Next step                                                       |
| ----------------- | ---------------------------------------------------- | --------------------------------------------------------------- |
| `design-draft`    | Requirement is being prepared.                       | Complete the brief and create a Stitch design.                  |
| `design-review`   | Stitch design awaits explicit approval.              | Obtain explicit UI approval; do not implement application code. |
| `design-approved` | Latest UI is approved.                               | Begin implementation and change status to `implementing`.       |
| `implementing`    | Code, tests, and required data work are in progress. | Run checks and create a pull request.                           |
| `delivered`       | Checks and delivery evidence are complete.           | Keep the record for history.                                    |
| `blocked`         | Progress needs a decision or external dependency.    | Record the unblocker in the requirement or linked issue.        |

## Current requirements

| Requirement                                                | Feature                    | Route              | Status          | UI approval    | Owner      | Delivery evidence                    | Blocker / next action                                                                                              |
| ---------------------------------------------------------- | -------------------------- | ------------------ | --------------- | -------------- | ---------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| [REQ-001](../requirements/001-toolbox-home.md)             | Toolbox Home and Discovery | `/`                | `design-review` | Pending        | Unassigned | ?                                    | Obtain explicit approval for Stitch screen `aed00344229b443998ebece1022763ee`.                                     |
| [REQ-002](../requirements/002-jwt-decoder.md)              | JWT Decoder                | `/tools/jwt`       | `implementing`  | 2026-08-23     | Unassigned | Check passed; 60 tests passed        | Create PR and validate Vercel Preview for Stitch screen `a77dc8152e854a5aafa4f9d9827b715c`.                        |
| [REQ-003](../requirements/003-json-formatter.md)           | JSON Formatter             | `/tools/json`      | `implementing`  | 2026-08-20     | Unassigned | ?                                    | Complete implementation, checks, PR, and preview evidence.                                                         |
| [REQ-004](../requirements/004-unix-timestamp-converter.md) | Unix Timestamp Converter   | `/tools/timestamp` | `delivered`     | 2026-08-23     | Unassigned | PR #8; preview Ready                 | Preview `dpl_Dn1DtPtFKaQ8cYhz9DVRPPzFEtDd` is SSO-gated; manual browser validation needs authorized Vercel access. |
| [REQ-005](../requirements/005-uuid-generator.md)           | UUID Generator             | `/tools/uuid`      | `implementing`  | 2026-08-23     | Codex      | Check passed; 75 tests; local commit | Await explicit authorization to push to the configured GitHub remote, open PR, and validate Vercel Preview.        |
| [REQ-0XX](../requirements/0XX-local-only-toolbox.md)       | Local-only Dev Toolbox     | `/`                | `design-draft`  | Not applicable | Unassigned | ?                                    | Finish the brief and create the replacement shared-shell Stitch design.                                            |

## Update template

When a feature changes, update its row with only the fields that changed:

```md
| [REQ-###](../requirements/###-feature.md) | Feature name | `/route` | `implementing` | YYYY-MM-DD or Pending | @owner | PR #123 ? Preview | Short next action or blocker |
```

Use `?` for evidence that does not exist yet. Keep secrets, environment values, and private URLs
out of this file.
