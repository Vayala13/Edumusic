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
            The trumpet has three valves that help you play
            different musical notes. Each valve changes the
            length of the tubing that air travels through,
            allowing you to produce different pitches.

            The valves are numbered 1, 2, and 3, starting
            with the valve closest to the mouthpiece.
            When holding your trumpet, place your right-hand
            index finger on the first valve, middle finger
            on the second valve, and ring finger on the
            third valve.

            To play different notes, press the valves
            individually or in combinations. Make sure
            to press each valve all the way down and
            release it completely when finished.

            Remember that valves work together with
            your breathing and embouchure to produce
            the correct notes. Practice pressing the
            valves smoothly while keeping your fingers
            relaxed.
          </p>
        </div>

        <div className="lesson-section">
          <h2>Valve Basics</h2>

          <div className="bow-parts">
            <div className="bow-card">
              <strong>1</strong>
              <span>
                The first valve is closest to the mouthpiece
                and is pressed using your right index finger.
                Pressing this valve lowers the pitch by
                approximately two semitones (one whole step).
              </span>
            </div>

            <div className="bow-card">
              <strong>2</strong>
              <span>
                The second valve is in the middle and is
                pressed using your right middle finger.
                Pressing this valve lowers the pitch by
                approximately one semitone (one half step).
              </span>
            </div>

            <div className="bow-card">
              <strong>3</strong>
              <span>
                The third valve is closest to the bell
                and is pressed using your right ring finger.
                Pressing this valve lowers the pitch by
                approximately three semitones (one and
                a half steps).
              </span>
            </div>
          </div>
        </div>


          <div className="lesson-section">
            <h2>Remember</h2>

            <p>
              Proper finger placement is important when learning
              to play the trumpet. Use your right index, middle,
              and ring fingers to press the first, second, and
              third valves.

              Keep your fingers relaxed and slightly curved,
              pressing each valve straight down and releasing
              it completely. Avoid using unnecessary force
              or lifting your fingers too far from the valves.

              Remember that different valve combinations,
              along with your breathing and embouchure,
              allow you to produce different musical notes.

              Practice slowly and focus on smooth, accurate
              finger movements before increasing your speed.
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
          Now that you've learned how the three trumpet
          valves work, it's time to practice using
          different valve combinations.

          Start by holding your trumpet comfortably
          with your right index, middle, and ring
          fingers resting on the three valves.

          Practice pressing the following combinations:

          1. Open: No valves pressed.
          2. First valve: Press valve 1.
          3. Second valve: Press valve 2.
          4. Third valve: Press valve 3.
          5. First and second: Press valves 1 and 2.
          6. First and third: Press valves 1 and 3.
          7. Second and third: Press valves 2 and 3.
          8. All three: Press valves 1, 2, and 3.

          Begin by practicing these combinations
          without blowing into the trumpet. Press
          each valve smoothly and release it
          completely before moving to the next
          combination.

          Once you feel comfortable, try playing
          familiar notes using the correct valve
          combinations while maintaining steady airflow.
        </p>

        <div className="practice-note">
          🔘
        </div>

        <div className="practice-tip">
          💡 Keep your fingers relaxed and close to the
          valves while practicing. Press each valve
          straight down and avoid using excessive force.

          Start slowly and focus on accuracy rather
          than speed. As you become more comfortable,
          gradually increase the speed of your
          finger movements.
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
          Now it's time to put your valve skills into practice!

          In this exercise, you'll practice playing different
          trumpet notes while using the correct valve combinations.

          Start by holding your trumpet comfortably with
          your fingers resting on the three valves.
          Take a comfortable breath and maintain a
          steady airflow as you play.

          Begin by playing a written C with no valves pressed.
          Hold the note for a few seconds while focusing
          on producing a clear and consistent sound.

          Next, practice playing D by pressing valves
          1 and 3, E by pressing valves 1 and 2,
          F by pressing valve 1, and G with no valves pressed.

          Focus on switching smoothly between valve
          combinations without rushing. Remember that
          your breathing and embouchure also help
          determine the pitch of each note.

          Repeat the exercise until you feel comfortable
          moving between the notes.
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
