import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useInstrument } from "../../context/useInstrument";
import { useProgress } from "../../context/useProgress";
// Same layout as the violin's tuning lesson, so it shares that stylesheet.
import "../violin/Lesson2-Tuning.css";

function Breathing() {
  const [mode, setMode] = useState("learn");

  const { instrument } = useInstrument();
  const { completeLesson } = useProgress();
  const navigate = useNavigate();

  const handleComplete = () => {
    completeLesson(instrument, 2);
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
        <div className="logo">Breathing & Embouchure</div>

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
            LESSON 2 OF 5 • TRUMPET
          </p>

          <h1>Breathing & Embouchure</h1>

          <p>
            Learn proper breathing and lip position.
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
          <h2>Why Breathing Matters</h2>

          <p>
            // .
          </p>
        </div>

        <div className="lesson-section">
          <h2>What Is an Embouchure?</h2>

          <p>
            // 
          </p>

          <div className="tuning-controls-grid">
            <div className="tuning-control-card">
              <h3>Breath Support</h3>
              <p>
                // .
              </p>
            </div>

            <div className="tuning-control-card">
              <h3>Lip Buzz</h3>
              <p>
                // .
              </p>
            </div>
          </div>

          <div className="practice-tip">
            💡 // .
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

        <h2>Practice Buzzing</h2>

        <p>
          // .
        </p>

        <div className="practice-note">
          🎺
        </div>

        <div className="practice-tip">
          💡 // .
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

        <h2>Ready to Play?</h2>

        <p>
          // .
        </p>

        <div className="play-status">
          🎺 Trumpet ready
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

export default Breathing;