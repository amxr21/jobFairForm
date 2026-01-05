import { useState, useRef, useEffect } from "react";
import useFormContext from "../../Hooks/useFormContext";
import { RequiredAstrik } from "./index";

const SelectInput = ({ label, value, options, fieldClasses, selectClasses, handleChange, required = true, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    const { formData, updateFormData } = useFormContext();

    // Get current value from formData or prop
    const currentValue = value !== undefined ? value : (formData[label] || "");

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

            {/* Input Container */}
            <div
                className={`relative w-full min-h-[32px] md:min-h-[36px] px-2 py-1 bg-transparent border border-gray-700 rounded-lg cursor-pointer transition-all duration-200 ${
                    isOpen ? 'ring-2 ring-blue-400 border-transparent' : 'hover:border-gray-500'
                } ${selectClasses || ''}`}
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
                        <svg
                            className={`h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="relative">
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    className={`w-full px-2 md:px-3 py-1.5 md:py-2 text-left text-xs md:text-sm transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg ${
                                        option === currentValue
                                            ? 'bg-blue-50 text-blue-700 font-medium'
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="truncate">{option}</span>
                                        {option === currentValue && (
                                            <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-gray-500">
                                No matching options found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectInput;