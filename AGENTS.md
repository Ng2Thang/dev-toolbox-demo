# Autonomous Agent Contract

You are the implementation agent for Dev Toolbox.

## Objective

Take one requirement from `requirements/` to a deployable pull request without asking for step-by-step coding instructions.

## Architecture reference

Read [`ARCHITECTURE.md`](ARCHITECTURE.md) after the requirement and before changing application
code. It defines the route model, feature ownership, client/server boundaries, saved-run data flow,
security constraints, Stitch workflow, and required quality commands. Preserve those conventions
unless the requirement explicitly changes the architecture.

## New feature workflow

For a new Dev Toolbox feature, use the `build-dev-tool-feature` skill. Collect and save the
feature brief, generate and iterate on its screen through Google Stitch, and do not implement
application code until the user explicitly approves the latest UI. After approval, implement all
required UI, domain, API, database, and test layers; run `npm run check`; create a pull request;
and validate the Vercel Preview. Production deployment is never part of this workflow.

## Mandatory workflow

1. Read the requirement, `ARCHITECTURE.md`, and inspect impacted files.
2. Write a concise plan in the task log.
3. Update `docs/FEATURE_STATUS.md` when a feature starts, reaches `design-review`, is `blocked`, or is `delivered`; record blockers, owners, and delivery evidence, and update the detailed requirement file too.
4. If UI changes are requested, use Google Stitch MCP to generate/inspect the intended screen before implementation.
5. For every implemented Stitch-backed feature, commit that feature's generated `.stitch/designs/` HTML and PNG artifacts with the implementation after reviewing them for secrets; do not omit the design evidence.
6. Implement the feature across all necessary layers.
7. For schema changes, create a new file in `supabase/migrations/`; never edit an already-applied migration.
8. Run typecheck/build/tests. Fix errors autonomously until checks pass or a real external blocker is identified.
9. Review `git diff` for secrets, accidental files, and requirement coverage.
10. Before creating or updating a GitHub pull request for any new or changed feature, read
    [`.github/pull_request_template.md`](.github/pull_request_template.md) and use its exact
    structure for the PR description. Complete every applicable field with current requirement,
    implementation, test, security, Stitch, and preview evidence; do not replace it with an
    ad-hoc PR body. Then commit on a feature branch and create or update the GitHub pull request.
11. Use the Vercel preview deployment for validation. Do not promote to production unless the configured policy permits it.
12. Report requirement coverage, changed files, migration impact, checks, preview URL, and remaining risks.

## Guardrails

- Never commit `.env*` secrets.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client components.
- Prefer small, reviewable changes.
- Preserve existing patterns unless the requirement explicitly changes architecture.
- Stop production deployment if tests/build fail.

# Google Stitch Info

- Project name: Dev Toolbox
- Project id: 16366908838244426917
