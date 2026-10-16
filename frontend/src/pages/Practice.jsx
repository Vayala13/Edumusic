import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { useInstrument } from "../context/useInstrument";
import "./Practice.css";
import { NOTES_WS_URL, isMatch, playedNote } from "../utils/notes";
import { usePracticeStats } from "../context/usePracticeStats";

// Every violin note a beginner is likely to reach, lowest to highest.
const VIOLIN_NOTES = [
  "G3", "A3", "B3",
  "C4", "D4", "E4", "F4", "G4", "A4", "B4",
  "C5", "D5", "E5", "F5", "G5", "A5", "B5",
];

const TRUMPET_NOTES = ["C", "D", "E", "F", "G"];

// Returns a shuffled copy of the list. Each note appears exactly once, so a
// random round never repeats a note.
function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const LETTER_INDEX = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };

function StaffNote({ note }) {

  const match = /^([A-G])([#b]?)(-?\d+)?$/.exec(note);
  const letter = match?.[1] || "C";
  const accidental = match?.[2] || "";
  const octave = match?.[3] ? Number(match[3]) : 4;
  const diatonicPosition =
    octave * 7 + LETTER_INDEX[letter] - (4 * 7 + LETTER_INDEX.E);

  // Each diatonic step is one staff space (9 SVG units).
  const noteY = 120 - diatonicPosition * 9;
  const staffLines = [48, 66, 84, 102, 120];

  const ledgerLines = [];
  if (diatonicPosition < -1) {
    for (let step = -2; step >= diatonicPosition; step -= 2) {
      ledgerLines.push(120 - step * 9);
    }
  } else if (diatonicPosition > 9) {
    for (let step = 10; step <= diatonicPosition; step += 2) {
      ledgerLines.push(120 - step * 9);
    }
  }

  return (
    <div className="staff-note">
      <svg
        className="music-staff"
        viewBox="0 0 340 190"
        role="img"
        aria-label={`${note} shown on a treble-clef staff`}
      >
        {staffLines.map((y) => (
          <line
            key={y}
            x1="28"
            y1={y}
            x2="312"
            y2={y}
            className="staff-line"
          />
        ))}

        <text x="34" y="112" className="treble-clef">
          𝄞
        </text>

        {ledgerLines.map((y) => (
          <line
            key={y}
            x1="174"
            y1={y}
            x2="218"
            y2={y}
            className="ledger-line"
          />
        ))}

        {accidental && (
          <text x="157" y={noteY + 6} className="note-accidental">
            {accidental === "b" ? "♭" : "♯"}
          </text>
        )}

        {/* A quarter-note stem points up for notes on/below the middle line,
            and down for notes above it. Draw it behind the notehead. */}
        <line
          x1={noteY >= 84 ? 206 : 190}
          y1={noteY}
          x2={noteY >= 84 ? 206 : 190}
          y2={noteY >= 84 ? noteY - 36 : noteY + 36}
          className="note-stem"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <ellipse
          cx="198"
          cy={noteY}
          rx="9"
          ry="6.5"
          transform={`rotate(-20 198 ${noteY})`}
          className="note-head"
        />
      </svg>

      <div className="staff-note-name">{letter}{accidental}</div>
    </div>
  );
}

function Practice() {
  const { instrument } = useInstrument();
  const { recordSuccessfulNote } = usePracticeStats();

  const [isListening, setIsListening] = useState(false);
  const [currentNote, setCurrentNote] = useState(0);
  const [detectedNote, setDetectedNote] = useState(null);
  const [practiceStatus, setPracticeStatus] = useState("ready");

  // "choose" = pick a note from the dropdown and step through in order.
  // "random" = one shuffled round through every note, then finish.
  const [mode, setMode] = useState("choose");
  const [randomOrder, setRandomOrder] = useState([]);
  const [finished, setFinished] = useState(false);

  // The open connection to the pitch detector, if any.
  const socketRef = useRef(null);

  const notes = instrument === "violin" ? VIOLIN_NOTES : TRUMPET_NOTES;

  const instrumentName = instrument === "violin" ? "Violin" : "Trumpet";
  const instrumentIcon = instrument === "violin" ? "🎻" : "🎺";

  // The list of notes the page is stepping through right now.
  const sequence = mode === "random" ? randomOrder : notes;
  const targetNote = sequence[currentNote];
  const isLastNote = currentNote === sequence.length - 1;
  const nextLabel = !isLastNote
    ? "Next Note"
    : mode === "random"
      ? "Finish"
      : "Practice Again";

  const feedbackText = {
    listening: "Listening for your note...",
    correct: "Great job! You played the correct note.",
    incorrect: "Not quite. Try again!",
    error: "Lost the connection to the pitch detector. Start the server, then try again.",
  }[practiceStatus];

  // Close the connection if the user leaves the page.
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  // Clears the ref first, so the socket's onclose can tell a deliberate close
  // from a dropped connection.
  const closeSocket = () => {
    const socket = socketRef.current;
    socketRef.current = null;

    if (socket) {
      socket.close();
    }
  };

  const resetAttempt = () => {
    closeSocket();
    setDetectedNote(null);
    setIsListening(false);
    setPracticeStatus("ready");
  };

  const startListening = () => {
    closeSocket();
    setIsListening(true);
    setDetectedNote(null);
    setPracticeStatus("listening");

    const socket = new WebSocket(NOTES_WS_URL);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      let message;

      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }

      if (message.type !== "note") {
        return;
      }

      const played = playedNote(message.note, instrument);

      setDetectedNote(played);

      if (isMatch(played, targetNote)) {
        setPracticeStatus("correct");

        recordSuccessfulNote(instrument, targetNote).catch((error) => {
          console.error("Could not record successful note:", error);
        });

        closeSocket(); // right note: stop listening
      } else {
        setPracticeStatus("incorrect");
      }
    };

    socket.onclose = () => {
      // closeSocket() clears the ref before closing, so only a dropped
      // connection gets here with the ref still pointing at this socket.
      if (socketRef.current === socket) {
        socketRef.current = null;
        setPracticeStatus("error");
      }
    };
  };

  const selectNote = (index) => {
    setCurrentNote(index);
    resetAttempt();
  };

  const startRandomRound = () => {
    setRandomOrder(shuffle(notes));
    setCurrentNote(0);
    setFinished(false);
    resetAttempt();
  };

  const switchMode = (newMode) => {
    if (newMode === mode) {
      return;
    }

    setMode(newMode);
    setCurrentNote(0);
    setFinished(false);
    resetAttempt();

    if (newMode === "random") {
      setRandomOrder(shuffle(notes));
    }
  };

  const goToNext = () => {
    resetAttempt();

    if (!isLastNote) {
      setCurrentNote(currentNote + 1);
    } else if (mode === "random") {
      setFinished(true);
    } else {
      setCurrentNote(0);
    }
  };

  return (
    <div className="app">
      <main className="practice-page">
        <section className="practice-intro">
          <p className="eyebrow">PRACTICE MODE</p>
          <h1>Practice</h1>
          <p>Practice playing notes and improve your accuracy.</p>
        </section>

        <section className="practice-card">
          <div className="practice-instrument">
            <span className="practice-instrument-icon">{instrumentIcon}</span>

            <div>
              <h2>{instrumentName}</h2>
              <p>Beginner Practice</p>
            </div>
          </div>

          <div className="practice-mode">
            <div className="mode-toggle">
              <button
                className={mode === "choose" ? "mode-button active" : "mode-button"}
                aria-pressed={mode === "choose"}
                onClick={() => switchMode("choose")}
              >
                Choose a Note
              </button>

              <button
                className={mode === "random" ? "mode-button active" : "mode-button"}
                aria-pressed={mode === "random"}
                onClick={() => {
                  if (mode !== "random") {
                    switchMode("random");
                  } else {
                    startRandomRound();
                  }
                }}
              >
                🎲 Random
              </button>
            </div>

            {mode === "choose" && (
              <label className="note-picker">
                Pick a note
                <select
                  value={currentNote}
                  onChange={(e) => selectNote(Number(e.target.value))}
                >
                  {notes.map((note, index) => (
                    <option key={note} value={index}>
                      {note}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          {finished ? (
            <div className="practice-finished">
              <h3>Round complete</h3>
              <p>You went through all {randomOrder.length} notes.</p>

              <div className="practice-buttons">
                <button
                  className="start-practice-button"
                  onClick={startRandomRound}
                >
                  Shuffle Again
                </button>

                <button
                  className="next-note-button"
                  onClick={() => switchMode("choose")}
                >
                  Choose a Note
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="target-note">
                <p className="target-note-label">PLAY THIS NOTE</p>
                <StaffNote note={targetNote} instrument={instrument} />
                <p className="target-note-description">
                  Play the note shown on the staff.
                </p>
              </div>

              <div className="practice-listening">
                <div className="microphone-icon">🎤</div>

                <h3>Ready to Practice?</h3>

                <p>
                  Allow microphone access and play the note when you're ready.
                </p>

                <button
                  className="start-practice-button"
                  onClick={startListening}
                >
                  {isListening ? "Listening..." : "Start Listening"}
                </button>
              </div>

              {isListening && (
                <div className="practice-result">
                  <p className="practice-result-label">DETECTED NOTE</p>

                  <div className="detected-note">{detectedNote || "—"}</div>

                  <p className="practice-feedback">{feedbackText}</p>
                </div>
              )}

              {isListening && (
                <div className="practice-actions">
                  <p className="practice-progress">
                    Note {currentNote + 1} of {sequence.length}
                  </p>

                  <div className="practice-buttons">
                    {practiceStatus === "correct" ? (
                      <button className="next-note-button" onClick={goToNext}>
                        {nextLabel}
                      </button>
                    ) : (
                      <>
                        <button
                          className="next-note-button"
                          onClick={resetAttempt}
                        >
                          Try Again
                        </button>

                        <button className="next-note-button" onClick={goToNext}>
                          Skip
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Navbar />
    </div>
  );
}

export default Practice;
