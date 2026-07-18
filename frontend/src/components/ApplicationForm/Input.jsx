import PropTypes from "prop-types";
import { RequiredAstrik } from "./index";
import { useRef, useState } from "react";
import useFormContext from "../../hooks/useFormContext";
import DatePicker from "./DatePicker";
import FieldHint from "./FieldHint";

// Unified label styles
const LABEL_CLASSES = "text-xs md:text-sm mb-1 shrink-0";
// Unified input styles (border color is appended per-instance via getBorderClass)
const INPUT_CLASSES = "h-8 md:h-9 w-full bg-transparent border rounded-md py-1 px-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200";
// Unified wrapper styles
const WRAPPER_CLASSES = "flex flex-col";

// Field configurations
const FIELD_CONFIG = {
    'First Name': { type: 'text', required: true, placeholder: 'First Name' },
    'Last Name': { type: 'text', required: true, placeholder: 'Last Name' },
    'University ID': { type: 'text', required: true, placeholder: '8 digits', hasPrefix: 'U', hint: 'Must be above U18 and not older than U25.' },
    'Date of Birth': { type: 'date', required: true },
    'Email address': { type: 'email', required: true, placeholder: 'Email address' },
    'Mobile number': { type: 'tel', required: true, placeholder: '05XXXXXXXX or +971XXXXXXXXX', inputMode: 'tel', maxLength: 15 },
    'CGPA': { type: 'number', required: false, placeholder: 'CGPA', min: 0, max: 4, step: 0.01, hint: 'Include only if it is more than 3.0.' },
    'LinkedIn URL': { type: 'text', required: false, placeholder: 'linkedin.com/in/profile name' },
    'Technical Skills': { type: 'textarea', required: true, placeholder: 'Include skills such as C++, Python - no need for explanations or ratings' },
    'Experience': { type: 'textarea', required: true, placeholder: 'Start with the latest to the oldest. You may include part-time and internship opportunities' },
    'Non-technical skills': { type: 'textarea', required: true, placeholder: 'Include skills such as Attentive to details, Adaptability, Empathy' },
    'Expected to Graduate': { type: 'date', required: true, hasCheckbox: true },
    'Others, if any': { type: 'text', required: false, placeholder: 'Others, if any' },
    'Field Interest': { type: 'text', required: false, placeholder: 'e.g., Software Development, Marketing, Finance' },
    'Career Goals': { type: 'textarea', required: false, placeholder: 'Briefly describe your career goals...' },
};

