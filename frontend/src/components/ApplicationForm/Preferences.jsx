import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronDown } from "lucide-react";
import useFormContext from "../../hooks/useFormContext";
import useDropdownPosition from "../../hooks/useDropdownPosition";
import { Input, SelectInput } from "./index";

// Industry Fields for job interests
const INDUSTRY_FIELDS = [
    // Technology & IT
    "Information Technology", "Software Development", "Artificial Intelligence", "Machine Learning",
    "Data Science", "Cybersecurity", "Cloud Computing", "Blockchain", "Internet of Things (IoT)",
    "Robotics", "Web Development", "Mobile App Development", "Game Development", "DevOps", "IT Consulting",
    // Finance & Banking
    "Banking", "Investment Banking", "Asset Management", "Insurance", "FinTech", "Accounting",
    "Financial Services", "Venture Capital", "Private Equity",
    // Healthcare & Life Sciences
    "Healthcare", "Pharmaceuticals", "Biotechnology", "Medical Devices", "Clinical Research", "Health Tech",
    // Energy & Utilities
    "Oil & Gas", "Renewable Energy", "Solar Energy", "Utilities", "Energy Management",
    // Manufacturing & Engineering
    "Manufacturing", "Automotive", "Aerospace", "Defense", "Electronics", "Industrial Engineering",
    "Civil Engineering", "Chemical Engineering",
    // Retail & Consumer
    "Retail", "E-commerce", "Consumer Goods", "Fashion & Apparel", "Food & Beverage", "Hospitality", "Tourism & Travel",
    // Media & Entertainment
    "Media", "Entertainment", "Advertising", "Public Relations", "Broadcasting", "Digital Marketing", "Content Creation",
    // Professional Services
    "Consulting", "Legal Services", "Human Resources", "Recruitment", "Business Services", "Management Consulting",
    // Construction & Real Estate
    "Construction", "Real Estate", "Architecture", "Property Management", "Interior Design",
    // Logistics & Supply Chain
    "Logistics", "Supply Chain", "Transportation", "Shipping & Maritime", "Warehousing",
    // Education & Research
    "Education", "EdTech", "Research & Development", "Training & Development",
    // Government & Public Sector
    "Government", "Public Administration", "Non-Profit Organizations", "NGOs",
    // Telecommunications
    "Telecommunications", "Networking", "5G Technology",
    // Agriculture & Environment
    "Agriculture", "AgriTech", "Environmental Services", "Sustainability"
];

