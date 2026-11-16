import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useInstrument } from "../../context/useInstrument";
import { useProgress } from "../../context/useProgress";
// Same layout as the violin's first lesson, so it shares that stylesheet.
import "../violin/Lesson1-GettingStarted.css";

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
          <span>🎺</span>
        </div>
      </header>

      <main className="lesson-page">
        <Link to="/lessons" className="back-link">
          ← Back to Lessons
        </Link>

        <section className="lesson-header">
          <p className="eyebrow">LESSON 1 OF 5 • TRUMPET</p>
          <h1>Getting Started</h1>
          <p>Meet your trumpet and learn the basics.</p>
        </section>

        <div className="lesson-modes">
          {["learn", "practice", "play"].map((item) => (
            <button
              key={item}
              className={
                mode === item
                  ? "mode-button active"
                  : "mode-button"
              }
              onClick={() => setMode(item)}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>

        {mode === "learn" && <LearnSection onNext={nextMode} />}
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

  const parts = [
    {
      name: "Mouthpiece",
      icon: "",
      description:
        "The small removable piece your lips buzz into. It sits in the leadpipe at the top of the trumpet.",
    },
    {
      name: "Valves",
      icon: "",
      description:
        "The three buttons on top of the trumpet. Pressing them in different combinations changes which note you play.",
    },
    {
      name: "Valve Casings",
      icon: "",
      description:
        "The tube housings the valves sit inside. Your left hand wraps around these to hold the trumpet's weight.",
    },
    {
      name: "Tuning Slide",
      icon: "",
      description:
        "The U-shaped slide you pull in or out to adjust the trumpet's overall pitch.",
    },
    {
      name: "Water Key",
      icon: "",
      description:
        "The small lever near the bottom of the trumpet used to empty condensation ('spit') from the tubing.",
    },
    {
      name: "Leadpipe",
      icon: "",
      description:
        "The tube leading from the mouthpiece into the body of the trumpet.",
    },
    {
      name: "Finger Hook",
      icon: "",
      description:
        "The small hook near the third valve where your right pinky can rest — but stays out of the way while playing.",
    },
    {
      name: "Bell",
      icon: "",
      description:
        "The flared opening at the end of the trumpet where the sound projects out.",
    },
  ];

  return (
    <>
      <section className="lesson-content">
        <div className="instrument-display">
          <span>🎺</span>
        </div>

        <div className="lesson-section">
          <h2>Meet Your Trumpet</h2>
          <p>
            Before learning to play, let's get familiar with
            the instrument. Knowing the names of its parts
            will help you understand the instructions in
            this and future lessons.
          </p>
        </div>

        <div className="lesson-section">
          <h2>Explore the Parts</h2>
          <p>
            Read each description and try to locate the part
            on your own trumpet.
          </p>

          <div className="parts-grid">
            {parts.map((part) => (
              <div className="part-card" key={part.name}>
                <strong>{part.icon}</strong>
                <span>{part.name}</span>
                <p>{part.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lesson-section">
          <h2>How to Hold Your Trumpet</h2>
          <p>
            Now that you know the parts, let's use that
            knowledge to position the instrument.
          </p>

          <div className="lesson-section">
            <h3>1. Relax Your Posture</h3>
            <p>
              Stand or sit upright, keeping your shoulders
              relaxed and your head in a natural position.
            </p>
          </div>

          <div className="lesson-section">
            <h3>2. Support With Your Left Hand</h3>
            <p>
              Wrap your left hand around the valve casings to
              hold the trumpet's weight.
            </p>
          </div>

          <div className="lesson-section">
            <h3>3. Rest Your Right-Hand Fingertips</h3>
            <p>
              Rest the fingertips of your right hand on top of
              the three valves, with your thumb tucked under
              the leadpipe between the first and second valves.
            </p>
          </div>

          <div className="lesson-section">
            <h3>4. Keep the Bell Level</h3>
            <p>
              Hold the trumpet level, with the bell pointing
              forward, not tilted up or down.
            </p>
          </div>
        </div>

        <div className="lesson-section">
          <h2>Remember</h2>
          <p>
            Your trumpet should feel balanced and comfortable.
            Keep your right pinky out of the finger hook so
            your fingers stay free to press the valves.
            We'll learn breathing and how to buzz your lips
            in the next lesson.
          </p>
        </div>
      </section>

      <div className="lesson-next">
        <button onClick={onNext}>Practice Your Hold →</button>
      </div>
    </>
  );
}



function PracticeSection({ onNext }) {
  const parts = [
    ["Mouthpiece", "Where your lips buzz to make a sound"],
    ["Valves", "The three buttons on top"],
    ["Valve Casings", "The tubes the valves sit inside"],
    ["Tuning Slide", "The U-shaped slide for pitch adjustment"],
    ["Water Key", "Empties condensation from the tubing"],
    ["Leadpipe", "Connects the mouthpiece to the body"],
    ["Finger Hook", "Where your right pinky can rest"],
    ["Bell", "Where the sound projects out"],
  ];

  const [identified, setIdentified] = useState([]);
  const [steps, setSteps] = useState([false, false, false, false]);

  const holdingSteps = [
    "Relax my shoulders and stand or sit upright.",
    "Wrap my left hand around the valve casings.",
    "Rest my right-hand fingertips on top of the valves.",
    "Keep the bell level and pointing forward.",
  ];

  return (
    <>
      <section className="practice-card">
        <p className="eyebrow">PARTS PRACTICE</p>
        <h2>Find the Parts</h2>
        <p>
          Look at your trumpet and tap each item after you
          find it. If you don't have your instrument nearby,
          use this as a review exercise.
        </p>

        <div className="parts-grid">
          {parts.map(([name, description]) => (
            <button
              key={name}
              type="button"
              className="part-card"
              aria-pressed={identified.includes(name)}
              onClick={() =>
                setIdentified((current) =>
                  current.includes(name)
                    ? current.filter((item) => item !== name)
                    : [...current, name]
                )
              }
            >
              <strong>
                {identified.includes(name) ? "✓" : "🎺"}
              </strong>
              <span>{name}</span>
              <p>{description}</p>
            </button>
          ))}
        </div>

        <p className="practice-tip">
          {identified.length} of {parts.length} parts identified
        </p>
      </section>

      <section className="practice-card">
        <p className="eyebrow">HOLDING PRACTICE</p>
        <h2>Build a Comfortable Position</h2>
        <p>
          Use what you learned about the trumpet's parts to
          position it correctly.
        </p>

        <div className="play-checklist">
          {holdingSteps.map((step, index) => (
            <label key={step} className="play-task">
              <input
                type="checkbox"
                checked={steps[index]}
                onChange={() =>
                  setSteps((current) =>
                    current.map((checked, i) =>
                      i === index ? !checked : checked
                    )
                  )
                }
              />
              <span>{step}</span>
            </label>
          ))}
        </div>

        <p className="practice-tip holding-practice-tip">
          💡 Keep your right pinky out of the finger hook, so
          your fingers stay free to press the valves.
        </p>
      </section>

      <div className="lesson-next">
        <button onClick={onNext}>Try the Challenge →</button>
      </div>
    </>
  );
}


function PlaySection({ onComplete }) {
  const [checks, setChecks] = useState([false, false, false]);

  const tasks = [
    "I can identify the trumpet's valves and mouthpiece.",
    "I can point out the bell and tuning slide.",
    "I can hold the trumpet comfortably without tensing up.",
  ];

  const allComplete = checks.every(Boolean);

  const toggleCheck = (index) => {
    setChecks((current) =>
      current.map((checked, i) =>
        i === index ? !checked : checked
      )
    );
  };

  return (
    <>
      <section className="play-card">
        <p className="eyebrow">YOUR FIRST CHALLENGE</p>
        <h2>Ready, Trumpeter?</h2>
        <p>
          Complete these three tasks to check that you're
          ready to move on to breathing and embouchure.
        </p>

        <div className="play-checklist">
          {tasks.map((task, index) => (
            <label key={task} className="play-task">
              <input
                type="checkbox"
                checked={checks[index]}
                onChange={() => toggleCheck(index)}
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
          {allComplete
            ? "Nice work! You're ready for Lesson 2."
            : "Finish all three tasks to complete this lesson."}
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

export default GettingStarted;