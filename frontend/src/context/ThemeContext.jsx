import { createContext, useContext, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";

// App theme (light / dark). Fully user-controlled: defaults to LIGHT and only
// changes when the user toggles it (persisted in localStorage). No OS
// auto-detection. Toggling adds/removes `.dark` on <html>, which is what every
// Tailwind `dark:` utility keys off (see darkMode: 'class' in tailwind.config.js).

const ThemeContext = createContext(null);
const STORAGE_KEY = "theme";

const getInitialTheme = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === "light" || saved === "dark") return saved;
    } catch { /* ignore */ }
    return "light"; // default, not OS-detected
};

const applyTheme = (theme) => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
};

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(getInitialTheme);

    useEffect(() => { applyTheme(theme); }, [theme]);

    const setTheme = useCallback((next) => {
        setThemeState(next);
        try { localStorage.setItem(STORAGE_KEY, next); } catch { /* quota */ }
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => {
            const next = prev === "dark" ? "light" : "dark";
            try { localStorage.setItem(STORAGE_KEY, next); } catch { /* quota */ }
            return next;
        });
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === "dark" }}>
            {children}
        </ThemeContext.Provider>
    );
};

ThemeProvider.propTypes = {
    children: PropTypes.node,
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
    return ctx;
};
