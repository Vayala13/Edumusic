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

  const instruments = [
    { id: "violin", name: "Violin", icon: "🎻" },
    { id: "trumpet", name: "Trumpet", icon: "🎺" },
    { id: "guitar", name: "Guitar", icon: "🎸" },
    { id: "ukulele", name: "Ukulele", icon: "🪕" },
  ];

  const currentInstrument =
    instruments.find((item) => item.id === instrument) ||
    instruments[0];

  const currentProgress = getInstrumentProgress(instrument);
  const currentCompletedLessons =
    progress[instrument]?.length || 0;
  const currentTotalLessons =
    lessons[instrument]?.length || 0;

  return (
    <div className="app">
      <main className="closet-page">
        <section className="closet-intro">
          <p className="eyebrow">MY INSTRUMENTS</p>
          <h1>Your Closet</h1>
          <p>Select an instrument to start learning.</p>
        </section>

        {/* Currently selected instrument */}
        <section className="current-instrument">
          <div className="instrument-image">
            {currentInstrument.icon}
          </div>

          <div className="instrument-info">
            <h2>{currentInstrument.name}</h2>

            <p>Level 1 • Beginner</p>

            <div className="instrument-progress">
              <div className="closet-progress">
                <div
                  className="progress-fill"
                  style={{
                    width: `${currentProgress}%`,
                  }}
                />
              </div>

              <span>{currentProgress}%</span>
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
            {instruments.map((item) => {
              const itemProgress = getInstrumentProgress(item.id);

              return (
                <button
                  key={item.id}
                  className={`instrument-card ${instrument === item.id ? "selected" : ""
                    }`}
                  onClick={() => changeInstrument(item.id)}
                >
                  <span className="instrument-card-icon">
                    {item.icon}
                  </span>

                  <div>
                    <h3>{item.name}</h3>
                    <p>Level 1 • {itemProgress}%</p>
                  </div>

                  {instrument === item.id && (
                    <span className="selected-label">
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </main>

      <Navbar />
    </div>
  );
}

export default Closet;
