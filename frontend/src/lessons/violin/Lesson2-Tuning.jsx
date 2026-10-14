import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useInstrument } from "../../context/useInstrument";
import { useProgress } from "../../context/useProgress";
import tuningPegsImage from "../../assets/images/violin/Pegs.png";
import fineTunersImage from "../../assets/images/violin/finetuner.png";
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
  const strings = [
    { name: "G", pitch: "Lowest", detail: "The thickest string" },
    { name: "D", pitch: "Low-middle", detail: "The second-lowest string" },
    { name: "A", pitch: "High-middle", detail: "The second-highest string" },
    { name: "E", pitch: "Highest", detail: "The thinnest string" },
  ];

  return (
    <>
      <section className="lesson-content">
        <div className="instrument-display">
          <span>🎻</span>
        </div>

        <div className="lesson-section">
          <h2>Why Tune Your Violin?</h2>
          <p>
            Tuning makes each string produce the correct pitch.
            A well-tuned violin sounds better and makes learning
            music easier.
          </p>
        </div>

        <div className="lesson-section">
          <h2>Know Your Tuning Controls</h2>
          <p>
            Your violin has two types of tuning controls.
            Learn what each one does before making adjustments.
          </p>

          <div className="tuning-controls-grid">
            <div className="tuning-control-card">
              <img
                className="tuning-control-image"
                src={tuningPegsImage}
                alt="Violin tuning pegs near the scroll"
              />
              <h3>Tuning Pegs</h3>
              <p>
                Located near the scroll at the top of the violin.
                They make larger pitch adjustments.
              </p>
              <span className="control-location">
                Turn tuning pegs gently. If a peg feels stiff or a string feels too tight, stop and ask a teacher for help.
              </span>
            </div>

            <div className="tuning-control-card">
              <img
                className="tuning-control-image"
                src={fineTunersImage}
                alt="Fine tuners near the violin tailpiece"
              />
              <h3>Fine Tuners</h3>
              <p>
                Small screws near the bottom. 
                They help make small pitch adjustments.
              </p>
              <span className="control-location">
                Rotating fine tuner clockwise increases pitch,
                counter-clockwise decreases pitch
              </span>
            </div>
          </div>

          <div className="practice-tip">
            💡 When tuning with pegs, never loosen more than one string at a time.
          </div>
        </div>

        <div className="lesson-section">
          <h2>The Four Strings</h2>
          <p>
            From lowest pitch to highest pitch, the strings
            are G, D, A, and E.
          </p>

          <div className="string-grid">
            {strings.map((string) => (
              <div className="string-card" key={string.name}>
                <strong>{string.name}</strong>
                <span>{string.pitch}</span>
                <small>{string.detail}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="lesson-section">
          <h2>Remember the Order</h2>
          <p>
            Say the string names out loud in this order:
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
        <button onClick={onNext}>Practice the Strings →</button>
      </div>
    </>
  );
}

function PracticeSection({ onNext }) {
  const strings = ["G", "D", "A", "E"];
  const [selectedStrings, setSelectedStrings] = useState([]);
  const [controls, setControls] = useState([false, false]);

  const stringOrderCorrect = selectedStrings.every(
    (string, index) => string === strings[index]
  );

  const orderComplete =
    selectedStrings.length === strings.length && stringOrderCorrect;

  const chooseString = (string) => {
    if (selectedStrings.includes(string)) {
      setSelectedStrings((current) =>
        current.filter((item) => item !== string)
      );
      return;
    }

    if (selectedStrings.length < strings.length) {
      setSelectedStrings((current) => [...current, string]);
    }
  };

  const resetOrder = () => setSelectedStrings([]);

  return (
    <>
      <section className="practice-card">
        <p className="eyebrow">STRING PRACTICE</p>
        <h2>Build the String Order</h2>
        <p>
          Tap the strings from lowest pitch to highest pitch.
          Try to remember the order without looking back.
        </p>

        <div className="string-choice-grid">
          {strings.map((string) => (
            <button
              type="button"
              key={string}
              className={
                selectedStrings.includes(string)
                  ? "string-choice selected"
                  : "string-choice"
              }
              aria-pressed={selectedStrings.includes(string)}
              onClick={() => chooseString(string)}
            >
              {string}
            </button>
          ))}
        </div>

        <div className="selected-order">
          <strong>Your order</strong>
          <p>
            {selectedStrings.length
              ? selectedStrings.join(" → ")
              : "Tap G to begin"}
          </p>
        </div>

        {orderComplete && (
          <p className="practice-feedback success">
            ✓ Correct! G → D → A → E
          </p>
        )}

        {selectedStrings.length === 4 && !orderComplete && (
          <p className="practice-feedback">
            Not quite. Reset and try again.
          </p>
        )}

        <button
          type="button"
          className="secondary-button"
          onClick={resetOrder}
        >
          Reset Order
        </button>
      </section>

      <section className="practice-card">
        <p className="eyebrow">TUNING CONTROLS</p>
        <h2>Can You Find Them?</h2>
        <p>
          Look at your violin and check each item after you
          locate it. You can practice this without changing
          the tuning.
        </p>

        <div className="play-checklist">
          {[
            "I can find the tuning pegs near the top of the violin.",
            "I can find the fine tuners near the bottom.",
          ].map((task, index) => (
            <label className="play-task" key={task}>
              <input
                type="checkbox"
                checked={controls[index]}
                onChange={() =>
                  setControls((current) =>
                    current.map((checked, i) =>
                      i === index ? !checked : checked
                    )
                  )
                }
              />
              <span>{task}</span>
            </label>
          ))}
        </div>
{/*
        <p className="practice-tip">
          💡 This activity is for identifying parts. It does not
          measure whether your violin is in tune.
        </p>
         */}
      </section>  

      <div className="lesson-next">
        <button onClick={onNext}>Try the Final Challenge →</button>
      </div>
    </>
  );
}

function PlaySection({ onComplete }) {
  const tasks = [
    "I can name the four strings: G, D, A, and E.",
    "I can put the strings in order from lowest to highest.",
    "I can point to the tuning pegs and explain their purpose.",
    "I understand that fine tuners make small adjustments.",
  ];

  const [checks, setChecks] = useState(tasks.map(() => false));
  const allComplete = checks.every(Boolean);

  return (
    <>
      <section className="play-card">
        <p className="eyebrow">FINAL CHALLENGE</p>
        <h2>Test Your Tuning Knowledge</h2>
        <p>
          Without looking back at the Learn section, complete
          each task to check what you remember.
        </p>

        <div className="play-checklist">
          {tasks.map((task, index) => (
            <label className="play-task" key={task}>
              <input
                type="checkbox"
                checked={checks[index]}
                onChange={() =>
                  setChecks((current) =>
                    current.map((checked, i) =>
                      i === index ? !checked : checked
                    )
                  )
                }
              />
              <span>{task}</span>
            </label>
          ))}
        </div>

        <div className="play-status">
          {allComplete
            ? "✓ Challenge complete!"
            : `${checks.filter(Boolean).length} of ${tasks.length} tasks complete`}
        </div>
      </section>

      <div className="lesson-completion">
        <p>
          Great work! Next, you'll practice playing the four
          open strings.
        </p>

        <button
          className="complete-button"
          onClick={onComplete}
          disabled={!allComplete}
        >
          Complete Lesson →
        </button>
      </div>
    </>
  );
}


export default Tuning;