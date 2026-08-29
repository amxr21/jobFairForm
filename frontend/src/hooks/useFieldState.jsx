import { useState } from "react";
import useFormContext from "./useFormContext";

// The error/validity/border logic that Input.jsx and SelectInput.jsx each had
// their own verbatim copy of. Both read the same `fieldMissing` channel and
// derived the same four values from it; keeping two copies meant a fix to one
// (the array-vs-string normalisation, for instance) had to be remembered in
// the other.
//
// `fieldMissing` starts as an array (FormContext's initial useState) and
// becomes a comma-joined string after the first updateFormData call, so both
// shapes are normalised before this field's label is matched against it.

export default function useFieldState({ label, required = true, hasValue }) {
    const [touched, setTouched] = useState(false);
    const { fieldMissing } = useFormContext();

    const missingList = Array.isArray(fieldMissing)
        ? fieldMissing
        : (fieldMissing || "").split(", ");

    const errorMessage = missingList.find((msg) => msg && msg.startsWith(label));

    // Errors only surface once the user has left the field, so a pristine form
    // isn't a wall of red. Form.jsx's step gate pushes into the same channel
    // and scrolls to the first offender for the untouched case.
    const showError = touched && required && Boolean(errorMessage);
    const isValid = touched && required && !errorMessage && Boolean(hasValue);

    const borderClass = showError
        ? "border-red-400 focus:ring-red-400"
        : isValid
            ? "border-primary focus:ring-primary"
            : "border-line-strong focus:ring-primary hover:border-fg-faint";

    return {
        touched,
        setTouched,
        markTouched: () => setTouched(true),
        errorMessage,
        showError,
        isValid,
        borderClass,
        // Wired to aria-invalid / aria-describedby by the callers so assistive
        // tech is told about the error, not just sighted users.
        errorId: showError ? `${label}-error` : undefined,
    };
}
