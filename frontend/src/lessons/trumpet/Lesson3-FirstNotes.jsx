import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useInstrument } from "../../context/useInstrument";
import { useProgress } from "../../context/useProgress";
// Same layout as the violin's open-strings lesson, so it shares that stylesheet.
import "../violin/Lesson3-OpenStrings.css";

function FirstNotes() {
  const [mode, setMode] = useState("learn");
  const { instrument } = useInstrument();
  const { completeLesson } = useProgress();
  const navigate = useNavigate();

  const handleComplete = () => {
    completeLesson(instrument, 3);
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
        <div className="logo">Your First Notes</div>

        <div className="profile">
          <span>🎺</span>
        </div>
      </header>

      <main className="lesson-page">
        <Link to="/lessons" className="back-link">
          ← Back to Lessons
        </Link>

        <section className="lesson-header">
          <p className="eyebrow">LESSON 3 OF 5 • TRUMPET</p>
          <h1>Your First Notes</h1>
          <p>Learn your first trumpet notes.</p>
        </section>

        <div className="lesson-modes">
          <button
            className={mode === "learn" ? "mode-button active" : "mode-button"}
            onClick={() => setMode("learn")}
          >
            Learn
          </button>

          <button
            className={mode === "practice" ? "mode-button active" : "mode-button"}
            onClick={() => setMode("practice")}
          >
            Practice
          </button>

          <button
            className={mode === "play" ? "mode-button active" : "mode-button"}
            onClick={() => setMode("play")}
          >
            Play
          </button>
        </div>

        {mode === "learn" && <LearnSection onNext={nextMode} />}
        {mode === "practice" && <PracticeSection onNext={nextMode} />}
        {mode === "play" && <PlaySection onComplete={handleComplete} />}
      </main>

      <Navbar />
    </div>
  );
}

function LearnSection({ onNext }) {
  return (
    <>
      <section className="lesson-content">
        <div className="violin-display">
          <span>🎺</span>
        </div>

        <div className="lesson-section">
          <h2>Your First Notes</h2>

          <p>
            //.
          </p>

          <div className="string-grid">
            <div className="string-card">
              <strong>C</strong>
            </div>

            <div className="string-card">
              <strong>D</strong>
            </div>

            <div className="string-card">
              <strong>E</strong>
            </div>

            <div className="string-card">
              <strong>F</strong>
            </div>

            <div className="string-card">
              <strong>G</strong>
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h2>Remember</h2>

          <p>
            // .
          </p>
        </div>
      </section>

      <div className="lesson-next">
        <button onClick={onNext}>Next →</button>
      </div>
    </>
  );
}

function PracticeSection({ onNext }) {
  return (
    <>
      <section className="practice-card">
        <p className="eyebrow">PRACTICE</p>

        <h2>Play C</h2>

        <p>
          //.
        </p>

        <div className="practice-note">C</div>

        <button className="listen-button">
          🔊 Listen to C
        </button>
      </section>

      <div className="lesson-next">
        <button onClick={onNext}>Next →</button>
      </div>
    </>
  );
}

function PlaySection({ onComplete }) {
  return (
    <>
      <section className="play-card">
        <p className="eyebrow">PLAY</p>

        <h2>Play Your First Notes</h2>

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
          <span>→</span>
          <span>G</span>
        </div>

        <div className="play-status">
          🎤 Listening for your notes...
        </div>
      </section>

      <div className="lesson-completion">
        <p>Ready to complete the lesson?</p>

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

export default FirstNotes;
