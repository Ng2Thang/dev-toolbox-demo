---
id: REQ-008
status: design-approved
route: /tools/encode-decode
stitch_project: Dev Toolbox
stitch_screen_id: d438ff5582394a358486d52e9ee1e3ff
stitch_screen_title: Encoder / Decoder
ui_approved_at: 2026-08-18
---

# REQ-008 - Encoder / Decoder

## Goal

Let developers encode and decode common UTF-8 text formats entirely in the browser.

## Inputs

- Source text.
- Conversion direction: Encode or Decode.
- Format: Base64, Base64URL, URL percent encoding, hexadecimal UTF-8, or HTML entities.

## Outputs

- Converted UTF-8 text.
- Clear success, empty, and validation-error states.

## Main actions

- Select a format and direction, convert, swap input/output, clear, copy, and save a successful run.

## Validation

- Require input before conversion.
- Reject malformed Base64/Base64URL padding or characters, malformed URL percent sequences, and non-paired hexadecimal values.
- Preserve Unicode text through every supported conversion.

## Data

- Browser-local transformation; successful JSON-compatible runs may use the existing saved-run API. No new persistence or schema change is required.

## Acceptance criteria

1. The tool correctly round-trips UTF-8 text through Base64, Base64URL, URL percent, hexadecimal, and HTML entity conversions.
2. The selected direction and format are visible, the result can be copied or swapped, and successful results can be saved to existing run history.
3. Invalid encoded input produces an actionable error without losing the original text or sending it to an external service.
4. The route follows the approved Stitch screen's shared shell, input/output hierarchy, and empty, success, and error states.

## Non-goals

- File or arbitrary binary conversion, encryption, hashing, URL fetching, and rendering untrusted HTML.
