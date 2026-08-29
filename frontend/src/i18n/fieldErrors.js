// Recognizes which VALIDATION REASON produced a stored fieldMissing string,
// so useFieldState.jsx can show a translated message while the stored string
// itself (matched via `msg.startsWith(label)`) stays exactly as three
// different call sites (Input.jsx, FormContext.jsx, Form.jsx's step gate)
// have always written it.
//
// Three places build these strings, historically with slightly different
// wording for the same reason (e.g. Input.jsx's short mobile-format message
// vs FormContext's long one) — rather than translate each literal sentence
// as its own string (and have EN and AR silently drift whenever someone
// tweaks one call site's wording but not the other two), every shape is
// normalized down to one of a handful of REASONS here, and messages.js
// translates the reason, not the sentence.
//
// Order matters: patterns are checked most-specific first, since e.g. every
// "must be exactly 8 digits" message is also just "not empty" if checked in
// the wrong order.
const REASON_PATTERNS = [
    { reason: "universityIdYear", test: (rest) => /first 2 digits must be between 14.?26/i.test(rest) },
    { reason: "universityIdLength", test: (rest) => /must be exactly 8 digits/i.test(rest) },
    { reason: "mobileFormat", test: (rest) => /must be 10 digits/i.test(rest) },
    { reason: "birthdateAge", test: (rest) => /at least 20 years old/i.test(rest) },
    { reason: "invalidEmail", test: (rest) => /not a valid email/i.test(rest) },
    { reason: "required", test: (rest) => /^\s*(is required)?\s*$/i.test(rest) || /^\s*-?\s*$/.test(rest) },
];

/**
 * @param {string} storedMessage - the raw fieldMissing entry, e.g.
 *   "Mobile number - Must be 10 digits (05XXXXXXXX) or country code format (+971XXXXXXXXX)"
 * @param {string} label - the field's canonical English name, e.g. "Mobile number"
 * @returns {string|null} the reason code (a key under messages.*.fieldValidation), or null if unrecognized
 */
export function classifyFieldError(storedMessage, label) {
    if (!storedMessage || !storedMessage.startsWith(label)) return null;
    const rest = storedMessage.slice(label.length);
    for (const { reason, test } of REASON_PATTERNS) {
        if (test(rest)) return reason;
    }
    return null;
}
