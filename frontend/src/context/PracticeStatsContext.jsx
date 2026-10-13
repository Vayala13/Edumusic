
import {
    useEffect,
    useRef,
    useState,
} from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./useAuth";
import { getLocalDateKey } from "./practiceStatsUtils";
import { PracticeStatsContext } from "./practiceStatsContext";

const EMPTY_STATS = {
    xp: 0,
    notesLearned: {
        violin: [],
        trumpet: [],
    },
    practiceDates: [],
};

function PracticeStatsProvider({ children }) {
    const { user } = useAuth();
    const [stats, setStats] = useState(EMPTY_STATS);
    const [loadingStats, setLoadingStats] = useState(true);
    const statsRef = useRef(EMPTY_STATS);

    useEffect(() => {
        let active = true;

        async function loadStats() {
            if (!user) {
                statsRef.current = EMPTY_STATS;
                setStats(EMPTY_STATS);
                setLoadingStats(false);
                return;
            }

            setLoadingStats(true);

            try {
                const statsDocRef = doc(db, "practiceStats", user.uid);
                const snapshot = await getDoc(statsDocRef);

                const savedData = snapshot.exists()
                    ? snapshot.data()
                    : {};

                const loadedStats = {
                    ...EMPTY_STATS,
                    ...savedData,
                    xp:
                        typeof savedData.xp === "number"
                            ? savedData.xp
                            : 0,
                    notesLearned: {
                        ...EMPTY_STATS.notesLearned,
                        ...(savedData.notesLearned || {}),
                    },
                    practiceDates: Array.isArray(savedData.practiceDates)
                        ? savedData.practiceDates
                        : [],
                };

                if (active) {
                    statsRef.current = loadedStats;
                    setStats(loadedStats);
                }
            } catch (error) {
                console.error("Could not load practice stats:", error);

                if (active) {
                    statsRef.current = EMPTY_STATS;
                    setStats(EMPTY_STATS);
                }
            } finally {
                if (active) {
                    setLoadingStats(false);
                }
            }
        }

        loadStats();

        return () => {
            active = false;
        };
    }, [user]);

    async function recordSuccessfulNote(instrument, note) {
        if (
            !user ||
            !["violin", "trumpet"].includes(instrument) ||
            !note
        ) {
            return;
        }

        const currentStats = statsRef.current;
        const today = getLocalDateKey();

        const existingNotes =
            currentStats.notesLearned[instrument] || [];

        const isNewNote = !existingNotes.includes(note);
        const alreadyPracticedToday =
            currentStats.practiceDates.includes(today);

        const updatedStats = {
            ...currentStats,
            xp: currentStats.xp + (isNewNote ? 10 : 0),
            notesLearned: {
                ...currentStats.notesLearned,
                [instrument]: isNewNote
                    ? [...existingNotes, note]
                    : existingNotes,
            },
            practiceDates: alreadyPracticedToday
                ? currentStats.practiceDates
                : [...currentStats.practiceDates, today],
        };

        statsRef.current = updatedStats;
        setStats(updatedStats);

        try {
            await setDoc(
                doc(db, "practiceStats", user.uid),
                updatedStats
            );
        } catch (error) {
            console.error("Could not save practice stats:", error);
            throw error;
        }
    }

    const allNotesLearned =
        (stats.notesLearned.violin?.length || 0) +
        (stats.notesLearned.trumpet?.length || 0);

    const dateSet = new Set(stats.practiceDates);
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    const today = getLocalDateKey(cursor);
    const yesterdayDate = new Date(cursor);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = getLocalDateKey(yesterdayDate);

    let dayStreak = 0;

    if (dateSet.has(today) || dateSet.has(yesterday)) {
        const startDate = dateSet.has(today)
            ? cursor
            : yesterdayDate;

        while (dateSet.has(getLocalDateKey(startDate))) {
            dayStreak++;
            startDate.setDate(startDate.getDate() - 1);
        }
    }

    return (
        <PracticeStatsContext.Provider
            value={{
                stats,
                loadingStats,
                recordSuccessfulNote,
                allNotesLearned,
                dayStreak,
            }}
        >
            {children}
        </PracticeStatsContext.Provider>
    );
}

export { PracticeStatsProvider };