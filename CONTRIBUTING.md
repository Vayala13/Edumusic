# Contributing

All changes land on `main` through a pull request. Nobody pushes to `main` directly.

## Running the app locally

The app is two processes: the Python note server (it listens to the microphone
and streams detected notes) and the React frontend. Run each in its own
terminal window, then open http://localhost:5173.

You need **Python 3** and **Node.js** installed.

### Mac

First time on a clone:

```bash
./setup.sh
cd frontend && npm install
```

Then, each time:

```bash
# Window 1: note server, from the repo root
source venv/bin/activate
uvicorn backend.server:app --reload --port 8000

# Window 2: frontend
cd frontend
npm run dev
```

### Windows (PowerShell)

`setup.sh` is Mac/Linux only, so set up by hand. First time on a clone:

```powershell
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd frontend; npm install
```

Then, each time:

```powershell
# Window 1: note server, from the repo root
venv\Scripts\activate
uvicorn backend.server:app --reload --port 8000

# Window 2: frontend
cd frontend
npm run dev
```

If `activate` fails with "running scripts is disabled", run
`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once and try again.

### Choosing the microphone

The note server listens on the system's default input and prints the one it
opens (`listening on '...'`). Plugging in headphones with a mic, like EarPods,
makes the cable mic the default, and it is too quiet for the detector. To use
another mic, set `EDUMUSIC_MIC` to any part of its name:

```bash
# Mac
EDUMUSIC_MIC="MacBook Air Microphone" uvicorn backend.server:app --reload --port 8000
```

```powershell
# Windows
$env:EDUMUSIC_MIC="Microphone Array"; uvicorn backend.server:app --reload --port 8000
```

`python -m sounddevice` lists the mic names on your machine. The server reads
the device list only at start-up, so restart it after plugging in or unplugging
headphones.

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
source venv/bin/activate     # Windows: venv\Scripts\activate
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

If the PR says your branch is out of date with `main`, click **Update branch**.
Everything is squash-merged, so your branch's shape does not matter — it collapses
into one commit on `main` either way, and `main` stays linear. A merge commit in
your own branch is harmless.

**Do this before asking for review, not after.** Update branch pushes a commit, and
pushing dismisses existing approvals — so clicking it on an approved PR costs you
the approval and you have to ask again.

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
