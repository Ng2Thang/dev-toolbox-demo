# REQ-001 task log

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
