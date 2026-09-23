import { createContext, useContext } from "react";

// The context object and its hook live here, apart from the provider
// component, so each file exports only components or only non-components.
// Mixing the two breaks React Fast Refresh (react-refresh/only-export-components).
export const InstrumentContext = createContext();

export function useInstrument() {
  return useContext(InstrumentContext);
}
