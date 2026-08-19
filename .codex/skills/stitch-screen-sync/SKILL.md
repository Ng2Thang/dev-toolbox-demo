---
name: stitch-screen-sync
description: Sync UI screens from a connected Google Stitch project into the current repository. Use when asked to build, recreate, mirror, or update one or more app screens from Stitch, especially when the user names a Stitch project or asks to keep Stitch and code aligned.
---

# Stitch Screen Sync

Synchronize Stitch screen intent into the current application while preserving existing
behavior, architecture, and security boundaries.

## Workflow

1. Confirm the target Stitch project. If the user gives only a title, call Stitch project
   listing and resolve the exact project ID. Do not create or edit a Stitch project during a
   code sync unless explicitly requested.
2. Inventory the repository before editing: routes, shared layout/components, styling system,
   data/API boundaries, requirements, and existing tests. Check the working tree and preserve
   unrelated user changes.
3. List every screen in the target Stitch project. Build a compact mapping of screen ID,
   title, viewport/device type, and the repository route or component that should own it.
4. Retrieve each relevant screen. Inspect its screenshot and any available screen metadata;
   use the screenshot as the visual source of truth for layout, hierarchy, spacing, states, and
   responsive intent. Treat generated HTML as supplemental, not authoritative application code.
5. Write a short implementation plan before changing files. Group repeated patterns into the
   existing shell/design system and identify which screens are new versus visual updates.
6. Implement shared foundations first: page shell, navigation, typography, colors, surfaces,
   controls, card/editor patterns, and responsive breakpoints. Reuse existing components when
   they already express the same pattern.
7. Implement or update each mapped route. Preserve functional behavior and acceptance
   criteria; add missing empty, loading, success, validation, and error states where the
   reference implies them. Keep secrets and server-only credentials out of client code.
8. For schema/API changes, follow repository migration conventions and create a new migration;
   never rewrite an applied migration. Keep validation at the server boundary.
9. Validate the sync: formatting is mandatory but scoped. Build an explicit list of only the
   synced routes, feature folders, tests, and shared files intentionally changed by this sync.
   Run `npx prettier --write <paths>`, then `npx prettier --check <paths>`, before the repository's
   typecheck, tests, and production build. Do not repository-format unrelated files. Review each
   route at the Stitch viewport size and at a narrow mobile width. Compare hierarchy and major
   geometry first, then typography, color, spacing, and interaction states.
10. Review the diff for accidental files, secrets, unrelated rewrites, and missing screen
    coverage. Report the project ID, screen-to-route mapping, changed files, checks, and any
    visual or external blockers.

## Stitch inspection rules

- Prefer one Stitch listing call followed by parallel screen retrieval calls.
- Use the smallest relevant screen set when the user requests a subset; use all screens when
  they say "all screens" or "sync the project."
- Do not copy Stitch-generated HTML wholesale into the app. Translate visual intent into the
  app's framework and component conventions.
- Preserve the reference's content hierarchy and interaction model, but use real application
  data and existing domain behavior instead of placeholder-only UI.
- If a screen has no obvious route, propose a route from its title and record the mapping before
  implementation.
- If a screenshot or screen payload cannot be retrieved, continue with available metadata and
  clearly report the limitation rather than inventing detailed visual facts.

## Dev Toolbox defaults

For this repository, the primary Stitch project is titled "Dev Toolbox." Resolve it through
Stitch listing rather than hard-coding a project ID, because project IDs can differ by account.
The current app uses Next.js App Router, with shared UI in `components/`, pages under `app/`,
and global styling in `app/globals.css`. Existing tool behavior and the saved-runs Supabase
boundary are part of the contract.

## Completion report

Return:

- Stitch project and screens inspected
- screen-to-route mapping
- shared patterns and routes changed
- behavior/API/schema impact
- checks run and results
- remaining visual, credential, or deployment blockers
