import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, ChevronDown, Calendar as CalendarIcon, Check } from "lucide-react";
import useDropdownPosition from "../../hooks/useDropdownPosition";

// A self-contained date picker built from scratch — no react-day-picker, no
// Radix. A plain trigger button plus a panel portaled to document.body (so it
// escapes the step containers' overflow-hidden) with hand-built month grid,
// working prev/next arrows, and a custom month/year dropdown (not native
// <select>, so it can be styled/themed consistently). No enter animation, so
// it appears in place rather than sliding in from a corner.

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const formatDisplay = (date) =>
    date
        ? date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : "";

// Build the 6-row grid (42 cells) for a given month, including leading/trailing
// days from adjacent months so the calendar is always a full rectangle.
function buildMonthGrid(viewYear, viewMonth) {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startWeekday = firstOfMonth.getDay(); // 0 = Sunday
    const gridStart = new Date(viewYear, viewMonth, 1 - startWeekday);
    const cells = [];
    for (let i = 0; i < 42; i++) {
        const d = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
        cells.push(d);
    }
    return cells;
}

const DatePicker = ({
    value,          // Date | null
    onSelect,       // (Date) => void
    minDate,        // Date | undefined
    maxDate,        // Date | undefined
    disabled = false,
    disabledMessage, // shown when a disabled trigger is clicked
    placeholder = "Select a date",
    triggerClassName = "",
    onBlur,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showDisabledNote, setShowDisabledNote] = useState(false);
    const [monthPickerOpen, setMonthPickerOpen] = useState(false);
    const [yearPickerOpen, setYearPickerOpen] = useState(false);
    // The month currently being viewed in the panel. Defaults to the selected
    // date's month, else the maxDate's month (e.g. 20 years ago for DOB), else
    // today — so DOB opens near the right decade instead of the current month.
    const initialView = value || maxDate || new Date();
    const [viewYear, setViewYear] = useState(initialView.getFullYear());
    const [viewMonth, setViewMonth] = useState(initialView.getMonth());

    const wrapRef = useRef(null);
    const triggerRef = useRef(null);
    const panelRef = useRef(null);
    const rect = useDropdownPosition(triggerRef, isOpen);

    // Close on outside click (panel is portaled, so check it separately).
    // Only fires onBlur when the picker was actually open — otherwise every
    // unrelated click anywhere on the page (e.g. into a different field)
    // would mark this field "touched" and show a validation error before the
    // user ever interacted with it.
    useEffect(() => {
        if (!isOpen) return;
        const onDown = (e) => {
            const inTrigger = wrapRef.current && wrapRef.current.contains(e.target);
            const inPanel = panelRef.current && panelRef.current.contains(e.target);
            if (!inTrigger && !inPanel) {
                setIsOpen(false);
                onBlur?.();
            }
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [isOpen, onBlur]);

    // When opening, reset the view to the selected date (or the sensible
    // default) so it never opens on a stale month.
    const open = () => {
        if (disabled) return;
        const v = value || maxDate || new Date();
        setViewYear(v.getFullYear());
        setViewMonth(v.getMonth());
        setIsOpen(true);
    };

    const goToPrevMonth = () => {
        setViewMonth((m) => {
            if (m === 0) { setViewYear((y) => y - 1); return 11; }
            return m - 1;
        });
    };
    const goToNextMonth = () => {
        setViewMonth((m) => {
            if (m === 11) { setViewYear((y) => y + 1); return 0; }
            return m + 1;
        });
    };

    const isDisabledDay = (d) => {
        const day = startOfDay(d);
        if (minDate && day < startOfDay(minDate)) return true;
        if (maxDate && day > startOfDay(maxDate)) return true;
        return false;
    };

    const handlePick = (d) => {
        if (isDisabledDay(d)) return;
        onSelect?.(startOfDay(d));
        setIsOpen(false);
    };

    // Year range for the dropdown: from (maxDate or today) back 80 years.
    const yearAnchor = (maxDate || new Date()).getFullYear();
    const yearOptions = [];
    for (let y = yearAnchor; y >= yearAnchor - 80; y--) yearOptions.push(y);

    const cells = buildMonthGrid(viewYear, viewMonth);
    const selectedDay = value ? startOfDay(value) : null;
    const today = startOfDay(new Date());

    return (
        <div ref={wrapRef} className="w-full">
            <button
                ref={triggerRef}
                type="button"
                aria-disabled={disabled}
                onClick={() => {
                    // Kept clickable even when disabled so we can explain *why*
                    // it's disabled rather than silently doing nothing.
                    if (disabled) {
                        if (disabledMessage) {
                            setShowDisabledNote(true);
                            setTimeout(() => setShowDisabledNote(false), 3000);
                        }
                        return;
                    }
                    isOpen ? setIsOpen(false) : open();
                }}
                onBlur={onBlur}
                className={`h-8 md:h-9 w-full bg-transparent border rounded-md py-1 px-2 text-xs md:text-sm flex items-center justify-between text-left transition-all duration-200 ${disabled ? "cursor-not-allowed" : ""} ${triggerClassName}`}
            >
                <span className={value ? "text-fg" : "text-fg-faint"}>
                    {value ? formatDisplay(value) : placeholder}
                </span>
                <CalendarIcon className="h-3.5 w-3.5 md:h-4 md:w-4 text-fg-muted shrink-0" />
            </button>
            {showDisabledNote && disabledMessage && (
                <p className="text-[11px] text-amber-600 mt-0.5 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    {disabledMessage}
                </p>
            )}

            {isOpen && rect && createPortal(
                <div
                    ref={panelRef}
                    className="fixed z-[1000] bg-surface-card border-line border rounded-md shadow-lg p-3 w-[280px]"
                    style={{ top: rect.bottom + 4, left: rect.left }}
                >
                    {/* Header: prev arrow, month + year pickers, next arrow */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                        <button
                            type="button"
                            onClick={goToPrevMonth}
                            className="h-7 w-7 rounded-md border-line border text-fg-muted hover:bg-surface-hover transition-colors inline-flex items-center justify-center shrink-0"
                            aria-label="Previous month"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <div className="flex items-center gap-1">
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => { setMonthPickerOpen((o) => !o); setYearPickerOpen(false); }}
                                    className="text-sm font-medium border-line border rounded-md pl-2 pr-1 py-1 bg-surface-card text-fg cursor-pointer hover:bg-surface-hover transition-all duration-200 ease-out inline-flex items-center gap-0.5"
                                >
                                    {MONTHS[viewMonth]}
                                    <ChevronDown className="h-3.5 w-3.5 text-fg-muted" />
                                </button>
                                {monthPickerOpen && (
                                    <div className="absolute z-10 top-full left-0 mt-1 bg-surface-card border-line border rounded-md shadow-lg max-h-48 overflow-y-auto w-32">
                                        {MONTHS.map((m, i) => (
                                            <button
                                                key={m}
                                                type="button"
                                                onClick={() => { setViewMonth(i); setMonthPickerOpen(false); }}
                                                className={`w-full text-left px-2.5 py-1.5 text-sm flex items-center justify-between transition-colors ${
                                                    i === viewMonth ? "bg-primary/10 text-primary font-medium" : "text-fg hover:bg-surface-hover"
                                                }`}
                                            >
                                                {m}
                                                {i === viewMonth && <Check className="h-3.5 w-3.5" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => { setYearPickerOpen((o) => !o); setMonthPickerOpen(false); }}
                                    className="text-sm font-medium border-line border rounded-md pl-2 pr-1 py-1 bg-surface-card text-fg cursor-pointer hover:bg-surface-hover transition-all duration-200 ease-out inline-flex items-center gap-0.5"
                                >
                                    {viewYear}
                                    <ChevronDown className="h-3.5 w-3.5 text-fg-muted" />
                                </button>
                                {yearPickerOpen && (
                                    <div className="absolute z-10 top-full right-0 mt-1 bg-surface-card border-line border rounded-md shadow-lg max-h-48 overflow-y-auto w-24">
                                        {yearOptions.map((y) => (
                                            <button
                                                key={y}
                                                type="button"
                                                onClick={() => { setViewYear(y); setYearPickerOpen(false); }}
                                                className={`w-full text-left px-2.5 py-1.5 text-sm flex items-center justify-between transition-colors ${
                                                    y === viewYear ? "bg-primary/10 text-primary font-medium" : "text-fg hover:bg-surface-hover"
                                                }`}
                                            >
                                                {y}
                                                {y === viewYear && <Check className="h-3.5 w-3.5" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={goToNextMonth}
                            className="h-7 w-7 rounded-md border-line border text-fg-muted hover:bg-surface-hover transition-colors inline-flex items-center justify-center shrink-0"
                            aria-label="Next month"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Weekday header */}
                    <div className="grid grid-cols-7 mb-1">
                        {WEEKDAYS.map((wd) => (
                            <div key={wd} className="h-7 flex items-center justify-center text-[0.7rem] text-fg-muted font-normal">
                                {wd}
                            </div>
                        ))}
                    </div>

                    {/* Day grid — keyed on the view month so it re-mounts and
                        fades in on each month/year change, making navigation
                        feel smooth rather than an instant swap. */}
                    <div
                        key={`${viewYear}-${viewMonth}`}
                        className="grid grid-cols-7 gap-y-0.5 animate-in fade-in duration-200"
                    >
                        {cells.map((d, i) => {
                            const inMonth = d.getMonth() === viewMonth;
                            const day = startOfDay(d);
                            const isSelected = selectedDay && day.getTime() === selectedDay.getTime();
                            const isToday = day.getTime() === today.getTime();
                            const disabledDay = isDisabledDay(d);
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    disabled={disabledDay}
                                    onClick={() => handlePick(d)}
                                    className={[
                                        "h-8 w-full flex items-center justify-center text-sm rounded-md transition-colors",
                                        disabledDay
                                            ? "text-fg-faint cursor-not-allowed"
                                            : "text-fg hover:bg-primary/10 cursor-pointer",
                                        !inMonth && !disabledDay ? "text-fg-muted" : "",
                                        isSelected ? "bg-[#0E7F41] text-white hover:bg-[#0a5f31]" : "",
                                        isToday && !isSelected ? "border border-[#0E7F41] text-[#0E7F41]" : "",
                                    ].join(" ")}
                                >
                                    {d.getDate()}
                                </button>
                            );
                        })}
                    </div>
                </div>,
                document.body
            )}
        </div>
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
};

export default DatePicker;
