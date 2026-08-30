import { useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowRight, Clock, QrCode } from "lucide-react"
import TicketLookup from "./TicketLookup"
import { gsap, prefersReducedMotion } from "../../lib/gsap"
import { DURATION, DISTANCE, EASE } from "../../lib/motionTokens"
import useTranslation from "../../hooks/useTranslation"



const ActionPart = () => {

    const t = useTranslation();
    const inroCover = useRef()
    const location = useLocation()
    const navigate = useNavigate()
    // Visiting /my-qr-code directly opens the ticket-lookup modal immediately,
    // instead of requiring the user to land on "/" and click the button —
    // lets the QR-code-lookup link be shared/bookmarked on its own.
    const [ticketOpen, setTicketOpen] = useState(location.pathname === "/my-qr-code")

    // Dismiss the landing page and reveal the form beneath it.
    //
    // Previously this walked four parentElements up from the button and set
    // height/padding to 0 — brittle (any wrapper added or removed silently
    // retargets it) and instant, so the transition from landing page to form
    // was a hard cut. Targets #intro by id and animates out instead.
    const hideCover = () => {
        const cover = document.getElementById("intro") || inroCover.current?.closest(".intro");
        if (!cover) return;

        if (prefersReducedMotion()) {
            cover.style.display = "none";
            return;
        }

        gsap.to(cover, {
            opacity: 0,
            // A slight lift reads as the page stepping aside rather than
            // simply vanishing.
            y: -DISTANCE.md,
            duration: DURATION.base,
            ease: EASE.in,
            // display:none rather than height:0 — the old approach left the
            // element in the layout at zero height with its padding removed,
            // which is a different thing from it being gone.
            onComplete: () => { cover.style.display = "none"; },
        });
    }




    return (
        <div ref={inroCover} className="flex flex-col gap-3 mt-4 md:mt-10 z-50 w-full md:w-auto">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
                {/* transition-[box-shadow,transform], not transition-all:
                    `all` includes opacity, so the CSS transition fought the
                    GSAP intro tween animating this button in — it appeared,
                    then CSS transitioned it back out of the state GSAP had
                    just set, and it sank and faded away. */}
                <button
                    onClick={hideCover}
                    data-intro="cta"
                    className="register-button group inline-flex items-center justify-center gap-2 w-full md:w-auto text-center px-5 md:px-8 rounded-xl border-2 border-white bg-white text-[#0E7F41] font-semibold p-2.5 md:text-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-[box-shadow,transform] duration-200"
                >
                    {t("nav.registerNow")}
                    {/* Forward-motion navigation icon — flips under RTL per
                        the bilingual skill's icon rules, same as the form's
                        own Back/Continue chevrons. */}
                    <ArrowRight className="w-5 h-5 transition-transform rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </button>
                <button
                    onClick={() => setTicketOpen(true)}
                    data-intro="cta"
                    className="inline-flex items-center justify-center gap-2 w-full md:w-auto text-center px-5 md:px-8 rounded-xl border border-white/70 text-white p-2.5 md:text-lg hover:bg-white/10 transition-colors"
                >
                    <QrCode className="w-5 h-5" />
                    {t("nav.checkMyTicket")}
                </button>
            </div>
            <p data-intro="meta" className="inline-flex items-center justify-center md:justify-start gap-1.5 text-white/70 text-xs md:text-sm">
                <Clock className="w-3.5 h-3.5" />
                {t("nav.takesMinutes")}
            </p>
            <TicketLookup
                open={ticketOpen}
                onClose={() => {
                    setTicketOpen(false);
                    if (location.pathname === "/my-qr-code") navigate("/");
                }}
            />
        </div>
    )
    // return (
    //     <div ref={inroCover} className="flex items-center gap-x-4 mt-4 md:mt-10">
    //         <div className="md:block hidden arrow">
    //             <img src={Arrow} alt="" />
    //         </div>
    //         <button onClick={hideCover} className="w-full md:w-72 rounded-xl border p-2 text-xl">Get Started 🚀</button>
    //     </div>
    // )
}

export default ActionPart;