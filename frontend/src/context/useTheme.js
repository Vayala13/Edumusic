import { createContext, useContext } from "react";

// The context object and its hook live here, apart from the provider
// component, so each file exports only components or only non-components.
// Mixing the two breaks React Fast Refresh (react-refresh/only-export-components).
export const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

// "default" is the original look (no data-theme attribute). Any other value
// here must have a matching `:root[data-theme="..."]` block in App.css and
// glass.css, or it silently falls back to the default look.
export const THEMES = ["default", "red", "green", "black"];
