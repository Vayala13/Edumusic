import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useInstrument } from "../../context/useInstrument";
import { useProgress } from "../../context/useProgress";
// Same layout as the violin's first-notes lesson, so it shares that stylesheet.
import "../violin/Lesson5-FirstNotes.css";

function FirstSong() {
  const [mode, setMode] = useState("learn");

  const { instrument } = useInstrument();
  const { completeLesson } = useProgress();
  const navigate = useNavigate();

  const handleComplete = () => {
    completeLesson(instrument, 5);
    navigate("/lessons");
  };

  const nextMode = () => {
    if (mode === "learn") {
      setMode("practice");
    } else if (mode === "practice") {
      setMode("play");
    }
  };

  return (
    <div className="app">
      <header className="top-bar">
        <div className="logo">Playing Your First Song</div>

        <div className="profile">
          <span>🎺</span>
        </div>
      </header>

      <main className="lesson-page">
        <Link to="/lessons" className="back-link">
          ← Back to Lessons
        </Link>

        <section className="lesson-header">
          <p className="eyebrow">
            LESSON 5 OF 5 • TRUMPET
          </p>

          <h1>Playing Your First Song</h1>

          <p>
            Put your new skills together.
          </p>
        </section>

        <div className="lesson-modes">
          <button
            className={
              mode === "learn"
                ? "mode-button active"
                : "mode-button"
            }
            onClick={() => setMode("learn")}
          >
            Learn
          </button>

          <button
            className={
              mode === "practice"
                ? "mode-button active"
                : "mode-button"
            }
            onClick={() => setMode("practice")}
          >
            Practice
          </button>

          <button
            className={
              mode === "play"
                ? "mode-button active"
                : "mode-button"
            }
            onClick={() => setMode("play")}
          >
            Play
          </button>
        </div>

        {mode === "learn" && (
          <LearnSection onNext={nextMode} />
        )}

        {mode === "practice" && (
          <PracticeSection onNext={nextMode} />
        )}

        {mode === "play" && (
          <PlaySection onComplete={handleComplete} />
        )}
      </main>

      <Navbar />
    </div>
  );
}

function LearnSection({ onNext }) {
  return (
    <>
      <section className="lesson-content">
        <div className="instrument-display">
          <span>🎺</span>
        </div>

        <div className="lesson-section">
          <h2>Let's Play a Song</h2>

          <p>
            // .
          </p>
        </div>

        <div className="lesson-section">
          <h2>The Notes</h2>

          <p>
            //
          </p>

          <div className="note-grid">
            <div className="note-card">
              <strong>C</strong>
              <span>// </span>
            </div>

            <div className="note-card">
              <strong>D</strong>
              <span>// </span>
            </div>

            <div className="note-card">
              <strong>E</strong>
              <span>// </span>
            </div>

            <div className="note-card">
              <strong>F</strong>
              <span>// </span>
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h2>Remember</h2>

          <p>
            //
          </p>
        </div>
      </section>

      <div className="lesson-next">
        <button onClick={onNext}>
          Next →
        </button>
      </div>
    </>
  );
}

function PracticeSection({ onNext }) {
  return (
    <>
      <section className="practice-card">
        <p className="eyebrow">PRACTICE</p>

        <h2>Practice the Song, Phrase by Phrase</h2>

        <p>
          //
        </p>

        <div className="practice-note">
          C
        </div>

        <div className="practice-tip">
          💡 //.
        </div>
      </section>

      <div className="lesson-next">
        <button onClick={onNext}>
          Next →
        </button>
      </div>
    </>
  );
}

function PlaySection({ onComplete }) {
  return (
    <>
      <section className="play-card">
        <p className="eyebrow">PLAY</p>

        <h2>Play the Full Song</h2>

        <p>
          // .
        </p>

        <div className="play-sequence">
          <span>C</span>
          <span>→</span>
          <span>D</span>
          <span>→</span>
          <span>E</span>
          <span>→</span>
          <span>F</span>
        </div>

        <div className="play-status">
          🎤 Listening for your notes...
        </div>
      </section>

      <div className="lesson-completion">
        <p>
          Ready to complete the lesson?
        </p>

        <button
          className="complete-button"
          onClick={onComplete}
        >
          Complete Lesson →
        </button>
      </div>
    </>
  );
}

export default FirstSong;
