import useLocaleContext from "../hooks/useLocaleContext";

// Covers the moment a locale switch takes effect.
//
// Flipping `dir` on <html> re-lays-out the entire page in one frame — every
// flex row and logical margin/padding pair mirrors, every label swaps
// script, all at once. With no transition that reads as a jump cut.
// LocaleContext already times the actual state flip to happen at the
// midpoint of isTransitioning being true (see COVER_MS there); this
// component only needs to render the cover itself opaque for that whole
// window and let CSS fade it in and out at the edges.
//
// CSS transition, not GSAP: the two states here are just opacity 0/1 on
// mount/unmount, which `transition-opacity` + Tailwind's built-in
// animate-in/out utilities already do without pulling GSAP into a component
// that's rendered (even if briefly) on every locale switch.
export default function LocaleTransitionOverlay() {
    const { isTransitioning } = useLocaleContext();

    if (!isTransitioning) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-[999996] bg-surface-page/70 backdrop-blur-[2px] flex items-center justify-center pointer-events-none animate-in fade-in duration-150"
        >
            <span className="sr-only">Switching language…</span>
            <div
                aria-hidden="true"
                className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin motion-reduce:animate-none"
            />
        </div>
    );
}
