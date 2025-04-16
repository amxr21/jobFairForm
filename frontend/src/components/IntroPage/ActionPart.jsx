import { useRef } from "react"
import Arrow from "../../assets/images/arrow.svg"



const ActionPart = () => {

    const inroCover = useRef()

    const hideCover = () => {
        inroCover.current.parentElement.parentElement.parentElement.parentElement.style.height = 0;
        inroCover.current.parentElement.parentElement.parentElement.parentElement.style.padding = 0;
    }




    return (
        <div ref={inroCover} className="flex items-center gap-x-4 mt-4 md:mt-10 z-50">
            <button onClick={hideCover} className="register-button w-full md:w-72 rounded-xl border p-2 md:text-xl">Regsiter Now ! سجل الان</button>
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