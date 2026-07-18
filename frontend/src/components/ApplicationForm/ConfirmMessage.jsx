import PropTypes from "prop-types";
import QRCode from 'qrcode.react';
import { CheckCircle2, Calendar, MapPin, Clock, Download } from "lucide-react";

// Post-submission ticket screen. Keeps the `.confirmMessageRef` hook + the
// h-0/opacity-0 -> revealed transition that Form.jsx's confirmRegistration()
// drives via classList, but with a redesigned, celebratory ticket layout.
const ConfirmMessageDiv = ({ confirmMessageRef, qrCodeSrc }) => {

    const downloadQr = () => {
        const canvas = document.querySelector(".ticket-qr canvas");
        if (!canvas) return;
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = "jobfair-ticket-qr.png";
        a.click();
    };

    return (
        <div
            ref={confirmMessageRef}
            className="confirmMessageRef flex flex-col p-0 rounded-3xl overflow-hidden h-0 opacity-0 transition-all duration-500"
        >
            <div className="relative bg-gradient-to-br from-[#0E7F41] to-[#0a5f31] rounded-3xl overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5" />
                <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-white/5" />

                <div className="relative flex flex-col md:flex-row items-stretch gap-6 md:gap-10 px-6 md:px-12 py-8 md:py-10">
                    {/* Left: confirmation message */}
                    <div className="flex flex-col justify-center text-white md:w-1/2">
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 shrink-0" strokeWidth={1.75} />
                            <h2 className="text-3xl md:text-5xl font-bold">You&apos;re all set!</h2>
                        </div>
                        <p className="text-white/85 text-sm md:text-base mb-5 max-w-md">
                            Your application is in. Bring your QR code ticket to the entrance on event day.
                        </p>
                        <div className="flex flex-col gap-2.5 text-sm md:text-base">
                            <div className="flex items-center gap-2.5">
                                <Calendar className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-white/70" />
                                <span>Tuesday, 22nd April 2025</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Clock className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-white/70" />
                                <span>10:00 AM – 02:00 PM</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <MapPin className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-white/70" />
                                <span>Building M11</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: ticket card with QR */}
                    <div className="relative bg-white rounded-2xl p-6 md:p-7 flex flex-col items-center gap-4 md:w-1/2">
                        {/* Perforation notch for the ticket-stub feel */}
                        <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0a5f31]" />

                        <div className="ticket-qr bg-white rounded-xl border border-gray-100 p-3">
                            {qrCodeSrc
                                ? <QRCode value={`${qrCodeSrc}`} size={168} fgColor="#0a5f31" includeMargin={false} />
                                : <div className="w-[168px] h-[168px] flex items-center justify-center text-gray-400 text-sm">Generating QR…</div>}
                        </div>

                        <p className="text-center text-xs md:text-sm text-gray-500 leading-snug">
                            Screenshot this QR code for entry and to share your profile with 70+ companies.
                        </p>

                        {qrCodeSrc && (
                            <button
                                onClick={downloadQr}
                                className="inline-flex items-center gap-2 text-sm font-medium text-[#0E7F41] hover:text-[#0a5f31] transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Download QR
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

ConfirmMessageDiv.propTypes = {
    confirmMessageRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
    qrCodeSrc: PropTypes.string,
};

export default ConfirmMessageDiv;
