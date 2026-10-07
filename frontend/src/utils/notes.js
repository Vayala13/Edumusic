// Shared helpers for pages that listen to the Python pitch detector.

// Where the Python pitch detector streams notes. To use a different port, set
// VITE_NOTES_WS_URL in frontend/.env.local and restart `npm run dev`.
export const NOTES_WS_URL =
  import.meta.env.VITE_NOTES_WS_URL || "ws://localhost:8000/ws/notes";

// Same order and spelling as NOTE_NAMES in common/pitch_utils.py.
export const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// A B♭ trumpet sounds a whole step (2 semitones) lower than the note written
// in the music: fingering a written C produces a concert B♭. The detector
// hears concert pitch ("A#3"), so shift it up to the written note the player
// is reading ("C4") before comparing it to the target.
export function toTrumpetNote(concertNote) {
  const match = /^([A-G]#?)(-?\d+)$/.exec(concertNote);
  if (!match) {
    return concertNote;
  }

  const semitone = (Number(match[2]) + 1) * 12 + NOTE_NAMES.indexOf(match[1]) + 2;
  return `${NOTE_NAMES[semitone % 12]}${Math.floor(semitone / 12) - 1}`;
}

// The detector reports names like "A4". Violin targets carry an octave
// ("A4"), so they must match exactly. Trumpet targets are letters only ("C"),
// so a C in any octave counts.
export function isMatch(detected, target) {
  return /\d$/.test(target)
    ? detected === target
    : detected.replace(/\d+$/, "") === target;
}

// The note the player meant to play: detector notes are concert pitch, so a
// trumpet's are shifted to written pitch first.
export function playedNote(detected, instrument) {
  return instrument === "trumpet" ? toTrumpetNote(detected) : detected;
}
