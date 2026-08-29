// Single source of truth for the form's field chrome.
//
// These strings were previously copy-pasted across Input, SelectInput,
// SkillsMultiSelect, DatePicker and the raw <textarea> in ProfessionalInfo —
// five call sites hardcoding `bg-white dark:bg-[#1a2438] border border-line-strong
// rounded-md`, each free to drift. Centralising them means a change to the
// field look lands everywhere at once.
//
// Note the mobile-first heights: 44px on touch (the WCAG 2.5.5 / iOS HIG
// minimum target), 36px from md up where a pointer is assumed.

export const LABEL_CLASSES = "text-xs md:text-sm mb-1 shrink-0";

// Shared by every control that renders as a single-line box.
export const FIELD_SURFACE =
    "w-full bg-white dark:bg-[#1a2438] border rounded-md transition-all duration-200";

export const FIELD_HEIGHT = "h-11 md:h-9";

// Controls that grow with their content (multi-select with chips) use a
// min-height instead of a fixed height.
export const FIELD_MIN_HEIGHT = "min-h-[44px] md:min-h-[36px]";

export const FIELD_TEXT = "text-xs md:text-sm";

export const INPUT_CLASSES = `${FIELD_HEIGHT} ${FIELD_SURFACE} py-1 px-2 ${FIELD_TEXT} focus:outline-none focus:ring-2 focus:border-transparent`;

export const TEXTAREA_CLASSES = `${FIELD_SURFACE} py-1.5 px-2 ${FIELD_TEXT} resize-none min-h-0 focus:outline-none focus:ring-2 focus:border-transparent`;

export const WRAPPER_CLASSES = "flex flex-col";

// The portaled overlay surface (select panel, skills panel, calendar).
export const PANEL_CLASSES =
    "bg-white dark:bg-[#131b2c] border-line border rounded-md shadow-lg overflow-y-auto overscroll-contain";

// Option rows inside a panel. 44px tall on touch for the same reason as the
// triggers; `overflow-y-auto` panels get momentum scrolling so they track the
// finger the way every native list on the device does.
export const OPTION_CLASSES = `w-full px-2 md:px-3 py-2.5 md:py-2 text-left ${FIELD_TEXT} transition-colors duration-150`;

export const OPTION_SELECTED = "bg-primary/10 text-primary font-medium";
export const OPTION_IDLE = "text-fg hover:bg-surface-hover focus:bg-surface-hover";
