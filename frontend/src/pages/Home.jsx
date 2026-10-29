import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useInstrument } from "../context/useInstrument";
import { useProgress } from "../context/useProgress";
import { lessons } from "../data/lessons";
import { usePracticeStats } from "../context/usePracticeStats";
import "./Home.css";

function Home() {
  const { instrument } = useInstrument();
  const { isLessonCompleted } = useProgress();

  const {
    stats,
    loadingStats,
    dayStreak,
  } = usePracticeStats();

  const xp = stats?.xp ?? 0;
  const level = Math.floor(xp / 100) + 1;

  const instrumentDetails = {
    violin: { name: "Violin", icon: "🎻" },
    trumpet: { name: "Trumpet", icon: "🎺" },
    guitar: { name: "Guitar", icon: "🎸" },
    ukulele: { name: "Ukulele", icon: "🪕" },
  };

  const currentInstrument = instrumentDetails[instrument] || instrumentDetails.violin;
  const instrumentName = currentInstrument.name;
  const instrumentIcon = currentInstrument.icon;

  const currentLessons = lessons[instrument] || [];

  // Finds the first lesson that has not been completed
  const currentLesson =
    currentLessons.find(
      (lesson) =>
        !isLessonCompleted(instrument, lesson.number)
    ) || currentLessons[currentLessons.length - 1] || null;

  return (
    <div className="app">

      <header className="top-bar">
        <div className="logo">Edumusic</div>

        <div className="profile">
          <span>🔥 {loadingStats ? "…" : dayStreak} day streak </span>
          <span>⭐ {loadingStats ? "…" : `Level ${level} · ${xp} XP`}</span>
          <Link to="/profile" className="profile-link" aria-label="Go to your profile">
            👤
          </Link>
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
          {currentLesson ? (
            <>
              <div>
                <p className="eyebrow">CONTINUE LESSON</p>
                <h2>{currentLesson.title}</h2>
                <p>
                  Lesson {currentLesson.number} • {currentLesson.description}
                </p>
              </div>

              <Link to={currentLesson.link} className="continue-button">
                →
              </Link>
            </>
          ) : (
            <div>

              <p className="eyebrow">LESSONS</p>
              <h2>No lessons available yet</h2>
              <p>
                  Beginner lessons for this instrument will be added soon.
                  Try selecting Violin or Trumpet.
              </p>
              <Link to="/closet" className="continue-button">
                Choose instrument
              </Link>
            </div>
          )}
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
