import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useInstrument } from "../../context/useInstrument";
import { useProgress } from "../../context/useProgress";
import { NOTES_WS_URL, isMatch, playedNote } from "../../utils/notes";
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
    if (mode === "learn") setMode("practice");
    else if (mode === "practice") setMode("play");
  };

  return (
    <div className="app">
      <header className="top-bar">
        <div className="logo">Your First Notes</div>
        <div className="profile"><span>🎻</span></div>
      </header>

      <main className="lesson-page">
        <Link to="/lessons" className="back-link">← Back to Lessons</Link>

        <section className="lesson-header">
          <p className="eyebrow">LESSON 5 OF 5 • VIOLIN</p>
          <h1>Your First Notes</h1>
          <p>Use your first finger to change the pitch and play a tiny melody.</p>
        </section>

        <div className="lesson-modes">
          <button className={mode === "learn" ? "mode-button active" : "mode-button"} onClick={() => setMode("learn")}>Learn</button>
          <button className={mode === "practice" ? "mode-button active" : "mode-button"} onClick={() => setMode("practice")}>Practice</button>
          <button className={mode === "play" ? "mode-button active" : "mode-button"} onClick={() => setMode("play")}>Play</button>
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
        <div className="instrument-display"><span>🎻</span></div>

        <div className="lesson-section">
          <h2>Now Add Your Left-Hand Fingers</h2>
          <p>
            In the open-string lesson, you played without pressing the strings. Now keep your bow relaxed and gently press a string with your left index finger (finger 1). This makes a new, higher note.
          </p>
        </div>

        <div className="lesson-section">
          <h2>Meet Two New Notes</h2>
          <p>Start with one finger on two familiar strings. Keep your fingertip rounded and press just enough for a clear sound.</p>
          <div className="note-grid">
            <div className="note-card"><strong>D → E</strong><span>Open D, then finger 1 on D</span></div>
            <div className="note-card"><strong>A → B</strong><span>Open A, then finger 1 on A</span></div>
          </div>
        </div>

        <div className="lesson-section">
          <h2>How to Place Finger 1</h2>
          <p>
            1. Keep your thumb relaxed beside the neck. 2. Place your index fingertip on the D string to play E. 3. Try the same idea on the A string to play B. 4. Keep unused fingers curved and relaxed.
          </p>
          <div className="practice-tip">💡 Listen carefully because the violin has no frets.</div>
        </div>
      </section>

      <div className="lesson-next"><button onClick={onNext}>Practice →</button></div>
    </>
  );
}

function PracticeSection({ onNext }) {
  return (
    <>
      <section className="practice-card">
        <p className="eyebrow">PRACTICE</p>
        <h2>Switch Between Open and Fingered Notes</h2>
        <p>Play each pair slowly. Lift finger 1 to return to the open string, then place it again without squeezing your hand.</p>

        <div className="practice-tip">💡 Keep your wrist straight and your left thumb soft. Use slow, steady bow strokes.</div>
      </section>

      <div className="lesson-next"><button onClick={onNext}>Try the Note Pattern →</button></div>
    </>
  );
}

const FIRST_NOTE_SEQUENCE = [
  { name: "D", octave: 4, finger: "0", stringName: "D string", instruction: "Play the open D string." },
  { name: "E", octave: 4, finger: "1", stringName: "D string", instruction: "Place finger 1 on the D string to play E." },
  { name: "D", octave: 4, finger: "0", stringName: "D string", instruction: "Lift finger 1 and play open D again." },
  { name: "E", octave: 4, finger: "1", stringName: "D string", instruction: "Place finger 1 on the D string to play E." },
  { name: "A", octave: 4, finger: "0", stringName: "A string", instruction: "Play the open A string." },
  { name: "B", octave: 4, finger: "1", stringName: "A string", instruction: "Place finger 1 on the A string to play B." },
  { name: "A", octave: 4, finger: "0", stringName: "A string", instruction: "Lift finger 1 and play open A again." },
  { name: "B", octave: 4, finger: "1", stringName: "A string", instruction: "Place finger 1 on the A string to play B." },
];

