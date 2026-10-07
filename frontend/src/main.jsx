import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import "./glass.css";
import { InstrumentProvider } from "./context/InstrumentContext";
import { ProgressProvider } from "./context/ProgressContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
<React.StrictMode>
    <AuthProvider>
      <InstrumentProvider>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </InstrumentProvider>
    </AuthProvider>
  </React.StrictMode>
);