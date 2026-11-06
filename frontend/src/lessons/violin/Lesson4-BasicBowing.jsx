import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useInstrument } from "../../context/useInstrument";
import { useProgress } from "../../context/useProgress";
import "./Lesson4-BasicBowing.css";

const BOW_HOLD_STEPS = [
  { id: "relaxed", title: "Relax your hand", detail: "Let your fingers curve naturally and keep your wrist loose." },
  { id: "gentle", title: "Find the frog", detail: "The frog is the thicker end of the bow where your hand holds it." },
  { id: "thumb", title: "Place your thumb", detail: "Bend your thumb gently and rest its tip near the frog, opposite the fingers. Avoid locking it straight." },
  { id: "middle-ring", title: "Add your middle and ring fingers", detail: "Curve these fingers over the stick near the frog. Keep them soft rather than squeezing." },
  { id: "index-pinky", title: "Position your index and little fingers", detail: "Let your index finger curve over the stick. Curve your little finger on top of the stick near the end of the frog." },
  { id: "check", title: "Check the complete bow hold", detail: "Your fingers should be curved, your thumb bent, and your hand relaxed. Ask a teacher to check your grip if it feels uncomfortable." },
];

function BasicBowing() {
  const [mode, setMode] = useState("learn");
  const [checkedSteps, setCheckedSteps] = useState([]);
  const [strokeCount, setStrokeCount] = useState(0);
  const { instrument } = useInstrument();
  const { completeLesson } = useProgress();
  const navigate = useNavigate();

  const handleComplete = () => {
    completeLesson(instrument, 4);
    navigate("/lessons");
  };

  const toggleStep = (id) => {
    setCheckedSteps((previous) =>
      previous.includes(id) ? previous.filter((step) => step !== id) : [...previous, id]
    );
  };

  return (
    <div className="app">
      <header className="top-bar">
        <div className="logo">Basic Bowing</div>
        <div className="profile"><span>🎻</span></div>
      </header>

      <main className="lesson-page">
        <Link to="/lessons" className="back-link">← Back to Lessons</Link>

        <section className="lesson-header">
          <p className="eyebrow">LESSON 4 OF 5 • VIOLIN</p>
          <h1>Basic Bowing</h1>
          <p>Learn a relaxed bow hold, practice the steps, then try a slow open-string bow stroke.</p>
        </section>

        <div className="lesson-modes">
          <button className={mode === "learn" ? "mode-button active" : "mode-button"} onClick={() => setMode("learn")}>Learn</button>
          <button className={mode === "practice" ? "mode-button active" : "mode-button"} onClick={() => setMode("practice")}>Practice</button>
          <button className={mode === "play" ? "mode-button active" : "mode-button"} onClick={() => setMode("play")}>Play</button>
        </div>

        {mode === "learn" && (
          <>
            <section className="lesson-content">
              <div className="instrument-display"><span>🏹</span></div>
              <div className="lesson-section">
                <h2>Using the Bow</h2>
                <p>The bow creates sound when it moves across the violin strings. Smooth, controlled movements help you produce a clear sound.</p>
              </div>
              <div className="lesson-section bow-hold-tutorial">
                <h2>How to Hold the Bow</h2>
                <p>Follow these steps in order.</p>
                <ol className="bow-hold-steps">
                  <li className="bow-hold-step">
                    <div><h3> Relax your hand</h3><p>Shake out your hand, then let your fingers curve naturally. Keep your wrist loose.</p></div>
                  </li>
                  <li className="bow-hold-step">
                    <div><h3> Find the frog</h3><p>Locate the thicker part at the hand end of the bow. This is called the frog.</p></div>
                  </li>
                  <li className="bow-hold-step">
                    <div><h3> Place your thumb</h3><p>Bend your thumb gently and place its tip near the frog, opposite your fingers. Do not lock it straight.</p></div>
                  </li>
                  <li className="bow-hold-step">
                    <div><h3> Add your middle and ring fingers</h3><p>Curve these fingers over the stick near the frog. Keep them relaxed instead of squeezing.</p></div>
                  </li>
                  <li className="bow-hold-step">
                    <div><h3> Position your index and little fingers</h3><p>Curve your index finger over the stick. Let your little finger curve on top of the stick near the frog end.</p></div>
                  </li>
                  <li className="bow-hold-step">
                    <div><h3> Check your complete bow hold</h3><p>Your fingers should be curved, your thumb bent, and your hand relaxed. The bow should feel secure without a tight grip.</p></div>
                  </li>
                </ol>
              </div>
              <div className="lesson-section">
                <h2>Remember</h2>
                <p>Avoid squeezing the bow. If your hand or thumb feels tense or uncomfortable, pause and reset your hold.</p>
              </div>
            </section>
            <div className="lesson-next"><button onClick={() => setMode("practice")}>Start Practice →</button></div>
          </>
        )}

        {mode === "practice" && (
          <>
            <section className="practice-card">
              <p className="eyebrow">PRACTICE THE HOLD</p>
              <h2>Check Your Bow Hold</h2>
              <p>Take your time with each step. Check it off when you have tried it.</p>
              <div className="practice-note" aria-hidden="true">🏹</div>
              <div className="bow-practice-checklist" style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                {BOW_HOLD_STEPS.map((step) => (
                  <label className="bow-practice-step" key={step.id} style={{ display: "flex", alignItems: "flex-start", gap: "12px", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
                    <input type="checkbox" checked={checkedSteps.includes(step.id)} onChange={() => toggleStep(step.id)} />
                    <span style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }}><strong>{step.title}</strong><small>{step.detail}</small></span>
                  </label>
                ))}
              </div>
              <div className="practice-tip">💡 Keep your grip comfortable and your wrist relaxed.</div>
              <p className="open-string-progress">Steps practiced: {checkedSteps.length} of {BOW_HOLD_STEPS.length}</p>
            </section>
            <div className="lesson-next">
              <button onClick={() => setMode("play")} disabled={checkedSteps.length !== BOW_HOLD_STEPS.length}>
                Continue to Play →
              </button>
            </div>
            {checkedSteps.length !== BOW_HOLD_STEPS.length && <p className="bow-continue-hint">Try all six steps to continue.</p>}
          </>
        )}

        {mode === "play" && (
          <>
            <section className="play-card">
              <p className="eyebrow">PLAY AN OPEN STRING</p>
              <h2>Try a Slow Bow Stroke</h2>
              <p>Set your bow on the G string. Play one slow, steady stroke while keeping your hand relaxed. </p>
              <div className="play-note">G</div>
              <div className="play-status" role="status">{strokeCount === 0 ? "try one slow stroke." : `Strokes practiced: ${strokeCount}`}</div>
              <div className="bow-play-actions">
                <button className="start-practice-button" onClick={() => setStrokeCount((count) => count + 1)}>✓ I tried a slow stroke</button>
                <button className="lesson-action-secondary" onClick={() => setStrokeCount(0)}>Reset</button>
              </div>
            </section>
            <div className="lesson-completion">
              <p>{strokeCount > 0 ? "Nice work!" : "Try at least one long, slow bow stroke before finishing."}</p>
              <button className="complete-button" onClick={handleComplete} disabled={strokeCount === 0}>Complete Lesson →</button>
            </div>
          </>
        )}
      </main>
      <Navbar />
    </div>
  );
}

export default BasicBowing;
