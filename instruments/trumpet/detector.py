"""
Trumpet Note Detector + Metronome
-----------------------------------
Listens to live audio from the microphone, detects the pitch/note being
played (designed for monophonic instruments like trumpet), prints the
detected note name in real time, and simultaneously plays a metronome
click at a user-specified BPM.

Run it through the project launcher:

    python main.py

or directly as a module from the project root:

    python -m instruments.trumpet.detector

Shared pieces live in common/ -- the metronome and the note-name math are
used by every instrument, so fixes there benefit all of them.
"""

import sys
import queue

import numpy as np
import sounddevice as sd

from common.metronome import Metronome, DEFAULT_BPM
from common.pitch_utils import PitchTracker, freq_to_note


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
SAMPLE_RATE = 44100
HOP_SIZE = 512               # samples per audio callback
FRAME_LENGTH = 2048          # analysis window; see PitchTracker for why

# Trumpet sounds from roughly E3 to C6. Bounding the search here rather than
# using the wider default makes octave errors less likely.
FMIN = 150.0
FMAX = 1100.0


# ---------------------------------------------------------------------------
# Pitch detection (trumpet note listener)
# ---------------------------------------------------------------------------
class NoteDetector:
    def __init__(self, samplerate=SAMPLE_RATE, frame_length=FRAME_LENGTH):
        self.tracker = PitchTracker(samplerate=samplerate,
                                    frame_length=frame_length,
                                    fmin=FMIN,
                                    fmax=FMAX)
        self.last_note = None

    def process(self, audio_chunk):
        result = self.tracker.push(audio_chunk)
        if result is None:
            # Silence, noise, or a still-filling window: forget the held note so
            # replaying the same pitch prints again.
            self.last_note = None
            return

        pitch, _confidence = result
        note = freq_to_note(pitch)
        if note is None:
            return

        note_name, cents_off = note
        if note_name != self.last_note:
            # int() before formatting, so a hair-flat note reads "+0" not "-0".
            print(f"Note: {note_name:<4}  ({pitch:6.1f} Hz, {int(round(cents_off)):+d} cents)")
            self.last_note = note_name


# ---------------------------------------------------------------------------
# Entry points
# ---------------------------------------------------------------------------
def run(bpm=DEFAULT_BPM):
    """Run the trumpet detector with a metronome at `bpm` until Ctrl+C."""
    detector = NoteDetector()
    metronome = Metronome(bpm=bpm, samplerate=SAMPLE_RATE)

    audio_q = queue.Queue()

    def audio_callback(indata, frames, time_info, status):
        if status:
            print(status, file=sys.stderr)
        audio_q.put(indata[:, 0].copy())

    print(f"Starting metronome at {bpm} BPM and trumpet note detector...")
    print("Play your trumpet into the microphone. Press Ctrl+C to stop.\n")

    metronome.start()

    try:
        with sd.InputStream(channels=1,
                             samplerate=SAMPLE_RATE,
                             blocksize=HOP_SIZE,
                             callback=audio_callback):
            while True:
                chunk = audio_q.get()
                detector.process(chunk)
    except KeyboardInterrupt:
        print("\nStopping...")
    finally:
        metronome.stop()


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
