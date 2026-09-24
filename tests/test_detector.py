"""Integration tests: audio in -> recognized note out.

These exercise the pieces working together — the streaming PitchTracker
feeding the trumpet NoteDetector's debounce logic — the way the app uses
them at runtime. Still no microphone: synthetic audio stands in.
"""

import numpy as np
import pytest

from instruments.trumpet.detector import NoteDetector

SAMPLE_RATE = 44100
CHUNK = 512  # matches the detector's HOP_SIZE


def sine_wave(freq, seconds, samplerate=SAMPLE_RATE, amplitude=0.5):
    t = np.arange(int(seconds * samplerate)) / samplerate
    return (amplitude * np.sin(2 * np.pi * freq * t)).astype(np.float32)


def feed(detector, signal, chunk=CHUNK):
    for i in range(0, len(signal), chunk):
        detector.process(signal[i:i + chunk])


class TestNoteDetectorIntegration:
    def test_steady_tone_becomes_a_reported_note(self):
        # Arrange
        detector = NoteDetector(stable_frames=3)
        # Act: a full second of A4, the way a held trumpet note arrives
        feed(detector, sine_wave(440.0, seconds=1.0))
        # Assert: debounce settles and the note is reported
        assert detector.last_note == "A4"

    def test_note_changes_are_tracked(self):
        # Arrange
        detector = NoteDetector(stable_frames=3)
        # Act: A4 held, then G4 held
        feed(detector, sine_wave(440.0, seconds=0.6))
        assert detector.last_note == "A4"
        feed(detector, sine_wave(392.0, seconds=0.6))
        # Assert
        assert detector.last_note == "G4"

    def test_silence_clears_the_reported_note(self):
        # Arrange
        detector = NoteDetector(stable_frames=3)
        feed(detector, sine_wave(440.0, seconds=0.6))
        assert detector.last_note == "A4"
        # Act: the player stops
        feed(detector, np.zeros(int(SAMPLE_RATE * 0.6), dtype=np.float32))
        # Assert: nothing is reported while silent, and the debounce resets
        assert detector.last_note is None

    def test_noise_never_becomes_a_note(self):
        # Arrange: seeded RNG so the test is deterministic
        rng = np.random.default_rng(7)
        detector = NoteDetector(stable_frames=3)
        # Act
        feed(detector,
             (0.5 * rng.standard_normal(SAMPLE_RATE)).astype(np.float32))
        # Assert
        assert detector.last_note is None

    def test_recognizes_each_bb_scale_degree(self):
        # Arrange: the MVP is "play the Bb scale in 4/4" — the full
        # detector pipeline must name every degree of it.
        scale_freqs = [233.082, 261.626, 293.665, 311.127,
                       349.228, 392.000, 440.000, 466.164]
        # Act / Assert
        for freq in scale_freqs:
            detector = NoteDetector(stable_frames=3)
            feed(detector, sine_wave(freq, seconds=0.6))
            assert detector.last_note is not None, \
                f"{freq} Hz should be recognized as a note"


class TestNoteReporting:
    """The on_note seam: how a caller other than the CLI receives notes."""

    def test_reports_settled_notes_to_the_callback(self):
        # Arrange
        reported = []
        detector = NoteDetector(stable_frames=3,
                                on_note=lambda name, hz, cents: reported.append((name, hz, cents)))
        # Act
        feed(detector, sine_wave(440.0, seconds=1.0))
        # Assert: one report, carrying the note, its pitch, and how far off it is
        assert len(reported) == 1
        name, hz, cents = reported[0]
        assert name == "A4"
        assert hz == pytest.approx(440.0, abs=1.0)
        assert abs(cents) < 10

    def test_reports_once_per_note_change_not_once_per_frame(self):
        # Arrange
        reported = []
        detector = NoteDetector(stable_frames=3,
                                on_note=lambda name, *_: reported.append(name))
        # Act: two held notes, each spanning many frames
        feed(detector, sine_wave(440.0, seconds=0.6))
        feed(detector, sine_wave(392.0, seconds=0.6))
        # Assert: a report per change, not per frame
        assert reported == ["A4", "G4"]

    def test_silence_is_not_reported(self):
        # Arrange
        reported = []
        detector = NoteDetector(stable_frames=3,
                                on_note=lambda name, *_: reported.append(name))
        # Act
        feed(detector, np.zeros(SAMPLE_RATE, dtype=np.float32))
        # Assert
        assert reported == []

    def test_default_reporter_still_prints(self, capsys):
        # Arrange: no on_note given, so the CLI default applies
        detector = NoteDetector(stable_frames=3)
        # Act
        feed(detector, sine_wave(440.0, seconds=1.0))
        # Assert
        assert "A4" in capsys.readouterr().out
