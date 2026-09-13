#!/usr/bin/env bash
#
# EduMusic development environment setup.
#
#   ./setup.sh
#
# Creates a virtualenv and installs the dependencies. Safe to re-run: an
# existing venv is reused, and pip skips anything already installed.
#
# Why this script exists instead of a plain `pip install -r requirements.txt`:
# aubio ships no wheels for macOS arm64, so it compiles from source, and its
# last release (0.4.9, 2019) needs three build workarounds to survive modern
# clang and ffmpeg. They are documented in requirements.txt; this script just
# applies them so nobody has to remember them.

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

PIP="$VENV_DIR/bin/pip"

# aubio builds with --no-build-isolation (see requirements.txt), so setuptools
# and numpy must already be present in the venv for its build to import them.
echo "==> Installing build prerequisites"
"$PIP" install --quiet --upgrade pip setuptools wheel
"$PIP" install --quiet "numpy>=1.24"

echo "==> Installing dependencies (aubio compiles from source; takes a minute)"
CFLAGS="-Wno-error=incompatible-function-pointer-types" \
PKG_CONFIG_LIBDIR="" \
PKG_CONFIG_PATH="" \
    "$PIP" install --requirement requirements.txt --no-build-isolation

echo "==> Verifying the audio stack imports"
"$VENV_DIR/bin/python" - <<'PYCHECK'
import aubio, numpy, sounddevice
print(f"    aubio {aubio.version} | numpy {numpy.__version__} | sounddevice {sounddevice.__version__}")
PYCHECK

cat <<DONE

Setup complete. Activate the environment and run an instrument:

    source $VENV_DIR/bin/activate
    python main.py

DONE
