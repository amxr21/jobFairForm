// Arabic labels for form OPTION VALUES (dropdowns, checkboxes, multi-selects).
//
// The submitted value is ALWAYS the English string — formData, validation,
// and the backend never see Arabic. This file only supplies what the user
// SEES. Each map is { "English value": "Arabic label" }; a missing or empty
// entry falls back to the English value itself (see labelFor() below), so an
// unfinished translation never renders blank.
//
// Fill these in progressively. Nothing here needs to be complete before the
// Arabic UI ships.

export const genderLabels = {
    "Male": "ذكر",
    "Female": "أنثى",
};

export const cityLabels = {
    "Ajman": "عجمان",
    "Sharjah": "الشارقة",
    "Dubai": "دبي",
    "Abu Dhabi": "أبوظبي",
    "Fujairah": "الفجيرة",
    "Ras Al-Khaima": "رأس الخيمة",
    "Um Al-Quwain": "أم القيوين",
};

export const preferredCityLabels = {
    "Sharjah": "الشارقة",
    "Dubai": "دبي",
    "Abu Dhabi": "أبوظبي",
    "Ajman": "عجمان",
    "Al-Ain": "العين",
    "Ras Al-Khaima": "رأس الخيمة",
    "Remote": "عن بعد",
    "Any": "أي مكان",
};

export const opportunityTypeLabels = {
    "Full-time": "دوام كامل",
    "Part-time": "دوام جزئي",
    "Internship": "تدريب",
    "Co-op": "برنامج التعاون الدراسي",
    "Graduate Program": "برنامج الخريجين",
};

export const availabilityLabels = {
    "Immediately": "فورا",
    "Within 1 month": "خلال شهر",
    "Within 3 months": "خلال 3 أشهر",
    "After graduation": "بعد التخرج",
};

export const languageLabels = {
    "Arabic": "العربية",
    "English": "الإنجليزية",
    "French": "الفرنسية",
    "Spanish": "الإسبانية",
    "German": "الألمانية",
    "Chinese": "الصينية",
    "Other": "أخرى",
};

// Countries (195), study programs (4), colleges (14), majors (132),
// technical/non-technical skills (~100), and industries (~90) are large
// enough that they get their own generated files rather than living inline
// here. See countries.js, degreePrograms.js, skills.js, industries.js.
//
// labelFor() is the single lookup every SelectInput/SkillsMultiSelect calls
// through, so it works identically regardless of which map an option came
// from.

/**
 * @param {Record<string,string>} map - one of the *Labels maps above
 * @param {string} value - the canonical English value stored in formData
 * @returns {string} the Arabic label, or the English value if untranslated
 */
export const labelFor = (map, value) => (map && map[value]) || value;
