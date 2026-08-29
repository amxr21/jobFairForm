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
//
// SAFETY: this hook hides things in order to animate them in, so any failure
// mid-setup can strand an element at opacity 0 — present and clickable but
// invisible, which is worse than no animation. Everything below is wrapped so
// that an error restores visibility rather than leaving the page broken.

export default function useIntroTimeline() {
    const scope = useRef(null);

    useGSAP(
        () => {
            const reduced = prefersReducedMotion();
            const pick = (name) => scope.current?.querySelectorAll(`[data-intro="${name}"]`);

            const logos = pick("logos");
            const heading = pick("heading");
            const art = pick("art");
            const cta = pick("cta");
            const meta = pick("meta");

            // Flattened to a plain array of nodes, dropping any group that
            // matched nothing. Passing GSAP an array that contains NodeLists
            // AND undefined entries is what broke this before: it could not
            // resolve the targets, threw partway through, and left whatever it
            // had already set to opacity 0 stuck there — the Register button
            // was invisible but still clickable.
            const all = [logos, heading, art, cta, meta]
                .filter((nodes) => nodes && nodes.length)
                .flatMap((nodes) => Array.from(nodes));

            if (!all.length) return;

            // If anything below fails, make certain nothing stays hidden. An
            // intro that fails should show the page, never conceal it.
            const restore = () => gsap.set(all, { clearProps: "opacity,transform" });

            try {
                // gsap.from throughout: the resting DOM state is the finished
                // state, so content is visible if these tweens never run.
                // Never gsap.to from opacity 0 on a landing page.
                const tl = gsap.timeline({
                    defaults: {
                        ease: EASE.out,
                        duration: reduced ? DURATION.fast : DURATION.slow,
                    },
                    onInterrupt: restore,
                });

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
                        { y: reduced ? 0 : DISTANCE.md, opacity: 0 },
                        reduced ? "<" : "-=0.3"
                    );
                }

                if (art?.length) {
                    tl.from(
                        art,
                        {
                            // Scale rather than travel: the illustration is
                            // large, and sliding something that size across the
                            // viewport is the movement reduced-motion users
                            // report as uncomfortable.
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

                // Clear the inline transform GSAP leaves behind, so the
                // buttons' own hover transforms aren't fighting a leftover
                // matrix.
                //
                // This has to be done WITHOUT going through the CSS
                // transition: several of these elements declare a transition
                // that includes `transform`, so removing the inline style
                // makes CSS animate from the tween's final value back to the
                // resting one — the button visibly sank and faded out
                // immediately after arriving.
                //
                // Suppressing transitions for one frame lets the cleanup land
                // instantly, after which normal hover behaviour resumes.
                tl.call(() => {
                    const previous = all.map((el) => el.style.transition);
                    all.forEach((el) => { el.style.transition = "none"; });

                    gsap.set(all, { clearProps: "transform" });

                    // Force a reflow so the transition:none is applied before
                    // it is removed again; without this the browser can batch
                    // both changes and the suppression never takes effect.
                    void all[0].offsetHeight;

                    all.forEach((el, i) => { el.style.transition = previous[i] || ""; });
                });
            } catch (err) {
                console.error("Intro animation failed; showing the page unanimated.", err);
                restore();
            }
        },
        { scope }
    );

    return scope;
}
