import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useProgress } from "../../context/useProgress";

import "../violin/Lesson1-GettingStarted.css";
import "../violin/Lesson2-Tuning.css";

const STRINGS = [
    { note: "G", pitch: "G4", frequency: 392 },
    { note: "C", pitch: "C4", frequency: 261.63 },
    { note: "E", pitch: "E4", frequency: 329.63 },
    { note: "A", pitch: "A4", frequency: 440 },
];

const TUNING_STEPS = [
    "I can identify the four ukulele strings.",
    "I know how to use the tuning pegs.",
    "I can recognize when a string sounds too high or too low.",
    "I have checked the tuning of all four strings.",
];

function Tuning() {
    const [mode, setMode] = useState("learn");
    const { completeLesson } = useProgress();
    const navigate = useNavigate();

    const handleComplete = () => {
        completeLesson("ukulele", 2);
        navigate("/lessons");
    };

    return (
        <div className="app">
            <header className="top-bar">
                <div className="logo">Tuning Your Ukulele</div>
                <div className="profile"><span>🪕</span></div>
            </header>

            <main className="lesson-page">
                <Link to="/lessons" className="back-link">
                    ← Back to Lessons
                </Link>

                <section className="lesson-header">
                    <p className="eyebrow">LESSON 2 OF 5 • UKULELE</p>
                    <h1>Tuning Your Ukulele</h1>
                    <p>
                        Learn how to tune your ukulele using the standard
                        G–C–E–A tuning.
                    </p>
                </section>

                <div className="lesson-modes">
                    {["learn", "practice", "play"].map((item) => (
                        <button
                            key={item}
                            className={
                                mode === item ? "mode-button active" : "mode-button"
                            }
                            onClick={() => setMode(item)}
                        >
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </button>
                    ))}
                </div>

                {mode === "learn" && (
                    <LearnSection onNext={() => setMode("practice")} />
                )}
                {mode === "practice" && (
                    <PracticeSection onNext={() => setMode("play")} />
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
                    <span>🪕</span>
                </div>

                <div className="lesson-section">
                    <h2>Why Is Tuning Important?</h2>
                    <p>
                        Tuning makes sure each string produces the correct
                        note. When your ukulele is properly tuned, chords
                        and songs will sound clearer and more accurate.
                        It's a good idea to check your tuning before
                        every practice session.
                    </p>
                </div>

                <div className="lesson-section">
                    <h2>Meet the Four Strings</h2>
                    <p>
                        Most beginner ukuleles use standard high-G tuning:
                        G, C, E, and A. These names describe the strings
                        in order from the string closest to your face
                        down to the string closest to the floor when
                        holding a right-handed ukulele normally.
                    </p>

                    <div className="parts-grid">
                        {STRINGS.map((string) => (
                            <div className="part-card" key={string.note}>
                                <strong>{string.note}</strong>
                                <span>{string.pitch}</span>
                                <p>Standard tuning note</p>
                            </div>
                        ))}
                    </div>

                    <p style={{ marginTop: "16px" }}>
                        Unlike some instruments, the G string on a
                        standard high-G ukulele is not the lowest-pitched
                        string. The C string produces the lowest pitch.
                    </p>
                </div>

                <div className="lesson-section">
                    <h2>How Do Tuning Pegs Work?</h2>
                    <p>
                        The tuning pegs are located on the headstock.
                        Turning a peg changes the tension of its string.
                        Tightening a string raises its pitch, while
                        loosening it lowers the pitch.
                    </p>
                </div>

                <div className="lesson-section">
                    <h2>How to Tune Your Ukulele</h2>

                    <div className="lesson-section">
                        <h3>1. Choose a String</h3>
                        <p>
                            Start with the G string and pluck it gently.
                        </p>
                    </div>

                    <div className="lesson-section">
                        <h3>2. Listen to the Target Note</h3>
                        <p>
                            Use a reference tone or a tuner to hear
                            the pitch you are trying to match.
                        </p>
                    </div>

                    <div className="lesson-section">
                        <h3>3. Adjust the Tuning Peg</h3>
                        <p>
                            Turn the correct peg slowly while plucking
                            the string. Make small adjustments to avoid
                            tightening the string too much.
                        </p>
                    </div>

                    <div className="lesson-section">
                        <h3>4. Repeat for Every String</h3>
                        <p>
                            Check G, C, E, and A. After tuning all four,
                            check them again because adjusting one string
                            can slightly affect the others.
                        </p>
                    </div>
                </div>

                <div className="lesson-section">
                    <h2>Remember</h2>
                    <p>
                        Always make small tuning adjustments. If a
                        string feels unusually tight, stop rather than
                        forcing it. Tuning becomes easier with practice.
                    </p>
                </div>
            </section>

            <div className="lesson-next">
                <button onClick={onNext}>
                    Start Practice →
                </button>
            </div>
        </>
    );
}

function PracticeSection({ onNext }) {
    const [selected, setSelected] = useState([]);
    const [activeNote, setActiveNote] = useState(null);

    const playNote = async (string) => {
        try {
            const AudioContextClass =
                window.AudioContext || window.webkitAudioContext;

            if (!AudioContextClass) {
                throw new Error("Audio playback is not supported.");
            }

            const context = new AudioContextClass();
            await context.resume();

            const oscillator = context.createOscillator();
            const gain = context.createGain();

            oscillator.type = "triangle";
            oscillator.frequency.value = string.frequency;

            gain.gain.setValueAtTime(0.0001, context.currentTime);
            gain.gain.exponentialRampToValueAtTime(
                0.2, context.currentTime + 0.04
            );
            gain.gain.setValueAtTime(
                0.2, context.currentTime + 0.8
            );
            gain.gain.exponentialRampToValueAtTime(
                0.0001, context.currentTime + 1.1
            );

            oscillator.connect(gain);
            gain.connect(context.destination);

            setActiveNote(string.note);

            oscillator.start();
            oscillator.stop(context.currentTime + 1.15);

            oscillator.onended = () => {
                setActiveNote(null);
                context.close().catch(() => { });
            };
        } catch (error) {
            window.alert(error.message || "Unable to play the note.");
        }
    };

    const toggleString = (note) => {
        setSelected((current) =>
            current.includes(note)
                ? current.filter((item) => item !== note)
                : [...current, note]
        );
    };

    return (
        <>
            <section className="practice-card">
                <p className="eyebrow">TUNING PRACTICE</p>
                <h2>Listen to Each String</h2>
                <p>
                    Press Play to hear the correct pitch for each
                    string. Then pluck the matching string on
                    your ukulele and compare the sounds.
                </p>

                <div className="parts-grid">
                    {STRINGS.map((string) => (
                        <div className="part-card" key={string.note}>
                            <strong>{string.note}</strong>
                            <span>{string.pitch}</span>
                            <button
                                type="button"
                                className="lesson-action-primary"
                                onClick={() => playNote(string)}
                            >
                                {activeNote === string.note
                                    ? "Playing…"
                                    : `▶ Play ${string.note}`}
                            </button>
                            <button
                                type="button"
                                className="lesson-action-secondary"
                                onClick={() => toggleString(string.note)}
                            >
                                {selected.includes(string.note)
                                    ? "✓ Practiced"
                                    : "Mark Practiced"}
                            </button>
                        </div>
                    ))}
                </div>

                <p className="practice-tip">
                    Strings practiced: {selected.length} of {STRINGS.length}
                </p>
            </section>

            <div className="lesson-next">
                <button onClick={onNext}>
                    Continue to Play →
                </button>
            </div>
        </>
    );
}

function PlaySection({ onComplete }) {
    const [checks, setChecks] = useState(
        TUNING_STEPS.map(() => false)
    );
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
                <p className="eyebrow">TUNING CHALLENGE</p>
                <h2>Tune All Four Strings</h2>
                <p>
                    Use the reference notes from Practice and
                    a tuner if needed. Check off each task
                    when you've completed it.
                </p>

                <div className="play-checklist">
                    {TUNING_STEPS.map((step, index) => (
                        <label className="play-task" key={step}>
                            <input
                                type="checkbox"
                                checked={checks[index]}
                                onChange={() => toggleCheck(index)}
                            />
                            <span>{step}</span>
                        </label>
                    ))}
                </div>

                <div className="play-status">
                    {allComplete
                        ? "✓ Tuning challenge complete!"
                        : `${checks.filter(Boolean).length} of ${TUNING_STEPS.length} tasks complete`}
                </div>
            </section>

            <div className="lesson-completion">
                <p>
                    {allComplete
                        ? "Great job! You're ready for Lesson 3."
                        : "Complete all four tasks to finish this lesson."}
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
