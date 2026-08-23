# Test Report — {{timestamp}}

## Plan

1. Run the complete repository test suite with structured output.
2. Group tests by feature and application category.
3. Run the quality gate when requested and record it separately.

## Scope

- Repository: `{{repository}}`
- Branch/commit: `{{revision}}`
- Environment: `{{os}} · Node {{node_version}} · npm {{npm_version}}`

## Overall result

| Check               | Command                      | Status           | Evidence                                                        |
| ------------------- | ---------------------------- | ---------------- | --------------------------------------------------------------- |
| Complete test suite | `vitest run --reporter=json` | {{test_status}}  | {{test_file_totals}} files; {{test_totals}} tests; {{duration}} |
| Quality gate        | `npm run check`              | {{check_status}} | {{check_summary}}                                               |

## Results by feature and category

| Category          | Test files (pass/fail) | Tests (pass/fail/skipped) | Status |
| ----------------- | ---------------------- | ------------------------- | ------ |
| {{category_rows}} |

## Failed and skipped tests

{{failed_or_skipped_tests}}

## Failures and blockers

{{failures_or_none}}

## Recommended next action

{{next_action}}
