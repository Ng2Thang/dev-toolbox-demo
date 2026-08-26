---
id: REQ-008
status: implementing
route: /tools/sql-formatter
stitch_project: Dev Toolbox
stitch_screen_id: 38f5d84f78d24f54a405c361446bb770
stitch_screen_title: SQL Formatter - Validation States
ui_approved_at: 2026-08-26
---

# REQ-008 - SQL Formatter

## Goal

Let developers format and syntax-check SQL queries locally so complex statements are easier to read before they are run elsewhere.

## Inputs

- SQL text to format and validate.
- SQL dialect: PostgreSQL, MySQL, SQLite, SQL Server, or BigQuery.
- Keyword casing preference: uppercase or lowercase.
- Indentation preference for nested queries and multi-line clauses.

## Outputs

- Formatted SQL with readable indentation, clause layout, and selected keyword casing.
- Syntax-validation feedback with a clear explanation of likely structural issues.
- Line and column references when a syntax issue can be located.
- A copyable formatted SQL result.
- Clear empty, success, copied, and error feedback.

## Main actions

- Format and validate the entered SQL using the selected dialect and formatting preferences.
- Copy the formatted SQL result.
- Clear the SQL input, result, and validation feedback.
- Change dialect or formatting preferences and format the SQL again.

## Validation

- Reject empty SQL input and display an actionable message.
- Display a syntax error without replacing the previous valid formatted result when validation fails.
- Identify likely syntax issues with line and column references when available.
- Treat validation as structural SQL syntax checking only; do not claim that tables, columns, functions, permissions, or database-specific runtime behavior are valid.
- Display a clear message if the browser clipboard capability is unavailable.

## Data

- Formatting, validation, and copying operate entirely in the browser.
- The feature does not execute SQL, connect to a database, send SQL to an API, save runs to history, or use persistent storage.
- The feature requires no server endpoint, external service, or database migration.

## Acceptance criteria

1. Entering valid `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE`, or `ALTER` SQL and selecting Format displays formatted SQL with readable clause and nested-query indentation.
2. Changing the keyword-casing preference displays formatted output using the selected uppercase or lowercase SQL keyword style.
3. Selecting any supported dialect formats compatible SQL and preserves the selected dialect when the user formats again.
4. Empty or malformed SQL displays an actionable validation error; when a location is available, the error includes its line and column.
5. A syntax-validation failure preserves the previous successful formatted result, and correcting the input allows the user to format successfully.
6. A successful formatted result can be copied, while unavailable clipboard access displays clear recovery feedback.
7. The route uses the shared toolbox shell and supports approved Stitch empty, success, copied, and error states.
8. SQL remains browser-local: the application does not execute it, connect to a database, transmit it to a server, create saved runs, or require a migration.

## Non-goals

- Executing SQL or connecting to PostgreSQL, MySQL, SQLite, SQL Server, BigQuery, or another database.
- Verifying schemas, tables, columns, functions, permissions, query plans, or runtime database behavior.
- SQL lint rules, security auditing, query optimization, or SQL-to-ORM conversion.
- Importing SQL files, persistent preferences, saved-run history, accounts, or cloud synchronization.

## Design evidence

- Current Stitch screen: `38f5d84f78d24f54a405c361446bb770` (Dev Toolbox, `/tools/sql-formatter`).
- Reviewed HTML and PNG artifacts: `.stitch/designs/sql-formatter.html` and `.stitch/designs/sql-formatter.png`.
- UI approved on 2026-08-26; implementation uses this screen as its visual contract.

## Implementation evidence

- Browser-local formatting and syntax parsing support PostgreSQL, MySQL, SQLite, SQL Server, and BigQuery without an API, persistence, or migration.
- Focused Vitest coverage passed: 16 tests across Level 1–3.
- Focused Playwright coverage passed: 7 tests across Level 1–3; the complete Chromium suite passed 46 tests.
- Scoped formatting, ESLint, strict TypeScript, all 121 Vitest tests, and the production build passed.
- `npm run check` remains blocked by 18 pre-existing Prettier failures in Base64 and Mock Data files outside REQ-008; all REQ-008 files pass the scoped Prettier check.
