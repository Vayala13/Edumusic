import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useProgress } from "../../context/useProgress";

import "../violin/Lesson1-GettingStarted.css";

const MELODY = [
    { note: "C4", string: "C", frequency: 261.63 },
    { note: "E4", string: "E", frequency: 329.63 },
    { note: "G4", string: "G", frequency: 392 },
    { note: "A4", string: "A", frequency: 440 },
    { note: "G4", string: "G", frequency: 392 },
    { note: "E4", string: "E", frequency: 329.63 },
    { note: "C4", string: "C", frequency: 261.63 },
];

function FirstSong() {
    const [mode, setMode] = useState("learn");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [practicedNotes, setPracticedNotes] = useState([]);
    const [playedSteps, setPlayedSteps] = useState([]);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);

    const audioRef = useRef(null);
    const { completeLesson } = useProgress();
    const navigate = useNavigate();

    const currentNote = MELODY[currentIndex];
    const uniqueNotes = ["C4", "E4", "G4", "A4"];
    const allNotesPracticed = practicedNotes.length === uniqueNotes.length;
    const allStepsComplete = playedSteps.length === MELODY.length;

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.close().catch(() => { });
            }
        };
    }, []);

    const playTone = async (frequency) => {
        if (isPlayingAudio) return;

        let audioContext;

        try {
            const AudioContextClass =
                window.AudioContext || window.webkitAudioContext;

            if (!AudioContextClass) {
                throw new Error("Audio playback is not supported.");
            }

            audioContext = new AudioContextClass();
            audioRef.current = audioContext;

            await audioContext.resume();

            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();

            oscillator.type = "triangle";
            oscillator.frequency.value = frequency;

            gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(
                0.2,
                audioContext.currentTime + 0.04
            );
            gain.gain.setValueAtTime(
                0.2,
                audioContext.currentTime + 0.65
            );
            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                audioContext.currentTime + 0.9
            );

            oscillator.connect(gain);
            gain.connect(audioContext.destination);

            setIsPlayingAudio(true);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.95);

            oscillator.onended = () => {
                setIsPlayingAudio(false);
                audioContext.close().catch(() => { });
                if (audioRef.current === audioContext) {
                    audioRef.current = null;
                }
            };
        } catch {
            setIsPlayingAudio(false);
            if (audioContext) {
                audioContext.close().catch(() => { });
            }
            window.alert("Could not play the reference note.");
        }
    };

    const markPracticed = (note) => {
        setPracticedNotes((previous) =>
            previous.includes(note) ? previous : [...previous, note]
        );
    };

    const markPlayed = () => {
        setPlayedSteps((previous) =>
            previous.includes(currentIndex)
                ? previous
                : [...previous, currentIndex]
        );

        if (currentIndex < MELODY.length - 1) {
            setCurrentIndex((index) => index + 1);
        }
    };

    const resetSong = () => {
        setCurrentIndex(0);
        setPlayedSteps([]);
    };

    const handleComplete = () => {
        completeLesson("ukulele", 5);
        navigate("/lessons");
    };

    return (
        <div className="app">
            <header className="top-bar">
                <div className="logo">Playing Your First Song</div>
                <div className="profile">
                    <span>🪕</span>
                </div>
            </header>

            <main className="lesson-page">
                <Link to="/lessons" className="back-link">
                    ← Back to Lessons
                </Link>

                <section className="lesson-header">
                    <p className="eyebrow">LESSON 5 OF 5 • UKULELE</p>
                    <h1>Playing Your First Song</h1>
                    <p>
                        Put your new skills together by playing a
                        simple melody using your ukulele's open strings.
                    </p>
                </section>

                <div className="lesson-modes">
                    {["learn", "practice", "play"].map((item) => (
                        <button
                            key={item}
                            className={
                                mode === item ? "mode-button active" : "mode-button"
                            }
                            onClick={() => {
                                setMode(item);
                                setCurrentIndex(0);
                            }}
                        >
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </button>
                    ))}
                </div>

                {mode === "learn" && (
                    <>
                        <section className="lesson-content">
                            <div className="instrument-display">
                                <span>🪕</span>
                            </div>

                            <div className="lesson-section">
                                <h2>Your First Melody: First Steps</h2>
                                <p>
                                    You've learned how to hold, tune, and play
                                    your ukulele. Now it's time to put those
                                    skills together!
                                </p>
                                <p>
                                    First Steps is a short beginner melody
                                    that uses only open strings. You won't
                                    need to press any frets.
                                </p>
                            </div>

                            <div className="lesson-section">
                                <h2>Meet the Notes</h2>
                                <p>
                                    This melody uses the four open strings:
                                    C, E, G, and A.
                                </p>

                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "12px",
                                        margin: "20px 0",
                                    }}
                                >
                                    {uniqueNotes.map((note) => (
                                        <div
                                            key={note}
                                            style={{
                                                padding: "16px 24px",
                                                borderRadius: "12px",
                                                background: "#f1e8fa",
                                                color: "#333",
                                                fontWeight: "bold",
                                                fontSize: "1.2rem",
                                            }}
                                        >
                                            {note}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="lesson-section">
                                <h2>The Melody</h2>
                                <p>Play the following notes in order:</p>
                                <h3>C → E → G → A → G → E → C</h3>
                                <p>
                                    Pluck each string once and let it ring.
                                    Start slowly and try to keep a steady beat.
                                </p>
                            </div>

                            <div className="lesson-section">
                                <h2>Tips for Playing</h2>
                                <ol>
                                    <li>Make sure your ukulele is tuned.</li>
                                    <li>Hold the instrument comfortably.</li>
                                    <li>Pluck one string at a time.</li>
                                    <li>Keep a slow, steady rhythm.</li>
                                    <li>Repeat the melody until it feels natural.</li>
                                </ol>
                            </div>
                        </section>

                        <div className="lesson-next">
                            <button onClick={() => setMode("practice")}>
                                Start Practice →
                            </button>
                        </div>
                    </>
                )}

                {mode === "practice" && (
                    <>
                        <section className="lesson-content">
                            <div className="lesson-section">
                                <p className="eyebrow">PRACTICE THE NOTES</p>
                                <h2>Listen and Play</h2>
                                <p>
                                    Listen to each reference note, then
                                    find and play the matching open string
                                    on your ukulele.
                                </p>

                                {uniqueNotes.map((note) => {
                                    const noteData = MELODY.find(
                                        (item) => item.note === note
                                    );

                                    return (
                                        <div
                                            key={note}
                                            style={{
                                                padding: "20px",
                                                margin: "16px 0",
                                                border: "1px solid #ddd",
                                                borderRadius: "12px",
                                            }}
                                        >
                                            <h3>{noteData.string} String</h3>
                                            <p>Reference note: {note}</p>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "12px",
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                <button
                                                    className="complete-button"
                                                    disabled={isPlayingAudio}
                                                    onClick={() =>
                                                        playTone(noteData.frequency)
                                                    }
                                                >
                                                    ▶ Listen
                                                </button>

                                                <button
                                                    className="complete-button"
                                                    onClick={() => markPracticed(note)}
                                                >
                                                    {practicedNotes.includes(note)
                                                        ? "✓ Practiced"
                                                        : "Mark Practiced"}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                <p>
                                    Notes practiced: {practicedNotes.length} of{" "}
                                    {uniqueNotes.length}
                                </p>
                            </div>
                        </section>

                        {allNotesPracticed && (
                            <div className="lesson-next">
                                <button
                                    onClick={() => {
                                        setCurrentIndex(0);
                                        setMode("play");
                                    }}
                                >
                                    Continue to Play →
                                </button>
                            </div>
                        )}
                    </>
                )}

                {mode === "play" && (
                    <>
                        <section className="lesson-content">
                            <div className="lesson-section">
                                <p className="eyebrow">PLAY THE MELODY</p>
                                <h2>First Steps</h2>
                                <p>
                                    Play each note in order on your ukulele.
                                    After playing a note, press the button
                                    to move to the next one.
                                </p>

                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "10px",
                                        margin: "24px 0",
                                    }}
                                >
                                    {MELODY.map((item, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                padding: "14px 18px",
                                                borderRadius: "12px",
                                                background: playedSteps.includes(index)
                                                    ? "#d9f3e0"
                                                    : index === currentIndex
                                                        ? "#a66aeb"
                                                        : "#eee",
                                                color:
                                                    index === currentIndex &&
                                                        !playedSteps.includes(index)
                                                        ? "white"
                                                        : "#333",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {item.string}
                                        </div>
                                    ))}
                                </div>

                                <h3>
                                    Note {currentIndex + 1} of {MELODY.length}:{" "}
                                    {currentNote.string}
                                </h3>

                                <p>
                                    Pluck the open {currentNote.string} string.
                                </p>

                                <button
                                    className="complete-button"
                                    onClick={markPlayed}
                                    disabled={playedSteps.includes(currentIndex)}
                                >
                                    {playedSteps.includes(currentIndex)
                                        ? "✓ Played"
                                        : "Mark Note Played →"}
                                </button>

                                <p style={{ marginTop: "20px" }}>
                                    Notes completed: {playedSteps.length} of{" "}
                                    {MELODY.length}
                                </p>
                            </div>
                        </section>

                        {allStepsComplete && (
                            <section className="lesson-completion">
                                <h2>You Played Your First Song!</h2>
                                <p>
                                    Great job! You've completed the
                                    beginner ukulele lessons.
                                </p>

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "12px",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <button
                                        className="complete-button"
                                        onClick={resetSong}
                                    >
                                        Practice Again
                                    </button>

                                    <button
                                        className="complete-button"
                                        onClick={handleComplete}
                                    >
                                        Complete Lesson →
                                    </button>
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

export default FirstSong;
