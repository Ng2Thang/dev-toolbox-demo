---
id: REQ-006
status: delivered
route: /tools/base64
stitch_project: Dev Toolbox
stitch_screen_id: a62b045a4be24efdafd675451df1127d
stitch_screen_title: Base64 Encoder / Decoder - Refined Workspace
ui_approved_at: 2026-08-26
---

# REQ-006 - Base64 Encoder / Decoder

## Goal

Let developers encode UTF-8 text as standard or URL-safe Base64 and decode Base64 back to readable text entirely in the browser.

## Inputs

- Source text to encode or a Base64 string to decode.
- Conversion direction: Encode or Decode, defaulting to Encode.
- Base64 variant: Standard or URL-safe, defaulting to Standard.
- URL-safe decoding may accept valid padded or unpadded Base64 input.

## Outputs

- A copyable encoded Base64 value or decoded UTF-8 text.
- The selected conversion direction and Base64 variant reflected in the result.
- A clear, actionable validation error when decoding cannot be completed.

## Main actions

- Encode or decode the current input.
- Switch between Encode and Decode modes.
- Select the Standard or URL-safe Base64 variant.
- Swap the current input and output for reverse conversion.
- Copy the output and clear the workspace.

## Validation

- Reject empty input without replacing an existing successful result.
- Reject malformed Base64, invalid characters, misplaced padding, and structurally invalid encoded input.
- Reject decoded byte sequences that do not represent valid UTF-8 text.
- Accept valid Unicode text for encoding and preserve it through an encode/decode round trip.
- Preserve the current input when conversion fails and provide feedback that helps the user correct it.

## Data

- Browser-local text conversion only.
- Input and output are not sent to an API, saved to run history, or stored persistently.
- The feature requires no external service, server endpoint, or database migration.

## Acceptance criteria

1. Encoding valid UTF-8 text in Standard mode displays the corresponding standard Base64 value and allows the result to be copied.
2. Encoding valid UTF-8 text in URL-safe mode displays a URL-safe Base64 value using `-` and `_` where required and without trailing padding.
3. Decoding valid Standard or URL-safe Base64 displays the original readable UTF-8 text, including non-ASCII characters.
4. Swapping a successful result places the output into the input, reverses the conversion direction, and allows the original value to be recovered.
5. Empty or malformed decode input preserves the entered value and any previous successful output while displaying an actionable validation error.
6. The route uses the shared toolbox shell and supports clear empty, success, copied, and error states based on the approved Stitch screen.
7. Conversion operates without file input, server requests, external APIs, saved-run persistence, or a schema migration.

## Non-goals

- Uploading, downloading, encoding, or decoding files and arbitrary binary data.
- Base32, hexadecimal, data URL, compression, encryption, or hashing operations.
- Automatic character-set detection or conversion for encodings other than UTF-8.
- Saved-run history, accounts, or persistent storage.

## Delivery evidence

- Approved Stitch screen: `a62b045a4be24efdafd675451df1127d` (Dev Toolbox, `/tools/base64`).
- Focused Base64 Vitest suite passed: 15 tests across the three required levels.
- Complete serial Vitest suite passed: 90 tests; committed report: `docs/test-reports/2026-08-26T04-06-50-466Z-test-report.md`.
- Focused Base64 Playwright suite passed: 7 Chromium tests; the complete suite was run with no reported test failure, but its execution wrapper omitted the final aggregate line.
- Production build passed and includes `/tools/base64` as a static route.
- Repository formatting was repaired with Prettier; `format:check`, lint, typecheck, the full 90-test Vitest suite, and the production build now pass under Node 24.14.0.
- Pull request: https://github.com/Ng2Thang/dev-toolbox-demo/pull/12
- Vercel Preview validated on 2026-08-26: deployment `dpl_D68xX1gSCyi1hhv5ogmtcP7ZBSti` reached `READY` for Vercel project `dev-toolbox-demo`; [`/tools/base64`](https://dev-toolbox-demo-r9tn87rkz-sample-d689.vercel.app/tools/base64) returned HTTP 200 and rendered the Base64 workspace.
