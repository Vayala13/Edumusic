import hotCrossBuns from "../assets/songs/hot-cross-buns.svg";
import maryHadALittleLamb from "../assets/songs/mary-had-a-little-lamb.svg";
import auClairDeLaLune from "../assets/songs/au-clair-de-la-lune.svg";
import odeToJoy from "../assets/songs/ode-to-joy.svg";
import jingleBells from "../assets/songs/jingle-bells.svg";
import whenTheSaints from "../assets/songs/when-the-saints.svg";

// Beginner songs, easiest first. All are public domain, and every melody
// stays within C to G, the first five notes beginners learn.
//
// `notes` are letters only, like TRUMPET_NOTES in pages/Practice.jsx; trumpet
// players read them as written notes, and they are drawn on the staff from
// middle C (C4) up to G4. "R" is a rest. `beats` gives each note's length in
// 4/4 time (1 = quarter, 2 = half, 4 = whole, 0.5 = eighth, 1.5 = dotted
// quarter), so every 4 beats is one measure. `chords` is the backing
// harmony, one entry per measure; a pair like ["C", "G"] splits the measure
// in half. Covers are original art in assets/songs/.
export const songs = [
  {
    id: "hot-cross-buns",
    title: "Hot Cross Buns",
    cover: hotCrossBuns,
    notes: ["E", "D", "C", "E", "D", "C", "C", "C", "C", "C", "D", "D", "D", "D", "E", "D", "C"],
    beats: [1, 1, 2, 1, 1, 2, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1, 1, 2],
    chords: ["C", "C", ["C", "G"], ["G", "C"]],
  },
  {
    id: "mary-had-a-little-lamb",
    title: "Mary Had a Little Lamb",
    cover: maryHadALittleLamb,
    notes: [
      "E", "D", "C", "D", "E", "E", "E", "D", "D", "D", "E", "G", "G",
      "E", "D", "C", "D", "E", "E", "E", "E", "D", "D", "E", "D", "C",
    ],
    beats: [
      1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4,
    ],
    chords: ["C", "C", "G", "C", "C", "C", "G", "C"],
  },
  {
    id: "au-clair-de-la-lune",
    title: "Au Clair de la Lune",
    cover: auClairDeLaLune,
    notes: ["C", "C", "C", "D", "E", "D", "C", "E", "D", "D", "C"],
    beats: [1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 4],
    chords: ["C", ["C", "G"], ["C", "G"], "C"],
  },
  {
    id: "ode-to-joy",
    title: "Ode to Joy",
    cover: odeToJoy,
    notes: [
      "E", "E", "F", "G", "G", "F", "E", "D", "C", "C", "D", "E", "E", "D", "D",
      "E", "E", "F", "G", "G", "F", "E", "D", "C", "C", "D", "E", "D", "C", "C",
    ],
    beats: [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 0.5, 2,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 0.5, 2,
    ],
    chords: ["C", "G", "C", "G", "C", "G", "C", ["G", "C"]],
  },
  {
    id: "jingle-bells",
    title: "Jingle Bells",
    cover: jingleBells,
    notes: [
      "E", "E", "E", "E", "E", "E", "E", "G", "C", "D", "E",
      "F", "F", "F", "F", "F", "E", "E", "E", "E", "E", "D", "D", "E", "D", "G",
    ],
    beats: [
      1, 1, 2, 1, 1, 2, 1, 1, 1.5, 0.5, 4,
      1, 1, 1.5, 0.5, 1, 1, 1, 0.5, 0.5, 1, 1, 1, 1, 2, 2,
    ],
    chords: ["C", "C", "C", "C", "F", "C", "D7", "G"],
  },
  {
    id: "when-the-saints",
    title: "When the Saints Go Marching In",
    cover: whenTheSaints,
    notes: [
      "R", "C", "E", "F", "G", "R", "C", "E", "F", "G", "R", "C", "E", "F", "G", "E",
      "C", "E", "D", "R", "E", "E", "D", "C", "C", "E", "G", "G", "F",
      "R", "E", "F", "G", "E", "C", "D", "C",
    ],
    beats: [
      1, 1, 1, 1, 4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 2, 2,
      2, 2, 4, 1, 1, 1, 1, 3, 1, 2, 2, 1, 3,
      2, 1, 1, 2, 2, 2, 2, 4,
    ],
    chords: [
      "C", "C", "C", "C", "C", "C", "C", "G",
      "G", "C", "C", "F", ["F", "C"], "C", ["C", "G"], "C",
    ],
  },
];

// Notes the player actually plays (rests left out).
export function playableNotes(song) {
  return song.notes.filter((note) => note !== "R");
}
