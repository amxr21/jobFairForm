import { useLayoutEffect, useState } from "react";

// Custom dropdown panels in this app render inline `position: absolute`,
// which gets clipped by the step containers' `overflow-hidden` (needed for
// the step-slide transition) whenever the panel would overflow the
// container's edge. Portaling the panel to document.body sidesteps that
// clipping — this hook tracks the trigger element's screen position so the
// portaled panel can be placed under it, and repositions on scroll/resize
// like a native dropdown would.
//
// On mobile it also has to cope with the on-screen keyboard.
// getBoundingClientRect() reports layout-viewport coordinates, which do not
// change when the keyboard opens, so a panel anchored below a trigger in the
// lower half of the form rendered *underneath the keyboard* — the options
// were being filtered correctly, they just weren't on screen. window
// .visualViewport is the only API that knows the keyboard exists, so the
// available space is measured against it, and the panel flips above the
// trigger when there isn't room below.

const MARGIN = 8; // gap kept between the panel and the viewport edges

export default function useDropdownPosition(triggerRef, isOpen, options = {}) {
    const { panelWidth, estimatedHeight = 192 } = options;
    const [position, setPosition] = useState(null);

    useLayoutEffect(() => {
        if (!isOpen || !triggerRef.current) {
            setPosition(null);
            return;
        }

        const updatePosition = () => {
            const el = triggerRef.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const vv = window.visualViewport;

            // Visible region in layout-viewport coordinates. With a keyboard
            // open, visualViewport.height shrinks and offsetTop grows, so
            // these bounds describe what the user can actually see.
            const viewTop = vv ? vv.offsetTop : 0;
            const viewLeft = vv ? vv.offsetLeft : 0;
            const viewHeight = vv ? vv.height : window.innerHeight;
            const viewWidth = vv ? vv.width : window.innerWidth;
            const viewBottom = viewTop + viewHeight;

            const spaceBelow = viewBottom - rect.bottom - MARGIN;
            const spaceAbove = rect.top - viewTop - MARGIN;

            // Prefer below (the familiar direction) and only flip when below
            // genuinely can't fit the panel but above can do better.
            const flipUp = spaceBelow < Math.min(estimatedHeight, 140) && spaceAbove > spaceBelow;

            const width = panelWidth ?? rect.width;
            const maxLeft = viewLeft + viewWidth - width - MARGIN;
            const left = Math.max(viewLeft + MARGIN, Math.min(rect.left, maxLeft));

            // Cap the panel so it never runs past the visible area; the panel
            // itself scrolls internally when its content is taller.
            const maxHeight = Math.max(
                120,
                Math.min(estimatedHeight, flipUp ? spaceAbove : spaceBelow)
            );

            setPosition({
                top: flipUp ? undefined : rect.bottom + 4,
                bottom: flipUp ? viewHeight + viewTop - rect.top + 4 : undefined,
                left,
                width,
                maxHeight,
                flipUp,
                // Kept so callers that positioned off the raw rect still work.
                triggerWidth: rect.width,
            });
        };

        updatePosition();

        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);
        // The keyboard opening fires visualViewport resize/scroll but not
        // necessarily a window resize, so subscribe to both.
        const vv = window.visualViewport;
        vv?.addEventListener("resize", updatePosition);
        vv?.addEventListener("scroll", updatePosition);

        return () => {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
            vv?.removeEventListener("resize", updatePosition);
            vv?.removeEventListener("scroll", updatePosition);
        };
    }, [isOpen, triggerRef, panelWidth, estimatedHeight]);

    return position;
}
