import { useLayoutEffect, useState } from "react";

// Custom dropdown panels in this app render inline `position: absolute`,
// which gets clipped by the step containers' `overflow-hidden` (needed for
// the step-slide transition) whenever the panel would overflow the
// container's edge. Portaling the panel to document.body sidesteps that
// clipping — this hook tracks the trigger element's screen position so the
// portaled panel can be placed under it, and closes/repositions on
// scroll/resize like a native dropdown would.
export default function useDropdownPosition(triggerRef, isOpen) {
    const [rect, setRect] = useState(null);

    useLayoutEffect(() => {
        if (!isOpen || !triggerRef.current) {
            setRect(null);
            return;
        }

        const updateRect = () => {
            if (triggerRef.current) {
                setRect(triggerRef.current.getBoundingClientRect());
            }
        };

        updateRect();
        window.addEventListener("scroll", updateRect, true);
        window.addEventListener("resize", updateRect);
        return () => {
            window.removeEventListener("scroll", updateRect, true);
            window.removeEventListener("resize", updateRect);
        };
    }, [isOpen, triggerRef]);

    return rect;
}
