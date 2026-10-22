import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useInstrument } from "../context/useInstrument";
import { useProgress } from "../context/useProgress";
import { lessons } from "../data/lessons";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./Profile.css";
import { usePracticeStats } from "../context/usePracticeStats";
import { useTheme } from "../context/useTheme";

// Preview colors only, for the little swatch dot below. They mirror the
// --accent / --page-bg values set for each theme in App.css and glass.css —
// keep the two in sync if a theme's colors change there.
const THEME_OPTIONS = [
  { value: "default", label: "Default", preview: "#f6b44b" },
  { value: "red", label: "Red", preview: "#ef4444" },
  { value: "green", label: "Green", preview: "#22c55e" },
  { value: "black", label: "Black", preview: "#0b0b0d" },
];

function Profile() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { instrument } = useInstrument();
  const { progress } = useProgress();
  const { theme, setTheme } = useTheme();

  const {
    stats,
    loadingStats,
    allNotesLearned,
    dayStreak,
  } = usePracticeStats();

  const [username, setUsername] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(true);
  const [usernameError, setUsernameError] = useState("");

  useEffect(() => {
    async function loadUsername() {
      if (!user) {
        setUsername("");
        setUsernameLoading(false);
        return;
      }

      setUsernameLoading(true);

      try {
        const profileRef = doc(db, "profiles", user.uid);
        const profileSnapshot = await getDoc(profileRef);

        const savedUsername = profileSnapshot.exists()
          ? profileSnapshot.data().username
          : "";

        const initialUsername =
          savedUsername || user.email?.split("@")[0] || "Musician";

        setUsername(initialUsername);
        setUsernameInput(initialUsername);
      } catch (error) {
        console.error("Error loading username:", error);
        setUsernameError("Could not load your username.");
      } finally {
        setUsernameLoading(false);
      }
    }

    loadUsername();
  }, [user]);

  async function handleSaveUsername() {
    const trimmedUsername = usernameInput.trim();

    if (!trimmedUsername) {
      setUsernameError("Username cannot be empty.");
      return;
    }

    if (!user) return;

    setUsernameError("");

    try {
      const profileRef = doc(db, "profiles", user.uid);

      await setDoc(
        profileRef,
        { username: trimmedUsername },
        { merge: true }
      );

      setUsername(trimmedUsername);
      setEditingUsername(false);
    } catch (error) {
      console.error("Error saving username:", error);
      setUsernameError("Could not save your username. Please try again.");
    }
  }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const currentLessons = lessons[instrument];

  const instrumentName =
    instrument === "violin"
      ? "Violin"
      : "Trumpet";

  const instrumentIcon =
    instrument === "violin"
      ? "🎻"
      : "🎺";

  const completedLessons =
    progress[instrument]?.length || 0;

  const totalLessons = currentLessons.length;

  const progressPercentage = Math.round(
    (completedLessons / totalLessons) * 100
  );

  return (
    <div className="app">
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
            {editingUsername ? (
              <div>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  maxLength={30}
                  placeholder="Enter username"
                />
                <button onClick={handleSaveUsername} disabled={usernameLoading}>
                  Save
                </button>
                <button
                  onClick={() => {
                    setUsernameInput(username);
                    setUsernameError("");
                    setEditingUsername(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <h2>{usernameLoading ? "Loading..." : username}</h2>
                <button
                  onClick={() => {
                    setUsernameInput(username);
                    setUsernameError("");
                    setEditingUsername(true);
                  }}
                  disabled={usernameLoading}
                >
                  Edit username
                </button>
              </div>
            )}
            {usernameError && <p role="alert">{usernameError}</p>}
            <p>Beginner Musician</p>
          </div>
        </section>

        <section className="profile-stats">
          <div className="stat-card">
            <span className="stat-icon">🔥</span>
            <div>
              <h3>{loadingStats ? "..." : dayStreak}</h3>
              <p>Day Streak</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">⭐</span>
            <div>
              <h3>{loadingStats ? "..." : stats.xp}</h3>
              <p>XP Earned</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🎵</span>
            <div>
              <h3>{loadingStats ? "..." : allNotesLearned}</h3>
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
              {instrumentIcon}
            </div>

            <div className="instrument-progress-info">
              <div className="instrument-progress-header">
                <div>
                  <h3>{instrumentName}</h3>
                  <p>Level 1 • Beginner</p>
                </div>

                <span>{progressPercentage}%</span>
              </div>

              <div className="profile-progress-bar">
                <div className="profile-progress-fill"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                ></div>
              </div>
              <p className="profile-lesson-count">
                {completedLessons} of {totalLessons} lessons completed
              </p>
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

        <section className="profile-section">
          <div className="section-title">
            <h2>Appearance</h2>
            <p>Choose a background theme for the app.</p>
          </div>

          <div className="theme-swatches">
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={
                  "theme-swatch theme-swatch-" +
                  option.value +
                  (theme === option.value ? " selected" : "")
                }
                onClick={() => setTheme(option.value)}
                aria-pressed={theme === option.value}
              >
                <span
                  className="theme-swatch-preview"
                  style={{ background: option.preview }}
                  aria-hidden="true"
                />
                <span className="theme-swatch-label">{option.label}</span>
              </button>
            ))}
          </div>
        </section>

      </main>
      <section className="logout-section">
        <button onClick={handleLogout} className="logout-button">
          🚪 Log Out
        </button>
      </section>
      <Navbar />
    </div>
  );
}

export default Profile;
