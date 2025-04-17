import PersonalInfoIcon from "../../assets/images/personal.svg"
import GridLeft from "../IntroPage/GridLeft";
import Progress from "./Progress";
import { useRef, useContext } from "react";


const ProgressSection = ({ status, missing }) => {

    const header = useRef()

    // console.log(header?.current?.textContent);


    console.log('mssing', missing);
    

    return (
        <div className="relative flex flex-col gap-4 md:gap-8 md:w-3/12 border py-6 px-8 md:py-10 md:px-12 min-h-[10rem] md:min-h-[28rem] h-fit md:h-full bg-[#2959A6] rounded-t-[2.75em] rounded-b-2xl md:rounded-l-[4em] md:rounded-r-3xl overflow-hidden">

            
            <GridLeft mark={false} otherClasses={'left-14 -top-20 left-[0%] md:left-0 md:top-14 h-full min-h-96 md:h-fit md:w-fit opacity-60 rotate-90 md:rotate-0'} />

            <div className="flex md:flex-col justify-between w-full ">
                <div className="text-white flex items-center justify-center icon min-w-14 md:min-w-16 md:w-16 min-h-14 md:min-h-16 md:h-16 border border-white rounded-2xl mb-4">
                    <img className="section-icon " src={PersonalInfoIcon} alt="" />
                </div>
                <h1 ref={header} className="section-header font-semibold text-white text-xl md:text-3xl  w-40 md:w-fit">
                    Personal Information
                </h1>
            </div>

            {
                !status && <div className="fixed md:top-0 md:left-0 top-1/4 left-10 right-10 md:relative border border-red-500 bg-red-200 py-2 px-3 rounded-md">
                                Fields are required: <span>{missing}</span>
                            </div>
            }
            
            <Progress secton={header.current} />



        </div>
    )
}

export default ProgressSection;