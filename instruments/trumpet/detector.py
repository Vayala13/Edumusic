"""
Trumpet Note Detector + Metronome
-----------------------------------
Thin wrapper around common/detector.py, setting trumpet's frequency range.
Run it through the project launcher (python main.py) or directly:

    python -m instruments.trumpet.detector
"""

from common.detector import NoteDetector as _NoteDetector, run as _run
from common.detector import FRAME_LENGTH, HOP_SIZE, SAMPLE_RATE, print_note  # noqa: F401
from common.metronome import DEFAULT_BPM

# Trumpet sounds from roughly E3 to C6. Bounding the search here rather than
# using the wider default makes octave errors less likely.
FMIN = 150.0
FMAX = 1100.0


class NoteDetector(_NoteDetector):
    def __init__(self, **kwargs):
        kwargs.setdefault("fmin", FMIN)
        kwargs.setdefault("fmax", FMAX)
        super().__init__(**kwargs)


def run(bpm=DEFAULT_BPM):
    _run("trumpet", FMIN, FMAX, bpm=bpm)


def main():
    try:
        bpm_input = input(f"Enter metronome tempo in BPM (default {DEFAULT_BPM}): ").strip()
        bpm = int(bpm_input) if bpm_input else DEFAULT_BPM
    except ValueError:
        print(f"Invalid input, defaulting to {DEFAULT_BPM} BPM.")
        bpm = DEFAULT_BPM
    run(bpm)


if __name__ == "__main__":
    main()
    