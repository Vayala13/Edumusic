import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useInstrument } from "../../context/useInstrument";
import { useProgress } from "../../context/useProgress";
import "./Lesson3-OpenStrings.css";

function OpenStrings() {
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
        <div className="logo">Open Strings</div>

        <div className="profile">
          <span>🎻</span>
        </div>
      </header>

      <main className="lesson-page">
        <Link to="/lessons" className="back-link">
          ← Back to Lessons
        </Link>

        <section className="lesson-header">
          <p className="eyebrow">LESSON 3 OF 5 • VIOLIN</p>
          <h1>Open Strings</h1>
          <p>Learn the four open strings of the violin.</p>
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
          <span>🎻</span>
        </div>

        <div className="lesson-section">
          <h2>The Four Strings</h2>

          <p>
            The violin has four strings. From lowest to highest, they are:
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
          <h2>Remember</h2>

          <p>
            The strings go from <strong>G → D → A → E</strong>,
            from lowest pitch to highest pitch.
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

        <h2>Play G</h2>

        <p>
          Practice playing the G string. Listen to the example,
          then try playing it yourself.
        </p>

        <div className="practice-note">G</div>

        <button className="listen-button">
          🔊 Listen to G
        </button>
      </section>

      <div className="lesson-next">
        <button onClick={onNext}>Next →</button>
      </div>
    </>
  );
}

function PlaySection({onComplete}) {
  return (
    <>
      <section className="play-card">
        <p className="eyebrow">PLAY</p>

        <h2>Play All Four Strings</h2>

        <p>
          Play each string one at a time in this order:
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

export default OpenStrings;