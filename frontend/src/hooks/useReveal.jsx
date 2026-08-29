import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { DURATION, DISTANCE, EASE, STAGGER } from "../lib/motionTokens";

// Staggered entrance for a group of elements.
//
// Deliberately `gsap.from`, not `gsap.to`. With `from`, the resting DOM state
// IS the final state — so if GSAP fails to load, errors, or the effect never
// runs, the content is simply there. A `to` tween starting at opacity 0 leaves
// that same failure permanently invisible. Fail visible, never fail blank.
//
// Usage:
//   const scope = useReveal("[data-reveal]", [currentStep]);
//   <div ref={scope}> ... <Field data-reveal /> ... </div>
//
// `deps` re-runs the reveal — pass the step index so each step animates in as
// the user arrives at it.

export default function useReveal(selector = "[data-reveal]", deps = []) {
    const scope = useRef(null);

    useGSAP(
        () => {
            const targets = gsap.utils.toArray(selector);
            if (!targets.length) return;

            const reduced = prefersReducedMotion();

            gsap.from(targets, {
                // Reduced motion keeps the fade but drops the movement: a
                // zero-duration appearance is harder to follow, not easier.
                y: reduced ? 0 : DISTANCE.sm,
                opacity: 0,
                duration: reduced ? DURATION.fast : DURATION.base,
                ease: EASE.out,
                // `amount` caps the TOTAL stagger, so a 4-field row and a
                // 20-field step both finish in the same time. Per-item stagger
                // would make long steps crawl.
                stagger: { amount: reduced ? 0 : STAGGER.base },
                // Leaves no inline transform behind, so hover/focus transforms
                // on the same element aren't fighting a leftover matrix.
                clearProps: "transform",
            });
        },
        { scope, dependencies: deps }
    );

    return scope;
}
