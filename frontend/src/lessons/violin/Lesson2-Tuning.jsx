import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useInstrument } from "../../context/InstrumentContext";
import { useProgress } from "../../context/ProgressContext";
import "./Lesson2-Tuning.css";

function Tuning() {
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
        <div className="logo">Tuning Your Violin</div>

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
            LESSON 2 OF 5 • VIOLIN
          </p>

          <h1>Tuning Your Violin</h1>

          <p>
            Learn how to tune each string.
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
          <h2>Why Tune Your Violin?</h2>

          <p>
            Tuning makes sure each string produces the
            correct pitch. A properly tuned violin will
            sound better and make learning much easier. 
          </p>
        </div>

        <div className="lesson-section">
          <h2>Pegs and fine tuners</h2>

          <p>
            All violins have 4 pegs, one for each string near the top of the violin.
            Some have fine tuners which are used when you need very small pitch adjustments.(Show Pegs and fine tuner pics)
          </p>
        </div>

        <div className="lesson-section">
          <h2>The Four Strings</h2>

          <p>
            Your violin has four strings. From lowest to
            highest, they are:
          </p>

          <div className="string-grid">
            <div className="string-card">
              <strong>G</strong>
              <span>Lowest</span>
            </div>

            <div className="string-card">
              <strong>D</strong>
            </div>

            <div className="string-card">
              <strong>A</strong>
            </div>

            <div className="string-card">
              <strong>E</strong>
              <span>Highest</span>
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h2>Tuning Order</h2>

          <p>
            Tune each string carefully, starting with the
            lowest string and working your way up:
          </p>

          <div className="tuning-order">
            <span>G</span>
            <span>→</span>
            <span>D</span>
            <span>→</span>
            <span>A</span>
            <span>→</span>
            <span>E</span>
          </div>
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

        <h2>Tune the G String</h2>

        <p>
          Start with the G string. Listen to the reference
          pitch and practice adjusting your string until
          it matches.(IMplement tuner)
        </p>

        <div className="practice-note">
          G
        </div>

        <button className="listen-button">
          🔊 Listen to G
        </button>

        <div className="practice-tip">
          💡 Turn the tuning peg slowly. Small adjustments
          can make a big difference.
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

        <h2>Check Your Tuning</h2>

        <p>
          Play each of the four strings and make sure
          they are in tune.
        </p>

        <div className="play-sequence">
          <span>G</span>
          <span>→</span>
          <span>D</span>
          <span>→</span>
          <span>A</span>
          <span>→</span>
          <span>E</span>
        </div>

        <div className="play-status">
          🎤 Listening for your strings...
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

export default Tuning;