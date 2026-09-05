# Contributing

This repo uses a simple branch → PR → review → squash-merge workflow.

## Workflow

1. **Branch** off `main` for your change:
   ```bash
   git checkout main
   git pull
   git checkout -b your-name/short-description
   ```

2. **Open a pull request** against `main` once your branch is pushed. Auto-merge is enabled — you can turn it on for your PR and it will merge automatically once checks pass and the review requirement below is met.

3. **Get 1 approval.** `main` is protected: every PR needs at least one approving review before it can merge, and pushing new commits dismisses stale approvals, so re-request review after addressing feedback.

4. **Squash-merge.** `main` only accepts squash merges (no merge commits, no rebase merges) to keep history linear. The default squash commit message is the PR title and description, so write both to reflect what changed and why.

5. **Keep your branch current.** If `main` has moved on, update your branch before merging (GitHub will prompt you — "Update branch" is enabled by default).

Head branches are deleted automatically after merge, so no manual cleanup is needed.

## Branch protection summary

- Force pushes and branch deletion are blocked on `main`.
- Linear history is required (squash-merge only).
- 1 approving review is required; new commits dismiss stale approvals.
- No bypass actors — these rules apply to everyone, including admins.
