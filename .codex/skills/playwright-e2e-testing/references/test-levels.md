# Dev Toolbox Playwright test levels

Select the level based on the risk proved by the browser test. Every case must be evidenced by the
requirement, approved UI, or implementation; do not create placeholder coverage.

## Level 1 — happy path

Prove the feature's single critical user journey with representative valid input. Open the route,
perform the primary action, and assert the user-visible result. Include navigation coverage when a
feature must be discoverable from the home screen or sidebar.

Examples: format valid JSON, decode a compact JWT, convert a valid timestamp, or generate UUIDs.
When available, also cover an alternate valid input, mode, or successful copy/save action.

## Level 2 — common usage and recovery

Cover ordinary mistakes and the interactions users regularly combine with the main action. Select
only applicable cases: invalid or empty input, changing an option, clear/reset, a common boundary,
an empty state, or a mocked failed save request.

Examples: invalid JSON followed by correction, milliseconds versus seconds, UUID quantity bounds,
or a save request returning HTTP 500.

For each feature, cover every applicable category: invalid/empty input, a stated boundary, state
reset or option switching, and an ordinary mocked API failure.

## Level 3 — resilience and high-risk behavior

Cover a specific browser or cross-layer risk that is meaningful for the feature. Name that risk in
the test title or a nearby comment. Suitable cases include large input, Unicode or multiline data,
browser API failure, failed clipboard access, malformed external data, timeout/500 recovery,
duplicate prevention, or relevant security-sensitive parsing.

Do not use Level 3 for speculative combinations, visual snapshots, or cases that are better proved
by a pure Vitest test.

Select at least two applicable risks per implemented browser feature. Record why a risk is not
applicable when the feature has fewer than two meaningful browser-level resilience risks.

## Execution policy

Run Levels 1 and 2 on every pull request. Run Level 3 on every pull request while the browser suite
remains fast and deterministic; otherwise run it on `main` or a scheduled CI workflow, plus whenever
the affected feature changes.
