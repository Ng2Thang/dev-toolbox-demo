# Tiered test generation

Use levels to make test coverage deeper without turning every utility into an oversized suite. A higher level supplements—not replaces—the lower levels.

## Mandatory file layout

Every generated feature suite must contain exactly three files, each with at least five runnable test cases:

```text
features/<feature>/<feature>.level-1.test.ts[x]
features/<feature>/<feature>.level-2.test.ts[x]
features/<feature>/<feature>.level-3.test.ts[x]
```

Use the feature name as the file prefix and keep every test in its assigned level file. Select one extension for all three: `.tsx` if any level renders React and `.ts` otherwise. Do not create empty files, `it.skip` placeholders, or duplicate assertions solely to reach the five-case minimum. If the available evidence cannot support five real cases at a level, report the gap instead of generating an invalid suite.

## Level 1: core and common

Add the contract cases a developer expects to work every time:

- one representative successful transformation, decode, conversion, or generation;
- the main UI action and visible result when a client component owns it;
- the most common invalid, empty, or malformed input; and
- a direct assertion of the promised output, error, status, or blocked action.

## Level 2: realistic and intermediate

Add cases that reflect typical input variation and user flow:

- trimming, empty-line behavior, alternate separators, optional fields, and stated defaults;
- minimum/maximum values, boundary timestamps, zero, and negative values when supported;
- an error followed by corrected input and successful retry;
- disabled/enabled actions, clear/reset, copy/download/save after a successful result; and
- route/schema status behavior and a proof that rejected input does not persist.

## Level 3: advanced and risk-driven

Use only when the evidence identifies a real risk. State the risk next to each selected case.

| Risk signal | Suitable advanced case |
| --- | --- |
| Cross-platform text input | CRLF, Unicode, combining characters, or unusual whitespace |
| Large or bounded input | Maximum size/count, performance-safe limit, or graceful rejection |
| Strong invariant | Idempotence, round-trip behavior, ordering preservation, or property-style generated samples |
| Browser dependency | Missing permission, unsupported API, rejected clipboard call, or cleanup on unmount |
| Sensitive input | Invalid encoding, malformed token segment, safe error output, and no secret-bearing fixture/log |
| Server boundary | Repository failure, unexpected response, duplicate/race behavior, or serialization edge case |

Do not label a test advanced solely because its fixture is complicated. If the available evidence cannot support five Level 3 cases, report the coverage gap and do not create a padded or misleading three-file suite.

## Output format

Present the planned or generated cases under these headings, with at least five cases in each:

1. `Level 1 — Core/common`
2. `Level 2 — Realistic/intermediate`
3. `Level 3 — Advanced/risk-driven`

For each case, include behavior, evidence, test layer, and expected assertion. Mark unavailable cases as `Not implemented: <reason>`; never add a passing test that enshrines behavior contradicted by the requirement.
