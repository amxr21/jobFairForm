import { useEffect, useLayoutEffect, useRef, useState } from "react";

// One-shot spotlight pointing at the dark-mode toggle, shown once per browser
// (localStorage-gated) so first-time visitors notice the new control without
// a full multi-step tour.
const SEEN_KEY = "theme_toggle_tour_seen_v1";

export default function ThemeTourHint() {
    const [show, setShow] = useState(() => {
        try { return localStorage.getItem(SEEN_KEY) !== "1"; } catch { return false; }
    });
    const [rect, setRect] = useState(null);
    const boxRef = useRef(null);

    useLayoutEffect(() => {
        if (!show) return;
        let raf;
        const tick = () => {
            const el = document.querySelector('[data-tour="theme-toggle"]');
            if (el) {
                const r = el.getBoundingClientRect();
                setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [show]);

    useEffect(() => {
        if (!show) return;
        const onKey = (e) => { if (e.key === "Escape") dismiss(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [show]);

    const dismiss = () => {
        try { localStorage.setItem(SEEN_KEY, "1"); } catch { /* quota */ }
        setShow(false);
    };

    if (!show) return null;

    const pad = 6;
    const hasSpot = rect && rect.width > 0;
    const boxTop = hasSpot ? rect.top + rect.height + 14 : 16;
    const boxLeft = hasSpot ? Math.max(16, Math.min(rect.left + rect.width / 2 - 130, window.innerWidth - 260 - 16)) : 16;

    return (
        <>
            <svg className="fixed inset-0 w-full h-full z-[999996] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <mask id="theme-tour-mask">
                        <rect width="100%" height="100%" fill="white" />
                        {hasSpot && (
                            <rect
                                x={rect.left - pad}
                                y={rect.top - pad}
                                width={rect.width + pad * 2}
                                height={rect.height + pad * 2}
                                rx="10"
                                fill="black"
                            />
                        )}
                    </mask>
                </defs>
                <rect width="100%" height="100%" fill="rgba(0,0,0,0.55)" mask="url(#theme-tour-mask)" />
                {hasSpot && (
                    <rect
                        x={rect.left - pad}
                        y={rect.top - pad}
                        width={rect.width + pad * 2}
                        height={rect.height + pad * 2}
                        rx="10"
                        fill="none"
                        stroke="#2959A6"
                        strokeWidth="2.5"
                    />
                )}
            </svg>

            <div className="fixed inset-0 z-[999997] cursor-pointer" onClick={dismiss} />

            <div
                ref={boxRef}
                onClick={(e) => e.stopPropagation()}
                className="fixed z-[999999] w-[260px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
                style={{ top: boxTop, left: boxLeft }}
            >
                <div className="px-4 pt-3 pb-2">
                    <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 mb-1 leading-snug">
                        Try dark mode
                    </p>
                    <p className="text-[12px] text-gray-600 dark:text-gray-300 leading-relaxed">
                        Tap this button anytime to switch between light and dark.
                    </p>
                </div>
                <div className="flex items-center justify-end px-4 py-2.5 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={dismiss}
                        className="text-[12px] px-4 py-1.5 rounded-lg bg-[#2959A6] hover:bg-[#1f4685] text-white transition-colors font-semibold"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </>
    );
}
