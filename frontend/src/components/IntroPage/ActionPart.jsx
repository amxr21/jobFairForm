import { useRef, useState } from "react"
import Arrow from "../../assets/images/arrow.svg"
import TicketLookup from "./TicketLookup"



const ActionPart = () => {

    const inroCover = useRef()
    const [ticketOpen, setTicketOpen] = useState(false)

    const hideCover = () => {
        inroCover.current.parentElement.parentElement.parentElement.parentElement.style.height = 0;
        inroCover.current.parentElement.parentElement.parentElement.parentElement.style.padding = 0;
    }




    return (
        <div ref={inroCover} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 mt-4 md:mt-10 z-50">
            <button onClick={hideCover} className="register-button w-full md:w-72 rounded-xl border bg-white text-[#0E7F41] font-semibold p-2 md:text-xl hover:bg-gray-50 transition-colors">Register Now !</button>
            <button onClick={() => setTicketOpen(true)} className="w-full md:w-auto rounded-xl border border-white/70 text-white p-2 px-5 md:text-lg hover:bg-white/10 transition-colors">Check My Ticket</button>
            <TicketLookup open={ticketOpen} onClose={() => setTicketOpen(false)} />
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