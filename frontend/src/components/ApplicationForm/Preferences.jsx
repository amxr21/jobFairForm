import { useState } from "react";
import useFormContext from "../../hooks/useFormContext";
import { Input, SelectInput, SkillsMultiSelect } from "./index";
import StepContainer from "./StepContainer";
import { LABEL_CLASSES } from "./fieldStyles";
import useLocaleContext from "../../hooks/useLocaleContext";
import {
    labelFor,
    preferredCityLabels,
    opportunityTypeLabels,
    availabilityLabels,
} from "../../i18n/options";
import { industryLabels } from "../../i18n/industries";

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

const opportunityOptions = ["Full-time", "Part-time", "Internship", "Co-op", "Graduate Program"];
const cityOptions = ["Sharjah", "Dubai", "Abu Dhabi", "Ajman", "Al-Ain", "Ras Al-Khaima", "Remote", "Any"];
const availabilityOptions = ["Immediately", "Within 1 month", "Within 3 months", "After graduation"];

const Preferences = () => {
    const { formData, updateFormData } = useFormContext();
    const [opportunityTypes, setOpportunityTypes] = useState(formData["Opportunity Type"] || []);
    const { locale } = useLocaleContext();
    const displayOpportunity = (val) => (locale === "ar" ? labelFor(opportunityTypeLabels, val) : val);

    // The Field Interest multi-select used to be ~110 lines inlined here: its
    // own portal, outside-click effect, chip list, search input and filter —
    // a near-verbatim copy of SkillsMultiSelect with a different option list.
    // It now reuses that component, which also means it inherits the combobox
    // ARIA wiring rather than needing a second implementation of it.

    const handleOpportunityTypeChange = (type) => {
        const newTypes = opportunityTypes.includes(type)
            ? opportunityTypes.filter((t) => t !== type)
            : [...opportunityTypes, type];
        setOpportunityTypes(newTypes);
        updateFormData("Opportunity Type", newTypes);
    };

    return (
        <StepContainer id="Preferences">
            <div className="grid grid-cols-12 w-full gap-x-3 md:gap-x-4 gap-y-3 md:gap-y-4">
                {/* Row 1: Field of Interest (Multi-select) & Work Location */}
                <SkillsMultiSelect
                    label="Field Interest"
                    fieldName="Field Interest"
                    skillsList={INDUSTRY_FIELDS}
                    required={false}
                    allowCustom={false}
                    noun="field"
                    placeholder="Search industries..."
                    fieldClasses="col-span-12 md:col-span-6"
                    labelMap={industryLabels}
                />

                <SelectInput
                    label="Preferred Work City"
                    options={cityOptions}
                    value={formData["Preferred Work City"] || ""}
                    placeholder="Select preferred location"
                    required={false}
                    fieldClasses="col-span-12 md:col-span-6"
                    labelMap={preferredCityLabels}
                />

                {/* Row 2: Opportunity Type — a multi-choice toggle group.
                    role="group" with an accessible name ties the buttons to
                    the question, and aria-pressed conveys each button's on/off
                    state; without it a screen reader announced five plain
                    buttons with no indication of which were chosen. */}
                <div className="col-span-12">
                    <h2 id="opportunity-type-label" className={LABEL_CLASSES}>
                        What type of opportunity are you looking for?
                    </h2>
                    <div
                        role="group"
                        aria-labelledby="opportunity-type-label"
                        className="flex flex-wrap gap-1.5 md:gap-2"
                    >
                        {opportunityOptions.map((type) => {
                            const isSelected = opportunityTypes.includes(type);
                            return (
                                <button
                                    key={type}
                                    type="button"
                                    aria-pressed={isSelected}
                                    onClick={() => handleOpportunityTypeChange(type)}
                                    className={`min-h-[44px] md:min-h-0 px-3 py-1.5 md:px-4 md:py-2 rounded-md border text-xs md:text-sm transition-all duration-200
                                        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                                        isSelected
                                            ? "bg-primary text-white border-primary"
                                            : "bg-surface-card text-fg border-line-strong hover:border-primary hover:text-primary"
                                    }`}
                                >
                                    {displayOpportunity(type)}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Row 3: Career Goals & Availability */}
                <Input
                    label="Career Goals"
                    fieldClasses="col-span-12 md:col-span-6"
                />
                <SelectInput
                    label="Availability"
                    options={availabilityOptions}
                    value={formData["Availability"] || ""}
                    placeholder="Select availability"
                    required={false}
                    fieldClasses="col-span-12 md:col-span-6"
                    labelMap={availabilityLabels}
                />
            </div>
        </StepContainer>
    );
};

export default Preferences;
