---
id: REQ-006
title: Repository onboarding deck
status: blocked
route: Documentation
ui_approval: Not applicable
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
- Validated with Node 24.14.0: ESLint passed, TypeScript check passed, 75 Vitest tests passed, and
  the production build passed.
- Delivery commit: `88b580e` on `feature-006-repo-onboarding-deck`, pushed to `origin`.
- Visual-refactor commit: `4d2e477`, adding the illustration, animated visual system, and UUID
  delivery example; pushed to the same branch.
- Story-driven refactor: 15-slide narrative and `human-codex-collaboration.png`; Chromium verified
  slide count, illustration loading, navigation, and a clean browser console.
- Blocker: `npm run check` currently fails at `format:check` because 69 pre-existing application
  files do not match the configured Prettier version. This documentation-only requirement does
  not modify those files; repository formatting-baseline ownership is needed to clear the gate.
- Pull-request blocker: the configured GitHub CLI account has an invalid token. Re-authenticate
  with `gh auth refresh -h github.com` before creating the PR. A Vercel Preview is not applicable
  because this change is static repository documentation and does not alter the deployed app.
