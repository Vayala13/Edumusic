
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useInstrument } from "../../context/useInstrument";
import { useProgress } from "../../context/useProgress";
import bodyImage from "../../assets/images/violin/body.png";
import stringsImage from "../../assets/images/violin/strings.png";
import fingerboardImage from "../../assets/images/violin/fingerboard.png";
import neckImage from "../../assets/images/violin/neck.png";
import scrollPegsImage from "../../assets/images/violin/scroll-pegs.png";
import bridgeImage from "../../assets/images/violin/bridge.png";
import chinrestImage from "../../assets/images/violin/chinrest.png";
import bowImage from "../../assets/images/violin/bow.png";

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
          <p className="eyebrow">LESSON 1 OF 5 • VIOLIN</p>
          <h1>Getting Started</h1>
          <p>Meet your violin and learn the basics.</p>
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
    name: "Body",
    image: bodyImage,
    description:
      "The large wooden section of the violin. It helps make the sound louder.",
  },
  {
    name: "Strings",
    image: stringsImage,
    description:
      "The four strings that vibrate to produce different musical notes.",
  },
  {
    name: "Fingerboard",
    image: fingerboardImage,
    description:
      "The long, dark surface beneath the strings where your fingers press to change notes.",
  },
  {
    name: "Neck",
    image: neckImage,
    description:
      "The narrow section connecting the body to the scroll. Your left hand supports this area.",
  },
  {
    name: "Scroll and tuning pegs",
    image: scrollPegsImage,
    description:
      "The curved end of the violin and the nearby pegs used to adjust string tension.",
  },
  {
    name: "Bridge",
    image: bridgeImage,
    description:
      "The small wooden piece that holds the strings above the body and transfers their vibrations.",
  },
  {
    name: "Chinrest",
    image: chinrestImage,
    description:
      "The piece where your chin rests gently when you hold the violin.",
  },
  {
    name: "Bow",
    image: bowImage,
    description:
      "The long stick with hair that moves across the strings to produce sound.",
  },
];


  return (
    <>
      <section className="lesson-content">
        <div className="instrument-display">
          <span>🎻</span>
        </div>

        <div className="lesson-section">
          <h2>Meet Your Violin</h2>
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
            on your own violin.
          </p>

          <div className="parts-grid">
            {parts.map((part) => (
              <div className="part-card" key={part.name}>
                <img
                  className="part-image"
                  src={part.image}
                  alt={part.name}
                  loading="lazy"
                />
                <span>{part.name}</span>
                <p>{part.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lesson-section">
          <h2>How to Hold Your Violin</h2>
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
            <h3>2. Rest It on Your Left Shoulder</h3>
            <p>
              Place the violin's body on your left shoulder.
              The neck and fingerboard should extend toward
              your left side.
            </p>
          </div>

          <div className="lesson-section">
            <h3>3. Position Your Chin</h3>
            <p>
              Rest your chin gently on the chinrest. Avoid
              clamping down or raising your shoulder to hold
              the instrument.
            </p>
          </div>

          <div className="lesson-section">
            <h3>4. Support the Neck</h3>
            <p>
              Let your left hand support and guide the neck.
              Keep your thumb relaxed and your fingers near
              the fingerboard without squeezing the neck.
            </p>
          </div>
        </div>

        <div className="lesson-section">
          <h2>Remember</h2>
          <p>
            Your violin should feel balanced and comfortable.
            If your neck or shoulder feels strained, stop and
            adjust your position. A teacher can help you
            check your chinrest and shoulder-rest fit.
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
    ["Body", "The large wooden section"],
    ["Strings", "The four strings running along the violin"],
    ["Fingerboard", "The dark surface beneath the strings"],
    ["Neck", "The narrow section below the scroll"],
    ["Tuning pegs", "The pegs near the scroll"],
    ["Bridge", "The small piece beneath the strings"],
    ["Chinrest", "Where your chin rests"],
    ["Bow", "The tool used to play the strings"],
  ];

  const [identified, setIdentified] = useState([]);
  const [steps, setSteps] = useState([false, false, false, false]);

  const holdingSteps = [
    "Relax my shoulders and stand or sit upright.",
    "Rest the violin body on my left shoulder.",
    "Rest my chin gently on the chinrest.",
    "Support the neck with my relaxed left hand.",
  ];

  return (
    <>
      <section className="practice-card">
        <p className="eyebrow">PARTS PRACTICE</p>
        <h2>Find the Parts</h2>
        <p>
          Look at your violin and tap each item after you
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
                {identified.includes(name) ? "✓" : "🎻"}
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
          Use what you learned about the violin's parts to
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
          💡 Never force your chin, neck, or shoulder into an
          uncomfortable position.
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
    "I can identify the violin's body and strings.",
    "I can point out the bow and bridge.",
    "I can hold the violin comfortably without tensing up.",
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
        <h2>Ready, Violinist?</h2>
        <p>
          Complete these three tasks to check that you're
          ready to move on to tuning your violin.
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
