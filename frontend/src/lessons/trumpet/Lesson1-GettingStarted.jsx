import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useInstrument } from "../../context/useInstrument";
import { useProgress } from "../../context/useProgress";
// Same layout as the violin's first lesson, so it shares that stylesheet.
import "../violin/Lesson1-GettingStarted.css";

function GettingStarted() {
  const [mode, setMode] = useState("learn");

  const { instrument } = useInstrument();
  const { completeLesson } = useProgress();
  const navigate = useNavigate();

  const handleComplete = () => {
    completeLesson(instrument, 1);
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
        <div className="logo">Getting Started</div>

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
            LESSON 1 OF 5 • TRUMPET
          </p>

          <h1>Getting Started</h1>

          <p>
            Meet your trumpet and learn the basics.
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

          <h2>Meet Your Trumpet</h2>

          <p>
            The trumpet is a brass instrument. Its sound
            comes from your lips buzzing into the
            mouthpiece, and the three valves change which
            notes you can play. Before you begin playing,
            it's important to become familiar with the
            instrument.
          </p>

        </div>

        <div className="lesson-section">

          <h2>The Main Parts</h2>

          <div className="parts-grid">

            <div className="part-card">
              <strong>👄</strong>
              <span>Mouthpiece</span>
            </div>

            <div className="part-card">
              <strong>🔘</strong>
              <span>Valves</span>
            </div>

            <div className="part-card">
              <strong>🔁</strong>
              <span>Tuning Slide</span>
            </div>

            <div className="part-card">
              <strong>📯</strong>
              <span>Bell</span>
            </div>

          </div>

        </div>

        <div className="lesson-section">

          <h2>Remember</h2>

          <p>
            Sit or stand tall and keep your shoulders
            relaxed. We'll learn breathing and how to
            buzz your lips in the next lesson.
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

        <h2>Hold Your Trumpet</h2>

        <p>
          Wrap your left hand around the valve casing to
          hold the trumpet's weight. Rest the fingertips of
          your right hand on top of the three valves, with
          your right thumb tucked under the lead pipe
          between the first and second valves.
        </p>

        <div className="practice-note">
          🎺
        </div>

        <div className="practice-tip">
          💡 Keep your right pinky out of the finger hook, so your fingers stay free to press the valves.
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
          Check that you're holding your trumpet comfortably,
          with the bell pointing forward, and that you're
          ready for your first playing lesson.
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

export default GettingStarted;
