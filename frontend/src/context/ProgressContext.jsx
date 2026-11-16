import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "./useAuth";
import { ProgressContext } from "./useProgress";
import { handleDatabaseError } from "../utils/logError";

const EMPTY_PROGRESS = { violin: [], trumpet: [] };

export function ProgressProvider({ children }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState(EMPTY_PROGRESS);
  const [loading, setLoading] = useState(true);
  const [progressError, setProgressError] = useState("");

  //will load user's progress from firestore whenever someone logged in changes
  useEffect(() => {
    let cancelled = false;

    async function loadProgress() {
      if (!user) {
        setProgress(EMPTY_PROGRESS);
        setProgressError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setProgressError("");

      try {
        const progressRef = doc(db, "progress", user.uid);
        const snapshot = await getDoc(progressRef);

        if (cancelled) {
          return;
        }

        if (snapshot.exists()) {
          setProgress(snapshot.data());
        } else {
          setProgress(EMPTY_PROGRESS);
        }
      } catch (error) {
        const response = handleDatabaseError(
          "Error loading lesson progress",
          error
        );
        if (!cancelled) {
          // No lesson counts on failure — only the error message.
          setProgress(EMPTY_PROGRESS);
          setProgressError(response.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const completeLesson = async (instrument, lessonNumber) => {
    if (!user) return;

    const completed = progress[instrument] || [];
    if (completed.includes(lessonNumber)) return;

    const updatedProgress = {
      ...progress,
      [instrument]: [...completed, lessonNumber],
    };

    const previousProgress = progress;
    setProgress(updatedProgress);
    setProgressError("");

    try {
      const progressRef = doc(db, "progress", user.uid);
      await setDoc(progressRef, updatedProgress);
    } catch (error) {
      const response = handleDatabaseError(
        "Error saving lesson progress",
        error
      );
      setProgress(previousProgress);
      setProgressError(response.message);
    }
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
        loading,
        progressError,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
