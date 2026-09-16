import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useInstrument } from "../../context/InstrumentContext";
import { useProgress } from "../../context/ProgressContext";
import "./Lesson5-FirstNotes.css";

function FirstNotes() {
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
        <div className="logo">Your First Notes</div>

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
            LESSON 5 OF 5 • VIOLIN
          </p>

          <h1>Your First Notes</h1>

          <p>
            Play your first notes on the violin.
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
          <h2>Let's Play Some Notes</h2>

          <p>
            Now that you know the basics of your violin,
            it's time to play your first notes. We'll start
            with simple notes using the strings you've
            already learned.
          </p>
        </div>

        <div className="lesson-section">
          <h2>Your First Notes</h2>

          <p>
            Start with the open strings. Remember the
            order from lowest to highest:
          </p>

          <div className="note-grid">
            <div className="note-card">
              <strong>G</strong>
              <span>Open G</span>
            </div>

            <div className="note-card">
              <strong>D</strong>
              <span>Open D</span>
            </div>

            <div className="note-card">
              <strong>A</strong>
              <span>Open A</span>
            </div>

            <div className="note-card">
              <strong>E</strong>
              <span>Open E</span>
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h2>Remember</h2>

          <p>
            Focus on producing a clear, steady sound.
            Keep your bow relaxed and your posture
            comfortable.
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

        <h2>Practice Your First Note</h2>

        <p>
          Start with the open G string. Place your bow
          on the string and make one slow, smooth stroke.
        </p>

        <div className="practice-note">
          G
        </div>

        <div className="practice-tip">
          💡 Listen for a clear and steady sound.
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

        <h2>Play Your First Notes</h2>

        <p>
          Play each open string one at a time.
          Try to make each note clear and steady.
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

export default FirstNotes;