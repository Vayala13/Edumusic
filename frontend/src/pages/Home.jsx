import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useInstrument } from "../context/InstrumentContext";
import { useProgress } from "../context/ProgressContext";
import { lessons } from "../data/lessons";
import "./Home.css";

function Home() {
  const { instrument } = useInstrument();
  const { isLessonCompleted } = useProgress();

  const isViolin = instrument === "violin";

  const instrumentName = isViolin ? "Violin" : "Trumpet";
  const instrumentIcon = isViolin ? "🎻" : "🎺";

  const currentLessons = lessons[instrument];

  // Finds the first lesson that has not been completed
  const currentLesson =
    currentLessons.find(
      (lesson) =>
        !isLessonCompleted(instrument, lesson.number)
    ) || currentLessons[currentLessons.length - 1];

  return (
    <div className="app">

      <header className="top-bar">
        <div className="logo">Edumusic</div>

        <div className="profile">
          <span>🔥 7(whenever streak gets implemented)</span> {/* reminders */}
          <span>⭐ Level 3(whenever xp system goes in)</span>
          <span>👤</span>
        </div>
      </header>

      <main className="home">

        <section className="welcome">

          <p className="eyebrow">
            YOUR INSTRUMENT
          </p>

          <h1>
            {instrumentIcon} {instrumentName}
          </h1>

          <p>
            Level 1 • Beginner
          </p>

        </section>

        <section className="continue-card">

          <div>

            <p className="eyebrow">
              CONTINUE LESSON
            </p>

            <h2>
              {currentLesson.title}
            </h2>

            <p>
              Lesson {currentLesson.number} •{" "}
              {currentLesson.description}
            </p>

          </div>

          <Link
            to={currentLesson.link}
            className="continue-button"
          >
            →
          </Link>

        </section>

        <section className="quick-actions">

          <h2>Quick Tools</h2>

          <div className="action-grid">

            <Link
              to="/tuner"
              className="action-button"
            >
              <span className="action-icon">
                🎵
              </span>

              <span>
                Tuner
              </span>
            </Link>

            <Link
              to="/metronome"
              className="action-button"
            >
              <span className="action-icon">
                ♩
              </span>

              <span>
                Metronome
              </span>
            </Link>

          </div>

        </section>

      </main>

      <Navbar />

    </div>
  );
}

export default Home;