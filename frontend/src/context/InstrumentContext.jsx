import { createContext, useContext, useState } from "react";

const InstrumentContext = createContext();

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

export function useInstrument() {
  return useContext(InstrumentContext);
}