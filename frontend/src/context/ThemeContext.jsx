import { createContext, useContext, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";

// App theme (light / dark). Defaults to the DEVICE preference and can be
// overridden by the user (persisted in localStorage). Toggling adds/removes
// `.dark` on <html>, which is what every Tailwind `dark:` utility keys off
// (see darkMode: 'class' in tailwind.config.js).

const ThemeContext = createContext(null);
const STORAGE_KEY = "theme";

const systemQuery = () =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null;

const getSystemTheme = () => (systemQuery()?.matches ? "dark" : "light");

const getInitialTheme = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        // An explicit choice always wins over the device setting.
        if (saved === "light" || saved === "dark") return saved;
    } catch { /* ignore */ }
    // No stored choice: follow the device. Arriving on a dark-mode phone and
    // being handed a white page is a jarring first impression, and it is the
    // behaviour every OS-level app already has.
    return getSystemTheme();
};

const applyTheme = (theme) => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
};

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(getInitialTheme);

    useEffect(() => { applyTheme(theme); }, [theme]);

    // Follow the device while the user has made no explicit choice — someone
    // whose phone flips to dark at sunset expects this page to follow. Once
    // they have toggled it themselves, that choice is stored and wins, so this
    // listener leaves them alone.
    useEffect(() => {
        const mq = systemQuery();
        if (!mq) return;

        const onChange = (e) => {
            let hasChoice = false;
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                hasChoice = saved === "light" || saved === "dark";
            } catch { /* treat as no choice */ }
            if (!hasChoice) setThemeState(e.matches ? "dark" : "light");
        };

        // Safari < 14 has no addEventListener on MediaQueryList.
        if (typeof mq.addEventListener === "function") {
            mq.addEventListener("change", onChange);
            return () => mq.removeEventListener("change", onChange);
        }
        mq.addListener(onChange);
        return () => mq.removeListener(onChange);
    }, []);

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

// eslint-disable-next-line react-refresh/only-export-components -- hook is tightly coupled to ThemeProvider, kept in one file
export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
    return ctx;
};
