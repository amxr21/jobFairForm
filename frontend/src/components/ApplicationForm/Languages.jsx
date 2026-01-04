import { RequiredAstrik } from "./index";
import { useState, useContext } from "react";
import { FormContext } from "../../Context/FormContext";

const COMMON_LANGUAGES = [
    "Arabic", "English", "French", "Spanish", "German",
    "Chinese", "Hindi", "Urdu", "Turkish", "Persian",
    "Korean", "Japanese", "Russian", "Portuguese", "Italian"
];

const Languages = ({ classes }) => {
    const { formData, setFormData } = useContext(FormContext);
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [otherLanguage, setOtherLanguage] = useState("");

    const handleLanguageToggle = (lang) => {
        setFormData((prev) => {
            const currentLangs = prev.languages || [];
            if (currentLangs.includes(lang)) {
                return { ...prev, languages: currentLangs.filter(l => l !== lang) };
            } else {
                return { ...prev, languages: [...currentLangs, lang] };
            }
        });
    };

    const handleOtherToggle = () => {
        setShowOtherInput(!showOtherInput);
        if (showOtherInput) {
            // Remove any "Other" custom languages when unchecking
            setFormData((prev) => ({
                ...prev,
                languages: prev.languages.filter(l => COMMON_LANGUAGES.includes(l))
            }));
            setOtherLanguage("");
        }
    };

    const handleAddOtherLanguage = () => {
        if (otherLanguage.trim() && !formData.languages.includes(otherLanguage.trim())) {
            setFormData((prev) => ({
                ...prev,
                languages: [...prev.languages, otherLanguage.trim()]
            }));
            setOtherLanguage("");
        }
    };

    const handleRemoveLanguage = (lang) => {
        setFormData((prev) => ({
            ...prev,
            languages: prev.languages.filter(l => l !== lang)
        }));
    };

    const customLanguages = formData.languages?.filter(l => !COMMON_LANGUAGES.includes(l)) || [];

    return (
        <div className={`flex flex-col grow mb-2 md:my-0 ${classes}`}>
            <h2 className="text-sm md:text-base mb-1.5">Languages: <RequiredAstrik required={true} /></h2>

            {/* Selected languages display */}
            {formData.languages?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                    {formData.languages.map((lang) => (
                        <span
                            key={lang}
                            className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs flex items-center gap-1"
                        >
                            {lang}
                            <button
                                type="button"
                                onClick={() => handleRemoveLanguage(lang)}
                                className="text-blue-600 hover:text-blue-800 font-bold"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Language checkboxes - flex wrap */}
            <div id="Languages" className="flex flex-wrap gap-x-3 gap-y-2 mb-2">
                {COMMON_LANGUAGES.slice(0, 6).map((lang) => (
                    <div key={lang} className="checkbox flex items-center">
                        <input
                            type="checkbox"
                            id={lang}
                            checked={formData.languages?.includes(lang) || false}
                            onChange={() => handleLanguageToggle(lang)}
                            className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 accent-blue-800"
                        />
                        <label htmlFor={lang} className="text-xs md:text-sm cursor-pointer">{lang}</label>
                    </div>
                ))}
                <div className="checkbox flex items-center">
                    <input
                        type="checkbox"
                        id="Other"
                        checked={showOtherInput}
                        onChange={handleOtherToggle}
                        className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 accent-blue-800"
                    />
                    <label htmlFor="Other" className="text-xs md:text-sm cursor-pointer">Other</label>
                </div>
            </div>

            {/* Other languages multiselect input */}
            {showOtherInput && (
                <div className="flex flex-col gap-2 mt-1 p-2 md:p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Select additional languages or type your own:</p>

                    {/* Quick select from remaining common languages */}
                    <div className="flex flex-wrap gap-1.5 mb-1">
                        {COMMON_LANGUAGES.slice(6).map((lang) => (
                            <button
                                key={lang}
                                type="button"
                                onClick={() => handleLanguageToggle(lang)}
                                className={`px-2 py-0.5 rounded-full text-xs border transition-colors ${
                                    formData.languages?.includes(lang)
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                                }`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>

                    {/* Custom language input */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={otherLanguage}
                            onChange={(e) => setOtherLanguage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOtherLanguage())}
                            placeholder="Type a language..."
                            className="flex-1 h-8 md:h-9 bg-transparent border border-gray-700 rounded-lg py-1 px-2 text-xs md:text-sm"
                        />
                        <button
                            type="button"
                            onClick={handleAddOtherLanguage}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs md:text-sm hover:bg-blue-700 transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Languages;