import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import * as Popover from "@radix-ui/react-popover";
import useUniqueId from "../../hooks/useUniqueId";
import { ChevronLeft, ChevronRight, ChevronDown, Calendar as CalendarIcon, Check } from "lucide-react";
import {
    FIELD_HEIGHT,
    FIELD_SURFACE,
    FIELD_TEXT,
    PANEL_CLASSES,
} from "./fieldStyles";

// The month grid is hand-built (a calendar is a genuinely custom widget and
// react-day-picker would have to be restyled from scratch anyway), but the
// overlay mechanics now come from Radix Popover instead of the third
// hand-rolled portal + outside-click + position implementation in this folder.
//
// The accessibility work here is the `role="grid"` layer. Previously the
// calendar was 42 anonymous <button>s in a flat div: a screen reader user got
// "1, 2, 3…" with no month, no weekday, no indication of which was selected or
// today, and no way to know they were in a calendar at all. The ARIA grid
// pattern fixes that:
//
//   - role="grid" with an accessible name carrying the visible month/year
//   - role="row" / role="gridcell" structure matching the visual layout
//   - each day button's accessible name is the full date ("14 March 2004"),
//     not the bare number
//   - aria-selected on the chosen day, aria-current="date" on today
//   - roving tabindex + arrow/PageUp/PageDown/Home/End navigation, so the grid
//     is one tab stop that you then arrow around, rather than 42 tab stops
//
// The month/year dropdowns are Radix Popovers too, so they dismiss and manage
// focus correctly instead of relying on the parent's outside-click handler.

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = [
    { short: "Su", long: "Sunday" },
    { short: "Mo", long: "Monday" },
    { short: "Tu", long: "Tuesday" },
    { short: "We", long: "Wednesday" },
    { short: "Th", long: "Thursday" },
    { short: "Fr", long: "Friday" },
    { short: "Sa", long: "Saturday" },
];

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const formatDisplay = (date) =>
    date ? date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";

const formatFull = (date) =>
    date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

const sameDay = (a, b) => a && b && a.getTime() === b.getTime();

function buildMonthGrid(viewYear, viewMonth) {
    const startWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const gridStart = new Date(viewYear, viewMonth, 1 - startWeekday);
    return Array.from({ length: 42 }, (_, i) =>
        new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i)
    );
}

