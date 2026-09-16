import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useInstrument } from "../context/InstrumentContext";
import { useProgress } from "../context/ProgressContext";
import { lessons } from "../data/lessons";
import "./Lessons.css";

function Lessons() {
  const { instrument } = useInstrument();
  const { isLessonCompleted } = useProgress();

  const currentLessons = lessons[instrument];

  const instrumentName =
    instrument === "violin" ? "Violin" : "Trumpet";

  const instrumentIcon =
    instrument === "violin" ? "🎻" : "🎺";

  // Determine each lesson's status from saved progress
  const lessonStatuses = currentLessons.map((lesson, index) => {
    const completed = isLessonCompleted(
      instrument,
      lesson.number
    );

    if (completed) {
      return {
        ...lesson,
        status: "completed",
      };
    }

    // First incomplete lesson is the current lesson
    const previousLessonsCompleted = currentLessons
      .slice(0, index)
      .every((previousLesson) =>
        isLessonCompleted(
          instrument,
          previousLesson.number
        )
      );

    if (previousLessonsCompleted) {
      return {
        ...lesson,
        status: "current",
      };
    }

    return {
      ...lesson,
      status: "locked",
    };
  });

  const completedLessons = lessonStatuses.filter(
    (lesson) => lesson.status === "completed"
  ).length;

  const progress = Math.round(
    (completedLessons / currentLessons.length) * 100
  );

  return (
    <div className="app">

      <header className="top-bar">
        <div className="logo">Lessons</div>

        <div className="profile">
          <span>{instrumentIcon}</span>
        </div>
      </header>

      <main className="lessons-page">

        <section className="lessons-intro">
          <p className="eyebrow">
            {instrumentName.toUpperCase()}
          </p>

          <h1>Lessons</h1>

          <p>
            Learn step by step and build your skills.
          </p>
        </section>

        <div className="difficulty-tabs">
          <button className="difficulty-tab active">
            Beginner
          </button>

          <button className="difficulty-tab">
            Intermediate
          </button>

          <button className="difficulty-tab">
            Advanced
          </button>
        </div>

        <section className="course-progress">

          <div className="progress-header">

            <div>
              <h2>Your Progress</h2>

              <p>
                {completedLessons} of{" "}
                {currentLessons.length} lessons completed
              </p>
            </div>

            <span>{progress}%</span>

          </div>

          <div className="progress-bar">
            <div
              className="progress-fill lessons-progress"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

        </section>

        <section className="lesson-list">

          {lessonStatuses.map((lesson) => (
            <Lesson
              key={lesson.number}
              number={lesson.number}
              icon={lesson.icon}
              title={lesson.title}
              description={lesson.description}
              status={lesson.status}
              link={lesson.link}
            />
          ))}

        </section>

      </main>

      <Navbar />

    </div>
  );
}

function Lesson({
  number,
  icon,
  title,
  description,
  status,
  link,
}) {
  return (
    <div className={`lesson-card ${status}`}>

      <div className="lesson-number">
        {number}
      </div>

      <div className="lesson-icon">
        {icon}
      </div>

      <div className="lesson-info">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="lesson-action">

        {status === "completed" && (
          <Link to={link}>
            <button className="review-button">
              Review
            </button>
          </Link>
        )}

        {status === "current" && (
          <Link to={link}>
            <button>
              Continue →
            </button>
          </Link>
        )}

        {status === "locked" && (
          <span className="locked-icon">
            🔒
          </span>
        )}

      </div>

    </div>
  );
}

export default Lessons;