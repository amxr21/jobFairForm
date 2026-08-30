import PropTypes from "prop-types";
import { RequiredAstrik } from "./index";
import { useState, useContext } from "react";
import { FormContext } from "../../context/FormContext";
import useLocaleContext from "../../hooks/useLocaleContext";
import useTranslation from "../../hooks/useTranslation";
import { labelFor, languageLabels } from "../../i18n/options";

const COMMON_LANGUAGES = [
    "Arabic", "English", "French", "Spanish", "German",
    "Chinese", "Hindi", "Urdu", "Turkish", "Persian",
    "Korean", "Japanese", "Russian", "Portuguese", "Italian"
];

const Languages = ({ classes }) => {
    const { formData, setFormData } = useContext(FormContext);
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [otherLanguage, setOtherLanguage] = useState("");
    const { locale } = useLocaleContext();
    const t = useTranslation();
    // The 15-item COMMON_LANGUAGES list is every OTHER option list's
    // pattern (countries, skills, industries): the checkbox VALUE stored in
    // formData.languages stays the canonical English name; only the label
    // shown to the user translates. A custom language the user TYPES (the
    // "Other" flow below) is never run through this, since it isn't one of
    // our known options — same rule SkillsMultiSelect's "+ Add" row follows.
    const displayLang = (lang) => (locale === "ar" ? labelFor(languageLabels, lang) : lang);

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

    return (
        <div className={`flex flex-col grow mb-2 md:my-0 ${classes}`}>
            <h2 className="text-sm md:text-base mb-1.5">{t("fields.languages")}: <RequiredAstrik required={true} /></h2>

            {/* Language checkboxes - flex wrap (this is the field itself) */}
            <div id="Languages" className="flex flex-wrap gap-x-3 gap-y-2">
                {COMMON_LANGUAGES.slice(0, 6).map((lang) => (
                    <div key={lang} className="checkbox flex items-center min-h-[44px] md:min-h-0 pe-2">
                        <input
                            type="checkbox"
                            id={lang}
                            checked={formData.languages?.includes(lang) || false}
                            onChange={() => handleLanguageToggle(lang)}
                            className="w-5 h-5 md:w-4 md:h-4 me-1.5 accent-[#0E7F41] shrink-0"
                        />
                        <label htmlFor={lang} className="text-sm md:text-sm cursor-pointer py-2 md:py-0">{displayLang(lang)}</label>
                    </div>
                ))}
                <div className="checkbox flex items-center min-h-[44px] md:min-h-0 pe-2">
                    <input
                        type="checkbox"
                        id="Other"
                        checked={showOtherInput}
                        onChange={handleOtherToggle}
                        className="w-5 h-5 md:w-4 md:h-4 me-1.5 accent-[#0E7F41] shrink-0"
                    />
                    <label htmlFor="Other" className="text-sm md:text-sm cursor-pointer py-2 md:py-0">{t("languagesField.other")}</label>
                </div>
            </div>

            {/* Selected languages display — below the field, not between the
                label and the checkboxes */}
            {formData.languages?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.languages.map((lang) => (
                        <span
                            key={lang}
                            className="bg-[#0E7F41]/10 text-[#0E7F41] px-2 py-0.5 rounded-full text-xs flex items-center gap-1"
                        >
                            {displayLang(lang)}
                            <button
                                type="button"
                                onClick={() => handleRemoveLanguage(lang)}
                                className="text-[#0E7F41] hover:text-[#0a5f31] font-bold"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Other languages multiselect input */}
            {showOtherInput && (
                <div className="flex flex-col gap-2 mt-1 p-2 md:p-3 bg-surface-hover rounded-md">
                    <p className="text-xs text-fg-muted">{t("languagesField.selectOrType")}</p>

                    {/* Quick select from remaining common languages */}
                    <div className="flex flex-wrap gap-1.5 mb-1">
                        {COMMON_LANGUAGES.slice(6).map((lang) => (
                            <button
                                key={lang}
                                type="button"
                                onClick={() => handleLanguageToggle(lang)}
                                className={`px-2 py-0.5 rounded-full text-xs border transition-colors ${
                                    formData.languages?.includes(lang)
                                        ? 'bg-[#0E7F41] text-white border-[#0E7F41]'
                                        : 'bg-surface-card text-fg border-line hover:border-[#0E7F41]'
                                }`}
                            >
                                {displayLang(lang)}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            dir={locale === "ar" ? "rtl" : "ltr"}
                            value={otherLanguage}
                            onChange={(e) => setOtherLanguage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOtherLanguage())}
                            placeholder={t("languagesField.typePlaceholder")}
                            className="flex-1 h-11 md:h-9 bg-white dark:bg-[#1a2438] border border-line-strong rounded-md py-1 px-2 text-xs md:text-sm"
                        />
                        <button
                            type="button"
                            onClick={handleAddOtherLanguage}
                            className="px-3 py-1.5 bg-[#0E7F41] text-white rounded-md text-xs md:text-sm hover:bg-[#0a5f31] transition-colors"
                        >
                            {t("languagesField.add")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

Languages.propTypes = {
    classes: PropTypes.string,
};

export default Languages;