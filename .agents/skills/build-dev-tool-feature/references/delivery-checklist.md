# Delivery checklist

Use this checklist only after the requirement status is `design-approved`.

## Implementation

- Map the approved Stitch screen to a thin route under `app/(toolbox)/`.
- Place feature behavior under `features/<feature>/`.
- Update `lib/tools.ts` for navigation and discovery.
- Keep browser interaction in a focused client component and domain logic in pure functions.
- Add API, repository, and database layers only when the requirement needs them.
- Create a new timestamped Supabase migration for every schema change.

## Tests

- Test pure transformations, validation, empty input, and boundary cases.
- Test visible success and error states for interactive components.
- Test invalid route payloads before repository calls when an API changes.
- Build an explicit list of feature-related changed files: its route, feature folder, tests, and
  only shared files intentionally edited for the requirement.
- Run `npx prettier --write <paths>`, then `npx prettier --check <paths>`, then `npm run check`.
- Do not use repository-wide formatting for a focused feature unless explicitly requested; do not
  proceed to delivery while any feature-related edited `.ts`, `.tsx`, or `.css` file fails format check.

## Review and delivery

- Map every acceptance criterion to evidence.
- Check the diff for credentials, temporary Stitch files, generated artifacts, and unrelated edits.
- Confirm service-role credentials remain server-only.
- Commit on a feature branch and open a pull request.
- Validate the Vercel Preview at desktop and narrow widths.
- Do not deploy or migrate production without separate explicit authorization.
