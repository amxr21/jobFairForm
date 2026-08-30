import PropTypes from "prop-types";
import { useRef, useState, useEffect } from "react";
import {
    User,
    Hash,
    Cake,
    Mail,
    Phone,
    Link2,
    Gauge,
    Code2,
    HeartHandshake,
    Briefcase,
    Sparkles,
} from "lucide-react";
import useFormContext from "../../hooks/useFormContext";
import useFieldState from "../../hooks/useFieldState";
import DatePicker from "./DatePicker";
import FieldShell from "./FieldShell";
import useScrollIntoViewOnFocus from "../../hooks/useScrollIntoViewOnFocus";
import useLocaleContext from "../../hooks/useLocaleContext";
import useTranslation from "../../hooks/useTranslation";
import {
    INPUT_CLASSES,
    TEXTAREA_CLASSES,
    FIELD_HEIGHT,
    FIELD_TEXT,
} from "./fieldStyles";

// Live-formats a UAE mobile number as the user types, for the two shapes
// this field accepts:
//   local:         05XXXXXXXX        -> 05X XXX XXXX
//   international: +971XXXXXXXXX     -> +971 XX XXX XXXX
// Takes the already-digit-stripped value (with an optional leading "+")
// that the caller has produced, and returns display text with spaces
// inserted at fixed positions — never touches which characters are valid,
// only where the breaks land. The stored/submitted value stays the plain
// digit string; only what's shown in the box gains formatting (see
// stripPhoneFormatting below, used before updateFormData).
const formatPhoneDisplay = (digits) => {
    if (digits.startsWith('+')) {
        // +971 50 123 4567 — country code, then 2, then 3, then 4.
        const d = digits.slice(1);
        const parts = [d.slice(0, 3), d.slice(3, 5), d.slice(5, 8), d.slice(8, 12)].filter(Boolean);
        return '+' + parts.join(' ');
    }
    // 050 123 4567 — leading zero + 2, then 3, then 4.
    const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)].filter(Boolean);
    return parts.join(' ');
};

// The inverse: what actually gets written to formData and submitted. Spaces
// are purely a typing aid; the backend and every downstream consumer
// (search, tel: links, deduplication) should see the plain digits.
const stripPhoneFormatting = (display) => display.replace(/\s+/g, '');

