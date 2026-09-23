import { useState } from "react";

import { InstrumentContext } from "./useInstrument";

export function InstrumentProvider({ children }) {
  const [instrument, setInstrument] = useState(() => {
    return localStorage.getItem("instrument") || "violin";
  });

  const changeInstrument = (newInstrument) => {
    setInstrument(newInstrument);
    localStorage.setItem("instrument", newInstrument);
  };

  return (
    <InstrumentContext.Provider value={{ instrument, changeInstrument }}>
      {children}
    </InstrumentContext.Provider>
  );
}
