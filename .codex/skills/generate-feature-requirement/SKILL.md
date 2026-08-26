---
name: generate-feature-requirement
description: Convert a rough Dev Toolbox feature idea into a detailed, project-formatted requirement under requirements/. Use when a user asks to draft, formalize, or create a REQ document; do not use for Stitch design or feature implementation.
---

# Generate Feature Requirement

Turn free-form product text into a reviewable Dev Toolbox requirement while preserving the user's
intent and the repository's current conventions.

## Establish repository context

Before drafting:

1. Read `AGENTS.md` and `ARCHITECTURE.md`.
2. Inspect `requirements/` and read the most relevant existing requirements. Treat the repository's
   current files as the formatting authority.
3. Read [references/requirement-format.md](references/requirement-format.md) completely.
4. Inspect `lib/tools.ts` when the idea is a developer utility so the proposed name, route, and scope
   do not duplicate a registered tool.

## Convert the idea into a brief

Extract or infer:

- feature name and one user-focused outcome;
- inputs and their constraints;
- visible, copyable, or downloadable outputs;
- primary actions and recovery actions;
- validation, boundary cases, and actionable errors;
- browser-local, existing saved-run, or new persistent data behavior;
- route and navigation placement;
- explicit non-goals.

Prefer repository conventions for low-risk defaults. Developer transformations default to
browser-local processing, no external calls, no persistence, and no schema change unless the idea
requires otherwise. Suggest `/tools/<kebab-case-slug>` for a utility route.

Ask a concise clarification only when a missing decision materially changes product scope, data
handling, security, or the primary user journey. Do not ask about implementation details that can
be resolved later from the architecture or approved design.

## Draft the requirement

Determine the next unused numeric `REQ-###` identifier from `requirements/`; ignore placeholders
such as `REQ-0XX`. Never overwrite an existing requirement. Follow the reference format and match
the heading punctuation and wording style already used by the repository.

Acceptance criteria must be numbered, independently testable, and collectively cover:

- the primary successful journey and result;
- invalid input plus user recovery;
- relevant empty, success, and error states;
- data, client/server, security, or external-dependency boundaries;
- integration with the shared toolbox shell and approved Stitch reference when UI is in scope.

Include only criteria supported by the user's idea or safe repository defaults. Keep implementation
choices out of the requirement unless `ARCHITECTURE.md` makes them a required boundary. Put excluded
adjacent capabilities in `Non-goals` to control scope.

Set new requirements to `design-draft`. Leave Stitch identifiers and `ui_approved_at` blank. Do not
claim UI approval, delivery evidence, test results, or implementation status.

## Confirm and save

Show the complete proposed requirement in chat before writing it. Summarize any material assumptions
next to the draft. Write `requirements/<number>-<feature-slug>.md` only after the user confirms the
draft or explicitly asks to save it immediately.

Creating the requirement does not authorize Stitch generation or application implementation. Do not
update `docs/task-log.md` or `docs/FEATURE_STATUS.md` unless the user also asks to start the feature
workflow. When that workflow is requested, hand off to `build-dev-tool-feature` and preserve its UI
approval gate.

After writing, run a scoped Prettier check on the new Markdown file and report its path, status, key
assumptions, and any unresolved product decisions.
