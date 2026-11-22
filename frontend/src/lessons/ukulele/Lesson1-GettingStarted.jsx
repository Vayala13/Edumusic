import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useProgress } from "../../context/useProgress";

import "../violin/Lesson1-GettingStarted.css";

const PARTS = [
    {
        name: "Body",
        description:
            "The main wooden part of the ukulele. It helps amplify the sound made by the strings.",
    },
    {
        name: "Strings",
        description:
            "The four strings you strum or pluck to produce musical notes.",
    },
    {
        name: "Neck",
        description:
            "The long section connecting the body to the headstock. Your fretting hand supports this area.",
    },
    {
        name: "Fingerboard",
        description:
            "The surface along the neck where you press the strings to play different notes.",
    },
    {
        name: "Frets",
        description:
            "The metal strips across the fingerboard that help you locate different notes.",
    },
    {
        name: "Headstock",
        description:
            "The top section of the ukulele where the tuning pegs are attached.",
    },
    {
        name: "Tuning Pegs",
        description:
            "The controls used to adjust the tension and pitch of each string.",
    },
    {
        name: "Bridge",
        description:
            "The part on the body that anchors the strings in place.",
    },
    {
        name: "Sound Hole",
        description:
            "The opening on the body that allows sound to project outward.",
    },
];

function GettingStarted() {
    const [mode, setMode] = useState("learn");
    const { completeLesson } = useProgress();
    const navigate = useNavigate();

    const handleComplete = () => {
        completeLesson("ukulele", 1);
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
                    <span>🪕</span>
                </div>
            </header>

            <main className="lesson-page">
                <Link to="/lessons" className="back-link">
                    ← Back to Lessons
                </Link>

                <section className="lesson-header">
                    <p className="eyebrow">LESSON 1 OF 5 • UKULELE</p>
                    <h1>Getting Started</h1>
                    <p>Meet your ukulele and learn the basics.</p>
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

                {mode === "learn" && (
                    <LearnSection onNext={nextMode} />
                )}

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
    return (
        <>
            <section className="lesson-content">
                <div className="instrument-display">
                    <span>🪕</span>
                </div>

                <div className="lesson-section">
                    <h2>Meet Your Ukulele</h2>
                    <p>
                        The ukulele is a small, four-stringed instrument
                        known for its bright and cheerful sound. It is
                        commonly played by strumming or plucking the strings.
                        Before learning your first song, let's get familiar
                        with its parts and how to hold it.
                    </p>
                </div>

                <div className="lesson-section">
                    <h2>Explore the Parts</h2>
                    <p>
                        Read each description and try to locate the part
                        on your own ukulele.
                    </p>

                    <div className="parts-grid">
                        {PARTS.map((part) => (
                            <div className="part-card" key={part.name}>
                                <strong>🪕</strong>
                                <span>{part.name}</span>
                                <p>{part.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lesson-section">
                    <h2>How to Hold Your Ukulele</h2>
                    <p>
                        A comfortable position will make it easier to
                        practice chords and strumming.
                    </p>

                    <div className="lesson-section">
                        <h3>1. Relax Your Posture</h3>
                        <p>
                            Sit or stand upright with your shoulders relaxed.
                            Avoid hunching forward or tensing your arms.
                        </p>
                    </div>

                    <div className="lesson-section">
                        <h3>2. Position the Body</h3>
                        <p>
                            Hold the ukulele's body gently against your chest
                            or upper stomach, with the neck pointing toward
                            your left side if you play right-handed.
                        </p>
                    </div>

                    <div className="lesson-section">
                        <h3>3. Support the Neck</h3>
                        <p>
                            Use your left hand to support the neck while
                            keeping your fingers relaxed and ready to press
                            the strings.
                        </p>
                    </div>

                    <div className="lesson-section">
                        <h3>4. Position Your Strumming Hand</h3>
                        <p>
                            Place your right hand near the sound hole.
                            Keep your wrist relaxed so you can move
                            comfortably across the strings.
                        </p>
                    </div>
                </div>

                <div className="lesson-section">
                    <h2>Remember</h2>
                    <p>
                        You should be able to hold your ukulele comfortably
                        without squeezing it too tightly. Take your time
                        finding a position that feels natural.
                    </p>
                </div>
            </section>

            <div className="lesson-next">
                <button onClick={onNext}>
                    Practice Your Hold →
                </button>
            </div>
        </>
    );
}

function PracticeSection({ onNext }) {
    const [identified, setIdentified] = useState([]);
    const [steps, setSteps] = useState([
        false,
        false,
        false,
        false,
    ]);

    const holdingSteps = [
        "Sit or stand upright with relaxed shoulders.",
        "Hold the ukulele body gently against my torso.",
        "Support the neck with my fretting hand.",
        "Position my strumming hand near the sound hole.",
    ];

    const togglePart = (name) => {
        setIdentified((current) =>
            current.includes(name)
                ? current.filter((item) => item !== name)
                : [...current, name]
        );
    };

    const toggleStep = (index) => {
        setSteps((current) =>
            current.map((checked, i) =>
                i === index ? !checked : checked
            )
        );
    };

    return (
        <>
            <section className="practice-card">
                <p className="eyebrow">PARTS PRACTICE</p>
                <h2>Find the Parts</h2>
                <p>
                    Look at your ukulele and select each part after
                    you identify it. You can also use this activity
                    to review what you learned.
                </p>

                <div className="parts-grid">
                    {PARTS.map((part) => (
                        <button
                            key={part.name}
                            type="button"
                            className="part-card"
                            aria-pressed={identified.includes(part.name)}
                            onClick={() => togglePart(part.name)}
                        >
                            <strong>
                                {identified.includes(part.name) ? "✓" : "🪕"}
                            </strong>
                            <span>{part.name}</span>
                            <p>{part.description}</p>
                        </button>
                    ))}
                </div>

                <p className="practice-tip">
                    {identified.length} of {PARTS.length} parts identified
                </p>
            </section>

            <section className="practice-card">
                <p className="eyebrow">HOLDING PRACTICE</p>
                <h2>Build a Comfortable Position</h2>
                <p>
                    Follow these steps to practice holding your ukulele.
                    Check each step when you're ready.
                </p>

                <div className="play-checklist">
                    {holdingSteps.map((step, index) => (
                        <label key={step} className="play-task">
                            <input
                                type="checkbox"
                                checked={steps[index]}
                                onChange={() => toggleStep(index)}
                            />
                            <span>{step}</span>
                        </label>
                    ))}
                </div>

                <p className="practice-tip holding-practice-tip">
                    💡 Keep your shoulders and wrists relaxed.
                    Stop and adjust your position if you feel discomfort.
                </p>
            </section>

            <div className="lesson-next">
                <button onClick={onNext}>
                    Try the Challenge →
                </button>
            </div>
        </>
    );
}

function PlaySection({ onComplete }) {
    const tasks = [
        "I can identify the body, neck, and strings of my ukulele.",
        "I can locate the tuning pegs, frets, and sound hole.",
        "I can hold my ukulele comfortably with relaxed hands.",
    ];

    const [checks, setChecks] = useState(
        tasks.map(() => false)
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
                <p className="eyebrow">YOUR FIRST CHALLENGE</p>
                <h2>Ready, Ukulele Player?</h2>
                <p>
                    Complete these three tasks to check that you're
                    ready to move on to tuning your ukulele.
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
