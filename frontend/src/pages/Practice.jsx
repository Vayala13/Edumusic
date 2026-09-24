import { useState } from "react";
import Navbar from "../components/Navbar";
import { useInstrument } from "../context/useInstrument";
import "./Practice.css";

function Practice() {
  const { instrument } = useInstrument();

  const [isListening, setIsListening] = useState(false);

  const notes = 
    instrument === "violin"
    ? ["G","D","A","E"]
    : ["C", "D", "E", "F", "G"];

  const instrumentName =
    instrument === "violin"
    ? "Violin"
    : "Trumpet"

  const instrumentIcon = instrument === "violin"
    ? "🎻"
    : "🎺"

  const [currentNote, setCurrentNote] = useState(0);
  const [detectedNote, setDetectedNote] = useState(null);

  return (
    <div className="app">
      <header className="top-bar">
        <div className="logo">Practice</div>

        <div className="profile">
          <span>👤</span>
        </div>
      </header>

      <main className="practice-page">
        <section className="practice-intro">
          <p className="eyebrow">PRACTICE MODE</p>
          <h1>Practice</h1>
          <p>Practice playing notes and improve your accuracy.</p>
        </section>

        <section className="practice-card">
          <div className="practice-instrument">
            <span className="practice-instrument-icon">{instrumentIcon}</span>

            <div>
              <h2>{instrumentName}</h2>
              <p>Beginner Practice</p>
            </div>
          </div>

          <div className="target-note">
            <p className="target-note-label">PLAY THIS NOTE</p>
            <div className="target-note-value">{notes[currentNote]}</div>
            <p className="target-note-description">
              Play the note shown above.
            </p>
          </div>
          <div className="practice-listening">
            <div className="microphone-icon">🎤</div>

            <h3>Ready to Practice?</h3>

            <p>
              Allow microphone access and play the note when you're ready.
            </p>

            <button
              className="start-practice-button"
              onClick={() => {
                setIsListening(true);
                setDetectedNote(notes[currentNote]);
              }}
            >
              {isListening ? "Listening..." : "Start Listening"}
            </button>

          </div>

          {isListening && (
            <div className="practice-result">
              <p className="practice-result-label">DETECTED NOTE</p>

              <div className="detected-note">
                {notes[currentNote]}
              </div>

              <p className="practice-feedback">
                {detectedNote === notes[currentNote]
                  ? "Great job! You played the correct note."
                  : "Not quite. Try again!"}
              </p>

            </div>
          )}

          {isListening && (
            <div className="practice-actions">
              <p className="practice-progress">
                Note {currentNote + 1} of {notes.length}
              </p>

              {detectedNote !== notes[currentNote] ? (
                <button
                  className="next-note-button"
                  onClick={() => {
                    setDetectedNote(null);
                    setIsListening(false);
                  }}
                >
                  Try Again
                </button>
              ) : currentNote === notes.length - 1 ? (
                <button className="next-note-button"
                  onClick={() => {
                    setCurrentNote(0);
                    setDetectedNote(null);
                    setIsListening(false);
                  }}
                >
                  Practice Again
                </button>
              ) : (
                <button
                  className="next-note-button"
                  onClick={() => {
                    setCurrentNote(currentNote + 1);
                    setDetectedNote(null);
                    setIsListening(false);
                  }}
                >
                  Next Note
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      <Navbar />
    </div >
  );
}

export default Practice;