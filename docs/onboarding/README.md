# Dev Toolbox team introduction

Open [`dev-toolbox-team-introduction.html`](dev-toolbox-team-introduction.html) in a browser. Use
the arrow keys, spacebar, or on-screen controls to navigate. The deck is printable and includes a
`prefers-reduced-motion` fallback.

## Visual assets

- `assets/codex-toolbox-hero.png` — modular Dev Toolbox hero illustration.
- `assets/human-codex-collaboration.png` — human/Codex delivery partnership illustration.

Both project-bound illustrations were created with the built-in OpenAI image-generation workflow.
They contain no readable text, logos, or repository data. Workflow diagrams and examples remain
HTML/CSS so they are accessible, editable, and accurate.

## Slide source

### 1. Dev Toolbox

Useful browser tools, a visible delivery system, and a repository designed for people and Codex to
work together.

### 2. Why it exists

- Reduce context switching for small developer tasks.
- Keep sensitive input in the browser when persistence is unnecessary.
- Give repeated team work one predictable, testable home.

### 3. Meet the toolbox

- JWT Decoder: inspect a compact token's header and payload.
- JSON Formatter: validate and pretty-print JSON.
- Unix Timestamp Converter: convert epoch values and dates in both directions.
- UUID Generator: create UUID v1, v4, and v7 values.

### 4. What makes the repository different

The repository keeps the requirement, reviewed visual contract, implementation, tests, pull
request, and preview evidence together so delivery is traceable.

### 5. Codex is a teammate, not autopilot

People own scope, priority, UI approval, risk decisions, and final review. Codex can inspect
repository context, implement scoped changes, run checks, and prepare evidence. General product
context is available in the [official OpenAI documentation](https://developers.openai.com/).

### 6. Five instruction layers

| Layer | Question answered |
| --- | --- |
| Requirement | What did we agree to build? |
| Skill | How should Codex perform this kind of work? |
| Rule | What must always be allowed, required, or prevented? |
| Architecture | Where does the implementation belong? |
| Test evidence | How do we know the result works? |

### 7. UUID Generator delivery example

`REQ-005 → Stitch screen → explicit UI approval → features/uuid/ → three test levels → PR #9`

The resulting evidence includes the requirement, Stitch HTML and PNG, domain logic, client
interaction, tests, commit, pull request, and preview status.

### 8. Local and saved-run paths

Normal tool behavior stays in the browser: `input → feature logic → result`. Saving is optional:
`POST /api/runs → Zod validation → server-only repository → Supabase`.

### 9. Where code belongs

| Task | Primary location |
| --- | --- |
| Add a tool | Feature folder, thin route, `lib/tools.ts`, focused tests |
| Change shared navigation | `components/layout/`; keep the registry canonical |
| Change saved runs | Runs feature, API, and a new migration when required |
| Change visual language | `DESIGN.md` and reviewed Stitch evidence |

### 10. Layered quality

- Level 1: correct core behavior.
- Level 2: interaction, validation, and visible states.
- Level 3: resilience and ordinary error recovery.
- The repository combines Vitest, Playwright, and `npm run check`.

### 11. Security boundary

Zod validates external requests, the server-only repository owns Supabase access, and migrations
are immutable. `SUPABASE_SERVICE_ROLE_KEY` must never enter client code, public variables,
commits, screenshots, or generated design artifacts.

### 12. Current project state

Use `docs/FEATURE_STATUS.md` for live owners, blockers, approval state, and delivery evidence. The
slide intentionally avoids becoming a second detailed status source.

### 13. First 30 minutes

1. Read README, AGENTS, and architecture.
2. Run the app and open the UUID tool.
3. Trace its route, feature logic, registry entry, and tests.
4. Run a focused test and inspect its requirement evidence.

### 14. Four questions before starting

- Is the requirement ready?
- Is the UI explicitly approved?
- Should data remain browser-local?
- What is the smallest useful change?

### 15. Takeaway

Start with the requirement. Finish with evidence. Everything between those points should be
understandable to the next teammate.
