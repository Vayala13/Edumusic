#!/usr/bin/env bash
#
# EduMusic development environment setup.
#
#   ./setup.sh
#
# Creates a virtualenv and installs the dependencies. Safe to re-run: an
# existing venv is reused, and pip skips anything already installed.
#
# Override the defaults if you need to:
#
#   VENV_DIR=.venv PYTHON=python3.12 ./setup.sh

set -euo pipefail

VENV_DIR="${VENV_DIR:-venv}"
PYTHON="${PYTHON:-python3}"

cd "$(dirname "$0")"

if ! command -v "$PYTHON" >/dev/null 2>&1; then
    echo "error: '$PYTHON' not found on PATH. Set PYTHON=python3.12 (say) and retry." >&2
    exit 1
fi

if [ ! -d "$VENV_DIR" ]; then
    echo "==> Creating virtualenv in $VENV_DIR ($($PYTHON -V))"
    "$PYTHON" -m venv "$VENV_DIR"
else
    echo "==> Reusing existing virtualenv in $VENV_DIR"
fi

echo "==> Installing dependencies"
"$VENV_DIR/bin/pip" install --quiet --upgrade pip
"$VENV_DIR/bin/pip" install --requirement requirements.txt

echo "==> Verifying the audio stack imports"
"$VENV_DIR/bin/python" - <<'PYCHECK'
import librosa, numpy, sounddevice
print(f"    librosa {librosa.__version__} | numpy {numpy.__version__} | sounddevice {sounddevice.__version__}")
PYCHECK

cat <<DONE

Setup complete. Activate the environment and run an instrument:

    source $VENV_DIR/bin/activate
    python main.py

DONE
