import { Loader2, Send } from "lucide-react";

// Full-screen overlay shown while the application is being submitted.
const LoadingPage = () => {
    return (
        <div id="LoadingPage" className="fixed inset-0 z-[99999999] flex items-center justify-center p-4 bg-surface-page/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-sm bg-surface-card rounded-3xl shadow-2xl border-line border overflow-hidden">
                {/* Green header band */}
                <div className="relative bg-gradient-to-br from-[#0E7F41] to-[#0a5f31] px-8 pt-10 pb-14 flex flex-col items-center overflow-hidden">
                    <div className="absolute -top-10 -right-8 w-40 h-40 rounded-full bg-white/5" />
                    <div className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-white/5" />

                    {/* Spinner ring with a paper-plane in the middle */}
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <Loader2 className="absolute inset-0 w-20 h-20 text-white/90 animate-spin" strokeWidth={1.5} />
                        <Send className="w-7 h-7 text-white" strokeWidth={1.75} />
                    </div>
                </div>

                {/* Text card overlapping the band */}
                <div className="px-8 -mt-8 pb-8">
                    <div className="bg-surface-card rounded-2xl shadow-md border-line border px-6 py-5 text-center">
                        <h2 className="text-xl font-semibold text-fg mb-1">Submitting your application…</h2>
                        <p className="text-sm text-fg-muted leading-snug">
                            Hang tight — we&apos;re securing your spot and generating your QR ticket.
                        </p>
                        {/* Indeterminate progress bar */}
                        <div className="mt-4 h-1.5 w-full bg-surface-hover rounded-full overflow-hidden">
                            <div className="h-full w-1/3 bg-[#0E7F41] rounded-full animate-[loadingslide_1.2s_ease-in-out_infinite]" />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes loadingslide {
                    0%   { transform: translateX(-120%); }
                    50%  { transform: translateX(120%); }
                    100% { transform: translateX(320%); }
                }
            `}</style>
        </div>
    );
};

export default LoadingPage;
