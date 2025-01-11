import PersonalInfoIcon from "../../assets/images/personal.svg"
import Progress from "./Progress";
import { useRef, useContext } from "react";


const ProgressSection = ({ status }) => {

    const header = useRef()

    console.log(header?.current?.textContent);



    return (
        <div className="flex flex-col gap-4 md:gap-8 md:w-3/12 border py-6 px-8 md:py-10 md:px-12 md:h-full bg-primary rounded-t-[2.75em] rounded-b-2xl md:rounded-l-[4em] md:rounded-r-3xl">
            <div className="flex md:flex-col justify-between w-full">
                <div className="text-white flex items-center justify-center icon min-w-14 md:min-w-16 md:w-16 min-h-14 md:min-h-16 md:h-16 border border-white rounded-2xl mb-4">
                    <img className="section-icon " src={PersonalInfoIcon} alt="" />
                </div>
                <h1 ref={header} className="section-header font-semibold text-white text-xl md:text-3xl  w-40 md:w-fit">
                    Personal Information
                </h1>
            </div>

            {
                !status && <div className="border border-red-500 py-2 px-3  rounded-md">
                                All fields are required
                            </div>
            }
            
            <Progress secton={header.current} />



        </div>
    )
}

export default ProgressSection;