# Stitch screen audit

Use this before generating application code. Include all visible instances and distinguish observed
facts from inference.

## Identity

- Project ID/title and screen ID/title
- Retrieved version or timestamp when available
- Viewport/device and screenshot dimensions
- Intended route and feature slug

## Region inventory

| Region | Visible elements | Count | Repeated collection | Notes |
| --- | --- | ---: | --- | --- |
| Example: tool header | heading, description, action | 3 | no | observed |

Count visible instances. A list with six rows has six row instances; describe the row's internal
controls once and multiply only when clearly visible. Ignore decorative background shapes unless
they affect implementation.

## Element totals

Summarize totals for navigation items, headings, fields, selectors, buttons, links, cards/panels,
list or table rows, tabs, badges/status indicators, semantic or interactive icons, and feedback
messages. Label uncertain totals as a range or unknown.

## States and behavior

| Concern | Observed | Missing or inferred implementation |
| --- | --- | --- |
| Empty/loading/success/error/validation/disabled | | |
| Keyboard/focus behavior | | |
| Mobile/responsive behavior | | |
| Input, transformation, persistence, network flow | | |

## Repository mapping

Map each region to an existing or proposed feature-owned component. Identify route, domain helper,
client boundary, registry, API/repository, migration, and test impact. Do not create shared
abstractions for one-off structures.

## DESIGN.md mapping

Record selected color, type, spacing, radius, border/elevation, and code-text tokens. List material
Stitch differences and the chosen resolution.

## Readiness

State whether the screenshot is inspectable, behavior requirements are sufficient, the exact screen
is explicitly approved, and implementation may begin. Any failed condition stops application edits.
