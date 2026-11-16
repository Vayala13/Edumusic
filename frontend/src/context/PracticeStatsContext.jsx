
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
import { gradeAgain, gradeGood, newCard } from "../utils/srs";
import { handleDatabaseError } from "../utils/logError";

const REVIEW_XP_GOOD = 5;
const REVIEW_XP_AGAIN = 2;

const EMPTY_STATS = {
    xp: 0,
    notesLearned: {
        violin: [],
        trumpet: [],
    },
    practiceDates: [],
    srs: {
        violin: {},
        trumpet: {},
    },
};

function normalizeSrs(savedSrs) {
    return {
        violin: savedSrs?.violin && typeof savedSrs.violin === "object"
            ? savedSrs.violin
            : {},
        trumpet: savedSrs?.trumpet && typeof savedSrs.trumpet === "object"
            ? savedSrs.trumpet
            : {},
    };
}

function PracticeStatsProvider({ children }) {
    const { user } = useAuth();
    const [stats, setStats] = useState(EMPTY_STATS);
    const [loadingStats, setLoadingStats] = useState(true);
    const [statsError, setStatsError] = useState("");
    const statsRef = useRef(EMPTY_STATS);

    useEffect(() => {
        let active = true;

        async function loadStats() {
            if (!user) {
                statsRef.current = EMPTY_STATS;
                setStats(EMPTY_STATS);
                setStatsError("");
                setLoadingStats(false);
                return;
            }

            setLoadingStats(true);
            setStatsError("");

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
                    srs: normalizeSrs(savedData.srs),
                };

                if (active) {
                    statsRef.current = loadedStats;
                    setStats(loadedStats);
                }
            } catch (error) {
                const response = handleDatabaseError(
                    "Error loading practice stats",
                    error
                );

                if (active) {
                    // No XP / streak counts on failure — only the message.
                    statsRef.current = EMPTY_STATS;
                    setStats(EMPTY_STATS);
                    setStatsError(response.message);
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

        const previousStats = currentStats;
        statsRef.current = updatedStats;
        setStats(updatedStats);
        setStatsError("");

        try {
            await setDoc(
                doc(db, "practiceStats", user.uid),
                updatedStats
            );
        } catch (error) {
            const response = handleDatabaseError(
                "Error saving practice stats",
                error
            );
            statsRef.current = previousStats;
            setStats(previousStats);
            setStatsError(response.message);
            throw error;
        }
    }

    async function recordReviewResult(instrument, note, grade) {
        if (
            !user ||
            !["violin", "trumpet"].includes(instrument) ||
            !note ||
            (grade !== "good" && grade !== "again")
        ) {
            return 0;
        }

        const currentStats = statsRef.current;
        const today = getLocalDateKey();
        const existingNotes =
            currentStats.notesLearned[instrument] || [];
        const isNewNote = !existingNotes.includes(note);
        const alreadyPracticedToday =
            currentStats.practiceDates.includes(today);
        const currentCard =
            currentStats.srs?.[instrument]?.[note] || newCard();
        const nextCard =
            grade === "good"
                ? gradeGood(currentCard)
                : gradeAgain(currentCard);
        const reviewXp =
            grade === "good" ? REVIEW_XP_GOOD : REVIEW_XP_AGAIN;
        const xpGain = reviewXp + (isNewNote ? 10 : 0);

        const updatedStats = {
            ...currentStats,
            xp: currentStats.xp + xpGain,
            notesLearned: {
                ...currentStats.notesLearned,
                [instrument]: isNewNote
                    ? [...existingNotes, note]
                    : existingNotes,
            },
            practiceDates: alreadyPracticedToday
                ? currentStats.practiceDates
                : [...currentStats.practiceDates, today],
            srs: {
                ...currentStats.srs,
                [instrument]: {
                    ...(currentStats.srs?.[instrument] || {}),
                    [note]: nextCard,
                },
            },
        };

        const previousStats = currentStats;
        statsRef.current = updatedStats;
        setStats(updatedStats);
        setStatsError("");

        try {
            await setDoc(
                doc(db, "practiceStats", user.uid),
                updatedStats
            );
        } catch (error) {
            const response = handleDatabaseError(
                "Error saving review result",
                error
            );
            statsRef.current = previousStats;
            setStats(previousStats);
            setStatsError(response.message);
            throw error;
        }

        return xpGain;
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
                statsError,
                recordSuccessfulNote,
                recordReviewResult,
                allNotesLearned,
                dayStreak,
            }}
        >
            {children}
        </PracticeStatsContext.Provider>
    );
}

export { PracticeStatsProvider };