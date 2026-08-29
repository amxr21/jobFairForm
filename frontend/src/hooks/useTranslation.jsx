import { useCallback } from "react";
import useLocaleContext from "./useLocaleContext";
import { messages } from "../i18n/messages";

// t("fields.firstName") -> looks up messages[locale].fields.firstName.
//
// Falls back to English whenever the current-locale value is missing OR an
// empty string — which is the whole point of shipping with ar.json mostly
// empty. A translator filling in strings over time never has to worry about
// a half-finished file producing a blank UI; every gap silently shows
// English until it's filled in.
//
// Supports {placeholder} interpolation: t("steps.stepOf", { current: 1, total: 3 }).

const getPath = (obj, path) =>
    path.split(".").reduce((acc, key) => (acc && typeof acc === "object" ? acc[key] : undefined), obj);

const interpolate = (str, vars) => {
    if (!vars) return str;
    return str.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));
};

export default function useTranslation() {
    const { locale } = useLocaleContext();

    const t = useCallback(
        (path, vars) => {
            const localized = getPath(messages[locale], path);
            const fallback = getPath(messages.en, path);
            const value = (typeof localized === "string" && localized) || fallback;

            if (value === undefined) {
                // Missing from EN too — a real bug (typo'd key), not a
                // translation gap. Surface it in dev rather than rendering
                // "undefined" in the UI.
                if (import.meta.env.DEV) {
                    console.warn(`useTranslation: no message at "${path}"`);
                }
                return path;
            }

            return interpolate(value, vars);
        },
        [locale]
    );

    return t;
}
