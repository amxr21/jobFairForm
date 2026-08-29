import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
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
// the English text instead. See i18n/options.js for how the option-value
// mapping (dropdown labels vs formData/submission values) works, which is a
// separate, more specific mechanism from this generic t().

const LocaleContext = createContext(null);
const STORAGE_KEY = "locale";
const RTL_LOCALES = new Set(["ar"]);

// Cover time for the switch transition, in ms. A `dir` flip re-lays-out the
// ENTIRE page in one frame — every flex row, every logical margin/padding —
// so switching with no transition reads as a jump cut. There's no real async
// work here (no fetch, no route change), so this component manufactures the
// transition itself: fade an overlay in, flip the locale while it's opaque,
// fade back out. isTransitioning below drives that overlay; this file only
// owns the timing, not the visuals.
const COVER_MS = 220;

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
    // True for the ~COVER_MS window an overlay is expected to be fully
    // opaque, covering the moment `dir` actually flips underneath it.
    const [isTransitioning, setIsTransitioning] = useState(false);
    const coverTimer = useRef(null);

    useEffect(() => { applyLocale(locale); }, [locale]);
    useEffect(() => () => window.clearTimeout(coverTimer.current), []);

    const persist = (next) => {
        try { localStorage.setItem(STORAGE_KEY, next); } catch { /* quota */ }
    };

    // Both setLocale and toggleLocale route through this, so a caller who
    // jumps straight to a specific locale (a future language picker, say)
    // gets the same smooth cover as the toggle button does — one place owns
    // the transition rather than each entry point reimplementing it.
    const applyWithTransition = useCallback((computeNext) => {
        setIsTransitioning(true);
        window.clearTimeout(coverTimer.current);
        // Reduced-motion users still get the state change; they just skip
        // the artificial delay, since there is no real work to wait on. This
        // library-agnostic prefers-reduced-motion read avoids importing the
        // GSAP layer into a context file for one boolean.
        const reduced =
            typeof window !== "undefined" &&
            typeof window.matchMedia === "function" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const coverDelay = reduced ? 0 : COVER_MS / 2;

        coverTimer.current = window.setTimeout(() => {
            setLocaleState((prev) => {
                const next = computeNext(prev);
                persist(next);
                return next;
            });
            // Give the overlay the same half-window to fade back out before
            // unmounting it.
            coverTimer.current = window.setTimeout(() => setIsTransitioning(false), coverDelay);
        }, coverDelay);
    }, []);

    const setLocale = useCallback(
        (next) => applyWithTransition(() => next),
        [applyWithTransition]
    );

    const toggleLocale = useCallback(
        () => applyWithTransition((prev) => (prev === "ar" ? "en" : "ar")),
        [applyWithTransition]
    );

    return (
        <LocaleContext.Provider
            value={{
                locale,
                setLocale,
                toggleLocale,
                isRTL: RTL_LOCALES.has(locale),
                isTransitioning,
            }}
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
