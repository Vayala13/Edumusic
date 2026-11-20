import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useInstrument } from "../context/useInstrument";
import { useProgress } from "../context/useProgress";
import {
  REVIEW_UNLOCK_HINTS,
  buildReviewQueue,
  buildWeakQueue,
  unlockedNotes,
} from "../data/reviewDeck";
import "./Practice.css";
import { NOTES_WS_URL, isMatch, playedNote } from "../utils/notes";
import { usePracticeStats } from "../context/usePracticeStats";
import { handleDatabaseError, logError } from "../utils/logError";

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

function StaffNote({ note, status = "neutral", playedNote = null }) {
  // Violin targets include octaves (for example G3).
  const match = /^([A-G])([#b]?)(-?\d+)?$/.exec(note);
  const letter = match?.[1] || "C";
  const accidental = match?.[2] || "";
  const octave = match?.[3] ? Number(match[3]) : 4;
  const diatonicPosition =
    octave * 7 + LETTER_INDEX[letter] - (4 * 7 + LETTER_INDEX.E);

  // The bottom line is E4. Each diatonic step is one staff space (9 SVG units).
  const noteY = 120 - diatonicPosition * 9;
  const playedMatch = playedNote ? /^([A-G])([#b]?)(-?\d+)?$/.exec(playedNote) : null;
  const playedLetter = playedMatch?.[1] || "C";
  const playedAccidental = playedMatch?.[2] || "";
  const playedOctave = playedMatch?.[3] ? Number(playedMatch[3]) : 4;
  const playedPosition = playedOctave * 7 + LETTER_INDEX[playedLetter] - (4 * 7 + LETTER_INDEX.E);
  const playedY = 120 - playedPosition * 9;
  const staffLines = [48, 66, 84, 102, 120];
  // Ledger lines must remain visible between the staff and the note.
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
          stroke={status === "correct" ? "#198754" : "currentColor"}
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
          style={{
            fill: status === "correct" ? "#198754" : "#252525",
            stroke: status === "correct" ? "#198754" : "#252525",
          }}
        />
        {status === "incorrect" && playedNote && (
          <g aria-label={`Played ${playedNote}, incorrect`}>
            {playedAccidental && (
              <text x="217" y={playedY + 6} fill="#dc3545" fontSize="23">
                {playedAccidental === "b" ? "♭" : "♯"}
              </text>
            )}
            <line
              x1={playedY >= 84 ? 266 : 250}
              y1={playedY}
              x2={playedY >= 84 ? 266 : 250}
              y2={playedY >= 84 ? playedY - 36 : playedY + 36}
              stroke="#dc3545" strokeWidth="2.5" strokeLinecap="round"
            />
            <ellipse cx="258" cy={playedY} rx="9" ry="6.5"
              transform={`rotate(-20 258 ${playedY})`}
              fill="#dc3545" stroke="#dc3545" />
          </g>
        )}
      </svg>

      <div className="staff-note-name">{letter}{accidental}</div>
    </div>
  );
}

function Practice() {
  const { instrument } = useInstrument();
  const { progress } = useProgress();
  const { stats, loadingStats, recordSuccessfulNote, recordReviewResult } = usePracticeStats();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialReview = searchParams.get("mode") === "review";

  const [isListening, setIsListening] = useState(false);
  const [currentNote, setCurrentNote] = useState(0);
  const [detectedNote, setDetectedNote] = useState(null);
  const [practiceStatus, setPracticeStatus] = useState("ready");

  // "choose" = pick a note from the dropdown and step through in order.
  // "random" = one shuffled round through every note, then finish.
  // "review" = due notes from completed lessons, requeue misses.
  const [mode, setMode] = useState(initialReview ? "review" : "choose");
  const [seededKey, setSeededKey] = useState("");
  const [randomOrder, setRandomOrder] = useState([]);
  const [finished, setFinished] = useState(false);
  const [reviewQueue, setReviewQueue] = useState([]);
  const [reviewMissed, setReviewMissed] = useState({});
  const [reviewSkips, setReviewSkips] = useState({});
  const [reviewCleared, setReviewCleared] = useState(0);
  const [reviewXpGained, setReviewXpGained] = useState(0);
  const [reviewFinished, setReviewFinished] = useState(false);
  const [reviewEmpty, setReviewEmpty] = useState(null);

  // The open connection to the pitch detector.
  const socketRef = useRef(null);

  const instrumentDetails = {
    violin: { name: "Violin", icon: "🎻", notes: VIOLIN_NOTES },
    trumpet: { name: "Trumpet", icon: "🎺", notes: TRUMPET_NOTES },
    guitar: { name: "Guitar", icon: "🎸", notes: [] },
    ukulele: { name: "Ukulele", icon: "🪕", notes: [] },
  };

  const currentInstrument =
    instrumentDetails[instrument] || instrumentDetails.violin;

  const instrumentName = currentInstrument.name;
  const instrumentIcon = currentInstrument.icon;
  const notes = currentInstrument.notes;
  const completedLessons = progress?.[instrument] || [];
  const unlocked = unlockedNotes(instrument, completedLessons);
  const unlockHint = REVIEW_UNLOCK_HINTS[instrument];
  const srsMap = stats?.srs?.[instrument] || {};
  const reviewSeedKey = `${mode}:${instrument}:${completedLessons.join(",")}:${loadingStats}`;

  if (mode === "review" && !loadingStats && seededKey !== reviewSeedKey) {
    const queue = buildReviewQueue(unlocked, srsMap);
    setSeededKey(reviewSeedKey);
    setReviewQueue(queue);
    setReviewMissed({});
    setReviewSkips({});
    setReviewCleared(0);
    setReviewXpGained(0);
    setReviewFinished(false);
    setReviewEmpty(
      queue.length === 0
        ? unlocked.length === 0
          ? "locked"
          : "caught-up"
        : null
    );
  }

  const isPracticeAvailable =
    instrument === "violin" || instrument === "trumpet";

  // The list of notes the page is stepping through right now.
  const sequence = mode === "random" ? randomOrder : notes;
  const targetNote =
    mode === "review" ? reviewQueue[0] : sequence[currentNote];
  const isLastNote = currentNote === sequence.length - 1;
  const nextLabel = !isLastNote
    ? "Next note"
    : mode === "random"
      ? "Finish"
      : "Start over";
  const reviewRemaining = reviewQueue.length;
  const reviewTotal = reviewCleared + reviewRemaining;
  const reviewBarPercent =
    reviewTotal === 0 ? 0 : Math.round((reviewCleared / reviewTotal) * 100);

  const feedbackText = {
    listening: "Listening…",
    correct: "That matches the staff.",
    incorrect: "That wasn't it. Play it again.",
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

  const resetReviewTracking = () => {
    setReviewMissed({});
    setReviewSkips({});
    setReviewCleared(0);
    setReviewXpGained(0);
    setReviewFinished(false);
  };

  const startReviewSession = (queue) => {
    setReviewQueue(queue);
    resetReviewTracking();
    setReviewEmpty(null);
    resetAttempt();
  };

  const beginDueReview = () => {
    const queue = buildReviewQueue(unlocked, srsMap);
    if (queue.length === 0) {
      setReviewQueue([]);
      resetReviewTracking();
      setReviewEmpty(unlocked.length === 0 ? "locked" : "caught-up");
      resetAttempt();
      return;
    }

    startReviewSession(queue);
  };

  const beginWeakReview = () => {
    const queue = buildWeakQueue(unlocked, srsMap);
    if (queue.length === 0) {
      setReviewEmpty("locked");
      return;
    }
    startReviewSession(queue);
  };

  const finishReviewIfEmpty = (nextQueue) => {
    if (nextQueue.length === 0) {
      setReviewFinished(true);
    }
  };

  const completeReviewCard = async (note, missed) => {
    if (reviewQueue[0] !== note) {
      return;
    }

    const grade = missed ? "again" : "good";
    let xpGain = 0;

    try {
      xpGain = (await recordReviewResult(instrument, note, grade)) || 0;
    } catch (error) {
      handleDatabaseError("Error recording review result", error);
    }

    const nextQueue = reviewQueue.slice(1);
    setReviewQueue(nextQueue);
    setReviewCleared((count) => count + 1);
    setReviewXpGained((xp) => xp + xpGain);
    finishReviewIfEmpty(nextQueue);
    resetAttempt();
  };

  const requeueReviewCard = (note) => {
    const rest = reviewQueue.slice(1);
    const nextQueue = [...rest, note];
    setReviewQueue(nextQueue);
    resetAttempt();
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
      } catch (error) {
        logError("Error parsing note message", error);
        return;
      }

      if (message.type !== "note") {
        return;
      }

      const played = playedNote(message.note, instrument);

      setDetectedNote(played);

      if (isMatch(played, targetNote)) {
        setPracticeStatus("correct");

        if (mode === "review") {
          closeSocket();
          return;
        }

        recordSuccessfulNote(instrument, targetNote).catch((error) => {
          handleDatabaseError("Error recording successful note", error);
        });

        closeSocket(); // right note: stop listening
      } else {
        setPracticeStatus("incorrect");
        if (mode === "review" && targetNote) {
          setReviewMissed((current) => ({
            ...current,
            [targetNote]: true,
          }));
        }
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

    if (newMode === "review") {
      setSearchParams({ mode: "review" }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
      setSeededKey("");
      setReviewQueue([]);
      resetReviewTracking();
      setReviewEmpty(null);
    }

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

  const continueReviewAfterCorrect = () => {
    const note = reviewQueue[0];
    if (!note) {
      return;
    }

    completeReviewCard(note, Boolean(reviewMissed[note]));
  };

  const skipReviewCard = () => {
    const note = reviewQueue[0];
    if (!note) {
      return;
    }

    const skips = (reviewSkips[note] || 0) + 1;
    setReviewSkips((current) => ({ ...current, [note]: skips }));
    setReviewMissed((current) => ({ ...current, [note]: true }));
    if (skips >= 2) {
      completeReviewCard(note, true);
      return;
    }

    requeueReviewCard(note);
  };

  const retryReviewCard = () => {
    resetAttempt();
  };

  if (!isPracticeAvailable) {
    return (
      <div className="app">
        <main className="practice-page">
          <section className="practice-intro">
            <p className="eyebrow">PRACTICE MODE</p>
            <h1>Practice</h1>
            <p>Play the note on the staff. The detector checks whether it matches.</p>
          </section>

          <section className="practice-card">
            <div className="practice-instrument">
              <span className="practice-instrument-icon">
                {instrumentIcon}
              </span>

              <div>
                <h2>{instrumentName}</h2>
                <p>Beginner practice</p>
              </div>
            </div>

            <div className="practice-finished">
              <h3>Not on this instrument yet</h3>
              <p>
                {instrumentName} practice is not in the app yet.
              </p>
            </div>
          </section>
        </main>

        <Navbar />
      </div>
    );
  }

  return (
    <div className="app">
      <main className="practice-page">
        <section className="practice-intro">
          <p className="eyebrow">PRACTICE MODE</p>
          <h1>Practice</h1>
          <p>Play the note on the staff. The detector checks whether it matches.</p>
        </section>

        <section className="practice-card">
          <div className="practice-instrument">
            <span className="practice-instrument-icon">{instrumentIcon}</span>

            <div>
              <h2>{instrumentName}</h2>
              <p>Beginner practice</p>
            </div>
          </div>

          <div className="practice-mode">
            <div className="mode-toggle">
              <button
                className={mode === "choose" ? "mode-button active" : "mode-button"}
                aria-pressed={mode === "choose"}
                onClick={() => switchMode("choose")}
              >
                Choose a note
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
                Random
              </button>

              <button
                className={mode === "review" ? "mode-button active" : "mode-button"}
                aria-pressed={mode === "review"}
                onClick={() => switchMode("review")}
              >
                Review
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

          {mode === "review" && loadingStats ? (
            <div className="practice-finished">
              <h3>Loading review</h3>
              <p>Checking which notes are due.</p>
            </div>
          ) : mode === "review" && reviewEmpty === "locked" ? (
            <div className="practice-finished">
              <h3>Review is locked</h3>
              <p>
                Finish {unlockHint?.title || "the first playing lesson"} to
                unlock daily review.
              </p>
              {unlockHint && (
                <div className="practice-buttons">
                  <Link to={unlockHint.link} className="start-practice-button">
                    Go to {unlockHint.title}
                  </Link>
                </div>
              )}
            </div>
          ) : mode === "review" && reviewEmpty === "caught-up" ? (
            <div className="practice-finished">
              <h3>Nothing due today</h3>
              <p>
                Come back tomorrow, or drill the notes that still feel shaky.
              </p>
              <div className="practice-buttons">
                <button
                  className="start-practice-button"
                  onClick={beginWeakReview}
                >
                  Drill weak notes
                </button>
              </div>
            </div>
          ) : mode === "review" && reviewFinished ? (
            <div className="practice-finished">
              <h3>Review done</h3>
              <p>
                You reviewed {reviewCleared}{" "}
                {reviewCleared === 1 ? "note" : "notes"} and gained{" "}
                {reviewXpGained} XP.
              </p>
              <div className="practice-buttons">
                <button
                  className="start-practice-button"
                  onClick={beginDueReview}
                >
                  Check for more
                </button>
                <button
                  className="next-note-button"
                  onClick={() => switchMode("choose")}
                >
                  Choose a note
                </button>
              </div>
            </div>
          ) : finished ? (
            <div className="practice-finished">
              <h3>Shuffle finished</h3>
              <p>You played all {randomOrder.length} notes.</p>

              <div className="practice-buttons">
                <button
                  className="start-practice-button"
                  onClick={startRandomRound}
                >
                  Shuffle again
                </button>

                <button
                  className="next-note-button"
                  onClick={() => switchMode("choose")}
                >
                  Choose a note
                </button>
              </div>
            </div>
          ) : (
            <>
              {mode === "review" && (
                <div className="review-progress">
                  <p className="practice-progress">
                    {reviewCleared} done · {reviewRemaining} left
                  </p>
                  <div
                    className="review-progress-bar"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={reviewBarPercent}
                  >
                    <span style={{ width: `${reviewBarPercent}%` }} />
                  </div>
                </div>
              )}

              <div className="target-note">
                <p className="target-note-label">PLAY THIS NOTE</p>
                <StaffNote note={targetNote} instrument={instrument} status={practiceStatus} playedNote={practiceStatus === "incorrect" ? detectedNote : null} />
                <p className="target-note-description">
                  Play the note shown on the staff.
                </p>
              </div>

              <div className="practice-listening">
                <div className="microphone-icon">🎤</div>

                <h3>Ready?</h3>

                <p>
                  Start the note server, then play the note on the staff.
                </p>

                <button
                  className="start-practice-button"
                  onClick={startListening}
                >
                  {isListening ? "Listening…" : "Start listening"}
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
                  {mode !== "review" && (
                    <p className="practice-progress">
                      Note {currentNote + 1} of {sequence.length}
                    </p>
                  )}

                  <div className="practice-buttons">
                    {practiceStatus === "correct" ? (
                      <button
                        className="next-note-button"
                        onClick={
                          mode === "review"
                            ? continueReviewAfterCorrect
                            : goToNext
                        }
                      >
                        {mode === "review" ? "Next note" : nextLabel}
                      </button>
                    ) : (
                      <>
                        <button
                          className="next-note-button"
                          onClick={
                            mode === "review" ? retryReviewCard : resetAttempt
                          }
                        >
                          Try again
                        </button>

                        <button
                          className="next-note-button"
                          onClick={
                            mode === "review" ? skipReviewCard : goToNext
                          }
                        >
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
