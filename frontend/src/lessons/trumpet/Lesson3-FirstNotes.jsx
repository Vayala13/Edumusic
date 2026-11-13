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
            Now that you've learned how to breathe properly and
            create a steady sound, it's time to learn your first
            trumpet notes!

            The trumpet produces different notes by changing
            the combination of valves you press and adjusting
            the speed of your air and the vibration of your lips.

            In this lesson, you'll be introduced to five
            beginner trumpet notes: C, D, E, F, and G.
            These notes will help you develop your playing
            technique and prepare you for simple melodies.

            Remember that the trumpet is a B-flat instrument,
            so the notes you read in trumpet music sound
            differently from concert-pitch instruments.
            For now, we'll focus on written trumpet notes.
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
            When playing trumpet notes, focus on maintaining
            steady airflow and a comfortable embouchure.

            Each note requires the correct valve combination
            along with proper lip control. Some notes may
            use the same valve combination but produce
            different pitches depending on how your lips
            vibrate.

            Start slowly and focus on producing a clear,
            consistent sound before moving to higher notes.
            Take breaks whenever your lips feel tired,
            and remember that developing good technique
            takes practice.
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
          Let's practice playing your first note: C!

          Start by sitting or standing upright with relaxed
          shoulders. Hold your trumpet comfortably and
          position the mouthpiece gently against your lips.

          To play a written C on a B-flat trumpet, leave
          all three valves open without pressing any
          of them.

          Take a comfortable breath and blow steady air
          through the mouthpiece while allowing your
          lips to vibrate.

          Try to produce a clear, steady C for 3 to 5
          seconds. If you hear a different pitch,
          gently adjust your airflow and embouchure
          rather than pressing harder against your lips.

          Repeat the exercise a few times, taking
          short breaks between attempts.
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
          Now it's time to put your new skills into practice!

          In this exercise, you'll practice playing five
          trumpet notes in order: C, D, E, F, and G.

          Start by holding your trumpet comfortably and
          taking a steady breath. Play each note slowly,
          focusing on producing a clear and consistent sound.

          Use the following valve combinations for
          written notes on a B-flat trumpet:

          C: No valves pressed.
          D: First and third valves pressed.
          E: First and second valves pressed.
          F: First valve pressed.
          G: No valves pressed.

          Remember that C and G use the same valve
          combination but require different lip vibrations
          to produce different pitches.

          Practice transitioning between each note
          without rushing. Take a breath whenever needed
          and repeat the sequence until you feel comfortable.
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
