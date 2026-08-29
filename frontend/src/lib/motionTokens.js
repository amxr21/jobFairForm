// One motion vocabulary for the whole app.
//
// These mirror the CSS custom properties already in style.css (--ease-out /
// --ease-in) so a GSAP tween and a CSS transition on the same element agree
// rather than each having their own feel. Change a value here and the whole
// app moves with it — no inline `duration: 0.37` anywhere.

// Easings. Enters decelerate into place; exits accelerate away. Mirrored
// curves rather than a flat ease-in-out, which reads as sluggish in both
// directions.
export const EASE = {
    // cubic-bezier(0.16, 1, 0.3, 1) — matches --ease-out in style.css
    out: "power4.out",
    // cubic-bezier(0.7, 0, 0.84, 0) — matches --ease-in
    in: "power4.in",
    inOut: "power2.inOut",
    // A restrained overshoot. Used only for the success moment; anything the
    // user sees repeatedly should not bounce.
    back: "back.out(1.6)",
};

// Durations in seconds (GSAP's unit). Frequent actions are fast — a press or
// a hover that takes 400ms feels broken. Big one-off transitions can afford
// more.
export const DURATION = {
    /** Press/hover feedback. Must feel instant. */
    instant: 0.12,
    /** Field focus, chip add/remove, icon swaps. */
    fast: 0.2,
    /** Panel opens, toasts, the default for most UI. */
    base: 0.28,
    /** Step changes, larger reveals. */
    slow: 0.45,
    /** The success sequence only. */
    celebrate: 0.7,
};

// Movement distances in px. Small — motion should guide the eye, not throw
// things across the screen.
export const DISTANCE = {
    sm: 8,
    md: 16,
    lg: 24,
};

// Stagger is expressed as a TOTAL, never per-item: `stagger: 0.05` on 40
// fields is two seconds before the last one appears. `{ amount: TOTAL }`
// makes a 4-field row and a 40-field step finish in the same time.
export const STAGGER = {
    tight: 0.18,
    base: 0.3,
    loose: 0.45,
};
