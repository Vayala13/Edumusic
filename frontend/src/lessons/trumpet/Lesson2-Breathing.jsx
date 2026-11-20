import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useInstrument } from "../../context/useInstrument";
import { useProgress } from "../../context/useProgress";
// Same layout as the violin's tuning lesson, so it shares that stylesheet.
import "../violin/Lesson2-Tuning.css";

function Breathing() {
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
        <div className="logo">Breathing & Embouchure</div>

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
            LESSON 2 OF 5 • TRUMPET
          </p>

          <h1>Breathing & Embouchure</h1>

          <p>
            Learn proper breathing and lip position.
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
          <h2>Why Breathing Matters</h2>

          <p>
            Breathing is one of the most important parts of playing the
            trumpet. Unlike instruments that use strings, the trumpet
            produces sound when you buzz your lips into the mouthpiece
            while blowing air through the instrument.

            Taking a comfortable, full breath and releasing the air
            steadily helps you produce a clear and consistent sound.
            Good breathing technique also makes it easier to hold
            notes longer without unnecessary tension.
          </p>
        </div>

        <div className="lesson-section">
          <h2>What Is an Embouchure?</h2>

          <p>
            <p>
              An embouchure is the way you position your lips, mouth,
              and facial muscles when playing a brass instrument.
              A proper embouchure helps you create a steady buzz,
              which produces sound through the trumpet.

              To form your embouchure, bring your lips together
              naturally, keeping the corners of your mouth firm
              but relaxed. Place the mouthpiece gently against
              the center of your lips and blow steady air to
              create a vibration.

              Avoid pressing the mouthpiece too hard against
              your lips or tightening your facial muscles.
              With practice, you will learn to produce a
              clear and comfortable sound.
            </p>
          </p>


          <div className="tuning-controls-grid">
            <div className="tuning-control-card">
              <h3>Breath Support</h3>
              <p>
                Breath support means using a steady, controlled flow
                of air while playing the trumpet. Start by standing
                or sitting upright with relaxed shoulders. Take a
                comfortable breath, allowing your abdomen and lower
                ribs to expand naturally.

                As you breathe out, release the air smoothly instead
                of forcing it all out at once. Steady airflow helps
                you maintain a consistent sound and play longer notes.
              </p>
            </div>

            <div className="tuning-control-card">
              <h3>Lip Buzz</h3>
              <p>
                Lip buzzing is the vibration of your lips that
                creates sound when playing the trumpet. Bring
                your lips together naturally and blow air through
                them to create a gentle buzzing sound.

                Once you feel comfortable, try buzzing into the
                trumpet mouthpiece. Keep your lips relaxed and
                avoid pressing the mouthpiece too firmly against
                your face. Focus on producing a steady buzz
                rather than a loud one.
              </p>
            </div>
          </div>

          <div className="practice-tip">
            💡 Start with short buzzing exercises and take breaks
            between attempts. Focus on steady airflow and relaxed
            lips rather than producing a loud sound.
          </div>
        </div>

        <div className="lesson-section">
          <h2>Remember</h2>

          <p>
            Good trumpet playing begins with comfortable breathing
            and a relaxed embouchure. Keep your shoulders relaxed,
            breathe naturally, and release your air steadily.

            Avoid tightening your lips or pressing the mouthpiece
            too hard against your face. If you feel tired or
            uncomfortable, take a short break before continuing.

            Developing proper breathing and embouchure takes time,
            so focus on consistency rather than perfection.
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

        <h2>Practice Buzzing</h2>

        <p>
          Now that you understand breathing and embouchure,
          it's time to practice creating a steady buzz.

          Start by sitting or standing upright with relaxed
          shoulders. Take a comfortable breath and bring
          your lips together naturally.

          Gently blow air through your lips to create a
          buzzing sound. Once you feel comfortable, place
          the trumpet mouthpiece against your lips and
          try buzzing again.

          Practice producing a steady buzz for 3 to 5
          seconds at a time. Take short breaks between
          attempts and avoid forcing the sound.
        </p>

        <div className="practice-note">
          🎺
        </div>

        <div className="practice-tip">
          💡 Focus on producing a smooth, consistent buzz
          rather than a loud sound. Keep your facial muscles
          relaxed and avoid pressing the mouthpiece too
          firmly against your lips. If you cannot produce
          a buzz immediately, don't worry. It takes practice
          to develop control over your airflow and embouchure.
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
          It's time to put your breathing and embouchure
          skills together!

          Begin by sitting or standing upright with
          relaxed shoulders. Take a comfortable breath
          and position your lips naturally against
          the trumpet mouthpiece.

          Blow a steady stream of air through the
          mouthpiece and try to produce a clear,
          consistent sound on your trumpet.

          Try holding the sound for 3 to 5 seconds
          without forcing your breath or tightening
          your lips. Repeat the exercise a few times,
          taking short breaks between attempts.

          Once you can produce a comfortable, steady
          sound, you're ready to move on to your
          first trumpet notes!
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

export default Breathing;