import { GraduationCap } from "lucide-react";

// Full-screen submit overlay with a scripted sequence, driven by `phase`:
//   "loading" → three bouncing dots ("submitting…")
//   "success" → the dots' spot blooms into a graduation-cap badge that pops in
//   "fade"    → the whole overlay fades out to reveal the ticket beneath
// The parent (Form.jsx) advances the phase: loading while the request is in
// flight, then success once it resolves, then fade after a short beat.
// Pure CSS keyframes — no framer-motion, so it's safe on this app's React 17.
const AnimatedSuccess = ({ phase }) => {
  if (!phase || phase === "idle" || phase === "done") return null;

  const showDots = phase === "loading";
  const showCap = phase === "success" || phase === "fade";

  return (
    <div
      className={`fixed inset-0 z-[99999999] flex items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-500 ${phase === "fade" ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Stage: the badge circle everything happens inside */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Green ring that draws in on success */}
          <div
            className={`absolute inset-0 rounded-full border-4 transition-all duration-500 ${
              showCap ? "border-[#0E7F41] scale-100 opacity-100" : "border-[#0E7F41]/0 scale-75 opacity-0"
            }`}
          />
          <div
            className={`absolute inset-0 rounded-full bg-[#0E7F41]/10 transition-all duration-500 ${
              showCap ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          />

          {/* Three bouncing dots (loading) */}
          {showDots && (
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-3.5 h-3.5 rounded-full bg-[#0E7F41]"
                  style={{ animation: `sd-bounce 0.6s ease-in-out ${i * 0.15}s infinite` }}
                />
              ))}
            </div>
          )}

          {/* Graduation cap (success) — scales/pops in */}
          {showCap && (
            <GraduationCap
              className="relative text-[#0E7F41]"
              style={{ width: 56, height: 56, animation: "sd-pop 0.55s cubic-bezier(0.34,1.56,0.64,1) both" }}
              strokeWidth={1.75}
            />
          )}
        </div>

        {/* Caption */}
        <div className="text-center h-10">
          {showDots && (
            <p className="text-lg font-semibold text-gray-700" style={{ animation: "sd-fade 0.3s ease both" }}>
              Submitting your application…
            </p>
          )}
          {showCap && (
            <p className="text-lg font-semibold text-[#0E7F41]" style={{ animation: "sd-fade 0.4s ease 0.15s both" }}>
              You're all set!
            </p>
          )}
        </div>
      </div>

      {/* Local keyframes */}
      <style>{`
        @keyframes sd-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50%      { transform: translateY(-10px); opacity: 1; }
        }
        @keyframes sd-pop {
          0%   { transform: scale(0.2); opacity: 0; }
          60%  { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes sd-fade {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes sd-bounce { 0%,100% { transform: none; opacity: 1; } }
          @keyframes sd-pop { from,to { transform: none; opacity: 1; } }
        }
      `}</style>
    </div>
  );
};

export default AnimatedSuccess;
