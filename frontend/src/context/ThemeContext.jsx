import { useEffect, useState } from "react";

import { THEMES, ThemeContext } from "./useTheme";

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem("theme");
    return THEMES.includes(saved) ? saved : "default";
  });

  // Applied to <html> (not just the .app wrapper) because every page
  // renders its own separate .app div, so this is the one place a single
  // attribute reaches all of them.
  useEffect(() => {
    if (theme === "default") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  function setTheme(newTheme) {
    const nextTheme = THEMES.includes(newTheme) ? newTheme : "default";
    setThemeState(nextTheme);
    localStorage.setItem("theme", nextTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