function NoteStaffVisual({ note, status = "ready", detectedNote = null }) {
  const yForNote = (name, octave) => {
    const positions = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
    const diatonic = octave * 7 + positions[name];
    const e4 = 4 * 7 + positions.E;
    return 98 - (diatonic - e4) * 7;
  };
  const y = yForNote(note.name, note.octave);
  const detectedMatch = detectedNote ? /^([A-G])([#b]?)(-?\\d+)?$/.exec(detectedNote) : null;
  const detectedY = detectedMatch ? yForNote(detectedMatch[1], Number(detectedMatch[3] || 4)) : null;
  const needsLedger = note.name === "D" && note.octave === 4;

  return (
    <div className="first-note-staff" style={{ margin: "20px auto", maxWidth: 420, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "16px 12px" }}>
      <svg viewBox="0 0 340 112" role="img" aria-label={`Treble staff showing note ${note.name}`} style={{ display: "block", width: "100%", maxWidth: 390, margin: "0 auto" }}>
        {[42, 56, 70, 84, 98].map((lineY) => (
          <line key={lineY} x1="28" y1={lineY} x2="312" y2={lineY} stroke="#252525" strokeWidth="1.5" />
        ))}
        <text x="38" y="86" fontSize="48" fill="#252525" fontFamily="serif">𝄞</text>
        {needsLedger && <line x1="178" y1="98" x2="220" y2="98" stroke="#252525" strokeWidth="1.8" />}
        <line x1="209" y1={y - 1} x2="209" y2={y - 35} stroke={status === "correct" ? "#198754" : "#171717"} strokeWidth="2.5" />
        <ellipse cx="199" cy={y} rx="11" ry="7.5" transform={`rotate(-20 199 ${y})`} fill={status === "correct" ? "#198754" : "#171717"} stroke={status === "correct" ? "#198754" : "#171717"} />
        {status === "incorrect" && detectedMatch && (
          <g aria-label={`Detected ${detectedNote}, incorrect`}>
            <line x1="267" y1={detectedY - 1} x2="267" y2={detectedY - 35} stroke="#dc3545" strokeWidth="2.5" />
            <ellipse cx="257" cy={detectedY} rx="11" ry="7.5" transform={`rotate(-20 257 ${detectedY})`} fill="#dc3545" stroke="#dc3545" />
          </g>
        )}
      </svg>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24, minHeight: 24, marginTop: 2, marginBottom: 6, fontSize: 14 }}>
        <span style={{ minWidth: 48, textAlign: "center", color: status === "correct" ? "#198754" : "#444", fontWeight: 600 }}>{note.name}</span>
        {status === "incorrect" && detectedMatch && (
          <span style={{ minWidth: 48, textAlign: "center", color: "#dc3545", fontWeight: 600 }}>{detectedMatch[1]}{detectedMatch[2] || ""}</span>
        )}
      </div>
      <div style={{ textAlign: "center", fontWeight: 700, fontSize: 28, color: status === "correct" ? "#198754" : "#222", marginTop: 2 }}>Play {note.name}</div>
      <div style={{ textAlign: "center", color: "#555", fontSize: 14 }}>{note.stringName}</div>
    </div>
  );
}

