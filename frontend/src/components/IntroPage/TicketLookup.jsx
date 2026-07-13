import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import QRCode from "qrcode.react";
import { X, Ticket, Search } from "lucide-react";

const link = import.meta.env.VITE_API_URL || "https://jobfairform-backend-production.up.railway.app";

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
            <div className="absolute inset-0 bg-black/50 animate-in fade-in duration-200" onClick={onClose} />

            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute top-3 right-3 z-10 text-white/80 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>

                {!applicant ? (
                    <>
                        <div className="bg-[#0E7F41] p-6 text-center">
                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                                <Ticket className="w-7 h-7 text-[#0E7F41]" strokeWidth={1.75} />
                            </div>
                            <h1 className="text-white text-lg font-bold">Check My Ticket</h1>
                            <p className="text-white/80 text-xs mt-1">Enter the University ID you applied with</p>
                        </div>
                        <div className="p-6 flex flex-col gap-3">
                            <input
                                ref={inputRef}
                                value={uniId}
                                onChange={(e) => { setUniId(e.target.value.replace(/\D/g, "").slice(0, 8)); setError(""); }}
                                onKeyDown={(e) => e.key === "Enter" && lookup()}
                                placeholder="e.g. 20211234"
                                inputMode="numeric"
                                className="border border-gray-200 rounded-md px-4 py-3 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#0E7F41]"
                            />
                            {error && <p className="text-xs text-red-500 text-center">{error}</p>}
                            <button
                                onClick={lookup}
                                disabled={loading || !uniId.trim()}
                                className="w-full py-3 bg-[#0E7F41] hover:bg-[#0a5f31] text-white font-semibold rounded-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Search className="w-4 h-4" />
                                {loading ? "Looking up…" : "Get My Ticket"}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-[#0E7F41] p-6 text-center">
                            <h1 className="text-white text-lg font-bold">{applicant.fullName}</h1>
                            <p className="text-white/80 text-xs mt-1 font-mono">U{applicant.uniId}</p>
                        </div>
                        <div className="p-6 flex flex-col items-center gap-4">
                            <div className="bg-white border border-gray-200 rounded-md p-3">
                                <QRCode value={applicant.id} size={176} fgColor="#111827" />
                            </div>
                            <div className={`w-full text-center text-xs font-medium rounded-md px-3 py-2 ${applicant.attended ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                                {applicant.attended ? "You're checked in — see you there!" : "Show this QR code at the entrance to check in"}
                            </div>
                            <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600">
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

export default TicketLookup;
