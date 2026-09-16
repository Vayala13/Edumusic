"""Threaded click-track metronome shared across instruments."""

import time
import threading

import numpy as np
import sounddevice as sd

DEFAULT_SAMPLE_RATE = 44100
DEFAULT_BPM = 120


class Metronome:
    """Plays a click at a fixed BPM on a background thread.

    Start it with :meth:`start` and always pair that with :meth:`stop` (a
    ``try/finally`` is the usual shape) so the thread exits cleanly.
    """

    def __init__(self, bpm=DEFAULT_BPM, samplerate=DEFAULT_SAMPLE_RATE):
        self.bpm = bpm
        self.samplerate = samplerate
        self._stop_event = threading.Event()
        self._thread = None

    def _click_sound(self, duration=0.05, freq=1000.0):
        t = np.linspace(0, duration, int(self.samplerate * duration), False)
        # Short decaying sine "tick"
        envelope = np.exp(-30 * t)
        click = 0.5 * np.sin(2 * np.pi * freq * t) * envelope
        return click.astype(np.float32)

    def _run(self):
        interval = 60.0 / self.bpm
        click = self._click_sound()
        next_tick = time.time()
        while not self._stop_event.is_set():
            sd.play(click, samplerate=self.samplerate)
            next_tick += interval
            sleep_time = next_tick - time.time()
            if sleep_time > 0:
                # Wait on the event rather than sleeping, so stop() is felt
                # immediately instead of after the current beat.
                self._stop_event.wait(sleep_time)

    def start(self):
        self._stop_event.clear()
        self._thread = threading.Thread(target=self._run, daemon=True)
        self._thread.start()

    def stop(self):
        self._stop_event.set()
        if self._thread:
            self._thread.join()
            self._thread = None