function PlaySection({ onComplete }) {
  const { instrument } = useInstrument();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [detectedNote, setDetectedNote] = useState(null);
  const [status, setStatus] = useState("ready");
  const socketRef = useRef(null);
  const currentNote = FIRST_NOTE_SEQUENCE[currentIndex];
  const isLastNote = currentIndex === FIRST_NOTE_SEQUENCE.length - 1;
  const targetNote = `${currentNote.name}${currentNote.octave}`;

  const closeSocket = () => {
    const socket = socketRef.current;
    socketRef.current = null;
    if (socket) socket.close();
  };

  const resetAttempt = () => {
    closeSocket();
    setIsListening(false);
    setDetectedNote(null);
    setStatus("ready");
  };

  useEffect(() => () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  }, []);

  const startListening = () => {
    closeSocket();
    setIsListening(true);
    setDetectedNote(null);
    setStatus("listening");

    const socket = new WebSocket(NOTES_WS_URL);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      let message;
      try { message = JSON.parse(event.data); } catch { return; }
      if (message.type !== "note") return;

      const detected = playedNote(message.note, instrument);
      setDetectedNote(detected);
      if (isMatch(detected, targetNote)) {
        setStatus("correct");
        closeSocket();
        setIsListening(false);
      } else {
        setStatus("incorrect");
      }
    };

    socket.onerror = () => {
      setStatus("error");
      setIsListening(false);
    };
    socket.onclose = () => {
      if (socketRef.current === socket) {
        socketRef.current = null;
        setStatus("error");
        setIsListening(false);
      }
    };
  };

  const advanceNote = () => {
    if (isLastNote) {
      resetAttempt();
      onComplete();
    } else {
      resetAttempt();
      setCurrentIndex((index) => index + 1);
    }
  };

  const feedback = {
    ready: "Allow microphone access, then play the note shown.",
    listening: "Listening for your note...",
    correct: `Correct! You played ${currentNote.name}.`,
    incorrect: `Detected ${detectedNote ? detectedNote.replace(/-?\d+$/, "") : "a note"}. Try ${currentNote.name} again.`,
    error: "Could not connect to the pitch detector. Check that your note-listening server is running, then try again.",
  }[status];

  return (
    <>
      <section className="play-card">
        <p className="eyebrow">PLAY</p>
        <h2>Your First Pattern</h2>
        <p>Play the note shown.</p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
          <span style={{ fontWeight: 700 }}>Note {currentIndex + 1} of {FIRST_NOTE_SEQUENCE.length}</span>
          <span style={{ color: "#666", fontSize: 14 }}>Pattern: D – E – D – E – A – B – A – B</span>
        </div>
        <div aria-label={`Progress: ${currentIndex + 1} of ${FIRST_NOTE_SEQUENCE.length}`} style={{ height: 7, background: "#e5e7eb", borderRadius: 99, overflow: "hidden", marginTop: 8 }}>
          <div style={{ height: "100%", width: `${((currentIndex + 1) / FIRST_NOTE_SEQUENCE.length) * 100}%`, background: "#16a34a", transition: "width 180ms ease" }} />
        </div>

        <NoteStaffVisual note={currentNote} status={status} detectedNote={detectedNote} />
        <p style={{ textAlign: "center", fontSize: 17, margin: "8px 0 16px" }}>{currentNote.instruction}</p>

        <div className="play-sequence" aria-label="Full note pattern">
          {FIRST_NOTE_SEQUENCE.map((note, index) => (
            <span key={`${note.name}-${index}`} style={{ opacity: index === currentIndex ? 1 : 0.55, outline: index === currentIndex ? "3px solid #16a34a" : "none", borderRadius: 8 }}>
              {note.name}
            </span>
          ))}
        </div>

        <div className="practice-result" style={{ textAlign: "center", marginTop: 16 }}>
          <p className="practice-feedback" style={{ color: status === "correct" ? "#198754" : status === "incorrect" ? "#dc3545" : "inherit" }}>{feedback}</p>
          {detectedNote && <p>Detected note: <strong>{detectedNote.replace(/-?\d+$/, "")}</strong></p>}
        </div>

        <div className="lesson-next" style={{ marginTop: 18 }}>
          {status !== "correct" && (
            <button onClick={startListening} disabled={isListening}>
              {isListening ? "Listening..." : status === "error" ? "Try Listening Again" : "Start Listening"}
            </button>
          )}
          <button onClick={advanceNote} disabled={status !== "correct"}>
            {isLastNote ? "Finish Pattern →" : "Next Note →"}
          </button>
          {currentIndex > 0 && <button className="mode-button" onClick={() => { resetAttempt(); setCurrentIndex((index) => Math.max(0, index - 1)); }}>← Previous</button>}
          <button className="mode-button" onClick={() => { resetAttempt(); setCurrentIndex(0); }}>Restart</button>
        </div>
      </section>

      <div className="lesson-completion">
        <p>Finish all notes correctly to complete this lesson.</p>
      </div>
    </>
  );
}

export default FirstNotes;
