import { useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import TicketLookup from "./TicketLookup"



const ActionPart = () => {

    const inroCover = useRef()
    const location = useLocation()
    const navigate = useNavigate()
    // Visiting /my-qr-code directly opens the ticket-lookup modal immediately,
    // instead of requiring the user to land on "/" and click the button —
    // lets the QR-code-lookup link be shared/bookmarked on its own.
    const [ticketOpen, setTicketOpen] = useState(location.pathname === "/my-qr-code")

    const hideCover = () => {
        inroCover.current.parentElement.parentElement.parentElement.parentElement.style.height = 0;
        inroCover.current.parentElement.parentElement.parentElement.parentElement.style.padding = 0;
    }




    return (
        <div ref={inroCover} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 mt-4 md:mt-10 z-50">
            <button onClick={hideCover} className="register-button w-full md:w-72 rounded-xl border bg-white text-[#0E7F41] font-semibold p-2 md:text-xl hover:bg-gray-50 transition-colors">Register Now !</button>
            <button onClick={() => setTicketOpen(true)} className="w-full md:w-auto rounded-xl border border-white/70 text-white p-2 px-5 md:text-lg hover:bg-white/10 transition-colors">Check My Ticket</button>
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