import Navbar from "../components/Navbar";
import "./Profile.css";

function Profile() {
  return (
    <div className="app">
      <header className="top-bar">
        <div className="logo">Profile</div>
        <div className="profile">
          <span>👤</span>
        </div>
      </header>

      <main className="profile-page">
        <section className="profile-intro">
          <p className="eyebrow">MY ACCOUNT</p>
          <h1>Profile</h1>
          <p>View your learning progress and achievements.</p>
        </section>

        <section className="profile-card">
          <div className="profile-avatar">
            👤
          </div>

          <div className="profile-info">
            <h2>UserName</h2>
            <p>Beginner Musician</p>
          </div>
        </section>

        <section className="profile-stats">
          <div className="stat-card">
            <span className="stat-icon">🔥</span>
            <div>
              <h3>7</h3>
              <p>Day Streak</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">⭐</span>
            <div>
              <h3>3</h3>
              <p>Level</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🎵</span>
            <div>
              <h3>0</h3>
              <p>Notes Learned</p>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <div className="section-title">
            <h2>My Instruments</h2>
            <p>Track your progress for each instrument.</p>
          </div>

          <div className="instrument-progress-card">
            <div className="instrument-icon">
              🎺
            </div>

            <div className="instrument-progress-info">
              <div className="instrument-progress-header">
                <div>
                  <h3>Trumpet</h3>
                  <p>Level 1 • Beginner</p>
                </div>

                <span>0%</span>
              </div>

              <div className="profile-progress-bar">
                <div className="profile-progress-fill"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <div className="section-title">
            <h2>Achievements</h2>
            <p>Celebrate your progress as you learn.</p>
          </div>

          <div className="achievements-grid">
            <div className="achievement-card">
              <div className="achievement-icon">🎵</div>
              <div>
                <h3>First Note</h3>
                <p>Play your first note.</p>
              </div>
            </div>

            <div className="achievement-card">
              <div className="achievement-icon">📚</div>
              <div>
                <h3>First Lesson</h3>
                <p>Complete your first lesson.</p>
              </div>
            </div>

            <div className="achievement-card">
              <div className="achievement-icon">🔥</div>
              <div>
                <h3>Practice Starter</h3>
                <p>Complete your first practice session.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Navbar />
    </div>
  );
}

export default Profile;
