import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import useFormContext from "../../hooks/useFormContext";
import useDropdownPosition from "../../hooks/useDropdownPosition";
import { RequiredAstrik } from "./index";

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
        return "hover:border-gray-500";
    };

    // Close dropdown when clicking outside — the panel is portaled to
    // document.body, so it's checked separately from dropdownRef (which only
    // wraps the label + trigger, not the portaled panel).
    const panelRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            const insideTrigger = dropdownRef.current && dropdownRef.current.contains(event.target);
            const insidePanel = panelRef.current && panelRef.current.contains(event.target);
            if (!insideTrigger && !insidePanel) {
                if (isOpen) setTouched(true);
                setIsOpen(false);
                setSearchTerm("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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
                aria-label={label}
                onKeyDown={(e) => {
                    if (!isOpen && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
                        e.preventDefault();
                        setIsOpen(true);
                        setTimeout(() => inputRef.current?.focus(), 0);
                    } else if (isOpen && e.key === "Escape") {
                        setIsOpen(false);
                        setTouched(true);
                    }
                }}
                className={`relative w-full min-h-[32px] md:min-h-[36px] px-2 py-1 bg-transparent border border-gray-700 rounded-md cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${getBorderClass()} ${selectClasses || ''}`}
                onClick={() => {
                    setIsOpen(true);
                    inputRef.current?.focus();
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
                            autoFocus
                        />
                    ) : (
                        <span className={`flex-1 text-xs md:text-sm truncate ${!currentValue ? 'text-gray-400' : 'text-gray-800'}`}>
                            {currentValue || placeholder || `Select ${label === "Study Program" ? "Program" : label}`}
                        </span>
                    )}

                    {/* Dropdown Arrow */}
                    <div className="pointer-events-none ml-2 shrink-0">
                        <ChevronDown className={`h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </div>

            {/* Dropdown — portaled to document.body so it isn't clipped by the
                step containers' overflow-hidden (needed for the step-slide
                transition), positioned under the trigger via triggerRect. */}
            {isOpen && triggerRect && createPortal(
                <div
                    ref={panelRef}
                    className="fixed z-[1000] bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto"
                    style={{ top: triggerRect.bottom + 4, left: triggerRect.left, width: triggerRect.width }}
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
                                        : 'hover:bg-gray-100'
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
                        <div className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-gray-500">
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