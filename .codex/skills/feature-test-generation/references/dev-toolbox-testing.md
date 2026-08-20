# Dev Toolbox test selection

## Evidence order

1. The accepted requirement defines behavior that must be covered.
2. The latest approved Stitch UI defines user-facing controls and intended states.
3. The implementation and `ARCHITECTURE.md` determine the correct ownership boundary.

Resolve conflicts in that order. Escalate an inconsistency between an approved requirement and UI instead of silently selecting different behavior.

## Test conventions

- This repository uses Vitest with `jsdom`; shared setup is in `test/setup.ts`.
- For component tests, use React Testing Library and query by role, label, text, or accessible name.
- Drive a component through observable input and actions. Assert visible output, alerts, status messages, and public calls such as the request after a save action.
- For route handlers, use `vi.hoisted` and `vi.mock` before importing the handler when mocking a repository. Verify malformed or invalid requests return `400` before the mock repository writes.
- Keep pure behavior independent from React, browser APIs, and fetch so it is testable directly.

## Coverage matrix template

| Behavior or UI state | Evidence | Layer | Test assertion |
| --- | --- | --- | --- |
| Successful action | Requirement acceptance criterion; approved primary action | Component or domain | Action produces the specified output/state |
| Invalid input | Requirement validation; approved error state | Domain + component | Validation is shown and no prohibited action occurs |
| Server boundary | Requirement data flow | Schema or route | Invalid data is rejected before persistence |

Use only rows that apply. Responsive layout, styling tokens, spacing, and static decorative elements are normally reviewed against Stitch, not asserted in unit or component tests.
