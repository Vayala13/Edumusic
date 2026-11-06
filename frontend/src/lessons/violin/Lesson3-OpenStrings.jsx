import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useInstrument } from "../../context/useInstrument";
import { useProgress } from "../../context/useProgress";
import { NOTES_WS_URL, isMatch, playedNote } from "../../utils/notes";
import "./Lesson3-OpenStrings.css";

const OPEN_STRINGS = [
  { note: "G3", name: "G", description: "The lowest open string" },
  { note: "D4", name: "D", description: "The second-lowest open string" },
  { note: "A4", name: "A", description: "The second-highest open string" },
  { note: "E5", name: "E", description: "The highest open string" },
];

const LETTER_INDEX = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };

function StaffNote({ note }) {
  const match = /^([A-G])([#b]?)(-?\d+)?$/.exec(note);
  const letter = match?.[1] || "C";
  const octave = match?.[3] ? Number(match[3]) : 4;
  const position = octave * 7 + LETTER_INDEX[letter] - (4 * 7 + LETTER_INDEX.E);
  const noteY = 120 - position * 9;
  const staffLines = [48, 66, 84, 102, 120];
  const ledgerLines = [];

  if (position < -1) {
    for (let step = -2; step >= position; step -= 2) ledgerLines.push(120 - step * 9);
  } else if (position > 9) {
    for (let step = 10; step <= position; step += 2) ledgerLines.push(120 - step * 9);
  }

  const stemUp = noteY >= 84;
  return (
    <div className="lesson-staff-note">
      <svg className="lesson-music-staff" viewBox="0 0 340 190" role="img" aria-label={`${letter} note on treble-clef staff`}>
        {staffLines.map((y) => <line key={y} x1="28" y1={y} x2="312" y2={y} className="lesson-staff-line" />)}
        <text x="34" y="112" className="lesson-treble-clef">𝄞</text>
        {ledgerLines.map((y) => <line key={y} x1="174" y1={y} x2="218" y2={y} className="lesson-ledger-line" />)}
        <line
          x1={stemUp ? 206 : 190}
          y1={noteY}
          x2={stemUp ? 206 : 190}
          y2={stemUp ? noteY - 36 : noteY + 36}
          className="lesson-note-stem"
        />
        <ellipse cx="198" cy={noteY} rx="9" ry="6.5" transform={`rotate(-20 198 ${noteY})`} className="lesson-note-head" />
      </svg>
      <div className="lesson-note-letter">{letter}</div>
    </div>
  );
}

function OpenStrings() {
  const [mode, setMode] = useState("learn");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [detectedNote, setDetectedNote] = useState(null);
  const [status, setStatus] = useState("ready");
  const [completedNotes, setCompletedNotes] = useState([]);
  const [heardNotes, setHeardNotes] = useState([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);
  const socketRef = useRef(null);
  const { instrument } = useInstrument();
  const { completeLesson } = useProgress();
  const navigate = useNavigate();
  const current = OPEN_STRINGS[currentIndex];
  const allComplete = completedNotes.length === OPEN_STRINGS.length;

  const closeSocket = () => {
    const socket = socketRef.current;
    socketRef.current = null;
    if (socket) socket.close();
  };

  const stopListening = () => {
    closeSocket();
    setIsListening(false);
  };

  useEffect(() => () => {
    if (socketRef.current) socketRef.current.close();
    if (audioRef.current) {
      try { audioRef.current.close(); } catch { /* Audio context may already be closed. */ }
    }
  }, []);

  const playReferenceNote = async () => {
    const frequencies = { G3: 196, D4: 293.66, A4: 440, E5: 659.25 };
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error("Audio playback is not supported by this browser.");
      if (audioRef.current) {
        await audioRef.current.close().catch(() => {});
      }
      const audioContext = new AudioContextClass();
      audioRef.current = audioContext;
      await audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.value = frequencies[current.note];
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.22, audioContext.currentTime + 0.04);
      gain.gain.setValueAtTime(0.22, audioContext.currentTime + 0.85);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1.15);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      setIsPlayingAudio(true);
      setHeardNotes((previous) => previous.includes(current.note) ? previous : [...previous, current.note]);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 1.2);
      oscillator.onended = () => {
        setIsPlayingAudio(false);
        audioContext.close().catch(() => {});
        if (audioRef.current === audioContext) audioRef.current = null;
      };
    } catch (error) {
      setIsPlayingAudio(false);
      window.alert(error.message || "Could not play this note.");
    }
  };

  const resetAttempt = () => {
    stopListening();
    setDetectedNote(null);
    setStatus("ready");
  };

  const startListening = () => {
    closeSocket();
    setDetectedNote(null);
    setIsListening(true);
    setStatus("listening");

    let socket;
    try {
      socket = new WebSocket(NOTES_WS_URL);
    } catch {
      setStatus("error");
      setIsListening(false);
      return;
    }
    socketRef.current = socket;

    socket.onmessage = (event) => {
      let message;
      try { message = JSON.parse(event.data); } catch { return; }
      if (message.type !== "note") return;

      const played = playedNote(message.note, instrument);
      setDetectedNote(played);
      if (isMatch(played, current.note)) {
        setStatus("correct");
        setCompletedNotes((previous) => previous.includes(current.note) ? previous : [...previous, current.note]);
        closeSocket();
        setIsListening(false);
      } else {
        setStatus("incorrect");
      }
    };

    socket.onerror = () => {
      if (socketRef.current === socket) {
        setStatus("error");
        setIsListening(false);
      }
    };
    socket.onclose = () => {
      if (socketRef.current === socket) {
        socketRef.current = null;
        setStatus("error");
        setIsListening(false);
      }
    };
  };

  const goToNextString = () => {
    resetAttempt();
    setCurrentIndex((index) => (index + 1) % OPEN_STRINGS.length);
  };

  const restartLesson = () => {
    resetAttempt();
    setCurrentIndex(0);
    setCompletedNotes([]);
    setHeardNotes([]);
  };

  const handleComplete = () => {
    completeLesson(instrument, 3);
    navigate("/lessons");
  };

  return (
    <div className="app">
      <header className="top-bar">
        <div className="logo">Open Strings</div>
        <div className="profile"><span>🎻</span></div>
      </header>

      <main className="lesson-page">
        <Link to="/lessons" className="back-link">← Back to Lessons</Link>
        <section className="lesson-header">
          <p className="eyebrow">LESSON 3 OF 5 • VIOLIN</p>
          <h1>Open Strings</h1>
          <p>Learn the four open strings, hear each note, then play them yourself.</p>
        </section>

        <div className="lesson-modes">
          <button className={mode === "learn" ? "mode-button active" : "mode-button"} onClick={() => { resetAttempt(); setMode("learn"); }}>Learn</button>
          <button className={mode === "practice" ? "mode-button active" : "mode-button"} onClick={() => { resetAttempt(); setMode("practice"); }}>Practice</button>
          <button className={mode === "play" ? "mode-button active" : "mode-button"} onClick={() => { resetAttempt(); setMode("play"); }}>Play </button>
        </div>

        {mode === "learn" && (
          <>
            <section className="lesson-content">
              <div className="violin-display"><span>🎻</span></div>
              <div className="lesson-section">
                <h2>The Four Strings</h2>
                <p>The violin has four open strings. From lowest to highest, they are:</p>
                <div className="string-grid">
                  {OPEN_STRINGS.map((string) => <div className="string-card" key={string.note}><strong>{string.name}</strong><span>{string.description}</span></div>)}
                </div>
              </div>
              <div className="lesson-section">
                <h2>How to practice</h2>
                <p>Choose Practice to hear each string’s note, or Play to use your microphone and check your own playing.</p>
              </div>
            </section>
            <div className="lesson-next"><button onClick={() => setMode("practice")}>Start Practice →</button></div>
          </>
        )}

        {mode === "practice" && (
          <section className="open-string-practice-card">
            <p className="eyebrow">LISTEN TO THE NOTES</p>
            <h2>Hear the {current.name} string</h2>
            <p className="open-string-instruction">{current.description}. Press play to hear a reference tone for this note.</p>
            <StaffNote note={current.note} />
            <div className="open-string-target"><span>Note</span><strong>{current.name}</strong></div>
            <div className="open-string-feedback" role="status" aria-live="polite">
              {isPlayingAudio ? `Playing the ${current.name} note…` : heardNotes.includes(current.note) ? `You’ve heard ${current.name}. Play it again or move to the next note.` : `Ready to hear ${current.name}?`}
            </div>
            <div className="open-string-actions">
              <button className="start-practice-button" onClick={playReferenceNote} disabled={isPlayingAudio}>{isPlayingAudio ? "Playing…" : `▶ Play ${current.name}`}</button>
              <button className="lesson-action-primary" onClick={() => { setCurrentIndex((index) => (index + 1) % OPEN_STRINGS.length); resetAttempt(); }}>{currentIndex === OPEN_STRINGS.length - 1 ? "Back to G →" : "Next note →"}</button>
            </div>
            <p className="open-string-progress">Notes heard: {heardNotes.length} of {OPEN_STRINGS.length}</p>
            {heardNotes.length === OPEN_STRINGS.length && (
              <div className="lesson-next">
                <button onClick={() => { resetAttempt(); setCurrentIndex(0); setMode("play"); }}>
                  Continue to Play →
                </button>
              </div>
            )}
          </section>
        )}

        {mode === "play" && (
          <>
            <section className="open-string-practice-card">
              <p className="eyebrow">PLAY ALL FOUR STRINGS</p>
              <h2>String {currentIndex + 1} of {OPEN_STRINGS.length}: {current.name}</h2>
              <p className="open-string-instruction">{current.description}. Play this open string and we will listen for the correct pitch.</p>
              <StaffNote note={current.note} />
              <div className="open-string-target"><span>Target string</span><strong>{current.name}</strong></div>
              <div className={`open-string-feedback ${status}`} role="status" aria-live="polite">
                {status === "ready" && "When you're ready, start listening and play the string."}
                {status === "listening" && "🎤 Listening for your note…"}
                {status === "correct" && `Great job! That's the ${current.name} string.`}
                {status === "incorrect" && `Heard ${detectedNote || "a note"}. Try the ${current.name} string again.`}
                {status === "error" && "Could not connect to the pitch detector. Make sure the listening server is running, then try again."}
              </div>
              {detectedNote && <p className="open-string-detected">Detected: <strong>{detectedNote}</strong></p>}
              <div className="open-string-actions">
                {status === "correct" ? (
                  currentIndex === OPEN_STRINGS.length - 1 ? <button className="complete-button" onClick={() => { setMode("practice"); setCurrentIndex(0); }}>Review notes again</button> : <button className="lesson-action-primary" onClick={goToNextString}>Next string →</button>
                ) : <button className="start-practice-button" onClick={startListening} disabled={isListening}>{isListening ? "Listening…" : status === "error" ? "Try connecting again" : status === "incorrect" ? "Try again 🎤" : "Start Listening 🎤"}</button>}
                {isListening && <button className="lesson-action-secondary" onClick={resetAttempt}>Stop</button>}
              </div>
              <p className="open-string-progress">Strings played correctly: {completedNotes.length} of {OPEN_STRINGS.length}</p>
            </section>
            {allComplete && (
              <section className="lesson-completion open-string-completion">
                <div><h2>All four strings practiced!</h2><p>Nice work. You can review the strings or finish Lesson 3.</p></div>
                <div className="open-string-actions">
                  <button className="lesson-action-secondary" onClick={restartLesson}>Practice again</button>
                  <button className="complete-button" onClick={handleComplete}>Complete Lesson →</button>
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Navbar />
    </div>
  );
}

export default OpenStrings;
