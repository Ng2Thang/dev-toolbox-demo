# Demo Flow — Requirement to Deployment

## Demo story
Give the agent only:

> Implement `requirements/001-saved-tool-runs.md` end-to-end and deliver a working preview deployment.

## Expected autonomous tool chain

Requirement
→ inspect repo
→ Google Stitch MCP for updated JWT + History UI
→ edit Next.js files
→ create Supabase migration
→ run local checks
→ fix failures
→ GitHub branch + PR
→ Vercel preview deployment
→ inspect deployment
→ final coverage report

## What each MCP proves

### Google Stitch
- Converts a textual UI requirement into a concrete screen/state.
- Agent uses the result as implementation guidance rather than manually inventing UI.

### Supabase
- Creates/applies database changes.
- Verifies the new table/schema and, when available, generates updated types.

### GitHub
- Reads repository state.
- Creates branch/commit/PR.
- Gives the Tech Lead a reviewable artifact instead of direct uncontrolled changes to main.

### Vercel
- Produces preview deployments from the PR/branch.
- Gives the agent a deployed environment to validate before merge/production.

## Best live-demo failure injection
After the first implementation, intentionally add a TypeScript mismatch or invalid migration to show the agent reading the failure, patching multiple files, rerunning checks, and updating the same PR.