// Field configurations
// `placeholder` stays the literal English fallback (also what non-Arabic
// locales render); `placeholderKey` is the i18n/messages.js
// inputPlaceholders.* key this component resolves through t() when
// locale === "ar". FIELD_CONFIG is a module-level const and can't call the
// t() hook itself, so the actual translation happens in the component body.
const FIELD_CONFIG = {
    // dirAuto (not forceLtr): a name can genuinely be typed in either
    // script, unlike University ID or a URL. dir="auto" reads the first
    // strong character so an Arabic name renders right-to-left and a Latin
    // one left-to-right, rather than a fixed direction fighting whichever
    // script the applicant actually uses.
    'First Name': { type: 'text', required: true, placeholder: 'First Name', placeholderKey: 'firstName', autoComplete: 'given-name', icon: User, dirAuto: true },
    'Last Name': { type: 'text', required: true, placeholder: 'Last Name', placeholderKey: 'lastName', autoComplete: 'family-name', icon: User, dirAuto: true },
    'University ID': { type: 'text', required: true, placeholder: '8 digits', placeholderKey: 'universityId', hasPrefix: 'U', inputMode: 'numeric', autoComplete: 'off', hint: 'The first two digits are your enrolment year (e.g. U21XXXXXX for 2021).', hintKey: 'universityId', forceLtr: true, icon: Hash },
    'Date of Birth': { type: 'date', required: true, hint: 'You must be at least 20 years old to apply.', hintKey: 'dateOfBirth', icon: Cake },
    'Email address': { type: 'email', required: true, placeholder: 'Email address', placeholderKey: 'email', inputMode: 'email', autoComplete: 'email', icon: Mail },
    // maxLength raised from the underlying 10/13-digit cap to fit the spaces
    // formatPhoneDisplay() inserts — "+971 50 123 4567" is 16 characters,
    // longer than the 15 raw digits it represents.
    'Mobile number': { type: 'tel', required: true, placeholder: '05XXXXXXXX or +971XXXXXXXXX', placeholderKey: 'mobile', inputMode: 'tel', autoComplete: 'tel', maxLength: 19, icon: Phone },
    'CGPA': { type: 'text', required: false, placeholder: 'CGPA', placeholderKey: 'cgpa', inputMode: 'decimal', autoComplete: 'off', hint: 'Include only if it is more than 3.0.', hintKey: 'cgpa', forceLtr: true, icon: Gauge },
    'LinkedIn URL': { type: 'text', required: false, placeholder: 'linkedin.com/in/profile name', placeholderKey: 'linkedin', inputMode: 'url', autoComplete: 'url', forceLtr: true, icon: Link2 },
    'Technical Skills': { type: 'textarea', required: true, placeholder: 'Include skills such as C++, Python - no need for explanations or ratings', placeholderKey: 'technicalSkills', icon: Code2 },
    'Experience': { type: 'textarea', required: true, placeholder: 'Start with the latest to the oldest. You may include part-time and internship opportunities', placeholderKey: 'experience', icon: Briefcase },
    'Non-technical skills': { type: 'textarea', required: true, placeholder: 'Include skills such as Attentive to details, Adaptability, Empathy', placeholderKey: 'nonTechnicalSkills', icon: HeartHandshake },
    'Expected to Graduate': { type: 'date', required: true, hasCheckbox: true, icon: Cake },
    'Others, if any': { type: 'text', required: false, placeholder: 'Others, if any', placeholderKey: 'othersIfAny' },
    'Field Interest': { type: 'text', required: false, placeholder: 'e.g., Software Development, Marketing, Finance', placeholderKey: 'fieldInterest', icon: Sparkles },
    'Career Goals': { type: 'textarea', required: false, placeholder: 'Briefly describe your career goals...', placeholderKey: 'careerGoals', icon: Sparkles },
};

