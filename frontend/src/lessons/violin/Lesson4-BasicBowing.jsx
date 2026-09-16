import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useInstrument } from "../../context/InstrumentContext";
import { useProgress } from "../../context/ProgressContext";
import "./Lesson4-BasicBowing.css";

function BasicBowing() {
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
        <div className="logo">Basic Bowing</div>

        <div className="profile">
          <span>🎻</span>
        </div>
      </header>

      <main className="lesson-page">
        <Link to="/lessons" className="back-link">
          ← Back to Lessons
        </Link>

        <section className="lesson-header">
          <p className="eyebrow">
            LESSON 4 OF 5 • VIOLIN
          </p>

          <h1>Basic Bowing</h1>

          <p>
            Learn how to hold and move the bow.
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
          <span>🏹</span>
        </div>

        <div className="lesson-section">
          <h2>Using the Bow</h2>

          <p>
            The bow is used to create sound by moving it
            across the violin strings. Smooth and controlled
            movements will help you produce a clear sound.(Add another picture of how to hold the bow from different angles)
          </p>
        </div>

        <div className="lesson-section">
          <h2>Bow Basics</h2>

          <div className="bow-parts">
            <div className="bow-card">
              <strong>🤚</strong>
              <span>Relax your hand</span>
            </div>

            <div className="bow-card">
              <strong>🏹</strong>
              <span>Hold the bow gently</span>
            </div>

            <div className="bow-card">
              <strong>↔️</strong>
              <span>Move smoothly</span>
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h2>Remember</h2>

          <p>
            Keep your grip relaxed and let the bow move
            smoothly across the strings. Avoid squeezing
            the bow too tightly.
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

        <h2>Practice Your Bow Hold</h2>

        <p>
          Hold the bow comfortably and practice moving
          your hand and arm slowly. Focus on keeping your
          movement relaxed and controlled.
        </p>

        <div className="practice-note">
          🏹
        </div>

        <div className="practice-tip">
          💡 Keep your wrist relaxed and avoid gripping
          the bow too tightly.
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

        <h2>Play an Open String</h2>

        <p>
          Choose an open string and make a slow,
          controlled bow stroke.(Make them hold a note)
        </p>

        <div className="play-note">
          G
        </div>

        <div className="play-status">
          🎤 Listening for your bow stroke...
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

export default BasicBowing;