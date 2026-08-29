import useLocaleContext from "../hooks/useLocaleContext";

// Language toggle, positioned beside ThemeToggle. ThemeToggle centers itself
// with left-1/2 -translate-x-1/2 (48px wide including its border), so this
// button offsets from that same center point by half its own width plus a
// gap, rather than duplicating a flex-wrapper refactor of ThemeToggle (which
// ThemeTourHint targets by a [data-tour] selector and would rather not
// touch).
//
// calc() with the offset keeps this correct if either button's size ever
// changes without hand-tuning a magic pixel value.
const OFFSET = "calc(1.5rem + 22px)"; // half of ThemeToggle's 44px + 24px gap

const LanguageToggle = () => {
    const { locale, toggleLocale } = useLocaleContext();
    const isArabic = locale === "ar";

    return (
        <button
            onClick={toggleLocale}
            style={{ insetInlineStart: `calc(50% + ${OFFSET})` }}
            className="fixed top-4 -translate-x-1/2 z-[999998] flex items-center justify-center w-11 h-11 rounded-xl border border-gray-200 bg-white text-gray-500 shadow-md hover:text-gray-800 hover:border-gray-300 hover:bg-gray-100 transition-colors dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
            aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
            title={isArabic ? "English" : "العربية"}
        >
            {/* Shows the language you'd SWITCH TO, matching the convention
                every major site uses — the button reads "EN" while the page
                is in Arabic, and vice versa. */}
            <span className="text-sm font-semibold" dir="ltr">
                {isArabic ? "EN" : "ع"}
            </span>
        </button>
    );
};

export default LanguageToggle;
