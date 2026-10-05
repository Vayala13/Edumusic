import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "./useAuth";
import { ProgressContext } from "./useProgress";

const EMPTY_PROGRESS = { violin: [], trumpet: [] };

export function ProgressProvider({ children }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState(EMPTY_PROGRESS);
  const [loading, setLoading] = useState(true);

  //will load user's progress from firestore whenever someone logged in changes
useEffect(() => {
  if (!user){
    Promise.resolve().then(() => {
    setProgress(EMPTY_PROGRESS);
    setLoading(false);
    });
    return;
}

 Promise.resolve().then(() => {
    setLoading(true);
  });


 const progressRef = doc(db, "progress", user.uid);

    getDoc(progressRef).then((snapshot) => {
      if (snapshot.exists()) {
        setProgress(snapshot.data());
      } else {
        setProgress(EMPTY_PROGRESS);
      }
      setLoading(false);
    });
  }, [user]);

  const completeLesson = async (instrument, lessonNumber) => {
    if (!user) return;

    const completed = progress[instrument] || [];
    if (completed.includes(lessonNumber)) return;

    const updatedProgress = {
      ...progress,
      [instrument]: [...completed, lessonNumber],
    };

    setProgress(updatedProgress);

    const progressRef = doc(db, "progress", user.uid);
    await setDoc(progressRef, updatedProgress);
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
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
