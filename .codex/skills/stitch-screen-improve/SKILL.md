---
name: stitch-screen-improve
description: Improve one specific application screen against its connected Google Stitch screenshot. Use when the user names a Stitch screen, route, or page and wants a focused visual refinement, pixel-closer implementation, or UI quality check without regenerating the rest of the project.
---

# Stitch Screen Improve

Refine one screen at a time against the Stitch screenshot. Keep the change narrow, preserve
behavior, and make the implementation match the captured Stitch design rather than inventing a
new layout. Never claim visual parity without inspecting the reference image and comparing the
current screen again after editing.

## Required inputs

- Stitch project title or project ID
- Stitch screen title or screen ID
- Application route, if it cannot be inferred from the screen title
- Optional focus area: layout, typography, spacing, colors, responsive behavior, component
  states, or interaction polish

If the user provides only a screen title, resolve the project and screen through Stitch. If the
screen-to-route mapping is ambiguous, inspect the repository and make the smallest reasonable
mapping explicit before editing.

## Workflow

1. Inspect the current repository and working tree. Read the target route, shared shell/components,
   global styles, related requirements, and existing visual conventions. Preserve unrelated
   user changes.
2. Resolve the exact Stitch project and target screen. Call Stitch project listing only when
   needed, then call screen listing and retrieve the target screen with `get_screen`.
3. Capture the Stitch reference image from `get_screen.screenshot.downloadUrl`. First inspect
   proxy variables (`HTTP_PROXY`, `HTTPS_PROXY`, `ALL_PROXY`) when a direct download fails. If
   they point to an unavailable local proxy, retry with `curl.exe --noproxy '*' --location` to a
   temporary file, then inspect that file with image-capable tooling such as `view_image`.
   Record the screen title, screen ID, viewport, device type, image URL, acquisition method,
   visible regions, text, controls, layout geometry, colors, typography, spacing, and responsive
   cues. Do not use generated HTML as the primary reference.
4. Build an image-based mismatch table before editing:
   - visible Stitch region missing from the current route
   - current visual region absent from the Stitch image
   - wrong order, hierarchy, labels, or control state
   - geometry differences: bounds, alignment, columns, padding, gaps, and proportions
   - visual differences: font scale/weight, color, surface, border, radius, icon, and contrast
   Mark each difference as `fix`, `preserve for behavior`, or `uncertain`.
5. Write a short plan naming the exact route and files expected to change. Do not expand the
   task into other screens unless a shared component change is required for the target.
6. Implement only changes supported by the Stitch image/metadata or required to preserve
   existing behavior. Do not add decorative sections, new cards, new navigation, alternate
   copy, or creative enhancements merely because they seem useful. When the reference is
   ambiguous, preserve behavior and choose the least speculative visual interpretation.
7. Re-inspect the reference image after each meaningful UI change. Confirm every visible Stitch
   region has a current-route counterpart and every current visual region absent from Stitch is
   removed or explicitly documented as behavior-preserving.
8. Run the app at the Stitch reference viewport. If browser/screenshot tooling is available,
   capture the current route at the exact viewport and at a narrow mobile width. Compare the
   current capture beside the Stitch image. If local capture tooling is unavailable, provide the
   manual comparison URL/checklist and do not report visual parity as verified.
9. Compare in this order: page frame, major regions, layout geometry, spacing/alignment,
   typography, colors/surfaces, borders/radii, icons, then interaction and responsive states.
   Fix only concrete mismatches grounded in the Stitch image, then repeat the comparison.
10. Apply a strict parity gate before completion. Do not finish while a known `fix` item remains,
    a visible Stitch region is missing, or unsupported current UI remains. List every
    `preserve for behavior` item with its reason; `uncertain` items require a blocked/partial
    result rather than a parity claim.
11. Formatting is mandatory after UI edits, but only for files related to the improved screen:
    its route, feature components, tests, and any shared component/style file intentionally
    changed. Run `npx prettier --write <paths>`, then `npx prettier --check <paths>`, before
    typecheck, tests if present, and production build. Do not repository-format unrelated files.
    Review the diff for scope creep, secrets, accidental generated files, temporary screenshots,
    and regressions in shared components.

## Stitch-specific rules

- Use the Stitch screenshot as the visual source of truth; use project design tokens and screen
  metadata to resolve dimensions, fonts, colors, and device context.
- If the first download fails through the configured proxy, do not conclude that Stitch blocked
  the image. Inspect the proxy environment and retry with a direct no-proxy request before
  marking the image unavailable.
- Do not reinterpret the screenshot or "improve" it with extra UI. Match the defined screen
  first; usability improvements require an explicit user request.
- Inspect only the requested screen by default. Retrieve sibling screens only to understand a
  shared design-system pattern or assess a shared-component regression.
- Re-check the same Stitch image and the current route after every meaningful UI change and once
  again immediately before completion. A single initial inspection is insufficient.
- If the screenshot URL still cannot be downloaded after the direct retry, try an image-capable
  tool with the URL directly. If image inspection still fails, mark visual comparison blocked
  and do not claim parity.
- Record whether the Stitch reference image was inspected and whether a local application
  screenshot was captured. If only the reference was inspected, report partial verification.
- Do not modify the Stitch source screen unless the user explicitly asks for a Stitch edit.

## Dev Toolbox conventions

This repository is a Next.js App Router application. Routes live under `app/`, shared UI lives
under `components/`, and global tokens/styles live in `app/globals.css`. The Dev Toolbox Stitch
project is titled "Dev Toolbox"; resolve its current ID through Stitch rather than assuming it.
The existing saved-run API and Supabase service-role boundary are behavior contracts.

## Completion report

Return:

- Stitch project/screen, screenshot URL, viewport, and application route
- image acquisition method and whether the reference image was inspected
- whether a local application screenshot was captured
- image-based mismatch table: fixed, preserved for behavior, and unresolved
- files changed and why
- behavior/API impact
- visual comparison result: verified, partially verified, or blocked
- confirmation that no unsupported UI was added
- typecheck/test/build results
