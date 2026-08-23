---
name: repo-test-report
description: Run this repository's complete test suite and export detailed feature-category pass/fail reports. Use for test-status requests and repeatable repository test reporting; not for creating feature-specific tests.
---

# Repository Test Report

Run the complete Vitest suite for this repository and export Markdown and JSON reports with feature-level test totals and actionable failures.

## Plan

1. Read `package.json`, `ARCHITECTURE.md`, and the report template at [assets/test-report-template.md](assets/test-report-template.md).
2. State the commands that will run and whether the user also requested the broader quality gate.
3. Run `node .codex/skills/repo-test-report/scripts/run-test-report.mjs` from the repository root. It runs the complete Vitest suite with its JSON reporter and creates uniquely named Markdown and JSON reports in `docs/test-reports/`.
4. When requested, run `npm run check` after the test report. Record each completed stage and the first failing stage in the Markdown report without changing unrelated files merely to make the gate pass.

## Reporting rules

- Mark the test suite as passed only when the underlying Vitest process exits successfully.
- Use the generated per-file data to group test results as `Feature: <name>`, `API/routes`, `Shared libraries`, `App routes`, or `Other`. A feature's test-file count and pass/fail test count must be reported even when all tests pass.
- List every failed or skipped test with its category, source file, test name, and concise failure message. Do not invent a failure message when Vitest provides none.
- Treat a feature as failed when any test file or test in its category fails; show zeroes explicitly.
- Report `npm run check` independently: a format, lint, typecheck, or build failure does not mean the tests failed.
- Preserve detailed data in the JSON report and summarize it in Markdown; do not paste excessive logs.
- Do not commit, open a pull request, or change application code unless the user explicitly asks.
