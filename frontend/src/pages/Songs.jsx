import { useState } from "react";
import Navbar from "../components/Navbar";
import { LiquidGlassCarousel } from "../components/LiquidGlassCarousel";
import { songs } from "../data/songs";
import "./Songs.css";

// Built once: the carousel rebuilds its WebGL scene whenever `items` changes.
const carouselItems = songs.map((song) => ({
  src: song.cover,
  title: song.title,
  aspect: 3 / 4,
}));

function Songs() {
  const [activeSong, setActiveSong] = useState(0);

  const song = songs[activeSong];

  return (
    <div className="app">
      <main className="songs-page">
        <p className="songs-hint">
          Swipe sideways, drag, or use the arrow keys to browse. Click a cover to look closer.
        </p>

        <section className="songs-carousel">
          <LiquidGlassCarousel
            items={carouselItems}
            panelHeight={380}
            background="#ffffff"
            entry={false}
            onActiveChange={setActiveSong}
          />
        </section>

        <section className="song-details">
          <p className="eyebrow">NOW SELECTED</p>
          <h2>{song.title}</h2>
          <p className="song-note-count">{song.notes.length} notes</p>

          <div className="song-notes">
            {song.notes.map((note, index) => (
              <span key={index} className="song-note">
                {note}
              </span>
            ))}
          </div>
        </section>
      </main>

      <Navbar />
    </div>
  );
}

export default Songs;
