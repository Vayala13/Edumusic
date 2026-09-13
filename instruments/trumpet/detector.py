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
import aubio

from common.metronome import Metronome, DEFAULT_BPM
from common.pitch_utils import freq_to_note


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
SAMPLE_RATE = 44100
BUFFER_SIZE = 1024          # samples per audio callback
HOP_SIZE = 512               # aubio hop size (must divide buffer nicely)
TOLERANCE = 0.8              # pitch detection confidence threshold
MIN_CONFIDENCE = 0.85        # below this, treat the frame as silence/noise


# ---------------------------------------------------------------------------
# Pitch detection (trumpet note listener)
# ---------------------------------------------------------------------------
class NoteDetector:
    def __init__(self, samplerate=SAMPLE_RATE, buffer_size=BUFFER_SIZE, hop_size=HOP_SIZE):
        # aubio's "pitch" object implements the YIN algorithm by default.
        # To swap in a deep learning model like CREPE instead, replace this
        # block with a call to crepe.predict() on each incoming audio chunk.
        self.pitch_o = aubio.pitch("yin", buffer_size, hop_size, samplerate)
        self.pitch_o.set_unit("Hz")
        self.pitch_o.set_tolerance(TOLERANCE)
        self.hop_size = hop_size
        self.last_note = None

    def process(self, audio_chunk):
        audio_chunk = audio_chunk.astype(np.float32)
        pitch = self.pitch_o(audio_chunk)[0]
        confidence = self.pitch_o.get_confidence()

        if confidence > MIN_CONFIDENCE and pitch > 0:
            result = freq_to_note(pitch)
            if result:
                note_name, cents_off = result
                if note_name != self.last_note:
                    sign = "+" if cents_off >= 0 else ""
                    print(f"Note: {note_name:<4}  ({pitch:6.1f} Hz, {sign}{cents_off:.0f} cents)")
                    self.last_note = note_name
        else:
            self.last_note = None


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
