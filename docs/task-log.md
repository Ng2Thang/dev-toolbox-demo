# REQ-001 task log

## REQ-002 JWT Decoder Stitch design

1. Generated and inspected the desktop JWT Decoder screen in the Dev Toolbox Stitch project for `/tools/jwt`.
2. Recorded screen `4c9eb2b553cc43d791eb105ebbd8b2d5` in REQ-002; keep the requirement in `design-review` pending explicit UI approval.

## REQ-002 through REQ-004 screen sync and delivery plan

1. Inspect the Dev Toolbox Stitch project and recreate the missing JWT Decoder, JSON Formatter, and Unix Timestamp Converter screens, then record the current screen identifiers and routes in their requirements.
2. Keep REQ-002, REQ-003, and REQ-004 in `design-review` and obtain explicit approval of the latest UI references before altering application code.
3. After approval, sync the three thin App Router pages and feature modules to the approved screens, preserving browser-local processing and the existing saved-run boundary.
4. Generate the missing three-level feature suites with evidence-backed cases, run scoped formatting and `npm run check`, review the diff, and then create a feature-branch PR and validate its Vercel Preview.

## REQ-003 JSON Formatter tiered test plan

1. Trace REQ-003, the JSON formatting domain helper, the client workspace, and existing Vitest conventions.
2. Replace the legacy combined JSON Formatter component suite with separate Level 1, Level 2, and Level 3 feature tests, each containing five evidence-backed cases.
3. Cover valid structures and primitives, malformed and empty input, clear/recovery behavior, and the evidenced Unicode, CRLF, determinism, and round-trip risks.
4. Run the three focused files, the full test suite, and the repository quality gate; review the diff for scope and secrets.

## Detailed repository test-report skill plan

1. Capture structured Vitest output so test totals and individual failures are reliable.
2. Group test files into feature, API/routes, shared-library, app-route, test-infrastructure, and other categories.
3. Export unique Markdown and JSON reports with file/test pass-fail-skipped totals and concise failed-test details.
4. Validate the generator against the current passing repository suite.

## Repository test-report skill plan

1. Add a repository-local skill that runs the complete Vitest suite and reports its actual totals.
2. Provide a reusable Markdown template that separates test outcomes from the optional quality gate.
3. Validate the skill's file structure and instructions without executing a test run for this planning request.

## REQ-004 timestamp test regeneration plan

1. Trace REQ-004, the timestamp feature's pure converter and client component, and existing Vitest conventions.
2. Replace the legacy timestamp coverage with three focused Level 1–3 feature test files, each containing five evidence-backed runnable cases.
3. Run the three focused files, then the repository test and quality gates; review the diff for scope and secrets.

## Requirement, UI, and feature test-generation skill (plan-only)

Plan:

1. Define a repository-local skill that consumes a feature requirement, its approved Stitch UI reference, and the implemented feature boundaries.
2. Have the skill derive a traceable test matrix: pure-logic unit tests, client component behavior tests, server validation/API tests, and explicit exclusions for purely visual details.
3. Encode existing Vitest, React Testing Library, feature-folder, and client/server conventions so generated tests fit this repository rather than introducing a second testing style.
4. Validate the skill against representative existing features, then refine its test-selection rules before using it for new requirements.

Tiering update:

1. Generate Level 1 core/common and applicable Level 2 realistic/intermediate cases by default.
2. Generate Level 3 advanced cases only when a requirement, implementation, or explicit request identifies a concrete risk.
3. Require each generated case to state its evidence, layer, expected assertion, and—at Level 3—its risk rationale.
4. Create three feature-prefixed level files without mixing cases; each must contain at least five runnable, evidence-backed cases.

## Feature retirement: REQ-005 through REQ-008

Plan:

1. Remove the four retired feature requirements, route pages, feature modules, and feature-specific tests.
2. Remove their registry, navigation, shared-test, CSS, and task-log references while retaining REQ-001 through REQ-004.
3. Run the full quality gate and review the resulting diff for dangling references.

