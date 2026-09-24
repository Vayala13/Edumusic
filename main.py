"""
EduMusic launcher
-----------------
Pick an instrument to run. Each instrument lives in its own package under
instruments/ and exposes a `run(bpm=...)` function; shared audio/pitch
helpers live in common/.

    python main.py                  # interactive picker
    python main.py trumpet          # skip the menu
    python main.py trumpet --bpm 90 # skip both prompts

Adding an instrument: drop it in instruments/<name>/detector.py with a
`run(bpm=...)` function, then add one line to INSTRUMENTS below.
"""

import argparse
import importlib
import sys

from common.metronome import DEFAULT_BPM

# name -> (module path, human description)
INSTRUMENTS = {
    "trumpet": ("instruments.trumpet.detector", "Trumpet note detector + metronome"),
    "violin": ("instruments.violin.detector", "Violin note detector + metronome"),
}


def choose_instrument():
    """Prompt for an instrument and return its key, or None if cancelled."""
    names = sorted(INSTRUMENTS)
    print("Available instruments:\n")
    for i, name in enumerate(names, start=1):
        print(f"  {i}. {name:<10} {INSTRUMENTS[name][1]}")
    print()

    while True:
        try:
            choice = input(f"Pick an instrument (1-{len(names)}, or name): ").strip()
        except EOFError:
            return None
        if not choice:
            continue
        if choice.lower() in INSTRUMENTS:
            return choice.lower()
        if choice.isdigit() and 1 <= int(choice) <= len(names):
            return names[int(choice) - 1]
        print(f"'{choice}' is not one of: {', '.join(names)}")


def ask_bpm():
    try:
        raw = input(f"Enter metronome tempo in BPM (default {DEFAULT_BPM}): ").strip()
    except EOFError:
        return DEFAULT_BPM
    if not raw:
        return DEFAULT_BPM
    try:
        bpm = int(raw)
    except ValueError:
        print(f"Invalid input, defaulting to {DEFAULT_BPM} BPM.")
        return DEFAULT_BPM
    if bpm <= 0:
        print(f"BPM must be positive, defaulting to {DEFAULT_BPM}.")
        return DEFAULT_BPM
    return bpm


def main(argv=None):
    parser = argparse.ArgumentParser(description="Run an EduMusic instrument trainer.")
    parser.add_argument("instrument", nargs="?", choices=sorted(INSTRUMENTS),
                        help="instrument to run (omit for an interactive picker)")
    parser.add_argument("--bpm", type=int, default=None,
                        help=f"metronome tempo (default {DEFAULT_BPM})")
    args = parser.parse_args(argv)

    name = args.instrument or choose_instrument()
    if name is None:
        print("Nothing selected, exiting.")
        return 1

    bpm = args.bpm if args.bpm is not None else ask_bpm()
    if bpm <= 0:
        parser.error("--bpm must be positive")

    module_path = INSTRUMENTS[name][0]
    # Imported lazily so a missing audio dependency in one instrument does not
    # stop the picker from listing the others.
    try:
        module = importlib.import_module(module_path)
    except ImportError as exc:
        print(f"Could not load '{name}' ({module_path}): {exc}", file=sys.stderr)
        print("Install the deps with: pip install -r requirements.txt", file=sys.stderr)
        return 1

    module.run(bpm=bpm)
    return 0


if __name__ == "__main__":
    sys.exit(main())
