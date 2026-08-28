import { useCallback } from "react";

// Even with the form on dvh, focusing a field in the lower part of a step can
// leave it sitting behind the on-screen keyboard: the keyboard animates in
// after the focus event, so the field is only occluded a moment later. This
// returns an onFocus handler that scrolls the field back into the visible
// area once that animation has settled.
//
// `block: "nearest"` keeps the scroll minimal — it does nothing when the
// field is already comfortably visible, rather than yanking it to the centre
// on every tap.

const isTouch = () =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function useScrollIntoViewOnFocus() {
    return useCallback((event) => {
        if (!isTouch()) return;
        const el = event?.currentTarget;
        if (!el || typeof el.scrollIntoView !== "function") return;

        // Wait out the keyboard animation before measuring; scrolling
        // immediately just scrolls against the pre-keyboard layout.
        window.setTimeout(() => {
            if (!document.contains(el)) return;
            el.scrollIntoView({
                block: "nearest",
                behavior: prefersReducedMotion() ? "auto" : "smooth",
            });
        }, 300);
    }, []);
}
