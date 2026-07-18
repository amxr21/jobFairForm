import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import useDropdownPosition from "../../hooks/useDropdownPosition";

// A self-contained date picker built from scratch — no react-day-picker, no
// Radix. A plain trigger button plus a panel portaled to document.body (so it
// escapes the step containers' overflow-hidden) with hand-built month grid,
// working prev/next arrows, and native <select> month/year jumping. No enter
// animation, so it appears in place rather than sliding in from a corner.

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
    useEffect(() => {
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
    }, [onBlur]);

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
                <span className={value ? "" : "text-gray-400"}>
                    {value ? formatDisplay(value) : placeholder}
                </span>
                <CalendarIcon className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500 shrink-0" />
            </button>
            {showDisabledNote && disabledMessage && (
                <p className="text-[11px] text-amber-600 mt-0.5 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    {disabledMessage}
                </p>
            )}

            {isOpen && rect && createPortal(
                <div
                    ref={panelRef}
                    className="fixed z-[1000] bg-white border border-gray-200 rounded-md shadow-lg p-3 w-[280px]"
                    style={{ top: rect.bottom + 4, left: rect.left }}
                >
                    {/* Header: prev arrow, month + year selects, next arrow */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                        <button
                            type="button"
                            onClick={goToPrevMonth}
                            className="h-7 w-7 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors inline-flex items-center justify-center shrink-0"
                            aria-label="Previous month"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <div className="flex items-center gap-1">
                            <select
                                value={viewMonth}
                                onChange={(e) => setViewMonth(Number(e.target.value))}
                                className="text-sm font-medium border border-gray-200 rounded-md px-1.5 py-1 bg-white cursor-pointer hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0E7F41]/40 focus:border-[#0E7F41] transition-all duration-200 ease-out"
                            >
                                {MONTHS.map((m, i) => (
                                    <option key={m} value={i}>{m}</option>
                                ))}
                            </select>
                            <select
                                value={viewYear}
                                onChange={(e) => setViewYear(Number(e.target.value))}
                                className="text-sm font-medium border border-gray-200 rounded-md px-1.5 py-1 bg-white cursor-pointer hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0E7F41]/40 focus:border-[#0E7F41] transition-all duration-200 ease-out"
                            >
                                {yearOptions.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={goToNextMonth}
                            className="h-7 w-7 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors inline-flex items-center justify-center shrink-0"
                            aria-label="Next month"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Weekday header */}
                    <div className="grid grid-cols-7 mb-1">
                        {WEEKDAYS.map((wd) => (
                            <div key={wd} className="h-7 flex items-center justify-center text-[0.7rem] text-gray-500 font-normal">
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
                                            ? "text-gray-300 cursor-not-allowed"
                                            : "hover:bg-[#0E7F41]/10 cursor-pointer",
                                        !inMonth && !disabledDay ? "text-gray-400" : "",
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
