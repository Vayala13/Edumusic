import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import "./metronome.css";

function Metronome() {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beat, setBeat] = useState(0);

  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);

  const playClick = (isDownbeat = false) => {
    const AudioContext =
      window.AudioContext || window.webkitAudioContext;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const context = audioContextRef.current;

    if (context.state === "suspended") {
      context.resume();
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";

    // Higher pitch for beat 1.
    oscillator.frequency.value = isDownbeat ? 1000 : 700;

    gain.gain.setValueAtTime(0.3, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      context.currentTime + 0.08
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.08);
  };

  const startMetronome = () => {
    if (isPlaying) {
      return;
    }

    setIsPlaying(true);
    setBeat(0);

    playClick(true);

    const interval = 60000 / bpm;

    intervalRef.current = setInterval(() => {
      setBeat((currentBeat) => {
        const nextBeat = (currentBeat + 1) % 4;

        playClick(nextBeat === 0);

        return nextBeat;
      });
    }, interval);
  };

  const stopMetronome = () => {
    setIsPlaying(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setBeat(0);
  };

  const changeBpm = (amount) => {
    setBpm((currentBpm) => {
      const newBpm = currentBpm + amount;

      return Math.min(
        240,
        Math.max(40, newBpm)
      );
    });
  };

  const selectBpm = (value) => {
    setBpm(value);
  };

  // Restart the timer when BPM changes while playing.
  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    clearInterval(intervalRef.current);

    const interval = 60000 / bpm;

    intervalRef.current = setInterval(() => {
      setBeat((currentBeat) => {
        const nextBeat = (currentBeat + 1) % 4;

        playClick(nextBeat === 0);

        return nextBeat;
      });
    }, interval);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [bpm]);

  // Clean everything up when leaving the page.
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="app">
      <header className="top-bar">
        <div className="logo">Metronome</div>

        <div className="profile">
          <span>♩</span>
        </div>
      </header>

      <main className="metronome-page">
        <section className="metronome-intro">
          <p className="eyebrow">PRACTICE TOOL</p>

          <h1>Metronome</h1>

          <p>
            Keep a steady tempo while you practice.
          </p>
        </section>

        <section className="metronome-card">
          <p className="tempo-label">TEMPO</p>

          <div className="bpm-display">
            <span>{bpm}</span>
            <small>BPM</small>
          </div>

          <div className="beat-indicators">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`beat-dot ${
                  isPlaying && beat === index
                    ? "active"
                    : ""
                } ${
                  index === 0 ? "downbeat" : ""
                }`}
              />
            ))}
          </div>

          <div className="tempo-controls">
            <button
              className="tempo-adjust"
              onClick={() => changeBpm(-5)}
              disabled={bpm <= 40}
            >
              −
            </button>

            <div className="tempo-value">
              {bpm}
              <span>BPM</span>
            </div>

            <button
              className="tempo-adjust"
              onClick={() => changeBpm(5)}
              disabled={bpm >= 240}
            >
              +
            </button>
          </div>

          <button
            className={`metronome-toggle ${
              isPlaying ? "playing" : ""
            }`}
            onClick={
              isPlaying
                ? stopMetronome
                : startMetronome
            }
          >
            {isPlaying ? "■ Stop" : "▶ Start"}
          </button>
        </section>

        <section className="tempo-presets">
          <h2>Tempo Presets</h2>

          <div className="preset-grid">
            {[60, 80, 100, 120, 140, 160, 180].map(
              (value) => (
                <button
                  key={value}
                  className={
                    bpm === value
                      ? "preset active"
                      : "preset"
                  }
                  onClick={() =>
                    selectBpm(value)
                  }
                >
                  {value}
                </button>
              )
            )}
          </div>
        </section>
      </main>

      <Navbar />
    </div>
  );
}

export default Metronome;