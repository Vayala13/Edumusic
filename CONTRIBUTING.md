# Contributing

All changes land on `main` through a pull request. Nobody pushes to `main` directly.

## Workflow

### 1. Branch

Start from an up-to-date `main`:

```bash
git checkout main
git pull
git checkout -b your-name/short-description
```

Use a short, descriptive branch name — `viv/fix-audio-latency`, not `patch-1`.

### 2. Commit

Keep commits focused. They get squashed on merge, so local commit granularity is
for your own benefit while reviewing — don't agonize over it.

### 3. Run the checks locally

Two checks run on every pull request, and **both must pass before it can merge**.
Run them before you push — it is faster than waiting for CI to tell you.

```bash
# Python tests, from the repo root
source venv/bin/activate     # first time on a clone: ./setup.sh
pytest

# Frontend lint + build
cd frontend
npm run lint
npm run build
```

Run `pytest` from the repo root. It reads `pytest.ini`, which puts the root on
`sys.path` so `common` and `instruments` import without an editable install.

Tests live in `tests/`. If you change behavior in `common/` or `instruments/`,
add or update a test for it — the suite is what stops a deliberate fix from
being undone by accident in a later refactor.

The workflow itself is `.github/workflows/ci.yml`.

### 4. Open a pull request

```bash
git push -u origin your-name/short-description
gh pr create --fill
```

The PR **title and body become the squash commit message**, so write them for
someone reading `git log` six months from now:

- Title: imperative and specific — `Fix audio latency on Safari`
- Body: what changed, why, and anything a reviewer should check by hand

If `main` has moved on, use the **Update branch** button (or rebase locally).
History on `main` is linear, so a merge commit in your branch will block the merge —
rebase instead of merging `main` into your branch.

### 5. Review

Every PR needs **one approval** from another team member before it can merge.

- Reviewers: aim to respond within a working day.
- Pushing new commits dismisses existing approvals, so get review comments
  resolved before asking for the final look.
- Authors don't approve their own PRs.

### 6. Squash-merge

Squash merge is the only merge method enabled — one commit per PR on `main`.

```bash
gh pr merge --squash --auto
```

`--auto` merges as soon as the approval lands. The head branch is deleted
automatically after merge.

## Repository settings

These are enforced in GitHub, not by convention:

| Setting | Value |
| --- | --- |
| Merge methods | Squash only (no merge commits, no rebase) |
| Squash commit message | PR title and body |
| Auto-merge | Enabled |
| Suggest updating branches | Always |
| Delete head branch on merge | Automatic |
| `main` protection | PR required, 1 approval, stale approvals dismissed, linear history, no force pushes, no deletion |
| Required status checks | `Python tests` and `Frontend lint + build` must pass |
| Branch must be up to date | Yes — rebase on `main` if CI ran against older code |

These rules apply to everyone, including admins — there are no bypass actors.