const Preferences = () => {
    const { formData, updateFormData, setFormData } = useFormContext();
    const [opportunityTypes, setOpportunityTypes] = useState(formData["Opportunity Type"] || []);

    // Field Interest Multi-select state
    const [isFieldOpen, setIsFieldOpen] = useState(false);
    const [fieldSearchTerm, setFieldSearchTerm] = useState("");
    const fieldDropdownRef = useRef(null);
    const fieldTriggerRef = useRef(null);
    const fieldPanelRef = useRef(null);
    const fieldInputRef = useRef(null);
    const fieldTriggerRect = useDropdownPosition(fieldTriggerRef, isFieldOpen);

    const selectedFields = Array.isArray(formData["Field Interest"]) ? formData["Field Interest"] : [];

    const opportunityOptions = ["Full-time", "Part-time", "Internship", "Co-op", "Graduate Program"];
    const cityOptions = ["Sharjah", "Dubai", "Abu Dhabi", "Ajman", "Al-Ain", "Ras Al-Khaima", "Remote", "Any"];
    const availabilityOptions = ["Immediately", "Within 1 month", "Within 3 months", "After graduation"];

    // Handle click outside for field dropdown — the panel is portaled to
    // document.body, so it's checked separately from fieldDropdownRef.
    useEffect(() => {
        const handleClickOutside = (e) => {
            const insideTrigger = fieldDropdownRef.current && fieldDropdownRef.current.contains(e.target);
            const insidePanel = fieldPanelRef.current && fieldPanelRef.current.contains(e.target);
            if (!insideTrigger && !insidePanel) setIsFieldOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredFields = INDUSTRY_FIELDS.filter(field =>
        field.toLowerCase().includes(fieldSearchTerm.toLowerCase()) &&
        !selectedFields.includes(field)
    );

    const handleFieldSelect = (field) => {
        const newFields = [...selectedFields, field];
        setFormData(prev => ({ ...prev, "Field Interest": newFields }));
        setFieldSearchTerm("");
        fieldInputRef.current?.focus();
    };

    const handleFieldRemove = (field) => {
        const newFields = selectedFields.filter(f => f !== field);
        setFormData(prev => ({ ...prev, "Field Interest": newFields }));
    };

    const handleFieldKeyDown = (e) => {
        if (e.key === "Backspace" && fieldSearchTerm === "" && selectedFields.length > 0) {
            handleFieldRemove(selectedFields[selectedFields.length - 1]);
        }
        if (e.key === "Enter") {
            e.preventDefault();
            if (filteredFields.length > 0) {
                handleFieldSelect(filteredFields[0]);
            }
        }
        if (e.key === "Escape") {
            setIsFieldOpen(false);
        }
    };

    const handleOpportunityTypeChange = (type) => {
        const newTypes = opportunityTypes.includes(type)
            ? opportunityTypes.filter(t => t !== type)
            : [...opportunityTypes, type];
        setOpportunityTypes(newTypes);
        updateFormData("Opportunity Type", newTypes);
    };

    return (
        <div id="Preferences" className="h-full flex flex-col w-full overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-1 -m-1">
                <div className="grid grid-cols-12 w-full gap-x-3 md:gap-x-4 gap-y-3 md:gap-y-4">
                    {/* Row 1: Field of Interest (Multi-select) & Work Location */}
                    <div className="col-span-12 md:col-span-6 flex flex-col" ref={fieldDropdownRef}>
                        <h2 className="text-xs md:text-sm mb-1">Field Interest:</h2>

                        {/* Multi-select Input Container */}
                        <div
                            ref={fieldTriggerRef}
                            className={`relative w-full min-h-[32px] md:min-h-[36px] px-2 py-1 bg-white dark:bg-[#1a2438] border border-line-strong rounded-md cursor-text flex flex-wrap gap-1 items-center pr-8 transition-all duration-200 ${
                                isFieldOpen ? 'ring-2 ring-primary border-transparent' : 'hover:border-fg-faint'
                            }`}
                            onClick={() => {
                                setIsFieldOpen(true);
                                fieldInputRef.current?.focus();
                            }}
                        >
                            {/* Selected Tags */}
                            {selectedFields.map((field) => (
                                <span
                                    key={field}
                                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[#0E7F41]/10 text-[#0E7F41] text-[10px] md:text-xs rounded-md"
                                >
                                    {field}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleFieldRemove(field);
                                        }}
                                        className="hover:text-red-500 transition-colors ml-0.5"
                                    >
                                        <X className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                    </button>
                                </span>
                            ))}

                            {/* Search Input */}
                            <input
                                ref={fieldInputRef}
                                type="text"
                                value={fieldSearchTerm}
                                onChange={(e) => setFieldSearchTerm(e.target.value)}
                                onFocus={() => setIsFieldOpen(true)}
                                onKeyDown={handleFieldKeyDown}
                                placeholder={selectedFields.length === 0 ? "Search industries..." : ""}
                                className="flex-1 min-w-[80px] outline-none text-xs md:text-sm py-0.5 bg-transparent"
                            />

                            {/* Dropdown Arrow */}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronDown className={`h-3.5 w-3.5 md:h-4 md:w-4 text-fg-muted transition-transform duration-200 ${isFieldOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </div>

                        {/* Dropdown — portaled to document.body so it isn't
                            clipped by the step containers' overflow-hidden. */}
                        {isFieldOpen && fieldTriggerRect && createPortal(
                            <div
                                ref={fieldPanelRef}
                                className="overlay-pop fixed z-[1000] bg-white dark:bg-[#131b2c] border-line border rounded-md shadow-lg max-h-40 md:max-h-48 overflow-y-auto"
                                style={{ top: fieldTriggerRect.bottom + 4, left: fieldTriggerRect.left, width: fieldTriggerRect.width }}
                            >
                                {filteredFields.length > 0 ? (
                                    filteredFields.slice(0, 15).map((field) => (
                                        <button
                                            key={field}
                                            type="button"
                                            onClick={() => handleFieldSelect(field)}
                                            className="w-full text-left px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-fg hover:bg-surface-hover transition-colors"
                                        >
                                            {field}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-fg-muted">
                                        {fieldSearchTerm ? "No matching fields found" : "All fields selected"}
                                    </div>
                                )}
                                {filteredFields.length > 15 && (
                                    <div className="px-2 md:px-3 py-1.5 text-[10px] md:text-xs text-fg-faint border-line border-t">
                                        Type to filter more...
                                    </div>
                                )}
                            </div>,
                            document.body
                        )}

                        {/* Selected count */}
                        {selectedFields.length > 0 && (
                            <p className="text-[10px] md:text-xs text-fg-muted mt-0.5">
                                {selectedFields.length} field{selectedFields.length !== 1 ? 's' : ''} selected
                            </p>
                        )}
                    </div>

                    <SelectInput
                        label="Preferred Work City"
                        options={cityOptions}
                        value={formData["Preferred Work City"] || ""}
                        placeholder="Select preferred location"
                        required={false}
                        fieldClasses="col-span-12 md:col-span-6"
                    />

                    {/* Row 2: Opportunity Type */}
                    <div className="col-span-12">
                        <h2 className="text-xs md:text-sm mb-1">What type of opportunity are you looking for?</h2>
                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                            {opportunityOptions.map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => handleOpportunityTypeChange(type)}
                                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md border text-xs md:text-sm transition-all duration-200 ${
                                        opportunityTypes.includes(type)
                                            ? 'bg-[#0E7F41] text-white border-[#0E7F41]'
                                            : 'bg-surface-card text-fg border-line-strong hover:border-[#0E7F41] hover:text-[#0E7F41]'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Row 3: Career Goals & Availability */}
                    <Input
                        label="Career Goals"
                        fieldClasses="col-span-12 md:col-span-6"
                        required={false}
                    />
                    <SelectInput
                        label="Availability"
                        options={availabilityOptions}
                        value={formData["Availability"] || ""}
                        placeholder="Select availability"
                        required={false}
                        fieldClasses="col-span-12 md:col-span-6"
                    />
                </div>
            </div>
        </div>
    );
};

export default Preferences;
