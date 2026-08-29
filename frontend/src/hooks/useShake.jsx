import { useRef, useEffect } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { DURATION } from "../lib/motionTokens";

// A short horizontal shake, for the moment a field is rejected.
//
// This is the one animation in a form that carries real information: it says
// "this specific field, right now" in a way a colour change alone does not,
// and it draws the eye to the offender when the user has just pressed
// Continue and something failed.
//
// Under reduced motion it does nothing at all rather than substituting a
// fade — repeated shaking is exactly the vestibular trigger that setting
// exists for, and the inline error text plus the red border already carry the
// message. Motion here is an enhancement, not the channel.
//
// Usage:
//   const ref = useShake(showError);
//   <input ref={ref} ... />

export default function useShake(active) {
    const ref = useRef(null);
    // Only fire on a false -> true edge, so re-renders while the error is
    // still showing don't re-shake the field on every keystroke.
    const wasActive = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (active && !wasActive.current && !prefersReducedMotion()) {
            gsap.fromTo(
                el,
                { x: -5 },
                {
                    x: 0,
                    duration: DURATION.base,
                    // A damped oscillation reads as "rejected" — a single
                    // slide reads as the field simply moving.
                    ease: "elastic.out(1, 0.35)",
                    clearProps: "transform",
                }
            );
        }

        wasActive.current = active;
    }, [active]);

    return ref;
}
