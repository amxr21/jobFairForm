// Single source of truth for what a valid UAE mobile number looks like.
//
// Previously this regex pair (local + international) was copy-pasted three
// times — once in Input.jsx's live-typing validator, twice more in
// FormContext.jsx's two near-identical missing-fields passes — and drifted:
// fixing "accept 971XXXXXXXXX without a +" in one copy and not the other two
// is exactly how a phone number typed one way validates and the same number
// typed another way doesn't. One function, imported everywhere a phone gets
// checked.
//
// Three accepted shapes:
//   local:                05XXXXXXXX     (leading 0, 10 digits total)
//   international, "+":   +971XXXXXXXXX  (9-14 digits after the +)
//   international, no "+": 971XXXXXXXXX  (971 followed by 9 digits)
export function isValidUaePhone(value) {
    const phone = String(value ?? "").trim();
    if (!phone) return false;
    const isLocal = /^0\d{9}$/.test(phone);
    const isIntlPlus = /^\+\d{9,14}$/.test(phone);
    const isIntlNoPlus = /^971\d{9}$/.test(phone);
    return isLocal || isIntlPlus || isIntlNoPlus;
}