## REQ-009 Local-only Dev Toolbox design plan

Plan:

1. Record the Supabase-removal requirement and generate a focused Stitch reference for the updated shared shell and home route.
2. Keep the requirement in design review until the user explicitly approves the current Stitch UI.
3. After approval, remove Saved Runs, the runs API, Supabase dependencies/configuration, and all related documentation while preserving the browser-local utilities.
4. Run targeted formatting and the full quality gate, review the diff, commit and push a feature branch, open a GitHub PR, and validate a Vercel Preview deployment.

## REQ-001 through REQ-004 Stitch requirement planning

Plan:

1. Resolve the current Dev Toolbox Stitch project and inspect every existing utility screen.
2. Create approval-gated requirements for the home screen and three registered tools, linking each requirement to its matching Stitch screen and route.
3. Keep all four requirements in `design-review`; do not alter application code until the user explicitly approves the relevant UI.

## Connection doctor

Plan:

1. Add a no-secret command-line doctor that checks the Codex Stitch MCP registration, Supabase
   configuration/connectivity, GitHub remote/authentication, and Vercel project/authentication.
2. Expose the command through npm and document normal, offline, and JSON usage.
3. Run the doctor and the repository quality gate, then review the diff.

Plan:

1. Inspect the existing JWT UI, run API, history page, Supabase helper, and migration.
2. Enforce a validated server boundary before database insertion.
3. Show Save Run only after a successful decode and surface save results.
4. Make recent-run history inspectable and document checks and deployment limits.

The existing `supabase/migrations/202608170001_create_tool_runs.sql` already provides the
required `tool_runs` table and index, so it was not edited or duplicated.

## Dev Toolbox screen build plan (plan-only)

1. Rework the shared shell and global styling to match the Stitch Dev Toolbox system: dark
   Geist interface, JetBrains Mono technical surfaces, fixed sidebar, compact cards, blue
   primary actions, and responsive collapse behavior.
2. Rebuild the Home screen from the Stitch reference with tool discovery/navigation for all
   five utilities and Saved Runs.
3. Bring the JWT Decoder screen into the shared visual system while preserving its successful
   decode and Save Run behavior.
4. Add JSON Formatter and Unix Timestamp Converter screens with client-side validation, useful
   empty/success/error states, and consistent interaction patterns.
5. Generalize saved-run integration where appropriate, preserving the existing server-only
   Supabase boundary and `/history` behavior.
6. Run typecheck and production build, inspect the final diff, and validate the implemented
   screens against the retained Stitch references.
7. Create a feature branch, commit, open a PR, and use the Vercel preview for validation;
   production promotion remains out of scope unless policy permits it.

Current planning blocker: this workspace has no `.git` directory, so branch/commit/PR steps
will require repository metadata or an externally configured Git checkout before execution.

## Stitch screen sync execution

Resolved Stitch project `projects/16366908838244426917` (Dev Toolbox) and inspected six
desktop screens. Route mapping:

- Dev Toolbox - Home -> `/`
- JWT Decoder -> `/tools/jwt`
- JSON Formatter -> `/tools/json`
- Unix Timestamp Converter -> `/tools/timestamp`

The existing `/history` route remains supported for saved tool runs.

Implementation completed for the six mapped screens. `npm.cmd exec tsc -- --noEmit
--incremental false` passed and `npm.cmd run build` passed after granting Next.js permission
to write its local `.next` cache. The normal typecheck command could not write
`tsconfig.tsbuildinfo` in the restricted workspace. This checkout still has no `.git`
directory, so diff review, branch/commit/PR, and preview deployment remain unavailable.

## Repository refactor execution

Plan:

1. Add ESLint, Prettier, Vitest, and React Testing Library with a single `npm run check` quality gate.
2. Extract the toolbox layout, reusable UI primitives, typed tool registry, and server-only runs boundary.
3. Move each utility into a focused feature module while preserving its current Stitch-derived presentation and behavior.
4. Add unit, component, and route tests for the extracted boundaries, then run formatting, linting, type checking, tests, and a production build.

