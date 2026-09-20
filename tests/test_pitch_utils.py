"""Unit tests for ``common/pitch_utils.py`` — the note-recognition core.

AAA pattern throughout: Arrange the scenario, Act on the code, Assert the
expected behavior. Happy paths prove the feature works; sad paths prove bad
input is handled instead of crashing.

These tests use synthetic audio (sine waves, noise, silence) so they run
anywhere CI runs — no microphone needed.
"""

import math

import numpy as np
import pytest

from common.pitch_utils import (
    A4_HZ,
    DEFAULT_FMIN,
    DEFAULT_FMAX,
    PitchTracker,
    freq_to_note,
    refine_pitch,
)

SAMPLE_RATE = 44100
FRAME_LENGTH = 2048


def sine_wave(freq, seconds=FRAME_LENGTH / SAMPLE_RATE,
              samplerate=SAMPLE_RATE, phase=0.0, amplitude=0.5):
    """One pure tone as float32 samples."""
    t = np.arange(int(seconds * samplerate)) / samplerate
    return (amplitude * np.sin(2 * np.pi * freq * t + phase)).astype(np.float32)


def cents_between(measured, expected):
    return 1200 * math.log2(measured / expected)


# ---------------------------------------------------------------------------
# freq_to_note — happy paths
# ---------------------------------------------------------------------------

class TestFreqToNoteHappyPaths:
    def test_concert_a(self):
        # Arrange / Act
        note, cents = freq_to_note(440.0)
        # Assert
        assert note == "A4"
        assert cents == pytest.approx(0.0, abs=1e-9)

    def test_notes_across_the_staff(self):
        # Arrange: (frequency, expected note name)
        cases = [
            (261.626, "C4"),   # middle C
            (293.665, "D4"),
            (329.628, "E4"),
            (392.000, "G4"),
            (466.164, "A#4"),
            (880.000, "A5"),
            (164.814, "E3"),   # low end of the trumpet range
            (1046.500, "C6"),  # high end of the trumpet range
        ]
        for freq, expected in cases:
            # Act
            note, _ = freq_to_note(freq)
            # Assert
            assert note == expected, f"{freq} Hz should be {expected}"

    def test_bb_major_scale_names(self):
        # Arrange: the MVP is "play the Bb scale in 4/4" — the recognizer
        # must name every scale degree correctly.
        scale = [
            (233.082, "A#3"),  # Bb3 (enharmonic spelling)
            (261.626, "C4"),
            (293.665, "D4"),
            (311.127, "D#4"),  # Eb4 (enharmonic spelling)
            (349.228, "F4"),
            (392.000, "G4"),
            (440.000, "A4"),
            (466.164, "A#4"),  # Bb4 (enharmonic spelling)
        ]
        for freq, expected in scale:
            # Act
            note, _ = freq_to_note(freq)
            # Assert
            assert note == expected, f"{freq} Hz should be {expected}"

    def test_sharp_reads_positive_cents(self):
        # Arrange / Act
        note, cents = freq_to_note(445.0)
        # Assert
        assert note == "A4"
        assert cents == pytest.approx(19.5, abs=0.2)
        assert cents > 0  # sharp is positive by convention

    def test_flat_reads_negative_cents(self):
        # Arrange / Act
        note, cents = freq_to_note(435.0)
        # Assert
        assert note == "A4"
        assert cents < 0  # flat is negative by convention

    def test_custom_tuning_reference(self):
        # Arrange: an ensemble tuning sharp to A=442
        # Act
        note, cents = freq_to_note(442.0, a4_hz=442.0)
        # Assert
        assert note == "A4"
        assert cents == pytest.approx(0.0, abs=1e-9)


# ---------------------------------------------------------------------------
# freq_to_note — sad paths
# ---------------------------------------------------------------------------

class TestFreqToNoteSadPaths:
    @pytest.mark.parametrize("bad_freq", [0.0, -440.0, -0.001])
    def test_non_positive_frequency_returns_none(self, bad_freq):
        # Arrange / Act
        result = freq_to_note(bad_freq)
        # Assert
        assert result is None


# ---------------------------------------------------------------------------
# refine_pitch — happy paths
# ---------------------------------------------------------------------------

class TestRefinePitchHappyPaths:
    @pytest.mark.parametrize("freq", [164.814, 220.0, 440.0, 1046.5])
    @pytest.mark.parametrize("phase", [0.0, 1.3])
    def test_refined_error_under_one_cent(self, freq, phase):
        # Arrange: a clean tone, plus the integer-lag quantized estimate
        # that yin would hand us (this is the error refine_pitch must fix).
        frame = sine_wave(freq, phase=phase)
        coarse = SAMPLE_RATE / round(SAMPLE_RATE / freq)
        # Act
        refined, confidence = refine_pitch(frame, coarse, SAMPLE_RATE)
        # Assert
        assert abs(cents_between(refined, freq)) < 1.0
        assert confidence > 0.9  # a clean tone is highly periodic


