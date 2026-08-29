// Central GSAP setup. Import gsap and useGSAP FROM HERE, never directly from
// the packages, so registration happens exactly once and every consumer gets
// the same configured instance.

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// Defaults so individual tweens don't restate the same values. Anything
// omitted at the call site inherits these.
gsap.defaults({
    ease: "power4.out",
    duration: 0.28,
});

// Reduced motion.
//
// The tempting implementation is `gsap.globalTimeline.timeScale(0)`, and it is
// an accessibility BUG: it freezes tweens where they are, so an element
// animating from opacity 0 freezes AT 0 — invisible, permanently. The users
// who most need reduced motion would get a page with missing content.
//
// A very high timeScale instead means every tween completes within a frame
// and lands on its final values, so the UI is fully present and simply does
// not move. Individual animations still check prefersReducedMotion() to keep
// a short opacity fade, because an instant pop is harder to follow than a
// brief one — "reduced" means less movement, not zero transition.
const REDUCED_TIMESCALE = 200;

const reducedMotionQuery = () =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;

export const prefersReducedMotion = () => Boolean(reducedMotionQuery()?.matches);

const applyReducedMotion = (reduced) => {
    gsap.globalTimeline.timeScale(reduced ? REDUCED_TIMESCALE : 1);
};

const mq = reducedMotionQuery();
if (mq) {
    applyReducedMotion(mq.matches);
    // Safari < 14 has no addEventListener on MediaQueryList.
    if (typeof mq.addEventListener === "function") {
        mq.addEventListener("change", (e) => applyReducedMotion(e.matches));
    } else if (typeof mq.addListener === "function") {
        mq.addListener((e) => applyReducedMotion(e.matches));
    }
}

export { gsap, useGSAP };
