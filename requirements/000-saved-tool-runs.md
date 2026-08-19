# REQ-001 — Saved Tool Runs

## Goal
Allow a user to save the input/output of a developer utility and inspect recent runs.

## Acceptance Criteria
1. JWT Decoder has a **Save Run** action after a successful decode.
2. Saving persists `tool`, `input`, `output`, and `created_at` in Supabase.
3. `/history` shows the 50 most recent runs, newest first.
4. Invalid requests return HTTP 400 and do not write to the database.
5. Production build succeeds.
6. No secret key is exposed to browser code.

## Layers expected to change
- UI/component
- API route
- validation
- Supabase schema migration
- environment configuration
- tests/build
- documentation
