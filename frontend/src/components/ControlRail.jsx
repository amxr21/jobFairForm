import { useTheme } from "../context/ThemeContext";
import useLocaleContext from "../hooks/useLocaleContext";

// Theme and language controls, grouped in ONE container rather than two
// separate floating buttons. Previously each toggle centered itself
// independently at the top of the viewport with a hand-calculated pixel
// offset between them — fragile (the offset had to be updated by hand if
// either button's size changed) and read as two unrelated floating buttons
// rather than one "settings" affordance.
//
// Fixed to the inline-start edge of the viewport, vertically stacked, rather
// than floating over the top of the page — out of the way of the content
// instead of overlapping it, and it naturally mirrors to the opposite edge
// under dir="rtl" via `start-4` (a logical property), with no JS needed to
// reposition it.
const ControlRail = () => {
    const { isDark, toggleTheme } = useTheme();
    const { locale, toggleLocale, isTransitioning } = useLocaleContext();
    const isArabic = locale === "ar";

    return (
        <div
            className="fixed top-4 start-4 z-[999998] flex flex-col gap-1 p-1 rounded-2xl border border-gray-200 bg-white shadow-md dark:bg-gray-900 dark:border-gray-700"
        >
            <button
                data-tour="theme-toggle"
                onClick={toggleTheme}
                className="flex items-center justify-center w-9 h-9 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
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

            {/* A hairline divider between the two controls, so the grouping
                reads as "settings" (two related switches) rather than one
                undifferentiated block. */}
            <div className="h-px bg-gray-200 dark:bg-gray-700 mx-1" aria-hidden="true" />

            <button
                onClick={toggleLocale}
                disabled={isTransitioning}
                className="flex items-center justify-center w-9 h-9 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-wait dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
                title={isArabic ? "English" : "العربية"}
            >
                {/* Shows the language you'd SWITCH TO, matching the
                    convention every major site uses — the button reads "EN"
                    while the page is in Arabic, and vice versa. */}
                <span className="text-sm font-semibold" dir="ltr">
                    {isArabic ? "EN" : "ع"}
                </span>
            </button>
        </div>
    );
};

export default ControlRail;
