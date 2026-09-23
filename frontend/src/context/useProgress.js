import { createContext, useContext } from "react";

// See useInstrument.js: context + hook kept out of the provider file so Fast
// Refresh keeps working (react-refresh/only-export-components).
export const ProgressContext = createContext();

export function useProgress() {
  return useContext(ProgressContext);
}
