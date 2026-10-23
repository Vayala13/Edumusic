import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import "./glass.css";
import { InstrumentProvider } from "./context/InstrumentContext";
import { ProgressProvider } from "./context/ProgressContext";
import { AuthProvider } from "./context/AuthContext";
import { PracticeStatsProvider } from "./context/PracticeStatsContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <InstrumentProvider>
          <ProgressProvider>
            <PracticeStatsProvider>
              <App />
            </PracticeStatsProvider>
          </ProgressProvider>
        </InstrumentProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
