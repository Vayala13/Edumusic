import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useInstrument } from "../../context/useInstrument";
import { useProgress } from "../../context/useProgress";
import "./Lesson1-GettingStarted.css";

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
          <span>🎻</span>
        </div>
      </header>

      <main className="lesson-page">

        <Link to="/lessons" className="back-link">
          ← Back to Lessons
        </Link>

        <section className="lesson-header">
          <p className="eyebrow">
            LESSON 1 OF 5 • VIOLIN
          </p>

          <h1>Getting Started</h1>

          <p>
            Meet your violin and learn the basics.
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
          <span>🎻</span>
        </div>

        <div className="lesson-section">

          <h2>Meet Your Violin</h2>

          <p>
            The violin is a four-string instrument played
            with a bow. Before you begin playing, it's
            important to become familiar with the instrument.
            (ADD PICTURE OF VIOLIN AND ITS PARTS LATER as well as pictures for the below parts)
          </p>

        </div>

        <div className="lesson-section">

          <h2>The Main Parts</h2>

          <div className="parts-grid">

            <div className="part-card">
              <strong>🎻</strong>
              <span>Body</span>
            </div>

            <div className="part-card">
              <strong>🎼</strong>
              <span>Strings</span>
            </div>

            <div className="part-card">
              <strong>🏹</strong>
              <span>Bow</span>
            </div>

            <div className="part-card">
              <strong>🎵</strong>
              <span>Bridge</span>
            </div>

          </div>

        </div>

        <div className="lesson-section">

          <h2>Remember</h2>

          <p>
            Hold the violin comfortably and keep your
            posture relaxed. We'll learn proper playing
            technique in the lessons ahead.
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

        <h2>Hold Your Violin</h2>

        <p>
          Practice holding your violin in a comfortable
          position. Keep your shoulders relaxed and your
          head balanced naturally.
          (SHOW PICTURE ON HOW TO HOLD VIOLIN CORRECTLY,BOWHOLD)
        </p>

        <div className="practice-note">
          🎻
        </div>

        <div className="practice-tip">
          💡 Keep your posture relaxed.
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
          Check that you're holding your violin comfortably
          and that you're ready for your first playing lesson.
          (Maybe make them show bowhold to camera, or just let them press continue)
        </p>

        <div className="play-status">
          🎻 Violin ready
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