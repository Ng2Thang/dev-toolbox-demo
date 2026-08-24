---
name: playwright-e2e-testing
description: Generate or update focused Playwright end-to-end tests for Dev Toolbox features. Use after implementation for browser-visible user journeys, ordinary error recovery, and relevant resilience risks; do not use for unit, component, API, or visual-only tests.
---

# Playwright E2E Testing

Create the smallest deterministic Playwright suite that proves a Dev Toolbox feature works in a
real browser. This skill complements `$feature-test-generation`: that skill owns domain,
component, schema, and route coverage; this skill owns browser journeys only.

## Gather evidence and plan

Read the requirement, `ARCHITECTURE.md`, `playwright.config.ts`, the feature route and client
component, and nearby `e2e/` tests. Inspect the approved Stitch reference when it documents an
observable state or interaction.

Before editing, write a concise traceability matrix that maps each selected acceptance criterion
or user-visible risk to one Playwright test and one level. Do not turn pure transformation edge
cases already covered by Vitest into duplicate browser tests.

For each implemented browser feature, select at least two independent Level 1 journeys when the
UI exposes multiple valid inputs, modes, or completion actions. At Level 2, cover every applicable
category among invalid/empty input, boundary input, state reset or option switching, and ordinary
API failure. At Level 3, cover at least two applicable resilience risks; name each risk and omit a
category only with a short reason in the traceability matrix.

## File layout

Keep browser tests feature-owned:

```text
e2e/
  fixtures/                              Shared Playwright fixtures and network mocks
  helpers/                               Small deterministic browser-test utilities
  <feature>/
    <feature>.level-1.spec.ts
    <feature>.level-2.spec.ts
    <feature>.level-3.spec.ts
```

Create a level file only when evidence supports browser coverage at that level. Keep each test
independent: start from a fresh page and do not rely on order, shared browser state, or records
created by another test.

Read [the level guide](references/test-levels.md) before selecting cases.

## Browser-test boundaries

- Use Playwright role, label, and text locators. Use a CSS locator only when the rendered UI has
  no stable accessible equivalent, and explain that choice in the test.
- Assert observable outcomes: visible output, status, error message, navigation, or enabled state.
  Do not assert React state, private helpers, CSS implementation details, or snapshots by default.
- Mock ordinary `/api/runs` responses with `page.route()` or a shared fixture. Do not use
  production Supabase, service-role credentials, or production data.
- Use a dedicated test environment only when real persistence integration is explicitly required.
  Arrange cleanup within that environment and do not run those tests against preview or production.
- Use stable values for time, tokens, and random inputs. For generated values, assert the contract
  rather than a fixed random value.
- Keep screenshots and traces on failure only, as configured in `playwright.config.ts`.

## Implement and verify

Place shared route interception and repeated setup in `e2e/fixtures/`; do not duplicate it across
features. Keep feature-specific examples and assertions adjacent to their feature tests.

Run the changed level files first, then `npm run test:e2e`. Ensure Vitest excludes `e2e/**` so
Playwright specs are not discovered as unit tests. Run the repository quality commands required by
`ARCHITECTURE.md` and report the traceability matrix, generated files, commands, and any E2E risk
that was intentionally not automated.

For a feature delivery, invoke this skill after `$feature-test-generation` and before the Verify
stage. Do not claim E2E coverage passed without direct Playwright output.
