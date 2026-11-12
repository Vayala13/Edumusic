import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useInstrument } from "../../context/useInstrument";
import { useProgress } from "../../context/useProgress";
// Same layout as the violin's basic-bowing lesson, so it shares that stylesheet.
import "../violin/Lesson4-BasicBowing.css";

function BasicFingering() {
  const [mode, setMode] = useState("learn");

  const { instrument } = useInstrument();
  const { completeLesson } = useProgress();
  const navigate = useNavigate();

  const handleComplete = () => {
    completeLesson(instrument, 4);
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
        <div className="logo">Basic Fingering</div>

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
            LESSON 4 OF 5 • TRUMPET
          </p>

          <h1>Basic Fingering</h1>

          <p>
            Learn the three trumpet valves.
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
          <span>🔘</span>
        </div>

        <div className="lesson-section">
          <h2>Using the Valves</h2>

          <p>
            // .
          </p>
        </div>

        <div className="lesson-section">
          <h2>Valve Basics</h2>

          <div className="bow-parts">
            <div className="bow-card">
              <strong>1</strong>
              <span>// </span>
            </div>

            <div className="bow-card">
              <strong>2</strong>
              <span>//  </span>
            </div>

            <div className="bow-card">
              <strong>3</strong>
              <span>// </span>
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h2>Remember</h2>

          <p>
            //.
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

        <h2>Practice Valve Combinations</h2>

        <p>
          // .
        </p>

        <div className="practice-note">
          🔘
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

        <h2>Play With Valves</h2>

        <p>
          // .
        </p>

        <div className="play-note">
          C
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

export default BasicFingering;
