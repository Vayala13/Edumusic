import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useInstrument } from "../context/useInstrument";
import { useProgress } from "../context/useProgress";
import { lessons } from "../data/lessons";
import "./Closet.css";

function Closet() {
  const { instrument, changeInstrument } = useInstrument();
  const { progress } = useProgress();

  const getInstrumentProgress = (instrumentName) => {
    const totalLessons = lessons[instrumentName]?.length || 0;
    const completedLessons =
      progress[instrumentName]?.length || 0;

    if (totalLessons === 0) {
      return 0;
    }

    return Math.round(
      (completedLessons / totalLessons) * 100
    );
  };

  const violinProgress = getInstrumentProgress("violin");
  const trumpetProgress = getInstrumentProgress("trumpet");

  const currentProgress =
    instrument === "violin"
      ? violinProgress
      : trumpetProgress;

  const currentCompletedLessons =
    progress[instrument]?.length || 0;

  const currentTotalLessons =
    lessons[instrument]?.length || 0;

  const instrumentName =
    instrument === "violin"
      ? "Violin"
      : "Trumpet";

  const instrumentIcon =
    instrument === "violin"
      ? "🎻"
      : "🎺";


  return (
    <div className="app">
      <header className="top-bar">
        <div className="logo">Your Closet</div>

        <div className="profile">
          <span>🎒</span>
        </div>
      </header>

      <main className="closet-page">

        <section className="closet-intro">
          <p className="eyebrow">MY INSTRUMENTS</p>
          <h1>Your Closet</h1>
          <p>Select an instrument to start learning.</p>
        </section>

        {/* Currently selected instrument */}
        <section className="current-instrument">
          <div className="instrument-image">
            {instrumentIcon}
          </div>

          <div className="instrument-info">
            <h2>
              {instrumentName}
            </h2>

            <p>Level 1 • Beginner</p>

            <div className="instrument-progress">
              <div className="closet-progress">
                <div className="progress-fill"
                style={{
                  width: `${currentProgress}%`,
                }}
                ></div>
              </div>

              <span>
                {currentProgress}%
              </span>
            </div>
            <p className="closet-lesson-count">
              {currentCompletedLessons} of {currentTotalLessons} lessons completed
            </p>
          </div>

          <Link to="/" className="instrument-button">
            →
          </Link>
        </section>

        {/* Instrument selection */}
        <section className="other-instruments">
          <h2 className="section-heading">My Instruments</h2>

          <div className="instrument-grid">

            {/* Violin */}
            <button
              className={`instrument-card ${
                instrument === "violin" ? "selected" : ""
              }`}
              onClick={() => changeInstrument("violin")}
            >
              <span className="instrument-card-icon">🎻</span>

              <div>
                <h3>Violin</h3>
                <p>Level 1 • {violinProgress}%</p>
              </div>

              {instrument === "violin" && (
                <span className="selected-label">Selected</span>
              )}
            </button>

            {/* Trumpet */}
            <button
              className={`instrument-card ${
                instrument === "trumpet" ? "selected" : ""
              }`}
              onClick={() => changeInstrument("trumpet")}
            >
              <span className="instrument-card-icon">🎺</span>

              <div>
                <h3>Trumpet</h3>
                <p>Level 1 • {trumpetProgress}%</p>
              </div>

              {instrument === "trumpet" && (
                <span className="selected-label">Selected</span>
              )}
            </button>

          </div>
        </section>

      </main>

      <Navbar />
    </div>
  );
}

export default Closet;