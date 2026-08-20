# REQ-001 task log

## REQ-003 JSON Formatter — Stitch screen-to-feature plan

Stitch reference: Dev Toolbox / `63710ae7475446a88940dd6d9a3f8180` / JSON Formatter - Refined
(`DESKTOP`, 2560×2048), mapped to `/tools/json`.

Screen audit:

1. Shared chrome: five sidebar destinations, a command-palette button, Settings and Dark Mode
   links; top search, two navigation links, and three icon actions.
2. Tool header: title, Local-only badge, description, three indentation choices, and one Sort Keys
   toggle.
3. Error-state workspace: one dismissible error banner; two editor panels, each with five visible
   line numbers; input position/character metadata; Clear and Format actions; output error state,
   Validate Anyway action, and Example, disabled Save Run, and Copy controls.
4. Footer: copyright plus Documentation and Keyboard Shortcuts links. Success is represented in
   the source markup but hidden in the screenshot; no mobile reference is available.

Plan:

1. Preserve the thin `/tools/json` route, the existing `features/json/json.ts` pure formatter, and
   add configurable indentation, deterministic sort-key behavior, and useful parse-location errors
   with unit coverage.
2. Replace the single-editor `JsonFormatter` workspace with a feature-owned two-panel input/output
   editor that renders line numbers, editor metadata, explicit error/success states, Format, Clear,
   Example, Copy, Validate Anyway, and Save Run behavior. Reuse only existing shared shell/header
   components; keep this single-screen editor composition in `features/json/`.
3. Align the feature with the Stitch hierarchy using existing `DESIGN.md` tokens: dark tonal
   surfaces, 4px-radius controls, Geist interface text, JetBrains Mono editor text, 8/16px rhythm,
   error-container feedback, and primary focus/action styling. Add narrowly scoped global CSS only
   where no existing tokenized primitive expresses the editor layout.
4. Reuse the existing saved-run API for successful output; do not add a schema migration or a new
   server endpoint. Add component tests for format, invalid JSON, controls, copy, and save-state
   behavior.
5. After implementation, render `/tools/json` at 2560×2048 and narrow responsive width, compare
   against the Stitch screenshot in the required geometry-to-detail order, reconcile every audited
   item, and document any intentional deviations.

Stop condition: REQ-003 remains `design-review` with no recorded UI approval. Do not begin the
application-code portion until the user explicitly approves this exact latest Stitch screen.

Implementation evidence (2026-08-20):

1. UI approval was received for the current Stitch screen and REQ-003 moved to `implementing`.
   The JSON route now renders the approved full-width two-panel editor, compact error state,
   indentation controls, sort-key toggle, editor metadata, example/copy/save controls, and the
   supporting shared top bar and command-palette control.
2. Functional coverage: browser-local formatting supports 2 spaces, 4 spaces, or tabs; sort keys
   recursively without changing array order; invalid or empty input remains visible with feedback;
   successful JSON may be copied and persisted through the existing `/api/runs` boundary. No API or
   database migration was required.
3. Visual review: captured `/tools/json` at the Stitch desktop viewport (2560×2048) and at a narrow
   390×844 viewport. The desktop comparison corrected the full-width workspace, shared top bar,
   sidebar command control, compact banner height, editor geometry, and error overlay. The narrow
   view collapses the editor pair into one column.
4. Intentional deviation: the source screenshot's sidebar category labels and Material icons remain
   mapped to the repository's registered routes and text icons (Explore, JWT Decoder, JSON Formatter,
   Unix Timestamp, Saved runs). Preserving working application navigation takes precedence over
   replacing it with inactive placeholder categories. No other observed visual mismatch remains.
5. Checks: scoped Prettier check passed; `npm run test` passed (18 tests); `npm run build` passed.
   `npm run check` is blocked at repository-wide Prettier by four unrelated pre-existing files:
   `features/home/home-screen.tsx`, `features/tools.test.ts`, `lib/tools.ts`, and `test/setup.ts`.

## Stitch screen-to-feature skill

Plan:

1. Define a repository-local skill that resolves a Stitch screen ID and audits its visible regions, element instances, repeated collections, states, and behavior implications before code generation.
2. Map the audited screen to the existing App Router, feature, component, data, test, and DESIGN.md conventions while preserving the new-feature UI approval gate.
3. Validate the skill package and review the resulting files for clear invocation, safe delivery boundaries, and repository-specific guidance.

Visual-fidelity update:

1. Require an exact-viewport implementation screenshot after coding and compare it against the Stitch reference side-by-side or with an overlay.
2. Reconcile every audited visible instance, including repeated collections and small controls, and correct differences in a geometry-to-detail order.
3. Require a concrete, reported reason for each intentional deviation; unresolved visual differences prevent a fidelity-complete result.

## REQ-002 through REQ-004 UI design refinement

Plan:

1. Reconfirm the Dev Toolbox Stitch project, its existing design system, and the three requirement-linked desktop screens.
2. Refine JWT Decoder, JSON Formatter, and Unix Timestamp Converter as distinct input/output workspaces, explicitly representing useful empty, success, and error states plus the required actions.
3. Save the latest design artifacts and keep all three requirements at `design-review` until the user explicitly approves their UI.

## REQ-008 Encoder / Decoder design plan

Plan:

1. Create an approval-gated requirement for a browser-local UTF-8 Encoder / Decoder covering Base64, Base64URL, URL percent encoding, hexadecimal, and HTML entities.
2. Generate and inspect a focused Dev Toolbox Stitch screen with format/direction controls, input/output editors, conversion actions, and validation states.
3. Record the resulting Stitch screen in REQ-008 and keep the requirement in `design-review` until the user explicitly approves its UI.

Navigation revision: the approved screen's sidebar was updated in Stitch to use direct tool links
in requirement order, ending with Encoder / Decoder and Saved Runs. REQ-008 returned to
`design-review` pending approval of this changed reference.

## REQ-001 through REQ-007 Stitch requirement planning

Plan:

1. Resolve the current Dev Toolbox Stitch project and inspect every existing utility screen.
2. Create approval-gated requirements for the home screen and six registered tools, linking each requirement to its matching Stitch screen and route.
3. Keep all seven requirements in `design-review`; do not alter application code until the user explicitly approves the relevant UI.

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
4. Add JSON Formatter, Unix Timestamp Converter, Concatenate String, and UUID Generator
   screens with client-side validation, useful empty/success/error states, and consistent
   interaction patterns.
5. Generalize saved-run integration where appropriate, preserving the existing server-only
   Supabase boundary and `/history` behavior.
6. Run typecheck and production build, inspect the final diff, and validate the implemented
   screens against all six Stitch references.
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
- Concatenate String -> `/tools/concat`
- UUID Generator -> `/tools/uuid`

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
