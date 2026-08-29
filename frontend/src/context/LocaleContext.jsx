import { createContext, useContext, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";

// App locale (en / ar). Defaults to the browser's language and can be
// overridden by the user (persisted in localStorage) — the same pattern as
// ThemeContext. Switching locale sets `lang` and `dir` on <html>, which is
// what every `dir="rtl"`-aware layout and CSS logical property keys off.
//
// The whole app is written in English. Rather than rewrite every component
// against an i18n framework, this stays intentionally small: a flat message
// lookup (src/i18n/messages.js) with an EN fallback baked into t(), so a
// missing or not-yet-translated Arabic string never renders blank — it shows
// the English text instead. See src/i18n/README.md for how the option-value
// mapping (dropdown labels vs formData/submission values) works, which is a
// separate, more specific mechanism from this generic t().

const LocaleContext = createContext(null);
const STORAGE_KEY = "locale";
const RTL_LOCALES = new Set(["ar"]);

const getBrowserLocale = () => {
    if (typeof navigator === "undefined") return "en";
    const lang = (navigator.language || "en").toLowerCase();
    return lang.startsWith("ar") ? "ar" : "en";
};

const getInitialLocale = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === "en" || saved === "ar") return saved;
    } catch { /* ignore */ }
    return getBrowserLocale();
};

const applyLocale = (locale) => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = RTL_LOCALES.has(locale) ? "rtl" : "ltr";
};

export const LocaleProvider = ({ children }) => {
    const [locale, setLocaleState] = useState(getInitialLocale);

    useEffect(() => { applyLocale(locale); }, [locale]);

    const setLocale = useCallback((next) => {
        setLocaleState(next);
        try { localStorage.setItem(STORAGE_KEY, next); } catch { /* quota */ }
    }, []);

    const toggleLocale = useCallback(() => {
        setLocaleState((prev) => {
            const next = prev === "ar" ? "en" : "ar";
            try { localStorage.setItem(STORAGE_KEY, next); } catch { /* quota */ }
            return next;
        });
    }, []);

    return (
        <LocaleContext.Provider
            value={{ locale, setLocale, toggleLocale, isRTL: RTL_LOCALES.has(locale) }}
        >
            {children}
        </LocaleContext.Provider>
    );
};

LocaleProvider.propTypes = {
    children: PropTypes.node,
};

// eslint-disable-next-line react-refresh/only-export-components -- hook is tightly coupled to LocaleProvider, kept in one file
export const useLocale = () => {
    const ctx = useContext(LocaleContext);
    if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
    return ctx;
};
