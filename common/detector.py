"""
Shared pitch-detection core used by every instrument.

Each instrument's own detector.py is a thin wrapper around this module:
it sets FMIN/FMAX for that instrument and calls run(). The audio loop,
debouncing, and note-reporting logic live here once, so fixes here
benefit every instrument.
"""

import sys
import queue

import sounddevice as sd

from common.metronome import Metronome, DEFAULT_BPM
from common.pitch_utils import PitchTracker, freq_to_note


SAMPLE_RATE = 44100
HOP_SIZE = 512               # samples per audio callback
FRAME_LENGTH = 2048          # analysis window; see PitchTracker for why


def print_note(note_name, pitch, cents_off):
    """Default reporter: the CLI behavior detectors have always had."""
    print(f"Note: {note_name:<4}  ({pitch:6.1f} Hz, {int(round(cents_off)):+d} cents)")


class NoteDetector:
    def __init__(self, fmin, fmax, samplerate=SAMPLE_RATE, frame_length=FRAME_LENGTH,
                 stable_frames=8, on_note=print_note):
        self.tracker = PitchTracker(samplerate=samplerate,
                                    frame_length=frame_length,
                                    fmin=fmin,
                                    fmax=fmax)
        # Called with (note_name, pitch_hz, cents_off) once a note settles.
        # Defaults to printing so the CLI is unchanged; a server passes its
        # own reporter to push notes somewhere other than stdout.
        self.on_note = on_note
        self.last_note = None
        # Debounce: require the same note to be seen this many times in a
        # row before printing, so a brief attack-transient misread (e.g.
        # F#3 flickering before G3 settles in) doesn't get reported.
        self.stable_frames = stable_frames
        self._pending_note = None
        self._pending_count = 0

    def process(self, audio_chunk):
        result = self.tracker.push(audio_chunk)
        if result is None:
            self.last_note = None
            self._pending_note = None
            self._pending_count = 0
            return

        pitch, _confidence = result
        note = freq_to_note(pitch)
        if note is None:
            return

        note_name, cents_off = note

        if note_name == self._pending_note:
            self._pending_count += 1
        else:
            self._pending_note = note_name
            self._pending_count = 1

        if self._pending_count >= self.stable_frames and note_name != self.last_note:
            self.last_note = note_name
            self.on_note(note_name, pitch, cents_off)


def run(instrument, fmin, fmax, bpm=DEFAULT_BPM):
    """Audio loop + metronome for any monophonic instrument, until Ctrl+C."""
    detector = NoteDetector(fmin=fmin, fmax=fmax)
    metronome = Metronome(bpm=bpm, samplerate=SAMPLE_RATE)

    audio_q = queue.Queue()

    def audio_callback(indata, frames, time_info, status):
        if status:
            print(status, file=sys.stderr)
        audio_q.put(indata[:, 0].copy())

    print(f"Starting metronome at {bpm} BPM and {instrument} note detector...")
    print(f"Play your {instrument} into the microphone. Press Ctrl+C to stop.\n")

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