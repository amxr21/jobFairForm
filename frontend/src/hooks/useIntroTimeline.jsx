import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { DURATION, DISTANCE, EASE } from "../lib/motionTokens";

// The landing page's entrance.
//
// This is the first thing anyone sees, and it previously appeared all at once
// — logos, heading, illustration and buttons snapping in together the moment
// React mounted. Everything arriving simultaneously gives the eye no order to
// read in, which is what makes a page feel abrupt rather than considered.
//
// A single timeline sequences it instead: the brand marks settle, the heading
// follows, then the call to action. Overlapping offsets (the negative
// positions) keep it flowing rather than feeling like four separate
// animations queued back to back — total is well under a second, so it reads
// as the page arriving, not as something the user has to wait through.
//
// Elements opt in with data-intro="<name>". Anything not marked simply
// renders normally, so adding markup to the page can never break the sequence
// or leave a new element stuck invisible.

export default function useIntroTimeline() {
    const scope = useRef(null);

    useGSAP(
        () => {
            const reduced = prefersReducedMotion();

            const pick = (name) => scope.current?.querySelectorAll(`[data-intro="${name}"]`);

            // gsap.from throughout: the resting DOM state is the finished
            // state, so a failure here leaves the page fully visible rather
            // than blank. Never gsap.to from opacity 0 on a landing page.
            const tl = gsap.timeline({
                defaults: {
                    ease: EASE.out,
                    duration: reduced ? DURATION.fast : DURATION.slow,
                },
            });

            const logos = pick("logos");
            const heading = pick("heading");
            const art = pick("art");
            const cta = pick("cta");
            const meta = pick("meta");

            if (logos?.length) {
                tl.from(logos, {
                    y: reduced ? 0 : -DISTANCE.md,
                    opacity: 0,
                    stagger: { amount: reduced ? 0 : 0.15 },
                });
            }

            if (heading?.length) {
                tl.from(
                    heading,
                    {
                        y: reduced ? 0 : DISTANCE.md,
                        opacity: 0,
                    },
                    reduced ? "<" : "-=0.3"
                );
            }

            if (art?.length) {
                tl.from(
                    art,
                    {
                        // Scale rather than travel: the illustration is large,
                        // and sliding something that size across the viewport
                        // is the kind of movement reduced-motion users report
                        // as uncomfortable.
                        scale: reduced ? 1 : 0.94,
                        opacity: 0,
                        duration: reduced ? DURATION.fast : DURATION.celebrate,
                    },
                    reduced ? "<" : "-=0.4"
                );
            }

            if (cta?.length) {
                tl.from(
                    cta,
                    {
                        y: reduced ? 0 : DISTANCE.md,
                        opacity: 0,
                        stagger: { amount: reduced ? 0 : 0.12 },
                    },
                    reduced ? "<" : "-=0.35"
                );
            }

            if (meta?.length) {
                tl.from(meta, { opacity: 0 }, reduced ? "<" : "-=0.25");
            }

            // Leaves no inline transforms behind, so the buttons' own
            // hover/press transforms aren't fighting a leftover matrix.
            tl.set([logos, heading, art, cta, meta], { clearProps: "transform" });
        },
        { scope }
    );

    return scope;
}
