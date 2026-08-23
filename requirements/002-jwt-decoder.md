---
id: REQ-002
status: implementing
route: /tools/jwt
stitch_project: Dev Toolbox
stitch_screen_id: a77dc8152e854a5aafa4f9d9827b715c
stitch_screen_title: JWT Decoder - Refined
ui_approved_at: 2026-08-23
---

# REQ-002 - JWT Decoder

## Goal

Let developers inspect the header and payload of a JSON Web Token entirely in the browser.

## Inputs

- A compact JWT string with three dot-separated segments.

## Outputs

- Decoded, formatted JWT header and payload.
- A readable validation error for malformed tokens.

## Main actions

- Decode or clear the token.
- Copy decoded content and save a successful run to existing history.

## Validation

- Require exactly three JWT segments.
- Reject invalid base64url or non-JSON header and payload values without evaluating a signature.

## Data

- Local decoding; successful JSON-compatible runs may use the existing saved-run API.

## Acceptance criteria

1. A valid JWT displays formatted header and payload in distinct technical output panels.
2. Invalid input produces an actionable error without a server request for decoding.
3. The screen follows the approved Stitch hierarchy and supports copy and successful-run saving.

## Non-goals

- JWT signature verification, token issuance, or key management.
