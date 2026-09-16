import { createContext, useContext, useState } from "react";

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => {
    const savedProgress = localStorage.getItem("lessonProgress");

    if (savedProgress) {
      return JSON.parse(savedProgress);
    }

    return {
      violin: [],
      trumpet: [],
    };
  });

  const completeLesson = (instrument, lessonNumber) => {
    setProgress((currentProgress) => {
      const completed = currentProgress[instrument] || [];

      if (completed.includes(lessonNumber)) {
        return currentProgress;
      }

      const updatedProgress = {
        ...currentProgress,
        [instrument]: [...completed, lessonNumber],
      };

      localStorage.setItem(
        "lessonProgress",
        JSON.stringify(updatedProgress)
      );

      return updatedProgress;
    });
  };

  const isLessonCompleted = (instrument, lessonNumber) => {
    return (progress[instrument] || []).includes(lessonNumber);
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        completeLesson,
        isLessonCompleted,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}