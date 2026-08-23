# Visual fidelity review

Use this after implementation and before reporting the screen complete.

## Compare at the reference size

1. Record the Stitch screenshot viewport or dimensions from the screen audit.
2. Render the matching application route at that exact viewport.
3. Compare the reference and implementation side-by-side or with a transparent overlay.
4. Correct mismatches in this order: region geometry, alignment, spacing, typography, surfaces,
   borders, then small controls, icons, labels, and dividers.

Do not use a desktop screenshot as evidence for mobile fidelity. If Stitch provides a mobile screen,
compare it at its own viewport. Otherwise inspect the narrow responsive layout required by
`DESIGN.md`.

## Audit reconciliation

Revisit the pre-code screen audit. Confirm every visible region and counted instance is present:

- navigation and repeated items
- headings, labels, fields, actions, and feedback
- cards, rows, tabs, badges, dividers, and semantic icons
- shown empty, success, error, disabled, or validation states

Count concrete visible instances again after rendering. A component that exists in code but is not
visible at the reference viewport does not satisfy the audit.

## Intentional-deviation register

Document each deliberate difference instead of silently approximating it.

| Reference element | Difference | Reason | User approved? |
| --- | --- | --- | --- |
| | | | |

Only record a deviation when the implementation cannot reasonably match the reference because of an
existing product rule, accessibility requirement, responsive behavior, or an explicit user choice.
An unimplemented item, uncertain count, or unreviewed misalignment is not an intentional deviation.

## Completion condition

Repeat comparison after material visual changes. Visual fidelity is complete only when all observed
mismatches are fixed or listed above with a concrete reason; otherwise report the remaining
mismatches as blockers or risks.