const DatePicker = ({
    value,
    onSelect,
    minDate,
    maxDate,
    disabled = false,
    disabledMessage,
    placeholder = "Select a date",
    triggerClassName = "",
    onBlur,
    id,
    ariaInvalid,
    ariaDescribedBy,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showDisabledNote, setShowDisabledNote] = useState(false);
    const [monthPickerOpen, setMonthPickerOpen] = useState(false);
    const [yearPickerOpen, setYearPickerOpen] = useState(false);

    const initialView = value || maxDate || new Date();
    const [viewYear, setViewYear] = useState(initialView.getFullYear());
    const [viewMonth, setViewMonth] = useState(initialView.getMonth());

    // The day the roving tabindex currently sits on.
    const [focusedDay, setFocusedDay] = useState(() => startOfDay(initialView));
    // Only move real DOM focus when the user is actually navigating the grid,
    // so opening the panel doesn't rip focus off the trigger unexpectedly.
    const shouldFocusRef = useRef(false);
    const gridRef = useRef(null);
    const reactId = useUniqueId("datepicker");
    const gridId = `${reactId}-grid`;

    const isDisabledDay = (d) => {
        const day = startOfDay(d);
        if (minDate && day < startOfDay(minDate)) return true;
        if (maxDate && day > startOfDay(maxDate)) return true;
        return false;
    };

    // Move DOM focus onto whichever day the roving index points at, after the
    // grid has re-rendered for a month change.
    useEffect(() => {
        if (!isOpen || !shouldFocusRef.current) return;
        const el = gridRef.current?.querySelector('[data-day][tabindex="0"]');
        el?.focus();
        shouldFocusRef.current = false;
    }, [isOpen, focusedDay, viewMonth, viewYear]);

    const open = () => {
        if (disabled) return;
        const v = value || maxDate || new Date();
        setViewYear(v.getFullYear());
        setViewMonth(v.getMonth());
        setFocusedDay(startOfDay(v));
        setIsOpen(true);
    };

    const goToPrevMonth = () => {
        setViewMonth((m) => (m === 0 ? (setViewYear((y) => y - 1), 11) : m - 1));
    };
    const goToNextMonth = () => {
        setViewMonth((m) => (m === 11 ? (setViewYear((y) => y + 1), 0) : m + 1));
    };

    // Move the roving cursor by `days`, following it into an adjacent month
    // when it crosses a boundary.
    const moveFocus = (days) => {
        const next = new Date(
            focusedDay.getFullYear(),
            focusedDay.getMonth(),
            focusedDay.getDate() + days
        );
        shouldFocusRef.current = true;
        setFocusedDay(next);
        setViewYear(next.getFullYear());
        setViewMonth(next.getMonth());
    };

    const moveFocusMonths = (months) => {
        const next = new Date(
            focusedDay.getFullYear(),
            focusedDay.getMonth() + months,
            focusedDay.getDate()
        );
        shouldFocusRef.current = true;
        setFocusedDay(next);
        setViewYear(next.getFullYear());
        setViewMonth(next.getMonth());
    };

    const handlePick = (d) => {
        if (isDisabledDay(d)) return;
        onSelect?.(startOfDay(d));
        setIsOpen(false);
    };

    const handleGridKeyDown = (e) => {
        switch (e.key) {
            case "ArrowLeft":  e.preventDefault(); moveFocus(-1); break;
            case "ArrowRight": e.preventDefault(); moveFocus(1); break;
            case "ArrowUp":    e.preventDefault(); moveFocus(-7); break;
            case "ArrowDown":  e.preventDefault(); moveFocus(7); break;
            case "PageUp":     e.preventDefault(); moveFocusMonths(-1); break;
            case "PageDown":   e.preventDefault(); moveFocusMonths(1); break;
            case "Home": {
                e.preventDefault();
                shouldFocusRef.current = true;
                setFocusedDay(new Date(focusedDay.getFullYear(), focusedDay.getMonth(), 1));
                break;
            }
            case "End": {
                e.preventDefault();
                shouldFocusRef.current = true;
                setFocusedDay(new Date(focusedDay.getFullYear(), focusedDay.getMonth() + 1, 0));
                break;
            }
            case "Enter":
            case " ":
                e.preventDefault();
                handlePick(focusedDay);
                break;
            default:
                break;
        }
    };

    const yearAnchor = (maxDate || new Date()).getFullYear();
    const yearOptions = Array.from({ length: 81 }, (_, i) => yearAnchor - i);

    const cells = buildMonthGrid(viewYear, viewMonth);
    const weeks = Array.from({ length: 6 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
    const selectedDay = value ? startOfDay(value) : null;
    const today = startOfDay(new Date());

    const dropdownPanel = `${PANEL_CLASSES} z-[1001] p-1`;

    return (
        <>
            <Popover.Root
                open={isOpen}
                onOpenChange={(next) => {
                    if (!next) {
                        setIsOpen(false);
                        setMonthPickerOpen(false);
                        setYearPickerOpen(false);
                        onBlur?.();
                    }
                }}
            >
                <Popover.Trigger asChild>
                    <button
                        id={id}
                        type="button"
                        aria-disabled={disabled}
                        aria-invalid={ariaInvalid || undefined}
                        aria-describedby={ariaDescribedBy}
                        aria-haspopup="dialog"
                        onClick={() => {
                            // Kept clickable while disabled so we can explain
                            // *why* rather than silently doing nothing.
                            if (disabled) {
                                if (disabledMessage) {
                                    setShowDisabledNote(true);
                                    setTimeout(() => setShowDisabledNote(false), 3000);
                                }
                                return;
                            }
                            isOpen ? setIsOpen(false) : open();
                        }}
                        className={`${FIELD_HEIGHT} ${FIELD_SURFACE} py-1 px-2 ${FIELD_TEXT} flex items-center justify-between text-left
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:bg-surface-hover
                            ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${triggerClassName}`}
                    >
                        <span className={value ? "text-fg" : "text-fg-faint"}>
                            {value ? formatDisplay(value) : placeholder}
                        </span>
                        <CalendarIcon className="h-3.5 w-3.5 md:h-4 md:w-4 text-fg-muted shrink-0" />
                    </button>
                </Popover.Trigger>

                <Popover.Portal>
                    <Popover.Content
                        side="bottom"
                        align="start"
                        sideOffset={4}
                        collisionPadding={8}
                        role="dialog"
                        aria-label="Choose a date"
                        className={`overlay-pop z-[1000] ${PANEL_CLASSES} p-3`}
                        style={{
                            width: "min(280px, calc(100vw - 16px))",
                            maxHeight: "var(--radix-popover-content-available-height)",
                            WebkitOverflowScrolling: "touch",
                        }}
                        onOpenAutoFocus={(e) => {
                            // Land on the focused day rather than the first
                            // header button, so arrow keys work immediately.
                            e.preventDefault();
                            gridRef.current?.querySelector('[data-day][tabindex="0"]')?.focus();
                        }}
                    >
                        {/* Header: prev, month + year pickers, next */}
                        <div className="flex items-center justify-between gap-1 mb-2">
                            <button
                                type="button"
                                onClick={goToPrevMonth}
                                className="h-8 w-8 md:h-7 md:w-7 rounded-md border-line border text-fg-muted hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors inline-flex items-center justify-center shrink-0"
                                aria-label="Previous month"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>

                            <div className="flex items-center gap-1">
                                <Popover.Root open={monthPickerOpen} onOpenChange={setMonthPickerOpen}>
                                    <Popover.Trigger asChild>
                                        <button
                                            type="button"
                                            aria-label={`Month: ${MONTHS[viewMonth]}`}
                                            className="text-sm font-medium border-line border rounded-md pl-2 pr-1 py-1 bg-white dark:bg-[#131b2c] text-fg cursor-pointer hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all duration-200 inline-flex items-center gap-0.5"
                                        >
                                            {MONTHS[viewMonth]}
                                            <ChevronDown className="h-3.5 w-3.5 text-fg-muted" />
                                        </button>
                                    </Popover.Trigger>
                                    <Popover.Portal>
                                        <Popover.Content
                                            side="bottom"
                                            align="start"
                                            sideOffset={4}
                                            collisionPadding={8}
                                            className={`${dropdownPanel} max-h-48 w-32`}
                                            role="listbox"
                                            aria-label="Select month"
                                        >
                                            {MONTHS.map((m, i) => (
                                                <button
                                                    key={m}
                                                    type="button"
                                                    role="option"
                                                    aria-selected={i === viewMonth}
                                                    onClick={() => { setViewMonth(i); setMonthPickerOpen(false); }}
                                                    className={`w-full text-left px-2.5 py-2 text-sm rounded flex items-center justify-between transition-colors focus:outline-none focus-visible:bg-surface-hover ${
                                                        i === viewMonth ? "bg-primary/10 text-primary font-medium" : "text-fg hover:bg-surface-hover"
                                                    }`}
                                                >
                                                    {m}
                                                    {i === viewMonth && <Check className="h-3.5 w-3.5" />}
                                                </button>
                                            ))}
                                        </Popover.Content>
                                    </Popover.Portal>
                                </Popover.Root>

                                <Popover.Root open={yearPickerOpen} onOpenChange={setYearPickerOpen}>
                                    <Popover.Trigger asChild>
                                        <button
                                            type="button"
                                            aria-label={`Year: ${viewYear}`}
                                            className="text-sm font-medium border-line border rounded-md pl-2 pr-1 py-1 bg-white dark:bg-[#131b2c] text-fg cursor-pointer hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all duration-200 inline-flex items-center gap-0.5"
                                        >
                                            {viewYear}
                                            <ChevronDown className="h-3.5 w-3.5 text-fg-muted" />
                                        </button>
                                    </Popover.Trigger>
                                    <Popover.Portal>
                                        <Popover.Content
                                            side="bottom"
                                            align="end"
                                            sideOffset={4}
                                            collisionPadding={8}
                                            className={`${dropdownPanel} max-h-48 w-24`}
                                            role="listbox"
                                            aria-label="Select year"
                                        >
                                            {yearOptions.map((y) => (
                                                <button
                                                    key={y}
                                                    type="button"
                                                    role="option"
                                                    aria-selected={y === viewYear}
                                                    onClick={() => { setViewYear(y); setYearPickerOpen(false); }}
                                                    className={`w-full text-left px-2.5 py-2 text-sm rounded flex items-center justify-between transition-colors focus:outline-none focus-visible:bg-surface-hover ${
                                                        y === viewYear ? "bg-primary/10 text-primary font-medium" : "text-fg hover:bg-surface-hover"
                                                    }`}
                                                >
                                                    {y}
                                                    {y === viewYear && <Check className="h-3.5 w-3.5" />}
                                                </button>
                                            ))}
                                        </Popover.Content>
                                    </Popover.Portal>
                                </Popover.Root>
                            </div>

                            <button
                                type="button"
                                onClick={goToNextMonth}
                                className="h-8 w-8 md:h-7 md:w-7 rounded-md border-line border text-fg-muted hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors inline-flex items-center justify-center shrink-0"
                                aria-label="Next month"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>

                        {/* The grid's accessible name carries the month being
                            viewed, and is announced when the month changes. */}
                        <div
                            ref={gridRef}
                            role="grid"
                            id={gridId}
                            aria-label={`${MONTHS[viewMonth]} ${viewYear}`}
                            onKeyDown={handleGridKeyDown}
                        >
                            <div role="row" className="grid grid-cols-7 mb-1">
                                {WEEKDAYS.map((wd) => (
                                    <div
                                        key={wd.short}
                                        role="columnheader"
                                        aria-label={wd.long}
                                        className="h-7 flex items-center justify-center text-[0.7rem] text-fg-muted font-normal"
                                    >
                                        {wd.short}
                                    </div>
                                ))}
                            </div>

                            <div key={`${viewYear}-${viewMonth}`} className="animate-in fade-in duration-200">
                                {weeks.map((week, wi) => (
                                    <div role="row" key={wi} className="grid grid-cols-7 gap-y-0.5">
                                        {week.map((d) => {
                                            const day = startOfDay(d);
                                            const inMonth = d.getMonth() === viewMonth;
                                            const isSelected = sameDay(day, selectedDay);
                                            const isToday = sameDay(day, today);
                                            const dayDisabled = isDisabledDay(d);
                                            const isFocused = sameDay(day, startOfDay(focusedDay));
                                            return (
                                                <div role="gridcell" key={day.getTime()}>
                                                    <button
                                                        type="button"
                                                        data-day
                                                        // Roving tabindex: exactly one day is
                                                        // tabbable, the rest are reached with
                                                        // arrows. 42 tab stops would be a maze.
                                                        tabIndex={isFocused ? 0 : -1}
                                                        disabled={dayDisabled}
                                                        aria-label={formatFull(day)}
                                                        aria-selected={isSelected}
                                                        aria-current={isToday ? "date" : undefined}
                                                        onClick={() => handlePick(d)}
                                                        onFocus={() => setFocusedDay(day)}
                                                        className={[
                                                            "h-9 md:h-8 w-full flex items-center justify-center text-sm rounded-md transition-colors",
                                                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                                            dayDisabled
                                                                ? "text-fg-faint cursor-not-allowed"
                                                                : "text-fg hover:bg-primary/10 cursor-pointer",
                                                            !inMonth && !dayDisabled ? "text-fg-muted" : "",
                                                            isSelected ? "bg-primary text-white hover:bg-primary-dark" : "",
                                                            isToday && !isSelected ? "border border-primary text-primary" : "",
                                                        ].join(" ")}
                                                    >
                                                        {d.getDate()}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>

            {showDisabledNote && disabledMessage && (
                <p role="status" className="text-[11px] text-amber-600 mt-0.5 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    {disabledMessage}
                </p>
            )}
        </>
    );
};

DatePicker.propTypes = {
    value: PropTypes.instanceOf(Date),
    onSelect: PropTypes.func,
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
    disabled: PropTypes.bool,
    disabledMessage: PropTypes.string,
    placeholder: PropTypes.string,
    triggerClassName: PropTypes.string,
    onBlur: PropTypes.func,
    id: PropTypes.string,
    ariaInvalid: PropTypes.bool,
    ariaDescribedBy: PropTypes.string,
};

export default DatePicker;
