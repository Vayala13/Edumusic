"""Pitch and note-name helpers shared across instruments."""

import numpy as np

NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

# Reference pitch for A4, in Hz. Ensembles that tune sharp (A=442) can pass
# a different value rather than editing this default.
A4_HZ = 440.0


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
