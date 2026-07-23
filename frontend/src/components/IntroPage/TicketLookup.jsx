import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import QRCode from "qrcode.react";
import { X, Ticket, Search } from "lucide-react";

import { API_URL as link } from "../../config/api";

// A student who already applied can retrieve their ticket (QR + attendance
// status) by University ID instead of filling the whole form again. Modeled on
// the dashboard's MyQrCode page and its /applicants/lookup/:uniId endpoint.
const TicketLookup = ({ open, onClose }) => {
    const [uniId, setUniId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [applicant, setApplicant] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 50);
        if (!open) { setApplicant(null); setUniId(""); setError(""); }
    }, [open]);

    // Close on Escape.
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    const lookup = async () => {
        if (!uniId.trim() || loading) return;
        setLoading(true);
        setError("");
        setApplicant(null);
        try {
            const res = await axios.get(`${link}/applicants/lookup/${encodeURIComponent(uniId.trim())}`);
            setApplicant(res.data);
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setApplicant(null);
        setUniId("");
        setError("");
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[1000000] flex items-center justify-center p-4">
            <div className="absolute inset-0 backdrop-fade" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={onClose} />

            <div className="overlay-pop relative w-full max-w-xs sm:max-w-sm md:max-w-md bg-white dark:bg-[#131b2c] rounded-xl md:rounded-2xl shadow-2xl overflow-hidden">
                <button onClick={onClose} className="absolute top-2 right-2 md:top-3 md:right-3 z-10 text-white/80 hover:text-white transition-colors">
                    <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>

                {!applicant ? (
                    <>
                        <div className="bg-[#0E7F41] p-4 md:p-6 text-center">
                            <div className="w-11 h-11 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                                <Ticket className="w-5 h-5 md:w-7 md:h-7 text-[#0E7F41]" strokeWidth={1.75} />
                            </div>
                            <h1 className="text-white text-base md:text-lg font-bold">Check My Ticket</h1>
                            <p className="text-white/80 text-[11px] md:text-xs mt-1">Enter the University ID you applied with</p>
                        </div>
                        <div className="bg-white dark:bg-[#131b2c] p-4 md:p-6 flex flex-col gap-2.5 md:gap-3">
                            <input
                                ref={inputRef}
                                value={uniId}
                                onChange={(e) => { setUniId(e.target.value.replace(/\D/g, "").slice(0, 8)); setError(""); }}
                                onKeyDown={(e) => e.key === "Enter" && lookup()}
                                placeholder="e.g. 20211234"
                                inputMode="numeric"
                                className="bg-white dark:bg-[#1a2438] text-fg border-line border rounded-md px-3 md:px-4 py-2.5 md:py-3 text-center text-base md:text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#0E7F41]"
                            />
                            {error && <p className="text-xs text-red-500 text-center">{error}</p>}
                            <button
                                onClick={lookup}
                                disabled={loading || !uniId.trim()}
                                className="w-full py-2.5 md:py-3 bg-[#0E7F41] hover:bg-[#0a5f31] text-white font-semibold text-sm md:text-base rounded-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Search className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                {loading ? "Looking up…" : "Get My Ticket"}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-[#0E7F41] p-4 md:p-6 text-center">
                            <h1 className="text-white text-base md:text-lg font-bold">{applicant.fullName}</h1>
                            <p className="text-white/80 text-[11px] md:text-xs mt-1 font-mono">U{applicant.uniId}</p>
                        </div>
                        <div className="bg-white dark:bg-[#131b2c] p-4 md:p-6 flex flex-col items-center gap-3 md:gap-4">
                            <div className="bg-white border border-line rounded-md p-2.5 md:p-3">
                                <QRCode value={applicant.id} size={144} className="w-32 h-32 md:w-44 md:h-44" fgColor="#111827" />
                            </div>
                            <div className={`w-full text-center text-[11px] md:text-xs font-medium rounded-md px-2.5 md:px-3 py-1.5 md:py-2 ${applicant.attended ? "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300" : "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"}`}>
                                {applicant.attended ? "You’re checked in — see you there!" : "Show this QR code at the entrance to check in"}
                            </div>
                            <button onClick={reset} className="text-[11px] md:text-xs text-fg-faint hover:text-fg-muted">
                                Look up a different ID
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>,
        document.body
    );
};

TicketLookup.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
};

export default TicketLookup;
