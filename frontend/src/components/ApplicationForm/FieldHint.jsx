import PropTypes from "prop-types";
import { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";

// A small (i) icon beside a field label. Hover (desktop) or tap (touch)
// reveals the hint in a tooltip. The tooltip is portaled to document.body and
// positioned from the icon's screen rect, so it isn't clipped by the step
// containers' overflow-hidden (the same clipping that affected the dropdowns).
const FieldHint = ({ text }) => {
    const [open, setOpen] = useState(false);
    const [rect, setRect] = useState(null);
    const iconRef = useRef(null);
    const hideTimer = useRef(null);

    useLayoutEffect(() => {
        if (open && iconRef.current) {
            const update = () => {
                if (iconRef.current) setRect(iconRef.current.getBoundingClientRect());
            };
            update();
            window.addEventListener("scroll", update, true);
            window.addEventListener("resize", update);
            return () => {
                window.removeEventListener("scroll", update, true);
                window.removeEventListener("resize", update);
            };
        }
        setRect(null);
    }, [open]);

    if (!text) return null;

    const show = () => {
        clearTimeout(hideTimer.current);
        setOpen(true);
    };
    const hide = () => {
        hideTimer.current = setTimeout(() => setOpen(false), 100);
    };

    return (
        <span className="inline-flex items-center align-middle -my-1.5 ml-0.5">
            <button
                ref={iconRef}
                type="button"
                aria-label="Field hint"
                onMouseEnter={show}
                onMouseLeave={hide}
                onFocus={show}
                onBlur={hide}
                onClick={(e) => { e.preventDefault(); open ? hide() : show(); }}
                className="p-1.5 text-fg-faint hover:text-[#0E7F41] transition-colors"
            >
                <Info className="w-3.5 h-3.5" />
            </button>
            {open && rect && createPortal(
                <span
                    role="tooltip"
                    onMouseEnter={show}
                    onMouseLeave={hide}
                    className="fixed z-[1000] -translate-x-1/2 -translate-y-full w-max max-w-[220px] rounded-md bg-gray-800 text-white text-[11px] leading-snug px-2 py-1 shadow-lg animate-in fade-in zoom-in-95 duration-150"
                    style={{ top: rect.top - 6, left: rect.left + rect.width / 2 }}
                >
                    {text}
                    <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800" />
                </span>,
                document.body
            )}
        </span>
    );
};

FieldHint.propTypes = {
    text: PropTypes.string,
};

export default FieldHint;