const Input = ({ label, type, name, fieldClasses = '' }) => {
    const refLabel = useRef();
    // Doubles as the "Are you a current student?" checkbox state for the
    // Expected to Graduate field. Seeded from context so returning to step 2
    // doesn't re-disable a picker the user already filled in — the date would
    // still be in formData while its control showed as locked.
    const { formData, updateFormData, setFormData, setFieldMissing } = useFormContext();
    const [isFocused, setIsFocused] = useState(
        () => label === "Expected to Graduate" && Boolean(formData[label])
    );
    const handleFocus = useScrollIntoViewOnFocus();
    const { locale } = useLocaleContext();
    const t = useTranslation();

    const config = FIELD_CONFIG[label] || { type: type || 'text', required: true, placeholder: label };
    // University ID / Mobile number / LinkedIn URL's inputPlaceholders.*
    // entries are deliberately left as the same English format example in
    // BOTH locales (see the comment on inputPlaceholders in messages.js) —
    // still routed through t() like every other field, just resolving to
    // unchanged text, since the box itself stays LTR regardless of locale
    // and the placeholder is a literal shape to copy, not prose to read.
    const resolvedPlaceholder =
        locale === "ar" && config.placeholderKey
            ? t(`inputPlaceholders.${config.placeholderKey}`)
            : config.placeholder;
    // The (i) tooltip beside the label (FieldHint) — this was the one piece
    // of Input.jsx that never got a translation path at all, unlike the
    // placeholder above: "You must be at least 20 years old to apply" stayed
    // English regardless of locale.
    const resolvedHint =
        locale === "ar" && config.hintKey
            ? t(`inputHints.${config.hintKey}`)
            : config.hint;

    // Restore the value from context when the field mounts.
    //
    // Form.jsx renders exactly one step at a time, so navigating Back or
    // Continue UNMOUNTS the step and mounts it fresh. This input is
    // uncontrolled — it holds its value in the DOM node via refLabel, not in
    // React — so that remount produced an empty box even though formData had
    // kept the value all along. Everything the user typed appeared to be lost
    // the moment they stepped away and came back, and a submit then failed
    // validation on fields they had definitely filled in.
    //
    // The write goes straight to the DOM node rather than through a `value`
    // prop because the rest of this component (validate/handleChange) reads
    // and rewrites refLabel.current.value directly; making it controlled would
    // mean rewriting all of that.
    //
    // "Full Name" is stored joined, so first/last are restored from the
    // tempFirst/tempLast halves that handleChange maintains.
    const storedValue =
        label === "First Name" ? formData.tempFirst
        : label === "Last Name" ? formData.tempLast
        : formData[label];

    useEffect(() => {
        if (!refLabel.current) return;
        // CGPA defaults to 0 in the initial context, which would otherwise
        // render a literal "0" in an untouched optional field.
        if (storedValue === undefined || storedValue === null || storedValue === "" || storedValue === 0) return;
        // Only populate an empty input: never fight the user mid-typing.
        if (refLabel.current.value) return;
        // Mobile number is stored as plain digits; redisplay it formatted so
        // navigating back to a filled step doesn't show the unformatted
        // string until the user edits it.
        refLabel.current.value =
            label === "Mobile number" ? formatPhoneDisplay(String(storedValue)) : storedValue;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // The error/validity/border derivation used to be duplicated verbatim
    // between this file and SelectInput.jsx; it now lives in useFieldState so
    // a fix to one is a fix to both.
    const {
        markTouched,
        errorMessage,
        showError,
        borderClass,
        errorId,
    } = useFieldState({
        label,
        required: config.required,
        hasValue: refLabel.current?.value?.toString().trim(),
    });

    const handleBlur = markTouched;

    // Every control gets a real id so FieldShell's <label htmlFor> binds to it.
    const fieldId = name || label;

    const capitalize = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const validate = (value) => {
        switch (label) {
            case 'First Name':
            case 'Last Name': {
                // ؀-ۿ is the core Arabic Unicode block (letters,
                // combining marks, Arabic-Indic digits). This previously
                // only allowed a-zA-Z, so a name typed in Arabic script was
                // stripped character-by-character as it was typed — not
                // rejected with an error, silently deleted. A UAE university
                // applicant is at least as likely to write their name in
                // Arabic as in Latin script.
                const nameValue = refLabel.current.value.replace(/[^a-zA-Z؀-ۿ\s-]/g, '');
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
                const el = refLabel.current;
                // Count digits before the caret in the OLD (already-formatted)
                // value, so the caret can be restored to the same logical
                // position after reformatting rather than jumping to the end
                // on every keystroke — the usual failure mode of a live mask.
                const caretPos = el.selectionStart ?? el.value.length;
                const digitsBeforeCaret = stripPhoneFormatting(el.value.slice(0, caretPos)).length;

                let digits = el.value;
                // Allow + at the start for country code, then only digits
                if (digits.startsWith('+')) {
                    digits = '+' + digits.slice(1).replace(/\D/g, '').slice(0, 12);
                } else {
                    digits = digits.replace(/\D/g, '').slice(0, 10);
                }

                const formatted = formatPhoneDisplay(digits);
                el.value = formatted;

                // Walk forward through the new string until the same count of
                // digits has been passed, landing the caret right after the
                // digit the user just typed rather than after any space that
                // happens to follow it.
                let seen = 0, newCaret = formatted.length;
                for (let i = 0; i < formatted.length; i++) {
                    if (/\d/.test(formatted[i])) seen++;
                    if (seen === digitsBeforeCaret) { newCaret = i + 1; break; }
                }
                if (digitsBeforeCaret === 0) newCaret = digits.startsWith('+') ? 1 : 0;
                el.setSelectionRange(newCaret, newCaret);

                // Validate against the plain digits, not the display string
                // with spaces in it.
                const isLocalValid = /^0\d{9}$/.test(digits); // 05XXXXXXXX format
                const isIntlValid = /^\+\d{10,14}$/.test(digits); // +971XXXXXXXXX format
                if (digits.length > 0 && !isLocalValid && !isIntlValid) {
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
                // This field is type="text" (so iOS offers a decimal keypad and
                // a stray scroll can't nudge the value), which means the browser
                // no longer rejects letters for us — strip anything that isn't a
                // digit or a single leading decimal point before parsing.
                let raw = refLabel.current.value.replace(/[^\d.]/g, '');
                const firstDot = raw.indexOf('.');
                if (firstDot !== -1) {
                    raw = raw.slice(0, firstDot + 1) + raw.slice(firstDot + 1).replace(/\./g, '');
                }
                refLabel.current.value = raw;

                let cgpaValue = parseFloat(raw);
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
        } else if (label === "Mobile number") {
            // The DOM shows "050 123 4567" for typing comfort; formData and
            // the backend get the plain digits, same as before this field had
            // visual formatting at all.
            updateFormData(label, stripPhoneFormatting(currentValue));
        } else {
            updateFormData(label, currentValue);
        }
    };

    // The rest of this component (validate/handleChange) reads dates from
    // refLabel.current.value as a "YYYY-MM-DD" string, the same shape a
    // native <input type="date"> produces — write through a hidden input so
    // that data flow doesn't need to change for the DatePicker.
    // Seeded from context rather than null, for the same remount reason as the
    // text inputs above — but worse here: this is React state, so a step
    // change discarded the chosen date outright and the picker reopened
    // showing "Select a date".
    //
    // Parsed as local components rather than `new Date("YYYY-MM-DD")`, which
    // JS parses as UTC midnight and can render as the previous day west of
    // Greenwich.
    const [selectedDate, setSelectedDate] = useState(() => {
        const stored = formData[label];
        if (!stored || typeof stored !== "string") return null;
        const [y, m, d] = stored.split("-").map(Number);
        if (!y || !m || !d) return null;
        return new Date(y, m - 1, d);
    });
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

    // Common props shared by FieldShell across every branch below.
    const shellProps = {
        label,
        htmlFor: fieldId,
        required: config.required,
        hint: resolvedHint,
        error: showError ? errorMessage : undefined,
        errorId,
        icon: config.icon,
    };

    // Textarea fields
    if (config.type === 'textarea') {
        return (
            <FieldShell {...shellProps} className={`h-full ${fieldClasses}`}>
                {/* dir="auto": these are free text (skills, experience,
                    career goals) that could genuinely be written in either
                    script — same reasoning as First/Last Name. This branch
                    never received a dir attribute at all before, unlike the
                    standard <input> branch below. */}
                <textarea
                    ref={refLabel}
                    id={fieldId}
                    dir="auto"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    name={name || label}
                    placeholder={resolvedPlaceholder}
                    aria-invalid={showError || undefined}
                    aria-describedby={errorId}
                    className={`flex-1 ${TEXTAREA_CLASSES} ${borderClass}`}
                />
            </FieldShell>
        );
    }

    // Expected to Graduate (special case with checkbox — only enabled once the
    // "current student" box is checked)
    if (label === 'Expected to Graduate') {
        return (
            <FieldShell {...shellProps} className={fieldClasses}>
                <input ref={refLabel} type="hidden" name={name || label} />
                <DatePicker
                    id={fieldId}
                    value={selectedDate}
                    onSelect={handleDateSelect}
                    onBlur={handleBlur}
                    disabled={!isFocused}
                    // No disabledMessage passed: DatePicker's own
                    // datePicker.setGraduationDateHint translated default is
                    // this exact copy, and letting it fall through to that
                    // default means this string translates instead of always
                    // showing English regardless of locale.
                    triggerClassName={!isFocused ? 'border-line text-fg-faint bg-surface-hover' : borderClass}
                    ariaInvalid={showError}
                    ariaDescribedBy={errorId}
                />
                <div className="flex items-center gap-x-2 mt-2">
                    <input
                        type="checkbox"
                        checked={isFocused}
                        onChange={(e) => setIsFocused(e.target.checked)}
                        id="currentStudent"
                        className="w-5 h-5 md:w-4 md:h-4 accent-[#0E7F41]"
                    />
                    <label htmlFor="currentStudent" className="text-sm cursor-pointer">{t("fields.currentStudent")}</label>
                </div>
            </FieldShell>
        );
    }

    // Date of Birth (special max date — applicants must be at least 20)
    if (label === 'Date of Birth') {
        // Computed as a local Date directly to avoid the classic
        // `new Date("YYYY-MM-DD")` UTC-midnight parsing shifting by a day.
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() - 20);
        return (
            <FieldShell {...shellProps} className={fieldClasses}>
                <input ref={refLabel} type="hidden" name={name || label} />
                <DatePicker
                    id={fieldId}
                    value={selectedDate}
                    onSelect={handleDateSelect}
                    onBlur={handleBlur}
                    maxDate={maxDate}
                    triggerClassName={borderClass}
                    ariaInvalid={showError}
                    ariaDescribedBy={errorId}
                />
            </FieldShell>
        );
    }

    // Standard input fields
    const inputProps = {
        ref: refLabel,
        id: fieldId,
        onChange: handleChange,
        onBlur: handleBlur,
        onFocus: handleFocus,
        type: config.type,
        name: name || label,
        placeholder: resolvedPlaceholder,
        "aria-invalid": showError || undefined,
        "aria-describedby": errorId,
        className: config.hasPrefix
            ? `${FIELD_HEIGHT} w-full bg-transparent border-0 outline-none py-1 px-1 ${FIELD_TEXT}`
            : `${INPUT_CLASSES} ${borderClass}`,
    };

    // Latin-only / numeric content is always LTR regardless of UI direction
    // — "+971 50 123 4567", "name@example.com", "linkedin.com/in/x",
    // "U21012345", "3.75" — force it explicitly so none of these visually
    // reorder when the form is in Arabic/RTL. Driven by an explicit
    // forceLtr flag on FIELD_CONFIG rather than switching on `type`, since
    // University ID and CGPA are both type: 'text' but still need this.
    if (config.type === 'email' || config.type === 'tel' || config.forceLtr) {
        inputProps.dir = 'ltr';
    } else if (config.dirAuto) {
        // First/Last Name: content could be either script, so read the
        // first strong character rather than force a direction that fights
        // whichever one the applicant actually types.
        inputProps.dir = 'auto';
    }

    // Add optional attributes
    if (config.inputMode) inputProps.inputMode = config.inputMode;
    if (config.autoComplete) inputProps.autoComplete = config.autoComplete;
    if (config.pattern) inputProps.pattern = config.pattern;
    if (config.maxLength) inputProps.maxLength = config.maxLength;
    if (config.min !== undefined) inputProps.min = config.min;
    if (config.max !== undefined) inputProps.max = config.max;
    if (config.step) inputProps.step = config.step;

    // Input with prefix (like University ID with "U")
    if (config.hasPrefix) {
        return (
            <FieldShell {...shellProps} className={fieldClasses}>
                <div className={`flex items-center ${FIELD_HEIGHT} w-full bg-white dark:bg-[#1a2438] overflow-hidden border rounded-md focus-within:ring-2 focus-within:border-transparent transition-all duration-200 ${borderClass}`}>
                    {/* aria-hidden: the "U" is decoration on the field, and
                        the label already names it. Announcing "U" before the
                        value would just be noise. */}
                    <span
                        aria-hidden="true"
                        className={`px-2 ${FIELD_TEXT} font-medium text-fg-muted bg-surface-hover h-full flex items-center border-e border-line-strong rounded-s-md`}
                    >
                        {config.hasPrefix}
                    </span>
                    <input {...inputProps} />
                </div>
            </FieldShell>
        );
    }

    return (
        <FieldShell {...shellProps} className={fieldClasses}>
            <input {...inputProps} />
        </FieldShell>
    );
};

Input.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    name: PropTypes.string,
    fieldClasses: PropTypes.string,
};

export default Input;
