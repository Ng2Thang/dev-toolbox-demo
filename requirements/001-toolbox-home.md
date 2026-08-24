---
id: REQ-001
status: design-review
route: /
stitch_project: Dev Toolbox
stitch_screen_id: aed00344229b443998ebece1022763ee
stitch_screen_title: Dev Toolbox - Home
ui_approved_at:
---

# REQ-001 - Toolbox Home and Discovery

## Goal

Help developers discover and open the available local developer utilities from a clear home workspace.

## Inputs

- A search query to filter tools by name, category, or description.
- Category navigation selection.

## Outputs

- Tool cards with name, category, description, and route.
- An empty state when no tool matches the search.

## Main actions

- Search the tool catalogue.
- Select a category or open a tool card.
- Open saved runs from the shared navigation.

## Validation

- Trim whitespace-only searches and treat them as no filter.
- Show a clear no-results state for unmatched queries.

## Data

- Local-only discovery backed by the typed tool registry; no new persistence.

## Traceability note

The existing Home implementation predates the repository requirement to retain
Stitch design artifacts. It remains in `design-review`: export the referenced
Stitch screen into `.stitch/designs/`, register it in `.stitch/metadata.json`,
and obtain explicit UI approval before recording delivery evidence.

## Acceptance criteria

1. The home route presents the shared Dev Toolbox shell and all registered tools.
2. Search and category filtering visibly update the displayed tools and show an empty state when appropriate.
3. Each tool card navigates to its registered route, with no credentials or server-only data exposed to the client.

## Non-goals

- User accounts, remote tool catalogues, or personalized recommendations.
