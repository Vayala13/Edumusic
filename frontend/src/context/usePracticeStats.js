
import { useContext } from "react";
import { PracticeStatsContext } from "./PracticeStatsContext";

export function usePracticeStats() {
    return useContext(PracticeStatsContext);
}