# ---------------------------------------------------------------------------
# refine_pitch — sad paths
# ---------------------------------------------------------------------------

class TestRefinePitchSadPaths:
    @pytest.mark.parametrize("bad_freq", [0.0, -220.0])
    def test_non_positive_estimate_scores_zero(self, bad_freq):
        # Arrange
        frame = sine_wave(440.0)
        # Act
        refined, confidence = refine_pitch(frame, bad_freq, SAMPLE_RATE)
        # Assert
        assert refined == bad_freq
        assert confidence == 0.0

    def test_white_noise_scores_below_threshold(self):
        # Arrange: seeded RNG so the test is deterministic
        rng = np.random.default_rng(1234)
        frame = (0.5 * rng.standard_normal(FRAME_LENGTH)).astype(np.float32)
        # Act
        _refined, confidence = refine_pitch(frame, 440.0, SAMPLE_RATE)
        # Assert: noise is not periodic, so it must never look trustworthy
        assert confidence < 0.7


# ---------------------------------------------------------------------------
# PitchTracker — happy paths
# ---------------------------------------------------------------------------

class TestPitchTrackerHappyPaths:
    def _push_tone(self, tracker, freq, seconds=0.5, chunk=512):
        tone = sine_wave(freq, seconds=seconds)
        result = None
        for i in range(0, len(tone), chunk):
            result = tracker.push(tone[i:i + chunk])
        return result

    def test_detects_steady_tone(self):
        # Arrange
        tracker = PitchTracker(samplerate=SAMPLE_RATE)
        # Act
        result = self._push_tone(tracker, 440.0)
        # Assert
        assert result is not None
        detected_freq, confidence = result
        assert detected_freq == pytest.approx(440.0, rel=0.01)
        assert confidence >= 0.7

    def test_detects_tone_at_trumpet_bounds(self):
        # Arrange: the tracker's range spans the trumpet's E3-C6
        for freq in (164.814, 1046.5):
            tracker = PitchTracker(samplerate=SAMPLE_RATE,
                                   fmin=150.0, fmax=1100.0)
            # Act
            result = self._push_tone(tracker, freq)
            # Assert
            assert result is not None, f"{freq} Hz should be detected"
            assert result[0] == pytest.approx(freq, rel=0.01)

    def test_result_is_none_until_window_is_full(self):
        # Arrange
        tracker = PitchTracker(samplerate=SAMPLE_RATE)
        chunk = sine_wave(440.0, seconds=512 / SAMPLE_RATE)  # one small chunk
        # Act
        result = tracker.push(chunk)
        # Assert: a partial window is not enough to report on
        assert result is None


# ---------------------------------------------------------------------------
# PitchTracker — sad paths
# ---------------------------------------------------------------------------

class TestPitchTrackerSadPaths:
    def _push_chunks(self, tracker, signal, chunk=512, n_chunks=10):
        results = []
        for _ in range(n_chunks):
            results.append(tracker.push(signal[:chunk]))
        return results

    def test_silence_reports_nothing(self):
        # Arrange
        tracker = PitchTracker(samplerate=SAMPLE_RATE)
        silence = np.zeros(512, dtype=np.float32)
        # Act
        results = self._push_chunks(tracker, silence)
        # Assert
        assert all(r is None for r in results)

    def test_noise_reports_nothing(self):
        # Arrange: seeded RNG so the test is deterministic
        rng = np.random.default_rng(99)
        noise = (0.5 * rng.standard_normal(512)).astype(np.float32)
        tracker = PitchTracker(samplerate=SAMPLE_RATE)
        # Act
        results = self._push_chunks(tracker, noise, n_chunks=12)
        # Assert: noise must never be reported as a pitch
        assert all(r is None for r in results)

    def test_empty_chunk_reports_nothing(self):
        # Arrange
        tracker = PitchTracker(samplerate=SAMPLE_RATE)
        # Act / Assert
        assert tracker.push(np.array([], dtype=np.float32)) is None

    def test_a4_reference_is_440(self):
        # Arrange / Act / Assert: sanity on the shared constant
        assert A4_HZ == 440.0
        assert DEFAULT_FMIN == 110.0
        assert DEFAULT_FMAX == 1200.0
