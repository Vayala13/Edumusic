"""Pitch detection and note-name helpers shared across instruments."""

import numpy as np
import librosa

NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

# Reference pitch for A4, in Hz. Ensembles that tune sharp (A=442) can pass
# a different value rather than editing this default.
A4_HZ = 440.0

# Detection defaults. The range spans A2 to roughly D6, which covers brass and
# woodwind practice ranges with headroom; narrow it per instrument if you want
# fewer octave errors.
DEFAULT_FMIN = 110.0
DEFAULT_FMAX = 1200.0

# yin needs at least 2 * samplerate / fmin samples to resolve the lowest pitch.
# At 44.1 kHz and fmin=110 that is ~802, so 2048 leaves comfortable margin and
# measurably improves accuracy over 1024.
DEFAULT_FRAME_LENGTH = 2048

# Frames quieter than this are treated as silence and never reported.
DEFAULT_SILENCE_RMS = 0.01

# Minimum normalized autocorrelation for a frame to count as pitched.
DEFAULT_MIN_PERIODICITY = 0.7

# How far either side of yin's estimate to look for the true correlation peak,
# as a fraction of the period. A fixed sample count does not work: yin can land
# 4 samples off at E3 (period ~268) while 4 samples at C6 (period ~42) would
# reach halfway to the neighbouring peak. 4% stays well inside the half-period
# that would risk an octave jump.
PEAK_SEARCH_FRACTION = 0.04
MIN_PEAK_SEARCH_SAMPLES = 2


def freq_to_note(freq, a4_hz=A4_HZ):
    """Convert a frequency in Hz to the nearest note name + octave.

    Returns a ``(note_name, cents_off)`` tuple, where ``cents_off`` is how far
    the input sits from that note (negative = flat, positive = sharp), or
    ``None`` if the frequency is not a usable positive value.
    """
    if freq <= 0:
        return None
    # MIDI note number formula
    midi_num = 69 + 12 * np.log2(freq / a4_hz)
    midi_num_rounded = int(round(midi_num))
    note_name = NOTE_NAMES[midi_num_rounded % 12]
    octave = (midi_num_rounded // 12) - 1
    cents_off = (midi_num - midi_num_rounded) * 100
    return f"{note_name}{octave}", cents_off


def _normalized_correlation(centered, lag):
    """Correlation of a zero-mean frame against itself at `lag`, scaled to 0-1.

    Normalizing by both windows' energy (rather than using a raw correlation)
    matters: a raw autocorrelation tapers off with lag because fewer samples
    overlap, which drags the peak away from the true period.
    """
    if lag < 1 or lag >= len(centered):
        return 0.0
    head, tail = centered[:-lag], centered[lag:]
    denom = np.sqrt(np.dot(head, head) * np.dot(tail, tail))
    if denom <= 0:
        return 0.0
    return float(np.dot(head, tail) / denom)


def refine_pitch(frame, freq, samplerate, search_fraction=PEAK_SEARCH_FRACTION):
    """Sharpen a coarse pitch estimate and score how periodic the frame is.

    Returns ``(refined_freq, confidence)``.

    yin reports the period as a whole number of samples, so its raw output is
    quantized -- on a 2048-sample frame that reads several cents sharp, and up
    to ~11 cents at the bottom of the range, which is plainly visible on a
    tuner. Two steps fix that:

    1. Snap to the integer lag with the highest normalized correlation near
       yin's estimate. yin can land several samples off the true peak -- at E3
       it reported a lag of 264 against a true 267.6 -- and interpolating
       around the wrong lag cannot recover that.
    2. Fit a parabola through that peak and its neighbours to recover the
       sub-sample period.

    Measured worst-case error across E3-C6 on synthetic harmonic tones at
    random phases: under 0.1 cents, versus up to 11 cents unrefined. Real
    playing is noisier than a synthetic tone; see the noise figures in the
    module tests for how confidence degrades.

    The correlation at the peak doubles as the confidence score -- ~1.0 for a
    cleanly periodic tone, near 0.0 for noise -- standing in for the score a
    dedicated pitch library would report.
    """
    if freq <= 0:
        return freq, 0.0

    centered = frame - frame.mean()
    lag_guess = int(round(samplerate / freq))
    search = max(MIN_PEAK_SEARCH_SAMPLES, int(round(search_fraction * lag_guess)))
    lo = max(1, lag_guess - search)
    hi = min(len(centered) - 2, lag_guess + search)
    if lo > hi:
        return freq, 0.0

    lag = max(range(lo, hi + 1), key=lambda l: _normalized_correlation(centered, l))

    before = _normalized_correlation(centered, lag - 1)
    at = _normalized_correlation(centered, lag)
    after = _normalized_correlation(centered, lag + 1)

    curvature = before - 2 * at + after
    # curvature == 0 means the three points are collinear: no peak to refine.
    shift = 0.0 if curvature == 0 else 0.5 * (before - after) / curvature
    # A vertex more than a sample away means this is not a clean peak; keep the
    # integer lag rather than trusting the fit.
    if abs(shift) > 1.0:
        shift = 0.0

    return samplerate / (lag + shift), at


class PitchTracker:
    """Streaming monophonic pitch tracker built on ``librosa.yin``.

    Audio arrives in whatever block size the input stream uses; this keeps a
    rolling window of ``frame_length`` samples so detection is independent of
    that block size. Feed it with :meth:`push`.
    """

    def __init__(self,
                 samplerate,
                 frame_length=DEFAULT_FRAME_LENGTH,
                 fmin=DEFAULT_FMIN,
                 fmax=DEFAULT_FMAX,
                 silence_rms=DEFAULT_SILENCE_RMS,
                 min_periodicity=DEFAULT_MIN_PERIODICITY):
        self.samplerate = samplerate
        self.frame_length = frame_length
        self.fmin = fmin
        self.fmax = fmax
        self.silence_rms = silence_rms
        self.min_periodicity = min_periodicity
        self._window = np.zeros(frame_length, dtype=np.float32)
        self._primed = False
        self._filled = 0

    def push(self, chunk):
        """Add audio and return ``(freq_hz, confidence)``, or ``None``.

        ``None`` means "no pitch to report": the window is not full yet, the
        frame is silent, or it is not periodic enough to trust.
        """
        chunk = np.asarray(chunk, dtype=np.float32).reshape(-1)
        if chunk.size == 0:
            return None

        if chunk.size >= self.frame_length:
            self._window = chunk[-self.frame_length:].copy()
            self._filled = self.frame_length
        else:
            self._window = np.concatenate((self._window[chunk.size:], chunk))
            self._filled = min(self.frame_length, self._filled + chunk.size)

        if self._filled < self.frame_length:
            return None

        if float(np.sqrt(np.mean(self._window ** 2))) < self.silence_rms:
            return None

        freq = float(librosa.yin(self._window,
                                 fmin=self.fmin,
                                 fmax=self.fmax,
                                 sr=self.samplerate,
                                 frame_length=self.frame_length)[0])

        if not np.isfinite(freq) or not (self.fmin <= freq <= self.fmax):
            return None

        freq, confidence = refine_pitch(self._window, freq, self.samplerate)
        if confidence < self.min_periodicity:
            return None
        if not (self.fmin <= freq <= self.fmax):
            return None

        return freq, confidence
