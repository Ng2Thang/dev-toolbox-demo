---
name: manual-vercel-deploy
description: Create and validate an explicitly requested Vercel preview deployment for this repository. Use only when the user asks to deploy or validate Vercel; never use for routine feature work.
---

# Manual Vercel Deploy

Use this skill only after the user explicitly requests a deployment. It is intentionally explicit-only: feature work must not deploy as a side effect.

## Guardrails

- `vercel.json` must keep `git.deploymentEnabled` set to `false`. This disables deployments triggered by Git pushes for every branch.
- Deploy previews only. Never pass `--prod`, call `vercel promote`, set a production target, assign a production alias, or alter production settings.
- A production deployment requires a separate, explicit user request and must be handled outside this skill under the repository's production policy.
- Do not deploy a dirty worktree until the user confirms the exact changes that will be included. Report unrelated changes rather than silently shipping them.
- Do not use the deprecated `--name` flag. Confirm the local `.vercel/project.json` link identifies the intended project.

## Preview workflow

1. Confirm the requested route or release candidate, inspect `git status`, and verify the project link with `vercel whoami` and `.vercel/project.json`.
2. Run `npm run check` unless the user accepts current, documented check evidence for the same commit.
3. Create the preview with `vercel deploy --yes --target=preview`. Capture the deployment URL from standard output.
4. Run `vercel inspect <deployment-url>` and require both `status: Ready` and `target: preview` before calling it a preview. If the target is production or unexpected, stop immediately and report the incident; do not promote, alias, redeploy, or roll back without user direction.
5. Validate the requested route with `vercel curl <route> --deployment <deployment-url>`. Check recent error logs with `vercel logs --deployment <deployment-url> --level error --limit 50` when available.
6. Report the deployment URL, target, checked commit, validation result, and remaining risks. If a pull request is in scope, add a normal PR comment with that evidence.

## Failure handling

- If Git-triggered deployments still occur after `vercel.json` is merged, instruct the user to verify the Vercel project's **Settings > Git** connection and `git.deploymentEnabled` setting. Do not disconnect repositories or change project settings without explicit authorization.
- If the CLI cannot verify the target, treat the deployment as unvalidated and do not claim preview success.
