import { useState } from "react";
import useFormContext from "../../Hooks/useFormContext";
import { Input, SelectInput } from "./index";

const Preferences = () => {
    const { formData, updateFormData } = useFormContext();
    const [opportunityTypes, setOpportunityTypes] = useState(formData["Opportunity Type"] || []);

    const opportunityOptions = ["Full-time", "Part-time", "Internship", "Co-op", "Graduate Program"];
    const cityOptions = ["Sharjah", "Dubai", "Abu Dhabi", "Ajman", "Al-Ain", "Ras Al-Khaima", "Remote", "Any"];
    const availabilityOptions = ["Immediately", "Within 1 month", "Within 3 months", "After graduation"];

    const handleOpportunityTypeChange = (type) => {
        const newTypes = opportunityTypes.includes(type)
            ? opportunityTypes.filter(t => t !== type)
            : [...opportunityTypes, type];
        setOpportunityTypes(newTypes);
        updateFormData("Opportunity Type", newTypes);
    };

    return (
        <div id="Preferences" className="h-full flex flex-col w-full overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                <div className="grid grid-cols-12 w-full gap-x-3 md:gap-x-4 gap-y-3 md:gap-y-4">
                    {/* Row 1: Field of Interest & Work Location */}
                    <Input
                        label="Field Interest"
                        fieldClasses="col-span-12 md:col-span-6"
                    />
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
                                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg border text-xs md:text-sm transition-all duration-200 ${
                                        opportunityTypes.includes(type)
                                            ? 'bg-[#2959A6] text-white border-[#2959A6]'
                                            : 'bg-white text-gray-700 border-gray-700 hover:border-[#2959A6] hover:text-[#2959A6]'
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
