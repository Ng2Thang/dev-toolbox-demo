---
name: feature-test-generation
description: 'Generate or update focused Dev Toolbox tests from a feature requirement, approved UI reference, and implementation. Use for feature test coverage; not for visual-regression testing or end-to-end browser automation.'
---

# Feature Test Generation

Generate the smallest set of high-signal tests that proves a developer utility's specified and observable behavior. Dev Toolbox features primarily transform, inspect, generate, or validate developer-facing input locally; test their input/output contract and safe failure modes before generic application mechanics. Use the requirement as product intent, the approved UI reference as user interactions and states, and the implementation as ownership and error paths. Do not infer unapproved behavior from a mockup alone.

## Gather evidence

Read the applicable requirement, `ARCHITECTURE.md`, the feature's route and modules, and nearby tests before writing tests. When an approved Stitch screen exists, inspect its latest approved version or documented UI artifacts. If no UI was approved, treat the requirement and implementation as authoritative and state that limitation.

Write a concise, tiered traceability matrix before editing. Map each acceptance criterion or meaningful UI state to one test, its layer, evidence source, and level. Generate all three levels with at least five runnable cases per level. For a utility, include normal input, boundary input, malformed input, and any stated browser capability. Do not pad a level with duplicated, speculative, skipped, or placeholder tests; if five evidence-backed cases cannot be derived, report that blocker and do not create a misleading test file. Read [the repository testing guide](references/dev-toolbox-testing.md) and [the tiered test guide](references/test-levels.md) before choosing a layer.

## Generate by level

- **Level 1 — core/common:** Cover the primary user action, representative valid input, expected output, and the most common invalid or empty input. These are the minimum tests for every changed observable behavior.
- **Level 2 — realistic/intermediate:** Cover normalization, boundaries, alternate valid inputs, state transitions, recovery after an error, and interactions that a normal user is likely to perform. Add every case evidenced by the requirement, approved UI, or implementation.
- **Level 3 — advanced:** Cover only relevant robustness risks such as Unicode or line-ending differences, large input limits, property/invariant checks, browser API failure, concurrency, security-sensitive parsing, or cross-layer failure handling. Each Level 3 case must name its evidence and risk; do not add speculative edge cases.

Generate every level for each feature suite. The user-facing report must state the five or more evidence-backed cases selected for each level. A higher level supplements, rather than replaces, its prerequisites.

## Required file layout

Create exactly three separate, feature-prefixed test files for every generated feature suite. Do not combine levels in a file:

```text
features/<feature>/<feature>.level-1.test.ts[x]
features/<feature>/<feature>.level-2.test.ts[x]
features/<feature>/<feature>.level-3.test.ts[x]
```

Use the feature folder name as `<feature>` (for example, `concat.level-1.test.tsx`). Select `.tsx` for all three files when any level renders a React component; otherwise use `.ts` for all three. Each file contains tests from its own level only and at least five runnable `it` cases. Keep shared fixtures in a separate non-test helper only when doing so improves clarity; never use it to merge level-specific cases.

## Select test layers

- Put deterministic transformations, parsing, validation, and edge cases in the level-specific files; do not create or append to a combined `<feature>.test.ts` file.
- Put user-visible interactions from the approved UI—labels, input, actions, success, empty, and error states—in their appropriate level-specific file, using React Testing Library.
- Test a route handler when it validates requests, selects status codes, or coordinates a repository. Mock the server-only repository rather than Supabase.
- Test schemas directly when they are a reusable server boundary. Do not duplicate every schema permutation through route tests.

Do not add visual snapshots, CSS assertions, implementation-detail assertions, network calls, or database access unless the requirement explicitly calls for that verification. Prefer accessible queries and observable output over component internals, state setters, or private helpers.

Read [the Dev Toolbox utility guide](references/dev-toolbox-utility-testing.md) for transformation, decoder, generator, and browser-API test selection. Apply only the sections relevant to the tool.

## Implement and verify

Follow the existing local test style and naming. Keep fixtures small, deterministic, and adjacent to the tests that use them. Restore global mocks after each test and ensure invalid inputs prove that persistence is not attempted.

Run the three narrow level files first, then `npm run test:report`. This command runs the complete repository suite and writes timestamped Markdown and JSON reports under `docs/test-reports/`; retain the report path, tested commit SHA, totals, and failures for PR evidence. For feature changes, run the repository quality gate required by `ARCHITECTURE.md`. Report the tiered traceability matrix, the three test files and case count in each, commands run, the overall-project report path and summary, and any criterion intentionally not automated with its reason.
