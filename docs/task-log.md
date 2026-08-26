# REQ-006 Base64 Encoder / Decoder design plan

1. Generate a desktop-first `/tools/base64` screen in the existing Dev Toolbox Stitch project using REQ-006 and the configured project design system.
2. Inspect the generated screen for the shared shell, encode/decode and Base64-variant controls, input/output workspace, actions, and empty, success, copied, and error states.
3. Save the generated HTML and PNG as `.stitch/designs/base64-encoder-decoder.*`, record the screen in Stitch metadata and REQ-006, and move the feature to `design-review`.
4. Stop at the explicit UI approval gate; do not implement application code until the user approves the latest screen.

## REQ-006 Base64 Encoder / Decoder test matrix

| Level | Behavior                                  | Evidence                     | Layer             | Expected assertion                                                   |
| ----- | ----------------------------------------- | ---------------------------- | ----------------- | -------------------------------------------------------------------- |
| 1     | Standard encode and decode                | REQ-006 criteria 1 and 3     | Domain/client/E2E | Canonical Base64 and readable text are displayed.                    |
| 1     | URL-safe encode                           | REQ-006 criterion 2          | Domain/client/E2E | URL-safe substitutions and omitted padding are returned.             |
| 1     | Empty input                               | REQ-006 validation           | Domain/client     | Actionable validation is visible and output is unchanged.            |
| 1     | Primary encode action                     | Approved Stitch workspace    | Client            | Input produces a copyable output.                                    |
| 1     | Initial empty state                       | Approved Stitch workspace    | Client            | Input/output panels and local-only copy are present.                 |
| 2     | URL-safe padded and unpadded decode       | REQ-006 inputs               | Domain/client/E2E | Both valid forms decode identically.                                 |
| 2     | Mode/variant selection                    | REQ-006 actions              | Client/E2E        | The selected mode controls conversion behavior.                      |
| 2     | Swap/reverse recovery                     | REQ-006 criterion 4          | Client/E2E        | Output becomes input, direction reverses, and recovery succeeds.     |
| 2     | Malformed input recovery                  | REQ-006 criterion 5          | Domain/client/E2E | Error preserves input and previous output; corrected retry succeeds. |
| 2     | Clear and copy                            | REQ-006 actions              | Client            | Clear restores empty state; copy reports status.                     |
| 3     | Unicode round trip                        | REQ-006 validation           | Domain/client/E2E | Unicode text survives encode/decode.                                 |
| 3     | UTF-8 byte rejection                      | REQ-006 validation           | Domain            | Invalid decoded UTF-8 is rejected.                                   |
| 3     | Padding and malformed-structure rejection | REQ-006 validation           | Domain/client     | Invalid Base64 cannot produce output.                                |
| 3     | Clipboard unavailable                     | Browser capability risk      | Client/E2E        | Copy failure is actionable and does not alter output.                |
| 3     | Large local text                          | Text utility resilience risk | Domain            | A large deterministic text payload round-trips without truncation.   |

# REQ-001 task log

## Repository structure documentation alignment

1. Reconcile the README and architecture maps with the E2E, Stitch, Codex rules,
   CI, and design-system paths that now exist in the repository.
2. Confirm the documented `npm run format` command and include the delivered UUID
   Generator in the README inventory.
3. Make root `DESIGN.md` the canonical design-system document and record that the
   existing Home implementation still needs retained Stitch evidence and approval.

## Playwright E2E testing plan

1. Add Playwright Chromium configuration and deterministic smoke coverage for navigation and the
   JWT, JSON, timestamp, and UUID tool journeys.
2. Add local scripts, CI browser installation and execution, and ignored failure artifacts.
3. Align architecture, README, delivery skills, checklist, and PR evidence with the separate
   verification and delivery workflow.
4. Add the `playwright-e2e-testing` skill under `.codex/skills/`, define feature-owned Level 1–3
   browser coverage, and invoke it after `$feature-test-generation` in the delivery flow.
5. Migrate the existing flat smoke test to feature-owned specs for Home and the four local tools;
   use mocked save-run responses and reserve Saved runs browser coverage for a dedicated persistence
   test environment.
6. Expand each implemented tool's browser coverage with independent valid journeys, all applicable
   common recovery categories, and at least two documented resilience risks per feature.

## Stitch design artifact naming update

1. Rename the UUID Generator HTML and PNG evidence from its opaque Stitch ID to
   the feature-based `uuid-generator` basename, while retaining the screen ID
   in `.stitch/metadata.json`.
2. Update the `stitch::generate-design` skill so all future feature assets use
   descriptive kebab-case names, edits overwrite the matching pair, and
   variants use stable `-variant-N` suffixes.
3. Review the metadata, artifact directory, and documentation diff to confirm
   the UUID design remains traceable without ID-named files.

## REQ-005 UUID Generator design plan