Completed: extracted App Router route-group layout and feature modules, added a typed tool registry,
server-only saved-run repository, ESLint/Prettier/Vitest configuration, and 17 automated tests.
`npm run check` passes. No schema migration was needed.

## Repository hygiene cleanup

Plan:

1. Retain all tracked directories: each is used by application code, tests, CI, database migrations, documentation, or Codex workflows.
2. Remove the unreferenced temporary Stitch configuration file and ignore it to prevent credential-bearing local configuration from being recommitted.
3. Retain generated `.next` and `node_modules` locally because they are ignored build/install artifacts; they can be regenerated and are not repository content.
4. Keep the unreferenced Stitch response snapshot pending an explicit documentation-retention decision.

## Architecture documentation

Plan:

1. Document the current App Router, feature-first boundaries, saved-run flow, security rules, and quality gate in `ARCHITECTURE.md`.
2. Link the document from `AGENTS.md` and make it required reading before application changes.

## Approval-gated feature workflow

Plan:

1. Create one repository skill that collects a feature brief, generates and iterates on a Stitch screen, and stops for explicit UI approval.
2. After approval, let the same skill implement the feature across UI, domain, API, database, tests, PR, and preview layers as needed.
3. Keep the feature form and delivery checklist as focused skill references, and update `AGENTS.md` with the approval gate.
4. Validate the skill structure and run repository checks appropriate to the documentation-only change.

Completed: added the `build-dev-tool-feature` repository skill with a feature-form reference,
delivery checklist, explicit Stitch UI approval gate, and post-approval implementation flow.
Updated repository guidance and maps. Skill validation and `npm run check` pass (17 tests).

## GitHub pull request rules

Plan:

1. Add a repository-local Codex rule for branch validation, current full-suite test reporting,
   and a visible warning for PRs larger than 2,000 changed lines.
2. Keep it separate from existing draft documentation so Codex discovers it from `.codex/rules`.

## REQ-002 JWT Decoder delivery plan

1. Use the approved Dev Toolbox Stitch reference for `/tools/jwt` as the visual contract.
2. Align the existing thin route and browser-only decoder with decode, clear, copy, save, empty, and validation states.
3. Add focused unit and client tests, format changed files, run `npm run check`, and review the diff for scope and secrets.
4. Create a feature-branch PR and validate its Vercel Preview if Git metadata and service connections are available; production remains out of scope.

## Full-project test report workflow

1. Add a reusable command that runs the complete Vitest suite and saves timestamped Markdown and JSON reports under `docs/test-reports/`.
2. Require feature test generation to run that command and report its project-wide totals, categories, failures, artifact paths, and tested commit.
3. Require the feature delivery workflow to regenerate the report after committing and include its evidence in the PR template's Test Report section.

## REQ-002 JWT Decoder regeneration plan

1. Return REQ-002 to `design-draft`, regenerate its focused Stitch screen for `/tools/jwt`, and record the new screen metadata.
2. Keep application code unchanged while the regenerated screen is in `design-review`; wait for explicit approval.
3. After approval, align the existing JWT feature with the new visual contract, invoke `feature-test-generation`, generate the full-project test report, and update existing PR #6 only.

## REQ-002 approved implementation plan

1. Use the approved `JWT Decoder - Refined` Stitch screen (`a77dc8152e854a5aafa4f9d9827b715c`) as the visual contract for `/tools/jwt`.
2. Preserve browser-local JWT parsing in `lib/jwt.ts`, client interaction in `features/jwt/`, and the existing validated saved-run API; no migration is required.
3. Run the existing three-level JWT suite, scoped formatting, the quality gate, then review the diff and prepare PR/preview evidence.

## REQ-002 quality-gate evidence

Scoped JWT formatting passed. The full repository gate passed: formatting, lint, typecheck, 60 Vitest tests, and the production compilation. Next: commit REQ-002 evidence, generate the post-commit test report, open or update the pull request, and validate its Vercel Preview.
