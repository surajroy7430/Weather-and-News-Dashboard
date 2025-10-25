import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");
  const [themeMode, setThemeMode] = useState("manual"); // 'manual' | 'auto'

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem("theme") || "dark";
    const savedMode = localStorage.getItem("themeMode") || "manual";

    setTheme(savedTheme);
    setThemeMode(savedMode);

    // Apply theme to document
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  useEffect(() => {
    if (themeMode === "auto") {
      const updateThemeByTime = () => {
        const hour = new Date().getHours();
        const newTheme = hour >= 6 && hour < 18 ? "light" : "dark";

        if (newTheme !== theme) {
          setTheme(newTheme);
          document.documentElement.classList.toggle(
            "dark",
            newTheme === "dark"
          );
        }
      };

      updateThemeByTime();
      const interval = setInterval(updateThemeByTime, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [themeMode, theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setThemeMode("manual");

    localStorage.setItem("theme", newTheme);
    localStorage.setItem("themeMode", "manual");

    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const setAutoTheme = () => {
    setThemeMode("auto");
    localStorage.setItem("themeMode", "auto");

    // Immediately apply auto theme
    const hour = new Date().getHours();
    const newTheme = hour >= 6 && hour < 18 ? "light" : "dark";

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const value = {
    theme,
    themeMode,
    toggleTheme,
    setAutoTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
