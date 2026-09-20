import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useInstrument } from "../context/useInstrument";
import "./Closet.css";

function Closet() {
  const { instrument, changeInstrument } = useInstrument();

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
            {instrument === "violin" ? "🎻" : "🎺"}
          </div>

          <div className="instrument-info">
            <h2>
              {instrument === "violin" ? "Violin" : "Trumpet"}
            </h2>

            <p>Level 1 • Beginner</p>

            <div className="instrument-progress">
              <div className="closet-progress">
                <div className="progress-fill"></div>
              </div>

              <span>
                {instrument === "violin" ? "40%" : "0%"}
              </span>
            </div>
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
                <p>Level 1 • 40%</p>
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
                <p>Level 1 • 0%</p>
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