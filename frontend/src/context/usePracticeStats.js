import { useContext } from "react";
import { PracticeStatsContext } from "./practiceStatsContext";

export function usePracticeStats() {
    return useContext(PracticeStatsContext);
}
