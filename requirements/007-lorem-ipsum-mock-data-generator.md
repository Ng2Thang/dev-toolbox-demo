---
id: REQ-007
status: delivered
route: /tools/mock-data
stitch_project: Dev Toolbox
stitch_screen_id: 10dc4b58fdf54837881c3273aa4eaa67
stitch_screen_title: Lorem Ipsum / Mock Data Generator
ui_approved_at: 2026-08-26
---

# REQ-007 - Lorem Ipsum / Mock Data Generator

## Goal

Let developers generate realistic, non-personal placeholder text and structured mock data locally for interface and API testing.

## Inputs

- Output type: Lorem ipsum text, people, user profiles, products, dates, identifiers, statuses, or generic JSON records.
- Text unit for Lorem ipsum output: words, sentences, or paragraphs.
- Record quantity, defaulting to one and constrained to a safe whole-number limit.
- Locale, with English and Vietnamese options.
- Optional numeric seed that makes the same generation settings produce the same result.
- Download format for structured results: JSON or CSV.

## Outputs

- Generated Lorem ipsum text for the selected unit and quantity.
- Generated mock records containing appropriate fields for the selected output type, such as names, emails, phone numbers, addresses, product details, dates, identifiers, statuses, profile data, and local avatar placeholders.
- A copyable result view.
- A downloadable JSON file for structured output and a CSV file when the selected output is tabular.
- Clear feedback when generation, copying, or downloading cannot be completed.

## Main actions

- Generate data using the current settings.
- Copy the generated output.
- Download structured output in the selected format.
- Clear the generated result.
- Change the seed and regenerate a different deterministic result.

## Validation

- Require the record quantity to be a whole number within the supported limit.
- Require the seed, when provided, to be a valid integer.
- Preserve the current generated result when validation fails and display an actionable error.
- Display a clear explanation when browser clipboard or file-download capabilities are unavailable.
- Produce the same output for identical output type, quantity, locale, and seed settings.

## Data

- Generation, copying, and downloads operate entirely in the browser.
- Generated values are synthetic placeholders and must not be sourced from real people, user accounts, external APIs, or remote datasets.
- The feature does not send generated content to an API, save runs to history, or use persistent storage.
- The feature requires no server endpoint, external service, or database migration.

## Acceptance criteria

1. Selecting a Lorem ipsum unit and valid quantity generates copyable placeholder text with the requested number of words, sentences, or paragraphs.
2. Selecting a structured output type generates the requested number of synthetic mock records with fields appropriate to that type, including JSON arrays for API and UI testing.
3. The same output type, quantity, locale, and valid seed produce the same generated result; changing the seed produces a different result.
4. Structured results can be copied and downloaded as JSON, and tabular structured results can be downloaded as CSV.
5. Invalid quantity or seed input preserves the previous generated output and displays an actionable validation error.
6. The route uses the shared toolbox shell and supports approved Stitch empty, success, copied, download-ready, and error states.
7. All generation occurs browser-local without external API requests, real personal data, saved-run persistence, or a schema migration.

## Non-goals

- Generating data from real people, user accounts, third-party datasets, or imported files.
- AI-generated prose, images, or remote avatar retrieval.
- Custom field-schema design, data relationships, database seeding, or direct API posting.
- Saved-run history, accounts, or persistent storage.

## Delivery evidence

- Approved Stitch screen: `10dc4b58fdf54837881c3273aa4eaa67` (Dev Toolbox, `/tools/mock-data`).
- Focused Vitest suite passed: 15 tests across Level 1–3.
- Focused Playwright suite passed: 7 Chromium tests across Level 1–3.
- Strict TypeScript check and production build passed under Node 24.14.0.
- Pull request: #13.
- Vercel Preview deployment `dpl_hEgdFBFZSLSugLUU2TMhGBJVFn8K` reached `READY`; `/tools/mock-data` returned HTTP 200 with the expected shared shell and generator workspace.

## Delivery note

- The user authorized proceeding without the repository-wide Prettier gate because its failures are pre-existing and outside REQ-007 scope.
