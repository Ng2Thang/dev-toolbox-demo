---
id: REQ-006
title: Repository onboarding deck
status: design-review
route: Documentation
stitch_project: Dev Toolbox
stitch_screen_id: 38d25ced2eca46f9a249ca658e5672c0
stitch_screen_title: Onboarding Storyboard - Extended
ui_approval: Pending
owner: Codex
---

# Repository onboarding deck

## Goal

Give new Dev Toolbox team members a concise, accurate introduction to the product and the
Codex-enabled engineering workflow used to build it.

## Scope

- Create a self-contained browser slide deck and editable Markdown source under
  `docs/onboarding/`.
- Ground all repository facts in the checked-in documentation and local Git history.
- Cover Codex, repository skills, rules, requirements, architecture, quality gates, and recent
  delivery milestones before the product walkthrough.
- Include local setup and a safe first-contribution path.

## Out of scope

- Application-route, database, deployment, or runtime changes.
- Claims about unverified GitHub or Vercel activity.
- Credentials, environment values, or private deployment URLs.

## Acceptance criteria

- A team member can open the HTML deck locally and move between slides with buttons or arrow keys.
- The deck has an editable Markdown source with the same narrative.
- Content names the repository-local guidance and reflects the current feature status and Git
  timeline.
- The deck links to official OpenAI documentation for general Codex information.
- The refactored deck uses repository-specific visual examples, an original project-bound
  illustration, and motion that respects `prefers-reduced-motion`.
- The narrative explains the product problem, realistic tool examples, human/Codex ownership,
  instruction layers, a real delivered feature, architecture, quality, security, and a guided
  first contribution.

## Delivery evidence and blocker

- Deck source: `docs/onboarding/README.md`
- Presentation: `docs/onboarding/dev-toolbox-team-introduction.html`
- PowerPoint: `docs/onboarding/exports/dev-toolbox-team-introduction-editable.pptx`, with editable
  native slide content, 15 matching PNG previews, and a reproducible `npm run slides:export`
  command.
- Validated with Node 24.14.0: ESLint passed, TypeScript check passed, 75 Vitest tests passed, and
  the production build passed.
- Delivery commit: `88b580e` on `feature-006-repo-onboarding-deck`, pushed to `origin`.
- Visual-refactor commit: `4d2e477`, adding the illustration, animated visual system, and UUID
  delivery example; pushed to the same branch.
- Story-driven refactor: 15-slide narrative and `human-codex-collaboration.png`; Chromium verified
  slide count, illustration loading, navigation, and a clean browser console. Committed and pushed
  as `0426b41`.
- Stitch design review: generic six-frame presentation storyboard with replaceable empty image
  areas, saved as `.stitch/designs/onboarding-storyboard.html` and `.png`. No repository-specific
  architecture, routes, source paths, requirements, pull requests, credentials, or screenshots
  were sent to Stitch.
- Blocker: `npm run check` currently fails at `format:check` because 69 pre-existing application
  files do not match the configured Prettier version. This documentation-only requirement does
  not modify those files; repository formatting-baseline ownership is needed to clear the gate.
- Pull request: PR #11. A Vercel Preview is not applicable because this change is static repository
  documentation and does not alter the deployed app.
- Initial flattened-export validation: visually reviewed slides 1 and 7; the 2.3 MB package contains
  15 slide XML documents and all embedded slide media.
- Editable PowerPoint correction: the native 5.2 MB package contains 15 slide documents, 187 text
  runs, and three intentional illustration objects; slide content is no longer flattened into PNG
  backgrounds.

## Design-review gate

The extended Stitch storyboard is the latest visual reference. Do not adapt the 15-slide HTML deck
to this direction until the user explicitly approves this UI.
