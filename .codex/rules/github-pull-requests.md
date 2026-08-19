# GitHub Pull Request Rules

Apply these rules before creating or updating a GitHub pull request for this repository.

## Branch requirements

- Run `git branch --show-current` before creating the PR.
- The branch must match `feature-[require-id]-[short-description]`.
- Use a requirement ID and lowercase kebab-case description.
- Keep the complete branch name to 50 characters or fewer.
- Do not create a PR when the branch fails these checks.

## Required test report

Before `gh pr create`:

1. Determine the current `HEAD` SHA.
2. Locate a full-repository test report for that exact commit.
3. If none exists, run the project's complete test suite and save its report.
4. Do not substitute a partial, module-only, or stale report.

The PR body must include a `## Test Report` section with the command, total, passed,
failed, skipped (when applicable), report path/artifact, and tested commit SHA. Describe
any failures accurately; never state that tests passed when they did not.

## Change-size warning

1. Determine the PR base branch.
2. Run `git diff --numstat <base-branch>...HEAD`.
3. Sum all additions and deletions.

When the total exceeds 2,000 changed lines, place this exact text near the top of the PR
description, before the normal change summary:

```text
THIS SHOULD BE REVIEW CAREFULLY!!!
```

## Commit message requirements

- Every new commit must use exactly this subject format:
  `Feat#[number_feature]: [short_description_below_40_chars]`.
- Replace `[number_feature]` with the numeric feature or requirement identifier, without leading
  zeroes unless the identifier itself requires them.
- Replace `[short_description_below_40_chars]` with a clear description of fewer than 40
  characters. Do not add a body when a one-line subject is sufficient.
- Validate the subject before committing. For example:
  `Feat#4: add timestamp test coverage`.

## Required creation sequence

Complete these steps in order before invoking `gh pr create`:

1. Determine the base branch, current branch, and `HEAD` SHA.
2. Validate the branch convention and length.
3. Validate or generate the current full-repository test report and collect its summary.
4. Calculate changed lines against the base branch and add the large-PR warning if required.
5. Prepare the PR body, including `## Test Report`.
6. Create the PR only after every prior check succeeds.
