import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useInstrument } from "../../context/useInstrument";
import { useProgress } from "../../context/useProgress";
// Same layout as the violin's first-notes lesson, so it shares that stylesheet.
import "../violin/Lesson5-FirstNotes.css";

function FirstSong() {
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
        <div className="logo">Playing Your First Song</div>

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
            LESSON 5 OF 5 • TRUMPET
          </p>

          <h1>Playing Your First Song</h1>

          <p>
            Put your new skills together.
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
          <h2>Let's Play a Song</h2>

          <p>
            Congratulations on making it to your first trumpet song!

            So far, you've learned how to hold your trumpet,
            control your breathing, form a proper embouchure,
            and play different notes using the three valves.

            Now it's time to combine these skills to play
            a simple melody.

            In this lesson, you'll practice playing four
            beginner trumpet notes: C, D, E, and F.
            You'll learn how to transition smoothly between
            these notes while maintaining steady airflow
            and proper finger placement.

            Start by playing each note slowly and clearly.
            Once you feel comfortable, practice connecting
            the notes to create a short musical phrase.

            Remember that playing music takes patience
            and practice. Focus on producing a clear,
            consistent sound rather than playing quickly.
          </p>
        </div>

        <div className="lesson-section">
          <h2>The Notes</h2>

          <p>
            Before playing your first song, let's review
            the four notes you'll be using: C, D, E, and F.

            Each note requires a specific valve combination
            and proper control of your breathing and
            embouchure.

            Review the fingerings below and practice
            playing each note individually before
            combining them into a melody.
          </p>

          <div className="note-grid">
            <div className="note-card">
              <strong>C</strong>
              <span>
                To play a written C, leave all three valves
                open without pressing any of them. Maintain
                steady airflow and a relaxed embouchure
                to produce a clear sound.
              </span>
            </div>

            <div className="note-card">
              <strong>D</strong>
              <span>
                To play a written D, press the first and
                third valves together using your right
                index and ring fingers. Keep your airflow
                steady while producing the note.
              </span>
            </div>

            <div className="note-card">
              <strong>E</strong>
              <span>
                To play a written E, press the first and
                second valves together using your right
                index and middle fingers. Focus on
                producing a smooth, consistent sound.
              </span>
            </div>

            <div className="note-card">
              <strong>F</strong>
              <span>
                To play a written F, press only the first
                valve using your right index finger.
                Maintain a comfortable embouchure and
                steady airflow while playing.
              </span>
            </div>
          </div>
        </div>

        <div className="lesson-section">
          <h2>Remember</h2>

          <p>
            When playing your first song, focus on
            maintaining steady airflow, proper finger
            placement, and a comfortable embouchure.

            Practice each note slowly before connecting
            them into a musical phrase. Make sure to
            press the correct valves and release them
            completely when changing notes.

            Take comfortable breaths between phrases
            and avoid rushing through the melody.

            Remember that accuracy and a clear sound
            are more important than speed. With regular
            practice, transitioning between notes
            will become easier and more natural.
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

        <h2>Practice the Song, Phrase by Phrase</h2>

        <p>
          Now that you've reviewed the notes C, D, E, and F,
          it's time to practice putting them together.

          Start by holding your trumpet comfortably and
          taking a steady breath. Remember to keep your
          shoulders relaxed and your fingers positioned
          correctly on the valves.

          First, practice playing C followed by D.
          Play each note slowly, focusing on a smooth
          transition between the two notes.

          Next, practice playing E followed by F.
          Pay attention to your valve combinations
          and maintain steady airflow as you switch
          between notes.

          Once you feel comfortable with both pairs,
          try combining them into one short melody:
          C, D, E, F.

          Begin at a slow tempo and gradually increase
          your speed as your confidence improves.
          Take breaks whenever needed and focus on
          playing each note clearly.
        </p>

        <div className="practice-note">
          C
        </div>

        <div className="practice-tip">
          💡 Practice each pair of notes separately
          before playing the entire melody.

          Remember to use the correct valve combinations:
          C uses no valves, D uses valves 1 and 3,
          E uses valves 1 and 2, and F uses valve 1.

          Focus on smooth transitions, steady breathing,
          and a clear sound. Don't worry about playing
          quickly until you feel comfortable with
          each note.
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

        <h2>Play the Full Song</h2>

        <p>
          Congratulations! You've reached the final challenge
          of your beginner trumpet lessons.

          Now it's time to put everything you've learned
          together by playing a short four-note melody:
          C, D, E, and F.

          Start by sitting or standing upright with
          relaxed shoulders. Hold your trumpet comfortably
          and take a steady breath before playing.

          Follow the note sequence shown below:

          C: No valves pressed.
          D: Press valves 1 and 3.
          E: Press valves 1 and 2.
          F: Press valve 1.

          Play each note slowly and clearly, focusing
          on smooth transitions between valve combinations.
          Maintain steady airflow and a comfortable
          embouchure throughout the melody.

          Once you can play the sequence comfortably,
          try repeating it without stopping between notes.

          Remember that accuracy and consistency are
          more important than speed. Take your time
          and enjoy playing your first trumpet melody!
        </p>

        <div className="play-sequence">
          <span>C</span>
          <span>→</span>
          <span>D</span>
          <span>→</span>
          <span>E</span>
          <span>→</span>
          <span>F</span>
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

export default FirstSong;
