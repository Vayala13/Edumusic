import hotCrossBuns from "../assets/songs/hot-cross-buns.svg";
import maryHadALittleLamb from "../assets/songs/mary-had-a-little-lamb.svg";
import auClairDeLaLune from "../assets/songs/au-clair-de-la-lune.svg";
import odeToJoy from "../assets/songs/ode-to-joy.svg";
import jingleBells from "../assets/songs/jingle-bells.svg";
import whenTheSaints from "../assets/songs/when-the-saints.svg";

// Beginner songs, easiest first. All are public domain, and every melody
// stays within C to G, the first five notes beginners learn. Notes are
// letters only, like TRUMPET_NOTES in pages/Practice.jsx; trumpet players
// read them as written notes. Covers are original art in assets/songs/.
export const songs = [
  {
    title: "Hot Cross Buns",
    cover: hotCrossBuns,
    notes: ["E", "D", "C", "E", "D", "C", "C", "C", "C", "C", "D", "D", "D", "D", "E", "D", "C"],
  },
  {
    title: "Mary Had a Little Lamb",
    cover: maryHadALittleLamb,
    notes: [
      "E", "D", "C", "D", "E", "E", "E", "D", "D", "D", "E", "G", "G",
      "E", "D", "C", "D", "E", "E", "E", "E", "D", "D", "E", "D", "C",
    ],
  },
  {
    title: "Au Clair de la Lune",
    cover: auClairDeLaLune,
    notes: ["C", "C", "C", "D", "E", "D", "C", "E", "D", "D", "C"],
  },
  {
    title: "Ode to Joy",
    cover: odeToJoy,
    notes: [
      "E", "E", "F", "G", "G", "F", "E", "D", "C", "C", "D", "E", "E", "D", "D",
      "E", "E", "F", "G", "G", "F", "E", "D", "C", "C", "D", "E", "D", "C", "C",
    ],
  },
  {
    title: "Jingle Bells",
    cover: jingleBells,
    notes: [
      "E", "E", "E", "E", "E", "E", "E", "G", "C", "D", "E",
      "F", "F", "F", "F", "F", "E", "E", "E", "E", "D", "D", "E", "D", "G",
    ],
  },
  {
    title: "When the Saints Go Marching In",
    cover: whenTheSaints,
    notes: [
      "C", "E", "F", "G", "C", "E", "F", "G", "C", "E", "F", "G", "E", "C", "E", "D",
      "E", "E", "D", "C", "C", "E", "G", "G", "F", "E", "F", "G", "E", "C", "D", "C",
    ],
  },
];