1. Use the confirmed browser-local UUID Generator brief to create and inspect a focused Dev Toolbox Stitch screen for `/tools/uuid`.
2. Keep REQ-005 in `design-review` until the user explicitly approves the latest UUID Generator UI; do not change application code before that approval.
3. After approval, add the thin `/tools/uuid` route, registry entry, UUID generation domain helper, and client workspace; no server endpoint, saved-run integration, or migration is expected.
4. Generate focused feature tests, run scoped formatting and `npm run check`, review the diff for requirement coverage and secrets, then prepare branch, pull request, and Vercel Preview evidence if repository connections are available.

## REQ-005 UUID Generator tiered test matrix

| Level | Behavior                                  | Evidence                                                       | Layer         | Expected assertion                                                            |
| ----- | ----------------------------------------- | -------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------- |
| 1     | Generate valid UUID v1, v4, and v7 values | Approved requirement and Stitch version selector               | Domain        | Selected version, canonical format, and requested count are returned.         |
| 1     | Generate action and initial empty state   | Approved Stitch workspace                                      | Client        | Results appear only after Generate UUIDs is selected.                         |
| 1     | Invalid quantity                          | Requirement validation and Stitch error state                  | Domain/client | An actionable 1–100 whole-number error is visible and current results remain. |
| 2     | Bounds and recovery                       | Requirement quantity constraint                                | Domain/client | One and 100 succeed; error clears after corrected input.                      |
| 2     | Copy and clear interactions               | Approved Stitch actions                                        | Client        | Clipboard receives an item/all values; clear restores empty state.            |
| 3     | UUID structural invariants and uniqueness | Generator utility guide                                        | Domain        | Version/variant bits are valid and batches have no duplicates.                |
| 3     | Browser capability and clipboard failures | Requirement capability validation and approved copied feedback | Client        | Unsupported crypto and rejected clipboard show actionable errors.             |
| 3     | v1 monotonic time / v7 timestamp ordering | UUID version semantics                                         | Domain        | Sequential generated values preserve nondecreasing encoded timestamps.        |

## REQ-005 UUID Generator delivery evidence

- Approved Stitch reference: `9526f5b6ba6b472f9d123d8a242389ca` (Dev Toolbox, `/tools/uuid`).
- Full `npm run check` passed: formatting, lint, strict typecheck, 75 Vitest tests, and production build.
- Pull request: #9. Vercel Preview is Ready at `https://dev-toolbox-demo-qc8meqgcs-sample-d689.vercel.app`; direct route access is SSO-gated, while deployment status and build output were validated.

## REQ-004 approved implementation plan

1. Use the approved Dev Toolbox Stitch screen `e9c4c707ccbe45369e244a11ecb6ba3c` as the visual contract for `/tools/timestamp`.
2. Keep timestamp conversion browser-local, add explicit seconds/milliseconds selection and reverse date conversion, and use the existing validated saved-run API only for successful runs.
3. Generate the three focused timestamp test levels, run scoped formatting and the quality gate, then review the diff and prepare PR/preview evidence if Git metadata and connections are available.

## REQ-004 delivery evidence

- Approved Stitch reference: `e9c4c707ccbe45369e244a11ecb6ba3c` (Dev Toolbox, `/tools/timestamp`).
- Full `npm run check` passed: format, lint, strict typecheck, 60 tests, and production build.
- Pull request: #8. Vercel preview `dpl_Dn1DtPtFKaQ8cYhz9DVRPPzFEtDd` is Ready; the route is SSO-gated for public browser validation.

## README repository-audit plan

1. Inspect repository guidance, the current implementation, configuration, quality commands, and README for documentation drift.
2. Replace the stale README with an accurate overview of the implemented tools, optional saved-run persistence, local setup, commands, repository layout, delivery workflow, and security boundaries.
3. Review the documentation diff and run a non-mutating format check on the changed Markdown files.

## README skills-and-agents follow-up plan

1. Inventory repository-local skills and distinguish the workflows that apply to this Next.js project from unrelated templates.
2. Document the delivery and design-support skills, agent handoff, and explicit Stitch UI-approval gate in the README.
3. Format the updated Markdown and review the documentation-only diff.

## README and architecture alignment plan

1. Compare the README against the architecture's route model, feature ownership, saved-run flow, security boundaries, repository map, and quality commands.
2. Add the missing route and client/server ownership summary, saved-run flow, formatting command, and `.codex/skills/` map entry without duplicating the architecture as a second source of truth.
3. Format the Markdown and review the documentation diff for accuracy and scope.

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

## Manual Vercel deployment controls

1. Disable Git-triggered Vercel deployments with `git.deploymentEnabled: false` in `vercel.json`.
2. Add an explicit-only manual deployment skill that validates a ready preview target and refuses production deployment or promotion.
3. Validate the skill structure and configuration, then commit and update the active PR without staging unrelated local changes.

## Vercel Git deployment configuration

Plan:

1. Enable Git-triggered Vercel deployments for the Next.js repository and retain the standard production build command.
2. Document the required Preview and Production environment-variable names without storing any values.
3. Validate the configuration and local production build, then recheck the REQ-006 preview blocker.

Completed: Git deployments are enabled, Vercel's Next.js build configuration is explicit, Node.js
22 is pinned to match CI, and the local production build passed. The outstanding dependency is
Vercel project authentication, GitHub repository linking, and environment-variable setup before
preview validation.
