import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useProgress } from "../../context/useProgress";

import "../violin/Lesson1-GettingStarted.css";

const CHORDS = [
    {
        name: "C",
        fullName: "C Major",
        frets: [0, 0, 0, 3],
        description: "A great first chord because it only needs one finger.",
        instructions: [
            "Place your ring finger on the 3rd fret of the A string.",
            "Leave the G, C, and E strings open.",
            "Strum all four strings gently.",
        ],
    },
    {
        name: "F",
        fullName: "F Major",
        frets: [2, 0, 1, 0],
        description: "This chord uses two fingers.",
        instructions: [
            "Place your middle finger on the 2nd fret of the G string.",
            "Place your index finger on the 1st fret of the E string.",
            "Leave the C and A strings open, then strum.",
        ],
    },
    {
        name: "G7",
        fullName: "G7",
        frets: [0, 2, 1, 2],
        description: "This chord uses three fingers.",
        instructions: [
            "Place your middle finger on the 2nd fret of the C string.",
            "Place your index finger on the 1st fret of the E string.",
            "Place your ring finger on the 2nd fret of the A string.",
            "Leave the G string open and strum.",
        ],
    },
];

const STRUM_PATTERN = ["Down", "Down", "Up", "Up", "Down", "Up"];

function ChordDiagram({ chord }) {
    const strings = ["G", "C", "E", "A"];
    const xPositions = [75, 115, 155, 195];
    const yPositions = [55, 90, 125, 160];

    return (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
            <svg
                viewBox="0 0 270 215"
                width="270"
                style={{ maxWidth: "100%" }}
                role="img"
                aria-label={`${chord.name} chord diagram`}
            >
                {strings.map((string, index) => (
                    <g key={string}>
                        <text
                            x={xPositions[index]}
                            y="22"
                            textAnchor="middle"
                            fill="currentColor"
                            fontSize="15"
                        >
                            {string}
                        </text>
                        <line
                            x1={xPositions[index]}
                            y1="45"
                            x2={xPositions[index]}
                            y2="170"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                        {chord.frets[index] === 0 && (
                            <circle
                                cx={xPositions[index]}
                                cy="35"
                                r="6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                        )}
                    </g>
                ))}

                {[45, ...yPositions].map((y, index) => (
                    <line
                        key={y}
                        x1="75"
                        y1={y}
                        x2="195"
                        y2={y}
                        stroke="currentColor"
                        strokeWidth={index === 0 ? 5 : 1.5}
                    />
                ))}

                {chord.frets.map((fret, index) =>
                    fret > 0 ? (
                        <g key={index}>
                            <circle
                                cx={xPositions[index]}
                                cy={45 + (fret - 0.5) * 35}
                                r="12"
                                fill="#a66aeb"
                            />
                            <text
                                x={xPositions[index]}
                                y={50 + (fret - 0.5) * 35}
                                textAnchor="middle"
                                fontSize="12"
                                fontWeight="bold"
                                fill="white"
                            >
                                {fret}
                            </text>
                        </g>
                    ) : null
                )}
            </svg>
            <p style={{ fontSize: "0.9rem", marginTop: "4px" }}>
                Open circles mean you play the string without pressing a fret.
            </p>
        </div>
    );
}

function BasicChords() {
    const [mode, setMode] = useState("learn");
    const [currentChordIndex, setCurrentChordIndex] = useState(0);
    const [practicedChords, setPracticedChords] = useState([]);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [strumIndex, setStrumIndex] = useState(0);

    const { completeLesson } = useProgress();
    const navigate = useNavigate();

    const currentChord = CHORDS[currentChordIndex];

    const markPracticed = () => {
        setPracticedChords((previous) =>
            previous.includes(currentChord.name)
                ? previous
                : [...previous, currentChord.name]
        );
    };

    const markStepComplete = (step) => {
        setCompletedSteps((previous) =>
            previous.includes(step)
                ? previous.filter((item) => item !== step)
                : [...previous, step]
        );
    };

    const handleComplete = () => {
        completeLesson("ukulele", 4);
        navigate("/lessons");
    };

    const playSteps = [
        "Play the C chord four times.",
        "Switch to F and play it four times.",
        "Switch to G7 and play it four times.",
        "Practice switching between C, F, and G7.",
        "Play the strumming pattern while holding a chord.",
    ];

    const allStepsComplete = completedSteps.length === playSteps.length;

    return (
        <div className="app">
            <header className="top-bar">
                <div className="logo">Basic Chords and Strumming</div>
                <div className="profile">
                    <span>🪕</span>
                </div>
            </header>

            <main className="lesson-page">
                <Link to="/lessons" className="back-link">
                    ← Back to Lessons
                </Link>

                <section className="lesson-header">
                    <p className="eyebrow">LESSON 4 OF 5 • UKULELE</p>
                    <h1>Basic Chords and Strumming</h1>
                    <p>
                        Learn three beginner-friendly ukulele chords
                        and practice your first strumming pattern.
                    </p>
                </section>

                <div className="lesson-modes">
                    {["learn", "practice", "play"].map((item) => (
                        <button
                            key={item}
                            className={mode === item ? "mode-button active" : "mode-button"}
                            onClick={() => setMode(item)}
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
                                <h2>What Is a Chord?</h2>
                                <p>
                                    A chord is a group of notes played together.
                                    On the ukulele, you create chords by pressing
                                    certain strings against the frets and strumming.
                                </p>
                                <p>
                                    We'll start with three common chords:
                                    C Major, F Major, and G7.
                                </p>
                            </div>

                            {CHORDS.map((chord) => (
                                <div className="lesson-section" key={chord.name}>
                                    <h2>{chord.fullName} Chord</h2>
                                    <p>{chord.description}</p>

                                    <ChordDiagram chord={chord} />

                                    <ol>
                                        {chord.instructions.map((instruction, index) => (
                                            <li key={index}>{instruction}</li>
                                        ))}
                                    </ol>
                                </div>
                            ))}

                            <div className="lesson-section">
                                <h2>Basic Strumming</h2>
                                <p>
                                    Strumming means brushing your fingers
                                    across the strings to play a chord.
                                </p>
                                <p>
                                    A down strum moves toward the floor.
                                    An up strum moves toward your face.
                                </p>
                                <p>
                                    Try this pattern slowly:
                                </p>
                                <h3>Down – Down – Up – Up – Down – Up</h3>
                                <p>
                                    Keep a steady rhythm and relax your wrist.
                                    Start slowly before increasing your speed.
                                </p>
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
                                <p className="eyebrow">CHORD PRACTICE</p>
                                <h2>Practice the {currentChord.name} Chord</h2>
                                <p>{currentChord.description}</p>

                                <ChordDiagram chord={currentChord} />

                                <ol>
                                    {currentChord.instructions.map((instruction, index) => (
                                        <li key={index}>{instruction}</li>
                                    ))}
                                </ol>

                                <button
                                    className="complete-button"
                                    onClick={markPracticed}
                                >
                                    {practicedChords.includes(currentChord.name)
                                        ? "✓ Practiced"
                                        : "Mark Practiced"}
                                </button>

                                <div className="lesson-next">
                                    <button
                                        onClick={() =>
                                            setCurrentChordIndex(
                                                (index) => (index + 1) % CHORDS.length
                                            )
                                        }
                                    >
                                        {currentChordIndex === CHORDS.length - 1
                                            ? "Back to C →"
                                            : "Next Chord →"}
                                    </button>
                                </div>

                                <p>
                                    Chords practiced: {practicedChords.length} of {CHORDS.length}
                                </p>
                            </div>

                            <div className="lesson-section">
                                <h2>Strumming Practice</h2>
                                <p>
                                    Hold the C chord and practice the following
                                    pattern one strum at a time.
                                </p>

                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "12px",
                                        margin: "20px 0",
                                    }}
                                >
                                    {STRUM_PATTERN.map((strum, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                padding: "14px 18px",
                                                borderRadius: "12px",
                                                background:
                                                    index === strumIndex ? "#a66aeb" : "#eee",
                                                color:
                                                    index === strumIndex ? "white" : "#333",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {strum} {strum === "Down" ? "↓" : "↑"}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className="complete-button"
                                    onClick={() =>
                                        setStrumIndex(
                                            (index) => (index + 1) % STRUM_PATTERN.length
                                        )
                                    }
                                >
                                    Next Strum →
                                </button>
                            </div>
                        </section>

                        {practicedChords.length === CHORDS.length && (
                            <div className="lesson-next">
                                <button onClick={() => setMode("play")}>
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
                                <p className="eyebrow">PUT IT ALL TOGETHER</p>
                                <h2>Play Your First Chord Progression</h2>
                                <p>
                                    Now practice switching between the three
                                    chords while keeping a steady rhythm.
                                </p>

                                <h3>C → F → G7 → C</h3>

                                <p>
                                    Complete each activity and check it off
                                    when you feel comfortable.
                                </p>

                                {playSteps.map((step, index) => (
                                    <label
                                        key={index}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "12px",
                                            margin: "16px 0",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={completedSteps.includes(index)}
                                            onChange={() => markStepComplete(index)}
                                        />
                                        <span>{step}</span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {allStepsComplete && (
                            <section className="lesson-completion">
                                <h2>Great job!</h2>
                                <p>
                                    You've practiced three ukulele chords
                                    and a basic strumming pattern.
                                </p>
                                <button
                                    className="complete-button"
                                    onClick={handleComplete}
                                >
                                    Complete Lesson →
                                </button>
                            </section>
                        )}
                    </>
                )}
            </main>

            <Navbar />
        </div>
    );
}

export default BasicChords;
