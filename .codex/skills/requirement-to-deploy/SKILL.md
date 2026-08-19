# Skill: requirement-to-deploy

Use this skill when asked to implement a requirement autonomously.

## Inputs
- Requirement file path
- Repository
- Connected tools: Google Stitch, Supabase, GitHub, Vercel

## Procedure
1. Parse requirement into acceptance-criteria checklist.
2. Inspect repository and determine UI/API/DB/test/deployment impact.
3. For UI delta, request a focused Stitch design for only the affected screen/state and translate it into existing components.
4. Create migrations before writing API code that depends on them.
5. Implement server boundaries and input validation before wiring client actions.
6. Run local quality gates: typecheck, test (if present), build.
7. On failure, diagnose logs, patch, rerun. Repeat until green or blocked by credentials/external service.
8. Push feature branch and create PR with requirement ID.
9. Inspect Vercel preview. If preview fails, use deployment logs to fix and push again.
10. Return a concise completion report mapped to each acceptance criterion.

## Definition of Done
- All acceptance criteria mapped to evidence.
- Migration included when needed.
- No secrets committed.
- CI/build green.
- PR exists.
- Preview deployment is healthy.