const Input = ({ label, type, name, fieldClasses = '' }) => {
    const refLabel = useRef();
    const [isFocused, setIsFocused] = useState(false);
    const [touched, setTouched] = useState(false);
    const { updateFormData, setFormData, setFieldMissing, fieldMissing } = useFormContext();

    const config = FIELD_CONFIG[label] || { type: type || 'text', required: true, placeholder: label };

    // fieldMissing starts as an array (FormContext.jsx's initial useState)
    // and becomes a comma-joined string after the first updateFormData call —
    // normalize both shapes, then match this field's own label against it to
    // know if *this* field is currently flagged, without duplicating that
    // validation logic.
    const missingList = Array.isArray(fieldMissing) ? fieldMissing : (fieldMissing || "").split(", ");
    const fieldErrorMsg = missingList.find((msg) => msg && msg.startsWith(label));
    const showError = touched && config.required && Boolean(fieldErrorMsg);
    const isValid = touched && config.required && !fieldErrorMsg && Boolean(refLabel.current?.value?.toString().trim());

    const getBorderClass = () => {
        if (showError) return "border-red-400 focus:ring-red-400";
        if (isValid) return "border-primary focus:ring-primary";
        return "border-line-strong focus:ring-primary hover:border-fg-faint";
    };

    const handleBlur = () => setTouched(true);

    const capitalize = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const validate = (value) => {
        switch (label) {
            case 'First Name':
            case 'Last Name': {
                const nameValue = refLabel.current.value.replace(/[^a-zA-Z\s-]/g, '');
                refLabel.current.value = nameValue;
                break;
            }

            case 'Email address': {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    setFieldMissing('Email address');
                }
                break;
            }

            case 'Mobile number': {
                let phoneValue = refLabel.current.value;
                // Allow + at the start for country code, then only digits
                if (phoneValue.startsWith('+')) {
                    phoneValue = '+' + phoneValue.slice(1).replace(/\D/g, '').slice(0, 14);
                } else {
                    phoneValue = phoneValue.replace(/\D/g, '').slice(0, 10);
                }
                refLabel.current.value = phoneValue;
                // Validate: either 10 digits (local) or + followed by 10-14 digits (international)
                const isLocalValid = /^0\d{9}$/.test(phoneValue); // 05XXXXXXXX format
                const isIntlValid = /^\+\d{10,14}$/.test(phoneValue); // +971XXXXXXXXX format
                if (phoneValue.length > 0 && !isLocalValid && !isIntlValid) {
                    setFieldMissing('Mobile number - Must be 10 digits or country code + 9-13 digits');
                }
                break;
            }

            case 'University ID': {
                let idValue = refLabel.current.value.replace(/\D/g, '');
                idValue = idValue.slice(0, 8);
                refLabel.current.value = idValue;
                // Validate: must be 8 digits and first 2 digits >= 14 (year 2014+)
                if (idValue.length === 8) {
                    const firstTwoDigits = parseInt(idValue.substring(0, 2));
                    if (firstTwoDigits < 14 || firstTwoDigits > 26) {
                        setFieldMissing('University ID - First 2 digits must be between 14-26');
                    }
                } else if (idValue.length > 0 && idValue.length < 8) {
                    setFieldMissing('University ID - Must be exactly 8 digits');
                }
                break;
            }

            case 'CGPA': {
                let cgpaValue = parseFloat(refLabel.current.value);
                if (!isNaN(cgpaValue)) {
                    if (cgpaValue > 4) refLabel.current.value = '4.00';
                    else if (cgpaValue < 0) refLabel.current.value = '0.00';
                    if (refLabel.current.value.includes('.') && refLabel.current.value.split('.')[1]?.length > 2) {
                        refLabel.current.value = cgpaValue.toFixed(2);
                    }
                }
                break;
            }

            case 'Date of Birth': {
                const dob = new Date(value);
                const minAgeDate = new Date();
                minAgeDate.setFullYear(minAgeDate.getFullYear() - 20);
                if (dob > minAgeDate) {
                    setFieldMissing('Date of Birth - Must be at least 20 years old');
                }
                break;
            }

            case 'LinkedIn URL':
                if (value && !value.includes('linkedin.com')) {
                    setFieldMissing('LinkedIn URL');
                }
                break;

            case 'Others, if any': {
                const otherInput = document.getElementsByClassName('otherlangs-field')[0]?.lastElementChild?.value?.trim();
                if (otherInput) {
                    setFormData((prev) => ({
                        ...prev,
                        languages: Array.from(new Set([
                            ...(prev.languages.slice(0, [...prev.languages].length - 1).filter((text) => text !== 'Other') || []),
                            otherInput
                        ]))
                    }));
                }
                return;
            }

            case 'Arabic':
            case 'English':
            case 'Chinese': {
                if (value) {
                    setFormData((prev) => ({
                        ...prev,
                        languages: Array.from(new Set([
                            ...(prev.languages.slice(0, [...prev.languages].length - 1).filter((text) => text !== 'Other') || []),
                            value
                        ]))
                    }));
                }
                return;
            }

            default:
                break;
        }
    };

    const handleChange = () => {
        const value = refLabel?.current?.value?.trim();
        validate(value);

        const currentValue = refLabel.current.value.trim();

        if (label === "First Name" || label === "Last Name") {
            setFormData((prev) => {
                const first = label === "First Name" ? capitalize(currentValue) : prev.tempFirst || "";
                const last = label === "Last Name" ? capitalize(currentValue) : prev.tempLast || "";
                return {
                    ...prev,
                    tempFirst: label === "First Name" ? capitalize(currentValue) : prev.tempFirst,
                    tempLast: label === "Last Name" ? capitalize(currentValue) : prev.tempLast,
                    "Full Name": `${first} ${last}`.trim(),
                };
            });
        } else {
            updateFormData(label, currentValue);
        }
    };

    // The rest of this component (validate/handleChange) reads dates from
    // refLabel.current.value as a "YYYY-MM-DD" string, the same shape a
    // native <input type="date"> produces — write through a hidden input so
    // that data flow doesn't need to change for the DatePicker.
    const [selectedDate, setSelectedDate] = useState(null);
    const toIso = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };
    const handleDateSelect = (date) => {
        if (!date) return;
        setSelectedDate(date);
        if (refLabel.current) refLabel.current.value = toIso(date);
        handleChange();
    };

    // Render label
    const renderLabel = () => (
        <h2 className={LABEL_CLASSES}>
            {label}:{config.required && <RequiredAstrik required={true} />}
            {config.hint && <FieldHint text={config.hint} />}
        </h2>
    );

    const renderError = () => (
        showError && (
            <p className="text-xs text-red-500 mt-0.5 ml-1">{fieldErrorMsg}</p>
        )
    );

    // Textarea fields
    if (config.type === 'textarea') {
        return (
            <div className={`${WRAPPER_CLASSES} h-full ${fieldClasses}`}>
                {renderLabel()}
                <textarea
                    ref={refLabel}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name={name || label}
                    placeholder={config.placeholder}
                    className={`flex-1 w-full bg-transparent border rounded-md py-1.5 px-2 text-sm resize-none min-h-0 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${getBorderClass()}`}
                />
                {renderError()}
            </div>
        );
    }

    // Expected to Graduate (special case with checkbox — only enabled once the
    // "current student" box is checked)
    if (label === 'Expected to Graduate') {
        return (
            <div className={`${WRAPPER_CLASSES} ${fieldClasses}`}>
                {renderLabel()}
                <input ref={refLabel} type="hidden" name={name || label} />
                <DatePicker
                    value={selectedDate}
                    onSelect={handleDateSelect}
                    onBlur={handleBlur}
                    disabled={!isFocused}
                    disabledMessage='Check "Are you a current student?" below to set your expected graduation date.'
                    triggerClassName={!isFocused ? 'border-line text-fg-faint bg-surface-hover' : getBorderClass()}
                />
                <div className="flex items-center gap-x-2 mt-2">
                    <input
                        type="checkbox"
                        onChange={(e) => setIsFocused(e.target.checked)}
                        id="currentStudent"
                        className="w-4 h-4"
                    />
                    <label htmlFor="currentStudent" className="text-sm">Are you a current student?</label>
                </div>
            </div>
        );
    }

    // Date of Birth (special max date — applicants must be at least 20)
    if (label === 'Date of Birth') {
        // Computed as a local Date directly to avoid the classic
        // `new Date("YYYY-MM-DD")` UTC-midnight parsing shifting by a day.
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() - 20);
        return (
            <div className={`${WRAPPER_CLASSES} ${fieldClasses}`}>
                {renderLabel()}
                <input ref={refLabel} type="hidden" name={name || label} />
                <DatePicker
                    value={selectedDate}
                    onSelect={handleDateSelect}
                    onBlur={handleBlur}
                    maxDate={maxDate}
                    triggerClassName={getBorderClass()}
                />
                {renderError()}
            </div>
        );
    }

    // Standard input fields
    const inputProps = {
        ref: refLabel,
        onChange: handleChange,
        onBlur: handleBlur,
        type: config.type,
        name: name || label,
        placeholder: config.placeholder,
        className: config.hasPrefix
            ? "h-8 md:h-9 w-full bg-transparent border-0 outline-none py-1 px-1 text-xs md:text-sm"
            : `${INPUT_CLASSES} ${getBorderClass()}`,
    };

    // Add optional attributes
    if (config.inputMode) inputProps.inputMode = config.inputMode;
    if (config.pattern) inputProps.pattern = config.pattern;
    if (config.maxLength) inputProps.maxLength = config.maxLength;
    if (config.min !== undefined) inputProps.min = config.min;
    if (config.max !== undefined) inputProps.max = config.max;
    if (config.step) inputProps.step = config.step;

    // Input with prefix (like University ID with "U")
    if (config.hasPrefix) {
        return (
            <div className={`${WRAPPER_CLASSES} ${fieldClasses}`}>
                {renderLabel()}
                <div className={`flex items-center h-8 md:h-9 w-full bg-transparent border rounded-md focus-within:ring-2 focus-within:border-transparent transition-all duration-200 ${getBorderClass()}`}>
                    <span className="px-2 text-xs md:text-sm font-medium text-fg-muted bg-surface-hover h-full flex items-center border-r border-line-strong rounded-l-md">
                        {config.hasPrefix}
                    </span>
                    <input {...inputProps} />
                </div>
                {renderError()}
            </div>
        );
    }

    return (
        <div className={`${WRAPPER_CLASSES} ${fieldClasses}`}>
            {renderLabel()}
            <input {...inputProps} />
            {renderError()}
        </div>
    );
};

Input.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    name: PropTypes.string,
    fieldClasses: PropTypes.string,
};

export default Input;
