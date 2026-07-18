import { useTheme } from "../context/ThemeContext";

// Light/dark toggle button, fixed to the top-center of the viewport so it's
// reachable from any page of the form flow. Shows a sun in dark mode (tap to
// go light) and a moon in light mode (tap to go dark).
const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();
    return (
        <button
            data-tour="theme-toggle"
            onClick={toggleTheme}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[999998] flex items-center justify-center w-11 h-11 rounded-xl border border-gray-200 bg-white text-gray-500 shadow-md hover:text-gray-800 hover:border-gray-300 hover:bg-gray-100 transition-colors dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
        >
            {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="4" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            )}
        </button>
    );
};

export default ThemeToggle;
