import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { InstrumentProvider } from "./context/InstrumentContext";
import { ProgressProvider } from "./context/ProgressContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <InstrumentProvider>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </InstrumentProvider>
  </React.StrictMode>
);