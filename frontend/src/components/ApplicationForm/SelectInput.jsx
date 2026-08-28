import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import useFormContext from "../../hooks/useFormContext";
import useDropdownPosition from "../../hooks/useDropdownPosition";
import { RequiredAstrik } from "./index";

// Type-to-filter is a desktop affordance. On touch it costs more than it
// gives: focusing the search input raises the keyboard over the option list.
const isDesktop = () =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

const SelectInput = ({ label, value, options, fieldClasses, selectClasses, handleChange, required = true, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [touched, setTouched] = useState(false);
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);
    const inputRef = useRef(null);
    const triggerRect = useDropdownPosition(triggerRef, isOpen);

    const { formData, updateFormData, fieldMissing } = useFormContext();

    // Get current value from formData or prop
    const currentValue = value !== undefined ? value : (formData[label] || "");

    // fieldMissing starts as an array (FormContext.jsx's initial useState)
    // and becomes a comma-joined string after the first updateFormData call —
    // normalize both shapes the same way Input.jsx does before matching this
    // field's own label against it.
    const missingList = Array.isArray(fieldMissing) ? fieldMissing : (fieldMissing || "").split(", ");
    const fieldErrorMsg = missingList.find((msg) => msg && msg.startsWith(label));
    const showError = touched && required && Boolean(fieldErrorMsg);
    const isValid = touched && required && !fieldErrorMsg && Boolean(currentValue);

    const getBorderClass = () => {
        if (isOpen) return "ring-2 ring-primary border-transparent";
        if (showError) return "border-red-400";
        if (isValid) return "border-primary";
        return "hover:border-fg-faint";
    };

    // Close dropdown when clicking outside — the panel is portaled to
    // document.body, so it's checked separately from dropdownRef (which only
    // wraps the label + trigger, not the portaled panel).
    const panelRef = useRef(null);
    useEffect(() => {
        if (!isOpen) return;
        // `pointerdown`, not `mousedown`: touch devices fire *synthetic* mouse
        // events ~300ms after the touch, and their ordering against React's
        // synthetic click is not consistent across iOS Safari and Android
        // Chrome. That let this handler close the panel that the trigger's
        // onClick had just opened, so taps alternated open/closed and the
        // dropdown appeared to need three taps. pointerdown fires once per
        // interaction on both input types, always before click.
        const handleClickOutside = (event) => {
            const insideTrigger = dropdownRef.current && dropdownRef.current.contains(event.target);
            const insidePanel = panelRef.current && panelRef.current.contains(event.target);
            if (!insideTrigger && !insidePanel) {
                setTouched(true);
                setIsOpen(false);
                setSearchTerm("");
            }
        };
        document.addEventListener("pointerdown", handleClickOutside);
        return () => document.removeEventListener("pointerdown", handleClickOutside);
    }, [isOpen]);

    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option) => {
        if (handleChange) {
            handleChange(option);
        }
        updateFormData(label, option);
        setIsOpen(false);
        setSearchTerm("");
        setTouched(true);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (filteredOptions.length > 0) {
                handleSelect(filteredOptions[0]);
            }
        }
        if (e.key === "Escape") {
            setIsOpen(false);
            setSearchTerm("");
        }
        if (e.key === "ArrowDown" && !isOpen) {
            setIsOpen(true);
        }
    };

    return (
        <div className={`flex flex-col ${fieldClasses}`} ref={dropdownRef}>
            <h2 className="text-xs md:text-sm mb-1">
                {label}: {required && <RequiredAstrik required={true} />}
            </h2>

            {/* Input Container — role/tabIndex/keydown make it operable by
                keyboard (Enter/Space/ArrowDown open it), not just mouse. */}
            <div
                ref={triggerRef}
                role="button"
                tabIndex={0}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label={`${label}: ${currentValue || placeholder || `Select ${label === "Study Program" ? "Program" : label}`}`}
                onKeyDown={(e) => {
                    if (!isOpen && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
                        e.preventDefault();
                        setIsOpen(true);
                        if (isDesktop()) setTimeout(() => inputRef.current?.focus(), 0);
                    } else if (isOpen && e.key === "Escape") {
                        setIsOpen(false);
                        setTouched(true);
                    }
                }}
                className={`relative w-full min-h-[44px] md:min-h-[36px] px-2 py-1 bg-white dark:bg-[#1a2438] border border-line-strong rounded-md cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${getBorderClass()} ${selectClasses || ''}`}
                onClick={() => {
                    setIsOpen((wasOpen) => {
                        if (wasOpen) {
                            setSearchTerm("");
                            setTouched(true);
                            return false;
                        }
                        // Focusing the search box opens the on-screen keyboard,
                        // which covers exactly where the panel is about to be
                        // placed. Desktop keeps type-to-filter; mobile opens
                        // straight to a tappable list.
                        if (isDesktop()) setTimeout(() => inputRef.current?.focus(), 0);
                        return true;
                    });
                }}
            >
                <div className="flex items-center justify-between h-full">
                    {/* Selected Value or Search Input */}
                    {isOpen ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={currentValue || placeholder || `Search ${label === "Study Program" ? "Program" : label}...`}
                            className="flex-1 outline-none text-xs md:text-sm bg-transparent"
                            autoFocus={isDesktop()}
                        />
                    ) : (
                        <span className={`flex-1 text-xs md:text-sm truncate ${!currentValue ? 'text-fg-faint' : 'text-fg'}`}>
                            {currentValue || placeholder || `Select ${label === "Study Program" ? "Program" : label}`}
                        </span>
                    )}

                    {/* Dropdown Arrow */}
                    <div className="pointer-events-none ml-2 shrink-0">
                        <ChevronDown className={`h-3.5 w-3.5 md:h-4 md:w-4 text-fg-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </div>

            {/* Dropdown — portaled to document.body so it isn't clipped by the
                step containers' overflow-hidden (needed for the step-slide
                transition), positioned under the trigger via triggerRect. */}
            {isOpen && triggerRect && createPortal(
                <div
                    ref={panelRef}
                    className="overlay-pop fixed z-[1000] bg-white dark:bg-[#131b2c] border-line border rounded-md shadow-lg overflow-y-auto overscroll-contain"
                    style={{
                        top: triggerRect.top,
                        bottom: triggerRect.bottom,
                        left: triggerRect.left,
                        width: triggerRect.width,
                        maxHeight: triggerRect.maxHeight,
                    }}
                >
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelect(option)}
                                className={`w-full px-2 md:px-3 py-1.5 md:py-2 text-left text-xs md:text-sm transition-colors duration-150 first:rounded-t-md last:rounded-b-md ${
                                    option === currentValue
                                        ? 'bg-[#0E7F41]/10 text-[#0E7F41] font-medium'
                                        : 'text-fg hover:bg-surface-hover'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="truncate">{option}</span>
                                    {option === currentValue && (
                                        <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#0E7F41] shrink-0 ml-2" />
                                    )}
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-fg-muted">
                            No matching options found
                        </div>
                    )}
                </div>,
                document.body
            )}
            {showError && (
                <p className="text-xs text-red-500 mt-0.5 ml-1">{fieldErrorMsg}</p>
            )}
        </div>
    );
};

SelectInput.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    fieldClasses: PropTypes.string,
    selectClasses: PropTypes.string,
    handleChange: PropTypes.func,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
};

export default SelectInput;